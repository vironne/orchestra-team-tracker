export const dynamic = "force-dynamic";

import Link from "next/link";
import { getClients } from "@/app/actions/clients";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ClientFormDialog } from "@/components/forms/client-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import { DeleteClientButton } from "@/components/delete-client-button";
import { EditClientDialog } from "@/components/forms/edit-client-form";

type ContactInfo = {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
};

export default async function ClientsPage() {
  let clients: Awaited<ReturnType<typeof getClients>> = [];

  try {
    clients = await getClients();
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Entreprises" description="Répertoire de toutes les entreprises">
        <ClientFormDialog />
      </PageHeader>

      {clients.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="Aucune entreprise"
          description="Ajoutez votre première entreprise pour démarrer."
        >
          <ClientFormDialog />
        </EmptyState>
      ) : (
        <div className="rounded-lg border border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Entreprise</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead className="text-right">Projets</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const contacts = (
                  Array.isArray(client.contacts) ? client.contacts : []
                ) as ContactInfo[];

                return (
                  <TableRow key={client.id} className="border-zinc-800">
                    <TableCell>
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {client.name}
                      </Link>
                      {client.company && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {client.company}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {contacts.length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          {contacts.slice(0, 2).map((c, i) => (
                            <span
                              key={i}
                              className="text-sm text-muted-foreground flex items-center gap-1"
                            >
                              👤 {c.name}
                              {c.role && (
                                <span className="text-xs text-zinc-600">
                                  ({c.role})
                                </span>
                              )}
                            </span>
                          ))}
                          {contacts.length > 2 && (
                            <span className="text-xs text-zinc-500">
                              +{contacts.length - 2} autre
                              {contacts.length - 2 > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      ) : client.email ? (
                        <span className="text-sm text-muted-foreground">
                          {client.email}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Users className="h-3 w-3 text-zinc-500" />
                        {client.projects.length}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditClientDialog
                          client={{
                            id: client.id,
                            name: client.name,
                            company: client.company,
                            contacts: client.contacts,
                            notes: client.notes,
                          }}
                        />
                        <DeleteClientButton
                          clientId={client.id}
                          clientName={client.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
