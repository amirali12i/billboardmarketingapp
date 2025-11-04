import React, { useRef, useState } from 'react';
import { Page, CanvasElement, TextElement } from '../types';
import { PagePlusIcon, TrashIcon, DuplicateIcon } from './icons';

interface PagePreviewProps {
    page: Page;
}

const PagePreview: React.FC<PagePreviewProps> = ({ page }) => {
    return (
        <div className="w-full aspect-video bg-gray-300 dark:bg-gray-600 rounded-sm p-1 flex items-center justify-center overflow-hidden relative">
            {page.elements.map((el, index) => {
                const style: React.CSSProperties = {
                    position: 'absolute',
                    left: `${(el.x / 1280) * 100}%`,
                    top: `${(el.y / 720) * 100}%`,
                    width: `${(el.width / 1280) * 100}%`,
                    height: `${(el.height / 720) * 100}%`,
                    transform: `rotate(${el.rotation}deg)`,
                    opacity: el.visible === false ? 0.3 : 1,
                };

                if (el.type === 'IMAGE') return <div key={index} style={style} className="bg-gray-500/70"></div>;
                if (el.type === 'TEXT') {
                    const textEl = el as TextElement;
                    const color = textEl.fill.type === 'SOLID' ? textEl.fill.color : '#CCCCCC';
                    return <div key={index} style={{ ...style, backgroundColor: color, opacity: 0.5 }}></div>;
                }
                if (el.type === 'SHAPE' || el.type === 'VECTOR_SHAPE' || el.type === 'ICON') {
                    const color = el.fill.type === 'SOLID' ? el.fill.color : '#94a3b8';
                    return <div key={index} style={{ ...style, backgroundColor: color, opacity: 0.6 }}></div>;
                }
                return null;
            })}
        </div>
    );
};

interface PagesPanelProps {
    pages: Page[];
    activePageIndex: number;
    onAddPage: () => void;
    onDeletePage: (index: number) => void;
    onDuplicatePage: (index: number) => void;
    onSelectPage: (index: number) => void;
    onReorderPages: (startIndex: number, endIndex: number) => void;
}

const PagesPanel: React.FC<PagesPanelProps> = ({ pages, activePageIndex, onAddPage, onDeletePage, onDuplicatePage, onSelectPage, onReorderPages }) => {
    const draggedItemIndex = useRef<number | null>(null);
    const [dropIndicator, setDropIndicator] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        draggedItemIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (index: number) => {
        if (draggedItemIndex.current !== null && draggedItemIndex.current !== index) {
            setDropIndicator(index);
        }
    };

    const handleDragEnd = () => {
        draggedItemIndex.current = null;
        setDropIndicator(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedItemIndex.current === null) return;

        let targetIndex = dropIndex;
        if(draggedItemIndex.current < dropIndex) {
            targetIndex = dropIndex;
        } else {
            targetIndex = dropIndex;
        }

        onReorderPages(draggedItemIndex.current, targetIndex);
        handleDragEnd();
    };


    return (
        <div className="w-full bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 flex-shrink-0 p-2 flex items-center gap-3 z-10">
            <button
                onClick={onAddPage}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-cyan-600 text-gray-800 dark:text-white transition-colors h-28 w-28 flex-shrink-0"
                title="افزودن صفحه جدید"
            >
                <PagePlusIcon className="w-8 h-8 mb-1" />
                <span className="text-sm">صفحه جدید</span>
            </button>
            <div className="w-px h-24 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
            <div className="flex-grow flex items-center gap-4 overflow-x-auto py-2">
                {pages.map((page, index) => (
                    <div
                        key={page.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={e => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, index)}
                        onClick={() => onSelectPage(index)}
                        className={`relative group flex-shrink-0 w-36 cursor-pointer p-1 rounded-lg transition-all duration-200 ${activePageIndex === index ? 'bg-cyan-600' : 'bg-gray-100/50 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        <span className="absolute top-1.5 right-1.5 text-xs font-bold z-10 text-gray-900 dark:text-white">{index + 1}</span>
                        <div className="flex items-center gap-1 absolute bottom-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={(e) => { e.stopPropagation(); onDuplicatePage(index); }} className="p-1 rounded-full bg-gray-800/70 hover:bg-cyan-500 text-white" title="تکثیر صفحه"><DuplicateIcon className="w-3 h-3"/></button>
                             <button onClick={(e) => { e.stopPropagation(); onDeletePage(index); }} className="p-1 rounded-full bg-gray-800/70 hover:bg-red-500 text-white" title="حذف صفحه"><TrashIcon className="w-3 h-3"/></button>
                        </div>
                        <PagePreview page={page} />
                        {dropIndicator === index && <div className={`absolute top-0 bottom-0 ${draggedItemIndex.current !== null && draggedItemIndex.current > index ? 'left-0' : 'right-0'} w-1 bg-cyan-400 rounded-full`}></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PagesPanel;