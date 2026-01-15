
import React, { useState } from 'react';
import { GeneratedImage } from '../types';

interface ResultCardProps {
  image: GeneratedImage;
}

const ResultCard: React.FC<ResultCardProps> = ({ image }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 500) + 120);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `snaplock-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-white rounded-[40px] overflow-hidden border border-zinc-100 shadow-xl shadow-black/5 transition-all duration-500 hover:shadow-2xl flex flex-col group">
      {/* Social Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 border-2 border-emerald-500/20 p-0.5 overflow-hidden">
            <img 
              src={image.url} 
              className="w-full h-full object-cover rounded-full grayscale-[0.2]" 
              alt="Avatar"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">Riya V.</span>
              <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
            </div>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Verified Identity</p>
          </div>
        </div>
        <button className="text-zinc-300 hover:text-zinc-900 transition-colors">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 cursor-pointer group" onClick={toggleLike}>
        <img 
          src={image.url} 
          alt={image.prompt} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Quality Overlays */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-white uppercase tracking-widest">24-Bit Human Depth</span>
          </div>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-5 right-5 flex flex-col gap-3 translate-x-16 group-hover:translate-x-0 transition-transform duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); downloadImage(); }}
            className="w-11 h-11 bg-white/90 backdrop-blur-xl text-zinc-900 rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all active:scale-90"
          >
            <i className="fa-solid fa-arrow-down-long text-xs"></i>
          </button>
        </div>

        {/* Double Click Like Heart (Visual Only) */}
        {liked && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <i className="fa-solid fa-heart text-white/50 text-8xl animate-ping opacity-0"></i>
           </div>
        )}
      </div>

      {/* Social Footer Interactions */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={toggleLike}
              className={`flex items-center gap-2 transition-all active:scale-75 ${liked ? 'text-rose-500' : 'text-zinc-900 hover:text-zinc-500'}`}
            >
              <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`}></i>
              <span className="text-[11px] font-black tracking-tighter">{likeCount}</span>
            </button>
            <button className="text-zinc-900 hover:text-zinc-500 flex items-center gap-2">
              <i className="fa-regular fa-comment text-xl"></i>
              <span className="text-[11px] font-black tracking-tighter">{Math.floor(likeCount/10)}</span>
            </button>
            <button className="text-zinc-900 hover:text-zinc-500">
              <i className="fa-regular fa-paper-plane text-xl"></i>
            </button>
          </div>
          <div className="bg-zinc-100 text-zinc-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
            Just Now
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-zinc-800 leading-relaxed font-medium">
            <span className="font-black mr-2">riya_official</span>
            {image.prompt}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[9px] font-bold text-blue-500">#Lifestyle</span>
            <span className="text-[9px] font-bold text-blue-500">#InfluencerSnap</span>
            <span className="text-[9px] font-bold text-blue-500">#RawPhotography</span>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-50 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
           <span className="text-[9px] font-black text-zinc-900 uppercase tracking-widest">Biological Accuracy Verified</span>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
