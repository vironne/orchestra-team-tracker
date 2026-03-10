"use client";

import { updateTask } from "@/app/actions/tasks";
import { TASK_STATUS, type TaskStatusKey } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  todo: "border-zinc-600 text-zinc-500",
  in_progress: "border-blue-500 bg-blue-500/20 text-blue-400",
  done: "border-emerald-500 bg-emerald-500/20 text-emerald-400",
};

export function TaskStatusToggle({
  taskId,
  status,
}: {
  taskId: string;
  status: TaskStatusKey;
}) {
  async function handleChange(newStatus: TaskStatusKey) {
    await updateTask(taskId, { status: newStatus });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[0.6rem] transition-colors hover:opacity-80",
            statusStyles[status]
          )}
          title={TASK_STATUS[status].label}
        >
          {status === "done" && "✓"}
          {status === "in_progress" && "→"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {Object.entries(TASK_STATUS).map(([key, val]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleChange(key as TaskStatusKey)}
            className={cn(status === key && "bg-accent")}
          >
            {val.emoji} {val.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
