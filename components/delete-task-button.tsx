"use client";

import { deleteTask } from "@/app/actions/tasks";
import { DeleteButton } from "@/components/delete-button";

export function DeleteTaskButton({
  taskId,
  taskTitle,
}: {
  taskId: string;
  taskTitle: string;
}) {
  return (
    <DeleteButton
      action={async () => {
        await deleteTask(taskId);
      }}
      label={taskTitle}
      confirmMessage={`Supprimer la tâche "${taskTitle}" ?`}
    />
  );
}
