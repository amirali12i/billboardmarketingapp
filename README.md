# 🎨 Billboard Marketing App - AI-Powered 3D Billboard Design Platform

<div align="center">

![Billboard Marketing](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)
![Three.js](https://img.shields.io/badge/Three.js-0.170-000000.svg)

پلتفرم پیشرفته طراحی بیلبورد با هوش مصنوعی و نمایش سه‌بعدی

[Demo](https://billboard-marketing.vercel.app) • [Documentation](./docs) • [Report Bug](https://github.com/yourusername/billboard-marketing/issues)

</div>

---

## 📋 فهرست مطالب

- [معرفی](#-معرفی)
- [ویژگی‌های کلیدی](#-ویژگی‌های-کلیدی)
- [فناوری‌های استفاده‌شده](#-فناوری‌های-استفاده‌شده)
- [نصب و راه‌اندازی](#-نصب-و-راه‌اندازی)
- [ساختار پروژه](#-ساختار-پروژه)
- [استفاده](#-استفاده)
- [API Documentation](#-api-documentation)
- [بهینه‌سازی عملکرد](#-بهینه‌سازی-عملکرد)
- [مشارکت](#-مشارکت)
- [لایسنس](#-لایسنس)

---

## 🎯 معرفی

**Billboard Marketing App** یک پلتفرم پیشرفته و حرفه‌ای برای طراحی بیلبوردهای تبلیغاتی است که با استفاده از هوش مصنوعی و تکنولوژی نمایش سه‌بعدی، تجربه‌ای منحصر به فرد از طراحی گرافیکی را ارائه می‌دهد.

### چرا این پلتفرم؟

- ✨ **هوش مصنوعی**: تولید خودکار تصاویر و متن‌های تبلیغاتی
- 🎨 **نمایش 3D**: پیش‌نمایش واقع‌گرایانه بیلبورد در محیط سه‌بعدی
- 🚀 **سرعت بالا**: طراحی در عرض دقایق، نه ساعت‌ها
- 🌐 **پشتیبانی کامل از فارسی**: طراحی شده برای بازار ایران
- 📱 **واکنش‌گرا**: کار بر روی تمام دستگاه‌ها

---

## 🚀 ویژگی‌های کلیدی

### 🤖 هوش مصنوعی پیشرفته

- **تولید تصویر**: ایجاد تصاویر حرفه‌ای با AI (Stable Diffusion, DALL-E)
- **کپی‌رایتینگ هوشمند**: تولید خودکار عناوین و شعارهای جذاب
- **بهینه‌سازی طراحی**: تحلیل و پیشنهاد بهبود طراحی

### 🎨 ابزارهای طراحی حرفه‌ای

- **ویرایشگر بصری**: رابط کاربری بصری و آسان
- **قالب‌های آماده**: دسترسی به صدها قالب حرفه‌ای
- **مدیریت لایه**: کنترل کامل بر روی عناصر
- **افکت‌های پیشرفته**: سایه، کانتور، 3D، فیلترها و...
- **برند کیت**: مدیریت رنگ‌ها و لوگوی برند

### 🔮 نمایش سه‌بعدی

- **پیش‌نمایش 3D**: مشاهده بیلبورد در محیط واقعی
- **چرخش و زوم**: تعامل کامل با مدل سه‌بعدی
- **نورپردازی واقع‌گرا**: شبیه‌سازی نور روز و شب
- **انیمیشن‌ها**: حرکات نرم و طبیعی

### 📊 مدیریت پروژه

- **چند صفحه‌ای**: مدیریت کمپین‌های چند بیلبوردی
- **تاریخچه تغییرات**: Undo/Redo نامحدود
- **ذخیره‌سازی خودکار**: عدم از دست دادن تغییرات
- **خروجی چندگانه**: PNG, JPG, SVG, PDF

### 🌍 بین‌المللی‌سازی

- **RTL کامل**: پشتیبانی کامل از راست‌چین
- **فونت‌های فارسی**: Vazirmatn و Lalezar
- **چند زبانه**: فارسی و انگلیسی

---

## 🛠 فناوری‌های استفاده‌شده

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.0 | React Framework with SSR/SSG |
| **React** | 19.0 | UI Library |
| **TypeScript** | 5.8 | Type Safety |
| **TailwindCSS** | 3.4 | Utility-First CSS |
| **Three.js** | 0.170 | 3D Graphics |
| **React Three Fiber** | 8.17 | React Renderer for Three.js |
| **Framer Motion** | 11.11 | Animations |
| **Zustand** | 5.0 | State Management |
| **Lucide React** | Latest | Icons |

### Backend & AI

| Technology | Purpose |
|------------|---------|
| **Google Gemini** | Text Generation & AI Assistant |
| **Stable Diffusion** | Image Generation (via Replicate) |
| **DALL-E** | Alternative Image Generation |
| **Next.js API Routes** | RESTful API Endpoints |

### Performance & Optimization

- **Image Optimization**: Next.js Image component with CDN support
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Web Vitals Monitoring**: LCP, FID, CLS tracking
- **Service Workers**: Offline support (optional)

---

## 📦 نصب و راه‌اندازی

### پیش‌نیازها

```bash
Node.js >= 18.0.0
npm >= 9.0.0
# یا
yarn >= 1.22.0
# یا
pnpm >= 8.0.0
```

### مراحل نصب

1. **کلون کردن مخزن**

```bash
git clone https://github.com/yourusername/billboard-marketing-app.git
cd billboard-marketing-app
```

2. **نصب وابستگی‌ها**

```bash
npm install
# یا
yarn install
# یا
pnpm install
```

3. **تنظیم متغیرهای محیطی**

```bash
cp .env.example .env.local
```

فایل `.env.local` را ویرایش کرده و کلیدهای API خود را وارد کنید:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # اختیاری
REPLICATE_API_KEY=your_replicate_api_key_here  # اختیاری
```

4. **اجرای برنامه در محیط توسعه**

```bash
npm run dev
# یا
yarn dev
# یا
pnpm dev
```

برنامه در آدرس [http://localhost:3000](http://localhost:3000) اجرا می‌شود.

5. **ساخت برای تولید**

```bash
npm run build
npm run start
```

---

## 📁 ساختار پروژه

```
billboard-marketing-app/
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── editor/              # Editor page
│       └── page.tsx
├── components/              # React components
│   ├── Billboard3D.tsx      # 3D billboard component
│   ├── ThemeProvider.tsx    # Theme management
│   ├── EditorApp.tsx        # Editor wrapper
│   ├── Canvas.tsx           # Canvas editor
│   ├── LeftPanel.tsx        # Side panel
│   └── ...                  # Other components
├── pages/api/               # API routes
│   └── ai/
│       ├── generate-image.ts
│       ├── generate-text.ts
│       └── optimize-design.ts
├── lib/                     # Utility libraries
│   ├── imageOptimization.ts
│   └── performance.ts
├── services/                # Service layers
│   └── geminiService.ts
├── hooks/                   # Custom React hooks
│   └── useWorkspaceStore.ts
├── utils/                   # Helper utilities
│   ├── canvasRenderer.ts
│   ├── maskPaths.ts
│   └── pathUtils.ts
├── types.ts                 # TypeScript types
├── public/                  # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## 💻 استفاده

### 1. صفحه فرود (Landing Page)

صفحه اصلی شامل:
- معرفی محصول با تاکید بر AI و 3D
- نمایش ویژگی‌ها
- پلن‌های قیمت‌گذاری
- دکمه‌های CTA برای تبدیل

### 2. ویرایشگر (Editor)

**شروع طراحی:**

```
1. از صفحه اصلی روی "شروع کنید" کلیک کنید
2. یک قالب انتخاب کنید یا از صفحه خالی شروع کنید
3. عناصر را اضافه و ویرایش کنید
4. از هوش مصنوعی برای تولید محتوا استفاده کنید
5. خروجی نهایی را دریافت کنید
```

**میانبرهای کیبورد:**

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + C` | Copy |
| `Ctrl/Cmd + V` | Paste |
| `Ctrl/Cmd + G` | Group |
| `Ctrl/Cmd + Shift + G` | Ungroup |
| `Delete/Backspace` | Delete element |
| `Space + Drag` | Pan canvas |
| `Ctrl/Cmd + Wheel` | Zoom |

### 3. API استفاده

**تولید تصویر:**

```typescript
const response = await fetch('/api/ai/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'بیلبورد مدرن با رنگ‌های آبی و نارنجی',
    width: 1280,
    height: 720,
  })
})

const data = await response.json()
console.log(data.imageUrl)
```

**تولید متن:**

```typescript
const response = await fetch('/api/ai/generate-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'headline',
    context: 'فروش ویژه بهاره',
    brand: 'نام برند',
    language: 'fa'
  })
})

const data = await response.json()
console.log(data.suggestions)
```

---

## 📈 بهینه‌سازی عملکرد

### تکنیک‌های بهینه‌سازی پیاده‌سازی شده

1. **Code Splitting & Lazy Loading**
   ```typescript
   const Billboard3D = lazy(() => import('@/components/Billboard3D'))
   ```

2. **Image Optimization**
   - استفاده از Next.js Image component
   - فرمت‌های مدرن (WebP, AVIF)
   - Lazy loading تصاویر

3. **Performance Monitoring**
   - Web Vitals tracking
   - Custom performance metrics
   - Error boundary implementation

4. **Caching Strategies**
   - Static Generation (SSG) for landing page
   - API response caching
   - Browser caching headers

5. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (Gzip, Brotli)

### معیارهای عملکرد

| Metric | Target | Current |
|--------|--------|---------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ |
| **FID** (First Input Delay) | < 100ms | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ |
| **Lighthouse Score** | > 90 | ✅ |

---

## 🔌 API Documentation

### Endpoints

#### 1. Generate Image

```http
POST /api/ai/generate-image
Content-Type: application/json

{
  "prompt": "string",
  "negativePrompt": "string (optional)",
  "width": number,
  "height": number,
  "style": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://..."
}
```

#### 2. Generate Text

```http
POST /api/ai/generate-text
Content-Type: application/json

{
  "type": "headline" | "slogan" | "description",
  "context": "string (optional)",
  "brand": "string (optional)",
  "style": "string (optional)",
  "language": "fa" | "en"
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": ["suggestion1", "suggestion2", ...]
}
```

#### 3. Optimize Design

```http
POST /api/ai/optimize-design
Content-Type: application/json

{
  "elements": [...],
  "dimensions": { "width": 1280, "height": 720 }
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": {
    "layout": [...],
    "colors": [...],
    "typography": [...],
    "readability": 85,
    "visualImpact": 92
  }
}
```

---

## 🤝 مشارکت

ما از مشارکت شما استقبال می‌کنیم! لطفاً مراحل زیر را دنبال کنید:

1. Fork کردن پروژه
2. ایجاد branch برای feature جدید (`git checkout -b feature/AmazingFeature`)
3. Commit تغییرات (`git commit -m 'Add some AmazingFeature'`)
4. Push به branch (`git push origin feature/AmazingFeature`)
5. ایجاد Pull Request

### راهنمای کدنویسی

- از TypeScript برای type safety استفاده کنید
- از TailwindCSS برای styling استفاده کنید
- کامنت‌های واضح بنویسید
- تست‌های واحد اضافه کنید
- مستندات را به‌روز نگه دارید

---

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای اطلاعات بیشتر فایل [LICENSE](LICENSE) را مطالعه کنید.

---

## 👥 تیم توسعه

- **طراحی UI/UX**: [نام]
- **توسعه Frontend**: [نام]
- **یکپارچه‌سازی AI**: [نام]
- **نمایش 3D**: [نام]

---

## 📞 پشتیبانی

برای پشتیبانی و گزارش مشکلات:

- 📧 Email: support@billboard-marketing.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/billboard-marketing/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/billboard-marketing/discussions)

---

## 🙏 تشکر

از تمام کتابخانه‌ها و ابزارهای متن‌باز که این پروژه را ممکن ساختند، تشکر می‌کنیم:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Three.js](https://threejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- و بسیاری دیگر...

---

<div align="center">

**با ❤️ ساخته شده برای بازار ایران**

[⬆ بازگشت به بالا](#-billboard-marketing-app---ai-powered-3d-billboard-design-platform)

</div>
