# ECLearnix - EdTech Domain Project

A modern EdTech platform built for online learning experiences.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (Auth, Database, Storage)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone https://github.com/jayaramalingam/ECLearnix-EdTech-Domain-project.git

# Navigate to the project directory
cd ECLearnix-EdTech-Domain-project

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
├── integrations/   # Third-party service integrations
└── main.tsx        # Application entry point
```

## Deployment

Build the project for production:

```sh
npm run build
```

The output will be in the `dist/` directory, ready to deploy to any static hosting provider.

## License

This project is proprietary. All rights reserved.
