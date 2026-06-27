import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, CircleDot, Clock3, Download, Eye, FileText, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AssignedNotaryAvatar } from "@/components/AssignedNotaryAvatar";
import { Badge, Button, Surface } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";
import { orderService, type OrderDetail } from "@/services/orderService";

export function CompanyOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { companyOrders, setCompanyOrders, updateCompanyOrder, companyDocuments, setCompanyDocuments } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  
  const order = orderDetail || companyOrders.find(o => o.id.replace("#", "") === id);
  const docs = order ? companyDocuments.filter(d => d.orderId === order.id.replace("#", "")) : [];
  const approvedScanbackDocuments = docs.filter(
    (document) =>
      (document.uploaderRole === "notary" || document.uploadedBy === "Notary") &&
      (document.status === "Approved" || document.status === "Verified")
  );
  const titleDocuments = docs.filter(
    (document) =>
      document.uploaderRole !== "notary" && document.uploadedBy !== "Notary"
  );

  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);
  const [isPreparingPreview, setIsPreparingPreview] = useState(false);
  const [isConfirmingMeeting, setIsConfirmingMeeting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [clientName, setClientName] = useState("");
  const [signingDate, setSigningDate] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [orders, documents, detail] = await Promise.all([
          orderService.getCompanyOrders(),
          orderService.getCompanyDocuments(),
          orderService.getCompanyOrder(id),
        ]);
        if (!isMounted) return;
        setCompanyOrders(orders);
        setCompanyDocuments(documents);
        setOrderDetail(detail);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load order details.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadOrder();

    return () => {
      isMounted = false;
    };
  }, [id, setCompanyDocuments, setCompanyOrders]);

  useEffect(() => {
    if (order) {
      setClientName(order.clientName);
      setSigningDate(order.time ? `${order.date}, ${order.time}` : order.date);
      setPropertyAddress(order.propertyAddress);
      setSpecialInstructions(orderDetail?.specialInstructions || "");
    }
  }, [order, orderDetail, isEditing]);

  const handlePreviewDocument = async (documentId: string, documentName: string) => {
    try {
      setIsPreparingPreview(true);
      const url = await orderService.getDocumentPreviewUrl(documentId);
      setViewingFile({ name: documentName, url });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to preview document.");
    } finally {
      setIsPreparingPreview(false);
    }
  };

  const handleDownloadDocument = async (documentId: string, documentName: string) => {
    try {
      const url = await orderService.getDocumentDownloadUrl(documentId);
      const link = document.createElement("a");
      link.href = url;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Started downloading: ${documentName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download document.");
    }
  };

  if (isLoading && !order) {
    return <div className="text-[14px] font-semibold text-ink-400">Loading order details...</div>;
  }

  if (!order) {
    return (
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 text-center text-[14px] font-semibold text-ink-500">
        Order not found.
      </Surface>
    );
  }

  const statuses = ["Received", "Assigned", "Under Review", "Approved", "Completed"];
  const currentIdx = statuses.indexOf(order.status);
  
  const orderTimeline = statuses.map((s, idx) => ({
    title: s,
    body: idx < currentIdx ? "Completed" : idx === currentIdx ? "Current Stage" : "Pending",
    active: idx <= currentIdx,
    current: idx === currentIdx
  }));

  const activityLog = orderDetail?.timeline ?? [];
  const meeting = orderDetail?.meeting ?? order.meeting ?? null;
  const meetingLabel = meeting ? `${meeting.date} at ${meeting.time}` : "Not scheduled yet";

  return (
    <>
      <div className="space-y-6">
        <div className="text-[12px] text-ink-400">
          <span>Orders</span>
          <span className="mx-2 text-ink-300">›</span>
          <span className="font-semibold text-brand-600">Order Details</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link to="/company/orders">
              <button
                className="mt-1 rounded-full border border-[#dfe6f2] bg-white p-2.5 text-brand-600 hover:bg-[#f8fbff] transition focus:outline-none shadow-[0_4px_12px_rgba(20,48,112,0.02)]"
                aria-label="Back to Orders"
              >
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
                  Order {order.id}
                </h1>
                <Badge status={order.status as any} />
              </div>
              <div className="mt-1 text-[13px] text-ink-500 font-medium">
                Order created on {order.date}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.52fr]">
          <div className="space-y-6">
            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="mb-7 flex items-center justify-between">
                <div className="text-[18px] font-bold tracking-tight text-ink-900">Order Information</div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Edit Info
                  </button>
                )}
              </div>
              {isEditing ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    void (async () => {
                      try {
                        const updatedOrder = await orderService.updateCompanyOrder(order.id, {
                          clientName,
                          date: signingDate,
                          propertyAddress,
                          specialInstructions,
                        });
                        updateCompanyOrder(order.id, updatedOrder);
                        setOrderDetail(updatedOrder);
                        setIsEditing(false);
                        toast.success("Order information updated successfully!");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Unable to update order.");
                      }
                    })();
                  }}
                  className="space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 mb-2">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="h-[48px] w-full rounded-[12px] border border-[#dfe6f2] px-4 text-[15px] text-ink-700 outline-none focus:border-brand-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 mb-2">
                        Signing Date & Time
                      </label>
                      <input
                        type="text"
                        value={signingDate}
                        onChange={(e) => setSigningDate(e.target.value)}
                        className="h-[48px] w-full rounded-[12px] border border-[#dfe6f2] px-4 text-[15px] text-ink-700 outline-none focus:border-brand-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 mb-2">
                        Property Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-brand-600" />
                        <input
                          type="text"
                          value={propertyAddress}
                          onChange={(e) => setPropertyAddress(e.target.value)}
                          className="h-[48px] w-full rounded-[12px] border border-[#dfe6f2] pl-11 pr-4 text-[15px] text-ink-700 outline-none focus:border-brand-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-600 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                        className="w-full rounded-[12px] border border-[#dfe6f2] p-4 text-[14px] text-ink-700 outline-none focus:border-brand-500 transition-colors bg-[#f5f8fe] italic"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3 border-t border-[#e5ebf5] pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-[42px] rounded-[10px]"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="h-[42px] rounded-[10px]"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-8 md:grid-cols-2">
                  <Detail label="CLIENT NAME" value={order.clientName} />
                  <Detail
                    label="SIGNING DATE & TIME"
                    value={order.time ? `${order.date}, ${order.time}` : order.date || "Not scheduled"}
                  />
                  <div className="md:col-span-2">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">
                      PROPERTY ADDRESS
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[16px] font-semibold text-ink-900">
                      <MapPin className="h-4 w-4 text-brand-600" />
                      {order.propertyAddress}
                    </div>
                  </div>
                  <div className="md:col-span-2 rounded-[14px] bg-[#f5f8fe] px-5 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-600">
                      Special Instructions
                    </div>
                    <div className="mt-3 text-[14px] italic leading-[1.75] text-ink-500">
                      {specialInstructions || "No special instructions provided."}
                    </div>
                  </div>
                </div>
              )}
            </Surface>

            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#edf9f2] text-[#229b58]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-[18px] font-bold tracking-tight text-ink-900">Approved Notary Scanbacks</div>
                </div>
                <div className="text-[13px] font-semibold text-[#229b58]">
                  {approvedScanbackDocuments.length} File{approvedScanbackDocuments.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
                {approvedScanbackDocuments.length > 0 ? approvedScanbackDocuments.map((document, index) => (
                  <div key={`${document.name}-${index}`} className="flex items-center gap-4 rounded-[14px] border border-[#d9efe1] bg-[#f7fcf9] px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#229b58]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-[15px] font-semibold text-ink-900">{document.name}</div>
                        <span className="rounded-full bg-[#dff5e7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1f8e4d]">
                          Approved
                        </span>
                      </div>
                      <div className="mt-1 text-[12px] text-ink-400">Uploaded {document.uploadDate} • {document.size}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => void handlePreviewDocument(document.id, document.name)}
                        disabled={isPreparingPreview}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-brand-600 hover:bg-brand-50 transition-colors"
                        aria-label={`Preview ${document.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => void handleDownloadDocument(document.id, document.name)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-brand-600 hover:bg-brand-50 transition-colors"
                        aria-label={`Download ${document.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 text-ink-400 text-sm">No approved scanbacks available yet</div>
                )}
              </div>
            </Surface>

            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-[18px] font-bold tracking-tight text-ink-900">Documents</div>
                </div>
                <div className="text-[13px] font-semibold text-brand-600">{titleDocuments.length} Files Total</div>
              </div>
              <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
                {titleDocuments.length > 0 ? titleDocuments.map((document, index) => (
                  <div key={`${document.name}-${index}`} className="flex items-center gap-4 rounded-[14px] bg-[#fbfbff] px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff1f1] text-danger-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-ink-900">{document.name}</div>
                      <div className="mt-1 text-[12px] text-ink-400">Uploaded {document.uploadDate} • {document.size}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => void handlePreviewDocument(document.id, document.name)}
                        disabled={isPreparingPreview}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-brand-600 hover:bg-brand-50 transition-colors"
                        aria-label={`Preview ${document.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => void handleDownloadDocument(document.id, document.name)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-brand-600 hover:bg-brand-50 transition-colors"
                        aria-label={`Download ${document.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 text-ink-400 text-sm">No title documents uploaded yet</div>
                )}
              </div>
            </Surface>

            <DocumentViewer 
              isOpen={!!viewingFile}
              onClose={() => setViewingFile(null)}
              fileName={viewingFile?.name || ""}
              fileUrl={viewingFile?.url || ""}
            />

            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                  <CircleDot className="h-4 w-4" />
                </div>
                <div className="text-[18px] font-bold tracking-tight text-ink-900">Activity Log</div>
              </div>
              <div className="max-h-[520px] space-y-7 overflow-y-auto pr-2">
                {activityLog.length === 0 ? (
                  <div className="text-center py-6 text-ink-400 text-sm">No activity has been recorded yet</div>
                ) : activityLog.map((item, index) => (
                  <div key={`${item.title}-${item.date}-${index}`} className="relative pl-8">
                    {index < activityLog.length - 1 ? (
                      <div className="absolute left-[7px] top-5 h-[calc(100%+18px)] w-px bg-[#dbe4f1]" />
                    ) : null}
                    <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[17px] font-bold text-ink-900">{item.title}</div>
                      </div>
                      <div className="shrink-0 text-[12px] font-semibold text-ink-400">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>

          <div className="space-y-6">
            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Closing Meeting</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${
                      meeting?.status === "confirmed"
                        ? "bg-[#edf9f2] text-[#229b58]"
                        : meeting
                          ? "bg-[#eef4ff] text-brand-600"
                          : "bg-[#f3f5f9] text-ink-300"
                    }`}>
                      {meeting?.status === "confirmed" ? <CheckCircle2 className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="text-[18px] font-bold tracking-tight text-ink-900">{meetingLabel}</div>
                      <div className="mt-1 text-[13px] text-ink-500">
                        {!meeting
                          ? "Waiting for the assigned notary to schedule the closing."
                          : meeting.status === "confirmed"
                            ? "Confirmed and ready for the assigned notary."
                            : "Review this proposed closing time and confirm it for the notary."}
                      </div>
                    </div>
                  </div>
                </div>
                {meeting ? (
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                    meeting.status === "confirmed"
                      ? "bg-[#e8f7ee] text-[#229b58]"
                      : "bg-[#eef4ff] text-brand-600"
                  }`}>
                    {meeting.status === "confirmed" ? "Confirmed" : "Awaiting Confirm"}
                  </span>
                ) : null}
              </div>

              {meeting ? (
                <div className="mt-5 grid gap-4 rounded-[14px] border border-[#ebf0f7] bg-white/80 px-4 py-4 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-300">Scheduled By</div>
                    <div className="mt-2 text-[14px] font-semibold capitalize text-ink-900">{meeting.scheduledByRole}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-300">Meeting Time</div>
                    <div className="mt-2 flex items-center gap-2 text-[14px] font-semibold text-ink-900">
                      <Clock3 className="h-4 w-4 text-brand-600" />
                      {meeting.date} at {meeting.time}
                    </div>
                  </div>
                </div>
              ) : null}

              {meeting?.status === "scheduled" ? (
                <Button
                  className="mt-5 h-[46px] w-full rounded-[12px] text-[14px] font-semibold"
                  disabled={isConfirmingMeeting}
                  onClick={() => {
                    void (async () => {
                      try {
                        setIsConfirmingMeeting(true);
                        const updatedOrder = await orderService.confirmOrderMeeting(order.id);
                        updateCompanyOrder(order.id, updatedOrder);
                        setOrderDetail(updatedOrder);
                        toast.success(`Closing confirmed for ${updatedOrder.meeting?.date} at ${updatedOrder.meeting?.time}`);
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Unable to confirm the scheduled meeting.");
                      } finally {
                        setIsConfirmingMeeting(false);
                      }
                    })();
                  }}
                >
                  {isConfirmingMeeting ? "Confirming..." : "Confirm Meeting"}
                </Button>
              ) : null}
            </Surface>

            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="text-[14px] font-semibold uppercase tracking-[0.08em] text-ink-400">Assigned Notary</div>
              <div className="mt-5 flex items-center gap-4">
                <AssignedNotaryAvatar
                  name={order.notary}
                  avatarUrl={order.notaryAvatarUrl}
                  className="h-14 w-14 rounded-[12px]"
                  initialsClassName="text-xl"
                />
                <div>
                  <div className="text-[22px] font-extrabold tracking-[-0.03em] text-ink-900">
                    {order.notary === "--" ? "Not Assigned" : order.notary}
                  </div>
                  <div className="mt-1 text-[13px] text-ink-500">
                    {order.notary === "--" ? "No notary has been assigned yet." : "Assigned through backend order data."}
                  </div>
                </div>
              </div>
            </Surface>

            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f6f6fd] p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="text-[18px] font-bold tracking-tight text-ink-900">Order Status</div>
              <div className="mt-7 space-y-6">
                {orderTimeline.map((item, index) => (
                  <div
                    key={item.title}
                    className="relative block w-full pl-10 text-left"
                  >
                    {index < orderTimeline.length - 1 ? (
                      <div className={`absolute left-[13px] top-7 h-[calc(100%+12px)] w-[2px] ${item.active ? "bg-brand-600" : "bg-[#d6dbe7]"}`} />
                    ) : null}
                    <div
                      className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                        item.current
                          ? "border-brand-600 bg-white"
                          : item.active
                            ? "border-brand-600 bg-brand-600"
                            : "border-[#cfd5e1] bg-white"
                      }`}
                    >
                      {item.current ? <div className="h-2.5 w-2.5 rounded-full bg-brand-600" /> : null}
                    </div>
                    <div className={`text-[16px] font-bold tracking-tight ${item.active ? "text-ink-900" : "text-ink-300"}`}>
                      {item.title}
                    </div>
                    <div className={`mt-1 text-[13px] ${item.current ? "font-semibold text-brand-600" : item.active ? "text-ink-500" : "text-ink-300"}`}>
                      {item.body}
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </>
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
