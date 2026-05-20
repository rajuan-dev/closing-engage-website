import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Search, UploadCloud, Eye, EyeOff } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { MetricCard, NavItem } from "@/types/models";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/branding/closing-engage-logo.svg"
        alt="Closing Engage"
        className={cn(
          "h-4 w-auto object-contain md:h-5",
          light && "brightness-0 invert",
        )}
      />
    </div>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
        variant === "primary" && "bg-brand-600 text-white shadow-[0_10px_24px_rgba(24,90,188,0.18)] hover:bg-brand-700",
        variant === "secondary" && "bg-white text-brand-600 shadow-[0_10px_24px_rgba(20,48,112,0.08)] hover:bg-brand-50",
        variant === "outline" && "border border-ink-200 bg-white text-ink-900 hover:border-brand-200",
        variant === "ghost" && "bg-transparent text-brand-600 hover:bg-brand-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  icon,
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  return (
    <label className="block" htmlFor={props.id}>
      {label ? <span className="mb-2 block text-sm font-semibold text-ink-900">{label}</span> : null}
      <span
        className={cn(
          "relative flex h-13 items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 text-sm text-ink-500 focus-within:border-brand-200 focus-within:bg-white",
          className,
        )}
      >
        {icon}
        <input 
          id={props.id}
          type={isPasswordType ? (showPassword ? "text" : "password") : type}
          className="h-full w-full bg-transparent outline-none placeholder:text-ink-300 pr-10" 
          {...props} 
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 text-ink-400 hover:text-ink-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </span>
    </label>
  );
}

export function Textarea({
  label,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-ink-900">{label}</span> : null}
      <textarea
        className={cn(
          "min-h-28 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 outline-none placeholder:text-ink-300 focus:border-brand-200",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function Select({
  label,
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: string[];
}) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-ink-900">{label}</span> : null}
      <div className="relative">
        <select
          className={cn(
            "flex h-13 w-full appearance-none items-center justify-between rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-700 outline-none focus:border-brand-200",
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      </div>
    </label>
  );
}

export function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Received: "bg-slate-100 text-slate-600",
    Assigned: "bg-brand-50 text-brand-600",
    "Under Review": "bg-warning-100 text-warning-600",
    Approved: "bg-green-100 text-success-600",
    Completed: "bg-success-100 text-success-600",
    Pending: "bg-warning-100 text-warning-600",
    "Pending Invite": "bg-warning-100 text-warning-600",
    Active: "bg-success-100 text-success-600",
    Inactive: "bg-slate-100 text-slate-600",
    Submitted: "bg-brand-50 text-brand-600",
    "In Progress": "bg-warning-100 text-warning-600",
    "Pending Upload": "bg-danger-100 text-danger-600",
    Verified: "bg-success-100 text-success-600",
    Admin: "bg-brand-50 text-brand-600",
    Member: "bg-slate-100 text-slate-600",
    "Pending Review": "bg-warning-100 text-warning-600",
  };

  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", map[status] ?? "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
}

export function Surface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("surface", className)}>{children}</div>;
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-ink-900">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function MetricCards({ items }: { items: MetricCard[] }) {
  const toneClass = {
    brand: "bg-brand-50 text-brand-600",
    warning: "bg-warning-100 text-warning-600",
    success: "bg-success-100 text-success-600",
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Surface key={item.title} className="p-6">
          <div className="mb-5 flex items-start justify-between">
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                toneClass[item.tone ?? "brand"],
              )}
            >
              <Check className="h-5 w-5" />
            </span>
            {item.helper ? <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-300">{item.helper}</span> : null}
          </div>
          <div className="text-sm font-semibold text-ink-500">{item.title}</div>
          <div className="mt-2 text-5xl font-extrabold tracking-[-0.04em] text-ink-900">{item.value}</div>
        </Surface>
      ))}
    </div>
  );
}

export function SearchField({ placeholder = "Search orders, notaries, or documents..." }: { placeholder?: string }) {
  return (
    <div className="flex h-[46px] w-full items-center gap-3 rounded-[16px] border border-[#e7ecf4] bg-white px-4 shadow-[0_10px_26px_rgba(20,48,112,0.04)] md:h-[50px] md:px-5">
      <Search className="h-4 w-4 shrink-0 text-ink-300" />
      <input
        type="search"
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm text-ink-700 outline-none placeholder:text-ink-300 md:text-[15px]"
      />
    </div>
  );
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="space-y-2">
      {items.map(({ href, label, icon: Icon }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold text-ink-900 transition",
              isActive && "bg-brand-50 text-brand-600",
            )
          }
        >
          {Icon ? <Icon className="h-5 w-5" /> : null}
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function FooterBand() {
  return (
    <div className="border-t border-ink-100 pt-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-500 md:flex md:justify-between">
      <span>© 2026 Closing Engage System</span>
      <span>Privacy Policy</span>
    </div>
  );
}

export function UploadZone({
  title = "Drag & Drop Scanbacks",
  subtitle = "Drop your PDF files here or click to browse your computer.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <UploadCloud className="h-8 w-8" />
      </div>
      <div className="text-3xl font-extrabold tracking-[-0.03em] text-ink-900">{title}</div>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-500">{subtitle}</p>
      <Button variant="outline" className="mt-8">
        Browse Files
      </Button>
    </div>
  );
}

export function Table({
  headers,
  children,
  footer,
}: {
  headers: string[];
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Surface className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-ink-50 text-xs uppercase tracking-[0.14em] text-ink-400">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {footer ? <div className="border-t border-ink-100 px-6 py-4">{footer}</div> : null}
    </Surface>
  );
}

import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "760px",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5 py-5 sm:py-10 backdrop-blur-[2px] transition-all duration-300"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-h-[calc(100vh-40px)] sm:max-h-[calc(100vh-80px)] flex flex-col overflow-hidden rounded-[24px] border border-[#dfe6f2] bg-white shadow-[0_30px_70px_rgba(15,23,42,0.22)] animate-in zoom-in-95 duration-200",
        )}
        style={{ maxWidth }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-7 py-7 shrink-0">
          <div>
            <div className="text-[32px] font-extrabold tracking-[-0.04em] text-ink-900 md:text-[38px]">
              {title}
            </div>
            {subtitle ? <div className="mt-2 text-[15px] text-ink-500 md:text-[16px]">{subtitle}</div> : null}
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-[#f6f8fd] hover:text-ink-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
