// src/hooks/useGaphorIcon.ts
import { useState, useEffect } from 'react';
import { Canvg } from 'canvg';
import { getSvgContent } from '../utils/iconMapping';
import { umlSvgContent } from '../utils/iconMapping';

interface UseGaphorIconProps {
  elementType: string;
  width?: number;
  height?: number;
  color?: string;
  scale?: number;
}

// Cache para imagens convertidas
const imageCache = new Map<string, HTMLImageElement>();

export const useGaphorIcon = ({
  elementType,
  width = 40,
  height = 40,
  color = '#374151',
  scale = 1
}: UseGaphorIconProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadIcon = () => {
      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);

        // Verifica se já existe no cache
        const cacheKey = `${elementType}-${width}-${height}-${color}-${scale}`;
        
        if (imageCache.has(cacheKey)) {
          if (isMounted) {
            setImage(imageCache.get(cacheKey)!);
            setLoading(false);
          }
          return;
        }

        // Carrega o conteúdo SVG 
        // const svgContent = getSvgContent(elementType);
        const svgContent = umlSvgContent[elementType];

        console.log('SVG para', elementType, svgContent);

        
        // Personaliza a cor
        const customizedSvg = customizeSvgColor(svgContent, color);
        
        // Converte SVG para imagem
        convertSvgToImage(customizedSvg, width, height, scale)
          .then((img) => {
            if (isMounted) {
              imageCache.set(cacheKey, img);
              setImage(img);
              setLoading(false);
            }
          })
          .catch((err) => {
            if (isMounted) {
              console.error('Error converting SVG to image:', err);
              setError(err instanceof Error ? err.message : 'Unknown error');
              setLoading(false);
            }
          });

      } catch (err) {
        if (isMounted) {
          console.error('Error in useGaphorIcon:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [elementType, width, height, color, scale]);

  return { image, loading, error };
};

// Função para converter SVG para Image
const convertSvgToImage = (
  svgContent: string,
  width: number,
  height: number,
  scale: number
): Promise<HTMLImageElement> => {
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject('Canvas context not available');

    try {
      const v = await Canvg.fromString(ctx, svgContent);
      await v.render();
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = canvas.toDataURL('image/png');
    } catch (err) {
      reject(err);
    }
  });
};

// Função para personalizar a cor do SVG
const customizeSvgColor = (svgContent: string, color: string): string => {
  return svgContent
    .replace(/#000000/g, color)
    .replace(/fill:#000000/g, `fill:${color}`)
    .replace(/stroke:#000000/g, `stroke:${color}`)
    .replace(/color:#000000/g, `color:${color}`)
    .replace(/fill="black"/g, `fill="${color}"`)
    .replace(/stroke="black"/g, `stroke="${color}"`);
};