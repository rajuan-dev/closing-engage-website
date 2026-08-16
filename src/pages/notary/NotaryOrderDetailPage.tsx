import { useEffect, useRef, useState, type ReactNode } from "react";
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, CloudUpload, Download, Eye, MapPin, Printer, Trash2, FileText, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, FooterBand, Modal, Surface, Textarea } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { OrderAdminChatPopup } from "@/components/OrderAdminChatPopup";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import { orderService, type DocumentDetail, type OrderDetail } from "@/services/orderService";

export function NotaryOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { notaryOrders, notaryAssignedOrders, setNotaryOrders, setNotaryAssignedOrders, updateNotaryOrder } = useStore();
  const { confirm } = useConfirmStore();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [documents, setDocuments] = useState<DocumentDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resubmittingDocumentId, setResubmittingDocumentId] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAcceptingOpenOrder, setIsAcceptingOpenOrder] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isRespondingToSchedule, setIsRespondingToSchedule] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const allOrders = [...notaryOrders, ...notaryAssignedOrders];
  const order = orderDetail || allOrders.find(o => o.id.replace("#", "") === id);
  const providedDocuments = documents.filter((document) =>
    ["company", "title-company", "admin"].includes(document.uploaderRole),
  );
  const submittedScanbacks = documents.filter((document) => document.uploaderRole === "notary");

  const [orderStatus, setOrderStatus] = useState(order?.status || "Assigned");
  const [printedConfirmed, setPrintedConfirmed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(order?.date || "");
  const [scheduledTime, setScheduledTime] = useState(order?.time || "14:00");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [notaryNotes, setNotaryNotes] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasApprovedScanback = submittedScanbacks.some(
    (document) => document.displayStatus === "Approved" || document.displayStatus === "Verified",
  );
  const hasRejectedScanback = submittedScanbacks.some((document) => document.displayStatus === "Rejected");
  const hasSubmittedScanback = submittedScanbacks.some((document) => document.displayStatus === "Submitted");
  const meeting = orderDetail?.meeting ?? order?.meeting ?? null;
  const isOpenOrder = Boolean(order?.openForAll || order?.notary === "Open for All");
  const wasCompanyRescheduleRejected = meeting?.rejectedByRole === "company";
  const canRespondToSchedule = !isOpenOrder && (meeting?.status === "scheduled" || wasCompanyRescheduleRejected);
  const hasPrintableDocuments = providedDocuments.length > 0;
  const canConfirmPrintedDocuments = !isOpenOrder && hasPrintableDocuments;

  const refreshOrderSnapshot = async (orderId: string) => {
    const [refreshedOrder, refreshedDocuments] = await Promise.all([
      orderService.getOrderDetail(orderId),
      orderService.getDocumentDetails(),
    ]);

    updateNotaryOrder(orderId, refreshedOrder);
    setOrderDetail(refreshedOrder);
    setOrderStatus(refreshedOrder.status);
    setNotaryNotes(refreshedOrder.notaryNotes);
    setDocuments(refreshedDocuments.filter((document) => document.orderNumber === refreshedOrder.id));
  };

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const orders = await orderService.getAssignedOrders();
        if (!isMounted) return;
        setNotaryOrders(orders);
        setNotaryAssignedOrders(orders);
        const selectedOrder = orders.find((item) => item.id.replace("#", "") === id);
        const targetOrderId = selectedOrder?.id || `#${id}`;
        const [detail, refreshedDocuments] = await Promise.all([
          orderService.getOrderDetail(targetOrderId),
          orderService.getDocumentDetails(),
        ]);
        if (!isMounted) return;
        setOrderDetail(detail);
        setNotaryNotes(detail.notaryNotes);
        setDocuments(refreshedDocuments.filter((document) => document.orderNumber === detail.id));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load order details.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, [id, setNotaryAssignedOrders, setNotaryOrders]);

  useEffect(() => {
    if (!order?.id) return;

    let isActive = true;

    const syncOrderState = async () => {
      try {
        const [refreshedOrder, refreshedDocuments] = await Promise.all([
          orderService.getOrderDetail(order.id),
          orderService.getDocumentDetails(),
        ]);
        if (!isActive) return;
        updateNotaryOrder(order.id, refreshedOrder);
        setOrderDetail(refreshedOrder);
        setOrderStatus(refreshedOrder.status);
        setNotaryNotes(refreshedOrder.notaryNotes);
        setDocuments(refreshedDocuments.filter((document) => document.orderNumber === refreshedOrder.id));
      } catch {
        // Keep background refresh silent to avoid noisy toasts during normal usage.
      }
    };

    const intervalId = window.setInterval(() => {
      void syncOrderState();
    }, 15000);

    const handleFocus = () => {
      void syncOrderState();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [order?.id, updateNotaryOrder]);

  useEffect(() => {
    if (!order) return;
    setOrderStatus(order.status);
    setScheduledDate(order.date);
    setScheduledTime(toDisplayTime(order.time || "14:00"));
    setPrintedConfirmed(Boolean(orderDetail?.notaryPrintedConfirmed));
    const parsedDate = parseScheduleDate(order.date);
    if (parsedDate) setCalendarMonth(parsedDate);
  }, [order, orderDetail?.notaryPrintedConfirmed]);

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

  const updateStatus = async (status: typeof orderStatus) => {
    if (!order) return;
    try {
      setIsUpdatingStatus(true);
      const updatedOrder = await orderService.updateNotaryOrderStatus(order.id, status);
      updateNotaryOrder(order.id, updatedOrder);
      setOrderDetail((current) => (current ? { ...current, ...updatedOrder } : { ...updatedOrder, specialInstructions: "", notaryNotes: "" }));
      setOrderStatus(updatedOrder.status);
      toast.success(`Order is now ${updatedOrder.status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update order status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const acceptOpenOrder = async () => {
    if (!order) return;

    try {
      setIsAcceptingOpenOrder(true);
      const acceptedOrder = await orderService.acceptOpenOrder(order.id);
      updateNotaryOrder(order.id, acceptedOrder);
      setNotaryOrders([acceptedOrder, ...notaryOrders.filter((item) => item.id !== acceptedOrder.id)]);
      setNotaryAssignedOrders([acceptedOrder, ...notaryAssignedOrders.filter((item) => item.id !== acceptedOrder.id)]);
      setOrderDetail((current) => (current ? { ...current, ...acceptedOrder } : { ...acceptedOrder, specialInstructions: "", notaryNotes: "" }));
      setOrderStatus(acceptedOrder.status);
      toast.success(`You accepted ${acceptedOrder.id}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to accept open order.");
    } finally {
      setIsAcceptingOpenOrder(false);
    }
  };

  const parseScheduleDate = (value?: string) => {
    if (!value || value === "TBD") return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatScheduleDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const toDisplayTime = (value?: string) => {
    if (!value || value === "TBD") return "";
    if (/[AP]M/i.test(value)) return value;

    const match = value.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return value;

    const hours24 = Number(match[1]);
    const minutes = match[2];
    const suffix = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${suffix}`;
  };

  const toTimeInputValue = (value?: string) => {
    if (!value || value === "TBD") return "";
    const normalized = value.trim().toUpperCase();

    if (!/[AP]M/.test(normalized)) {
      return /^\d{1,2}:\d{2}$/.test(value) ? value : "";
    }

    const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (!match) return "";

    let hours = Number(match[1]);
    const minutes = match[2];
    const suffix = match[3];

    if (suffix === "AM") {
      if (hours === 12) hours = 0;
    } else if (hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  const selectedScheduleDate = parseScheduleDate(scheduledDate);
  const selectedScheduleDateKey = selectedScheduleDate?.toDateString() || "";
  const calendarYear = calendarMonth.getFullYear();
  const calendarMonthIndex = calendarMonth.getMonth();
  const calendarStartDay = new Date(calendarYear, calendarMonthIndex, 1).getDay();
  const calendarDaysInMonth = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
  const todayKey = new Date().toDateString();
  const timeOptions = ["8:00 AM", "9:30 AM", "11:00 AM", "12:30 PM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"];

  const changeCalendarMonth = (offset: number) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const selectScheduleDay = (day: number) => {
    setScheduledDate(formatScheduleDate(new Date(calendarYear, calendarMonthIndex, day)));
  };

  const confirmSchedule = async () => {
    if (!order) return;
    if (!scheduledDate || !scheduledTime || scheduledTime === "TBD") {
      toast.error("Please select both closing date and time.");
      return;
    }

    try {
      setIsScheduling(true);
      const updatedOrder = await orderService.scheduleOrder(order.id, scheduledDate, scheduledTime);
      updateNotaryOrder(order.id, updatedOrder);
      setOrderDetail((current) => (current ? { ...current, ...updatedOrder } : updatedOrder));
      setScheduledDate(updatedOrder.date);
      setScheduledTime(toDisplayTime(updatedOrder.time || scheduledTime));
      setShowScheduleModal(false);
      toast.success(`Closing scheduled for ${updatedOrder.date} at ${updatedOrder.time || scheduledTime}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to schedule closing.");
    } finally {
      setIsScheduling(false);
    }
  };

  const submitRescheduleRequest = async () => {
    if (!order) return;
    if (!rescheduleNote.trim()) {
      toast.error("Please add a short note for the title company.");
      return;
    }
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please select your preferred date and time.");
      return;
    }

    try {
      setIsRespondingToSchedule(true);
      const updatedOrder = await orderService.rejectOrderMeeting(order.id, {
        note: rescheduleNote.trim(),
        preferredDate: rescheduleDate,
        preferredTime: rescheduleTime,
      });
      updateNotaryOrder(order.id, updatedOrder);
      setOrderDetail(updatedOrder);
      setShowRescheduleModal(false);
      setRescheduleNote("");
      setRescheduleDate("");
      setRescheduleTime("");
      toast.success("Reschedule request sent to the title company.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send reschedule request.");
    } finally {
      setIsRespondingToSchedule(false);
    }
  };

  const confirmPrintedDocuments = async () => {
    if (!order || printedConfirmed) return;

    try {
      setIsUpdatingStatus(true);
      const updatedOrder = await orderService.confirmPrintedByNotary(order.id);
      updateNotaryOrder(order.id, updatedOrder);
      setOrderDetail(updatedOrder);
      setPrintedConfirmed(true);
      toast.success("Printed documents confirmed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to confirm printed documents.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const previewDocument = async (document: DocumentDetail) => {
    try {
      const url = await orderService.getDocumentPreviewUrl(document.id);
      setViewingFile({ name: document.fileName, url });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to preview document.");
    }
  };

  const downloadDocument = async (document: DocumentDetail) => {
    try {
      const url = await orderService.getDocumentDownloadUrl(document.id);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download document.");
    }
  };

  const submitScanbacks = async () => {
    if (!order) return;
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one document.");
      return;
    }

    try {
      setIsSubmitting(true);
      await orderService.uploadNotaryDocuments(order, uploadedFiles);
      await refreshOrderSnapshot(order.id);
      setUploadedFiles([]);
      toast.success("Documents successfully submitted!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit scanbacks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveNotaryNotes = async () => {
    if (!order) return;

    try {
      setIsSavingNotes(true);
      const updatedOrder = await orderService.updateNotaryNotes(order.id, notaryNotes.trim());
      updateNotaryOrder(order.id, updatedOrder);
      setOrderDetail(updatedOrder);
      setNotaryNotes(updatedOrder.notaryNotes);
      toast.success("Notary notes saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save notary notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const resubmitScanback = async (document: DocumentDetail) => {
    if (!order) return;

    try {
      setResubmittingDocumentId(document.id);
      await orderService.resubmitDocument(document.id);
      await refreshOrderSnapshot(order.id);
      toast.success("Scanback resubmitted for admin review.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to resubmit scanback.");
    } finally {
      setResubmittingDocumentId(null);
    }
  };

  const deleteScanback = (document: DocumentDetail) => {
    if (!order) return;

    confirm({
      title: "Delete Scanback?",
      message: `Are you sure you want to delete "${document.fileName}"? This action cannot be undone.`,
      confirmLabel: "Delete Scanback",
      type: "danger",
      onConfirm: async () => {
        try {
          setDeletingDocumentId(document.id);
          await orderService.deleteDocument(document.id);
          await refreshOrderSnapshot(order.id);
          toast.success("Scanback deleted.");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Unable to delete scanback.");
        } finally {
          setDeletingDocumentId(null);
        }
      },
    });
  };

  if (isLoading && !order) {
    return <div className="text-[14px] font-semibold text-ink-400">Loading order details...</div>;
  }

  if (!order) {
    return (
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 text-center text-[14px] font-semibold text-ink-500">
        Assigned order not found.
      </Surface>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-[12px] text-ink-400">
        <span>Orders</span>
        <span className="mx-2 text-ink-300">›</span>
        <span className="font-semibold text-brand-600">Order Details</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/notary/orders">
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
                Order ID {order.id}
              </h1>
              <Badge status={orderStatus as any} />
            </div>
            <div className="mt-1 text-[13px] text-ink-500 font-medium">
              Order created on {order.date}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          {isOpenOrder ? (
            <Button
              disabled={isAcceptingOpenOrder}
              className="min-w-[220px] h-[44px] justify-center rounded-[12px] bg-brand-600 px-5 text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(24,90,188,0.22)] hover:bg-brand-700"
              onClick={() => {
                void acceptOpenOrder();
              }}
            >
              {isAcceptingOpenOrder ? "Accepting..." : "Accept Open Order"}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                disabled={isUpdatingStatus || orderStatus === "In Progress"}
                className={`w-[180px] h-[44px] justify-center rounded-[12px] border-amber-200 px-0 text-[14px] font-semibold ${
                  orderStatus === "In Progress"
                    ? "bg-amber-500 text-white shadow-[0_8px_18px_rgba(245,158,11,0.22)]"
                    : "text-amber-600 bg-amber-50/30 hover:bg-amber-50"
                }`}
                onClick={() => {
                  void updateStatus("In Progress");
                }}
              >
                {orderStatus === "In Progress" ? "In Progress" : "Mark as In Progress"}
              </Button>
              <Button
                disabled={isUpdatingStatus || orderStatus === "Completed"}
                className={`w-[180px] h-[44px] justify-center rounded-[12px] px-0 text-[14px] font-semibold ${
                  orderStatus === "Completed"
                    ? "bg-emerald-700 text-white shadow-[0_8px_18px_rgba(16,185,129,0.22)]"
                    : "bg-emerald-600 text-white shadow-[0_8px_18px_rgba(16,185,129,0.22)] hover:bg-emerald-700"
                }`}
                onClick={() => {
                  void updateStatus("Completed");
                }}
              >
                {orderStatus === "Completed" ? "Completed" : "Mark as Completed"}
              </Button>
            </>
          )}
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
          <div className="rounded-[22px] border border-[#e3eaf5] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8ff_100%)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeCalendarMonth(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dce6f4] bg-white text-ink-500 transition hover:border-brand-200 hover:text-brand-600"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center">
                <div className="text-[18px] font-extrabold text-ink-900">
                  {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-300">
                  Select Closing Date
                </div>
              </div>
              <button
                type="button"
                onClick={() => changeCalendarMonth(1)}
                className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dce6f4] bg-white text-ink-500 transition hover:border-brand-200 hover:text-brand-600"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-300">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1.5">
              {Array.from({ length: calendarStartDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-10" />
              ))}
              {Array.from({ length: calendarDaysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(calendarYear, calendarMonthIndex, day);
                const dateKey = date.toDateString();
                const isSelected = dateKey === selectedScheduleDateKey;
                const isToday = dateKey === todayKey;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectScheduleDay(day)}
                    className={`flex h-10 items-center justify-center rounded-[12px] text-[13px] font-bold transition-all ${
                      isSelected
                        ? "bg-brand-600 text-white shadow-[0_10px_24px_rgba(24,90,188,0.22)]"
                        : isToday
                          ? "bg-[#eef4ff] text-brand-600"
                          : "text-ink-700 hover:bg-white hover:text-brand-600"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-500">Select Time</div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-bold text-brand-600">
                <Clock className="h-3.5 w-3.5" />
                {scheduledTime && scheduledTime !== "TBD" ? scheduledTime : "No time selected"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {timeOptions.map((time) => {
                const isSelected = scheduledTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setScheduledTime(time)}
                    className={`h-11 rounded-[12px] border text-[13px] font-bold transition-all ${
                      isSelected
                        ? "border-brand-600 bg-brand-600 text-white shadow-[0_10px_24px_rgba(24,90,188,0.18)]"
                        : "border-[#dfe6f2] bg-white text-ink-600 hover:border-brand-200 hover:bg-[#f7faff] hover:text-brand-600"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
                Or Enter Time Manually
              </label>
              <input
                type="time"
                value={toTimeInputValue(scheduledTime)}
                onChange={(event) => setScheduledTime(toDisplayTime(event.target.value))}
                className="h-11 w-full rounded-[12px] border border-[#dfe6f2] bg-white px-4 text-[14px] font-semibold text-ink-700 outline-none transition-colors focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <div className="rounded-[18px] border border-[#e4ebf5] bg-white p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-300">Selected Closing Slot</div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[15px] font-bold text-ink-900">
              <span>{scheduledDate || "Choose a date"}</span>
              <span className="text-ink-300">•</span>
              <span>{scheduledTime && scheduledTime !== "TBD" ? scheduledTime : "Choose a time"}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              disabled={isScheduling}
              onClick={() => void confirmSchedule()}
              className="flex-1"
            >
              {isScheduling ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRescheduleModal}
        onClose={() => {
          if (isRespondingToSchedule) return;
          setShowRescheduleModal(false);
        }}
        title="Request Reschedule"
        subtitle="Send the title company your preferred signing window and a clear availability note."
        maxWidth="560px"
      >
        <div className="space-y-5 px-7 pb-8">
          <div className="rounded-[18px] border border-[#e4ebf5] bg-[#f8fbff] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">Current Signing Date & Time</div>
            <div className="mt-2 text-[16px] font-extrabold text-ink-900">
              {order?.date || "Not scheduled"}{order?.time ? ` at ${order.time}` : ""}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
                Preferred Date
              </span>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(event) => setRescheduleDate(event.target.value)}
                className="h-12 w-full rounded-[12px] border border-[#dfe6f2] bg-white px-4 text-[14px] font-semibold text-ink-800 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
                Preferred Time
              </span>
              <input
                type="time"
                value={rescheduleTime}
                onChange={(event) => setRescheduleTime(event.target.value)}
                className="h-12 w-full rounded-[12px] border border-[#dfe6f2] bg-white px-4 text-[14px] font-semibold text-ink-800 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              />
            </label>
          </div>

          <Textarea
            label="Availability Note"
            value={rescheduleNote}
            onChange={(event) => setRescheduleNote(event.target.value)}
            placeholder="Example: I am unavailable at the requested time, but I can complete this signing at my preferred date and time."
            className="min-h-[132px] rounded-[14px] border-[#dfe6f2] bg-white text-[14px]"
          />

          <div className="flex flex-col-reverse gap-3 border-t border-[#e8edf5] pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isRespondingToSchedule}
              onClick={() => setShowRescheduleModal(false)}
              className="h-11 rounded-[12px] px-5"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isRespondingToSchedule}
              onClick={() => void submitRescheduleRequest()}
              className="h-11 rounded-[12px] px-5"
            >
              {isRespondingToSchedule ? "Sending..." : "Send Reschedule Request"}
            </Button>
          </div>
        </div>
      </Modal>

      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f4f8ff] p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="text-[14px] font-extrabold uppercase tracking-[0.16em] text-ink-500">Order Lifecycle</div>
        <div className="mt-8 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <div
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] ${
                hasPrintableDocuments
                  ? "bg-[#1f9d55] text-white"
                  : "border-2 border-[#d8dee9] bg-white text-ink-300"
              }`}
            >
              {hasPrintableDocuments ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div className={`mt-4 text-[16px] font-semibold ${hasPrintableDocuments ? "text-ink-900" : "text-ink-400"}`}>Docs Ready to Print</div>
            <button
              type="button"
              disabled
              className={`mt-4 rounded-full px-5 py-2 text-[13px] font-semibold ${
                hasPrintableDocuments
                  ? "bg-[#e8f7ee] text-[#1f9d55]"
                  : "bg-[#eef2f7] text-ink-300"
              }`}
            >
              {hasPrintableDocuments ? "Completed" : "Pending"}
            </button>
          </div>
          <div>
            <div
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] ${
                printedConfirmed
                  ? "bg-[#1f9d55] text-white"
                  : canConfirmPrintedDocuments
                    ? "border-2 border-brand-600 bg-white text-brand-600"
                    : "border-2 border-[#d8dee9] bg-white text-ink-300"
              }`}
            >
              <Printer className="h-5 w-5" />
            </div>
            <div className={`mt-4 text-[16px] font-semibold ${printedConfirmed || canConfirmPrintedDocuments ? "text-ink-900" : "text-ink-400"}`}>Docs Printed by Notary</div>
            <button
              type="button"
              onClick={() => void confirmPrintedDocuments()}
              disabled={printedConfirmed || isUpdatingStatus || !canConfirmPrintedDocuments}
              className={`mt-4 rounded-full px-5 py-2 text-[13px] font-semibold ${
                printedConfirmed
                  ? "bg-[#e8f7ee] text-[#1f9d55]"
                  : canConfirmPrintedDocuments
                    ? "border border-brand-600 bg-white text-brand-600"
                    : "bg-[#eef2f7] text-ink-300 cursor-not-allowed"
              }`}
            >
              {printedConfirmed ? "Confirmed" : isUpdatingStatus ? "Confirming..." : canConfirmPrintedDocuments ? "Confirm" : "Pending"}
            </button>
          </div>
          <div>
            <div
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] ${
                hasApprovedScanback
                  ? "bg-[#1f9d55] text-white"
                  : hasRejectedScanback
                    ? "bg-[#dc2626] text-white"
                    : hasSubmittedScanback
                      ? "bg-brand-600 text-white"
                      : uploadedFiles.length > 0
                        ? "border-2 border-brand-600 bg-white text-brand-600"
                        : "border-2 border-[#d8dee9] bg-white text-ink-300"
              }`}
            >
              {hasApprovedScanback ? <CheckCircle2 className="h-5 w-5" /> : <CloudUpload className="h-5 w-5" />}
            </div>
            <div
              className={`mt-4 text-[16px] font-semibold ${
                hasApprovedScanback || hasRejectedScanback || hasSubmittedScanback || uploadedFiles.length > 0
                  ? "text-ink-700"
                  : "text-ink-400"
              }`}
            >
              Scanbacks Uploaded
            </div>
            <button
              type="button"
              disabled
              className={`mt-4 rounded-full px-5 py-2 text-[13px] font-semibold transition-all ${
                hasApprovedScanback
                  ? "bg-[#e8f7ee] text-[#1f9d55]"
                  : hasRejectedScanback
                    ? "bg-[#fde8e7] text-danger-600"
                    : hasSubmittedScanback
                      ? "bg-[#eef4ff] text-brand-600"
                      : uploadedFiles.length > 0
                        ? "border border-brand-600 bg-white text-brand-600"
                        : "bg-[#eef2f7] text-ink-300 cursor-not-allowed"
              }`}
            >
              {hasApprovedScanback
                ? "Approved"
                : hasRejectedScanback
                  ? "Rejected"
                  : hasSubmittedScanback
                    ? "Submitted"
                    : uploadedFiles.length > 0
                      ? "Ready"
                      : "Pending"}
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
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              <Detail label="CLIENT" value={order.clientName} />
              <Detail label="SIGNING DATE & TIME" value={`${order.date}, ${order.time}`}>
                {meeting?.status === "confirmed" ? (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200/80">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    Confirmed
                  </div>
                ) : null}
              </Detail>
              <Detail label="NOTARY FEE" value={typeof order.price === "number" ? `$${order.price.toFixed(2)}` : "Not set"} />
              <Detail label="STATE" value={order.state || "Not set"} />

              {/* Action Banner for Responding to Schedule */}
              {canRespondToSchedule ? (
                <div className="col-span-2 md:col-span-4 rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 shadow-2xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 px-3 rounded-lg border border-amber-200/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 text-white shrink-0">
                        <Calendar size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-slate-900">Schedule Confirmation Required</div>
                        <div className="text-[12px] text-slate-600 truncate mt-0.5">
                          Proposed signing date: <span className="font-semibold text-slate-800">{order.date}, {order.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        disabled={isRespondingToSchedule}
                        onClick={() => {
                          void (async () => {
                            try {
                              setIsRespondingToSchedule(true);
                              const updatedOrder = await orderService.confirmOrderMeeting(order.id);
                              updateNotaryOrder(order.id, updatedOrder);
                              setOrderDetail(updatedOrder);
                              toast.success("Schedule accepted.");
                            } catch (error) {
                              toast.error(error instanceof Error ? error.message : "Unable to accept schedule.");
                            } finally {
                              setIsRespondingToSchedule(false);
                            }
                          })();
                        }}
                        className="h-8.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-3.5 text-[12px] font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={13} />
                        Accept Schedule
                      </Button>
                      <Button
                        variant="outline"
                        disabled={isRespondingToSchedule}
                        onClick={() => setShowRescheduleModal(true)}
                        className="h-8.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 text-[12px] font-semibold flex items-center gap-1.5"
                      >
                        <Clock size={13} />
                        Request Reschedule
                      </Button>
                    </div>
                  </div>

                  {wasCompanyRescheduleRejected && meeting?.rejectionNote ? (
                    <div className="rounded-lg border border-amber-200 bg-white p-2.5 px-3 text-[12px] text-amber-900 flex items-start gap-2">
                      <span className="font-bold text-amber-700 shrink-0">Company Note:</span>
                      <span className="italic text-slate-700">"{meeting.rejectionNote}"</span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Pending Reschedule Banner */}
              {meeting?.status === "rejected" && !wasCompanyRescheduleRejected ? (
                <div className="col-span-2 md:col-span-4 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 px-3 rounded-lg border border-blue-200/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white shrink-0">
                        <Clock size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-bold text-slate-900">Reschedule Requested</span>
                          {(meeting.preferredDate || meeting.preferredTime) && (
                            <span className="text-[12px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              Requested: {[meeting.preferredDate, meeting.preferredTime].filter(Boolean).join(" at ")}
                            </span>
                          )}
                        </div>
                        {meeting.rejectionNote && (
                          <div className="text-[12px] text-slate-600 truncate mt-0.5">
                            Note: <span className="italic">"{meeting.rejectionNote}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-800 border border-blue-200 shrink-0">
                      Pending Title Company Review
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="col-span-2 md:col-span-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">
                  PROPERTY ADDRESS
                </div>
                <div className="mt-2 flex items-center gap-2 text-[15px] font-semibold text-ink-900">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  {order.location}
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Special Instructions</div>
            <div className="mt-4 text-[14px] italic leading-[1.75] text-ink-500">
              "{orderDetail?.specialInstructions || "No special instructions provided for this signing."}"
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Provided Documents</div>
            <div className="mt-6 space-y-4">
              {providedDocuments.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-[#dfe6f2] bg-[#f7f9fd] px-4 py-6 text-center text-[14px] font-semibold text-ink-400">
                  No provided documents are available yet.
                </div>
              ) : providedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-[14px] bg-[#f7f9fd] px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600">
                      <FileText className="h-4 w-4 animate-none" />
                    </div>
                    <div>
                      <div className="font-semibold text-ink-900">{doc.fileName}</div>
                      <div className="text-sm text-ink-400">{doc.size} • Uploaded by {doc.uploadedBy}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 text-brand-600">
                    <Eye 
                      className="h-4 w-4 cursor-pointer hover:text-brand-700 transition-colors" 
                      onClick={() => void previewDocument(doc)}
                    />
                    <Download onClick={() => void downloadDocument(doc)} className="h-4 w-4 cursor-pointer hover:text-brand-700 transition-colors" />
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
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="text-[16px] font-extrabold uppercase tracking-[0.16em] text-ink-700">Submitted Scanbacks</div>
              <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-bold text-brand-600">
                {submittedScanbacks.length} File{submittedScanbacks.length === 1 ? "" : "s"}
              </span>
            </div>
            {submittedScanbacks.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-[#dfe6f2] bg-[#f7f9fd] px-4 py-7 text-center text-[14px] font-semibold text-ink-400">
                No scanbacks submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {submittedScanbacks.map((doc) => {
                  const isRejected = doc.displayStatus === "Rejected";
                  const isAccepted = doc.displayStatus === "Approved" || doc.displayStatus === "Verified";

                  return (
                  <div
                    key={doc.id}
                    className={`flex items-start justify-between gap-4 rounded-[14px] border px-4 py-4 transition-colors ${
                      isRejected
                        ? "border-[#f5c8c6] bg-[#fff8f8]"
                        : isAccepted
                          ? "border-[#d7f0df] bg-[#f7fcf9]"
                          : "border-transparent bg-[#f7f9fd]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <div className="min-w-0 max-w-full truncate font-semibold text-ink-900">{doc.fileName}</div>
                        {doc.displayStatus === "Approved" || doc.displayStatus === "Verified" ? (
                          <span className="shrink-0 rounded-full bg-[#e8f7ee] px-2.5 py-1 text-[11px] font-bold text-[#228b4d]">Accepted</span>
                        ) : doc.displayStatus === "Rejected" ? (
                          <span className="shrink-0 rounded-full bg-[#fde8e7] px-2.5 py-1 text-[11px] font-bold text-danger-600">Rejected</span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[11px] font-bold text-brand-600">Submitted</span>
                        )}
                      </div>
                      <div className={`mt-1 max-w-[460px] text-sm leading-[1.55] ${isRejected ? "text-danger-600" : "text-ink-400"}`}>
                        {doc.size} •{" "}
                        {doc.displayStatus === "Approved" || doc.displayStatus === "Verified"
                          ? "Accepted by admin"
                          : doc.displayStatus === "Rejected"
                            ? doc.comments?.trim() || "Rejected by admin. Please review and upload a corrected scanback."
                            : "Waiting for admin review"}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 self-center text-brand-600">
                      {doc.displayStatus === "Rejected" ? (
                        <button
                          type="button"
                          onClick={() => void resubmitScanback(doc)}
                          disabled={resubmittingDocumentId === doc.id}
                          className="h-9 rounded-[10px] bg-brand-600 px-3.5 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(24,90,188,0.18)] transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
                        >
                          {resubmittingDocumentId === doc.id ? "Submitting" : "Resubmit"}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void previewDocument(doc)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-brand-600 shadow-sm ring-1 ring-[#dce6f4] transition-colors hover:bg-brand-50"
                        aria-label={`Preview ${doc.fileName}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void downloadDocument(doc)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-brand-600 shadow-sm ring-1 ring-[#dce6f4] transition-colors hover:bg-brand-50"
                        aria-label={`Download ${doc.fileName}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {!isAccepted ? (
                        <button
                          type="button"
                          onClick={() => void deleteScanback(doc)}
                          disabled={deletingDocumentId === doc.id}
                          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-danger-600 shadow-sm ring-1 ring-[#f5c8c6] transition-colors hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Delete ${doc.fileName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </Surface>
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[16px] font-extrabold uppercase tracking-[0.16em] text-ink-700">Notary Notes</div>
              <Button
                type="button"
                variant="outline"
                disabled={isSavingNotes}
                className="h-[40px] rounded-[10px] border-[#dfe6f2] px-4 text-[13px] font-semibold"
                onClick={() => void saveNotaryNotes()}
              >
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
            <Textarea
              className="mt-5 min-h-[160px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 py-3 text-[14px]"
              placeholder="Add any specific details about the signing here..."
              value={notaryNotes}
              onChange={(event) => setNotaryNotes(event.target.value)}
            />
            <div className="mt-3 text-[12px] font-medium text-ink-400">
              These notes will be visible to admins while they review your submitted scanbacks.
            </div>
          </Surface>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="w-full max-w-[520px]">
          <Button 
            disabled={isSubmitting}
            className="h-[52px] w-full rounded-[12px] text-[18px] font-semibold"
            onClick={() => void submitScanbacks()}
          >
            {isSubmitting ? "Submitting..." : "Submit Documents"}
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
      {order?.id ? <OrderAdminChatPopup orderNumber={order.id} /> : null}
      <FooterBand />
    </div>
  );
}

function Detail({
  label,
  value,
  valueClassName,
  children,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">{label}</div>
      <div className={`mt-2 text-[16px] font-semibold text-ink-900 ${valueClassName ?? ""}`}>{value}</div>
      {children}
    </div>
  );
}
