# NM District 1

Premium event discovery and pass-booking front-end concept built exclusively for Narsee Monjee College of Commerce and Economics (NM College).

## Experience Highlights

- Dark-first luxury visual system with optional light mode
- Cinematic hero moments with premium glassmorphism and layered gradients
- Animated counters, reveal transitions, custom cursor glow, and rich hover states
- Dedicated explore flow with advanced filtering, sorting, and grid/list toggle
- Deep event details with sticky booking panel, ticket types, countdown, wishlist, share, and calendar export
- Multi-step booking checkout with payment step, confetti success state, and QR pass card
- Student dashboard with upcoming/past events, saved events, rewards, payment history, and ticket downloads
- Clubs and committees directory with dedicated profile views
- Organizer admin studio with event creation, attendee operations, QR check-in simulation, inventory control, analytics, and CSV export

## Pages Included

- `index.html` - Immersive homepage
- `explore.html` - Event discovery and filter experience
- `event.html` - Event details and sticky booking side panel
- `booking.html` - Multi-step premium booking flow
- `dashboard.html` - Student dashboard
- `clubs.html` - Clubs and committees directory
- `club.html` - Club profile page
- `admin.html` - Organizer/admin operations workspace

## Shared Assets

- `assets/css/style.css` - Premium UI system, themes, animations, layouts
- `assets/js/data.js` - Rich NM-specific mock data
- `assets/js/main.js` - Global interactions (theme, reveal, counters, save state)
- `assets/js/explore.js` - Discovery filtering and sorting logic
- `assets/js/event.js` - Event page rendering + booking panel actions
- `assets/js/booking.js` - Multi-step checkout + QR ticket generation
- `assets/js/dashboard.js` - Dashboard state rendering
- `assets/js/clubs.js` - Club directory search/sort
- `assets/js/club.js` - Club profile rendering
- `assets/js/admin.js` - Organizer tools and operations

## Run Locally

No build step is required.

1. Open the project in VS Code.
2. Launch `index.html` with a static server (for example, Live Server extension).
3. Navigate through the full product flow via the top floating nav.

## Notes

- Data is mock/demo data persisted via `localStorage` for saved events, bookings, and organizer actions.
- External image/video sources are used to create the immersive visual feel.