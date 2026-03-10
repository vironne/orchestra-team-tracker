export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { getProjects } from "@/app/actions/projects";
import { getClients } from "@/app/actions/clients";
import { PROJECT_STATUS, type ProjectStatusKey } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { ProjectFormDialog } from "@/components/forms/project-form";
import { ProjectFilters } from "@/components/filters/project-filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProjectButton } from "@/components/delete-project-button";
import { EditProjectDialog } from "@/components/forms/edit-project-form";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; client?: string }>;
}) {
  const params = await searchParams;
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let clients: Awaited<ReturnType<typeof getClients>> = [];

  try {
    [projects, clients] = await Promise.all([getProjects(), getClients()]);
  } catch {
    // DB not connected — show empty state
  }

  // Apply filters
  let filtered = projects;
  if (params.status) {
    filtered = filtered.filter((p) => p.status === params.status);
  }
  if (params.client) {
    filtered = filtered.filter((p) => p.clientId === params.client);
  }

  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <PageHeader title="Projets" description="Tous les projets de l'équipe">
        <ProjectFormDialog clients={clientOptions} />
      </PageHeader>

      <Suspense fallback={null}>
        <ProjectFilters clients={clientOptions} />
      </Suspense>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📊"
          title="Aucun projet"
          description="Créez votre premier projet pour commencer le suivi."
        >
          <ProjectFormDialog clients={clientOptions} />
        </EmptyState>
      ) : (
        <div className="rounded-lg border border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Entreprise</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Mensuel</TableHead>
                <TableHead className="text-right">Annuel</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Bugs</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((project) => {
                const statusConfig =
                  PROJECT_STATUS[project.status as ProjectStatusKey];
                return (
                  <TableRow key={project.id} className="border-zinc-800">
                    <TableCell className="text-muted-foreground">
                      {project.client.name}
                    </TableCell>
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
                      {project.budget
                        ? `${Number(project.budget).toLocaleString("fr-FR")} €`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {project.monthlyCost
                        ? `${Number(project.monthlyCost).toLocaleString("fr-FR")} €`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {project.annualCost
                        ? `${Number(project.annualCost).toLocaleString("fr-FR")} €`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString("fr-FR")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {project._count.issues > 0 ? (
                        <span className="text-red-400">
                          {project._count.issues}
                        </span>
                      ) : (
                        <span className="text-zinc-600">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditProjectDialog
                          project={{
                            id: project.id,
                            name: project.name,
                            clientId: project.clientId,
                            status: project.status,
                            budget: project.budget ? Number(project.budget) : null,
                            monthlyCost: project.monthlyCost ? Number(project.monthlyCost) : null,
                            annualCost: project.annualCost ? Number(project.annualCost) : null,
                            dueDate: project.dueDate,
                            notes: project.notes,
                          }}
                          clients={clientOptions}
                        />
                        <DeleteProjectButton
                          projectId={project.id}
                          projectName={project.name}
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
