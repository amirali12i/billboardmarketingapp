import React, { useRef } from 'react';
import { BrandKit, ElementType } from '../types';
import { BrandKitIcon, ImageIcon, TrashIcon } from './icons';
import { palettes } from '../data/palettes';
import { fileToBase64 } from '../utils/file';

interface BrandKitPanelProps {
  brandKit: BrandKit;
  onUpdateBrandKit: (updates: Partial<BrandKit>) => void;
  onAddElement: (type: ElementType, options: any) => void;
}

const BrandKitPanel: React.FC<BrandKitPanelProps> = ({ brandKit, onUpdateBrandKit, onAddElement }) => {
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleColorChange = (index: number, newColor: string) => {
        const newColors = [...brandKit.colors];
        newColors[index] = newColor;
        onUpdateBrandKit({ colors: newColors });
    };
    
    const addColor = () => {
        const newColors = [...brandKit.colors, '#FFFFFF'];
        onUpdateBrandKit({ colors: newColors });
    };

    const removeColor = (index: number) => {
        const newColors = brandKit.colors.filter((_, i) => i !== index);
        onUpdateBrandKit({ colors: newColors });
    };
    
    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64Logo = await fileToBase64(file);
            onUpdateBrandKit({ logo: base64Logo });
        }
    };
    
    const handleAddLogoToCanvas = () => {
      if (!brandKit.logo) return;
       onAddElement(ElementType.Image, { 
         src: brandKit.logo, 
         width: 200, 
         height: 200,
         filters: { opacity: 1, brightness: 1, contrast: 1, grayscale: 0 }
      });
    }

    return (
        <div>
            <div className="flex items-center mb-4">
                <BrandKitIcon className="w-6 h-6 me-3 text-amber-400" />
                <h2 className="text-xl font-bold">کیت برند</h2>
            </div>

            <div className="space-y-6">
                {/* Brand Colors */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">رنگ‌های برند شما</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {brandKit.colors.map((color, index) => (
                            <div key={index} className="relative group">
                                <input 
                                    type="color" 
                                    value={color}
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                    className="w-full h-12 rounded-md border-2 border-gray-300 dark:border-gray-600 cursor-pointer overflow-hidden"
                                    style={{'--color': color} as any}
                                />
                                <button onClick={() => removeColor(index)} className="absolute top-0 right-0 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        ))}
                         <button onClick={addColor} className="w-full h-12 rounded-md border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            +
                         </button>
                    </div>
                </div>

                 {/* Suggested Palettes */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">پالت‌های پیشنهادی</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {palettes.map(palette => (
                            <div key={palette.name} onClick={() => onUpdateBrandKit({ colors: palette.colors })} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                <p className="text-xs mb-1 text-gray-600 dark:text-gray-300">{palette.name}</p>
                                <div className="flex h-5 rounded overflow-hidden">
                                    {palette.colors.map(c => <div key={c} style={{backgroundColor: c}} className="flex-1" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Brand Logo */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">لوگوی برند</h3>
                    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                        {brandKit.logo ? (
                            <div className="flex flex-col items-center gap-4">
                               <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center p-2">
                                  <img src={brandKit.logo} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
                               </div>
                               <div className="flex gap-2">
                                  <button onClick={handleAddLogoToCanvas} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">افزودن به بوم</button>
                                  <button onClick={() => logoInputRef.current?.click()} className="flex-1 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">تغییر لوگو</button>
                               </div>
                            </div>
                        ) : (
                            <button onClick={() => logoInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 hover:border-cyan-500 transition-colors">
                                <ImageIcon className="w-10 h-10 mb-2"/>
                                <span>آپلود لوگو</span>
                            </button>
                        )}
                        <input
                          type="file"
                          ref={logoInputRef}
                          onChange={handleLogoUpload}
                          className="hidden"
                          accept="image/png, image/jpeg, image/svg+xml"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandKitPanel;