import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import { fileBlobManager } from '../../lib/fileBlobManager';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  aspectRatio?: string;
  showFallbackIconOnFail?: boolean;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80';

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Image preview',
  fallbackSrc = DEFAULT_FALLBACK,
  className = '',
  showFallbackIconOnFail = true,
  onError,
  ...props
}) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);
    setLoading(true);

    if (!src || src.trim() === '') {
      setResolvedUrl(fallbackSrc);
      setLoading(false);
      return;
    }

    const trimmed = src.trim();

    // Direct HTTP, HTTPS, Data URL, Blob URL
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:')
    ) {
      setResolvedUrl(trimmed);
      setLoading(false);
      return;
    }

    // Attempt to resolve file_ ID or stored reference
    fileBlobManager.getBlobUrl(trimmed).then(resolved => {
      if (isMounted) {
        if (resolved && resolved.trim() !== '') {
          setResolvedUrl(resolved);
        } else {
          setResolvedUrl(fallbackSrc);
        }
        setLoading(false);
      }
    }).catch(err => {
      console.warn('[SafeImage] Failed to resolve URL:', err);
      if (isMounted) {
        setResolvedUrl(fallbackSrc);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      if (resolvedUrl !== fallbackSrc && fallbackSrc) {
        setResolvedUrl(fallbackSrc);
      }
    }
    if (onError) {
      onError(e);
    }
  };

  if (hasError && showFallbackIconOnFail && (!resolvedUrl || resolvedUrl === fallbackSrc)) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-4 text-center ${className}`}>
        <ImageIcon className="w-8 h-8 opacity-50 mb-1" />
        <span className="text-[10px] font-mono">Image preview unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedUrl || fallbackSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={`${className} ${loading ? 'opacity-80 animate-pulse' : 'opacity-100'} transition-opacity duration-200`}
      {...props}
    />
  );
};
