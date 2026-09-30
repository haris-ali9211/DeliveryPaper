# ZeitungExpress · Newspaper Delivery Route App

A mobile-first, high-contrast, fully responsive web application built for newspaper delivery couriers walking or cycling through their daily delivery routes.

---

## 🌟 Key Features

1. **Instant Clarity & 1-Second Recognition**
   - **Address**: Dominant, bold typography for outdoor glanceability.
   - **Customer**: Clean, legible customer name display.
   - **Newspapers**: Visually striking publication short codes (e.g. `BI-MW`, `WE`, `WESO`, `FAZ a. So.`), with full publication names, copy counts, and delivery schedules.
   - **Multi-Paper Consolidation**: Automatically groups multiple newspapers for the same address & customer into a single physical stop so the courier delivers everything in one stop.

2. **Unmissable Delivery Instructions (DE / EN)**
   - Noticeable warning card with amber border and icon.
   - German instructions (`deliveryNoteGerman`) displayed first.
   - English translation (`deliveryNoteEnglish`) clearly displayed below.
   - Cleanly hidden when no delivery note exists.

3. **Orientation & Mental Prep (Previous & Next Stops)**
   - **Previous Stop**: Bottom-left (or left panel on desktop) with muted/passed styling for immediate orientation.
   - **Upcoming Stops**: Bottom-right (or right panel on desktop) displaying the next 2 upcoming stops with visual hierarchy.
   - **Street Transition Indicator**: Displays subtle `Next: <Street Name>` alerts whenever the upcoming stop moves onto a new street.

4. **Fast, Frictionless Navigation**
   - **Dominant NEXT Action**: Oversized thumb-friendly green button for primary delivery flow.
   - **Touch Gestures**: Full mobile touch-swipe support (Swipe Left → Next, Swipe Right → Prev).
   - **Keyboard Shortcuts**: Right Arrow / Spacebar for Next, Left Arrow for Previous.
   - **Haptic Vibration**: Gentle mobile vibration feedback on stop completion (can be toggled in Preferences).

5. **Route Overview & Quick Jump**
   - Click **View Route** to open an interactive drawer/modal of all stops.
   - Filter stops in real time by street, customer name, or newspaper code.
   - Jump directly to any stop.
   - **Route Statistics Tab**: Total stops, total copies distributed, and an inventory breakdown by publication code.

6. **Persistent State & Resumption**
   - Saves route data, current stop position, completed stops, and theme preference to `localStorage`.
   - When reopening or refreshing the page, prompts: `Continue from stop X of Y` or allows restarting from stop 1.

7. **Theme & Outdoor Readability**
   - **High-Contrast Dark Mode**: Designed specifically for pre-dawn deliveries (deep slate/black, high contrast, non-glaring).
   - **Crisp Light Mode**: High legibility for daytime delivery.
   - Automatically matches system preference with manual toggle.

8. **Flexible JSON Input**
   - Drag-and-drop `.json` file upload or file picker.
   - Direct JSON text area pasting with validation and error reporting.
   - 1-click **Load Sample Tour 1510 (51 Deliveries)** pre-loaded.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your mobile browser or desktop.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠 Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations / FX**: Canvas Confetti for route completion
