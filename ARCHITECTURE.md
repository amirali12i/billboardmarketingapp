# 🏗️ Architecture Documentation

## Overview

This document provides a comprehensive overview of the Billboard Marketing App architecture, design decisions, and technical implementation details.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Component-Driven Architecture](#component-driven-architecture)
- [State Management](#state-management)
- [3D Rendering Pipeline](#3d-rendering-pipeline)
- [AI Integration](#ai-integration)
- [Performance Optimization](#performance-optimization)
- [Data Flow](#data-flow)
- [Security Considerations](#security-considerations)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Landing Page │  │    Editor    │  │  3D Preview  │      │
│  │  (Next.js)   │  │  (React)     │  │  (Three.js)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Image Gen    │  │  Text Gen    │  │   Optimize   │      │
│  │    API       │  │    API       │  │  Design API  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     External Services                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Google Gemini│  │Stable Diffusion│ │   CDN/Storage│      │
│  │   (AI Text)  │  │  (AI Images) │  │   (Assets)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend Architecture

**Next.js 15 (App Router)**
- Server-Side Rendering (SSR) for landing page
- Client-Side Rendering (CSR) for editor
- API Routes for backend functionality
- Built-in optimization (Image, Font, Script)

**React 19**
- Component-based UI
- Hooks for state and side effects
- Concurrent rendering features
- Suspense for lazy loading

**TypeScript 5.8**
- Type safety across the application
- Better developer experience
- Compile-time error checking
- Enhanced IDE support

**TailwindCSS 3.4**
- Utility-first CSS framework
- Responsive design system
- Dark mode support
- Custom design tokens

---

## Component-Driven Architecture

### Design Principles

1. **Separation of Concerns**
   - Each component has a single responsibility
   - UI components are separated from business logic
   - Presentational vs Container components

2. **Composition over Inheritance**
   - Small, reusable components
   - Higher-order components (HOCs)
   - Render props and custom hooks

3. **DRY (Don't Repeat Yourself)**
   - Shared utilities in `/lib`
   - Reusable UI components
   - Custom hooks for common logic

### Component Hierarchy

```
App (Root)
│
├── Layout
│   ├── Navigation
│   ├── Header
│   └── Footer
│
├── Pages
│   ├── LandingPage
│   │   ├── HeroSection
│   │   │   └── Billboard3D
│   │   ├── FeaturesSection
│   │   ├── PricingSection
│   │   └── CTASection
│   │
│   └── EditorPage
│       ├── LeftPanel
│       │   ├── TemplatesTab
│       │   ├── ElementsTab
│       │   ├── LayersTab
│       │   └── BrandKitTab
│       ├── Canvas
│       │   ├── CanvasElement (Image/Text/Shape)
│       │   ├── SelectionBox
│       │   └── ContextMenu
│       ├── CanvasToolbar
│       └── PagesPanel
│
└── Shared Components
    ├── Button
    ├── Input
    ├── Modal
    ├── Dropdown
    └── ThemeToggle
```

### Component Guidelines

**Component Structure:**

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react'
import { ComponentProps } from './types'

// 2. Type Definitions
interface Props extends ComponentProps {
  // prop types
}

// 3. Component
export function Component({ prop1, prop2 }: Props) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Effects
  useEffect(() => {
    // side effects
  }, [dependencies])

  // 6. Event Handlers
  const handleClick = () => {
    // logic
  }

  // 7. Render
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  )
}
```

---

## State Management

### Zustand Store Architecture

We use Zustand for global state management due to its simplicity and performance.

**Store Structure:**

```typescript
interface WorkspaceStore {
  // Projects
  projects: Project[]
  activeProject: Project | null

  // Brand Kit
  brandKit: BrandKit

  // User Uploads
  userUploads: string[]

  // Actions
  createProject: (name: string) => void
  loadProject: (id: string) => void
  updateActivePageElements: (updater) => void
  undo: () => void
  redo: () => void
  // ... more actions
}
```

**Benefits:**
- No boilerplate code
- Simple API
- TypeScript support
- DevTools integration
- Small bundle size (~1KB)

### Local State Management

For component-specific state:
- `useState` for simple state
- `useReducer` for complex state logic
- `useRef` for mutable values
- `useMemo` for expensive computations
- `useCallback` for memoized callbacks

---

## 3D Rendering Pipeline

### Three.js Integration

**React Three Fiber** abstracts Three.js into React components.

**3D Scene Structure:**

```
Scene
├── Camera (PerspectiveCamera)
├── Lights
│   ├── AmbientLight
│   ├── DirectionalLight
│   ├── PointLights (Spotlights)
│   └── SpotLight
├── Objects
│   ├── Billboard Mesh
│   │   ├── Geometry (BoxGeometry)
│   │   └── Material (MeshStandardMaterial)
│   ├── Frame Mesh
│   ├── Support Posts (CylinderGeometry)
│   └── Ground Plane (CircleGeometry)
├── Environment (HDRI)
└── Controls (OrbitControls)
```

**Rendering Pipeline:**

1. **Scene Setup**: Initialize scene, camera, renderer
2. **Object Creation**: Create 3D meshes with geometries and materials
3. **Lighting**: Add lights for realistic rendering
4. **Animation Loop**: Update objects and render frames
5. **User Interaction**: Handle camera controls and interactions

**Performance Optimizations:**

- Geometry instancing for repeated objects
- Texture compression and mipmaps
- Level of Detail (LOD) for complex scenes
- Frustum culling
- Object pooling for reusable meshes

---

## AI Integration

### Architecture

```
Client Request
     │
     ↓
Next.js API Route
     │
     ↓
AI Service Layer
     ├── Google Gemini (Text)
     ├── Stable Diffusion (Images)
     └── DALL-E (Alternative)
     │
     ↓
Process Response
     │
     ↓
Return to Client
```

### AI Services

**1. Text Generation (Google Gemini)**

```typescript
// services/geminiService.ts
export async function generateText(prompt: string) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const result = await model.generateContent(prompt)
  return result.response.text()
}
```

**2. Image Generation (Stable Diffusion via Replicate)**

```typescript
// pages/api/ai/generate-image.ts
export async function generateImage(prompt: string) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/sdxl',
      input: { prompt }
    })
  })
  return response.json()
}
```

**3. Design Optimization**

Uses rule-based algorithms and heuristics to analyze designs:
- Layout balance
- Color contrast
- Typography readability
- Visual hierarchy

---

## Performance Optimization

### Frontend Optimization

**1. Code Splitting**

```typescript
// Dynamic imports
const Billboard3D = lazy(() => import('@/components/Billboard3D'))
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false })
```

**2. Image Optimization**

```typescript
// Next.js Image component
<Image
  src="/image.jpg"
  width={1280}
  height={720}
  alt="Billboard"
  loading="lazy"
  quality={85}
  placeholder="blur"
/>
```

**3. Memoization**

```typescript
// useMemo for expensive computations
const sortedElements = useMemo(() => {
  return elements.sort((a, b) => b.zIndex - a.zIndex)
}, [elements])

// useCallback for event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies])
```

**4. Virtual Scrolling**

For large lists of templates or layers:
```typescript
import { FixedSizeList } from 'react-window'
```

**5. Web Workers**

For CPU-intensive tasks:
```typescript
// Export canvas to image in Web Worker
const worker = new Worker('/workers/export.worker.js')
worker.postMessage({ elements, dimensions })
```

### Backend Optimization

**1. API Response Caching**

```typescript
export const config = {
  api: {
    responseLimit: '10mb',
    externalResolver: true,
  },
}

// Cache AI responses
const cache = new Map()
```

**2. Rate Limiting**

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

**3. Database Optimization**

- Indexing for fast queries
- Connection pooling
- Query optimization
- Caching frequently accessed data

---

## Data Flow

### State Updates Flow

```
User Action
    │
    ↓
Event Handler
    │
    ↓
Update Store/State
    │
    ├─→ Update Local State (useState)
    └─→ Update Global State (Zustand)
    │
    ↓
Re-render Components
    │
    ↓
Update Canvas/UI
```

### API Request Flow

```
Component
    │
    ↓
API Call (fetch)
    │
    ↓
Next.js API Route
    │
    ↓
External Service
    │
    ↓
Process Response
    │
    ↓
Update State
    │
    ↓
Re-render UI
```

---

## Security Considerations

### API Security

1. **API Key Protection**
   - Store in environment variables
   - Never expose in client code
   - Use server-side API routes

2. **Rate Limiting**
   - Prevent abuse
   - Protect external API quotas

3. **Input Validation**
   - Sanitize user inputs
   - Validate data types
   - Prevent XSS attacks

4. **CORS Configuration**
   ```typescript
   // next.config.js
   async headers() {
     return [
       {
         source: '/api/:path*',
         headers: [
           { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
         ],
       },
     ]
   }
   ```

### Client Security

1. **CSP Headers**
   ```typescript
   // Prevent XSS
   Content-Security-Policy: default-src 'self'; script-src 'self'; ...
   ```

2. **Secure Storage**
   - Don't store sensitive data in localStorage
   - Use httpOnly cookies for authentication

3. **HTTPS Only**
   - Force HTTPS in production
   - Use secure headers

---

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────┐
│           Vercel Edge Network            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │   CDN   │  │  Cache  │  │   WAF   │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│          Next.js Application             │
│  ┌─────────────────────────────────┐    │
│  │     Server Components (SSR)     │    │
│  │     Client Components (CSR)     │    │
│  │     API Routes                  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│          External Services               │
│  ┌───────────┐  ┌───────────┐          │
│  │  AI APIs  │  │    CDN    │          │
│  └───────────┘  └───────────┘          │
└─────────────────────────────────────────┘
```

### Deployment Strategy

1. **CI/CD Pipeline**
   - Automated testing
   - Build optimization
   - Deployment to staging
   - Production deployment

2. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Analytics (Google Analytics)
   - Log aggregation

3. **Scaling**
   - Horizontal scaling with serverless
   - CDN for static assets
   - Database replication
   - Load balancing

---

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Advanced animation timeline
- [ ] AR preview (mobile)
- [ ] Video billboard support
- [ ] Team workspace
- [ ] Custom AI model training
- [ ] Blockchain-based asset ownership (NFT)
- [ ] Mobile app (React Native)

---

<div align="center">

**Architecture designed for scale, performance, and maintainability**

</div>
