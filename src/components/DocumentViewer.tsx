import { useEffect } from "react";
import { FileText, ShieldCheck, X } from "lucide-react";
import { Button } from "./common";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
}

export function DocumentViewer({ isOpen, onClose, fileName, fileUrl }: DocumentViewerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 md:p-10 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-[1340px] h-full max-h-[94vh] flex flex-col bg-[#0f172a] rounded-[32px] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.6)] border border-slate-700/50">
        {/* Professional Header Console */}
        <div className="flex items-center justify-between px-8 py-5 bg-[#1e293b] border-b border-slate-700/50">
           <div className="flex items-center gap-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-500/20">
                 <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                 <div className="text-[20px] font-black text-white tracking-tight leading-none">{fileName}</div>
                 <div className="mt-1 text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">High-Fidelity Document Inspection</div>
              </div>
           </div>
           <button 
              onClick={onClose} 
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 hover:bg-rose-600 transition-all duration-300 border border-slate-700"
            >
              <X className="h-5 w-5 text-white" />
            </button>
        </div>

        {/* Document Content */}
        <div className="flex-1 relative bg-black">
           {fileUrl === "#" ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-slate-900">
                 <div className="mb-10 h-24 w-24 rounded-[36px] bg-slate-800 flex items-center justify-center text-brand-500 shadow-2xl border border-slate-700">
                    <ShieldCheck className="h-12 w-12" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">Protected Asset</h3>
                  <p className="mt-5 max-w-sm text-slate-400 text-lg leading-relaxed">This sensitive legal document is encrypted. Full inspection mode is available in production.</p>
                  <Button 
                    className="mt-12 h-14 px-12 rounded-2xl text-[15px] font-bold shadow-2xl shadow-brand-500/20" 
                    onClick={onClose}
                  >
                    Exit Inspection
                  </Button>
              </div>
           ) : (
              <iframe 
                src={fileUrl} 
                className="h-full w-full border-0" 
                title="PDF Preview"
              />
           )}
        </div>
      </div>
    </div>
  );
}
