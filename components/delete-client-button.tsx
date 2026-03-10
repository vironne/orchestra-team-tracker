"use client";

import { deleteClient } from "@/app/actions/clients";
import { DeleteButton } from "@/components/delete-button";

export function DeleteClientButton({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  return (
    <DeleteButton
      action={async () => {
        const result = await deleteClient(clientId);
        if (!result.success) {
          throw new Error(result.error);
        }
      }}
      label={clientName}
      confirmMessage={`Supprimer l'entreprise "${clientName}" et tous ses projets ?`}
    />
  );
}
