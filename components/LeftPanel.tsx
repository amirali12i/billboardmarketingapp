import React, { useState, useMemo, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageIcon, LoaderIcon, WandIcon, TextIcon, ShapesIcon, LayersIcon, BrandKitIcon, TriangleIcon, StarIcon, VectorShapeIcon, PentagonIcon, HexagonIcon, OctagonIcon, RhombusIcon, CrossIcon, UploadIcon, SparklesIcon, TemplatesIcon, QuillIcon, AspectRatio16x9Icon, AspectRatio1x1Icon, AspectRatio9x16Icon, AspectRatio4x3Icon, AspectRatio3x4Icon } from './icons';
import { ElementType, ShapeType, CanvasElement, Fill, BrandKit, TextElement, GradientFill, LayoutSuggestion, Template } from '../types';
import LayersPanel from './LayersPanel';
import BrandKitPanel from './BrandKitPanel';
import CopywritingAssistant from './CopywritingAssistant';
import { iconLibrary } from '../data/icon-library';
import { shapeLibrary } from '../data/shape-library';
import UserUploadsPanel from './UserUploadsPanel';
import { templates } from '../data/templates';
import { getMaskPath } from '../utils/maskPaths';

interface LeftPanelProps {
  activeTab: string;
  onAddElement: (type: ElementType, options: any) => void;
  elements: CanvasElement[];
  onReorderElements: (startIndex: number, endIndex: number) => void;
  selectedElementIds: string[];
  onSetSelectedElementIds: (ids: string[]) => void;
  brandKit: BrandKit;
  onUpdateBrandKit: (updates: Partial<BrandKit>) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onToggleProperty: (ids: string[], prop: 'locked' | 'visible') => void;
  userUploads: string[];
  onAddUserUpload: (imageData: string) => void;
  onRemoveUserUpload: (index: number) => void;
  onSelectTemplate: (template: Template) => void;
  onOpenAiCoPilot: () => void;
}

const gradientFill = (colors: string[], angle: number = 135): GradientFill => {
    return {
        type: 'GRADIENT',
        gradient: {
            type: 'LINEAR',
            angle: angle,
            stops: colors.map((c, i) => ({ offset: i / (colors.length - 1), color: c }))
        }
    }
};

const Section: React.FC<{icon: React.ReactNode, title: string, children: React.ReactNode, border?: boolean}> = ({icon, title, children, border = true}) => (
    <div className={border ? "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700" : ""}>
        <div className="flex items-center mb-4">
            {icon}
            <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {children}
    </div>
);

// --- High-Fidelity Preview Renderer ---
// FIX: Corrected the type of 'el' to be `Template['elements'][number]` which is a distributive union of Omit types.
// This allows TypeScript to correctly narrow the type of `el` within the switch statement, resolving property access errors.
const renderPreviewElement = (el: Template['elements'][number], index: number) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${(el.x / 1280) * 100}%`,
        top: `${(el.y / 720) * 100}%`,
        width: `${(el.width / 1280) * 100}%`,
        height: `${(el.height / 720) * 100}%`,
        transform: `rotate(${el.rotation}deg)`,
    };

    const getFillStyle = (fill: Fill): React.CSSProperties => {
        if (fill.type === 'SOLID') return { backgroundColor: fill.color };
        const grad = fill.gradient;
        const stops = grad.stops.map(s => `${s.color} ${s.offset * 100}%`).join(', ');
        if (grad.type === 'LINEAR') return { background: `linear-gradient(${grad.angle}deg, ${stops})` };
        return { background: `radial-gradient(circle at ${grad.cx * 100}% ${grad.cy * 100}%, ${stops})` };
    };

    switch(el.type) {
        case ElementType.Image:
            return <div key={index} style={style} className="bg-gray-400 dark:bg-gray-500 flex items-center justify-center"><ImageIcon className="w-1/4 h-1/4 text-gray-500 dark:text-gray-400 opacity-50"/></div>;
        case ElementType.Text:
            let fillStyle: React.CSSProperties = {};
            if (el.fill.type === 'SOLID') {
                fillStyle.color = el.fill.color;
            } else {
                fillStyle = getFillStyle(el.fill);
                fillStyle.WebkitBackgroundClip = 'text';
                fillStyle.backgroundClip = 'text';
                fillStyle.color = 'transparent';
            }
            return <div key={index} style={{
                ...style,
                ...fillStyle,
                fontSize: `${Math.max(el.fontSize / 10, 4)}px`,
                fontFamily: el.fontFamily,
                fontWeight: el.fontWeight,
                textAlign: el.textAlign,
                lineHeight: el.lineHeight,
                letterSpacing: `${el.letterSpacing / 10}px`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'flex',
                alignItems: 'center',
                justifyContent: el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start',
            }}>{el.text || 'Aa'}</div>;
        case ElementType.Shape:
            return <div key={index} style={{
                ...style,
                ...getFillStyle(el.fill),
                maskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${el.width} ${el.height}'><path d='${getMaskPath(el.shape, el.width, el.height)}'/></svg>`)}")`,
                WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${el.width} ${el.height}'><path d='${getMaskPath(el.shape, el.width, el.height)}'/></svg>`)}")`,
                maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
            }}></div>;
        case ElementType.VectorShape:
            const shapeData = shapeLibrary.find(s => s.name === el.shapeName);
            if (!shapeData) return null;
            return <div key={index} style={{
                ...style,
                ...getFillStyle(el.fill),
                maskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${shapeData.viewBox}'><path d='${shapeData.path}'/></svg>`)}")`,
                WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${shapeData.viewBox}'><path d='${shapeData.path}'/></svg>`)}")`,
                maskSize: 'contain', WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center', WebkitMaskPosition: 'center',
            }}></div>;
        case ElementType.Icon:
            const iconData = iconLibrary[el.iconName];
            if (!iconData) return null;
            const iconSVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${iconData.viewBox}' fill='black'>${iconData.paths.map(p => `<path d='${p}'/>`).join('')}</svg>`;
            return <div key={index} style={{
                ...style,
                backgroundColor: el.fill.type === 'SOLID' ? el.fill.color : '#ccc',
                maskImage: `url("data:image/svg+xml,${encodeURIComponent(iconSVG)}")`,
                WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(iconSVG)}")`,
                maskSize: 'contain', WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center', WebkitMaskPosition: 'center',
            }}></div>;
        default:
            return null;
    }
};

const TemplatesPanel: React.FC<{ onSelectTemplate: (template: Template) => void }> = ({ onSelectTemplate }) => {
    const TemplatePreview: React.FC<{ template: Template }> = ({ template }) => {
        const backgroundEl = template.elements.find(el => el.type === ElementType.Shape && el.x === 0 && el.y === 0 && el.width === 1280 && el.height === 720);
        let backgroundStyle: React.CSSProperties = { backgroundColor: '#e5e7eb' }; // default light gray
        if (backgroundEl && backgroundEl.type === ElementType.Shape) {
            if (backgroundEl.fill.type === 'SOLID') {
                backgroundStyle = { backgroundColor: backgroundEl.fill.color };
            } else {
                const grad = backgroundEl.fill.gradient;
                const stops = grad.stops.map(s => `${s.color} ${s.offset * 100}%`).join(', ');
                 if (grad.type === 'LINEAR') {
                    backgroundStyle = { background: `linear-gradient(${grad.angle}deg, ${stops})` };
                } else {
                    backgroundStyle = { background: `radial-gradient(circle at ${grad.cx*100}% ${grad.cy*100}%, ${stops})` };
                }
            }
        }
        
        return (
            <div className="w-full aspect-video rounded-md overflow-hidden relative" style={backgroundStyle}>
                {template.elements.map((el, index) => {
                    if (el === backgroundEl) return null; // Skip rendering background element again
                    return renderPreviewElement(el, index);
                })}
            </div>
        );
    };

    return (
        <>
            <Section icon={<TemplatesIcon className="w-6 h-6 me-3 text-amber-400" />} title="قالب‌ها" border={false}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">برای شروع، یک قالب را انتخاب کنید. محتوای فعلی صفحه جایگزین خواهد شد.</p>
                <div className="grid grid-cols-1 gap-4">
                    {templates.map((template) => (
                        <div key={template.id} onClick={() => onSelectTemplate(template)} className="bg-white dark:bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 hover:ring-2 hover:ring-amber-400 transition-all duration-200">
                            <TemplatePreview template={template} />
                            <p className="text-center text-sm font-semibold mt-2">{template.name}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
};

const MagicStudioPanel: React.FC<Pick<LeftPanelProps, 'onAddElement' | 'onOpenAiCoPilot'>> = ({ onAddElement, onOpenAiCoPilot }) => {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState('Photorealistic');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3' | '3:4'>('16:9');

    const [isLoading, setIsLoading] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const styles = ['Photorealistic', 'Cinematic', 'Anime', 'Fantasy Art', 'Minimalist', '3D Model'];
    type AspectRatioOption = { id: '16:9' | '1:1' | '9:16' | '4:3' | '3:4'; icon: React.FC<React.SVGProps<SVGSVGElement>>; name: string };
    const aspectRatios: AspectRatioOption[] = [
        { id: '16:9', icon: AspectRatio16x9Icon, name: 'Landscape' },
        { id: '1:1', icon: AspectRatio1x1Icon, name: 'Square' },
        { id: '9:16', icon: AspectRatio9x16Icon, name: 'Portrait' },
        { id: '4:3', icon: AspectRatio4x3Icon, name: 'Standard' },
        { id: '3:4', icon: AspectRatio3x4Icon, name: 'Vertical' },
    ];

    const handleGenerateImage = async () => {
        if (!prompt.trim()) { setError('لطفاً یک توصیف برای تصویر وارد کنید.'); return; }
        setIsLoading(true); setError(null);
        try {
            const imageUrl = await generateImage(prompt, negativePrompt, style, aspectRatio);
            setGeneratedImages(prev => [imageUrl, ...prev]);
        } catch (err) {
            setError('خطا در ایجاد تصویر. لطفاً دوباره تلاش کنید.');
            console.error(err);
        } finally { setIsLoading(false); }
    };

    const handleAddImageToCanvas = (imageUrl: string) => {
        onAddElement(ElementType.Image, { src: imageUrl, filters: { opacity: 1, brightness: 1, contrast: 1, grayscale: 0, saturate: 1, hueRotate: 0 } });
    };
    
    const SettingsGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</label>
            {children}
        </div>
    );

    return (
        <>
            <Section icon={<SparklesIcon className="w-6 h-6 me-3 text-purple-400" />} title="جادوگر AI" border={false}>
                <button
                    onClick={onOpenAiCoPilot}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg mb-6"
                >
                    <WandIcon className="w-6 h-6 me-3" />
                    <span>ساخت کمپین کامل</span>
                </button>
            </Section>

            <Section icon={<WandIcon className="w-6 h-6 me-3 text-purple-400" />} title="ابزار هوشمند" border={false}>
                 <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">توصیف تصویر (Prompt)</label>
                    <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="مثال: یک خودروی اسپرت قرمز در جاده ساحلی" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-sm h-20 resize-none" rows={3} disabled={isLoading}/>
                    
                     <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 mt-3">آنچه نمی‌خواهید (Negative Prompt)</label>
                    <textarea id="negative-prompt" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="مثال: متن، واترمارک، زشت، تار" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-sm h-16 resize-none" rows={2} disabled={isLoading}/>
                    
                    <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">تنظیمات پیشرفته</h3>
                         <SettingsGroup title="سبک">
                            <div className="flex flex-wrap gap-2">
                                {styles.map(s => (
                                    <button key={s} onClick={() => setStyle(s)} disabled={isLoading}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${style === s ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </SettingsGroup>
                        <SettingsGroup title="نسبت تصویر">
                            <div className="flex items-center justify-between gap-2">
                                {aspectRatios.map(ar => (
                                    <button key={ar.id} onClick={() => setAspectRatio(ar.id)} disabled={isLoading} title={ar.name}
                                        className={`p-2 rounded-lg transition-colors w-full flex justify-center ${aspectRatio === ar.id ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                                        <ar.icon className="w-6 h-6" />
                                    </button>
                                ))}
                            </div>
                        </SettingsGroup>
                    </div>

                    {error && <p className="text-red-500 dark:text-red-400 text-xs mt-3">{error}</p>}
                    <button onClick={handleGenerateImage} disabled={isLoading} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105">
                        {isLoading ? <><LoaderIcon className="w-5 h-5 me-2" /><span>در حال ساخت...</span></> : <><WandIcon className="w-5 h-5 me-2" /><span>ایجاد تصویر</span></>}
                    </button>
                </div>
                <div className="mt-4 flex-grow min-h-[150px]">
                    <div className="grid grid-cols-2 gap-3">
                        {isLoading && (<div className="relative aspect-video bg-gray-300 dark:bg-gray-600 rounded-lg overflow-hidden"><div className="absolute inset-0 bg-shimmer-gradient animate-shimmer" style={{ backgroundSize: '2000px 100%' }} /></div>)}
                        {generatedImages.map((img, index) => (
                            <div key={index} className="group relative cursor-pointer" onClick={() => handleAddImageToCanvas(img)}>
                                <img src={img} alt={`Generated image ${index + 1}`} className="w-full h-auto object-cover rounded-lg aspect-video" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300 rounded-lg"><span className="text-white opacity-0 group-hover:opacity-100 font-bold">افزودن به بوم</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
            <CopywritingAssistant onAddElement={onAddElement} />
        </>
    )
};

const TextPanel: React.FC<{ onAddElement: (type: ElementType, options: any) => void }> = ({ onAddElement }) => {
    const handleAddText = (options: { text: string; fontSize: number; fontWeight: 'bold' | 'normal', fontFamily: 'Vazirmatn' | 'Lalezar', effects?: TextElement['effects'], fill?: Fill }) => {
        onAddElement(ElementType.Text, { ...options, width: options.text.length * options.fontSize * 0.7, height: options.fontSize * 1.5, lineHeight: 1.5, letterSpacing: 0, textCase: 'none', });
    };
    return (
        <>
            <Section icon={<TextIcon className="w-6 h-6 me-3 text-lime-400" />} title="متن" border={false}>
                <div className="space-y-2">
                    <button onClick={() => handleAddText({text: 'عنوان اصلی', fontSize: 72, fontWeight: 'bold', fontFamily: 'Lalezar'})} className="w-full text-right bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors transform hover:scale-[1.02]">اضافه کردن عنوان</button>
                    <button onClick={() => handleAddText({text: 'متن خود را اینجا وارد کنید', fontSize: 36, fontWeight: 'normal', fontFamily: 'Vazirmatn'})} className="w-full text-right bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors transform hover:scale-[1.02]">اضافه کردن متن بدنه</button>
                </div>
            </Section>
            <Section icon={<WandIcon className="w-6 h-6 me-3 text-purple-400" />} title="متن‌های هنری">
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleAddText({text: 'نئون', fontSize: 90, fontWeight: 'bold', fontFamily: 'Lalezar', fill: {type: 'SOLID', color: '#f472b6'}, effects: { shadow: { color: '#06b6d4', offsetX: 0, offsetY: 0, blur: 20 } }})} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-all transform hover:scale-105">درخشش نئونی</button>
                    <button onClick={() => handleAddText({text: 'طلایی', fontSize: 90, fontWeight: 'bold', fontFamily: 'Lalezar', fill: gradientFill(['#fde047', '#eab308', '#ca8a04'], 90), effects: { threeD: { depth: 3, color: '#a16207', direction: 135 } }})} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-all transform hover:scale-105">طلای مذاب</button>
                    <button onClick={() => handleAddText({text: 'اقیانوس', fontSize: 90, fontWeight: 'bold', fontFamily: 'Lalezar', fill: gradientFill(['#7dd3fc', '#0ea5e9'], 45), effects: { outline: { color: '#0369a1', width: 3}, shadow: {color: 'rgba(0,0,0,0.3)', offsetX: 2, offsetY: 4, blur: 5} }})} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-all transform hover:scale-105">اقیانوسی</button>
                    <button onClick={() => handleAddText({text: 'آتشین', fontSize: 90, fontWeight: 'bold', fontFamily: 'Lalezar', fill: gradientFill(['#f97316', '#ef4444', '#fde047'], 90), effects: { shadow: { color: '#7f1d1d', offsetX: 0, offsetY: 2, blur: 15}}})} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-all transform hover:scale-105">آتشین</button>
                </div>
            </Section>
        </>
    )
}

const ElementsPanel: React.FC<{ onAddElement: (type: ElementType, options: any) => void }> = ({ onAddElement }) => {
    const [iconSearch, setIconSearch] = useState('');
    const defaultFill: Fill = { type: 'SOLID', color: '#cbd5e1' };
    const handleAddShape = (shape: ShapeType) => onAddElement(ElementType.Shape, { shape, width: 200, height: 200, fill: defaultFill });
    const handleAddIcon = (iconName: string) => onAddElement(ElementType.Icon, { iconName, width: 100, height: 100 });
    const handleAddVectorShape = (shapeName: string) => onAddElement(ElementType.VectorShape, { shapeName, width: 200, height: 200 });
    const filteredIcons = useMemo(() => {
        if (!iconSearch.trim()) return Object.entries(iconLibrary);
        return Object.entries(iconLibrary).filter(([name]) => name.toLowerCase().includes(iconSearch.toLowerCase()));
    }, [iconSearch]);

    return (
        <>
            <Section icon={<ShapesIcon className="w-6 h-6 me-3 text-fuchsia-400" />} title="اشکال ساده" border={false}>
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleAddShape(ShapeType.Rectangle)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2">مستطیل</button>
                    <button onClick={() => handleAddShape(ShapeType.Oval)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2">بیضی</button>
                    <button onClick={() => handleAddShape(ShapeType.Triangle)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"><TriangleIcon className="w-4 h-4" /> مثلث</button>
                    <button onClick={() => handleAddShape(ShapeType.Star)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"><StarIcon className="w-4 h-4" /> ستاره</button>
                    <button onClick={() => handleAddShape(ShapeType.Pentagon)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"><PentagonIcon className="w-4 h-4" /> ۵ضلعی</button>
                    <button onClick={() => handleAddShape(ShapeType.Hexagon)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"><HexagonIcon className="w-4 h-4" /> ۶ضلعی</button>
                    <button onClick={() => handleAddShape(ShapeType.Octagon)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"><OctagonIcon className="w-4 h-4" /> ۸ضلعی</button>
                    <button onClick={() => handleAddShape(ShapeType.Rhombus)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"><RhombusIcon className="w-4 h-4" /> لوزی</button>
                    <button onClick={() => handleAddShape(ShapeType.Cross)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center gap-2"><CrossIcon className="w-4 h-4" /> بعلاوه</button>
                </div>
            </Section>
            <Section icon={<VectorShapeIcon className="w-6 h-6 me-3 text-rose-400" />} title="اشکال برداری">
                <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
                    {shapeLibrary.map((shape) => (
                        <button key={shape.name} onClick={() => handleAddVectorShape(shape.name)} className="flex flex-col items-center justify-center gap-2 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors" title={shape.name}>
                            <svg viewBox={shape.viewBox} className="w-10 h-10 fill-current text-gray-700 dark:text-gray-300" preserveAspectRatio="xMidYMid meet"><path d={shape.path} /></svg>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{shape.name}</span>
                        </button>
                    ))}
                </div>
            </Section>
            <Section icon={<ImageIcon className="w-6 h-6 me-3 text-teal-400" />} title="آیکون‌ها">
                 <input type="text" value={iconSearch} onChange={e => setIconSearch(e.target.value)} placeholder="جستجوی آیکون..." className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm mb-3"/>
                <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-2">
                    {filteredIcons.map(([name, data]) => (
                        <button key={name} onClick={() => handleAddIcon(name)} className="text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center justify-center" title={name}>
                            <svg viewBox={data.viewBox} className="w-8 h-8 text-gray-700 dark:text-gray-300">
                                {data.paths.map((d, i) => <path key={i} d={d} fill="currentColor" stroke="none" />)}
                            </svg>
                        </button>
                    ))}
                </div>
            </Section>
        </>
    );
};


const LeftPanel: React.FC<LeftPanelProps> = (props) => {
  const { activeTab, onOpenAiCoPilot, ...rest } = props;

  const renderContent = () => {
    switch(activeTab) {
        case 'templates': return <TemplatesPanel onSelectTemplate={rest.onSelectTemplate} />;
        case 'magic': return <MagicStudioPanel onAddElement={rest.onAddElement} onOpenAiCoPilot={onOpenAiCoPilot} />;
        case 'text': return <TextPanel onAddElement={rest.onAddElement} />;
        case 'elements': return <ElementsPanel onAddElement={rest.onAddElement} />;
        case 'uploads': return <UserUploadsPanel uploads={rest.userUploads} onUpload={rest.onAddUserUpload} onRemove={rest.onRemoveUserUpload} onAddElement={rest.onAddElement} />;
        case 'layers': return <LayersPanel elements={rest.elements} onReorder={rest.onReorderElements} selectedElementIds={rest.selectedElementIds} onSetSelectedElementIds={rest.onSetSelectedElementIds} onGroup={rest.onGroup} onUngroup={rest.onUngroup} onToggleProperty={rest.onToggleProperty} />;
        case 'brandkit': return <BrandKitPanel brandKit={rest.brandKit} onUpdateBrandKit={rest.onUpdateBrandKit} onAddElement={rest.onAddElement} />;
        default: return <TemplatesPanel onSelectTemplate={rest.onSelectTemplate} />;
    }
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800/95 flex flex-col h-full overflow-hidden text-gray-900 dark:text-white">
      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;