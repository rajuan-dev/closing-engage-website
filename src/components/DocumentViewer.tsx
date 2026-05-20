import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, ShieldCheck, X } from "lucide-react";
import { Button } from "./common";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
}

export function DocumentViewer({ isOpen, onClose, fileName, fileUrl }: DocumentViewerProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const previewUrl = useMemo(() => {
    const source = resolvedUrl || fileUrl;
    if (!source || source === "#") return source;
    return `${source}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
  }, [fileUrl, resolvedUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscrollBehavior = document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscrollBehavior;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !fileUrl || fileUrl === "#" || fileUrl.startsWith("blob:")) {
      setResolvedUrl(fileUrl === "#" ? null : fileUrl);
      setPreviewError(null);
      setIsLoading(false);
      return;
    }

    let objectUrl: string | null = null;
    const controller = new AbortController();

    const loadPreview = async () => {
      setIsLoading(true);
      setPreviewError(null);

      try {
        const response = await fetch(fileUrl, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Preview request failed with ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setResolvedUrl(objectUrl);
      } catch (error) {
        if (controller.signal.aborted) return;

        setResolvedUrl(fileUrl);
        setPreviewError("Inline preview could not be prepared. Use Open Directly if the document stays blank.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-6 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="flex h-full max-h-[94vh] w-full max-w-[1340px] flex-col overflow-hidden rounded-[32px] border border-slate-700/50 bg-[#0f172a] shadow-[0_50px_120px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
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
           <div className="flex items-center gap-3">
             {fileUrl !== "#" ? (
               <a
                 href={fileUrl}
                 target="_blank"
                 rel="noreferrer"
                 className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-400 hover:bg-slate-700"
               >
                 <ExternalLink className="h-4 w-4" />
                 Open Directly
               </a>
             ) : null}
             <button 
                onClick={onClose} 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 transition-all duration-300 hover:bg-rose-600"
              >
                <X className="h-5 w-5 text-white" />
              </button>
           </div>
        </div>

        {/* Document Content */}
        <div className="relative flex-1 overflow-hidden bg-black">
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
             <div className="flex h-full flex-col bg-[#020617]">
               <div className="border-b border-slate-800 bg-slate-950/90 px-6 py-3 text-sm text-slate-300">
                 {previewError ? (
                   <span>{previewError}</span>
                 ) : (
                   <span>
                     If the preview stays blank, use <span className="font-semibold text-white">Open Directly</span> to view the PDF in a browser tab.
                   </span>
                 )}
               </div>
               <div className="min-h-0 flex-1 overscroll-contain">
                 {isLoading ? (
                   <div className="flex h-full items-center justify-center bg-slate-950 text-slate-300">
                     Preparing secure preview...
                   </div>
                 ) : (
                   <object
                     data={previewUrl}
                     type="application/pdf"
                     className="h-full w-full"
                     aria-label={fileName}
                   >
                     <iframe
                       src={previewUrl}
                       className="h-full w-full border-0"
                       title="PDF Preview"
                     />
                   </object>
                 )}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
