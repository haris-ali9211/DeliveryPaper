export interface RouteMeta {
  GS?: string;
  Bezirk?: string;
  Tour?: string;
  Ablage?: string;
  EDAT?: string;
  pickup?: string;
  [key: string]: unknown;
}

export interface RawDeliveryEntry {
  street: string;
  houseNumber: string;
  customer: string;
  newspaper: string;
  newspaperFullName?: string;
  count: number;
  days: string[];
  deliveryNoteGerman?: string;
  deliveryNoteEnglish?: string;
  [key: string]: unknown;
}

export interface RawRouteData {
  route: RouteMeta;
  entries: RawDeliveryEntry[];
}

export interface DeliveryPublication {
  newspaper: string;
  newspaperFullName?: string;
  count: number;
  days: string[];
}

export interface DeliveryStop {
  id: string;
  stopNumber: number; // 1-indexed display order
  originalIndices: number[]; // indices in raw data
  street: string;
  houseNumber: string;
  customer: string;
  publications: DeliveryPublication[];
  deliveryNoteGerman?: string;
  deliveryNoteEnglish?: string;
}
