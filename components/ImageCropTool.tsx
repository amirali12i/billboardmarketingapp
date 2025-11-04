import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageElement } from '../types';

interface ImageCropToolProps {
    element: ImageElement;
    onUpdateElement: (id: string, updates: Partial<ImageElement>, recordHistory?: boolean) => void;
    scale: number;
}

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>

const ImageCropTool: React.FC<ImageCropToolProps> = ({ element, onUpdateElement, scale }) => {
    const [crop, setCrop] = useState(element.crop || { x: 0, y: 0, width: 1, height: 1 });
    const imageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const actionRef = useRef<{ type: string; startX: number; startY: number; initialCrop: typeof crop } | null>(null);

    const handleConfirm = () => {
        onUpdateElement(element.id, { crop, isCropping: false });
    };

    const handleCancel = () => {
        onUpdateElement(element.id, { isCropping: false });
    };

    const handleMouseDown = (e: React.MouseEvent, type: string) => {
        e.stopPropagation();
        actionRef.current = { type, startX: e.clientX, startY: e.clientY, initialCrop: crop };
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!actionRef.current || !imageRef.current) return;
        
        const { naturalWidth, naturalHeight } = element;
        const { width: displayWidth, height: displayHeight } = imageRef.current.getBoundingClientRect();
        
        const scaleX = naturalWidth / displayWidth;
        const scaleY = naturalHeight / displayHeight;

        const dx = (e.clientX - actionRef.current.startX) * scaleX / naturalWidth;
        const dy = (e.clientY - actionRef.current.startY) * scaleY / naturalHeight;
        
        const { initialCrop } = actionRef.current;
        let newCrop = { ...initialCrop };

        if (actionRef.current.type === 'move') {
            newCrop.x = initialCrop.x + dx;
            newCrop.y = initialCrop.y + dy;
        } else {
            if (actionRef.current.type.includes('r')) newCrop.width = initialCrop.width + dx;
            if (actionRef.current.type.includes('l')) { newCrop.width = initialCrop.width - dx; newCrop.x = initialCrop.x + dx; }
            if (actionRef.current.type.includes('b')) newCrop.height = initialCrop.height + dy;
            if (actionRef.current.type.includes('t')) { newCrop.height = initialCrop.height - dy; newCrop.y = initialCrop.y + dy; }
        }

        // Clamp values
        newCrop.width = Math.max(0.01, Math.min(1, newCrop.width));
        newCrop.height = Math.max(0.01, Math.min(1, newCrop.height));
        newCrop.x = Math.max(0, Math.min(newCrop.x, 1 - newCrop.width));
        newCrop.y = Math.max(0, Math.min(newCrop.y, 1 - newCrop.height));

        setCrop(newCrop);
    }, [element.naturalWidth, element.naturalHeight]);

    const handleMouseUp = useCallback(() => {
        actionRef.current = null;
    }, []);
    
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const cropBoxStyle: React.CSSProperties = {
        left: `${crop.x * 100}%`,
        top: `${crop.y * 100}%`,
        width: `${crop.width * 100}%`,
        height: `${crop.height * 100}%`,
    };

    const controlPoints = [
        { cursor: 'nwse-resize', position: 'top-left', type: 'tl' }, { cursor: 'ns-resize', position: 'top-center', type: 't' },
        { cursor: 'nesw-resize', position: 'top-right', type: 'tr' }, { cursor: 'ew-resize', position: 'middle-left', type: 'l' },
        { cursor: 'ew-resize', position: 'middle-right', type: 'r' }, { cursor: 'nesw-resize', position: 'bottom-left', type: 'bl' },
        { cursor: 'ns-resize', position: 'bottom-center', type: 'b' }, { cursor: 'nwse-resize', position: 'bottom-right', type: 'br' },
    ];

    return (
        <div ref={overlayRef} className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="relative" style={{ maxWidth: '90vw', maxHeight: '80vh' }}>
                <img ref={imageRef} src={element.src} alt="Cropping" className="max-w-full max-h-full object-contain" />
                <div className="absolute inset-0">
                    <div className="absolute outline outline-4 outline-white/50 pointer-events-auto cursor-move" style={cropBoxStyle} onMouseDown={(e) => handleMouseDown(e, 'move')}>
                        <div className="absolute inset-0" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}/>
                        {controlPoints.map(p => (
                             <div key={p.position} onMouseDown={(e) => handleMouseDown(e, p.type)}
                                className={`absolute w-3 h-3 bg-white border-2 border-cyan-500 rounded-full transform -translate-x-1/2 -translate-y-1/2`}
                                style={{ cursor: p.cursor, top: p.position.includes('top') ? '0%' : p.position.includes('bottom') ? '100%' : '50%', left: p.position.includes('left') ? '0%' : p.position.includes('right') ? '100%' : '50%' }} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 flex gap-4">
                <button onClick={handleCancel} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"><CloseIcon /></button>
                <button onClick={handleConfirm} className="p-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"><CheckIcon /></button>
            </div>
        </div>
    );
};

export default ImageCropTool;