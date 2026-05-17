import { useRef, useState } from "react";
import { CheckCircle2, ChevronRight, CloudUpload, Eye, FileText, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, FooterBand, Surface } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

export function NotaryUploadDocumentsPage() {
  const navigate = useNavigate();
  const { notaryOrders, addCompanyDocument, addActivity, updateCompanyOrder, updateNotaryOrder } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(
    notaryOrders.length > 0 ? `${notaryOrders[0].id} - ${notaryOrders[0].clientName}` : "#CE-94012 - Jonathan Harker"
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([
    new File(["temporary"], "scanback_signed_final.pdf", { type: "application/pdf" }),
  ]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const appendFiles = (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => file.name.toLowerCase().endsWith(".pdf"));
    if (accepted.length === 0) return;
    setUploadedFiles((current) => [...current, ...accepted]);
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files?.length) appendFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
          Upload Documents
        </h1>
        <p className="mt-1 text-[13px] text-ink-500">
          Upload scanback documents for your assigned orders. Ensure all pages are legible and included in a single PDF file where possible.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px] xl:items-start">
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              Select Assigned Order
            </div>
            <label className="flex h-[50px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
              <select
                value={selectedOrder}
                onChange={(event) => setSelectedOrder(event.target.value)}
                className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
              >
                {notaryOrders.map((o) => (
                  <option key={o.id} value={`${o.id} - ${o.clientName}`}>
                    {o.id} - {o.clientName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) appendFiles(event.target.files);
              event.target.value = "";
            }}
          />

          <div
            className={`rounded-[20px] border border-dashed px-8 py-12 text-center transition-colors ${
              isDragActive ? "border-brand-300 bg-[#f5f9ff]" : "border-[#dfe6f2] bg-white"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#eaf0ff] text-brand-600">
              <CloudUpload className="h-7 w-7" />
            </div>
            <div className="mt-4 text-[18px] font-bold tracking-tight text-ink-900">
              Drag & Drop Scanbacks
            </div>
            <div className="mx-auto mt-2 max-w-[420px] text-[13px] text-ink-500">
              Drop your PDF files here or click to browse your computer.
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-7 h-[42px] rounded-[12px] border-[#dfe6f2] px-5 text-[15px] font-semibold text-brand-600"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </div>

          {uploadedFiles.map((file, index) => (
            <Surface
              key={`${file.name}-${index}`}
              className="rounded-[18px] border border-[#e4ebf5] bg-white p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-ink-900">{file.name}</div>
                    <div className="mt-1 text-[13px] text-ink-500">4.2 MB • Ready to Submit</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => setViewingFile({ name: file.name, url: URL.createObjectURL(file) })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm hover:bg-brand-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => removeFile(index)} className="text-ink-400 hover:text-danger-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 h-[4px] rounded-full bg-[#dff3e8]">
                <div className="h-[4px] w-full rounded-full bg-[#1fc27e]" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1fc27e]">
                <span>Verification Complete</span>
                <span>100%</span>
              </div>
            </Surface>
          ))}
        </div>

        <Surface className="h-fit rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink-500">Submission Guide</div>
          <div className="mt-5 space-y-5 text-[14px] leading-[1.7] text-ink-500">
            {[
              ["Legibility", "Ensure all text is sharp and readable for the title officer."],
              ["Order of Pages", "Keep the stack in the original order provided in the packet."],
              ["Full Stack", "Include all pages, even if they only contain boilerplate text."],
            ].map(([title, body]) => (
              <div key={title} className="flex gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-brand-200 text-brand-600">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div>
                  <strong className="block text-ink-900">{title}</strong>
                  {body}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-[14px] font-medium text-[#1aa468]">
          <CheckCircle2 className="h-4 w-4" />
          All systems operational
        </div>
        <Button 
          className="h-[52px] rounded-[12px] px-7 text-[16px] font-semibold"
          onClick={() => {
            if (uploadedFiles.length === 0) {
              toast.error("Please upload at least one document.");
              return;
            }

            const orderId = selectedOrder.split(" - ")[0].replace("#", "");

            // Save uploaded files to the global documents list
            uploadedFiles.forEach((file) => {
              const docRecord = {
                id: "DOC-" + (Math.floor(Math.random() * 90000) + 10000),
                name: file.name,
                orderId: orderId,
                uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
                status: "Submitted" as const,
                uploadedBy: "You (Notary)"
              };
              addCompanyDocument(docRecord);
            });

            // Update status of the notary order and company order
            updateNotaryOrder("#" + orderId, { status: "Submitted" });
            updateCompanyOrder("#" + orderId, { status: "Under Review" });

            // Dispatch dynamic activity update
            addActivity({
              title: "Scanback Uploaded",
              description: `Notary uploaded ${uploadedFiles.length} file(s) for Order #${orderId}.`,
              time: "Just now"
            });

            toast.success("Documents successfully uploaded and submitted!");
            setUploadedFiles([]);
            navigate("/notary/dashboard");
          }}
        >
          Upload & Submit
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      <DocumentViewer 
        isOpen={!!viewingFile}
        onClose={() => setViewingFile(null)}
        fileName={viewingFile?.name || ""}
        fileUrl={viewingFile?.url || ""}
      />
      <FooterBand />
    </div>
  );
}
