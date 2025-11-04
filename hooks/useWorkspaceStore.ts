import { useState, useCallback, useEffect } from 'react';
import { Project, BrandKit, CanvasElement, Page, ElementType, ImageElement, TextElement } from '../types';

const PROJECTS_STORAGE_KEY = 'billboard_designer_projects';
const BRAND_KIT_STORAGE_KEY = 'billboard_designer_brand_kit';
const USER_UPLOADS_STORAGE_KEY = 'billboard_designer_user_uploads';
const ACTIVE_PROJECT_ID_KEY = 'billboard_designer_active_project_id';

const migrateProject = (project: any): Project => {
    if (project.pages && Array.isArray(project.pages) && project.pages[0].history) {
        return project as Project;
    }
    
    let pages: Page[];
    if (project.pages && Array.isArray(project.pages)) {
        pages = project.pages.map((p: any) => ({
            ...p,
            history: [p.elements || []],
            historyIndex: 0,
        }));
    } else {
        const initialElements = project.elements || [];
        pages = [{
            id: `page-${Date.now()}`,
            name: 'Page 1',
            elements: initialElements,
            history: [initialElements],
            historyIndex: 0,
        }];
    }
    
    return {
        ...project,
        pages,
        activePageIndex: project.activePageIndex ?? 0,
    };
};


const getInitialProjects = (): Project[] => {
    try {
        const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
        if (!stored) return [];
        const parsedProjects = JSON.parse(stored);
        return parsedProjects.map(migrateProject);
    } catch (e) {
        console.error("Failed to parse projects from localStorage", e);
        return [];
    }
};

const getInitialBrandKit = (): BrandKit => {
    try {
        const stored = localStorage.getItem(BRAND_KIT_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { colors: ['#06b6d4', '#ef4444', '#f97316', '#eab308', '#22c55e'], logo: null };
    } catch (e) {
        console.error("Failed to parse brand kit from localStorage", e);
        return { colors: [], logo: null };
    }
};

const getInitialUserUploads = (): string[] => {
    try {
        const stored = localStorage.getItem(USER_UPLOADS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch(e) {
        console.error("Failed to parse user uploads from localStorage", e);
        return [];
    }
};

export const useWorkspaceStore = () => {
    const [projects, setProjects] = useState<Project[]>(getInitialProjects);
    const [brandKit, setBrandKit] = useState<BrandKit>(getInitialBrandKit);
    const [userUploads, setUserUploads] = useState<string[]>(getInitialUserUploads);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(() => localStorage.getItem(ACTIVE_PROJECT_ID_KEY));
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      setIsLoaded(true);
    }, []);

    const saveProjects = useCallback(() => {
        try {
            localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
        } catch (e) {
            console.error("Failed to save projects to localStorage", e);
        }
    }, [projects]);

    const saveBrandKit = useCallback(() => {
        try {
            localStorage.setItem(BRAND_KIT_STORAGE_KEY, JSON.stringify(brandKit));
        } catch (e) {
            console.error("Failed to save brand kit to localStorage", e);
        }
    }, [brandKit]);
    
    const saveUserUploads = useCallback(() => {
        try {
            localStorage.setItem(USER_UPLOADS_STORAGE_KEY, JSON.stringify(userUploads));
        } catch (e) {
            console.error("Failed to save user uploads to localStorage", e);
        }
    }, [userUploads]);

    const createProject = useCallback((name: string) => {
        const initialElements: CanvasElement[] = [];
        const newProject: Project = {
            id: `proj-${Date.now()}`,
            name,
            pages: [{ 
                id: `page-${Date.now()}`, 
                name: 'Page 1', 
                elements: initialElements,
                history: [initialElements],
                historyIndex: 0,
            }],
            activePageIndex: 0,
            lastModified: Date.now(),
        };
        setProjects(prev => [...prev, newProject]);
        setActiveProjectId(newProject.id);
        localStorage.setItem(ACTIVE_PROJECT_ID_KEY, newProject.id);
    }, []);
    
    const loadProject = useCallback((id: string) => {
        setActiveProjectId(id);
        localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
    }, []);

    const updateActivePageElements = useCallback((updater: (prevElements: CanvasElement[]) => CanvasElement[], recordHistory: boolean = true) => {
        if (!activeProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === activeProjectId) {
                const activePage = p.pages[p.activePageIndex];
                const newElements = updater(activePage.elements);
                const updatedPage = { ...activePage, elements: newElements };
                
                if (recordHistory) {
                    const newHistory = activePage.history.slice(0, activePage.historyIndex + 1);
                    newHistory.push(newElements);
                    if (newHistory.length > 50) newHistory.shift(); // Limit history size
                    updatedPage.history = newHistory;
                    updatedPage.historyIndex = newHistory.length - 1;
                }

                const updatedPages = [...p.pages];
                updatedPages[p.activePageIndex] = updatedPage;
                return { ...p, pages: updatedPages, lastModified: Date.now() };
            }
            return p;
        }));
    }, [activeProjectId]);
    
    const updateMultipleElements = useCallback((updates: { id: string, updates: Partial<CanvasElement> }[]) => {
        if (!activeProjectId || updates.length === 0) return;

        updateActivePageElements(prevElements => {
            const updatesMap = new Map(updates.map(u => [u.id, u.updates]));
            return prevElements.map(el => {
                if (updatesMap.has(el.id)) {
                    const elementUpdates = updatesMap.get(el.id)!;
                    // Re-use smart merging logic for complex types
                    if (el.type === ElementType.Image) {
                        const updatesForImage = elementUpdates as Partial<ImageElement>;
                        return { ...el, ...updatesForImage, filters: { ...el.filters, ...(updatesForImage.filters || {}) } };
                    }
                    if (el.type === ElementType.Text) {
                        const updatesForText = elementUpdates as Partial<TextElement>;
                         const newEffects = { ...el.effects, ...(updatesForText.effects || {}) };
                        if(updatesForText.effects?.shadow) newEffects.shadow = { ...(el.effects.shadow || {}), ...updatesForText.effects.shadow};
                        if(updatesForText.effects?.outline) newEffects.outline = { ...(el.effects.outline || {}), ...updatesForText.effects.outline};
                        if(updatesForText.effects?.threeD) newEffects.threeD = { ...(el.effects.threeD || {}), ...updatesForText.effects.threeD};
                        return { ...el, ...updatesForText, effects: newEffects };
                    }
                    // FIX: When spreading a partial of a discriminated union, TypeScript can lose the specific type.
                    // Casting the result back to CanvasElement ensures the type remains correct.
                    return { ...el, ...elementUpdates } as CanvasElement;
                }
                return el;
            });
        }, true); // Always record history for a batch update
    }, [activeProjectId, updateActivePageElements]);

    const undo = useCallback(() => {
        if (!activeProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === activeProjectId) {
                const activePage = p.pages[p.activePageIndex];
                if (activePage.historyIndex > 0) {
                    const newIndex = activePage.historyIndex - 1;
                    const newElements = activePage.history[newIndex];
                    const updatedPage = { ...activePage, elements: newElements, historyIndex: newIndex };
                    const updatedPages = [...p.pages];
                    updatedPages[p.activePageIndex] = updatedPage;
                    return { ...p, pages: updatedPages };
                }
            }
            return p;
        }));
    }, [activeProjectId]);

    const redo = useCallback(() => {
        if (!activeProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === activeProjectId) {
                const activePage = p.pages[p.activePageIndex];
                if (activePage.historyIndex < activePage.history.length - 1) {
                    const newIndex = activePage.historyIndex + 1;
                    const newElements = activePage.history[newIndex];
                    const updatedPage = { ...activePage, elements: newElements, historyIndex: newIndex };
                    const updatedPages = [...p.pages];
                    updatedPages[p.activePageIndex] = updatedPage;
                    return { ...p, pages: updatedPages };
                }
            }
            return p;
        }));
    }, [activeProjectId]);


    const addPage = useCallback(() => {
        if (!activeProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === activeProjectId) {
                const initialElements: CanvasElement[] = [];
                const newPage: Page = {
                    id: `page-${Date.now()}`,
                    name: `Page ${p.pages.length + 1}`,
                    elements: initialElements,
                    history: [initialElements],
                    historyIndex: 0,
                };
                return { ...p, pages: [...p.pages, newPage], activePageIndex: p.pages.length, lastModified: Date.now() };
            }
            return p;
        }));
    }, [activeProjectId]);
    
    const deletePage = useCallback((pageIndex: number) => {
        if (!activeProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === activeProjectId && p.pages.length > 1) {
                const newPages = p.pages.filter((_, i) => i !== pageIndex);
                let newActiveIndex = p.activePageIndex;
                if (pageIndex === p.activePageIndex) {
                    newActiveIndex = Math.max(0, pageIndex - 1);
                } else if (pageIndex < p.activePageIndex) {
                    newActiveIndex--;
                }
                return { ...p, pages: newPages, activePageIndex: newActiveIndex, lastModified: Date.now() };
            }
            return p;
        }));
    }, [activeProjectId]);

    const duplicatePage = useCallback((pageIndex: number) => {
        if (!activeProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === activeProjectId) {
                const pageToDuplicate = p.pages[pageIndex];
                // FIX: Spreading a discriminated union `el` and modifying a property can cause TypeScript to lose the specific type
                // and widen it to a less specific union, causing type errors downstream.
                // Casting the result back to `CanvasElement` resolves this.
                const newElements = pageToDuplicate.elements.map(el => ({ ...el, id: `el-${Date.now()}-${Math.random()}` } as CanvasElement));
                const newPage: Page = {
                    ...pageToDuplicate,
                    id: `page-${Date.now()}`,
                    name: `${pageToDuplicate.name} (Copy)`,
                    elements: newElements,
                    history: [newElements],
                    historyIndex: 0,
                };
                const newPages = [...p.pages];
                newPages.splice(pageIndex + 1, 0, newPage);
                return { ...p, pages: newPages, activePageIndex: pageIndex + 1, lastModified: Date.now() };
            }
            return p;
        }));
    }, [activeProjectId]);

    const reorderPages = useCallback((startIndex: number, endIndex: number) => {
         if (!activeProjectId) return;
         setProjects(prev => prev.map(p => {
             if (p.id === activeProjectId) {
                 const newPages = [...p.pages];
                 const [removed] = newPages.splice(startIndex, 1);
                 newPages.splice(endIndex, 0, removed);
                 return { ...p, pages: newPages, activePageIndex: endIndex, lastModified: Date.now() };
             }
             return p;
         }));
    }, [activeProjectId]);

    const setActivePage = useCallback((pageIndex: number) => {
        if (!activeProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === activeProjectId && p.activePageIndex !== pageIndex) {
                return { ...p, activePageIndex: pageIndex };
            }
            return p;
        }));
    }, [activeProjectId]);

    const updateBrandKit = useCallback((updates: Partial<BrandKit>) => {
        setBrandKit(prev => ({...prev, ...updates}));
    }, []);
    
    const addUserUpload = useCallback((imageData: string) => {
        setUserUploads(prev => [imageData, ...prev]);
    }, []);
    
    const removeUserUpload = useCallback((index: number) => {
        setUserUploads(prev => prev.filter((_, i) => i !== index));
    }, []);

    useEffect(() => {
        saveProjects();
    }, [projects, saveProjects]);

    useEffect(() => {
        saveBrandKit();
    }, [brandKit, saveBrandKit]);
    
    useEffect(() => {
        saveUserUploads();
    }, [userUploads, saveUserUploads]);
    
    const activeProject = isLoaded ? projects.find(p => p.id === activeProjectId) || null : null;

    return {
        projects: isLoaded ? projects : [],
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
        setActivePage,
    };
};
