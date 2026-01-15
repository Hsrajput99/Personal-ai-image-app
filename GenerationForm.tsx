
import React, { useState, useEffect } from 'react';

interface GenerationFormProps {
  onGenerate: (config: { 
    outfit: string; 
    location: string; 
    aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
    imageSize: "1K" | "2K" | "4K";
    strictMode: boolean;
    imageCount: number;
  }) => void;
  isLoading: boolean;
  disabled: boolean;
  isPro: boolean;
  initialValues?: { outfit: string; location: string };
}

const GenerationForm: React.FC<GenerationFormProps> = ({ onGenerate, isLoading, disabled, isPro, initialValues }) => {
  const [outfit, setOutfit] = useState('');
  const [location, setLocation] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "3:4" | "4:3" | "9:16" | "16:9">("3:4");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [imageCount, setImageCount] = useState(1);

  useEffect(() => {
    if (initialValues) {
      setOutfit(initialValues.outfit);
      setLocation(initialValues.location);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outfit || !location) return;
    onGenerate({ outfit, location, aspectRatio, imageSize, strictMode: true, imageCount });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">What's she wearing?</label>
            <input 
              type="text"
              value={outfit}
              onChange={(e) => setOutfit(e.target.value)}
              placeholder="e.g. Blue summer dress"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black outline-none transition-all"
              disabled={disabled || isLoading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Where is she?</label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Rooftop garden at sunset"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black outline-none transition-all"
              disabled={disabled || isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Aspect Ratio</label>
              <select 
                value={aspectRatio} 
                onChange={(e: any) => setAspectRatio(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                disabled={disabled || isLoading}
              >
                <option value="1:1">Square (1:1)</option>
                <option value="3:4">Portrait (3:4)</option>
                <option value="9:16">Story (9:16)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Burst Mode</label>
              <div className="flex gap-1.5">
                {[1, 2, 4].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setImageCount(c)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${
                      imageCount === c ? 'bg-black text-white border-black' : 'bg-white border-zinc-100 text-zinc-400'
                    }`}
                    disabled={disabled || isLoading}
                  >
                    x{c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {imageCount > 1 && !isPro && (
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-3 items-start">
            <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
            <p className="text-[9px] text-amber-700 font-bold leading-tight">
              NOTE: Burst mode (x{imageCount}) on free tier takes ~30 seconds due to API safety limits. 
              <br/><span className="text-zinc-900 underline cursor-pointer">Upgrade to Pro</span> for instant capture.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || isLoading || !outfit || !location}
          className={`w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${
            disabled || isLoading || !outfit || !location
              ? 'bg-zinc-100 text-zinc-300'
              : 'bg-black text-white hover:bg-zinc-800'
          }`}
        >
          {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
          {isLoading ? 'CAPTURING SEQUENCE...' : 'START CAPTURE'}
        </button>
      </form>
    </div>
  );
};

export default GenerationForm;
