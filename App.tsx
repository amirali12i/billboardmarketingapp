

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import LeftPanel from './components/LeftPanel';
import Canvas from './components/Canvas';
import { CanvasElement, ElementType, Template, TextElement, ImageElement, ShapeElement, GroupElement, Fill, IconElement, VectorShapeElement, Page, LayoutSuggestion, AiConcept } from './types';
import { LogoIcon, SaveIcon, DownloadIcon, UserIcon, ChevronLeftIcon, UndoIcon, RedoIcon, TemplatesIcon, WandIcon, TextIcon, ShapesIcon, UploadIcon, LayersIcon, BrandKitIcon, SparklesIcon } from './components/icons';
import CanvasToolbar from './components/CanvasToolbar';
import { useWorkspaceStore } from './hooks/useWorkspaceStore';
import ProjectManager from './components/ProjectManager';
import ExportModal from './components/ExportModal';
import CanvasControls from './components/CanvasControls';
import PagesPanel from './components/PagesPanel';
import { getCanvasSnapshot } from './utils/canvasRenderer';
import ThemeSwitcher from './components/ThemeSwitcher';
import BlankCanvasAssistant from './components/BlankCanvasAssistant';
import AiCoPilotModal from './components/AiCoPilotModal';
import ContextMenu from './components/ContextMenu';
import { generateLayoutSuggestions } from './services/geminiService';


const getImageDimensions = (src: string): Promise<{ naturalWidth: number, naturalHeight: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}

const ColorPreview: React.FC<{ position: { x: number; y: number } | null, color: string | null }> = ({ position, color }) => {
    if (!position || !color) return null;
    
    const previewStyle: React.CSSProperties = {
        position: 'fixed',
        left: position.x + 20,
        top: position.y + 20,
        backgroundColor: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 0.75rem',
        pointerEvents: 'none',
        zIndex: 99999,
        boxShadow: '0 4px 6px rgba(0, 0,0, 0.1)',
        gap: '0.5rem',
    };

    const colorSwatchStyle: React.CSSProperties = {
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid white',
    };

    return (
        <div style={previewStyle}>
            <div style={colorSwatchStyle}></div>
            <span className="font-mono text-sm text-white">{color.toUpperCase()}</span>
        </div>
    );
};

// --- Smart Layout Assistant Component ---
interface SmartLayoutAssistantProps {
  layouts: LayoutSuggestion[][];
  elements: CanvasElement[];
  onApply: (layout: LayoutSuggestion[]) => void;
  onClose: () => void;
  position: { top: number; left: number } | null;
}

const SmartLayoutAssistant: React.FC<SmartLayoutAssistantProps> = ({ layouts, elements, onApply, onClose, position }) => {
  if (!position) return null;

  return (
    <div
      style={position}
      className="absolute z-30 w-96 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">چیدمان‌های پیشنهادی</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">برای اعمال چیدمان، روی یکی از گزینه‌ها کلیک کنید.</p>
      <div className="grid grid-cols-3 gap-3">
        {layouts.map((layout, i) => (
          <div
            key={i}
            className="relative aspect-video bg-gray-300 dark:bg-gray-600 rounded-md p-1 overflow-hidden cursor-pointer hover:ring-2 ring-purple-500 transition-all"
            onClick={() => onApply(layout)}
          >
            {layout.map(item => {
              const el = elements.find(e => e.id === item.elementId);
              if (!el) return null;
              const style: React.CSSProperties = {
                position: 'absolute',
                left: `${(item.x / 1280) * 100}%`,
                top: `${(item.y / 720) * 100}%`,
                width: `${(item.width / 1280) * 100}%`,
                height: `${(item.height / 720) * 100}%`,
                transform: `rotate(${item.rotation}deg)`,
                backgroundColor: el.type === 'IMAGE' ? '#6b7280' : el.type === 'TEXT' ? '#38bdf8' : '#9ca3af'
              };
              return <div key={item.elementId} style={style} className="opacity-70 rounded-sm" />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const {
    projects,
    activeProject,
    brandKit,
    userUploads,
    addUserUpload,
    removeUserUpload,
    createProject,
    loadProject,
    updateActivePageElements,
    updateMultipleElements,
    undo,
    redo,
    updateBrandKit,
    saveProjects,
    addPage,
    deletePage,
    duplicatePage,
    reorderPages,
    setActivePage
  } = useWorkspaceStore();
  
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activePrimaryTab, setActivePrimaryTab] = useState('templates');
  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);
  
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);
  const clipboardRef = useRef<CanvasElement[]>([]);
  
  const canvasSnapshotRef = useRef<HTMLCanvasElement | null>(null);
  const [colorPickerState, setColorPickerState] = useState<{
    isActive: boolean;
    onPick: ((color: string) => void) | null;
    previewColor: string | null;
    cursorPosition: { x: number; y: number } | null;
  }>({ isActive: false, onPick: null, previewColor: null, cursorPosition: null });

  const [contextMenuState, setContextMenuState] = useState<{ isOpen: boolean; position: { x: number, y: number } }>({ isOpen: false, position: { x: 0, y: 0 } });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark');

  const [layoutSuggestions, setLayoutSuggestions] = useState<LayoutSuggestion[][] | null>(null);
  const [isLayoutAssistantLoading, setIsLayoutAssistantLoading] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  const activePage = activeProject?.pages[activeProject.activePageIndex];
  const elements = activePage?.elements || [];

  const selectedElements = useMemo(() => {
    return selectedElementIds.map(id => elements.find(el => el.id === id)).filter(Boolean) as CanvasElement[];
  }, [elements, selectedElementIds]);

  const setElements = (updater: (prev: CanvasElement[]) => CanvasElement[], recordHistory: boolean = true) => {
    updateActivePageElements(updater, recordHistory);
  };

  const addElement = useCallback(async (type: ElementType, options: any) => {
    const canvasBounds = document.getElementById('canvas-area')?.getBoundingClientRect();
    const centerX = canvasBounds ? canvasBounds.width / 2 - (options.width || 200) / 2 : 50;
    const centerY = canvasBounds ? canvasBounds.height / 2 - (options.height || 200) / 2 : 50;

    const maxZIndex = elements.reduce((max, el) => Math.max(el.zIndex, max), 0);

    const baseElement = {
      id: `el-${Date.now()}`,
      x: centerX,
      y: centerY,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      zIndex: maxZIndex + 1,
      visible: true,
      locked: false,
      ...options,
    };

    let newElement: CanvasElement;
    switch (type) {
        case ElementType.Image: {
            const { naturalWidth, naturalHeight } = await getImageDimensions(options.src);
            const aspectRatio = naturalWidth / naturalHeight;
            let width = 640;
            let height = width / aspectRatio;
            if (height > 480) {
                height = 480;
                width = height * aspectRatio;
            }
            newElement = { ...baseElement, width, height, type: ElementType.Image, src: options.src, filters: { opacity: 1, brightness: 1, contrast: 1, grayscale: 0, saturate: 1, hueRotate: 0 }, naturalWidth, naturalHeight };
            break;
        }
        case ElementType.Text:
            newElement = { ...baseElement, type: ElementType.Text, text: options.text, fontSize: options.fontSize, fontWeight: options.fontWeight, fontFamily: options.fontFamily, textAlign: 'right', fill: { type: 'SOLID', color: '#FFFFFF' }, effects: options.effects || {}, isEditing: false, lineHeight: 1.5, letterSpacing: 0, textCase: 'none', fontStyle: 'normal', textDecoration: 'none' };
            break;
        case ElementType.Shape:
            newElement = { ...baseElement, type: ElementType.Shape, shape: options.shape, fill: options.fill };
            break;
        case ElementType.Icon:
            newElement = { ...baseElement, type: ElementType.Icon, iconName: options.iconName, fill: { type: 'SOLID', color: '#FFFFFF' } };
            break;
        case ElementType.VectorShape:
            newElement = { ...baseElement, type: ElementType.VectorShape, shapeName: options.shapeName, fill: { type: 'SOLID', color: '#cbd5e1' } };
            break;
        default: return;
    }

    setElements(prev => [...prev, newElement]);
    setSelectedElementIds([newElement.id]);
  }, [elements, updateActivePageElements]);

  const handleAddHeadline = useCallback(() => {
    addElement(ElementType.Text, {
      text: 'عنوان اصلی',
      fontSize: 72,
      fontWeight: 'bold',
      fontFamily: 'Lalezar',
      width: 450,
      height: 100
    });
    setIsPanelOpen(false);
  }, [addElement]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>, recordHistory: boolean = true) => {
    updateActivePageElements(prevElements => {
      const elementToUpdate = prevElements.find(el => el.id === id);

      if (elementToUpdate?.type === ElementType.Group && (updates.width !== undefined || updates.height !== undefined)) {
        const group = elementToUpdate;
        const oldWidth = group.width;
        const oldHeight = group.height;
        const newWidth = updates.width ?? oldWidth;
        const newHeight = updates.height ?? oldHeight;
        const scaleX = (oldWidth === 0 || oldWidth === newWidth) ? 1 : newWidth / oldWidth;
        const scaleY = (oldHeight === 0 || oldHeight === newHeight) ? 1 : newHeight / oldHeight;
        
        if (scaleX === 1 && scaleY === 1) {
            return prevElements.map(el => el.id === id ? ({...el, ...updates} as CanvasElement) : el);
        }

        return prevElements.map(el => {
          if (el.id === id) {
            return { ...el, ...updates } as CanvasElement;
          }
          if (group.childElementIds.includes(el.id)) {
            const scaledEl = {
              ...el,
              x: el.x * scaleX,
              y: el.y * scaleY,
              width: el.width * scaleX,
              height: el.height * scaleY,
            };
            if (scaledEl.type === ElementType.Text) {
              scaledEl.fontSize *= Math.min(scaleX, scaleY);
            }
            return scaledEl;
          }
          return el;
        });
      }

      return prevElements.map(el => {
        if (el.id === id) {
          if (el.type === ElementType.Image) {
            const updatesForImage = updates as Partial<ImageElement>;
            return { ...el, ...updatesForImage, filters: { ...el.filters, ...(updatesForImage.filters || {}) }, };
          }
          if (el.type === ElementType.Text) {
            const updatesForText = updates as Partial<TextElement>;
            const newEffects = { ...el.effects, ...(updatesForText.effects || {}) };
            if(updatesForText.effects?.shadow) newEffects.shadow = { ...(el.effects.shadow || {}), ...updatesForText.effects.shadow};
            if(updatesForText.effects?.outline) newEffects.outline = { ...(el.effects.outline || {}), ...updatesForText.effects.outline};
            if(updatesForText.effects?.threeD) newEffects.threeD = { ...(el.effects.threeD || {}), ...updatesForText.effects.threeD};
            return { ...el, ...updatesForText, effects: newEffects };
          }
          return { ...el, ...updates } as CanvasElement;
        }
        if (el.type === ElementType.Text && el.isEditing && 'isEditing' in updates && updates.isEditing) {
          return { ...el, isEditing: false };
        }
        return el;
      });
    }, recordHistory);
  }, [updateActivePageElements]);
  
  const handleSelectTemplate = useCallback((template: Template) => {
    const newElementsPromise = template.elements.map(async (el, index) => {
      const baseEl: any = { ...el, id: `el-${Date.now()}-${index}`, zIndex: index + 1, locked: false, visible: true, rotationX: 0, rotationY: 0 };
      
      if (baseEl.type === ElementType.Image) {
          let naturalWidth = baseEl.width;
          let naturalHeight = baseEl.height;
          if (baseEl.src) {
              try {
                  const dims = await getImageDimensions(baseEl.src);
                  naturalWidth = dims.naturalWidth;
                  naturalHeight = dims.naturalHeight;
              } catch (error) {
                  console.warn(`Could not load image from template src: ${baseEl.src}`, error);
              }
          }
          const defaultFilters = { opacity: 1, brightness: 1, contrast: 1, grayscale: 0, saturate: 1, hueRotate: 0 };
          return { ...baseEl, filters: { ...defaultFilters, ...(baseEl.filters || {}) }, naturalWidth, naturalHeight } as ImageElement;
      }
      
      if (baseEl.type === ElementType.Text) {
        const { color, ...rest } = baseEl as any;
        const fill: Fill = color ? { type: 'SOLID', color } : baseEl.fill || { type: 'SOLID', color: '#FFFFFF' };
        return { ...rest, fill, effects: baseEl.effects || {}, isEditing: false, lineHeight: baseEl.lineHeight || 1.5, letterSpacing: baseEl.letterSpacing || 0, textCase: baseEl.textCase || 'none', fontStyle: 'normal', textDecoration: 'none' } as TextElement;
      }
      return baseEl as CanvasElement;
    });

    Promise.all(newElementsPromise).then(newElements => {
      setElements(() => newElements);
      setSelectedElementIds([]);
    }).catch(error => {
        console.error("Failed to process template elements:", error);
    });

  }, [updateActivePageElements]);

  const handleDeleteElement = useCallback(() => {
    if (selectedElementIds.length === 0) return;
    setElements(prev => prev.filter(el => !selectedElementIds.includes(el.id) && !(el.groupId && selectedElementIds.includes(el.groupId))));
    setSelectedElementIds([]);
  }, [selectedElementIds, updateActivePageElements]);

  const handleReorderElements = (startIndex: number, endIndex: number) => {
    const rootElements = elements
      .filter(e => !e.groupId && !(e.type === ElementType.Text && e.path))
      .sort((a, b) => b.zIndex - a.zIndex);
    
    const [removed] = rootElements.splice(startIndex, 1);
    if (!removed) {
        return;
    }
    rootElements.splice(endIndex, 0, removed);
    
    const zIndexMap = new Map<string, number>();
    rootElements.forEach((el, index) => { zIndexMap.set(el.id, rootElements.length - index); });

    setElements(prev => prev.map(el => zIndexMap.has(el.id) ? { ...el, zIndex: zIndexMap.get(el.id)! } : el));
  };

  const handleSave = () => { saveProjects(); setLastSaved(Date.now()); };

  const handleGroup = useCallback(() => {
    if (selectedElementIds.length <= 1) return;
    setElements(prev => {
        const childrenToGroup = prev.filter(el => selectedElementIds.includes(el.id));
        if (childrenToGroup.some(child => child.groupId)) return prev;

        const boundingBox = childrenToGroup.reduce((acc, el) => ({
            minX: Math.min(acc.minX, el.x),
            minY: Math.min(acc.minY, el.y),
            maxX: Math.max(acc.maxX, el.x + el.width),
            maxY: Math.max(acc.maxY, el.y + el.height),
        }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

        const groupId = `group-${Date.now()}`;
        const maxZIndex = prev.reduce((max, el) => Math.max(el.zIndex, max), 0);
        
        const newGroup: GroupElement = {
            id: groupId, type: ElementType.Group, x: boundingBox.minX, y: boundingBox.minY,
            width: boundingBox.maxX - boundingBox.minX, height: boundingBox.maxY - boundingBox.minY,
            rotation: 0, zIndex: maxZIndex + 1, childElementIds: childrenToGroup.map(c => c.id),
            locked: false, visible: true, rotationX: 0, rotationY: 0,
        };

        const updatedElements = prev.map(el => selectedElementIds.includes(el.id) ? { ...el, groupId: groupId, x: el.x - newGroup.x, y: el.y - newGroup.y } : el);
        setSelectedElementIds([groupId]);
        return [...updatedElements, newGroup];
    });
}, [selectedElementIds, setElements]);

const handleUngroup = useCallback(() => {
    if (selectedElementIds.length !== 1) return;
    setElements(prev => {
        const group = prev.find(el => el.id === selectedElementIds[0]);
        if (!group || group.type !== ElementType.Group) return prev;

        const childIds = group.childElementIds;
        const newSelection: string[] = [];

        const finalElements = prev.map(el => {
                if (childIds.includes(el.id)) {
                    newSelection.push(el.id);
                    return { ...el, groupId: undefined, x: el.x + group.x, y: el.y + group.y } as CanvasElement;
                }
                return el;
            }).filter(el => el.id !== group.id);
        
        setSelectedElementIds(newSelection);
        return finalElements;
    });
}, [selectedElementIds, setElements]);

  const toggleElementProperty = useCallback((ids: string[], prop: 'locked' | 'visible') => {
      setElements(prev => prev.map(el => {
          if (ids.includes(el.id)) {
              const currentVal = prop === 'visible' ? el.visible ?? true : el.locked ?? false;
              if (prop === 'visible') return { ...el, visible: !currentVal };
              else return { ...el, locked: !currentVal };
          }
          return el;
      }));
  }, [setElements]);

   const handleAlign = useCallback((type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'distribute-horizontal' | 'distribute-vertical') => {
        setElements(prev => {
            const clonedPrev: CanvasElement[] = JSON.parse(JSON.stringify(prev));
            const targets = clonedPrev.filter(el => selectedElementIds.includes(el.id));
            if (targets.length < 2) return prev;

            const bbox = targets.reduce((acc, el) => ({
                minX: Math.min(acc.minX, el.x),
                minY: Math.min(acc.minY, el.y),
                maxX: Math.max(acc.maxX, el.x + el.width),
                maxY: Math.max(acc.maxY, el.y + el.height),
            }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

            if (type === 'distribute-horizontal' && targets.length > 2) {
                const sorted = targets.sort((a, b) => a.x - b.x);
                const totalWidth = sorted.reduce((sum, el) => sum + el.width, 0);
                const totalRange = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width - sorted[0].x;
                const gap = (totalRange - totalWidth) / (targets.length - 1);
                let currentX = sorted[0].x + sorted[0].width + gap;
                for (let i = 1; i < sorted.length - 1; i++) {
                    const elToUpdate = clonedPrev.find(el => el.id === sorted[i].id);
                    if (elToUpdate) elToUpdate.x = currentX;
                    currentX += sorted[i].width + gap;
                }
                return clonedPrev;
            }

            if (type === 'distribute-vertical' && targets.length > 2) {
                const sorted = targets.sort((a, b) => a.y - b.y);
                const totalHeight = sorted.reduce((sum, el) => sum + el.height, 0);
                const totalRange = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height - sorted[0].y;
                const gap = (totalRange - totalHeight) / (targets.length - 1);
                let currentY = sorted[0].y + sorted[0].height + gap;
                for (let i = 1; i < sorted.length - 1; i++) {
                    const elToUpdate = clonedPrev.find(el => el.id === sorted[i].id);
                    if (elToUpdate) elToUpdate.y = currentY;
                    currentY += sorted[i].height + gap;
                }
                return clonedPrev;
            }

            clonedPrev.forEach(el => {
                if (!selectedElementIds.includes(el.id)) return;
                switch (type) {
                    case 'left': el.x = bbox.minX; break;
                    case 'right': el.x = bbox.maxX - el.width; break;
                    case 'center': el.x = bbox.minX + (bbox.maxX - bbox.minX) / 2 - el.width / 2; break;
                    case 'top': el.y = bbox.minY; break;
                    case 'bottom': el.y = bbox.maxY - el.height; break;
                    case 'middle': el.y = bbox.minY + (bbox.maxY - bbox.minY) / 2 - el.height / 2; break;
                }
            });
            return clonedPrev;
        });
    }, [selectedElementIds, setElements]);

    const handleApplyLayout = useCallback((layout: LayoutSuggestion[]) => {
        updateActivePageElements(prev => {
            const elementMap = new Map(prev.map(e => [e.id, e]));
            layout.forEach(suggestion => {
                const el = elementMap.get(suggestion.elementId);
                if (el) {
                    const updatedEl = {
                        ...el,
                        x: suggestion.x,
                        y: suggestion.y,
                        width: suggestion.width,
                        height: suggestion.height,
                        rotation: suggestion.rotation,
                    };
                    elementMap.set(suggestion.elementId, updatedEl);
                }
            });
            return Array.from(elementMap.values());
        });
    }, [updateActivePageElements]);

    const handleApplyAiConcept = useCallback(async (concept: AiConcept, layout: LayoutSuggestion[]) => {
        const { naturalWidth, naturalHeight } = await getImageDimensions(concept.image);

        const newElements: CanvasElement[] = [];

        const baseElements = [
            { id: 'image1', type: ElementType.Image, zIndex: 1 },
            { id: 'headline1', type: ElementType.Text, zIndex: 2 },
            { id: 'slogan1', type: ElementType.Text, zIndex: 3 }
        ];

        for (const baseEl of baseElements) {
            const layoutProps = layout.find(l => l.elementId === baseEl.id);
            if (!layoutProps) continue;

            // FIX: Removed intermediate commonProps object and spread to resolve TypeScript error.
            // Explicitly defining properties for each new element.
            const { x, y, width, height, rotation } = layoutProps;

            if (baseEl.type === ElementType.Image) {
                newElements.push({
                    x, y, width, height, rotation,
                    id: `el-${Date.now()}-${baseEl.id}`,
                    visible: true,
                    locked: false,
                    zIndex: baseEl.zIndex,
                    rotationX: 0,
                    rotationY: 0,
                    type: ElementType.Image,
                    src: concept.image,
                    filters: { opacity: 1, brightness: 1, contrast: 1, grayscale: 0, saturate: 1, hueRotate: 0 },
                    naturalWidth,
                    naturalHeight,
                });
            } else if (baseEl.type === ElementType.Text) {
                const isHeadline = baseEl.id === 'headline1';
                newElements.push({
                    x, y, width, height, rotation,
                    id: `el-${Date.now()}-${baseEl.id}`,
                    visible: true,
                    locked: false,
                    zIndex: baseEl.zIndex,
                    rotationX: 0,
                    rotationY: 0,
                    type: ElementType.Text,
                    text: isHeadline ? concept.headline : concept.slogan,
                    fontSize: isHeadline ? 96 : 48,
                    fontFamily: isHeadline ? 'Lalezar' : 'Vazirmatn',
                    fontWeight: isHeadline ? 'bold' : 'normal',
                    textAlign: 'center',
                    fill: { type: 'SOLID', color: '#FFFFFF' },
                    effects: { shadow: { color: 'rgba(0,0,0,0.5)', offsetX: 2, offsetY: 2, blur: 5 } },
                    isEditing: false, lineHeight: 1.4, letterSpacing: 0, textCase: 'none', fontStyle: 'normal', textDecoration: 'none'
                });
            }
        }
        
        setElements(() => newElements);
        setSelectedElementIds([]);
    }, [updateActivePageElements]);

    const handleGenerateLayouts = useCallback(async () => {
        if (selectedElements.length < 2) return;
        setIsLayoutAssistantLoading(true);
        setLayoutSuggestions(null); // Clear old ones
        try {
            const elementDetails = selectedElements.map(el => ({ id: el.id, type: el.type, width: el.width, height: el.height, text: el.type === ElementType.Text ? (el as TextElement).text : undefined, }));
            const result = await generateLayoutSuggestions(elementDetails);
            setLayoutSuggestions(result);
        } catch (err) {
            console.error("Error generating layouts", err);
            // In a real app, I'd show a toast notification here.
        } finally {
            setIsLayoutAssistantLoading(false);
        }
    }, [selectedElements]);

    const layoutAssistantPosition = useMemo(() => {
        if (!layoutSuggestions || selectedElements.length === 0 || !workspaceRef.current) return null;

        const bbox = selectedElements.reduce((acc, el) => {
            // A simple bounding box is sufficient for positioning the panel.
            // A more complex calculation would account for rotation.
            return {
                minX: Math.min(acc.minX, el.x),
                minY: Math.min(acc.minY, el.y),
                maxX: Math.max(acc.maxX, el.x + el.width),
                maxY: Math.max(acc.maxY, el.y + el.height),
            }
        }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
        
        const workspaceRect = workspaceRef.current.getBoundingClientRect();
        const topOnScreen = (bbox.maxY * scale) + offset.y + 20;
        const leftOnScreen = ((bbox.minX + (bbox.maxX - bbox.minX) / 2) * scale) + offset.x - (384 / 2); // 384px is w-96

        return { 
            top: Math.min(topOnScreen, workspaceRect.height - 250), // prevent going off-screen
            left: Math.max(workspaceRect.left, Math.min(leftOnScreen, workspaceRect.width - 400))
        };
    }, [layoutSuggestions, selectedElements, scale, offset]);
    
    // --- Context Menu Handlers ---
    const handleOpenContextMenu = useCallback((position: { x: number, y: number }) => {
        setContextMenuState({ isOpen: true, position });
    }, []);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenuState(prev => ({ ...prev, isOpen: false }));
    }, []);
    
    const handleCopy = useCallback(() => {
        clipboardRef.current = selectedElements.map(el => JSON.parse(JSON.stringify(el)));
    }, [selectedElements]);

    const handlePaste = useCallback(() => {
        if (clipboardRef.current.length === 0) return;
        const maxZIndex = elements.reduce((max, el) => Math.max(el.zIndex, max), 0);
        const newElements: CanvasElement[] = clipboardRef.current.map((el, i) => {
            const newEl: CanvasElement = JSON.parse(JSON.stringify(el));
            newEl.id = `el-${Date.now()}-${i}`;
            newEl.x += 20;
            newEl.y += 20;
            newEl.zIndex = maxZIndex + i + 1;
            return newEl;
        });
        setElements(prev => [...prev, ...newElements]);
        setSelectedElementIds(newElements.map(el => el.id));
    }, [elements, setElements]);

    const handleDuplicate = useCallback(() => {
        if (selectedElements.length === 0) return;
        const maxZIndex = elements.reduce((max, el) => Math.max(el.zIndex, max), 0);
        const newElements: CanvasElement[] = selectedElements.map((el, i) => {
            const newEl: CanvasElement = JSON.parse(JSON.stringify(el));
            newEl.id = `el-${Date.now()}-${i}`;
            newEl.x += 20;
            newEl.y += 20;
            newEl.zIndex = maxZIndex + i + 1;
            return newEl;
        });
        setElements(prev => [...prev, ...newElements]);
        setSelectedElementIds(newElements.map(el => el.id));
    }, [selectedElements, elements, setElements]);
    
    const moveSelection = useCallback((direction: 'front' | 'back') => {
        setElements(prev => {
            const newElements = prev.map(el => ({ ...el }));
            const otherElements = newElements.filter(el => !selectedElementIds.includes(el.id));
            const selected = newElements.filter(el => selectedElementIds.includes(el.id));
            if (selected.length === 0) return prev;
            
            const finalElements = direction === 'front' 
                ? [...otherElements, ...selected] 
                : [...selected, ...otherElements];
    
            finalElements.forEach((el, index) => { el.zIndex = index + 1; });
    
            return finalElements;
        });
    }, [selectedElementIds, setElements]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (isCtrlOrCmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        isMac && e.shiftKey ? redo() : undo();
      } else if (isCtrlOrCmd && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteElement();
      } else if (isCtrlOrCmd && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (isCtrlOrCmd && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (isCtrlOrCmd && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        e.shiftKey ? handleUngroup() : handleGroup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, elements, handleDeleteElement, handleGroup, handleUngroup, undo, redo, handleCopy, handlePaste]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space' && !e.repeat) { setIsPanning(true); document.body.style.cursor = 'grab'; } };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') { setIsPanning(false); document.body.style.cursor = 'default'; } };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, []);

  const handleWorkspaceMouseDown = (e: React.MouseEvent) => {
    if (isPanning) { document.body.style.cursor = 'grabbing'; panStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }; }
  };
  const handleWorkspaceMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStartRef.current.x !== 0) { setOffset({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y }); }
  };
  const handleWorkspaceMouseUp = () => { if (isPanning) { document.body.style.cursor = 'grab'; } panStartRef.current = { x: 0, y: 0 }; };
  const zoom = (delta: number) => { setScale(prev => Math.max(0.1, Math.min(prev + delta, 3))); };
  const zoomToFit = () => {
    if (!workspaceRef.current) return;
    const { width: workspaceWidth, height: workspaceHeight } = workspaceRef.current.getBoundingClientRect();
    const [canvasWidth, canvasHeight] = [1280, 720];
    const scaleX = (workspaceWidth - 80) / canvasWidth; const scaleY = (workspaceHeight - 80) / canvasHeight;
    const newScale = Math.min(scaleX, scaleY);
    setScale(newScale);
    setOffset({ x: (workspaceWidth - canvasWidth * newScale) / 2, y: (workspaceHeight - canvasHeight * newScale) / 2 });
  }

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const newScale = Math.max(0.1, Math.min(scale - e.deltaY * 0.001, 3));
        const workspaceRect = workspaceRef.current!.getBoundingClientRect();
        
        const mouseX = e.clientX - workspaceRect.left;
        const mouseY = e.clientY - workspaceRect.top;
        
        const worldX_before = (mouseX - offset.x) / scale;
        const worldY_before = (mouseY - offset.y) / scale;
        
        const newOffsetX = mouseX - worldX_before * newScale;
        const newOffsetY = mouseY - worldY_before * newScale;

        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
    }
  }, [scale, offset]);

  useEffect(() => {
    const workspaceEl = workspaceRef.current;
    if (workspaceEl) {
        workspaceEl.addEventListener('wheel', handleWheel, { passive: false });
        return () => workspaceEl.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    setSelectedElementIds([]);
    zoomToFit();
  }, [activeProject?.id, activeProject?.activePageIndex]);

  const endColorPicking = useCallback(() => {
      if (workspaceRef.current) {
          workspaceRef.current.style.cursor = 'default';
      }
      canvasSnapshotRef.current = null;
      setColorPickerState({ isActive: false, onPick: null, previewColor: null, cursorPosition: null });
  }, []);

  const startColorPicking = useCallback(async (onPick: (color: string) => void) => {
      const canvasArea = document.getElementById('canvas-area');
      if (!canvasArea) return;
      
      if (workspaceRef.current) {
          workspaceRef.current.style.cursor = 'crosshair';
      }

      try {
          const snapshot = await getCanvasSnapshot(canvasArea);
          canvasSnapshotRef.current = snapshot;
          setColorPickerState({ isActive: true, onPick, previewColor: '#FFFFFF', cursorPosition: null });
      } catch (error) {
          console.error("Failed to create canvas snapshot for color picking", error);
           if (workspaceRef.current) {
              workspaceRef.current.style.cursor = 'default';
          }
      }
  }, []);

  const handleColorPickerMouseMove = (e: React.MouseEvent) => {
      if (!colorPickerState.isActive || !canvasSnapshotRef.current) return;
      
      const canvasArea = document.getElementById('canvas-area');
      if (!canvasArea) return;
      
      const rect = canvasArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x < rect.width && y >= 0 && y < rect.height) {
          const ctx = canvasSnapshotRef.current.getContext('2d');
          if(ctx) {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              const hex = `#${('000000' + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6)}`;
              setColorPickerState(prev => ({ ...prev, previewColor: hex, cursorPosition: { x: e.clientX, y: e.clientY } }));
          }
      } else {
           setColorPickerState(prev => ({ ...prev, previewColor: null, cursorPosition: { x: e.clientX, y: e.clientY } }));
      }
  };
  
  const handleColorPickerClick = () => {
      if (colorPickerState.isActive && colorPickerState.onPick && colorPickerState.previewColor) {
          colorPickerState.onPick(colorPickerState.previewColor);
      }
      endColorPicking();
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape' && colorPickerState.isActive) {
              endColorPicking();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colorPickerState.isActive, endColorPicking]);

  const primaryNavItems: { id: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; title: string }[] = [
    { id: 'templates', icon: TemplatesIcon, title: 'قالب‌ها' },
    { id: 'magic', icon: WandIcon, title: 'ابزار هوشمند' },
    { id: 'text', icon: TextIcon, title: 'متن' },
    { id: 'elements', icon: ShapesIcon, title: 'عناصر' },
    { id: 'uploads', icon: UploadIcon, title: 'آپلودها' },
    { id: 'layers', icon: LayersIcon, title: 'لایه‌ها' },
    { id: 'brandkit', icon: BrandKitIcon, title: 'برند' },
  ];

  if (!activeProject) {
    return <ProjectManager projects={projects} onCreate={createProject} onLoad={loadProject} />;
  }
  
  const canUndo = activePage && activePage.historyIndex > 0;
  const canRedo = activePage && activePage.historyIndex < activePage.history.length - 1;
  
  const canGroup = selectedElements.length > 1 && selectedElements.every(el => !el.groupId);
  const canUngroup = selectedElements.length === 1 && selectedElements[0]?.type === ElementType.Group;
  const singleSelected = selectedElements.length === 1 ? selectedElements[0] : null;

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans overflow-hidden">
      {isExporting && <ExportModal project={activeProject} onClose={() => setIsExporting(false)} />}
      {isCoPilotOpen && <AiCoPilotModal onClose={() => setIsCoPilotOpen(false)} onApply={handleApplyAiConcept} />}
      
      {contextMenuState.isOpen && (
        <ContextMenu
          position={contextMenuState.position}
          onClose={handleCloseContextMenu}
          selectionInfo={{
            count: selectedElements.length,
            canGroup,
            canUngroup,
            canCopy: selectedElements.length > 0,
            canPaste: clipboardRef.current.length > 0,
            isLocked: !!singleSelected?.locked,
            isVisible: singleSelected ? (singleSelected.visible ?? true) : true,
          }}
          actions={{
            onCopy: handleCopy,
            onPaste: handlePaste,
            onDuplicate: handleDuplicate,
            onDelete: handleDeleteElement,
            onGroup: handleGroup,
            onUngroup: handleUngroup,
            onBringToFront: () => moveSelection('front'),
            onSendToBack: () => moveSelection('back'),
            onToggleLock: () => toggleElementProperty(selectedElementIds, 'locked'),
            onToggleVisibility: () => toggleElementProperty(selectedElementIds, 'visible'),
          }}
        />
      )}

      {colorPickerState.isActive && (
          <div 
              className="absolute inset-0 z-50"
              onMouseMove={handleColorPickerMouseMove}
              onClick={handleColorPickerClick}
              onContextMenu={(e) => { e.preventDefault(); endColorPicking(); }}
          />
      )}
      <ColorPreview position={colorPickerState.cursorPosition} color={colorPickerState.previewColor} />

      <nav className="w-20 bg-gray-100 dark:bg-gray-800/95 flex flex-col items-center flex-shrink-0 py-4 gap-2 border-l-2 border-gray-200 dark:border-gray-700/50 z-30">
        <LogoIcon className="w-8 h-8 text-cyan-400 mb-4 flex-shrink-0"/>
        {primaryNavItems.map(item => (
            <button key={item.id} onClick={() => setActivePrimaryTab(item.id)} title={item.title} 
                    className={`p-3 rounded-lg w-14 h-14 flex items-center justify-center transition-colors duration-200 ${activePrimaryTab === item.id ? 'bg-cyan-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                <item.icon className="w-7 h-7" />
            </button>
        ))}
      </nav>

       <div className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${isPanelOpen ? 'w-96' : 'w-0'}`}>
        <LeftPanel 
            activeTab={activePrimaryTab}
            onAddElement={addElement} 
            elements={elements} 
            onReorderElements={handleReorderElements}
            selectedElementIds={selectedElementIds} 
            onSetSelectedElementIds={setSelectedElementIds}
            brandKit={brandKit} 
            onUpdateBrandKit={updateBrandKit} 
            onGroup={handleGroup} 
            onUngroup={handleUngroup}
            onToggleProperty={toggleElementProperty}
            userUploads={userUploads}
            onAddUserUpload={addUserUpload}
            onRemoveUserUpload={removeUserUpload}
            onSelectTemplate={handleSelectTemplate}
            onOpenAiCoPilot={() => setIsCoPilotOpen(true)}
        />
        <button onClick={() => setIsPanelOpen(!isPanelOpen)} className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-16 bg-gray-200 dark:bg-gray-700 hover:bg-cyan-600 rounded-l-lg z-20 flex items-center justify-center transition-all hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-white" title={isPanelOpen ? 'بستن پنل' : 'باز کردن پنل'}>
            <ChevronLeftIcon className={`w-5 h-5 transition-transform ${!isPanelOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div className="flex flex-col flex-grow relative">
          <header className="w-full bg-white/30 dark:bg-gray-900/50 backdrop-blur-lg p-3 text-center border-b border-white/20 dark:border-gray-700/50 flex items-center justify-between px-4 flex-shrink-0 z-20">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-wider">{activeProject.name}</h1>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <button onClick={undo} disabled={!canUndo} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-white" title="بازگشت (Ctrl+Z)"><UndoIcon className="w-5 h-5"/></button>
                <button onClick={redo} disabled={!canRedo} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-white" title="تکرار (Ctrl+Y)"><RedoIcon className="w-5 h-5"/></button>
              </div>
              <div className="flex-grow flex justify-center"></div>
              <div className="flex items-center gap-4">
                <ThemeSwitcher theme={theme} setTheme={setTheme} />
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">آخرین ذخیره: {new Date(lastSaved).toLocaleTimeString('fa-IR')}</span>
                <button onClick={handleSave} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-cyan-600 rounded-lg transition-colors flex items-center gap-2 text-gray-700 dark:text-white" title="ذخیره پروژه"><SaveIcon className="w-5 h-5"/></button>
                <button onClick={() => setIsExporting(true)} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-cyan-600 rounded-lg transition-colors flex items-center gap-2 text-gray-700 dark:text-white" title="خروجی گرفتن"><DownloadIcon className="w-5 h-5"/></button>
                 <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm">کاربر مهمان</span>
                    <div className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center"><UserIcon className="w-5 h-5 text-white"/></div>
                 </div>
              </div>
          </header>
          
          <main className="flex-grow w-full h-full relative flex flex-col">
            {selectedElements.length > 0 && (
              <CanvasToolbar
                selectedElements={selectedElements}
                onDelete={handleDeleteElement}
                onUpdateElement={updateElement}
                brandColors={brandKit.colors}
                onStartColorPick={startColorPicking}
                onAlign={handleAlign}
                onGroup={handleGroup}
                onUngroup={handleUngroup}
                onDuplicate={handleDuplicate}
                canGroup={canGroup}
                canUngroup={canUngroup}
                onGenerateLayouts={handleGenerateLayouts}
                isLayoutLoading={isLayoutAssistantLoading}
              />
            )}
            <div ref={workspaceRef} className="flex-grow w-full h-full relative overflow-hidden bg-gray-200 dark:bg-gray-800 bg-grid-pattern-light dark:bg-grid-pattern-dark" onMouseDown={handleWorkspaceMouseDown} onMouseMove={handleWorkspaceMouseMove} onMouseUp={handleWorkspaceMouseUp} onMouseLeave={handleWorkspaceMouseUp}>
                {layoutSuggestions && (
                    <SmartLayoutAssistant
                        layouts={layoutSuggestions}
                        elements={selectedElements}
                        onApply={(layout) => {
                            handleApplyLayout(layout);
                            setLayoutSuggestions(null);
                        }}
                        onClose={() => setLayoutSuggestions(null)}
                        position={layoutAssistantPosition}
                    />
                )}
                <div className="absolute top-0 left-0" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: 'top left' }}>
                    <div className="shadow-soft-2xl" style={{ perspective: '1200px' }}>
                        <Canvas 
                            elements={elements} 
                            onUpdateElement={updateElement} 
                            onUpdateElements={updateMultipleElements}
                            selectedElementIds={selectedElementIds} 
                            onSetSelectedElementIds={setSelectedElementIds} 
                            scale={scale}
                            offset={offset}
                            onOpenContextMenu={handleOpenContextMenu}
                        />
                    </div>
                </div>
                
                {elements.length === 0 && (
                    <BlankCanvasAssistant
                        onSelectTemplateTab={() => {
                            setActivePrimaryTab('templates');
                            setIsPanelOpen(true);
                        }}
                        onOpenAiCoPilot={() => {
                            setIsCoPilotOpen(true);
                        }}
                        onAddHeadline={handleAddHeadline}
                        onSelectUploadsTab={() => {
                            setActivePrimaryTab('uploads');
                            setIsPanelOpen(true);
                        }}
                    />
                )}

                <CanvasControls scale={scale} onZoomIn={() => zoom(0.1)} onZoomOut={() => zoom(-0.1)} onZoomToFit={zoomToFit} />
            </div>
            {activeProject && (
                <PagesPanel 
                    pages={activeProject.pages} 
                    activePageIndex={activeProject.activePageIndex}
                    onAddPage={addPage}
                    onDeletePage={deletePage}
                    onDuplicatePage={duplicatePage}
                    onReorderPages={reorderPages}
                    onSelectPage={setActivePage}
                />
            )}
          </main>
      </div>

    </div>
  );
};

export default App;