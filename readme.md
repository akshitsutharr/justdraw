# Just Draw

A feature-rich collaborative drawing application built with Next.js and modern web technologies. Create, edit, and share drawings in real-time with an intuitive interface and powerful drawing tools.

## Features

### Drawing Tools

- **Shape Tools**: Rectangle, Circle, Diamond, Line, Arrow
- **Freehand Drawing**: Smooth pencil tool for sketching
- **Text Tool**: Add and edit text with customizable styles
- **Image Support**: Import and manipulate images
- **Connectors**: Create flowcharts with smart connectors
- **Selection Tool**: Select, move, and modify multiple elements

### Styling Options

- Customizable stroke colors and widths
- Fill colors with opacity control
- Different stroke styles (solid, dashed, dotted)
- Text formatting (font, size, alignment, etc.)
- Layer management (move forward/backward)

### Canvas Controls

- Pan and zoom navigation
- Undo/redo functionality
- Keyboard shortcuts for common actions
- Grid and snap alignment
- Canvas reset and clear

### Collaboration Features

- Real-time sharing via unique URLs
- Export drawings as PNG or SVG
- Save drawings locally
- Template library for quick starts

### User Interface

- Clean, minimal design
- Responsive layout for all devices
- Dark/light theme support
- Customizable toolbar
- Context-sensitive panels
- Floating property panels

## Technical Details

### Architecture

- Client-side rendering for optimal performance
- Component-based architecture using React
- Custom hooks for business logic
- Utility-first CSS with Tailwind
- TypeScript for type safety

### Key Components

```tsx
// Main application wrapper
<WhiteboardApp>
  <Toolbar /> // Tool selection and actions
  <StylePanel /> // Element styling controls
  <Canvas /> // Main drawing area
  <TextPanel /> // Text editing interface
  <ZoomControls /> // Canvas navigation
</WhiteboardApp>
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Lucide Icons](https://lucide.dev/) - Icon library
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/akshit-draw.git
   cd justdraw
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/               # Next.js app directory
├── globals.css   # Global styles
├── layout.tsx    # Root layout
├── page.tsx      # Home page
└── draw/         # Drawing feature pages
components/       # React components
├── canvas.tsx    # Drawing canvas
├── library-panel.tsx
├── ShareModal.tsx
└── ui/           # UI components
hooks/            # Custom React hooks
lib/             # Utility functions
public/          # Static assets
styles/          # Additional styles
types/           # TypeScript types
utils/           # Helper functions
```

## Scripts

- `npm dev` - Start development server
- `npm build` - Build for production
- `npm start` - Start production server
- `npm lint` - Run ESLint

## Configuration

The project uses various configuration files:

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration

## License

Private project - All rights reserved

## Author

Created by Akshit Suthar
