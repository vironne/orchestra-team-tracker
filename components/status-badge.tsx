import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  gray: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  red: "bg-red-500/15 text-red-400 border-red-500/20",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  slate: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

type StatusConfig = {
  label: string;
  emoji: string;
  color: string;
};

export function StatusBadge({
  config,
  className,
}: {
  config: StatusConfig;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colorMap[config.color] ?? colorMap.gray,
        className
      )}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
