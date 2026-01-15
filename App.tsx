
import React, { useState, useEffect } from 'react';
import { ModelType, GenerationConfig, GeneratedImage } from './types';
import { generateLifestyleImage } from './services/geminiService';
import GenerationForm from './components/GenerationForm';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useProModel, setUseProModel] = useState(false);
  const [hasProKey, setHasProKey] = useState(false);
  const [flash, setFlash] = useState(false);
  const [formValues, setFormValues] = useState({ outfit: '', location: '' });

  const stylePresets = [
    { name: 'Cafe Date', outfit: 'Beige knit top', loc: 'Aesthetic minimalist cafe' },
    { name: 'Desi Vibe', outfit: 'Traditional yellow kurti', loc: 'Old Haveli balcony' },
    { name: 'Gym Look', outfit: 'Black yoga set', loc: 'Modern bright gym' },
    { name: 'Night Out', outfit: 'Sequin black dress', loc: 'Neon lit city street' }
  ];

  useEffect(() => {
    const checkProKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasProKey(has);
      }
    };
    checkProKey();
  }, []);

  const handleSelectProKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasProKey(true);
      setUseProModel(true);
    }
  };

  const applyPreset = (outfit: string, loc: string) => {
    setFormValues({ outfit, location: loc });
    document.getElementById('generation-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async (config: Omit<GenerationConfig, 'model'>) => {
    if (!referenceImage) {
      setError("Please upload a reference image first.");
      return;
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    setError(null);
    setIsGenerating(true);
    setStatusMessage("Initializing Camera Engine...");

    try {
      const modelType = useProModel ? ModelType.PRO : ModelType.FLASH;
      const imageUrls = await generateLifestyleImage(
        referenceImage,
        { ...config, model: modelType },
        undefined,
        (msg, progress) => {
          setStatusMessage(msg);
          setProgressPercent(progress);
        }
      );

      const newResults: GeneratedImage[] = imageUrls.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        url: url,
        prompt: `${config.outfit} at ${config.location}`,
        timestamp: Date.now(),
        resolution: config.imageSize || (modelType === ModelType.FLASH ? "SD" : "1K"),
        strictMode: config.strictMode
      }));

      setResults(prev => [...newResults, ...prev]);
      
      if (imageUrls.length < config.imageCount) {
        setError("Note: Batch partially completed due to server load.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
      setStatusMessage("");
      setProgressPercent(0);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fafafa] selection:bg-black selection:text-white">
      {flash && <div className="fixed inset-0 bg-white z-[100] animate-out fade-out duration-300 pointer-events-none" />}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 transition-transform hover:rotate-0">
            <i className="fa-solid fa-camera-retro text-white text-lg"></i>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-zinc-900 leading-none">Snap<span className="text-zinc-400">Lock</span></h1>
            <p className="text-[9px] font-black text-emerald-500 tracking-[0.2em] uppercase mt-1">Direct Identity Capture</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {useProModel ? (
             <div className="bg-zinc-900 text-white px-4 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2">
               <span className="text-[9px] font-black uppercase tracking-widest">4K Engine Active</span>
               <i className="fa-solid fa-bolt text-yellow-400 text-[10px]"></i>
             </div>
          ) : (
            <button 
              onClick={handleSelectProKey} 
              className="text-[10px] bg-white border-2 border-zinc-100 hover:border-black text-zinc-900 px-5 py-2 rounded-full font-black uppercase transition-all shadow-sm"
            >
              Go Pro
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-12">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-100 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {isGenerating ? <span className="text-emerald-500 animate-pulse">Session Active</span> : 'Ready for Capture'}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter leading-[0.9]">
            The Most Relatable <br/>
            <span className="text-zinc-300">Identity-Consistent AI.</span>
          </h2>
        </section>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
          {stylePresets.map((s, idx) => (
            <button 
              key={idx} 
              onClick={() => applyPreset(s.outfit, s.loc)} 
              className="flex-shrink-0 bg-white border border-zinc-100 px-6 py-4 rounded-3xl flex items-center gap-3 hover:border-black transition-all group shadow-sm active:scale-95"
            >
              <i className="fa-solid fa-sparkles text-[10px] text-zinc-400 group-hover:text-zinc-900"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-900">{s.name}</span>
            </button>
          ))}
        </div>

        <div id="generation-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
          <div className="lg:col-span-5">
            <ImageUploader onImageSelect={setReferenceImage} currentImage={referenceImage} />
          </div>
          <div className="lg:col-span-7">
            <GenerationForm 
              onGenerate={handleGenerate} 
              isLoading={isGenerating} 
              disabled={!referenceImage}
              isPro={useProModel}
              initialValues={formValues}
            />
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-6 py-5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg shadow-rose-500/5">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              {error}
            </div>
            <button onClick={() => setError(null)} className="p-2 hover:bg-rose-100 rounded-full transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <section className="space-y-8 pb-32">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Camera Roll</h3>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Smartphone RAW Perspective</p>
            </div>
            {isGenerating && (
              <div className="flex items-center gap-3 bg-zinc-900 text-white px-5 py-2.5 rounded-full shadow-xl">
                <i className="fa-solid fa-circle-notch fa-spin text-emerald-400 text-xs"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">{statusMessage}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {isGenerating && (
              <div className="bg-white border border-zinc-100 rounded-[48px] overflow-hidden shadow-2xl aspect-[3/4] flex flex-col items-center justify-center gap-6 p-10 text-center relative">
                <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center relative">
                   <i className="fa-solid fa-atom fa-spin text-zinc-200 text-4xl"></i>
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-50" />
                      <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-500 transition-all duration-1000" strokeDasharray="276" strokeDashoffset={276 - (276 * progressPercent / 100)} />
                   </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-zinc-900 font-black text-lg uppercase tracking-tight">{statusMessage}</p>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Analyzing biometrics for 100% face match...
                  </p>
                </div>
              </div>
            )}
            {results.map((img) => <ResultCard key={img.id} image={img} />)}
          </div>
        </section>
      </main>
      
      {referenceImage && (
        <div className="fixed bottom-10 right-10 z-[60]">
          <div className="bg-white p-2 rounded-[32px] shadow-2xl border border-zinc-100 flex items-center gap-3 pr-6 group hover:scale-105 transition-transform">
             <div className="w-14 h-14 rounded-[24px] overflow-hidden border-2 border-emerald-500 p-0.5">
                <img src={referenceImage} className="w-full h-full object-cover rounded-[20px]" alt="Source" />
             </div>
             <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Locked ID</p>
                <p className="text-[12px] font-black text-zinc-900 uppercase">BIOMETRIC ACTIVE</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
