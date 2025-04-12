# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start both frontend and backend servers in development mode
- `npm run dev:server` - Start backend server only with hot reloading
- `npm run start:client` - Start frontend Vite server
- `cd src && npm run lint` - Run ESLint on frontend code
- `cd src && npm run build` - Build frontend for production

## Code Style
- **React Components**: PascalCase, function declarations
- **Function naming**: camelCase, prefix event handlers with "handle"
- **Imports**: Group by external libraries first, then internal components
- **Frontend**: React 19, Vite, Zustand state management, React Query for data
- **Backend**: Node.js, Express, SQLite3 with CommonJS modules
- **Organization**: Components in components/, Pages in pages/, API services in services/
- **Error handling**: try/catch with error logging and user-friendly messages
- **Tabs vs spaces**: 2 spaces for indentation
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes preferred for strings

## Best Practices
- Use async/await for asynchronous operations
- Follow MVC-like pattern for backend code
- Use proper error handling with descriptive messages
- Maintain consistent component structure