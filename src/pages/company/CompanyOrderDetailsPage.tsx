import { useEffect, useState } from "react";
import { CircleDot, FileText, ChevronLeft, MapPin, Eye } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Modal, Surface } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

export function CompanyOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { companyOrders, updateCompanyOrder, companyDocuments } = useStore();
  
  const order = companyOrders.find(o => o.id.replace("#", "") === id) || companyOrders[0];
  const docs = companyDocuments.filter(d => d.orderId === order.id.replace("#", ""));

  const notaryInfo = order.notary === "--"
    ? { name: "Not Assigned", email: "support@closingengage.com", phone: "(555) 000-0000", closings: 0, avatar: "?", serviceArea: "N/A", specialty: "N/A" }
    : {
        name: order.notary,
        email: `${order.notary.toLowerCase().replace(" ", ".")}@closingengage.com`,
        phone: "(555) 012-3456",
        closings: 93,
        avatar: order.notary.split(" ").map(n => n[0]).join(""),
        serviceArea: "Dallas, Fort Worth, Arlington",
        specialty: "Purchase, Refinance, HELOC"
      };

  const [showNotaryProfile, setShowNotaryProfile] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [clientName, setClientName] = useState("");
  const [signingDate, setSigningDate] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("Client requested an evening signing. Please confirm notary availability for late pickup.");

  useEffect(() => {
    if (order) {
      setClientName(order.clientName);
      setSigningDate(order.date);
      setPropertyAddress(order.propertyAddress);
    }
  }, [order, isEditing]);

  const statuses = ["Received", "Assigned", "Under Review", "Approved", "Completed"];
  const currentIdx = statuses.indexOf(order.status);
  
  const orderTimeline = statuses.map((s, idx) => ({
    title: s,
    body: idx < currentIdx ? "Completed" : idx === currentIdx ? "Current Stage" : "Pending",
    active: idx <= currentIdx,
    current: idx === currentIdx
  }));

  const activityLog = [
    ["Review completed", "Final review by Compliance Team finished.", "Today, 2:45 PM"],
    ["Documents uploaded", "New version of Title Insurance form added.", "Yesterday, 10:15 AM"],
    ["Notary assigned", `${order.notary === "--" ? "A notary" : order.notary} has been assigned to this order.`, order.date],
  ] as const;

  return (
    <>
      <div className="space-y-6">
        <div className="text-[12px] text-ink-400">
          <span>Orders</span>
          <span className="mx-2 text-ink-300">›</span>
          <span className="font-semibold text-brand-600">Order Details</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
              Order {order.id}
            </h1>
            <Badge status={order.status as any} />
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
                    updateCompanyOrder(order.id, {
                      clientName,
                      date: signingDate,
                      propertyAddress,
                    });
                    setIsEditing(false);
                    toast.success("Order information updated successfully!");
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
                  <Detail label="SIGNING DATE & TIME" value={`${order.date}, 2:45 PM`} />
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
                      "{specialInstructions}"
                    </div>
                  </div>
                </div>
              )}
            </Surface>

            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-[18px] font-bold tracking-tight text-ink-900">Documents</div>
                </div>
                <div className="text-[13px] font-semibold text-brand-600">2 Files Total</div>
              </div>
              <div className="space-y-4">
                {docs.length > 0 ? docs.map((document, index) => (
                  <div key={`${document.name}-${index}`} className="flex items-center gap-4 rounded-[14px] bg-[#fbfbff] px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff1f1] text-danger-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-ink-900">{document.name}</div>
                      <div className="mt-1 text-[12px] text-ink-400">Uploaded {document.uploadDate} • {document.size}</div>
                    </div>
                    <button 
                      onClick={() => setViewingFile({ name: document.name, url: "#" })}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-6 text-ink-400 text-sm">No documents uploaded yet</div>
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
              <div className="space-y-7">
                {activityLog.map(([title, body, time], index) => (
                  <div key={title} className="relative pl-8">
                    {index < activityLog.length - 1 ? (
                      <div className="absolute left-[7px] top-5 h-[calc(100%+18px)] w-px bg-[#dbe4f1]" />
                    ) : null}
                    <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[17px] font-bold text-ink-900">{title}</div>
                        <div className="mt-2 text-[14px] leading-[1.7] text-ink-500">{body}</div>
                      </div>
                      <div className="shrink-0 text-[12px] font-semibold text-ink-400">{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>

          <div className="space-y-6">
            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="text-[14px] font-semibold uppercase tracking-[0.08em] text-ink-400">Assigned Notary</div>
              <div className="mt-5 flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-[12px] bg-[linear-gradient(135deg,#7a523f,#d0b38d)] flex items-center justify-center text-white font-bold text-xl">
                  {notaryInfo.avatar}
                </div>
                <div>
                  <div className="text-[22px] font-extrabold tracking-[-0.03em] text-ink-900">{notaryInfo.name}</div>
                  <div className="mt-1 text-[13px] text-ink-500">4.9 <span className="mx-1 text-[#f0a11d]">★</span> ({notaryInfo.closings} Closings)</div>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Phone</span>
                  <span className="font-semibold text-ink-700">{notaryInfo.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Status</span>
                  <span className="font-semibold text-[#26b15f]">• Available</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNotaryProfile(true)}
                disabled={order.notary === "--"}
                className="mt-6 h-[42px] w-full rounded-[12px] bg-[#f4f7fc] text-[14px] font-semibold text-brand-600 transition-colors hover:bg-[#edf3fe] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                View Full Profile
              </button>
            </Surface>

            <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f6f6fd] p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="text-[18px] font-bold tracking-tight text-ink-900">Order Status</div>
              <div className="mt-7 space-y-6">
                {orderTimeline.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      updateCompanyOrder(order.id, { status: item.title as any });
                      toast.success(`Order status successfully updated to '${item.title}'!`);
                    }}
                    className="relative pl-10 w-full text-left block focus:outline-none group transition-transform active:scale-[0.98]"
                  >
                    {index < orderTimeline.length - 1 ? (
                      <div className={`absolute left-[13px] top-7 h-[calc(100%+12px)] w-[2px] ${item.active ? "bg-brand-600" : "bg-[#d6dbe7]"}`} />
                    ) : null}
                    <div
                      className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                        item.current
                          ? "border-brand-600 bg-white group-hover:bg-brand-50"
                          : item.active
                            ? "border-brand-600 bg-brand-600 group-hover:bg-brand-700"
                            : "border-[#cfd5e1] bg-white group-hover:border-brand-400"
                      }`}
                    >
                      {item.current ? <div className="h-2.5 w-2.5 rounded-full bg-brand-600" /> : null}
                    </div>
                    <div className={`text-[16px] font-bold tracking-tight transition-colors ${item.active ? "text-ink-900 group-hover:text-brand-600" : "text-ink-300 group-hover:text-ink-400"}`}>
                      {item.title}
                    </div>
                    <div className={`mt-1 text-[13px] transition-colors ${item.current ? "font-semibold text-brand-600" : item.active ? "text-ink-500" : "text-ink-300"}`}>
                      {item.body}
                    </div>
                  </button>
                ))}
              </div>
            </Surface>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showNotaryProfile}
        onClose={() => setShowNotaryProfile(false)}
        title={order.notary === "--" ? "No Notary Assigned" : order.notary}
        subtitle="Certified mobile notary supporting purchase, refinance, and seller-side closings."
        maxWidth="560px"
      >
        <div className="px-7 pb-8">
          <div className="flex items-center gap-4 rounded-[18px] bg-[#f8fbff] p-5">
            <div className="h-18 w-18 overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#7a523f,#d0b38d)] flex items-center justify-center text-white font-bold text-2xl">
              {notaryInfo.avatar}
            </div>
            <div>
              <div className="text-[18px] font-bold text-ink-900">{notaryInfo.name}</div>
              <div className="mt-1 text-[14px] text-ink-500">4.9 rating • {notaryInfo.closings} closings completed</div>
              <div className="mt-1 text-[14px] font-semibold text-[#26b15f]">Available for assignment</div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Detail label="PHONE" value={notaryInfo.phone} />
            <Detail label="EMAIL" value={notaryInfo.email} />
            <Detail label="SERVICE AREA" value={notaryInfo.serviceArea} />
            <Detail label="SPECIALTY" value={notaryInfo.specialty} />
          </div>

          <div className="mt-6 rounded-[16px] bg-[#f8fbff] px-5 py-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-400">
              Professional Summary
            </div>
            <div className="mt-3 text-[14px] leading-[1.75] text-ink-500">
              Experienced signing agent with strong borrower communication, same-day scanback accuracy, and consistent performance across high-volume residential closing packages.
            </div>
          </div>

          <div className="mt-7 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-[12px] border-[#dfe6f2] px-5 text-[14px] font-semibold text-ink-700"
              onClick={() => setShowNotaryProfile(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
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
