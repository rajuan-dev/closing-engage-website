import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Download, Printer, ZoomIn, ZoomOut, Search, RotateCw, Info, FolderKanban, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Surface } from "@/components/common";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";
import { hasPortalPermission } from "@/utils/portalPermissions";

export function CompanyDocumentsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { companyDocuments } = useStore();
  const doc = companyDocuments.find((d) => d.id === id) || companyDocuments[0];
  const canDownloadDocuments = hasPortalPermission("downloadDocuments");

  const [zoom, setZoom] = useState(100);
  const [previewPage, setPreviewPage] = useState(1);
  const totalPreviewPages = 5;

  const handlePrint = () => {
    toast.info("Preparing document for print...");
    setTimeout(() => window.print(), 1000);
  };

  const handleDownload = () => {
    if (!canDownloadDocuments) {
      toast.error("You do not have permission to download documents.");
      return;
    }

    toast.success(`Started downloading: ${doc.name}`);
    // Simulate a real download experience
    const dummyBlob = new Blob(["Mock PDF Content"], { type: "application/pdf" });
    const url = window.URL.createObjectURL(dummyBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", doc.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Link to="/company/documents" className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-600">
              <ChevronLeft className="h-4 w-4" />
              Back to Documents
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
                {doc.name}
              </h1>
              <Badge status={doc.status} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[16px] text-ink-500">
              <FileText className="h-4 w-4" />
              Order ID: {doc.orderId}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePrint} variant="outline" className="h-[50px] rounded-[12px] border-[#dfe6f2] px-6 text-[15px] font-semibold">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            {canDownloadDocuments ? (
              <Button onClick={handleDownload} className="h-[50px] rounded-[12px] px-6 text-[15px] font-semibold">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            ) : null}
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="flex items-center justify-between text-[15px] text-ink-600">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                  className="flex items-center gap-2 font-semibold text-ink-700 hover:text-brand-600 transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                  {zoom}%
                </button>
                <button 
                  onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                  className="text-ink-500 hover:text-brand-600 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  disabled={previewPage === 1}
                  onClick={() => setPreviewPage(p => p - 1)}
                  className="text-ink-500 hover:text-brand-600 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <span>Page</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f4f7fc] font-bold text-ink-900 border border-[#e5ebf5]">{previewPage}</span>
                  <span>of {totalPreviewPages}</span>
                </div>
                <button 
                  disabled={previewPage === totalPreviewPages}
                  onClick={() => setPreviewPage(p => p + 1)}
                  className="text-ink-500 hover:text-brand-600 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-6">
                <button onClick={() => toast.info("Searching document...")} className="text-ink-500 hover:text-brand-600 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
                <button onClick={() => { setZoom(100); setPreviewPage(1); }} className="text-ink-500 hover:text-brand-600 transition-colors">
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Surface>

          <Surface className="printable-document rounded-[22px] border border-[#dfe6f2] bg-[#edf2f8] p-10 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mx-auto min-h-[1180px] max-w-[820px] bg-white px-12 py-12 shadow-[0_18px_38px_rgba(20,48,112,0.08)]">
              <div className="relative">
                <div className="mb-12 flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-600" />
                    <div className="text-xl font-bold tracking-tight text-ink-900">Closing Engage</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-400">DOCUMENT ID</div>
                    <div className="text-sm font-semibold text-ink-700">{doc.id}-{doc.orderId}</div>
                  </div>
                </div>
                <div className="border-b border-ink-100 pb-8">
                  <h2 className="text-3xl font-extrabold text-ink-900">{doc.name.replace(".pdf", "").replace(/_/g, " ")}</h2>
                  <p className="mt-2 text-sm text-ink-500">Official Record of Transaction • {doc.uploadDate}</p>
                </div>
                <div className="mt-10 space-y-6">
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-ink-400">PARTIES INVOLVED</div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="rounded-xl border border-ink-100 bg-slate-50/50 p-4">
                         <div className="text-[10px] font-bold text-ink-400">ISSUER</div>
                         <div className="mt-1 font-bold text-ink-900">Estate Flux Title Company</div>
                       </div>
                       <div className="rounded-xl border border-ink-100 bg-slate-50/50 p-4">
                         <div className="text-[10px] font-bold text-ink-400">RECIPIENT</div>
                         <div className="mt-1 font-bold text-ink-900">Robert & Martha Henderson</div>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-ink-400">LEGAL DISCLOSURE</div>
                    <p className="text-[13px] leading-[1.8] text-ink-600">
                      This document serves as an official record for the transaction associated with Order ID {doc.orderId}. 
                      The information contained herein is confidential and intended solely for the use of the individual 
                      or entity to whom they are addressed. If you have received this document in error, please notify 
                      the system manager.
                    </p>
                    <div className="h-3 w-full rounded-full bg-slate-100" />
                    <div className="h-3 w-[92%] rounded-full bg-slate-100" />
                    <div className="h-3 w-[84%] rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03]">
                  <div className="rotate-[-45deg] text-[140px] font-black tracking-tighter">
                    CONFIDENTIAL
                  </div>
                </div>
              </div>
            </div>
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <Info className="h-5 w-5 text-brand-600" />
              <div className="text-[18px] font-bold tracking-tight text-ink-900">File Details</div>
            </div>
            <div className="space-y-6">
              <Detail label="FILE NAME" value={doc.name} />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                <Detail label="SIZE" value={doc.size} />
                <Detail label="STATUS" value={doc.status} valueClassName="text-brand-600" />
              </div>
              <Detail label="UPLOAD DATE" value={doc.uploadDate} />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">UPLOADED BY</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4ff] text-[11px] font-bold text-brand-600">
                    {doc.uploadedBy?.split(" ").pop()?.slice(0, 2).toUpperCase() || "NB"}
                  </div>
                  <div className="text-[16px] font-semibold text-ink-900">{doc.uploadedBy || "Notary Partner"}</div>
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <FolderKanban className="h-5 w-5 text-brand-600" />
              <div className="text-[18px] font-bold tracking-tight text-ink-900">Order Information</div>
            </div>
            <div className="space-y-6">
              <Detail label="CLIENT NAME" value="Robert & Martha Henderson" />
              <Detail label="PROPERTY ADDRESS" value="123 Blue Oak Lane, Austin, TX 78701" />
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <RotateCw className="h-5 w-5 text-brand-600" />
              <div className="text-[18px] font-bold tracking-tight text-ink-900">Recent Activity</div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-600 text-brand-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-ink-900">Approved by Admin</div>
                  <div className="mt-1 text-[13px] text-ink-500">Oct 25, 2023 • 10:15 AM</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#d2d8e5] text-ink-400">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-ink-900">Uploaded by Notary</div>
                  <div className="mt-1 text-[13px] text-ink-500">Oct 24, 2023 • 04:30 PM</div>
                </div>
              </div>
            </div>
          </Surface>

          <div className="rounded-[18px] border border-[#cfdcf9] bg-[#edf3ff] px-6 py-5 text-[14px] leading-[1.7] text-brand-700 shadow-[0_12px_30px_rgba(20,48,112,0.04)]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                This document is available only after admin approval. Securely encrypted and stored according to industry standards.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">{label}</div>
      <div className={`mt-2 text-[16px] font-semibold text-ink-900 ${valueClassName ?? ""}`}>{value}</div>
    </div>
  );
}
