import { useEffect, useRef, useState } from "react";
import { CloudUpload, Eye, FileBadge2, Filter, Pencil, Plus, ShieldCheck, X } from "lucide-react";
import { Badge, Button, FooterBand, Input, Modal, Surface, Textarea } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

export function NotaryCredentialsPage() {
  const { notaryProfile, updateNotaryProfile, notaryCredentials, addNotaryCredential, addActivity } = useStore();
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);

  const convertToUSDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  const convertToISODate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("/")) return dateStr;
    const [month, day, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Modal controls
  const [isUpdateInfoModalOpen, setIsUpdateInfoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Update info form state
  const [updateForm, setUpdateForm] = useState({
    licenseNumber: notaryProfile.licenseNumber,
    commissionExpiry: convertToUSDate(notaryProfile.commissionExpiry),
    eoCoverage: notaryProfile.eoCoverage,
    backgroundScreeningStatus: notaryProfile.backgroundScreeningStatus,
    backgroundScreeningDetail: notaryProfile.backgroundScreeningDetail,
  });

  // Sync update form when profile changes
  useEffect(() => {
    setUpdateForm({
      licenseNumber: notaryProfile.licenseNumber,
      commissionExpiry: convertToUSDate(notaryProfile.commissionExpiry),
      eoCoverage: notaryProfile.eoCoverage,
      backgroundScreeningStatus: notaryProfile.backgroundScreeningStatus,
      backgroundScreeningDetail: notaryProfile.backgroundScreeningDetail,
    });
  }, [notaryProfile, isUpdateInfoModalOpen]);

  // Upload new credential form state
  const [uploadForm, setUploadForm] = useState({
    documentName: "",
    issuer: "",
    action: "Auto-Verified" as "Auto-Verified" | "Manual Review",
  });
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSaveUpdate = () => {
    updateNotaryProfile({
      licenseNumber: updateForm.licenseNumber,
      commissionExpiry: convertToISODate(updateForm.commissionExpiry),
      eoCoverage: updateForm.eoCoverage,
      backgroundScreeningStatus: updateForm.backgroundScreeningStatus,
      backgroundScreeningDetail: updateForm.backgroundScreeningDetail,
    });

    addActivity({
      title: "Credentials Updated",
      description: `You successfully updated your primary commission info.`,
      time: "Just Now",
    });

    toast.success("Primary commission details saved successfully!");
    setIsUpdateInfoModalOpen(false);
  };

  const handleSaveUpload = () => {
    if (!uploadForm.documentName || !uploadForm.issuer) {
      toast.error("Please fill in the document name and issuer.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    addNotaryCredential({
      documentName: uploadForm.documentName,
      issuer: uploadForm.issuer,
      uploadDate: todayStr,
      action: uploadForm.action,
    });

    addActivity({
      title: "Credential Uploaded",
      description: `New credential "${uploadForm.documentName}" added to history.`,
      time: "Just Now",
    });

    toast.success(`Credential "${uploadForm.documentName}" successfully added to history ledger!`);
    setIsUploadModalOpen(false);
    
    // Reset form
    setUploadForm({
      documentName: "",
      issuer: "",
      action: "Auto-Verified",
    });
    setSelectedFileName("");
  };

  const formatExpiryDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredCredentialHistory = notaryCredentials.filter((row) =>
    showOnlyVerified ? row.action === "Auto-Verified" : true,
  );

  const getScreeningBgColor = (status: "Pending" | "Verified" | "Failed") => {
    if (status === "Verified") return "bg-[#f3faf7] border-[#d1ebd7]";
    if (status === "Failed") return "bg-[#fff7f7] border-[#ecd1d1]";
    return "bg-[#f5f7fb] border-[#e4ebf5]";
  };

  const getScreeningIcon = (status: "Pending" | "Verified" | "Failed") => {
    if (status === "Verified") return <ShieldCheck className="h-5 w-5 text-success-600" />;
    if (status === "Failed") return <X className="h-5 w-5 text-danger-600" />;
    return <FileBadge2 className="h-5 w-5 text-[#b65d18]" />;
  };

  const getScreeningIconBg = (status: "Pending" | "Verified" | "Failed") => {
    if (status === "Verified") return "bg-[#e3fcf0]";
    if (status === "Failed") return "bg-[#ffebee]";
    return "bg-[#fff4eb]";
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
            Notary Credentials
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            View your license and verification details
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="h-[48px] rounded-[14px] border-[#dfe6f2] px-5 text-[15px] font-semibold text-ink-700"
            onClick={() => setIsUpdateInfoModalOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Update information
          </Button>
          <Button 
            className="h-[48px] rounded-[14px] px-5 text-[15px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload new credential
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.52fr]">
        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eaf0ff] text-brand-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="text-[18px] font-bold tracking-tight text-ink-900">Primary Commission</div>
                <div className="mt-1 text-[13px] text-ink-500">California Secretary of State</div>
              </div>
            </div>
            <Badge status="Verified" />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Detail label="LICENSE NUMBER" value={notaryProfile.licenseNumber} />
            <Detail label="COMMISSION EXPIRY" value={formatExpiryDate(notaryProfile.commissionExpiry)} />
            <Detail label="E&O COVERAGE" value={notaryProfile.eoCoverage} />
          </div>
        </Surface>

        <Surface className={`rounded-[18px] border p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)] transition-colors duration-300 ${getScreeningBgColor(notaryProfile.backgroundScreeningStatus)}`}>
          <div className="mb-5 flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${getScreeningIconBg(notaryProfile.backgroundScreeningStatus)}`}>
              {getScreeningIcon(notaryProfile.backgroundScreeningStatus)}
            </div>
            <Badge status={notaryProfile.backgroundScreeningStatus} />
          </div>
          <div className="text-[18px] font-bold tracking-tight text-ink-900">Background Screening</div>
          <div className="mt-2 text-[13px] text-ink-500 whitespace-pre-line">
            {notaryProfile.backgroundScreeningDetail}
          </div>
        </Surface>
      </div>

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-[17px] font-bold tracking-tight text-ink-900">Credential History</div>
          <button
            type="button"
            onClick={() => setShowOnlyVerified((current) => !current)}
            className="inline-flex items-center gap-2 text-[16px] font-medium text-ink-600"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-[#fbfcff] text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                {["Document Name", "Issuer", "Upload Date", "Verification", "Action"].map((header) => (
                  <th key={header} className="px-6 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCredentialHistory.map((row) => (
                <tr key={row.documentName} className="border-t border-[#edf1f7]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                        {row.action === "Auto-Verified" ? <ShieldCheck className="h-4 w-4" /> : <FileBadge2 className="h-4 w-4 text-brand-600 animate-none" />}
                      </div>
                      <span className="text-[16px] font-semibold text-ink-900">{row.documentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[15px] text-ink-600">{row.issuer}</td>
                  <td className="px-6 py-5 text-[15px] text-ink-600">{row.uploadDate}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[15px] text-ink-700">
                      <span className={`h-2 w-2 rounded-full ${row.action === "Auto-Verified" ? "bg-brand-600" : "bg-[#b96716]"}`} />
                      {row.action === "Auto-Verified" ? "Auto-Verified" : "Manual Review"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      type="button"
                      onClick={() => setViewingFile({ name: row.documentName, url: "#" })}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-6 text-center text-[20px] font-extrabold uppercase tracking-[0.12em] text-brand-600 cursor-pointer hover:bg-slate-50 transition-colors">
          Load More Ledger Entries
        </div>
      </Surface>

      {/* Update Info Modal */}
      <Modal
        isOpen={isUpdateInfoModalOpen}
        onClose={() => setIsUpdateInfoModalOpen(false)}
        title="Update Primary Credentials"
        maxWidth="520px"
      >
        <div className="space-y-5 px-7 pb-7">
          <Input
            label="LICENSE NUMBER"
            value={updateForm.licenseNumber}
            onChange={(e) => setUpdateForm({ ...updateForm, licenseNumber: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <Input
            label="COMMISSION EXPIRY"
            type="text"
            placeholder="MM/DD/YYYY"
            value={updateForm.commissionExpiry}
            onChange={(e) => setUpdateForm({ ...updateForm, commissionExpiry: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <Input
            label="E&O COVERAGE"
            value={updateForm.eoCoverage}
            onChange={(e) => setUpdateForm({ ...updateForm, eoCoverage: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-500">
              BACKGROUND SCREENING STATUS
            </label>
            <select
              value={updateForm.backgroundScreeningStatus}
              onChange={(e) => setUpdateForm({ ...updateForm, backgroundScreeningStatus: e.target.value as any })}
              className="h-[48px] w-full rounded-[12px] border border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[14px] text-ink-700 outline-none animate-none"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <Textarea
            label="BACKGROUND SCREENING DETAIL"
            value={updateForm.backgroundScreeningDetail}
            onChange={(e) => setUpdateForm({ ...updateForm, backgroundScreeningDetail: e.target.value })}
            className="rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] p-4 text-[14px]"
            rows={3}
          />
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsUpdateInfoModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUpdate}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Credential Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload New Credential Document"
        maxWidth="520px"
      >
        <div className="space-y-5 px-7 pb-7">
          <Input
            label="DOCUMENT NAME"
            placeholder="e.g. E&O Policy, NNA Background Check"
            value={uploadForm.documentName}
            onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <Input
            label="ISSUER"
            placeholder="e.g. National Notary Association"
            value={uploadForm.issuer}
            onChange={(e) => setUploadForm({ ...uploadForm, issuer: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-500">
              VERIFICATION METHOD
            </label>
            <select
              value={uploadForm.action}
              onChange={(e) => setUploadForm({ ...uploadForm, action: e.target.value as any })}
              className="h-[48px] w-full rounded-[12px] border border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[14px] text-ink-700 outline-none animate-none"
            >
              <option value="Auto-Verified">Auto-Verified</option>
              <option value="Manual Review">Manual Review</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-500">
              CREDENTIAL FILE
            </label>
            <div 
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-[#ccd9f8] bg-[#f8faff] p-7 text-center cursor-pointer hover:bg-[#f0f4ff] transition-colors"
            >
              <CloudUpload className="h-10 w-10 text-brand-500 mb-3" />
              <div className="text-[15px] font-bold text-ink-900">
                {selectedFileName || "Choose document file or drag here"}
              </div>
              <div className="text-[13px] text-ink-500 mt-1">PDF, JPG, PNG up to 10MB</div>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFileName(file.name);
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUpload}>
              Add to Ledger
            </Button>
          </div>
        </div>
      </Modal>

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
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">{label}</div>
      <div className="mt-2 text-[16px] font-semibold text-ink-900">{value}</div>
    </div>
  );
}
