# 🚀 Quick Setup Guide

## What Was Implemented

This project has been transformed into a **modern, component-driven AI-powered 3D billboard design platform** with the following architecture:

### ✅ Completed Features

#### 1. **Next.js Migration** (from Vite)
- App Router with server-side rendering for landing page
- Client-side rendering for the editor
- API routes for backend functionality
- Optimized build configuration

#### 2. **TailwindCSS Integration**
- Custom design system with primary and accent colors
- Dark mode support
- RTL (Right-to-Left) utilities for Farsi
- Custom animations and transitions
- Responsive utility classes

#### 3. **3D Billboard Preview** (Three.js)
- Interactive 3D billboard model
- Realistic lighting and shadows
- Orbit controls for rotation/zoom
- Auto-rotation animation
- GPU-optimized rendering

#### 4. **Conversion-Focused Landing Page**
- Hero section with animated 3D billboard
- Feature showcase highlighting AI and 3D capabilities
- Pricing section with three tiers
- Social proof with statistics
- Call-to-action sections
- Responsive design

#### 5. **AI Integration Layer**
- **Text Generation API** (`/api/ai/generate-text`)
  - Headlines, slogans, descriptions
  - Farsi and English support
  - Powered by Google Gemini

- **Image Generation API** (`/api/ai/generate-image`)
  - Text-to-image capability
  - Support for Stable Diffusion/DALL-E
  - Customizable dimensions

- **Design Optimization API** (`/api/ai/optimize-design`)
  - Layout analysis
  - Color contrast checking
  - Typography recommendations
  - Readability scoring

#### 6. **Performance Optimizations**
- Code splitting and lazy loading
- Image optimization with Next.js Image
- Web Vitals monitoring utilities
- CDN-ready asset delivery
- Debounce and throttle utilities

#### 7. **Localization & Accessibility**
- Full RTL support
- Farsi fonts (Vazirmatn, Lalezar)
- i18n configuration
- Semantic HTML
- ARIA attributes

---

## 📦 Installation & Setup

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0 or yarn or pnpm
```

### Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Required: Google Gemini API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional: For image generation
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_KEY=your_replicate_api_key_here

# Optional: For CDN
NEXT_PUBLIC_CDN_URL=https://your-cdn-url.com
```

**Getting API Keys:**

1. **Google Gemini API**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Add to `.env.local`

2. **OpenAI (optional)**:
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Create API key
   - Add to `.env.local`

3. **Replicate (optional)**:
   - Sign up at [Replicate](https://replicate.com/)
   - Get API token
   - Add to `.env.local`

### Step 3: Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Step 4: Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
billboard-marketing-app/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page (SSR)
│   └── editor/
│       └── page.tsx             # Editor page (CSR)
│
├── components/                   # React Components
│   ├── Billboard3D.tsx          # 3D billboard preview
│   ├── ThemeProvider.tsx        # Theme context
│   ├── EditorApp.tsx            # Editor wrapper
│   └── [existing components]    # All editor components
│
├── pages/api/                    # API Routes
│   └── ai/
│       ├── generate-image.ts    # Image generation
│       ├── generate-text.ts     # Text generation
│       └── optimize-design.ts   # Design analysis
│
├── lib/                          # Utilities
│   ├── imageOptimization.ts     # Image helpers
│   └── performance.ts           # Performance monitoring
│
├── services/                     # Service Layer
│   └── geminiService.ts         # Google Gemini integration
│
├── hooks/                        # Custom Hooks
│   └── useWorkspaceStore.ts     # Zustand store
│
├── utils/                        # Helper Functions
│   ├── canvasRenderer.ts
│   ├── maskPaths.ts
│   └── pathUtils.ts
│
└── public/                       # Static Assets
```

---

## 🎯 Key Pages

### 1. Landing Page (`/`)
- Conversion-optimized homepage
- 3D billboard showcase
- Feature highlights
- Pricing plans
- CTA sections

**Technologies:**
- Server-side rendering (SSR)
- Framer Motion animations
- Lazy-loaded 3D component

### 2. Editor (`/editor`)
- Full-featured billboard design tool
- Existing functionality preserved
- Client-side rendering only (no SSR)

**Technologies:**
- Dynamic import to prevent SSR
- All existing features intact

---

## 🔌 API Endpoints

### Generate Text
```bash
POST /api/ai/generate-text
Content-Type: application/json

{
  "type": "headline",
  "context": "فروش ویژه",
  "brand": "برند من",
  "language": "fa"
}
```

### Generate Image
```bash
POST /api/ai/generate-image
Content-Type: application/json

{
  "prompt": "بیلبورد مدرن",
  "width": 1280,
  "height": 720
}
```

### Optimize Design
```bash
POST /api/ai/optimize-design
Content-Type: application/json

{
  "elements": [...],
  "dimensions": { "width": 1280, "height": 720 }
}
```

---

## 🎨 Styling

### TailwindCSS Utilities

**Custom Classes:**
```css
.gradient-text        /* Gradient text effect */
.glass               /* Glassmorphism */
.animate-float       /* Floating animation */
.bg-grid-pattern     /* Grid background */
```

**Theme Colors:**
- `primary-*`: Blue shades
- `accent-*`: Pink/purple shades
- `gray-*`: Neutral shades

**Dark Mode:**
```jsx
<div className="bg-white dark:bg-gray-900">
  <!-- Auto-switches based on system preference -->
</div>
```

---

## 📊 Performance

### Optimizations Implemented

1. **Code Splitting**
   - Route-based splitting (automatic)
   - Component-level lazy loading
   - Dynamic imports for heavy components

2. **Image Optimization**
   - Next.js Image component
   - Automatic format selection (WebP, AVIF)
   - Responsive images
   - Lazy loading

3. **3D Optimization**
   - Geometry instancing
   - LOD (Level of Detail)
   - Frustum culling
   - Efficient materials

4. **Caching**
   - Static page generation
   - API response caching
   - Browser caching headers

### Monitoring

Web Vitals are automatically tracked:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

```typescript
import { monitorPerformance } from '@/lib/performance'

monitorPerformance((metrics) => {
  console.log('Performance:', metrics)
})
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm run start
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Landing page loads and displays 3D billboard
- [ ] Editor opens without errors
- [ ] Template selection works
- [ ] Element manipulation (move, resize, rotate)
- [ ] AI text generation (if API key configured)
- [ ] AI image generation (if API key configured)
- [ ] Export functionality
- [ ] Dark mode toggle
- [ ] RTL text display
- [ ] Responsive design on mobile

---

## 🐛 Troubleshooting

### Issue: 3D Billboard Not Showing

**Solution:**
- Check browser WebGL support
- Clear browser cache
- Check console for errors

### Issue: AI Features Not Working

**Solution:**
- Verify API keys in `.env.local`
- Check API key permissions
- Review API usage limits

### Issue: Fonts Not Loading

**Solution:**
- Ensure internet connection (fonts loaded from CDN)
- Or download fonts locally and update `globals.css`

### Issue: Build Errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Google Gemini API](https://ai.google.dev/docs)

---

## 🤝 Support

For issues or questions:
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Review [README.md](./README.md) for comprehensive documentation
- Open an issue on GitHub

---

## ✅ Next Steps

1. **Configure API Keys**: Add your Google Gemini API key to `.env.local`
2. **Run Development Server**: `npm run dev`
3. **Test Features**: Explore both landing page and editor
4. **Customize**: Modify colors, content, and branding
5. **Deploy**: Push to Vercel or your preferred platform

---

<div align="center">

**🎉 Your AI-powered 3D billboard platform is ready!**

Start designing amazing billboards at [http://localhost:3000](http://localhost:3000)

</div>
