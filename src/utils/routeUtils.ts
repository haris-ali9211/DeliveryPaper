import type { RawRouteData, RawDeliveryEntry, DeliveryStop, DeliveryPublication } from '../types/route';

/**
 * Validates arbitrary input parsed from JSON to ensure it satisfies RawRouteData.
 */
export function validateRouteJson(data: unknown): { valid: true; data: RawRouteData } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'JSON must be an object with route metadata and entries array.' };
  }

  const obj = data as Record<string, unknown>;

  if (!obj.entries || !Array.isArray(obj.entries)) {
    return { valid: false, error: "Missing required 'entries' array in JSON root." };
  }

  if (obj.entries.length === 0) {
    return { valid: false, error: "The 'entries' array is empty. At least one delivery stop is required." };
  }

  // Validate each entry
  for (let i = 0; i < obj.entries.length; i++) {
    const entry = obj.entries[i];
    if (!entry || typeof entry !== 'object') {
      return { valid: false, error: `Entry #${i + 1} is invalid (must be an object).` };
    }

    const e = entry as Partial<RawDeliveryEntry>;
    if (!e.street || typeof e.street !== 'string') {
      return { valid: false, error: `Entry #${i + 1} is missing a valid 'street' name.` };
    }
    if (e.houseNumber === undefined || e.houseNumber === null || typeof e.houseNumber !== 'string') {
      return { valid: false, error: `Entry #${i + 1} (${e.street}) is missing a valid 'houseNumber'.` };
    }
    if (!e.customer || typeof e.customer !== 'string') {
      return { valid: false, error: `Entry #${i + 1} (${e.street} ${e.houseNumber}) is missing 'customer'.` };
    }
    if (!e.newspaper || typeof e.newspaper !== 'string') {
      return { valid: false, error: `Entry #${i + 1} (${e.street} ${e.houseNumber}) is missing 'newspaper' code.` };
    }
  }

  const routeMeta = (obj.route && typeof obj.route === 'object') ? obj.route : {};

  return {
    valid: true,
    data: {
      route: routeMeta as RawRouteData['route'],
      entries: obj.entries as RawDeliveryEntry[],
    }
  };
}

/**
 * Normalizes strings for matching addresses & customer
 */
function normalizeKey(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Transforms raw route data entries into physical delivery stops.
 * When groupSameAddressAndCustomer is true, consecutive entries with the same
 * street, houseNumber, and customer are combined into a single DeliveryStop.
 */
export function buildDeliveryStops(
  raw: RawRouteData,
  groupSameAddressAndCustomer: boolean = true
): DeliveryStop[] {
  const stops: DeliveryStop[] = [];
  const entries = raw.entries || [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const pub: DeliveryPublication = {
      newspaper: entry.newspaper,
      newspaperFullName: entry.newspaperFullName,
      count: typeof entry.count === 'number' ? entry.count : 1,
      days: Array.isArray(entry.days) ? entry.days : [],
    };

    if (groupSameAddressAndCustomer && stops.length > 0) {
      const prevStop = stops[stops.length - 1];
      const sameStreet = normalizeKey(prevStop.street) === normalizeKey(entry.street);
      const sameHouse = normalizeKey(prevStop.houseNumber) === normalizeKey(entry.houseNumber);
      const sameCust = normalizeKey(prevStop.customer) === normalizeKey(entry.customer);

      if (sameStreet && sameHouse && sameCust) {
        // Group with previous stop
        prevStop.publications.push(pub);
        prevStop.originalIndices.push(i);

        // Merge notes if new one has one and previous didn't or was different
        if (entry.deliveryNoteGerman && (!prevStop.deliveryNoteGerman || !prevStop.deliveryNoteGerman.includes(entry.deliveryNoteGerman))) {
          prevStop.deliveryNoteGerman = prevStop.deliveryNoteGerman
            ? `${prevStop.deliveryNoteGerman} · ${entry.deliveryNoteGerman}`
            : entry.deliveryNoteGerman;
        }
        if (entry.deliveryNoteEnglish && (!prevStop.deliveryNoteEnglish || !prevStop.deliveryNoteEnglish.includes(entry.deliveryNoteEnglish))) {
          prevStop.deliveryNoteEnglish = prevStop.deliveryNoteEnglish
            ? `${prevStop.deliveryNoteEnglish} · ${entry.deliveryNoteEnglish}`
            : entry.deliveryNoteEnglish;
        }
        continue;
      }
    }

    // Create a new stop
    stops.push({
      id: `stop-${stops.length + 1}-${i}`,
      stopNumber: stops.length + 1,
      originalIndices: [i],
      street: entry.street.trim(),
      houseNumber: entry.houseNumber.trim(),
      customer: entry.customer.trim(),
      publications: [pub],
      deliveryNoteGerman: entry.deliveryNoteGerman?.trim(),
      deliveryNoteEnglish: entry.deliveryNoteEnglish?.trim(),
    });
  }

  // Ensure stop numbers are sequential 1..N
  stops.forEach((s, idx) => {
    s.stopNumber = idx + 1;
  });

  return stops;
}

/**
 * Checks if the upcoming stop moves onto a different street.
 */
export function checkNextStreetTransition(
  stops: DeliveryStop[],
  currentIndex: number
): string | null {
  if (currentIndex < 0 || currentIndex >= stops.length - 1) {
    return null;
  }
  const currentStreet = stops[currentIndex].street.trim();
  const nextStreet = stops[currentIndex + 1].street.trim();

  if (normalizeKey(currentStreet) !== normalizeKey(nextStreet)) {
    return nextStreet;
  }
  return null;
}

/**
 * Computes newspaper counts and statistics across the route.
 */
export function calculateRouteStats(stops: DeliveryStop[]) {
  const paperCounts: Record<string, { count: number; fullName?: string }> = {};
  let totalCopies = 0;

  for (const stop of stops) {
    for (const pub of stop.publications) {
      const code = pub.newspaper;
      totalCopies += pub.count;
      if (!paperCounts[code]) {
        paperCounts[code] = { count: 0, fullName: pub.newspaperFullName };
      }
      paperCounts[code].count += pub.count;
    }
  }

  return {
    totalStops: stops.length,
    totalCopies,
    paperCounts,
  };
}
