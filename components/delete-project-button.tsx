"use client";

import { deleteProject } from "@/app/actions/projects";
import { DeleteButton } from "@/components/delete-button";

export function DeleteProjectButton({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  return (
    <DeleteButton
      action={async () => {
        await deleteProject(projectId);
      }}
      label={projectName}
      confirmMessage={`Supprimer le projet "${projectName}" et toutes ses données ?`}
    />
  );
}
