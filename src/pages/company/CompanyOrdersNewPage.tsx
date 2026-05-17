import { useRef, useState } from "react";
import { CircleDot, FileText, ChevronLeft, Download, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Select, Surface, Textarea } from "@/components/common";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

export function CompanyOrdersNewPage() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    loanType: "",
    scanbacks: "No",
    preferredNotary: "No preference",
    specialInstructions: "",
    priority: "Normal Processing"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const appendFiles = (files: FileList | File[]) => {
    const acceptedFiles = Array.from(files).filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension === "pdf" || extension === "docx";
    });

    if (acceptedFiles.length === 0) return;

    setUploadedFiles((current) => [...current, ...acceptedFiles]);
  };

  const handleFilePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    appendFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (!event.dataTransfer.files?.length) return;
    appendFiles(event.dataTransfer.files);
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.clientName || !formData.address) {
      toast.error("Order Title, Client Name, and Property Address are required.");
      return;
    }

    const newOrder = {
       id: "#ORD-" + (Math.floor(Math.random() * 90000) + 10000),
       clientName: formData.clientName,
       propertyAddress: `${formData.address}${formData.city ? ", " + formData.city : ""}${formData.state ? ", " + formData.state : ""} ${formData.zip}`,
       status: "Received",
       notary: formData.preferredNotary === "No preference" ? "--" : formData.preferredNotary,
       date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    // Add order to global store
    useStore.getState().addCompanyOrder(newOrder as any);

    // Add uploaded files to global documents store
    uploadedFiles.forEach((file) => {
      const docRecord = {
        id: "DOC-" + (Math.floor(Math.random() * 90000) + 10000),
        name: file.name,
        orderId: newOrder.id.replace("#", ""),
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        status: "Submitted" as const,
        uploadedBy: "Alex Sterling"
      };
      useStore.getState().addCompanyDocument(docRecord);
    });

    // Push dynamic activity/notification entry
    useStore.getState().addActivity({
      title: "New Order Created",
      description: `Order ${newOrder.id} has been successfully created for ${formData.clientName}.`,
      time: "Just now"
    });

    toast.success("Order created successfully!");
    navigate("/company/orders");
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-300">
            Orders <span className="mx-1 text-ink-200">•</span> Create New Order
          </div>
          <div className="mt-4">
            <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
              Create New Order
            </h1>
            <p className="mt-1 text-[13px] text-ink-500">
              Fill in the details below to initiate a new title closing process.
            </p>
          </div>
        </div>
        <Link to="/company/orders">
          <Button
            variant="outline"
            className="h-[46px] rounded-[12px] border-[#dfe6f2] px-5 text-[14px] font-semibold text-ink-700 shadow-[0_10px_24px_rgba(20,48,112,0.04)] hover:border-brand-200 hover:bg-[#f8fbff]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
              <CircleDot className="h-4 w-4" />
            </div>
            <div className="text-[20px] font-extrabold text-ink-900">Order Information</div>
          </div>
          <div className="grid gap-5">
            <Input 
              label="ORDER TITLE *" 
              placeholder="e.g. 452 Oak Street Refinance" 
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Input 
                label="CLIENT NAME *" 
                placeholder="Full legal name" 
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
              <Input 
                label="PROPERTY ADDRESS *" 
                placeholder="Street address" 
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <Input 
                label="CITY" 
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
              <Select 
                label="STATE" 
                options={["Select State", "TX", "CA", "NY"]} 
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white" 
              />
              <Input 
                label="ZIP" 
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
            </div>
            <Input 
              label="SIGNING DATE & TIME" 
              placeholder="mm/dd/yyyy" 
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
            />
            <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
              <div>
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500">Loan Details</div>
                <Select 
                  label="LOAN TYPE" 
                  options={["Select a loan type", "Refinance", "Purchase", "HELOC"]} 
                  value={formData.loanType}
                  onChange={(e) => handleInputChange("loanType", e.target.value)}
                  className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-[#f7faff]" 
                />
              </div>
              <div>
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500">Requirements</div>
                <div className="rounded-[16px] border border-[#e4ebf5] bg-white px-5 py-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500">SCAN BACKS REQUIRED</div>
                  <div className="mt-4 flex gap-6 text-[14px] text-ink-700">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="scanbacks" 
                        checked={formData.scanbacks === "Yes"}
                        onChange={() => handleInputChange("scanbacks", "Yes")}
                      />
                      Yes, required
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="scanbacks" 
                        checked={formData.scanbacks === "No"}
                        onChange={() => handleInputChange("scanbacks", "No")}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Surface>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-[20px] font-extrabold text-ink-900">Instructions</div>
            </div>
            <div className="grid gap-5">
              <Select 
                label="PREFERRED NOTARY (OPTIONAL)" 
                options={["No preference", "David Miller", "Robert Vance", "Elena Wright", "Gordon Cole"]} 
                value={formData.preferredNotary}
                onChange={(e) => handleInputChange("preferredNotary", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white" 
              />
              <div className="-mt-2 text-[11px] text-ink-400">
                Leave empty to auto-assign the best available notary in the area.
              </div>
              <Textarea
                label="SPECIAL INSTRUCTIONS"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                placeholder="Enter any specific requirements, gate codes, or client preferences..."
                className="min-h-[120px] rounded-[12px] border-[#dfe6f2] bg-white px-4 py-3 text-[14px]"
              />
            </div>
          </Surface>

          <div className="rounded-[18px] bg-brand-600 p-6 text-white shadow-[0_18px_38px_rgba(24,90,188,0.18)]">
            <div className="text-[20px] font-extrabold">Order Priority</div>
            <div className="mt-6 space-y-5 text-[14px]">
              <label className="flex items-start gap-3">
                <input 
                  type="radio" 
                  name="priority" 
                  className="mt-1" 
                  checked={formData.priority === "Normal Processing"}
                  onChange={() => handleInputChange("priority", "Normal Processing")}
                />
                <span>
                  <span className="font-semibold">Normal Processing</span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input 
                  type="radio" 
                  name="priority" 
                  className="mt-1" 
                  checked={formData.priority === "Urgent Request"}
                  onChange={() => handleInputChange("priority", "Urgent Request")}
                />
                <span>
                  <span className="font-semibold">Urgent Request</span>
                  <br />
                  <span className="text-white/72">Guaranteed 4-hour assignment</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
              <FileText className="h-4 w-4" />
            </div>
            <div className="text-[20px] font-extrabold text-ink-900">Supporting Documents</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFilePicker}
          />
          <div
            className={`rounded-[16px] border border-dashed px-6 py-10 text-center transition-colors ${
              isDragActive
                ? "border-brand-300 bg-[#f5f9ff]"
                : "border-[#dfe6f2] bg-[#fcfdff]"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef4ff] text-brand-600">
              <Download className="h-5 w-5 rotate-180" />
            </div>
            <div className="mt-5 text-[14px] font-semibold text-ink-900">Drag & drop files here</div>
            <div className="mt-1 text-[12px] leading-[1.7] text-ink-400">Accepts PDF, DOCX up to 25MB</div>
            <Button
              type="button"
              variant="outline"
              className="mt-5 h-[38px] rounded-[10px] px-4 text-[12px] font-bold"
              onClick={() => fileInputRef.current?.click()}
            >
              Or Browse Files
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {uploadedFiles.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-[#edf1f7] px-4 py-4 text-[13px] text-ink-400">
                No files uploaded yet.
              </div>
            ) : null}
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-[14px] bg-[#fff7f6] px-4 py-4 text-sm">
                <div>
                  <span className="font-semibold text-ink-900">{file.name}</span>
                  <br />
                  <span className="text-ink-400">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB • Uploaded just now
                  </span>
                </div>
                <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                  <Trash2 className="h-4 w-4 text-danger-600" />
                </button>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-[10px] border border-[#f3d7d7] bg-white px-5 py-2.5 text-[14px] font-semibold text-danger-600 hover:bg-[#fff6f6]">
          Cancel
        </Button>
        <Button
          className="h-[44px] rounded-[10px] px-6 text-[14px] font-semibold"
          onClick={handleSubmit}
        >
          Submit Order
        </Button>
      </div>
    </div>
  );
}
