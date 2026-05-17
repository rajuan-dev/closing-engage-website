import { useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CloudUpload, Download, Eye, MapPin, Printer, Trash2, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, FooterBand, Input, Modal, Surface, Textarea } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

export function NotaryOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { notaryOrders, notaryAssignedOrders } = useStore();

  const allOrders = [...notaryOrders, ...notaryAssignedOrders];
  const order = allOrders.find(o => o.id.replace("#", "") === id) || allOrders[0];

  const [orderStatus, setOrderStatus] = useState(order.status);
  const [printedConfirmed, setPrintedConfirmed] = useState(false);
  const [scanbacksConfirmed, setScanbacksConfirmed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(order.date);
  const [scheduledTime, setScheduledTime] = useState(order.time || "14:00");
  const [notaryNotes, setNotaryNotes] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (viewingFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [viewingFile]);

  const appendFiles = (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => file.name.toLowerCase().endsWith(".pdf"));
    if (accepted.length === 0) return;
    setUploadedFiles((current) => [...current, ...accepted]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files?.length) appendFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-7">
      <Link to="/notary/orders" className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-600">
        <ChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-[26px] font-bold tracking-tight text-ink-900">Order ID {order.id}</h1>
          <Badge status={orderStatus as any} />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="w-[180px] h-[44px] justify-center rounded-[12px] border-brand-300 text-brand-600 bg-brand-50/50 hover:bg-brand-50 px-0 text-[14px] font-semibold"
            onClick={() => setShowScheduleModal(true)}
          >
            <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-brand-500" />
            Schedule Closing
          </Button>
          <Button
            variant="outline"
            className="w-[180px] h-[44px] justify-center rounded-[12px] border-amber-200 text-amber-600 bg-amber-50/30 hover:bg-amber-50 px-0 text-[14px] font-semibold"
            onClick={() => {
              setOrderStatus("In Progress");
              toast.success("Order is now In Progress");
            }}
          >
            Mark as In Progress
          </Button>
          <Button
            className="w-[180px] h-[44px] justify-center rounded-[12px] bg-emerald-600 text-white shadow-[0_8px_18px_rgba(16,185,129,0.22)] hover:bg-emerald-700 transition px-0 text-[14px] font-semibold"
            onClick={() => {
              setOrderStatus("Completed");
              toast.success("Order marked as Completed");
            }}
          >
            Mark as Completed
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Closing"
        subtitle="Select the preferred date and time for this closing appointment"
        maxWidth="520px"
      >
        <div className="space-y-6 px-7 pb-8">
          <div className="grid gap-5">
            <Input
              label="Select Date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="bg-[#f7f9fd]"
            />
            <Input
              label="Select Time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="bg-[#f7f9fd]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.info(`Closing scheduled for ${scheduledDate} at ${scheduledTime}`);
                setShowScheduleModal(false);
              }}
              className="flex-1"
            >
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>

      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f4f8ff] p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="text-[14px] font-extrabold uppercase tracking-[0.16em] text-ink-500">Order Lifecycle</div>
        <div className="mt-8 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-brand-600 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="mt-4 text-[16px] font-semibold text-ink-900">Docs Ready to Print</div>
            <div className="mt-2 text-[13px] font-semibold text-brand-600">Completed</div>
          </div>
          <div>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] border-2 border-brand-600 bg-white text-brand-600">
              <Printer className="h-5 w-5" />
            </div>
            <div className="mt-4 text-[16px] font-semibold text-ink-900">Docs Printed by Notary</div>
            <button
              type="button"
              onClick={() => setPrintedConfirmed((current) => !current)}
              className={`mt-4 rounded-full px-5 py-2 text-[13px] font-semibold ${
                printedConfirmed
                  ? "bg-brand-600 text-white"
                  : "border border-brand-600 bg-white text-brand-600"
              }`}
            >
              {printedConfirmed ? "Confirmed" : "Confirm"}
            </button>
          </div>
          <div>
            <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] ${scanbacksConfirmed ? "bg-brand-600 text-white" : uploadedFiles.length > 0 ? "border-2 border-brand-600 bg-white text-brand-600" : "border-2 border-[#d8dee9] bg-white text-ink-300"}`}>
              {scanbacksConfirmed ? <CheckCircle2 className="h-5 w-5" /> : <CloudUpload className="h-5 w-5" />}
            </div>
            <div className={`mt-4 text-[16px] font-semibold ${uploadedFiles.length > 0 ? "text-ink-700" : "text-ink-400"}`}>Scanbacks Uploaded</div>
            <button
              type="button"
              disabled={uploadedFiles.length === 0}
              onClick={() => setScanbacksConfirmed(prev => !prev)}
              className={`mt-4 rounded-full px-5 py-2 text-[13px] font-semibold transition-all ${
                scanbacksConfirmed
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-100"
                  : uploadedFiles.length > 0
                    ? "border border-brand-600 bg-white text-brand-600 hover:bg-brand-50"
                    : "bg-[#eef2f7] text-ink-300 cursor-not-allowed"
              }`}
            >
              {scanbacksConfirmed ? "Confirmed" : "Confirm"}
            </button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.68fr]">
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-7 flex items-center justify-between">
              <div className="text-[18px] font-bold tracking-tight text-ink-900">Order Information</div>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Detail label="CLIENT" value={order.clientName} />
              <Detail label="SIGNING DATE & TIME" value={`${order.date}, ${order.time}`} />
              <div className="md:col-span-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">
                  PROPERTY ADDRESS
                </div>
                <div className="mt-3 flex items-center gap-2 text-[16px] font-semibold text-ink-900">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  {order.location}
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Special Instructions</div>
            <div className="mt-4 text-[14px] italic leading-[1.75] text-ink-500">
              "Please ensure all signatures are in blue ink. Scan and upload the full package once completed."
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Provided Documents</div>
            <div className="mt-6 space-y-4">
              {[
                { name: "Closing_Instructions.pdf", size: "1.2 MB" },
                { name: "Signature_Package.pdf", size: "5.4 MB" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between rounded-[14px] bg-[#f7f9fd] px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600">
                      <FileText className="h-4 w-4 animate-none" />
                    </div>
                    <div>
                      <div className="font-semibold text-ink-900">{doc.name}</div>
                      <div className="text-sm text-ink-400">{doc.size}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 text-brand-600">
                    <Eye 
                      className="h-4 w-4 cursor-pointer hover:text-brand-700 transition-colors" 
                      onClick={() => setViewingFile({ name: doc.name, url: "#" })}
                    />
                    <Download className="h-4 w-4 cursor-pointer hover:text-brand-700 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-dashed border-[#d8e0ec] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[16px] font-extrabold uppercase tracking-[0.16em] text-ink-700">Upload Scanbacks</div>
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
              className={`mt-5 rounded-[16px] border border-dashed px-6 py-10 text-center transition-colors ${
                isDragActive ? "border-brand-300 bg-[#f5f9ff]" : "border-[#d8e0ec] bg-[#fcfdff]"
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
              <div className="mt-5 text-[18px] font-semibold text-ink-900">Drag and drop scanbacks here</div>
              <div className="mt-2 text-[14px] text-ink-400">Supports PDF up to 50MB</div>
              <Button
                type="button"
                variant="outline"
                className="mt-6 h-[40px] rounded-[10px] border-[#dfe6f2] px-5 text-[14px] font-semibold"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </div>
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="mt-5 flex items-center justify-between rounded-[14px] bg-[#f3f4f7] px-4 py-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">{file.name}</div>
                    <div className="text-ink-400">{(file.size / (1024 * 1024)).toFixed(1)} MB • Uploaded just now</div>
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
                  <button 
                    type="button" 
                    onClick={() => setUploadedFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-danger-600 shadow-sm hover:bg-danger-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </Surface>
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[16px] font-extrabold uppercase tracking-[0.16em] text-ink-700">Notary Notes</div>
            <Textarea
              className="mt-5 min-h-[160px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 py-3 text-[14px]"
              placeholder="Add any specific details about the signing here..."
              value={notaryNotes}
              onChange={(event) => setNotaryNotes(event.target.value)}
            />
          </Surface>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="w-full max-w-[520px]">
          <Button 
            className="h-[52px] w-full rounded-[12px] text-[18px] font-semibold"
            onClick={() => {
              if (uploadedFiles.length === 0) {
                toast.error("Please upload at least one document.");
                return;
              }
              toast.success("Documents successfully submitted!");
              setUploadedFiles([]);
            }}
          >
            Submit Documents
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">Required fields must be completed before submission</div>
        </div>
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
