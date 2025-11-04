import { Template, ElementType, ShapeType, Fill, SolidFill } from '../types';

// FIX: Changed the return type of `solidFill` from `Fill` to `SolidFill`.
// This ensures that when it's used for `IconElement`, which requires a `SolidFill`, there is no type mismatch.
// The more specific `SolidFill` is still assignable to the `Fill` property of other elements.
const solidFill = (color: string): SolidFill => ({ type: 'SOLID', color });

const gradientFill = (colors: string[], angle: number = 135): Fill => {
    return {
        type: 'GRADIENT',
        gradient: {
            type: 'LINEAR',
            angle: angle,
            stops: colors.map((c, i) => ({ offset: i / (colors.length - 1), color: c }))
        }
    }
};

const defaultImageFilters = { opacity: 1, brightness: 1, contrast: 1, grayscale: 0, saturate: 1, hueRotate: 0 };

export const templates: Template[] = [
    {
        id: 'modern-digital-agency',
        name: 'آژانس دیجیتال مدرن',
        elements: [
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 1280, height: 720, rotation: 0, fill: solidFill('#1c2333') },
            { type: ElementType.VectorShape, shapeName: 'Stylized Fox Head', x: 750, y: 110, width: 450, height: 450, rotation: 0, fill: solidFill('#ff4655') },
            { type: ElementType.Text, text: 'فراتر از مرزها', fontFamily: 'Lalezar', fontSize: 130, fontWeight: 'bold', x: 80, y: 250, width: 600, height: 150, rotation: 0, fill: solidFill('#ffffff'), effects: {}, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', lineHeight: 1.2, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'استراتژی‌های دیجیتال برای فردای شما', fontFamily: 'Vazirmatn', fontSize: 32, fontWeight: 'normal', x: 85, y: 400, width: 550, height: 100, rotation: 0, fill: solidFill('#aeb8c5'), effects: {}, lineHeight: 1.6, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'YOURAGENCY.COM', fontFamily: 'Vazirmatn', fontSize: 24, fontWeight: 'bold', x: 90, y: 650, width: 300, height: 30, rotation: 0, fill: solidFill('#ff4655'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 2, textCase: 'uppercase' }
        ]
    },
    {
        id: 'tech-launch',
        name: 'معرفی محصول فناوری',
        elements: [
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 1280, height: 720, rotation: 0, fill: gradientFill(['#0f172a', '#0c0c1e', '#000000'], 150) },
            { type: ElementType.VectorShape, shapeName: 'Abstract Shape 3', x: 850, y: -200, width: 800, height: 800, rotation: -45, fill: solidFill('rgba(56, 189, 248, 0.05)') },
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: -100, y: 360, width: 850, height: 1, rotation: 10, fill: solidFill('rgba(56, 189, 248, 0.2)') },
            { type: ElementType.Image, src: '', x: 640, y: 135, width: 600, height: 450, rotation: 0, filters: defaultImageFilters, mask: ShapeType.Rectangle, naturalWidth: 600, naturalHeight: 450 },
            { type: ElementType.Text, text: 'آینده اینجاست', fontFamily: 'Lalezar', fontSize: 130, fontWeight: 'bold', x: 60, y: 150, width: 550, height: 150, rotation: 0, fill: solidFill('#ffffff'), effects: { shadow: { color: 'rgba(56, 189, 248, 0.5)', offsetX: 0, offsetY: 0, blur: 20 } }, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', lineHeight: 1.2, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'با جدیدترین محصول ما، تجربه‌ای بی‌نظیر از تکنولوژی را لمس کنید. سریع‌تر، هوشمندتر و قدرتمندتر از همیشه.', fontFamily: 'Vazirmatn', fontSize: 28, fontWeight: 'normal', x: 65, y: 320, width: 500, height: 150, rotation: 0, fill: solidFill('#e2e8f0'), effects: {}, lineHeight: 1.8, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 65, y: 480, width: 250, height: 60, rotation: 0, fill: solidFill('#0ea5e9') },
            { type: ElementType.Text, text: 'بیشتر بدانید', fontFamily: 'Vazirmatn', fontSize: 24, fontWeight: 'bold', x: 120, y: 495, width: 150, height: 30, rotation: 0, fill: solidFill('#ffffff'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'www.yoursite.com', fontFamily: 'Vazirmatn', fontSize: 20, fontWeight: 'normal', x: 65, y: 650, width: 250, height: 30, rotation: 0, fill: solidFill('#64748b'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' }
        ],
    },
    {
        id: 'ecommerce-sale',
        name: 'فروشگاه آنلاین مدرن',
        elements: [
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 1280, height: 720, rotation: 0, fill: solidFill('#f1f5f9') },
            { type: ElementType.Image, src: '', x: 50, y: 85, width: 700, height: 550, rotation: 0, filters: defaultImageFilters, naturalWidth: 700, naturalHeight: 550 },
            { type: ElementType.Text, text: 'فروش ویژه', fontFamily: 'Lalezar', fontSize: 160, fontWeight: 'bold', x: 780, y: 100, width: 450, height: 180, rotation: 0, fill: solidFill('#1e293b'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.2, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'تا 50% تخفیف', fontFamily: 'Vazirmatn', fontSize: 72, fontWeight: 'bold', x: 800, y: 280, width: 400, height: 80, rotation: 0, fill: solidFill('#ef4444'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'فقط برای مدت محدود', fontFamily: 'Vazirmatn', fontSize: 24, fontWeight: 'normal', x: 810, y: 370, width: 300, height: 30, rotation: 0, fill: solidFill('#475569'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 810, y: 450, width: 350, height: 70, rotation: 0, fill: solidFill('#1e293b') },
            { type: ElementType.Text, text: 'خرید کنید', fontFamily: 'Vazirmatn', fontSize: 28, fontWeight: 'bold', x: 920, y: 468, width: 150, height: 40, rotation: 0, fill: solidFill('#ffffff'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Icon, iconName: 'sale-tag', x: 1150, y: 30, width: 80, height: 80, rotation: 20, fill: solidFill('#ef4444') },
        ],
    },
    {
        id: 'live-music-event',
        name: 'رویداد موسیقی زنده',
        elements: [
            { type: ElementType.Image, src: '', x: 0, y: 0, width: 1280, height: 720, rotation: 0, filters: { ...defaultImageFilters, brightness: 0.7, saturate: 1.2 }, naturalWidth: 1280, naturalHeight: 720 },
            { type: ElementType.VectorShape, shapeName: 'Scribble', x: 100, y: 120, width: 300, height: 150, rotation: -5, fill: solidFill('rgba(250, 204, 21, 0.8)') },
            { type: ElementType.Text, text: 'کنسرت بزرگ', fontFamily: 'Lalezar', fontSize: 140, fontWeight: 'bold', x: 450, y: 100, width: 750, height: 160, rotation: 0, fill: solidFill('#ffffff'), effects: { shadow: { color: 'rgba(0,0,0,0.7)', offsetX: 3, offsetY: 5, blur: 8 } }, fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', lineHeight: 1.2, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'نام گروه / خواننده', fontFamily: 'Vazirmatn', fontSize: 72, fontWeight: 'bold', x: 460, y: 260, width: 600, height: 80, rotation: 0, fill: solidFill('#facc15'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 620, width: 1280, height: 100, rotation: 0, fill: solidFill('rgba(17, 24, 39, 0.7)') },
            { type: ElementType.Text, text: 'جمعه، ۲۵ مرداد | ساعت ۲۱:۰۰ | سالن همایش‌های برج میلاد', fontFamily: 'Vazirmatn', fontSize: 28, fontWeight: 'normal', x: 350, y: 655, width: 800, height: 40, rotation: 0, fill: solidFill('#ffffff'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Icon, iconName: 'music', x: 50, y: 635, width: 70, height: 70, rotation: -15, fill: solidFill('#facc15') },
        ],
    },
    {
        id: 'business-consulting',
        name: 'مشاوره کسب و کار',
        elements: [
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 1280, height: 720, rotation: 0, fill: solidFill('#ffffff') },
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 500, height: 720, rotation: 0, fill: solidFill('#0891b2') },
            { type: ElementType.Image, src: '', x: 600, y: 100, width: 600, height: 520, rotation: 0, filters: defaultImageFilters, mask: ShapeType.Rectangle, naturalWidth: 600, naturalHeight: 520 },
            { type: ElementType.Text, text: 'رشد کسب و کار شما', fontFamily: 'Lalezar', fontSize: 90, fontWeight: 'bold', x: 50, y: 100, width: 400, height: 220, rotation: 0, fill: solidFill('#ffffff'), lineHeight: 1.2, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 50, y: 310, width: 100, height: 5, rotation: 0, fill: solidFill('#f59e0b') },
            { type: ElementType.Text, text: 'با استراتژی‌های نوین و راهکارهای تخصصی، پتانسیل واقعی کسب و کار خود را آزاد کنید.', fontFamily: 'Vazirmatn', fontSize: 24, fontWeight: 'normal', x: 50, y: 350, width: 400, height: 150, rotation: 0, fill: solidFill('#f0f9ff'), lineHeight: 1.8, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'مشاوره رایگان: ۰۲۱-۱۲۳۴۵۶۷۸', fontFamily: 'Vazirmatn', fontSize: 22, fontWeight: 'bold', x: 50, y: 650, width: 400, height: 30, rotation: 0, fill: solidFill('#ffffff'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Icon, iconName: 'bar-chart-growth', x: 400, y: 30, width: 70, height: 70, rotation: 0, fill: solidFill('rgba(255,255,255,0.5)') },
        ],
    },
    {
        id: 'minimal-cafe',
        name: 'کافه رستوران مینیمال',
        elements: [
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 1280, height: 720, rotation: 0, fill: solidFill('#fafaf9') },
            { type: ElementType.Image, src: '', x: 730, y: 50, width: 500, height: 620, rotation: 0, filters: { ...defaultImageFilters, saturate: 0.8, contrast: 1.1 }, naturalWidth: 500, naturalHeight: 620 },
            { type: ElementType.Text, text: 'طعم واقعی قهوه', fontFamily: 'Lalezar', fontSize: 120, fontWeight: 'bold', x: 50, y: 150, width: 600, height: 140, rotation: 0, fill: solidFill('#44403c'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.2, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'محیطی دنج برای لحظات شما', fontFamily: 'Vazirmatn', fontSize: 36, fontWeight: 'normal', x: 55, y: 300, width: 500, height: 50, rotation: 0, fill: solidFill('#78716c'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.VectorShape, shapeName: 'Brush Stroke 1', x: 50, y: 260, width: 500, height: 80, rotation: 0, fill: solidFill('rgba(168, 162, 158, 0.2)') },
            { type: ElementType.Icon, iconName: 'location', x: 55, y: 650, width: 24, height: 24, rotation: 0, fill: solidFill('#44403c') },
            { type: ElementType.Text, text: 'آدرس ما: خیابان اصلی، پلاک ۱۰', fontFamily: 'Vazirmatn', fontSize: 20, fontWeight: 'normal', x: 90, y: 652, width: 400, height: 30, rotation: 0, fill: solidFill('#44403c'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
        ]
    },
    {
        id: 'special-discount',
        name: 'تخفیف ویژه',
        elements: [
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 1280, height: 720, rotation: 0, fill: gradientFill(['#f87171', '#ef4444', '#dc2626'], 45) },
            { type: ElementType.VectorShape, shapeName: 'Burst', x: -150, y: -150, width: 600, height: 600, rotation: 0, fill: solidFill('rgba(255, 255, 255, 0.1)') },
            { type: ElementType.VectorShape, shapeName: 'Seal', x: 680, y: 100, width: 500, height: 500, rotation: 15, fill: solidFill('#ffffff') },
            { type: ElementType.Text, text: '70%', fontFamily: 'Lalezar', fontSize: 200, fontWeight: 'bold', x: 740, y: 200, width: 380, height: 220, rotation: 15, fill: solidFill('#dc2626'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', effects: {}, lineHeight: 1, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'تخفیف', fontFamily: 'Lalezar', fontSize: 100, fontWeight: 'bold', x: 790, y: 410, width: 280, height: 110, rotation: 15, fill: solidFill('#b91c1c'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', effects: {}, lineHeight: 1, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'فرصت استثنایی!', fontFamily: 'Lalezar', fontSize: 110, fontWeight: 'bold', x: 50, y: 150, width: 600, height: 130, rotation: -5, fill: solidFill('#ffffff'), effects: { shadow: { color: 'rgba(0,0,0,0.2)', offsetX: 2, offsetY: 4, blur: 5 } }, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', lineHeight: 1.2, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'برای تمام محصولات منتخب', fontFamily: 'Vazirmatn', fontSize: 40, fontWeight: 'normal', x: 60, y: 300, width: 500, height: 50, rotation: -5, fill: solidFill('#fecaca'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'کد تخفیف: BAHAR1403', fontFamily: 'Vazirmatn', fontSize: 32, fontWeight: 'bold', x: 60, y: 600, width: 500, height: 40, rotation: 0, fill: solidFill('#ffffff'), effects: { outline: { color: '#b91c1c', width: 2 } }, fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
        ]
    },
    {
        id: 'cozy-cafe',
        name: 'تبلیغ کافه دنج',
        elements: [
            { type: ElementType.Shape, shape: ShapeType.Rectangle, x: 0, y: 0, width: 1280, height: 720, rotation: 0, fill: solidFill('#fdf8f2') },
            { type: ElementType.VectorShape, shapeName: 'Blob 1', x: 600, y: 50, width: 700, height: 700, rotation: 15, fill: solidFill('rgba(161, 136, 127, 0.1)') },
            { type: ElementType.Image, src: '', x: 50, y: 60, width: 680, height: 600, rotation: -3, filters: defaultImageFilters, naturalWidth: 680, naturalHeight: 600 },
            { type: ElementType.Text, text: 'کافه دنج', fontFamily: 'Lalezar', fontSize: 130, fontWeight: 'bold', x: 780, y: 150, width: 450, height: 150, rotation: 0, fill: solidFill('#5d4037'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.2, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.Text, text: 'لحظاتی گرم با طعم قهوه اصیل', fontFamily: 'Vazirmatn', fontSize: 36, fontWeight: 'normal', x: 785, y: 300, width: 440, height: 100, rotation: 0, fill: solidFill('#795548'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
            { type: ElementType.VectorShape, shapeName: 'Brush Stroke 1', x: 830, y: 370, width: 380, height: 50, rotation: 0, fill: solidFill('#ffccbc') },
            { type: ElementType.Icon, iconName: 'coffee-mug', x: 1180, y: 650, width: 40, height: 40, rotation: 0, fill: solidFill('#5d4037') },
            { type: ElementType.Text, text: 'آدرس: خیابان آرام، پلاک ۱۰', fontFamily: 'Vazirmatn', fontSize: 22, fontWeight: 'normal', x: 880, y: 658, width: 290, height: 30, rotation: 0, fill: solidFill('#5d4037'), fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', effects: {}, lineHeight: 1.5, letterSpacing: 0, textCase: 'none' },
        ],
    }
];