import { cn } from "@/lib/utils";

interface AssignedNotaryAvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
  initialsClassName?: string;
  alt?: string;
}

const initialsFromName = (name: string) => {
  if (name === "--") return "?";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
};

const fallbackToneForName = (name: string) => {
  const tones = [
    "from-[#1f5fd1] to-[#4f8ff7]",
    "from-[#7a523f] to-[#d0b38d]",
    "from-[#165466] to-[#4eb3af]",
    "from-[#384860] to-[#8897b0]",
    "from-[#5c4b8a] to-[#9c7bf2]",
  ];
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tones[hash % tones.length];
};

export function AssignedNotaryAvatar({
  name,
  avatarUrl,
  className,
  initialsClassName,
  alt,
}: AssignedNotaryAvatarProps) {
  if (avatarUrl) {
    return (
      <div className={cn("overflow-hidden bg-[#eef3fb]", className)}>
        <img src={avatarUrl} alt={alt || `${name} avatar`} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        `flex items-center justify-center bg-gradient-to-br ${fallbackToneForName(name)} text-white`,
        className,
      )}
      aria-label={alt || `${name} avatar fallback`}
    >
      <span className={cn("font-bold uppercase", initialsClassName)}>{initialsFromName(name)}</span>
    </div>
  );
}
