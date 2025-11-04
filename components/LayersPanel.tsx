
import React, { useRef, useState } from 'react';
import { CanvasElement, ElementType, TextElement } from '../types';
import { ImageIcon, TextIcon, ShapesIcon, GroupIcon, UngroupIcon, FolderIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, LockOpenIcon, VectorShapeIcon } from './icons';

interface LayersPanelProps {
  elements: CanvasElement[];
  onReorder: (startIndex: number, endIndex: number) => void;
  selectedElementIds: string[];
  onSetSelectedElementIds: (ids: string[]) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onToggleProperty: (ids: string[], prop: 'locked' | 'visible') => void;
}

const ElementIcon = ({ type }: { type: ElementType }) => {
  switch (type) {
    case ElementType.Image: return <ImageIcon className="w-5 h-5 text-cyan-400" />;
    case ElementType.Text: return <TextIcon className="w-5 h-5 text-lime-400" />;
    case ElementType.Shape: return <ShapesIcon className="w-5 h-5 text-fuchsia-400" />;
    case ElementType.VectorShape: return <VectorShapeIcon className="w-5 h-5 text-rose-400" />;
    case ElementType.Group: return <FolderIcon className="w-5 h-5 text-amber-400" />;
    case ElementType.Icon: return <ImageIcon className="w-5 h-5 text-teal-400" />; // Placeholder
    default: return null;
  }
};

const LayersPanel: React.FC<LayersPanelProps> = ({ elements, onReorder, selectedElementIds, onSetSelectedElementIds, onGroup, onUngroup, onToggleProperty }) => {
  const selectedElement = elements.find(el => selectedElementIds.length === 1 && el.id === selectedElementIds[0]);
  const canGroup = selectedElementIds.length > 1 && elements.filter(el => selectedElementIds.includes(el.id)).every(el => !el.groupId);
  const canUngroup = selectedElementIds.length === 1 && selectedElement?.type === ElementType.Group;
  
  const draggedItemIndex = useRef<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ index: number; position: 'top' | 'bottom' } | null>(null);

  const handleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const isSelected = selectedElementIds.includes(id);

    if (e.shiftKey) {
      if (isSelected) {
        onSetSelectedElementIds(selectedElementIds.filter(selectedId => selectedId !== id));
      } else {
        onSetSelectedElementIds([...selectedElementIds, id]);
      }
    } else {
      onSetSelectedElementIds([id]);
    }
  };
  
  const rootElements = elements
    .filter(el => !el.groupId && !(el.type === ElementType.Text && el.path))
    .sort((a, b) => b.zIndex - a.zIndex);
  
  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedItemIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnter = (e: React.DragEvent, index: number) => {
    if (draggedItemIndex.current === null || draggedItemIndex.current === index) {
      setDropIndicator(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY > midY ? 'bottom' : 'top';
    setDropIndicator({ index, position });
  };
  const handleDragEnd = () => {
    draggedItemIndex.current = null;
    setDropIndicator(null);
  };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex.current === null) return;
    
    let targetIndex = dropIndex;
    if(dropIndicator?.position === 'bottom') {
        targetIndex = dropIndex + 1;
    }
    if(draggedItemIndex.current < targetIndex) {
        targetIndex--;
    }

    onReorder(draggedItemIndex.current, targetIndex);
    handleDragEnd();
  };

  const renderLayerItem = (el: CanvasElement, depth: number = 0, isRootDraggable: boolean = false, rootIndex: number = -1) => {
      const isDraggable = isRootDraggable && !el.locked;
      const isDraggingOver = isRootDraggable && dropIndicator?.index === rootIndex;

      return (
        <div
            draggable={isDraggable}
            onDragStart={isDraggable ? (e) => handleDragStart(e, rootIndex) : undefined}
            onDragEnter={isDraggable ? (e) => handleDragEnter(e, rootIndex) : undefined}
            onDragEnd={isDraggable ? handleDragEnd : undefined}
            onDragOver={isDraggable ? e => e.preventDefault() : undefined}
            onDrop={isDraggable ? (e) => handleDrop(e, rootIndex) : undefined}
            onClick={(e) => !(el.locked) && handleSelect(e, el.id)}
            className={`relative flex items-center p-2 rounded-md transition-colors ${selectedElementIds.includes(el.id) ? 'bg-cyan-600/30 ring-1 ring-cyan-500' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} ${el.locked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} ${el.visible === false ? 'opacity-50' : ''}`}
            style={{ paddingRight: `${depth * 16 + 8}px` }}
        >
            {isDraggingOver && dropIndicator?.position === 'top' && <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400" />}
            <ElementIcon type={el.type} />
            <span className="ms-3 text-sm truncate flex-grow">
                {el.type === ElementType.Text ? (el as TextElement).text.substring(0, 20) || 'متن خالی' : el.type === ElementType.Group ? `گروه` : el.type === ElementType.Icon ? `${el.iconName} Icon` : el.type === ElementType.VectorShape ? el.shapeName : `${el.type.toLowerCase()}`}
            </span>
             <div className="flex-shrink-0 flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onToggleProperty([el.id], 'locked'); }} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                    {el.locked ? <LockClosedIcon className="w-4 h-4 text-yellow-500 dark:text-yellow-400" /> : <LockOpenIcon className="w-4 h-4" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleProperty([el.id], 'visible'); }} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                    {el.visible ?? true ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4 text-gray-500 dark:text-gray-500" />}
                </button>
            </div>
            {isDraggingOver && dropIndicator?.position === 'bottom' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
        </div>
      );
  }

  const renderTree = (elementsToRender: CanvasElement[], depth = 0, isRoot: boolean = false) => {
    return elementsToRender.map((el, index) => {
        const groupChildren = el.type === ElementType.Group ? elements.filter(e => e.groupId === el.id).sort((a,b) => b.zIndex - a.zIndex) : [];
        const pathChildren = elements.filter(e => e.type === ElementType.Text && e.path?.elementId === el.id).sort((a,b) => b.zIndex - a.zIndex);
        const allChildren = [...groupChildren, ...pathChildren];

        return (
            <React.Fragment key={el.id}>
                {renderLayerItem(el, depth, isRoot, index)}
                {allChildren.length > 0 && renderTree(allChildren, depth + 1)}
            </React.Fragment>
        )
    });
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">لایه ها</h2>
      <div className="flex items-center gap-2 mb-4">
        <button 
            onClick={onGroup} 
            disabled={!canGroup}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed hover:enabled:bg-gray-300 dark:hover:enabled:bg-gray-600 transition-colors"
            title="گروه کردن عناصر انتخاب شده (Ctrl+G)"
        >
            <GroupIcon className="w-5 h-5" />
            <span>گروه</span>
        </button>
        <button 
            onClick={onUngroup}
            disabled={!canUngroup}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed hover:enabled:bg-gray-300 dark:hover:enabled:bg-gray-600 transition-colors"
            title="باز کردن گروه (Ctrl+Shift+G)"
        >
            <UngroupIcon className="w-5 h-5" />
            <span>باز کردن</span>
        </button>
      </div>
      <div className="space-y-2" onDragLeave={() => setDropIndicator(null)}>
        {renderTree(rootElements, 0, true)}
      </div>
    </div>
  );
};

export default LayersPanel;
