# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GymShop - E-commerce platform specialized in sports products with admin panel for product management.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** Zustand (global) + React Query (server) + React Hook Form (forms)
- **Routing:** React Router 7
- **HTTP Client:** Axios
- **Notifications:** Sonner
- **UI Components:** Radix UI primitives via shadcn/ui

## Project Setup

**Prerequisites:**
- Backend must be running on port 3000
- Copy `.env` file and configure `VITE_API_URL`
- Node.js environment

**Commands:**
```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Architecture

This React e-commerce application follows **Clean Architecture** with three main bounded contexts:

### Core Modules

- `/src/shop` - Public store (catalog, filters, products)
- `/src/auth` - Authentication and authorization
- `/src/admin` - Product administration panel
- `/src/shared` - Shared types and utilities
- `/src/components/ui` - shadcn/ui components
- `/src/components/custom` - Custom shared components
- `/src/config` - Application configurations
- `/src/lib` - General utilities
- `/src/api` - Base API client

### Module Structure (Clean Architecture)

Each module follows this layered architecture:

```
module/
├── components/      # UI components (React)
├── pages/          # Route pages/views
├── hooks/          # Custom hooks (orchestration layer)
├── services/       # Business logic (pure functions)
├── repositories/   # Data access layer (API calls)
├── mappers/        # Data transformation (API ↔ Domain)
├── types/          # TypeScript interfaces/types
├── store/          # Zustand stores (if applicable)
└── config/         # Module-specific configuration
```

### Architectural Principles

**Key principles:**
- **Hooks** - Orchestration layer between UI and services, NO business logic
- **Services** - Pure business logic functions, NO React dependencies
- **Repositories** - Implement interfaces (Dependency Inversion), handle ALL API calls
- **Mappers** - Transform between API DTOs and domain models
- **Stores** (Zustand) - Thin state wrappers, delegate ALL logic to services

### Data Flow

```
UI Component → Custom Hook → Service → Repository → API
                    ↓             ↓          ↓
                 State      Pure Logic   Interface
```

**Concrete example from auth module:**
1. `LoginPage.tsx` calls `useAuthStore.login(email, password)`
2. Store delegates to `authService.login(email, password)`
3. Service uses `authRepository.login()` (interface implementation)
4. Repository makes API call via `gymApi.post('/auth/login')`
5. Response mapped through `AuthMapper`
6. Store updates state with result

## Naming Conventions

### Files and Directories
- **Components:** PascalCase (`ProductCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useProducts.tsx`)
- **Services:** PascalCase with `Service` suffix (`ProductFilterService.ts`)
- **Repositories:** PascalCase with `Repository` suffix (`ProductApiRepository.ts`)
- **Types:** PascalCase with `.types.ts` extension (`product.types.ts`)
- **Mappers:** PascalCase with `Mapper` suffix (`ProductMapper.ts`)
- **Stores:** camelCase with `.store.ts` extension (`auth.store.ts`)

### Code Structure
- Use `index.ts` for public exports from each directory
- Separate interfaces/types in `.types.ts` files
- Keep shadcn/ui components in `components/ui/`
- Custom components in `components/custom/`
- Module-specific components in `{module}/components/`

## Authentication & Authorization

### State Management
- **Store:** `useAuthStore` (Zustand) manages `user`, `token`, `authStatus`
- **Token:** JWT stored in localStorage via `TokenStorageService`
- **Auto-attach:** `gymApi` interceptor automatically adds Bearer token

### Route Protection Components
- `NotAuthenticatedRoute` - Wraps `/auth/*` routes (redirects if authenticated)
- `AuthenticatedRoute` - Requires authentication (not currently in router but available)
- `AdminRoute` - Wraps `/admin/*` routes, validates admin role

### Authentication Flow
1. App loads → `CheckAuthProvider` validates stored token
2. Valid token → fetch user data → set `authStatus: 'authenticated'`
3. Invalid/missing → set `authStatus: 'not-authenticated'` → redirect to login
4. Token attached automatically to all API requests via interceptor

## Routing Structure

Defined in `app.router.tsx`:

### 1. Public Shop Routes (`/`)
- Layout: `ShopLayout`
- Routes:
  - `/` - Homepage
  - `/product/:idSlug` - Product detail
  - `/gender/:gender` - Gender-filtered products

### 2. Authentication Routes (`/auth/*`)
- Layout: `AuthLayout` (lazy loaded)
- Protected by: `NotAuthenticatedRoute`
- Routes:
  - `/auth/login` - Login page
  - `/auth/register` - Registration page

### 3. Admin Routes (`/admin/*`)
- Layout: `AdminLayout` (lazy loaded)
- Protected by: `AdminRoute` (requires admin role)
- Routes:
  - `/admin` - Dashboard
  - `/admin/products` - Products list
  - `/admin/products/:id` - Product CRUD

## API Integration

### Base Client
**Location:** `src/api/gymApi.ts`
- Axios instance with `VITE_API_URL` as base URL
- Request interceptor for JWT token injection
- Automatic Bearer token attachment from `TokenStorageService`

### Repository Pattern
- Each module has repository interfaces for dependency inversion
- Implementations inject `gymApi` for actual API calls
- Example: `admin/repositories/ProductApiRepository.ts` implements `IProductRepository`

### API Response Handling
- Repositories return raw API responses
- Mappers transform DTOs to domain models
- Services contain business logic and error handling

## State Management Strategy

### Zustand (Global State)
- **Authentication:** `auth/store/auth.store.ts`
- Stores are thin wrappers that delegate to services
- State shape clearly defined with TypeScript

### React Query (Server State)
- Data fetching, caching, synchronization
- Used in hooks like `useProducts`, `useAdminProducts`
- Configured with `QueryClient` in main app

### React Hook Form (Form State)
- All forms use RHF for validation and state
- Example: Admin product form in `AdminProductPage.tsx`
- Integrates with TypeScript for type-safe forms

## Path Aliases

**Configuration:** `@/*` maps to `src/*` (in `vite.config.ts` and `tsconfig.json`)

Usage examples:
```typescript
import { gymApi } from '@/api/gymApi'
import { useAuthStore } from '@/auth/store/auth.store'
import { Button } from '@/components/ui/button'
```

## UI Components Architecture

### shadcn/ui Components (`components/ui/*`)
- Radix UI primitives with Tailwind styling
- Components: Button, Card, Input, Label, Table, Sheet, Dialog, etc.
- Import: `import { Button } from '@/components/ui/button'`

### Custom Components (`components/custom/*`)
- Shared custom components not from shadcn/ui
- Example: `CustomFullScreenLoading.tsx`

### Module Components (`{module}/components/*`)
- Module-specific UI components
- Examples: `shop/components/ProductCard.tsx`, `admin/components/StatCard.tsx`

## Styling Guidelines

- **Framework:** Tailwind CSS 4 with Vite plugin
- **Class Merging:** Use `cn()` utility from `lib/utils.ts`
- **Responsive:** Mobile-first approach
- **Accessibility:** WCAG 2.1 AA compliance
  - Proper ARIA attributes
  - Adequate color contrast
  - Keyboard navigation support
  - Descriptive alt texts for images

## Backend Integration

- **Backend URL:** Runs on port 3000 (configured in `.env`)
- **API Base:** Configured via `VITE_API_URL` environment variable
- **Authentication:** JWT Bearer token
- **Error Handling:** Centralized in services layer

## Development Patterns

### Component Patterns
1. **Functional components** with hooks
2. **TypeScript strict mode** - always properly typed
3. **Repository Pattern** - all API calls through repositories
4. **Service Layer** - business logic in services
5. **Mappers** - transform API data to client models
6. **Custom Hooks** - encapsulate reusable logic
7. **React Query** - for data fetching and cache
8. **Zustand** - for global state (auth, cart, etc.)

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Clean Architecture for maintainability
- Interface-based programming for flexibility

## Important Notes for Claude Code

- **DO NOT create .md files** unless explicitly requested
- **DO NOT use emojis** in code or commits unless requested
- **PRIORITIZE editing** existing files over creating new ones
- **FOLLOW existing patterns** when adding new features
- **MAINTAIN Clean Architecture** principles strictly
- **USE established naming conventions** consistently
- **RESPECT module boundaries** - no cross-module imports except through shared
- **DELEGATE business logic** to services, not components or hooks
- **TEST with TypeScript** - ensure no type errors before marking tasks complete