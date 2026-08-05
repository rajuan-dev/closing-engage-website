import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import { Check, ChevronDown, Search, UploadCloud, Eye, EyeOff, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
  onClick,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (type === "date" || type === "time") {
      try {
        e.currentTarget.showPicker?.();
      } catch {
        // Fallback ignored
      }
    }
    if (onClick) onClick(e);
  };

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
          onClick={handleClick}
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

export type SelectOptionObj = {
  value: string;
  label: string;
  sublabel?: string;
};

export type SelectOption = string | SelectOptionObj;

export function Select({
  label,
  options,
  value = "",
  onChange,
  className,
  placeholder = "Select...",
  name,
  disabled = false,
  id,
}: {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  className?: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  id?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return {
          value: opt === "Select State" || opt.startsWith("Select ") ? "" : opt,
          label: opt,
        };
      }
      return opt;
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    return (
      normalizedOptions.find((o) => o.value === value) ||
      (value ? { value, label: value } : null)
    );
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [normalizedOptions, searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    if (onChange) {
      onChange({ target: { value: optValue, name } });
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const isSearchable = normalizedOptions.length > 6;

  return (
    <div className="block" id={id}>
      {label ? <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">{label}</span> : null}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex h-13 w-full items-center justify-between rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-700 outline-none transition-all duration-150 hover:border-brand-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed",
            isOpen && "border-brand-400 ring-2 ring-brand-500/10 shadow-sm",
            className
          )}
        >
          <span className={cn("truncate text-left", !selectedOption || selectedOption.value === "" ? "text-ink-400 font-normal" : "font-semibold text-ink-900")}>
            {selectedOption && selectedOption.value !== "" ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform duration-200", isOpen && "rotate-180 text-brand-600")} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-[#dfe6f2] bg-white p-1.5 shadow-[0_16px_36px_rgba(20,48,112,0.14)] animate-in fade-in zoom-in-95 duration-150">
            {isSearchable && (
              <div className="relative mb-1 px-1 pt-1 pb-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search state or code..."
                  className="w-full rounded-lg border border-[#e4ebf5] bg-[#f8fbff] py-1.5 pl-8 pr-3 text-xs text-ink-900 outline-none focus:border-brand-300 focus:bg-white"
                  autoFocus
                />
              </div>
            )}
            <div className="max-h-56 overflow-y-auto pr-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-3 text-center text-xs text-ink-400">No options found</div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value + opt.label}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors text-left",
                        isSelected
                          ? "bg-brand-50 font-bold text-brand-700"
                          : "text-ink-700 hover:bg-[#f5f8ff] hover:text-ink-900 font-medium"
                      )}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-600 ml-2" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DatePicker({
  label,
  value = "",
  onChange,
  placeholder = "Select date...",
  className,
  name,
  disabled = false,
}: {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const parsedDate = value ? new Date(value + "T00:00:00") : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());

  const [viewYear, setViewYear] = useState(isValidDate ? parsedDate.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(isValidDate ? parsedDate.getMonth() : today.getMonth());

  useEffect(() => {
    if (isValidDate) {
      setViewYear(parsedDate.getFullYear());
      setViewMonth(parsedDate.getMonth());
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((v) => v - 1);
    } else {
      setViewMonth((v) => v - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((v) => v + 1);
    } else {
      setViewMonth((v) => v + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;

    if (onChange) {
      onChange({ target: { value: dateStr, name } });
    }
    setIsOpen(false);
  };

  const handlePreset = (preset: "today" | "tomorrow" | "nextWeek") => {
    const d = new Date();
    if (preset === "tomorrow") {
      d.setDate(d.getDate() + 1);
    } else if (preset === "nextWeek") {
      d.setDate(d.getDate() + 7);
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;
    if (onChange) {
      onChange({ target: { value: dateStr, name } });
    }
    setIsOpen(false);
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const displayFormatted = isValidDate
    ? parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : value || placeholder;

  return (
    <div className="block">
      {label ? <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">{label}</span> : null}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex h-13 w-full items-center justify-between rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-700 outline-none transition-all hover:border-brand-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10",
            isOpen && "border-brand-400 ring-2 ring-brand-500/10 shadow-sm",
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Calendar className="h-4 w-4 shrink-0 text-brand-600" />
            <span className={cn(isValidDate ? "font-semibold text-ink-900" : "text-ink-400 font-normal")}>
              {displayFormatted}
            </span>
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform duration-200", isOpen && "rotate-180 text-brand-600")} />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[300px] sm:w-[320px] rounded-2xl border border-[#dfe6f2] bg-white p-4 shadow-[0_20px_45px_rgba(20,48,112,0.16)] animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-3 flex items-center justify-between gap-1.5 rounded-xl bg-[#f5f8ff] p-1 text-xs">
              <button
                type="button"
                onClick={() => handlePreset("today")}
                className="flex-1 rounded-lg py-1 text-center font-semibold text-ink-700 hover:bg-white hover:text-brand-600 hover:shadow-sm transition-all"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handlePreset("tomorrow")}
                className="flex-1 rounded-lg py-1 text-center font-semibold text-ink-700 hover:bg-white hover:text-brand-600 hover:shadow-sm transition-all"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handlePreset("nextWeek")}
                className="flex-1 rounded-lg py-1 text-center font-semibold text-ink-700 hover:bg-white hover:text-brand-600 hover:shadow-sm transition-all"
              >
                In 1 Wk
              </button>
            </div>

            <div className="mb-3 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-500 hover:bg-[#f0f4fc] hover:text-ink-900 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-bold text-ink-900">
                {monthNames[viewMonth]} {viewYear}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-500 hover:bg-[#f0f4fc] hover:text-ink-900 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-1.5 grid grid-cols-7 text-center text-[11px] font-bold text-ink-400 uppercase">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const formattedMonth = String(viewMonth + 1).padStart(2, "0");
                const formattedDay = String(dayNum).padStart(2, "0");
                const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;

                const isSelected = value === dateStr;
                const isToday =
                  today.getFullYear() === viewYear &&
                  today.getMonth() === viewMonth &&
                  today.getDate() === dayNum;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={cn(
                      "h-8 w-8 mx-auto flex items-center justify-center rounded-xl transition-all text-[13px]",
                      isSelected
                        ? "bg-brand-600 font-bold text-white shadow-md shadow-brand-600/30"
                        : isToday
                        ? "border border-brand-500 font-bold text-brand-600 bg-brand-50"
                        : "font-semibold text-ink-800 hover:bg-[#f0f4fc] hover:text-brand-600"
                    )}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            {value ? (
              <div className="mt-3 border-t border-[#edf2fa] pt-2 text-right">
                <button
                  type="button"
                  onClick={() => {
                    if (onChange) onChange({ target: { value: "", name } });
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold text-danger-600 hover:underline"
                >
                  Clear Date
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export function TimePicker({
  label,
  value = "",
  onChange,
  placeholder = "Select time...",
  className,
  name,
  disabled = false,
}: {
  label?: string;
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const popularTimes = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:30 PM", "05:00 PM",
  ];

  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTime = (timeStr: string) => {
    if (onChange) {
      onChange({ target: { value: timeStr, name } });
    }
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    const timeStr = `${hour}:${minute} ${ampm}`;
    handleSelectTime(timeStr);
  };

  return (
    <div className="block">
      {label ? <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500">{label}</span> : null}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex h-13 w-full items-center justify-between rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-700 outline-none transition-all hover:border-brand-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10",
            isOpen && "border-brand-400 ring-2 ring-brand-500/10 shadow-sm",
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Clock className="h-4 w-4 shrink-0 text-brand-600" />
            <span className={cn(value ? "font-semibold text-ink-900" : "text-ink-400 font-normal")}>
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform duration-200", isOpen && "rotate-180 text-brand-600")} />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[290px] rounded-2xl border border-[#dfe6f2] bg-white p-4 shadow-[0_20px_45px_rgba(20,48,112,0.16)] animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
              Quick Time Options
            </div>
            <div className="mb-4 grid grid-cols-2 gap-1.5 text-xs">
              {popularTimes.map((t) => {
                const isSelected = value === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleSelectTime(t)}
                    className={cn(
                      "rounded-xl py-2 px-3 text-center font-medium transition-all",
                      isSelected
                        ? "bg-brand-600 text-white font-bold shadow-sm"
                        : "bg-[#f5f8ff] text-ink-800 hover:bg-brand-50 hover:text-brand-600 font-semibold"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-[#edf2fa] pt-3">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                Custom Time
              </div>
              <div className="flex items-center justify-between gap-1.5">
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="h-9 flex-1 rounded-xl border border-[#dfe6f2] bg-[#f8fbff] px-2 text-xs font-semibold text-ink-900 outline-none focus:border-brand-400"
                >
                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="font-bold text-ink-400">:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="h-9 flex-1 rounded-xl border border-[#dfe6f2] bg-[#f8fbff] px-2 text-xs font-semibold text-ink-900 outline-none focus:border-brand-400"
                >
                  {["00","15","30","45"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAmpm((prev) => (prev === "AM" ? "PM" : "AM"))}
                  className="h-9 rounded-xl border border-[#dfe6f2] bg-brand-50 px-3 text-xs font-bold text-brand-700 hover:bg-brand-100 transition-colors"
                >
                  {ampm}
                </button>
                <button
                  type="button"
                  onClick={handleCustomApply}
                  className="h-9 rounded-xl bg-brand-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
                >
                  Set
                </button>
              </div>
            </div>

            {value ? (
              <div className="mt-3 border-t border-[#edf2fa] pt-2 text-right">
                <button
                  type="button"
                  onClick={() => {
                    if (onChange) onChange({ target: { value: "", name } });
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold text-danger-600 hover:underline"
                >
                  Clear Time
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}


export function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Open Order": "bg-[#eef4ff] text-brand-600",
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
