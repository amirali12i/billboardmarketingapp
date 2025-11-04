
import React, { useState, useCallback } from 'react';
import { generateImage, generateCopywritingSuggestions, generateLayoutSuggestions } from '../services/geminiService';
import { AiConcept, ElementType, LayoutSuggestion } from '../types';
import { LoaderIcon, WandIcon, SparklesIcon, ChevronLeftIcon } from './icons';

interface AiCoPilotModalProps {
    onClose: () => void;
    onApply: (concept: AiConcept, layout: LayoutSuggestion[]) => void;
}

type Step = 'brief' | 'concepts' | 'layout';

const AiCoPilotModal: React.FC<AiCoPilotModalProps> = ({ onClose, onApply }) => {
    const [step, setStep] = useState<Step>('brief');
    const [brief, setBrief] = useState({ productName: '', targetAudience: '', keyMessage: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [concepts, setConcepts] = useState<AiConcept[]>([]);
    const [selectedConcept, setSelectedConcept] = useState<AiConcept | null>(null);
    const [layouts, setLayouts] = useState<LayoutSuggestion[][]>([]);

    const handleBriefChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBrief(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGenerateConcepts = async () => {
        if (!brief.productName || !brief.targetAudience || !brief.keyMessage) {
            setError('لطفاً تمام فیلدها را پر کنید.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStep('concepts');

        try {
            const imagePrompt = `photorealistic billboard ad for "${brief.productName}", targeting ${brief.targetAudience}, emphasizing ${brief.keyMessage}. High-impact, clean, professional.`;

            // FIX: The `generateImage` function requires 4 arguments. Added default values for negative prompt, style, and aspect ratio.
            const [image1, image2, copy] = await Promise.all([
                generateImage(imagePrompt, '', 'Photorealistic', '16:9'),
                generateImage(imagePrompt + " (alternative style)", '', 'Photorealistic', '16:9'),
                generateCopywritingSuggestions(brief.productName, brief.targetAudience, brief.keyMessage)
            ]);

            setConcepts([
                { image: image1, headline: copy.headlines[0], slogan: copy.slogans[0] },
                { image: image2, headline: copy.headlines[1], slogan: copy.slogans[1] }
            ]);
        } catch (err) {
            console.error("Error generating concepts:", err);
            setError("خطا در ایجاد کانسپت‌ها. لطفاً دوباره تلاش کنید.");
            setStep('brief');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectConcept = async (concept: AiConcept) => {
        setSelectedConcept(concept);
        setIsLoading(true);
        setError(null);
        setStep('layout');

        try {
            const elementDetails = [
                { id: 'image1', type: ElementType.Image, width: 960, height: 540 },
                { id: 'headline1', type: ElementType.Text, width: 800, height: 120, text: concept.headline },
                { id: 'slogan1', type: ElementType.Text, width: 600, height: 60, text: concept.slogan }
            ];
            const result = await generateLayoutSuggestions(elementDetails);
            setLayouts(result);
        } catch (err) {
            console.error("Error generating layouts:", err);
            setError("خطا در ایجاد چیدمان‌ها. لطفاً دوباره تلاش کنید.");
            setStep('concepts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyLayout = (layout: LayoutSuggestion[]) => {
        if (selectedConcept) {
            onApply(selectedConcept, layout);
            onClose();
        }
    };
    
    const handleBack = () => {
        setError(null);
        if (step === 'layout') {
            setLayouts([]);
            setSelectedConcept(null);
            setStep('concepts');
        } else if (step === 'concepts') {
            setConcepts([]);
            setStep('brief');
        }
    }

    const renderBriefStep = () => (
        <>
            <h2 className="text-3xl font-bold mb-2 font-lalezar">ایده کمپین خود را توصیف کنید</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">اطلاعات زیر را وارد کنید تا جادوگر AI چندین کانسپت کامل برای شما طراحی کند.</p>
            <div className="space-y-4">
                <Input label="نام محصول یا سرویس" name="productName" value={brief.productName} onChange={handleBriefChange} placeholder="مثال: ساعت هوشمند گلکسی" />
                <Input label="مخاطب هدف" name="targetAudience" value={brief.targetAudience} onChange={handleBriefChange} placeholder="مثال: مدیران پرمشغله و علاقه‌مند به تکنولوژی" />
                <Input label="پیام یا ویژگی کلیدی" name="keyMessage" value={brief.keyMessage} onChange={handleBriefChange} placeholder="مثال: مدیریت زمان و سلامتی در یک نگاه" isTextArea />
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="mt-8 flex justify-end">
                <button onClick={handleGenerateConcepts} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg flex items-center transition-transform transform hover:scale-105">
                    <WandIcon className="w-5 h-5 me-2" />
                    <span>ایجاد کانسپت‌ها</span>
                </button>
            </div>
        </>
    );

    const renderConceptsStep = () => (
        <>
            <h2 className="text-3xl font-bold mb-2 font-lalezar">یک کانسپت را انتخاب کنید</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">AI این گزینه‌ها را بر اساس ایده شما طراحی کرده است. روی یکی کلیک کنید تا چیدمان‌های مختلف را ببینید.</p>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ConceptSkeleton />
                    <ConceptSkeleton />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {concepts.map((concept, index) => (
                        <div key={index} onClick={() => handleSelectConcept(concept)} className="bg-white dark:bg-gray-700/50 rounded-lg shadow-md hover:shadow-xl hover:ring-2 ring-cyan-500 transition-all duration-300 cursor-pointer overflow-hidden">
                            <div className="w-full aspect-video bg-gray-300 dark:bg-gray-600 relative">
                                <img src={concept.image} className="w-full h-full object-cover" alt="Generated visual" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg truncate font-lalezar">{concept.headline}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{concept.slogan}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </>
    );
    
    const renderLayoutStep = () => (
         <>
            <h2 className="text-3xl font-bold mb-2 font-lalezar">یک چیدمان را انتخاب کنید</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">این چیدمان‌ها توسط AI برای بهترین تاثیرگذاری بصری پیشنهاد شده‌اند. با کلیک، طرح نهایی به بوم شما اضافه می‌شود.</p>
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <LayoutSkeleton />
                    <LayoutSkeleton />
                    <LayoutSkeleton />
                </div>
            ) : (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {layouts.map((layout, i) => (
                        <div key={i} className="relative aspect-video bg-gray-300 dark:bg-gray-600 rounded-md p-1 overflow-hidden cursor-pointer hover:ring-2 ring-cyan-500 transition-all" onClick={() => handleApplyLayout(layout)}>
                           {selectedConcept && <img src={selectedConcept.image} className="absolute inset-0 w-full h-full object-cover opacity-30" />}
                            {layout.map(item => {
                                const style: React.CSSProperties = { position: 'absolute', left: `${(item.x / 1280) * 100}%`, top: `${(item.y / 720) * 100}%`, width: `${(item.width / 1280) * 100}%`, height: `${(item.height / 720) * 100}%`, transform: `rotate(${item.rotation}deg)`, backgroundColor: item.elementId === 'image1' ? 'rgba(107, 114, 128, 0.5)' : item.elementId === 'headline1' ? 'rgba(56, 189, 248, 0.7)' : 'rgba(156, 163, 175, 0.7)' };
                                return <div key={item.elementId} style={style} className="rounded-sm" />;
                            })}
                        </div>
                    ))}
                </div>
            )}
             {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </>
    );


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-gray-900 dark:text-white" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                         {step !== 'brief' && 
                            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                         }
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6 text-purple-500" />
                            <h1 className="text-xl font-bold">جادوگر کمپین AI</h1>
                        </div>
                    </div>
                     <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">&times;</button>
                </header>
                <main className="p-8 overflow-y-auto flex-grow">
                    {step === 'brief' && renderBriefStep()}
                    {step === 'concepts' && renderConceptsStep()}
                    {step === 'layout' && renderLayoutStep()}
                </main>
            </div>
        </div>
    );
};

const Input: React.FC<{label: string, name: string, value: string, onChange: (e: any) => void, placeholder?: string, isTextArea?: boolean}> = ({label, name, value, onChange, placeholder, isTextArea}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        {isTextArea ? (
            <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none" />
        ) : (
            <input type="text" id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200" />
        )}
    </div>
);

const ConceptSkeleton = () => (
     <div className="bg-white dark:bg-gray-700/50 rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full aspect-video bg-gray-300 dark:bg-gray-600"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
    </div>
);

const LayoutSkeleton = () => (
    <div className="relative aspect-video bg-gray-300 dark:bg-gray-600 rounded-md p-1 overflow-hidden animate-pulse">
        <div className="absolute top-[15%] left-[10%] w-[50%] h-[20%] bg-gray-400 dark:bg-gray-500 rounded-sm opacity-70"></div>
        <div className="absolute top-[40%] left-[30%] w-[60%] h-[50%] bg-gray-400 dark:bg-gray-500 rounded-sm opacity-50"></div>
    </div>
);


export default AiCoPilotModal;
