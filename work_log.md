# Semester Mentor Frontend Work Log

## Step 1: Landing Page
- Fetched and analyzed the Landing Page design from Stitch project (ID: 3096963860990737353).
- Configured Tailwind CSS v4 theme variables in `frontend/src/index.css` with colors, typography, and spacing from the design system.
- Installed necessary dependencies: `react-router-dom`, `axios`, `zustand`, and `lucide-react`.
- Set up basic routing shell in `frontend/src/App.jsx`.
- Created `MarketingNavBar.jsx` component for public top navigation.
- Created `Footer.jsx` component for the public footer.
- Converted the raw HTML design into the main `LandingPage.jsx` layout, ensuring all Tailwind utility classes mapped perfectly to the new theme.
- Added `themeStore.js` using Zustand to manage global light/dark mode state.
- Updated `App.jsx` to dynamically apply `.dark` or `.light` class to the HTML root based on store state.
- Added a dark mode toggle button (Sun/Moon icon) next to the login/register buttons in `MarketingNavBar.jsx`.

## Step 2: Login Page (Desktop)
- Fetched and analyzed the Login Page design from Stitch.
- Created `authStore.js` using Zustand to manage global authentication state (`user`, `isAuthenticated`).
- Converted raw HTML design into `LoginPage.jsx` React component.
- Implemented responsive state management for Email/Password fields.
- Replaced Material UI icons with identical Lucide-react equivalents (`Mail`, `Lock`).
- Added simulated Axios login flow (with try/catch and loading states) to seamlessly integrate API and Zustand.
- Updated `App.jsx` routing to include `/login` as the new `LoginPage` component and a placeholder for `/dashboard`.

## Step 3: Onboarding Page (Desktop)
- Fetched and analyzed the Onboarding Page (Register Step 1) design from Stitch.
- Converted raw HTML design into `OnboardingPage.jsx` React component.
- Built a controlled multi-step form spanning Step 1 (Account), Step 2 (Academic Details), and Step 3 (Study Goals).
- Added `step` state with dynamic rendering for each phase of registration, including back buttons for Steps 2 & 3.
- Programmed dynamic progress bar `width` based on the current step.
- Replaced Material UI icon with `ArrowRight` from `lucide-react`.
- Hooked the component up to `authStore.js` to automatically log the user in and redirect to the dashboard upon finishing step 3.
- Updated `/register` route in `App.jsx` to render the new `OnboardingPage` component.

## Global Fixes
- Refactored `MarketingNavBar.jsx` into a global `TopNavBar.jsx` component rendered at the root (`App.jsx`). 
- This ensures the `ThemeToggle` sits perfectly in a consistent, flex-aligned top-right container across all pages, shifting naturally alongside other buttons (like Login/Register on the landing page) while remaining in place on Auth pages.
- Fixed the Dark Mode bug: The UI wasn't changing because the original Stitch design lacked a dark palette. I explicitly defined the complete `.dark` mode CSS variable overrides for the Material Design palette in `index.css`. Toggling the theme now seamlessly inverts the entire UI.

## Step 4: Dashboard (Desktop)
- Fetched and downloaded the Dashboard (Desktop) HTML from Stitch MCP.
- Architected a robust component hierarchy by creating `src/layouts/DashboardLayout.jsx` and `src/components/SideNavBar.jsx`. 
- Modified the global `TopNavBar.jsx` to dynamically adapt to the Dashboard context (adding search bar, notification/help icons, and user avatar) and aligning it smoothly with the sidebar, while maintaining the fixed Theme Toggle.
- Created `DashboardPage.jsx` transforming the raw design into functional React code using Lucide icons (`FileText`, `Calendar`, etc).
- Connected the Dashboard header with `useAuthStore` to dynamically fetch and display the logged-in user's name.
- Updated `App.jsx` to route `/dashboard` to `DashboardPage`.

## Step 5: General Mentor Chat
- Fetched and analyzed the General Mentor (Empty Chat) design from Stitch.
- Dynamically updated `DashboardLayout.jsx` to conditionally remove padding and handle full-height overflow when navigating to the chat route.
- Created `MentorChatPage.jsx` replicating the chat interface using `lucide-react` icons (GraduationCap, Clock, FileText, Paperclip, ArrowUp).
- Ensured the absolute positioned bottom chat input stretches correctly without breaking the sidebar.
- Added `/chats` route in `App.jsx` wrapped inside `DashboardLayout`.
- `SideNavBar.jsx` successfully sets "Chats" as active when the route matches.

## Step 6: Subject Workspace
- Fetched and analyzed the Subject Workspace HTML design from Stitch.
- Extracted the main workspace area containing Curriculum Progress, Modules, and the 3 right-column widgets (Quick Resources, Recent Notes, Latest PYQs).
- Converted Tailwind classes to standard app variables (e.g., mapped custom `brand-500` to `primary` and `brand-50` to `primary-container/20`).
- Created `SubjectWorkspacePage.jsx` wrapped inside `DashboardLayout` for a seamless sidebar integration.
- Wired the new page into `App.jsx` under the `/subjects` route.

## Step 7: Subject Workspace - Notes
- Fetched and analyzed the "Subject Workspace - Notes" HTML design from Stitch.
- Extracted the main Overview area into a new component `SubjectOverviewTab.jsx`.
- Converted the "Notes" tab layout into `SubjectNotesTab.jsx`, utilizing `lucide-react` icons and our existing Tailwind theme variables.
- Refactored `SubjectWorkspacePage.jsx` to introduce state-driven tab switching (`activeTab`), cleanly decoupling the page shell from its sub-content. Clicking on the "Notes" tab now renders the new note UI.

## Step 8 & 9: Subject Workspace - Resources & PYQs
- Fetched HTML designs for both the Resources and PYQs screens simultaneously.
- Created `SubjectResourcesTab.jsx` to house the resources table (with standard document type icons: PDF, Link, Word).
- Created `SubjectPyqsTab.jsx` to handle past year papers, including a dedicated search/filter bar and list interface.
- Wired both new components into `SubjectWorkspacePage.jsx`. All four tabs (Topics, Resources, Notes, PYQs) are now fully functional and match the Stitch designs seamlessly.
