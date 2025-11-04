import React from 'react';
import { CanvasElement } from '../types';

interface SelectionBoxProps {
    element: CanvasElement;
    onMouseDown: (e: React.MouseEvent, type: 'drag' | 'resize' | 'rotate' | 'rotate-3d', position?: string) => void;
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ element, onMouseDown }) => {
    
    const controlPoints = [
        { cursor: 'nwse-resize', position: 'top-left', type: 'tl' },
        { cursor: 'ns-resize', position: 'top-center', type: 'tc' },
        { cursor: 'nesw-resize', position: 'top-right', type: 'tr' },
        { cursor: 'ew-resize', position: 'middle-left', type: 'ml' },
        { cursor: 'ew-resize', position: 'middle-right', type: 'mr' },
        { cursor: 'nesw-resize', position: 'bottom-left', type: 'bl' },
        { cursor: 'ns-resize', position: 'bottom-center', type: 'bc' },
        { cursor: 'nwse-resize', position: 'bottom-right', type: 'br' },
    ];
    
     const rotation3dHandles = [
        { cursor: 'ns-resize', position: 'top-center', type: 't' },
        { cursor: 'ns-resize', position: 'bottom-center', type: 'b' },
        { cursor: 'ew-resize', position: 'middle-left', type: 'l' },
        { cursor: 'ew-resize', position: 'middle-right', type: 'r' },
    ];

    return (
        <div
            id={`selection-box-${element.id}`}
            className="absolute pointer-events-none"
            style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: `rotate(${element.rotation}deg)`,
                zIndex: 9999,
            }}
        >
            <div 
              className="absolute inset-0 outline outline-2 outline-cyan-400"
            >
                {/* Resize handles */}
                {controlPoints.map(p => (
                     <div
                        key={p.position}
                        className={`absolute w-3 h-3 bg-white border-2 border-cyan-500 rounded-full pointer-events-auto transform -translate-x-1/2 -translate-y-1/2`}
                        style={{ 
                            cursor: p.cursor,
                            top: p.position.includes('top') ? '0%' : p.position.includes('bottom') ? '100%' : '50%',
                            left: p.position.includes('left') ? '0%' : p.position.includes('right') ? '100%' : '50%',
                        }}
                        onMouseDown={(e) => onMouseDown(e, 'resize', p.type)}
                     />
                ))}
                 {/* 3D Rotation Handles */}
                {rotation3dHandles.map(p => (
                    <div
                        key={p.type}
                        className="absolute bg-cyan-500 border-2 border-white pointer-events-auto"
                        style={{
                            cursor: p.cursor,
                            top: p.position.includes('top') ? '0%' : p.position.includes('bottom') ? '100%' : '50%',
                            left: p.position.includes('left') ? '0%' : p.position.includes('right') ? '100%' : '50%',
                            ...(p.type === 't' || p.type === 'b' ? { width: '24px', height: '6px' } : { width: '6px', height: '24px' }),
                            transform: `translate(-50%, -50%) translate(${p.type === 'l' ? '-10px' : p.type === 'r' ? '10px' : '0'}, ${p.type === 't' ? '-10px' : p.type === 'b' ? '10px' : '0'})`,
                            borderRadius: '3px',
                        }}
                        onMouseDown={(e) => onMouseDown(e, 'rotate-3d', p.type)}
                    />
                ))}
                {/* Rotation handle */}
                <div 
                    className="absolute w-3 h-3 bg-white border-2 border-cyan-500 rounded-full pointer-events-auto transform -translate-x-1/2 -translate-y-full"
                    style={{
                        top: '-15px',
                        left: '50%',
                        cursor: 'alias',
                    }}
                    onMouseDown={(e) => onMouseDown(e, 'rotate')}
                />
                 <div className="absolute w-px h-4 bg-cyan-400 transform -translate-x-1/2" style={{ top: '-15px', left: '50%' }}></div>
            </div>
        </div>
    );
};

export default SelectionBox;