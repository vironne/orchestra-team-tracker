import { cn } from "@/lib/utils";

const catColors: Record<string, string> = {
  green: "bg-emerald-500/10 text-emerald-400",
  blue: "bg-blue-500/10 text-blue-400",
  violet: "bg-violet-500/10 text-violet-400",
  orange: "bg-orange-500/10 text-orange-400",
  gray: "bg-zinc-500/10 text-zinc-400",
  red: "bg-red-500/10 text-red-400",
  yellow: "bg-yellow-500/10 text-yellow-400",
};

export function CategoryBadge({
  emoji,
  name,
  color,
  className,
}: {
  emoji: string;
  name: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        catColors[color] ?? catColors.gray,
        className
      )}
    >
      <span>{emoji}</span>
      {name}
    </span>
  );
}
