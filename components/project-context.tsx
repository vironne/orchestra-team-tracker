import { cn } from "@/lib/utils";

export function ProjectContext({
  project,
  className,
}: {
  project?: {
    id: string;
    name: string;
    client?: { name: string } | null;
  } | null;
  className?: string;
}) {
  if (!project) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs text-muted-foreground",
          className
        )}
      >
        🏢 Orchestra
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground",
        className
      )}
    >
      📁 {project.client?.name ?? project.name}
    </span>
  );
}
