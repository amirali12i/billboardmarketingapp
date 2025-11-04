import React, { useRef } from 'react';
import { ElementType } from '../types';
import { ImageIcon, TrashIcon, UploadIcon } from './icons';
import { fileToBase64 } from '../utils/file';

interface UserUploadsPanelProps {
  uploads: string[];
  onUpload: (imageData: string) => void;
  onRemove: (index: number) => void;
  onAddElement: (type: ElementType, options: any) => void;
}

const UserUploadsPanel: React.FC<UserUploadsPanelProps> = ({ uploads, onUpload, onRemove, onAddElement }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // FIX: Replaced for...of loop with a standard for loop to ensure correct type inference for 'file' from the FileList, which was being inferred as 'unknown'.
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const base64 = await fileToBase64(file);
                onUpload(base64);
            }
        }
    };
    
    const handleAddImageToCanvas = (imageUrl: string) => {
        onAddElement(ElementType.Image, { 
            src: imageUrl, 
            width: 400, 
            height: 300,
            filters: { opacity: 1, brightness: 1, contrast: 1, grayscale: 0 }
        });
    };

    return (
        <div>
            <div className="flex items-center mb-4">
                <UploadIcon className="w-6 h-6 me-3 text-green-400" />
                <h2 className="text-xl font-bold">آپلودهای من</h2>
            </div>

            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 hover:border-green-500 transition-colors"
                >
                    <UploadIcon className="w-8 h-8 mb-2" />
                    <span>برای آپلود کلیک کنید</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    multiple
                />
            </div>
            
            <div className="mt-4">
                {uploads.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                        {uploads.map((img, index) => (
                             <div key={index} className="group relative">
                                <img 
                                    src={img} 
                                    alt={`Uploaded image ${index + 1}`} 
                                    className="w-full h-auto object-cover rounded-lg aspect-video cursor-pointer" 
                                    onClick={() => handleAddImageToCanvas(img)}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300 rounded-lg pointer-events-none">
                                    <span className="text-white opacity-0 group-hover:opacity-100 font-bold">افزودن به بوم</span>
                                </div>
                                <button onClick={() => onRemove(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="حذف تصویر">
                                    <TrashIcon className="w-3 h-3"/>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>هنوز تصویری آپلود نکرده‌اید.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserUploadsPanel;