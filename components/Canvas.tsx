

import React, { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import { CanvasElement, ElementType, Fill, ImageElement, ShapeElement, TextElement, GroupElement, IconElement, VectorShapeElement } from '../types';
import SelectionBox from './SelectionBox';
import { iconLibrary } from '../data/icon-library';
import { shapeLibrary } from '../data/shape-library';
import { getMaskPath } from '../utils/maskPaths';
import ImageCropTool from './ImageCropTool';
import { getSvgDefs, getTextSvgProps } from '../utils/pathUtils';

interface CanvasProps {
    elements: CanvasElement[];
    onUpdateElement: (id: string, updates: Partial<CanvasElement>, recordHistory?: boolean) => void;
    onUpdateElements: (updates: { id: string; updates: Partial<CanvasElement> }[]) => void;
    selectedElementIds: string[];
    onSetSelectedElementIds: (ids: string[]) => void;
    scale: number;
    offset: { x: number, y: number };
    onOpenContextMenu: (position: { x: number, y: number }) => void;
}

const getFillProps = (id: string, fill: Fill): { defs: React.ReactNode, fill: string } => {
    if (fill.type === 'SOLID') {
        return { defs: null, fill: fill.color };
    }

    if (fill.type === 'GRADIENT') {
        const gradientId = `gradient-${id}`;
        const gradient = fill.gradient;

        if (gradient.type === 'LINEAR') {
            const rad = gradient.angle * (Math.PI / 180);
            const endX = Math.cos(rad);
            const endY = Math.sin(rad);
            const start = { x: 0.5 - endX / 2, y: 0.5 - endY / 2 };
            const end = { x: 0.5 + endX / 2, y: 0.5 + endY / 2 };
            
            const defs = (
                <defs>
                    <linearGradient id={gradientId} x1={`${start.x * 100}%`} y1={`${start.y * 100}%`} x2={`${end.x * 100}%`} y2={`${end.y * 100}%`}>
                        {gradient.stops.map(stop => <stop key={`${stop.offset}-${stop.color}`} offset={`${stop.offset * 100}%`} stopColor={stop.color} />)}
                    </linearGradient>
                </defs>
            );
            return { defs, fill: `url(#${gradientId})` };
        }
        
        if (gradient.type === 'RADIAL') {
            const { cx, cy, r, stops } = gradient;
            const defs = (
               <defs>
                   <radialGradient id={gradientId} cx={`${cx * 100}%`} cy={`${cy * 100}%`} r={`${r * 100}%`}>
                       {stops.map(stop => <stop key={`${stop.offset}-${stop.color}`} offset={`${stop.offset * 100}%`} stopColor={stop.color} />)}
                   </radialGradient>
               </defs>
           );
           return { defs, fill: `url(#${gradientId})` };
       }
    }
    return { defs: null, fill: 'transparent' };
};

const Canvas: React.FC<CanvasProps> = ({ elements, onUpdateElement, onUpdateElements, selectedElementIds, onSetSelectedElementIds, scale, offset, onOpenContextMenu }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const editingTextareaRef = useRef<HTMLTextAreaElement>(null);
  const actionRef = useRef<{
      type: 'drag' | 'resize' | 'rotate' | 'rotate-3d';
      initialClientX: number;
      initialClientY: number;
      initialElements: CanvasElement[]; 
      targetElement: CanvasElement;
      position?: string;
      idsToTransform: string[];
      shiftKey: boolean;
  } | null>(null);

  const elementsById = useMemo(() => new Map<string, CanvasElement>(elements.map(el => [el.id, el])), [elements]);
  
  const childrenByGroupId = useMemo(() => {
    const map = new Map<string, CanvasElement[]>();
    for (const el of elements) {
      if (el.groupId) {
        if (!map.has(el.groupId)) map.set(el.groupId, []);
        map.get(el.groupId)!.push(el);
      }
    }
    for (const children of map.values()) {
        children.sort((a,b) => a.zIndex - b.zIndex);
    }
    return map;
  }, [elements]);
  
  const isElementLocked = useCallback((element: CanvasElement): boolean => {
      if (element.locked) return true;
      if (element.groupId) {
          const group = elementsById.get(element.groupId);
          if (group) return isElementLocked(group);
      }
      return false;
  }, [elementsById]);

  // --- High-Performance Transformation Logic ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!actionRef.current || !canvasRef.current) return;

    const { type, initialClientX, initialClientY, initialElements, targetElement, idsToTransform, position } = actionRef.current;
    
    const dx = e.clientX - initialClientX;
    const dy = e.clientY - initialClientY;

    switch (type) {
        case 'drag': {
            idsToTransform.forEach(id => {
                const node = canvasRef.current!.querySelector(`[data-element-id="${id}"]`) as HTMLElement;
                const selectionNode = document.getElementById(`selection-box-${id}`);
                const initialEl = initialElements.find(el => el.id === id)!;
                const baseTransform = `rotateX(${initialEl.rotationX || 0}deg) rotateY(${initialEl.rotationY || 0}deg) rotate(${initialEl.rotation}deg) scaleX(${initialEl.flippedHorizontal ? -1 : 1}) scaleY(${initialEl.flippedVertical ? -1 : 1})`;
                const dragTransform = `translate(${dx / scale}px, ${dy / scale}px)`;
                if (node) node.style.transform = `${dragTransform} ${baseTransform}`;
                if (selectionNode) selectionNode.style.transform = `${dragTransform} rotate(${initialEl.rotation}deg)`;
            });
            break;
        }
        case 'rotate': {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const initialTargetState = initialElements.find(el => el.id === targetElement.id)!;
            const centerX = canvasRect.left + (initialTargetState.x + initialTargetState.width / 2) * scale + offset.x;
            const centerY = canvasRect.top + (initialTargetState.y + initialTargetState.height / 2) * scale + offset.y;
            
            const startAngle = Math.atan2(initialClientY - centerY, initialClientX - centerX);
            const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            
            const rotation = initialTargetState.rotation + (currentAngle - startAngle) * (180 / Math.PI);
            
            const node = canvasRef.current!.querySelector(`[data-element-id="${targetElement.id}"]`) as HTMLElement;
            const selectionNode = document.getElementById(`selection-box-${targetElement.id}`);
            const baseTransform = `rotateX(${initialTargetState.rotationX || 0}deg) rotateY(${initialTargetState.rotationY || 0}deg) scaleX(${initialTargetState.flippedHorizontal ? -1 : 1}) scaleY(${initialTargetState.flippedVertical ? -1 : 1})`;
            const newTransform = `rotate(${rotation}deg) ${baseTransform}`;
            
            if (node) node.style.transform = newTransform;
            if (selectionNode) selectionNode.style.transform = `rotate(${rotation}deg)`;
            break;
        }
        case 'rotate-3d': {
            const initialTargetState = initialElements.find(el => el.id === targetElement.id)!;
            let newRotationX = initialTargetState.rotationX || 0;
            let newRotationY = initialTargetState.rotationY || 0;
            const sensitivity = 0.5;

            if (position === 't' || position === 'b') {
                const direction = position === 't' ? 1 : -1;
                newRotationX = (initialTargetState.rotationX || 0) + dy * sensitivity * direction;
            }
            if (position === 'l' || position === 'r') {
                const direction = position === 'l' ? -1 : 1;
                newRotationY = (initialTargetState.rotationY || 0) + dx * sensitivity * direction;
            }

            const node = canvasRef.current!.querySelector(`[data-element-id="${targetElement.id}"]`) as HTMLElement;
            if (node) {
                const newTransform = `rotateX(${newRotationX}deg) rotateY(${newRotationY}deg) rotate(${initialTargetState.rotation}deg) scaleX(${initialTargetState.flippedHorizontal ? -1 : 1}) scaleY(${initialTargetState.flippedVertical ? -1 : 1})`;
                node.style.transform = newTransform;
            }
            break;
        }
        case 'resize': {
            const initialTargetState = initialElements.find(el => el.id === targetElement.id)!;
            const { x, y, width, height, rotation } = initialTargetState;
            
            const rad = rotation * (Math.PI / 180);
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            const dxRot = (dx * cos + dy * sin) / scale;
            const dyRot = (-dx * sin + dy * cos) / scale;

            let dw = 0, dh = 0;

            if (position?.includes('r')) dw = dxRot;
            if (position?.includes('l')) dw = -dxRot;
            if (position?.includes('b')) dh = dyRot;
            if (position?.includes('t')) dh = -dyRot;
            
            if(actionRef.current.shiftKey && position && position.length === 2) {
                const aspectRatio = width / height;
                if (Math.abs(dw) > Math.abs(dh)) {
                    dh = dw / aspectRatio * (position.includes('t') || position.includes('b') ? 1 : Math.sign(dh));
                } else {
                    dw = dh * aspectRatio * (position.includes('l') || position.includes('r') ? 1 : Math.sign(dw));
                }
            }

            let newWidth = width + dw;
            let newHeight = height + dh;
            
            if (newWidth < 10 || newHeight < 10) break;
            
            const dxOffset = position?.includes('l') ? dw : 0;
            const dyOffset = position?.includes('t') ? dh : 0;

            const dxWorldOffset = dxOffset * cos - dyOffset * sin;
            const dyWorldOffset = dxOffset * sin + dyOffset * cos;

            const newX = x - dxWorldOffset;
            const newY = y - dyWorldOffset;

            const node = canvasRef.current!.querySelector(`[data-element-id="${targetElement.id}"]`) as HTMLElement;
            const selectionNode = document.getElementById(`selection-box-${targetElement.id}`);
            
            if (node) {
                node.style.left = `${newX}px`;
                node.style.top = `${newY}px`;
                node.style.width = `${newWidth}px`;
                node.style.height = `${newHeight}px`;
            }
            if (selectionNode) {
                selectionNode.style.left = `${newX}px`;
                selectionNode.style.top = `${newY}px`;
                selectionNode.style.width = `${newWidth}px`;
                selectionNode.style.height = `${newHeight}px`;
            }
            break;
        }
    }
  }, [scale, offset]);
  
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!actionRef.current) return;
    const { type, initialClientX, initialClientY, initialElements, targetElement, idsToTransform, position } = actionRef.current;
    
    const dx = e.clientX - initialClientX;
    const dy = e.clientY - initialClientY;
    const updates: { id: string; updates: Partial<CanvasElement> }[] = [];

    switch (type) {
        case 'drag':
            idsToTransform.forEach(id => {
                const initialEl = initialElements.find(el => el.id === id)!;
                updates.push({ id, updates: { x: initialEl.x + dx / scale, y: initialEl.y + dy / scale } });
            });
            break;
        case 'rotate': {
            const canvasRect = canvasRef.current!.getBoundingClientRect();
            const initialTargetState = initialElements.find(el => el.id === targetElement.id)!;
            const centerX = canvasRect.left + (initialTargetState.x + initialTargetState.width / 2) * scale + offset.x;
            const centerY = canvasRect.top + (initialTargetState.y + initialTargetState.height / 2) * scale + offset.y;
            const startAngle = Math.atan2(initialClientY - centerY, initialClientX - centerX);
            const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const rotation = initialTargetState.rotation + (currentAngle - startAngle) * (180 / Math.PI);
            updates.push({ id: targetElement.id, updates: { rotation } });
            break;
        }
        case 'rotate-3d': {
            const initialTargetState = initialElements.find(el => el.id === targetElement.id)!;
            let newRotationX = initialTargetState.rotationX || 0;
            let newRotationY = initialTargetState.rotationY || 0;
            const sensitivity = 0.5;

            if (position === 't' || position === 'b') {
                const direction = position === 't' ? 1 : -1;
                newRotationX = (initialTargetState.rotationX || 0) + dy * sensitivity * direction;
            }
            if (position === 'l' || position === 'r') {
                const direction = position === 'l' ? -1 : 1;
                newRotationY = (initialTargetState.rotationY || 0) + dx * sensitivity * direction;
            }
            updates.push({ id: targetElement.id, updates: { rotationX: newRotationX, rotationY: newRotationY } });
            break;
        }
        case 'resize': {
            const initialTargetState = initialElements.find(el => el.id === targetElement.id)!;
            const { x, y, width, height, rotation } = initialTargetState;
            const rad = rotation * (Math.PI / 180);
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            const dxRot = (dx * cos + dy * sin) / scale;
            const dyRot = (-dx * sin + dy * cos) / scale;

            let dw = 0, dh = 0;
            if (position?.includes('r')) dw = dxRot;
            if (position?.includes('l')) dw = -dxRot;
            if (position?.includes('b')) dh = dyRot;
            if (position?.includes('t')) dh = -dyRot;

            if(actionRef.current.shiftKey && position && position.length === 2) {
                const aspectRatio = width / height;
                 if (Math.abs(dw) > Math.abs(dh)) {
                    dh = dw / aspectRatio * (position.includes('t') || position.includes('b') ? 1 : Math.sign(dh));
                } else {
                    dw = dh * aspectRatio * (position.includes('l') || position.includes('r') ? 1 : Math.sign(dw));
                }
            }

            let newWidth = width + dw;
            let newHeight = height + dh;
            
            if (newWidth < 10) { newWidth = 10; dw = 10 - width; }
            if (newHeight < 10) { newHeight = 10; dh = 10 - height; }
            
            const dxOffset = position?.includes('l') ? dw : 0;
            const dyOffset = position?.includes('t') ? dh : 0;
            
            const dxWorldOffset = dxOffset * cos - dyOffset * sin;
            const dyWorldOffset = dxOffset * sin + dyOffset * cos;

            const newX = x - dxWorldOffset;
            const newY = y - dyWorldOffset;

            updates.push({ id: targetElement.id, updates: { x: newX, y: newY, width: newWidth, height: newHeight } });
            break;
        }
    }
    
    if (updates.length > 0) {
        onUpdateElements(updates);
    }
    
    // Cleanup temporary styles after state commit to ensure smooth handoff to React rendering
    idsToTransform.forEach(id => {
        const node = canvasRef.current?.querySelector(`[data-element-id="${id}"]`) as HTMLElement;
        const selectionNode = document.getElementById(`selection-box-${id}`);
        const finalUpdate = updates.find(u => u.id === id)?.updates;
        const finalElementState = { ...initialElements.find(el => el.id === id)!, ...finalUpdate };

        if (node) {
            node.style.transform = `rotateX(${finalElementState.rotationX || 0}deg) rotateY(${finalElementState.rotationY || 0}deg) rotate(${finalElementState.rotation}deg) scaleX(${finalElementState.flippedHorizontal ? -1 : 1}) scaleY(${finalElementState.flippedVertical ? -1 : 1})`;
            node.style.left = `${finalElementState.x}px`;
            node.style.top = `${finalElementState.y}px`;
            node.style.width = `${finalElementState.width}px`;
            node.style.height = `${finalElementState.height}px`;
        }
        if (selectionNode) {
            selectionNode.style.transform = `rotate(${finalElementState.rotation}deg)`;
            selectionNode.style.left = `${finalElementState.x}px`;
            selectionNode.style.top = `${finalElementState.y}px`;
            selectionNode.style.width = `${finalElementState.width}px`;
            selectionNode.style.height = `${finalElementState.height}px`;
        }
    });

    actionRef.current = null;
  }, [onUpdateElements, scale, offset]);

  useEffect(() => {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
      const handleGlobalMouseUp = (e: MouseEvent) => handleMouseUp(e);
      
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
          window.removeEventListener('mousemove', handleGlobalMouseMove);
          window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
  }, [handleMouseMove, handleMouseUp]);


  const handleMouseDown = (e: React.MouseEvent, element: CanvasElement, type: 'drag' | 'resize' | 'rotate' | 'rotate-3d', position?: string) => {
    if (isElementLocked(element)) return;
    e.preventDefault();
    e.stopPropagation();

    const targetId = element.groupId || element.id;
    if (!e.shiftKey && !selectedElementIds.includes(targetId)) {
        onSetSelectedElementIds([targetId]);
    } else if (e.shiftKey) {
        const newSelection = selectedElementIds.includes(targetId)
            ? selectedElementIds.filter(id => id !== targetId)
            : [...selectedElementIds, targetId];
        onSetSelectedElementIds(newSelection);
    }
    
    const idsToTransform = (type === 'drag' && selectedElementIds.includes(targetId)) ? selectedElementIds : [targetId];
    
    actionRef.current = {
        type,
        initialClientX: e.clientX,
        initialClientY: e.clientY,
        initialElements: JSON.parse(JSON.stringify(elements)),
        targetElement: element,
        position,
        idsToTransform,
        shiftKey: e.shiftKey,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id === 'canvas-area') {
        onSetSelectedElementIds([]);
    }
    const currentlyEditing = elements.find(el => el.type === ElementType.Text && el.isEditing);
    if(currentlyEditing) {
        onUpdateElement(currentlyEditing.id, { isEditing: false });
    }
  };
  
  const handleElementDoubleClick = (id: string) => {
     const element = elements.find(el => el.id === id);
     if (element && !isElementLocked(element)) {
         if (element.type === ElementType.Text) {
            onUpdateElement(id, { isEditing: true });
         } else if (element.type === ElementType.Image) {
            onUpdateElement(id, { isCropping: true });
            onSetSelectedElementIds([]);
         }
     }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const elementNode = target.closest('[data-element-id]');
    
    if (elementNode) {
        const targetElementId = elementNode.getAttribute('data-element-id');
        const element = elements.find(el => el.id === targetElementId);

        if (element && !isElementLocked(element)) {
            const idToSelect = element.groupId || element.id;
            if (!selectedElementIds.includes(idToSelect)) {
                onSetSelectedElementIds([idToSelect]);
            }
        } else {
          onSetSelectedElementIds([]);
        }
    } else {
        onSetSelectedElementIds([]);
    }
    
    onOpenContextMenu({ x: e.clientX, y: e.clientY });
  };


  useEffect(() => {
    if (editingTextareaRef.current) {
        const textarea = editingTextareaRef.current;
        textarea.focus();
        textarea.select();
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [elements]);

  const renderElementContent = (el: CanvasElement) => {
    switch (el.type) {
      case ElementType.Image: {
        const imgEl = el as ImageElement;
        const wrapperStyle: React.CSSProperties = {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        };
        if (imgEl.mask) {
            wrapperStyle.clipPath = `path('${getMaskPath(imgEl.mask, imgEl.width, imgEl.height)}')`;
        }
        
        const crop = imgEl.crop || { x: 0, y: 0, width: 1, height: 1 };
        const imgStyle: React.CSSProperties = {
            position: 'absolute',
            width: `${(1 / crop.width) * 100}%`,
            height: `${(1 / crop.height) * 100}%`,
            left: `${-crop.x * (1 / crop.width) * 100}%`,
            top: `${-crop.y * (1 / crop.height) * 100}%`,
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: imgEl.filters.opacity,
            filter: `brightness(${imgEl.filters.brightness}) contrast(${imgEl.filters.contrast}) grayscale(${imgEl.filters.grayscale}) saturate(${imgEl.filters.saturate}) hue-rotate(${imgEl.filters.hueRotate}deg)`,
        };

        return (
            <div style={wrapperStyle}>
                <img src={imgEl.src} draggable="false" className="object-cover" style={imgStyle} />
                {imgEl.isCropping && (
                    <ImageCropTool
                        element={imgEl}
                        onUpdateElement={onUpdateElement}
                        scale={scale}
                    />
                )}
            </div>
        );
      }
      case ElementType.Text: {
        const textEl = el as TextElement;

        if (textEl.isEditing) {
            const getTextStyleForEditing = (el: TextElement): React.CSSProperties => ({
                fontSize: `${el.fontSize}px`,
                fontWeight: el.fontWeight,
                fontFamily: el.fontFamily,
                fontStyle: el.fontStyle,
                textDecoration: el.textDecoration,
                textAlign: el.textAlign,
                lineHeight: el.lineHeight,
                letterSpacing: `${el.letterSpacing}px`,
                textTransform: el.textCase === 'none' ? 'none' : el.textCase,
                color: el.fill.type === 'SOLID' ? el.fill.color : '#000000',
            });
            const editStyle = { ...getTextStyleForEditing(textEl), width: '100%', height: 'auto', background: 'transparent', border: 'none', outline: 'none', resize: 'none' as const, overflowY: 'hidden' as const };
            const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
              const textarea = e.currentTarget;
              textarea.style.height = 'auto';
              textarea.style.height = `${textarea.scrollHeight}px`;
              onUpdateElement(textEl.id, { text: textarea.value }, false);
            };
            return ( <textarea ref={editingTextareaRef} value={textEl.text} onInput={handleTextareaInput} onBlur={(e) => onUpdateElement(textEl.id, { isEditing: false, height: e.currentTarget.scrollHeight })} className="w-full p-0 m-0" style={editStyle} /> )
        }

        const svgDefs = getSvgDefs(textEl);
        const textSvgProps = getTextSvgProps(textEl);
        
        if (textEl.path) {
            const hostEl = elementsById.get(textEl.path.elementId);
            if (!hostEl || (hostEl.type !== ElementType.Shape && hostEl.type !== ElementType.VectorShape)) return null;

            const pathId = `path-for-${textEl.id}`;
            const d = hostEl.type === ElementType.Shape
                ? getMaskPath(hostEl.shape, hostEl.width, hostEl.height)
                : shapeLibrary.find(s => s.name === (hostEl as VectorShapeElement).shapeName)?.path || '';

            const viewBox = hostEl.type === ElementType.VectorShape
                ? shapeLibrary.find(s => s.name === (hostEl as VectorShapeElement).shapeName)?.viewBox || `0 0 ${hostEl.width} ${hostEl.height}`
                : `0 0 ${hostEl.width} ${hostEl.height}`;
            
            return (
                 <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    {svgDefs}
                    <defs><path id={pathId} d={d} fill="none" /></defs>
                    <text {...textSvgProps}>
                        <textPath href={`#${pathId}`} startOffset={`${textEl.path.startOffset}%`}>
                            {textEl.text}
                        </textPath>
                    </text>
                </svg>
            )
        }
        
        const lines = textEl.text.split('\n');
        const yOffset = textEl.fontSize * 0.8; 
        const xPos = textEl.textAlign === 'center' ? '50%' : textEl.textAlign === 'right' ? '100%' : '0%';

        return (
            <svg width="100%" height="100%" className="pointer-events-none select-none" style={{ overflow: 'visible' }}>
                {svgDefs}
                <text {...textSvgProps} y={yOffset} textAnchor={textEl.textAlign === 'center' ? 'middle' : textEl.textAlign === 'right' ? 'end' : 'start'}>
                    {lines.map((line, index) => (
                        <tspan key={index} x={xPos} dy={index === 0 ? 0 : `${textEl.lineHeight * textEl.fontSize}px`}>
                            {line || ' '}
                        </tspan>
                    ))}
                </text>
            </svg>
        );
      }
       case ElementType.Shape: {
        const shapeEl = el as ShapeElement;
        const { defs, fill } = getFillProps(el.id, shapeEl.fill);
        return (<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none select-none">
            {defs}
           <path d={getMaskPath(shapeEl.shape, 100, 100)} fill={fill} />
        </svg>);
       }
      case ElementType.Icon: {
        const iconEl = el as IconElement;
        const iconData = iconLibrary[iconEl.iconName];
        if (!iconData) return null;
        const fill = iconEl.fill.type === 'SOLID' ? iconEl.fill.color : 'currentColor';
        return (
            <svg width="100%" height="100%" viewBox={iconData.viewBox} className="pointer-events-none select-none" style={{ color: fill }}>
                {iconData.paths.map((d, i) => <path key={i} d={d} fill="currentColor" stroke="none"/>)}
            </svg>
        );
      }
      case ElementType.VectorShape: {
        const vectorShapeEl = el as VectorShapeElement;
        const shapeData = shapeLibrary.find(s => s.name === vectorShapeEl.shapeName);
        if(!shapeData) return null;
        const { defs, fill } = getFillProps(el.id, vectorShapeEl.fill);
        return (
             <svg width="100%" height="100%" viewBox={shapeData.viewBox} preserveAspectRatio="none" className="pointer-events-none select-none">
                {defs}
                <path d={shapeData.path} fill={fill} />
             </svg>
        );
      }
      default: return null;
    }
  }

  const renderElementRecursive = (element: CanvasElement): React.ReactElement | null => {
      if (element.visible === false || (element.type === ElementType.Image && element.isCropping)) return null;
      
      const isLocked = isElementLocked(element);
      
      const transform = `rotateX(${element.rotationX || 0}deg) rotateY(${element.rotationY || 0}deg) rotate(${element.rotation}deg) scaleX(${element.flippedHorizontal ? -1 : 1}) scaleY(${element.flippedVertical ? -1 : 1})`;

      if (element.type === ElementType.Text && element.path) {
          const hostElement = elementsById.get(element.path.elementId);
          if (!hostElement) return null; 
          
          const hostTransform = `rotateX(${hostElement.rotationX || 0}deg) rotateY(${hostElement.rotationY || 0}deg) rotate(${hostElement.rotation}deg) scaleX(${hostElement.flippedHorizontal ? -1 : 1}) scaleY(${hostElement.flippedVertical ? -1 : 1})`;
          return (
              <div
                  key={element.id}
                  data-element-id={element.id}
                  onClick={(e) => { e.stopPropagation(); onSetSelectedElementIds([element.id])}}
                  onDoubleClick={() => handleElementDoubleClick(element.id)}
                  className="absolute"
                  style={{
                      left: `${hostElement.x}px`,
                      top: `${hostElement.y}px`,
                      width: `${hostElement.width}px`,
                      height: `${hostElement.height}px`,
                      transform: hostTransform,
                      zIndex: element.zIndex,
                      mixBlendMode: element.blendMode || 'normal',
                      overflow: 'hidden',
                  }}
              >
                  {renderElementContent(element)}
              </div>
          );
      }
      
      const commonProps = {
        className: `absolute ${!isLocked ? 'cursor-move' : 'cursor-default'}`,
        style: {
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          transform: transform,
          zIndex: element.zIndex,
          mixBlendMode: element.blendMode || 'normal',
        } as React.CSSProperties
      };
      
      if (element.type === ElementType.Text) {
          commonProps.style.overflow = 'hidden';
      }

      if (element.type === ElementType.Group) {
          const children = childrenByGroupId.get(element.id) || [];
          commonProps.style.transformStyle = 'preserve-3d';
          return (
              <div
                  key={element.id}
                  data-element-id={element.id}
                  onMouseDown={(e) => handleMouseDown(e, element, 'drag')}
                  {...commonProps}
              >
                  {children.map(child => renderElementRecursive(child))}
              </div>
          );
      }

      return (
          <div
              key={element.id}
              data-element-id={element.id}
              onMouseDown={(e) => handleMouseDown(e, element, 'drag')}
              onDoubleClick={() => handleElementDoubleClick(element.id)}
              {...commonProps}
          >
              {renderElementContent(element)}
          </div>
      );
  }
  
  const croppingElement = elements.find(el => el.type === ElementType.Image && el.isCropping);

  const elementsToRender = elements.filter(el => !el.groupId && (el.visible ?? true)).sort((a,b) => a.zIndex - b.zIndex);

  return (
    <div ref={canvasRef} id="canvas-area" className="w-[1280px] h-[720px] bg-white dark:bg-gray-800 relative" onClick={handleCanvasClick} onContextMenu={handleContextMenu}>
        {elementsToRender.map(el => renderElementRecursive(el))}
        {croppingElement && renderElementContent(croppingElement)}
        {selectedElementIds.map(id => {
            const el = elementsById.get(id);
            if (!el || isElementLocked(el)) return null;

            if (el.type === ElementType.Text && el.path) {
                const hostEl = elementsById.get(el.path.elementId);
                if (hostEl && !isElementLocked(hostEl)) {
                    return <SelectionBox key={hostEl.id} element={hostEl} onMouseDown={(e, type, pos) => handleMouseDown(e, hostEl, type, pos)} />
                }
                return null;
            }
            
            if (el.groupId && selectedElementIds.includes(el.groupId)) return null;
            return <SelectionBox key={id} element={el} onMouseDown={(e, type, pos) => handleMouseDown(e, el, type, pos)} />
        })}
    </div>
  );
};

export default Canvas;