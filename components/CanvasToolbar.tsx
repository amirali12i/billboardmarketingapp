import React, { useState, useRef, useEffect } from 'react';
import { CanvasElement, ElementType, Fill, ImageElement, TextElement, GradientFill, BlendMode, SolidFill, LinearGradient, RadialGradient, Gradient } from '../types';
import { 
    DuplicateIcon, TrashIcon, AdjustmentsVerticalIcon, GroupIcon, UngroupIcon,
    BoldIcon, ItalicIcon, UnderlineIcon, 
    AlignLeftIcon, AlignCenterIcon, AlignRightIcon, 
    AlignTopIcon, AlignMiddleIcon, AlignBottomIcon, 
    DistributeHorizontalIcon, DistributeVerticalIcon,
    LetterCaseCapitalizeIcon, LetterCaseLowercaseIcon, LetterCaseUppercaseIcon, LetterCaseResetIcon,
    FlipHorizontalIcon, FlipVerticalIcon, PathIcon, PaintBrushIcon,
    LockClosedIcon,
    SparklesIcon,
    LoaderIcon
} from './icons';

type AlignType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'distribute-horizontal' | 'distribute-vertical';

interface CanvasToolbarProps {
  selectedElements: CanvasElement[];
  onDelete: () => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>, recordHistory?: boolean) => void;
  brandColors: string[];
  onStartColorPick: (onPick: (color: string) => void) => void;
  onAlign: (type: AlignType) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onDuplicate: () => void;
  canGroup: boolean;
  canUngroup: boolean;
  onGenerateLayouts: () => void;
  isLayoutLoading: boolean;
}


// --- Reusable Components ---
const ToolButton: React.FC<{ title: string, onClick: (e: React.MouseEvent) => void, children: React.ReactNode, isActive?: boolean, disabled?: boolean, className?: string }> = ({ title, onClick, children, isActive, disabled, className = '' }) => (
    <button
        title={title}
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'bg-cyan-500 text-white' : 'hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600'} ${className}`}
    >
        {children}
    </button>
);
const Divider = () => <div className="w-px h-6 bg-white/20 dark:bg-gray-600/50 mx-2" />;

const EyeDropperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.369-2.185A8.25 8.25 0 0 1 12 3.75c1.242 0 2.42.33 3.462.915z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.375a3.375 3.375 0 0 0-3.375 3.375A3.375 3.375 0 0 0 12 19.125a3.375 3.375 0 0 0 3.375-3.375A3.375 3.375 0 0 0 12 12.375z" />
    </svg>
);
const CropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5m13.5-3.75H18A2.25 2.25 0 0120.25 6v1.5m-3.75 12.75V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
    </svg>
);

// --- Contextual Control Sets ---
const FilterSlider: React.FC<{label: string, value: number, onUpdate: (val: number) => void, onFinalUpdate: () => void, min: number, max: number, step: number}> = ({label, value, onUpdate, onFinalUpdate, ...props}) => (
    <div className="flex items-center gap-2 w-full text-sm">
        <label className="w-20 text-xs text-gray-600 dark:text-gray-300">{label}</label>
        <input type="range" {...props} value={value} 
            onChange={e => onUpdate(parseFloat(e.target.value))} 
            onMouseUp={onFinalUpdate}
            onTouchEnd={onFinalUpdate}
            className="w-full" 
        />
        <span className="w-10 text-right text-xs">{Math.round(value * 100) / 100}</span>
    </div>
);

const TextControls: React.FC<{ elements: TextElement[], onUpdate: (updates: Partial<TextElement>, recordHistory?: boolean) => void }> = ({ elements, onUpdate}) => {
    const singleSelection = elements[0];
    return (
        <>
            <select value={singleSelection.fontFamily} onChange={e => onUpdate({ fontFamily: e.target.value as any })} className="bg-black/10 dark:bg-gray-700/50 rounded p-1.5 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm">
                <option value="Vazirmatn">وزیرمتن</option>
                <option value="Lalezar">لاله‌زار</option>
            </select>
            <input 
                type="number" 
                title="اندازه فونت"
                value={singleSelection.fontSize} 
                onChange={e => onUpdate({ fontSize: Math.max(1, parseInt(e.target.value, 10)) }, false)}
                onBlur={() => onUpdate({ fontSize: singleSelection.fontSize }, true)}
                className="w-16 bg-black/10 dark:bg-gray-700/50 rounded p-1.5 text-center border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm" />
             <input 
                type="number"
                title="فاصله حروف"
                step={0.5}
                value={singleSelection.letterSpacing}
                onChange={e => onUpdate({ letterSpacing: parseFloat(e.target.value) || 0 }, false)}
                onBlur={() => onUpdate({ letterSpacing: singleSelection.letterSpacing }, true)}
                className="w-16 bg-black/10 dark:bg-gray-700/50 rounded p-1.5 text-center border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm"
            />
            
            <Divider />
            <ToolButton title="سبک وزیر ضخیم" onClick={() => onUpdate({ fontFamily: 'Vazirmatn', fontWeight: 'bold' })} isActive={singleSelection.fontFamily === 'Vazirmatn' && singleSelection.fontWeight === 'bold'}><BoldIcon className="w-5 h-5" /></ToolButton>
            <ToolButton title="کج" onClick={() => onUpdate({ fontStyle: singleSelection.fontStyle === 'italic' ? 'normal' : 'italic' })} isActive={singleSelection.fontStyle === 'italic'}><ItalicIcon className="w-5 h-5" /></ToolButton>
            <ToolButton title="زیرخط" onClick={() => onUpdate({ textDecoration: singleSelection.textDecoration === 'underline' ? 'none' : 'underline' })} isActive={singleSelection.textDecoration === 'underline'}><UnderlineIcon className="w-5 h-5" /></ToolButton>
            <Divider />
            <div className="flex items-center gap-0.5 bg-black/10 dark:bg-gray-700/50 p-0.5 rounded-md">
                <ToolButton title="چپ چین" onClick={() => onUpdate({ textAlign: 'left' })} isActive={singleSelection.textAlign === 'left'}><AlignLeftIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="وسط چین" onClick={() => onUpdate({ textAlign: 'center' })} isActive={singleSelection.textAlign === 'center'}><AlignCenterIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="راست چین" onClick={() => onUpdate({ textAlign: 'right' })} isActive={singleSelection.textAlign === 'right'}><AlignRightIcon className="w-5 h-5" /></ToolButton>
            </div>
            <Divider />
            <div className="flex items-center gap-0.5 bg-black/10 dark:bg-gray-700/50 p-0.5 rounded-md">
                <ToolButton title="حروف بزرگ" onClick={() => onUpdate({ textCase: 'uppercase' })} isActive={singleSelection.textCase === 'uppercase'}><LetterCaseUppercaseIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="حروف کوچک" onClick={() => onUpdate({ textCase: 'lowercase' })} isActive={singleSelection.textCase === 'lowercase'}><LetterCaseLowercaseIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="حالت عنوان" onClick={() => onUpdate({ textCase: 'capitalize' })} isActive={singleSelection.textCase === 'capitalize'}><LetterCaseCapitalizeIcon className="w-5 h-5" /></ToolButton>
                <ToolButton title="بازنشانی حالت" onClick={() => onUpdate({ textCase: 'none' })} isActive={singleSelection.textCase === 'none'}><LetterCaseResetIcon className="w-5 h-5" /></ToolButton>
            </div>
             {singleSelection.path && (
                <>
                <Divider />
                <div className="flex items-center gap-2 p-1 bg-black/10 dark:bg-gray-700/50 rounded-md">
                    <PathIcon className="w-5 h-5 ms-1" />
                    <input 
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        title="شروع متن روی مسیر"
                        value={singleSelection.path.startOffset}
                        onChange={e => onUpdate({ path: { ...singleSelection.path!, startOffset: parseFloat(e.target.value) } }, false)}
                        onMouseUp={() => onUpdate({ path: singleSelection.path }, true)}
                        className="w-24"
                    />
                </div>
                </>
             )}
        </>
    );
};

const AlignmentControls: React.FC<{ onAlign: CanvasToolbarProps['onAlign'] }> = ({ onAlign }) => {
    const alignmentButtons = [
        { type: 'left', icon: AlignLeftIcon, title: 'چپ چین' }, { type: 'center', icon: AlignCenterIcon, title: 'وسط چین افقی' }, { type: 'right', icon: AlignRightIcon, title: 'راست چین' },
        { type: 'top', icon: AlignTopIcon, title: 'تراز از بالا' }, { type: 'middle', icon: AlignMiddleIcon, title: 'وسط چین عمودی' }, { type: 'bottom', icon: AlignBottomIcon, title: 'تراز از پایین' },
    ] as const;
    const distributionButtons = [
        { type: 'distribute-horizontal', icon: DistributeHorizontalIcon, title: 'توزیع افقی' }, { type: 'distribute-vertical', icon: DistributeVerticalIcon, title: 'توزیع عمودی' },
    ] as const;
    return (
        <div className="flex items-center gap-1 p-1 bg-black/10 dark:bg-gray-700/50 rounded-md">
            {alignmentButtons.map(({ type, icon: Icon, title }) => (
                <ToolButton key={type} onClick={() => onAlign(type)} title={title}><Icon className="w-5 h-5" /></ToolButton>
            ))}
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
            {distributionButtons.map(({ type, icon: Icon, title }) => (
                <ToolButton key={type} onClick={() => onAlign(type)} title={title}><Icon className="w-5 h-5" /></ToolButton>
            ))}
        </div>
    );
};


const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ selectedElements, onDelete, onUpdateElement, brandColors, onStartColorPick, onAlign, onGroup, onUngroup, onDuplicate, canGroup, canUngroup, onGenerateLayouts, isLayoutLoading }) => {
  const singleSelection = selectedElements.length === 1 ? selectedElements[0] : null;
  const onlyTextElementsSelected = selectedElements.length > 0 && selectedElements.every(el => el.type === ElementType.Text);
  const isSelectionLocked = selectedElements.some(el => el.locked);

  const handleUpdate = (updates: Partial<CanvasElement>, recordHistory: boolean = true) => {
    selectedElements.forEach(el => onUpdateElement(el.id, updates, recordHistory));
  };

  if (selectedElements.length === 0) return null;

  return (
    <div 
        className="absolute top-[88px] left-1/2 -translate-x-1/2 w-auto max-w-fit bg-white/30 dark:bg-gray-900/50 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 dark:border-gray-700/50 flex items-center gap-1 p-2 z-20"
        onMouseDown={(e) => e.stopPropagation()} // Prevents deselecting elements when clicking toolbar
    >
      {isSelectionLocked ? (
        <div className="flex items-center gap-2 px-3 text-sm">
          <LockClosedIcon className="w-5 h-5 text-yellow-400" />
          <span>قفل شده</span>
        </div>
      ) : (
        <>
          {/* CONTEXTUAL CONTROLS */}
          {onlyTextElementsSelected && <TextControls elements={selectedElements as TextElement[]} onUpdate={handleUpdate} />}
          {singleSelection && <ToolButton title='سبک' onClick={() => {}}><PaintBrushIcon className="w-5 h-5" /></ToolButton>}
          
          {selectedElements.length > 1 && <AlignmentControls onAlign={onAlign} />}
          {selectedElements.length > 1 && (
              <ToolButton title="چیدمان هوشمند" onClick={onGenerateLayouts} disabled={isLayoutLoading}>
                  {isLayoutLoading ? <LoaderIcon className="w-5 h-5 animate-spin"/> : <SparklesIcon className="w-5 h-5 text-purple-400"/>}
              </ToolButton>
          )}
          
          <Divider />

          {/* COMMON ACTIONS */}
           <ToolButton title="برگردان افقی" onClick={() => handleUpdate({ flippedHorizontal: !singleSelection?.flippedHorizontal })}><FlipHorizontalIcon className="w-5 h-5" /></ToolButton>
           <ToolButton title="برگردان عمودی" onClick={() => handleUpdate({ flippedVertical: !singleSelection?.flippedVertical })}><FlipVerticalIcon className="w-5 h-5" /></ToolButton>
            
          {selectedElements.length > 1 && (
            <>
              <Divider />
              <ToolButton title="گروه" onClick={onGroup} disabled={!canGroup}><GroupIcon className="w-5 h-5" /></ToolButton>
              <ToolButton title="باز کردن گروه" onClick={onUngroup} disabled={!canUngroup}><UngroupIcon className="w-5 h-5" /></ToolButton>
            </>
          )}
          <Divider />
          <ToolButton title="تکثیر" onClick={onDuplicate}><DuplicateIcon className="w-5 h-5" /></ToolButton>
          <ToolButton title="حذف" onClick={onDelete}><TrashIcon className="w-5 h-5 text-red-400" /></ToolButton>
        </>
      )}
    </div>
  );
};

export default CanvasToolbar;