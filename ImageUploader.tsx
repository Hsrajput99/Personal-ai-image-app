
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onImageSelect(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm h-full flex flex-col">
      <div 
        onClick={triggerUpload}
        className={`relative flex-1 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden min-h-[300px] ${
          currentImage ? 'border-transparent' : 'border-gray-200 hover:border-pink-300 bg-gray-50'
        }`}
      >
        {currentImage ? (
          <>
            <img 
              src={currentImage} 
              alt="Reference Identity" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <i className="fa-solid fa-arrows-rotate"></i> Change Reference
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6 space-y-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-2">
              <i className="fa-solid fa-user-plus text-gray-400"></i>
            </div>
            <p className="text-sm font-semibold text-gray-700">Choose Reference</p>
            <p className="text-xs text-gray-400">Upload a clear photo of the young Indian influencer face</p>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xs">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-700 uppercase">Identity Locked</p>
          <p className="text-[10px] text-gray-400">Features will be preserved in all generations</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
