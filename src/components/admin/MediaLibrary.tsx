import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { auth, firebaseConfig } from '../../lib/firebase';
import { SafeImage } from '../common/SafeImage';
import { Upload, Copy, Check, Trash2, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const MediaLibrary: React.FC = () => {
  const { mediaFiles, uploadFileToStorage, deleteFileFromStorage } = useCms();
  const { currentUser, loading: authLoading, googleLogin } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState<number>(0);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setErrorMsg(null);

    const activeUser = currentUser || auth.currentUser;
    if (!activeUser) {
      setErrorMsg('Please sign in with Google first before uploading files.');
      return;
    }

    setUploading(true);
    setPercent(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgressMsg(`Uploading [${i + 1}/${files.length}] "${file.name}"...`);
        await uploadFileToStorage(file, undefined, (p) => {
          setPercent(p);
        });
      }
      setProgressMsg(null);
    } catch (err: any) {
      console.error('[Media Library Upload Error]', err);
      const msg = err?.message || String(err);
      setErrorMsg(msg);
    } finally {
      setUploading(false);
      setProgressMsg(null);
      e.target.value = '';
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Firebase Media & Document Library</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Upload, manage, and retrieve direct Firebase Storage URLs for article PDFs and artwork</p>
        </div>

        <label className="cursor-pointer px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2 shrink-0">
          <Upload className="w-4 h-4" />
          <span>{uploading ? `Uploading... ${percent}%` : 'Upload Media Files'}</span>
          <input type="file" multiple accept=".pdf,.doc,.docx,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      {uploading && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-amber-950">
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-amber-900 shrink-0"></div>
              <span>{progressMsg || 'Uploading file...'}</span>
            </span>
            <span className="font-bold">{percent}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-mono flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaFiles.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-slate-400 font-mono text-xs border">
            No media files uploaded yet. Click Upload above to store files in Firebase Storage.
          </div>
        ) : (
          mediaFiles.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2 flex flex-col justify-between">
              
              <div className="space-y-2">
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                  {item.type === 'image' || item.name.match(/\.(png|jpe?g|gif|webp|svg)$/i) ? (
                    <SafeImage src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-amber-300 font-serif font-bold text-xs flex flex-col items-center">
                      <FileText className="w-8 h-8 mb-1" />
                      <span>PDF Document</span>
                    </div>
                  )}
                </div>

                <p className="font-semibold text-slate-800 text-xs truncate" title={item.name}>{item.name}</p>
                <p className="text-[10px] font-mono text-slate-400">{(item.size / 1024).toFixed(1)} KB • {item.uploaded_at.split('T')[0]}</p>
              </div>

              <div className="pt-2 border-t flex items-center justify-between space-x-2 text-xs">
                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  className="px-2.5 py-1 bg-amber-500 text-red-950 font-bold rounded text-[11px] flex items-center space-x-1"
                >
                  {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  onClick={() => deleteFileFromStorage(item.storage_path)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
