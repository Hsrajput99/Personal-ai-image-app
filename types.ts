
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  resolution?: string;
  strictMode?: boolean;
}

export enum ModelType {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview'
}

export interface GenerationConfig {
  model: ModelType;
  outfit: string;
  location: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  imageSize?: "1K" | "2K" | "4K";
  strictMode: boolean;
  imageCount: number;
}
