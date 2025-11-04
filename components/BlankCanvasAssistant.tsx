import React from 'react';
import { TemplatesIcon, WandIcon, TextIcon, UploadIcon } from './icons';

interface BlankCanvasAssistantProps {
    onSelectTemplateTab: () => void;
    onOpenAiCoPilot: () => void;
    onAddHeadline: () => void;
    onSelectUploadsTab: () => void;
}

const AssistantButton: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center text-center p-6 bg-gray-100 dark:bg-gray-800/80 rounded-lg hover:bg-white dark:hover:bg-gray-700/80 hover:scale-105 transition-all duration-200 ease-in-out shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-cyan-400 dark:hover:border-cyan-500"
    >
        <div className="mb-3 text-cyan-500 dark:text-cyan-400">{icon}</div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </button>
);

const BlankCanvasAssistant: React.FC<BlankCanvasAssistantProps> = ({
    onSelectTemplateTab,
    onOpenAiCoPilot,
    onAddHeadline,
    onSelectUploadsTab,
}) => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-8 rounded-xl bg-white/30 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-soft-2xl w-full max-w-2xl">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-lalezar tracking-wide">چطور شروع کنیم؟</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">برای شروع طراحی بیلبورد خود، یکی از گزینه‌های زیر را انتخاب کنید.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AssistantButton
                    icon={<TemplatesIcon className="w-10 h-10" />}
                    title="شروع با قالب"
                    description="یک قالب آماده را انتخاب کنید"
                    onClick={onSelectTemplateTab}
                />
                <AssistantButton
                    icon={<WandIcon className="w-10 h-10" />}
                    title="طراحی با AI"
                    description="اجازه دهید هوش مصنوعی طراحی کند"
                    onClick={onOpenAiCoPilot}
                />
                <AssistantButton
                    icon={<TextIcon className="w-10 h-10" />}
                    title="افزودن عنوان"
                    description="با یک متن اصلی شروع کنید"
                    onClick={onAddHeadline}
                />
                <AssistantButton
                    icon={<UploadIcon className="w-10 h-10" />}
                    title="آپلود تصویر"
                    description="تصویر خود را بارگذاری کنید"
                    onClick={onSelectUploadsTab}
                />
            </div>
        </div>
    );
};

export default BlankCanvasAssistant;