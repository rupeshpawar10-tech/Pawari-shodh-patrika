import React, { useState, useEffect } from 'react';
import { fileBlobManager } from '../../lib/fileBlobManager';
import { DEFAULT_PAWARI_MEMBER_AVATAR } from '../../data/seedData';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
  fallbackType?: 'avatar' | 'book' | 'default' | string;
  className?: string;
  aspectRatio?: string;
  showFallbackIconOnFail?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

const getEffectiveFallback = (fallbackSrc?: string, fallbackType?: string): string => {
  if (fallbackSrc) return fallbackSrc;
  if (fallbackType === 'avatar') return DEFAULT_PAWARI_MEMBER_AVATAR;
  return DEFAULT_FALLBACK;
};

const getInitialResolvedUrl = (src?: string | null, fallbackSrc?: string): string => {
  if (!src || src.trim() === '') return fallbackSrc || DEFAULT_FALLBACK;
  const trimmed = src.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  return '';
};

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Image preview',
  fallbackSrc: customFallbackSrc,
  fallbackType,
  className = '',
  aspectRatio,
  showFallbackIconOnFail = true,
  onError,
  loading: loadingProp,
  decoding = 'async',
  fetchPriority,
  ...props
}) => {
  const fallbackSrc = getEffectiveFallback(customFallbackSrc, fallbackType);
  const initialUrl = getInitialResolvedUrl(src, fallbackSrc);
  const [resolvedUrl, setResolvedUrl] = useState<string>(initialUrl);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(!initialUrl);

  useEffect(() => {
    let isMounted = true;
    const currentInitial = getInitialResolvedUrl(src, fallbackSrc);

    if (currentInitial) {
      setResolvedUrl(currentInitial);
      setHasError(false);
      setLoading(false);
      return;
    }

    if (!src || src.trim() === '') {
      setResolvedUrl(fallbackSrc);
      setHasError(false);
      setLoading(false);
      return;
    }

    const trimmed = src.trim();
    setHasError(false);
    setLoading(true);

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
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-red-950 to-amber-950 text-amber-200 p-3 text-center border border-amber-500/30 ${className}`}>
        <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center mb-1 text-amber-300 font-serif font-bold text-xs">
          प
        </div>
        <span className="text-[11px] font-serif font-bold text-amber-100 tracking-wider">पवारी शोध पत्रिका</span>
        <span className="text-[9px] text-amber-300/80 uppercase font-sans tracking-widest mt-0.5">Academic Journal</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedUrl || fallbackSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      loading={loadingProp}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={`${className} ${loading ? 'opacity-80' : 'opacity-100'} transition-opacity duration-150`}
      {...props}
    />
  );
};

