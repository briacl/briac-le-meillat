# briac-le-meillat

A modern React Single Page Application (SPA) for healthcare coordination.
Migrated from Laravel + Inertia.js to standalone React + Vite.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

Install dependencies:

```bash
npm install --legacy-peer-deps
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

Build for production:

```bash
npm run build
```

## Structure

- `src/` - React source code
  - `Components/` - Reusable UI components
  - `Layouts/` - Page layouts
  - `Pages/` - Application pages
  - `css/` - Global styles and Tailwind directives
- `public/` - Static assets
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Tech Stack

- React
- React Router DOM
- Vite
- Tailwind CSS v3
- HeroUI (NextUI)
