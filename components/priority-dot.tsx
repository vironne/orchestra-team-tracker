import { cn } from "@/lib/utils";

const dotColors: Record<string, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  gray: "bg-zinc-500",
};

type PriorityConfig = {
  label: string;
  emoji: string;
  color: string;
};

export function PriorityDot({
  config,
  showLabel = false,
  className,
}: {
  config: PriorityConfig;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "h-2.5 w-2.5 shrink-0 rounded-full",
          dotColors[config.color] ?? dotColors.gray
        )}
        title={config.label}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </span>
  );
}
