import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

/**
 * FileBlobManager
 * Persistent Blob-based URL Management System mapping persistent IDs (e.g. file_123)
 * to local Blob data via IndexedDB and Firestore permanent metadata store.
 * Includes reference counting and garbage collection to prevent browser memory leaks.
 */

const DB_NAME = 'PatrikaFileStore';
const STORE_NAME = 'file_blobs';

// Open or initialize IndexedDB for storing local file Blobs
function openBlobDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB unavailable in current environment'));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save Blob to IndexedDB
export async function saveFileToIndexedDB(fileId: string, blob: Blob): Promise<void> {
  if (!fileId || !blob) return;
  try {
    const idb = await openBlobDB();
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, fileId);
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch (e) {
    console.warn('[FileBlobManager] IndexedDB save warning:', e);
  }
}

// Retrieve Blob from IndexedDB
export async function getFileFromIndexedDB(fileId: string): Promise<Blob | null> {
  if (!fileId) return null;
  try {
    const idb = await openBlobDB();
    const tx = idb.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(fileId);
    return await new Promise((res, rej) => {
      req.onsuccess = () => res((req.result as Blob) || null);
      req.onerror = () => rej(req.error);
    });
  } catch (e) {
    return null;
  }
}

// Helper: Convert base64 data to Blob
export function base64ToBlob(base64Data: string, contentType = 'application/pdf'): Blob | null {
  if (!base64Data) return null;
  try {
    let cleanBase64 = base64Data;
    let type = contentType;

    if (base64Data.includes(';base64,')) {
      const parts = base64Data.split(';base64,');
      type = parts[0].replace('data:', '') || contentType;
      cleanBase64 = parts[1];
    }

    const binaryString = atob(cleanBase64.trim().replace(/[\r\n\s]/g, ''));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  } catch (err) {
    console.error('[FileBlobManager] Failed base64ToBlob:', err);
    return null;
  }
}

class FileBlobRegistry {
  private urlMap = new Map<string, string>(); // fileId -> blobUrl
  private refCounts = new Map<string, number>(); // blobUrl -> active reference count
  private createdUrls = new Set<string>(); // All URL.createObjectURL instances created by registry
  private pendingPromises = new Map<string, Promise<string>>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.revokeAll();
      });
    }
  }

  /**
   * Acquire a stable Blob URL with reference counting.
   */
  async acquireBlobUrl(rawInput: string): Promise<string> {
    if (!rawInput) return '';

    const url = await this.getBlobUrl(rawInput);
    if (url && url.startsWith('blob:')) {
      const count = (this.refCounts.get(url) || 0) + 1;
      this.refCounts.set(url, count);
    }
    return url;
  }

  /**
   * Release a Blob URL reference. When refCount reaches 0, revokeObjectURL is called to prevent memory leaks.
   */
  releaseBlobUrl(blobUrl: string): void {
    if (!blobUrl || !blobUrl.startsWith('blob:')) return;

    if (this.createdUrls.has(blobUrl)) {
      const current = this.refCounts.get(blobUrl) || 1;
      const updated = current - 1;

      if (updated <= 0) {
        this.refCounts.delete(blobUrl);
        this.createdUrls.delete(blobUrl);

        // Remove from urlMap if present
        for (const [key, value] of this.urlMap.entries()) {
          if (value === blobUrl) {
            this.urlMap.delete(key);
            break;
          }
        }

        try {
          URL.revokeObjectURL(blobUrl);
        } catch (e) {
          console.warn('[FileBlobManager] Error revoking Blob URL:', e);
        }
      } else {
        this.refCounts.set(blobUrl, updated);
      }
    }
  }

  /**
   * Get or generate a stable local blob: URL for a given persistent file ID, path, or raw Data URL.
   */
  async getBlobUrl(rawInput: string): Promise<string> {
    if (!rawInput) return '';

    const trimmed = rawInput.trim();

    // 1. Direct HTTP/HTTPS or existing Blob URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    if (trimmed.startsWith('blob:')) {
      return trimmed;
    }

    // Extract clean persistent file ID
    const fileId = trimmed.includes('/') ? trimmed.split('/').pop()! : trimmed;

    // 2. Return from active memory map if available
    if (this.urlMap.has(fileId)) {
      return this.urlMap.get(fileId)!;
    }

    // 3. Deduplicate simultaneous async requests
    if (this.pendingPromises.has(fileId)) {
      return this.pendingPromises.get(fileId)!;
    }

    const promise = this.resolveAndCreateBlobUrl(fileId, trimmed);
    this.pendingPromises.set(fileId, promise);

    try {
      const blobUrl = await promise;
      if (blobUrl && blobUrl.startsWith('blob:')) {
        this.urlMap.set(fileId, blobUrl);
      }
      return blobUrl;
    } finally {
      this.pendingPromises.delete(fileId);
    }
  }

  private async resolveAndCreateBlobUrl(fileId: string, rawInput: string): Promise<string> {
    // A. If raw input is direct base64 string
    if (rawInput.startsWith('data:') || rawInput.length > 300) {
      const blob = base64ToBlob(rawInput);
      if (blob) {
        const url = URL.createObjectURL(blob);
        this.createdUrls.add(url);
        saveFileToIndexedDB(fileId, blob).catch(() => {});
        return url;
      }
    }

    // B. Check IndexedDB persistent store on device
    const localBlob = await getFileFromIndexedDB(fileId);
    if (localBlob) {
      const url = URL.createObjectURL(localBlob);
      this.createdUrls.add(url);
      return url;
    }

    // C. Check localStorage cache
    try {
      const cached = localStorage.getItem(`pdf_cache_${fileId}`);
      if (cached) {
        const blob = base64ToBlob(cached);
        if (blob) {
          saveFileToIndexedDB(fileId, blob).catch(() => {});
          const url = URL.createObjectURL(blob);
          this.createdUrls.add(url);
          return url;
        }
      }
    } catch (e) {}

    // D. Fetch from Firestore permanent document store (user_files collection)
    try {
      const userFileSnap = await getDoc(doc(db, 'user_files', fileId));
      if (userFileSnap.exists()) {
        const data = userFileSnap.data();
        const base64Data = data?.content || data?.base64 || (data?.url?.includes(',') ? data.url.split(',')[1] : null);
        const mimeType = data?.type || 'application/pdf';

        if (base64Data) {
          const blob = base64ToBlob(base64Data, mimeType);
          if (blob) {
            saveFileToIndexedDB(fileId, blob).catch(() => {});
            const url = URL.createObjectURL(blob);
            this.createdUrls.add(url);
            return url;
          }
        }
      }

      // Check media collection fallback
      const mediaSnap = await getDoc(doc(db, 'media', fileId));
      if (mediaSnap.exists()) {
        const data = mediaSnap.data();
        if (data?.url) {
          if (data.url.startsWith('data:') || data.url.length > 300) {
            const blob = base64ToBlob(data.url);
            if (blob) {
              saveFileToIndexedDB(fileId, blob).catch(() => {});
              const url = URL.createObjectURL(blob);
              this.createdUrls.add(url);
              return url;
            }
          } else {
            return data.url;
          }
        }
      }
    } catch (err) {
      console.warn('[FileBlobRegistry] Firestore lookup note:', err);
    }

    return rawInput;
  }

  /**
   * Register a Blob or File directly into registry and IndexedDB with managed tracking
   */
  registerBlob(fileId: string, blob: Blob): string {
    const blobUrl = URL.createObjectURL(blob);
    this.createdUrls.add(blobUrl);
    this.refCounts.set(blobUrl, 1);
    this.urlMap.set(fileId, blobUrl);
    saveFileToIndexedDB(fileId, blob).catch(() => {});
    return blobUrl;
  }

  /**
   * Get cached blob URL synchronously if available in memory
   */
  getMemoryBlobUrl(fileIdOrPath: string): string | null {
    if (!fileIdOrPath) return null;
    const fileId = fileIdOrPath.includes('/') ? fileIdOrPath.split('/').pop()! : fileIdOrPath;
    return this.urlMap.get(fileId) || null;
  }

  /**
   * Revoke all managed Blob URLs on page exit or store reset
   */
  revokeAll(): void {
    for (const url of this.createdUrls) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    }
    this.createdUrls.clear();
    this.refCounts.clear();
    this.urlMap.clear();
  }
}

export const fileBlobManager = new FileBlobRegistry();

/**
 * Custom React Hook for secure, leak-proof Blob URL lifecycle management in components.
 */
export function useManagedBlobUrl(rawInput: string | undefined | null) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let acquiredUrl = '';

    if (!rawInput) {
      setResolvedUrl('');
      setLoading(false);
      return;
    }

    setLoading(true);

    fileBlobManager.acquireBlobUrl(rawInput).then((url) => {
      if (!isMounted) {
        fileBlobManager.releaseBlobUrl(url);
        return;
      }
      acquiredUrl = url;
      setResolvedUrl(url);
      setLoading(false);
    }).catch((err) => {
      console.warn('[useManagedBlobUrl] Error acquiring Blob URL:', err);
      if (isMounted) {
        setResolvedUrl(rawInput);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (acquiredUrl) {
        fileBlobManager.releaseBlobUrl(acquiredUrl);
      }
    };
  }, [rawInput]);

  return { resolvedUrl, loading };
}

