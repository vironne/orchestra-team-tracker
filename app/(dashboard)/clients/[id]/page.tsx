import { notFound } from "next/navigation";
import Link from "next/link";
import { getClientById } from "@/app/actions/clients";
import { PROJECT_STATUS, type ProjectStatusKey } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Mail, Phone, Building2, User } from "lucide-react";

type ContactInfo = {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let client: Awaited<ReturnType<typeof getClientById>> = null;

  try {
    client = await getClientById(id);
  } catch {
    // DB not connected
  }

  if (!client) return notFound();

  const contacts = (
    Array.isArray(client.contacts) ? client.contacts : []
  ) as ContactInfo[];

  return (
    <div className="space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Entreprises
      </Link>

      <PageHeader title={client.name} description={client.company ?? undefined} />

      {/* Contacts */}
      <div>
        <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
          <User className="h-4 w-4" />
          Contacts ({contacts.length || (client.email ? 1 : 0)})
        </h2>

        {contacts.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-800 p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{contact.name}</span>
                  {contact.role && (
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {contact.role}
                    </span>
                  )}
                </div>
                {contact.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3 w-3" /> {contact.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : client.email || client.phone ? (
          <div className="rounded-lg border border-zinc-800 p-4 space-y-1.5">
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {client.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> {client.email}
                </span>
              )}
              {client.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {client.phone}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 italic">
            Aucun contact enregistré.
          </p>
        )}
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="rounded-lg border border-zinc-800 p-4">
          <h3 className="mb-2 text-sm font-medium">Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {client.notes}
          </p>
        </div>
      )}

      {/* Projets */}
      <div>
        <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Projets ({client.projects.length})
        </h2>

        {client.projects.length === 0 ? (
          <EmptyState
            icon="📊"
            title="Aucun projet"
            description="Cette entreprise n'a pas encore de projet."
          />
        ) : (
          <div className="rounded-lg border border-zinc-800">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead>Projet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Tâches</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.projects.map((project: { id: string; name: string; status: string; _count?: { tasks: number } }) => {
                  const statusConfig =
                    PROJECT_STATUS[project.status as ProjectStatusKey];
                  return (
                    <TableRow key={project.id} className="border-zinc-800">
                      <TableCell>
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <StatusBadge config={statusConfig} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {project._count.tasks}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
