import React, { useMemo, useRef, useEffect, useState } from 'react';
import { TextElement, Fill } from '../types';
import { BoldIcon, ItalicIcon, UnderlineIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, LetterCaseCapitalizeIcon, LetterCaseLowercaseIcon, LetterCaseUppercaseIcon, LetterCaseResetIcon } from './icons';

interface TextToolbarProps {
    selectedElements: TextElement[];
    onUpdateElement: (id: string, updates: Partial<TextElement>, recordHistory?: boolean) => void;
    brandColors: string[];
    onStartColorPick: (onPick: (color: string) => void) => void;
    canvasTransform: { scale: number; offset: { x: number; y: number } };
    workspaceRef: React.RefObject<HTMLDivElement>;
}

const ToolButton: React.FC<{ title: string, onClick: () => void, children: React.ReactNode, isActive?: boolean, className?: string }> = ({ title, onClick, children, isActive, className = '' }) => (
    <button
        title={title}
        onClick={onClick}
        className={`p-2 rounded transition-colors transform hover:scale-110 ${isActive ? 'bg-cyan-500 text-white' : 'hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600'} ${className}`}
    >
        {children}
    </button>
);

const Divider = () => <div className="w-px h-6 bg-white/20 dark:bg-gray-600/50 mx-1" />;

const EyeDropperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.369-2.185A8.25 8.25 0 0 1 12 3.75c1.242 0 2.42.33 3.462.915z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.375a3.375 3.375 0 0 0-3.375 3.375A3.375 3.375 0 0 0 12 19.125a3.375 3.375 0 0 0 3.375-3.375A3.375 3.375 0 0 0 12 12.375z" />
  </svg>
);

const FillControl: React.FC<{ fill: Fill, onUpdate: (updates: {fill: Fill}) => void, brandColors: string[], onStartColorPick: (onPick: (color: string) => void) => void }> = ({ fill, onUpdate, brandColors, onStartColorPick }) => {
    const currentColor = fill.type === 'SOLID' ? fill.color : '#000000';
    const handleColorChange = (color: string) => onUpdate({ fill: { type: 'SOLID', color } });
    return (
        <div className="flex items-center gap-1 p-1 bg-black/10 dark:bg-gray-700/50 rounded-md">
            <ToolButton title="انتخاب رنگ از صفحه" onClick={() => onStartColorPick(handleColorChange)}>
                <EyeDropperIcon className="w-5 h-5" />
            </ToolButton>
            {brandColors.slice(0, 4).map(color => (
                <button key={color} onClick={() => handleColorChange(color)} style={{ backgroundColor: color }} className={`w-6 h-6 rounded-sm border-2 ${currentColor.toLowerCase() === color.toLowerCase() ? 'border-cyan-400' : 'border-transparent'}`} />
            ))}
            <input type="color" value={currentColor} onChange={e => handleColorChange(e.target.value)} className="w-8 h-6 rounded-sm border-none bg-transparent cursor-pointer" />
        </div>
    );
};

const TextToolbar: React.FC<TextToolbarProps> = ({ selectedElements, onUpdateElement, brandColors, onStartColorPick, canvasTransform, workspaceRef }) => {
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [toolbarWidth, setToolbarWidth] = useState(600);
    const singleSelection = selectedElements[0];

    useEffect(() => {
        if (toolbarRef.current) {
            setToolbarWidth(toolbarRef.current.offsetWidth);
        }
    }, [selectedElements]);

    const toolbarStyle = useMemo(() => {
        if (!workspaceRef.current || !singleSelection) return { display: 'none' };
        
        const bbox = selectedElements.reduce((acc, el) => ({
            minX: Math.min(acc.minX, el.x),
            minY: Math.min(acc.minY, el.y),
            maxX: Math.max(acc.maxX, el.x + el.width),
            maxY: Math.max(acc.maxY, el.y + el.height),
        }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

        const workspaceRect = workspaceRef.current.getBoundingClientRect();
        const toolbarHeight = 52;
        const gap = 10;

        const bboxOnScreen = {
            top: (bbox.minY * canvasTransform.scale) + canvasTransform.offset.y,
            left: (bbox.minX * canvasTransform.scale) + canvasTransform.offset.x,
            width: (bbox.maxX - bbox.minX) * canvasTransform.scale,
            height: (bbox.maxY - bbox.minY) * canvasTransform.scale,
        };

        let top = bboxOnScreen.top - toolbarHeight - gap;
        if (top < workspaceRect.top + 10) {
            top = bboxOnScreen.top + bboxOnScreen.height + gap;
        }

        let left = bboxOnScreen.left + (bboxOnScreen.width / 2) - (toolbarWidth / 2);
        left = Math.max(workspaceRect.left + 5, Math.min(left, workspaceRect.right - toolbarWidth - 5));

        return {
            position: 'fixed' as const,
            top: `${top}px`,
            left: `${left}px`,
        };
    }, [selectedElements, canvasTransform, workspaceRef, singleSelection, toolbarWidth]);

    if (!singleSelection) return null;

    const handleUpdate = (updates: Partial<TextElement>, recordHistory: boolean = true) => {
        selectedElements.forEach(el => onUpdateElement(el.id, updates, recordHistory));
    };

    return (
        <div ref={toolbarRef} style={toolbarStyle} className="w-auto bg-white/30 dark:bg-gray-900/50 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 dark:border-gray-700/50 flex items-center gap-1 p-2 z-30" onMouseDown={e => e.stopPropagation()}>
            <select value={singleSelection.fontFamily} onChange={e => handleUpdate({ fontFamily: e.target.value as any })} className="bg-black/10 dark:bg-gray-700/50 rounded p-1.5 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm">
                <option value="Vazirmatn">وزیرمتن</option>
                <option value="Lalezar">لاله‌زار</option>
            </select>
            <input 
                type="number" 
                title="اندازه فونت"
                value={singleSelection.fontSize} 
                onChange={e => handleUpdate({ fontSize: Math.max(1, parseInt(e.target.value, 10)) }, false)}
                onBlur={() => handleUpdate({ fontSize: singleSelection.fontSize }, true)}
                className="w-16 bg-black/10 dark:bg-gray-700/50 rounded p-1.5 text-center border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm" />
             <input 
                type="number"
                title="فاصله حروف"
                step={0.5}
                value={singleSelection.letterSpacing}
                onChange={e => handleUpdate({ letterSpacing: parseFloat(e.target.value) || 0 }, false)}
                onBlur={() => handleUpdate({ letterSpacing: singleSelection.letterSpacing }, true)}
                className="w-16 bg-black/10 dark:bg-gray-700/50 rounded p-1.5 text-center border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm"
            />
            
            <FillControl fill={singleSelection.fill} onUpdate={(updates) => handleUpdate(updates)} brandColors={brandColors} onStartColorPick={onStartColorPick} />
            
            <Divider />

            <ToolButton title="ضخیم" onClick={() => handleUpdate({ fontWeight: singleSelection.fontWeight === 'bold' ? 'normal' : 'bold' })} isActive={singleSelection.fontWeight === 'bold'}><BoldIcon className="w-5 h-5" /></ToolButton>
            <ToolButton title="کج" onClick={() => handleUpdate({ fontStyle: singleSelection.fontStyle === 'italic' ? 'normal' : 'italic' })} isActive={singleSelection.fontStyle === 'italic'}><ItalicIcon className="w-5 h-5" /></ToolButton>
            <ToolButton title="زیرخط" onClick={() => handleUpdate({ textDecoration: singleSelection.textDecoration === 'underline' ? 'none' : 'underline' })} isActive={singleSelection.textDecoration === 'underline'}><UnderlineIcon className="w-5 h-5" /></ToolButton>
            
            <Divider />
            
            <div className="flex items-center gap-0.5 bg-black/10 dark:bg-gray-700/50 p-0.5 rounded-md">
                <ToolButton title="چپ چین" onClick={() => handleUpdate({ textAlign: 'left' })} isActive={singleSelection.textAlign === 'left'} className="rounded-r-none"><AlignLeftIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="وسط چین" onClick={() => handleUpdate({ textAlign: 'center' })} isActive={singleSelection.textAlign === 'center'} className="rounded-none"><AlignCenterIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="راست چین" onClick={() => handleUpdate({ textAlign: 'right' })} isActive={singleSelection.textAlign === 'right'} className="rounded-l-none"><AlignRightIcon className="w-5 h-5" /></ToolButton>
            </div>

            <Divider />

            <div className="flex items-center gap-0.5 bg-black/10 dark:bg-gray-700/50 p-0.5 rounded-md">
                <ToolButton title="حروف بزرگ" onClick={() => handleUpdate({ textCase: 'uppercase' })} isActive={singleSelection.textCase === 'uppercase'}><LetterCaseUppercaseIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="حروف کوچک" onClick={() => handleUpdate({ textCase: 'lowercase' })} isActive={singleSelection.textCase === 'lowercase'}><LetterCaseLowercaseIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="حالت عنوان" onClick={() => handleUpdate({ textCase: 'capitalize' })} isActive={singleSelection.textCase === 'capitalize'}><LetterCaseCapitalizeIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="بازنشانی حالت" onClick={() => handleUpdate({ textCase: 'none' })} isActive={singleSelection.textCase === 'none'}><LetterCaseResetIcon className="w-5 h-5" /></ToolButton>
            </div>
        </div>
    );
}

export default TextToolbar;