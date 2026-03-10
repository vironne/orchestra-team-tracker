import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/app/actions/projects";
import { getTeamMembers } from "@/app/actions/team";
import {
  PROJECT_STATUS,
  ISSUE_STATUS,
  ISSUE_PRIORITY,
  INVOICE_STATUS,
  type ProjectStatusKey,
  type IssueStatusKey,
  type IssuePriorityKey,
  type InvoiceStatusKey,
} from "@/lib/constants";
import { StatusBadge } from "@/components/status-badge";
import { MemberAvatar } from "@/components/member-avatar";
import { EmptyState } from "@/components/empty-state";
import { IssueFormDialog } from "@/components/forms/issue-form";
import { IssueActions } from "@/components/issue-actions";
import { EditIssueDialog } from "@/components/forms/edit-issue-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calendar, DollarSign, Building2 } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let project: Awaited<ReturnType<typeof getProjectById>> = null;
  let members: Awaited<ReturnType<typeof getTeamMembers>> = [];

  try {
    [project, members] = await Promise.all([
      getProjectById(id),
      getTeamMembers(),
    ]);
  } catch {
    // DB not connected
  }

  if (!project) return notFound();

  const statusConfig = PROJECT_STATUS[project.status as ProjectStatusKey];
  const memberOptions = members.map((m) => ({ id: m.id, name: m.name }));

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Projets
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              <Building2 className="mr-1 inline h-3.5 w-3.5" />
              {project.client.name}
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.name}
            </h1>
          </div>
          <StatusBadge config={statusConfig} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {project.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              Budget : {Number(project.budget).toLocaleString("fr-FR")} €
            </span>
          )}
          {project.monthlyCost && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              Mensuel : {Number(project.monthlyCost).toLocaleString("fr-FR")} €
            </span>
          )}
          {project.annualCost && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              Annuel : {Number(project.annualCost).toLocaleString("fr-FR")} €
            </span>
          )}
          {project.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(project.dueDate).toLocaleDateString("fr-FR")}
            </span>
          )}
          {project.startDate && (
            <span>
              Début :{" "}
              {new Date(project.startDate).toLocaleDateString("fr-FR")}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">📊 Aperçu</TabsTrigger>
          <TabsTrigger value="invoices">💰 Factures</TabsTrigger>
          <TabsTrigger value="bugs">
            🐛 Bugs
            {project.issues.length > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500/20 px-1.5 py-0.5 text-[0.6rem] text-red-400">
                {project.issues.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Aperçu */}
        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg border border-zinc-800 p-4">
            <h3 className="mb-2 text-sm font-medium">Notes</h3>
            {project.notes ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {project.notes}
              </p>
            ) : (
              <p className="text-sm text-zinc-600 italic">
                Aucune note pour ce projet.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-800 p-4 text-center">
              <p className="text-2xl font-bold">{project.tasks.length}</p>
              <p className="text-xs text-muted-foreground">Tâches</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-4 text-center">
              <p className="text-2xl font-bold">{project.issues.length}</p>
              <p className="text-xs text-muted-foreground">Bugs</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-4 text-center">
              <p className="text-2xl font-bold">{project.invoices.length}</p>
              <p className="text-xs text-muted-foreground">Factures</p>
            </div>
          </div>
        </TabsContent>

        {/* Factures */}
        <TabsContent value="invoices">
          {project.invoices.length === 0 ? (
            <EmptyState
              icon="💰"
              title="Aucune facture"
              description="Les factures seront disponibles en Phase 2."
            />
          ) : (
            <div className="rounded-lg border border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>N°</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Échéance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.invoices.map((inv) => {
                    const invStatus =
                      INVOICE_STATUS[inv.status as InvoiceStatusKey];
                    return (
                      <TableRow key={inv.id} className="border-zinc-800">
                        <TableCell className="font-mono">
                          #{inv.number}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {Number(inv.amount).toLocaleString("fr-FR")} €
                        </TableCell>
                        <TableCell>
                          <StatusBadge config={invStatus} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {inv.dueDate
                            ? new Date(inv.dueDate).toLocaleDateString("fr-FR")
                            : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Bugs */}
        <TabsContent value="bugs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {project.issues.length} issue{project.issues.length !== 1 ? "s" : ""}
            </h3>
            <IssueFormDialog projectId={project.id} members={memberOptions} />
          </div>

          {project.issues.length === 0 ? (
            <EmptyState
              icon="🐛"
              title="Aucun bug"
              description="Ajoutez un bug ou une amélioration pour ce projet."
            >
              <IssueFormDialog
                projectId={project.id}
                members={memberOptions}
              />
            </EmptyState>
          ) : (
            <div className="rounded-lg border border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="w-8">Prio</TableHead>
                    <TableHead>Bug</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Assigné</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.issues.map((issue) => {
                    const issueStatus =
                      ISSUE_STATUS[issue.status as IssueStatusKey];
                    const issuePriority =
                      ISSUE_PRIORITY[issue.priority as IssuePriorityKey];
                    return (
                      <TableRow key={issue.id} className="border-zinc-800">
                        <TableCell>
                          <span title={issuePriority.label}>
                            {issuePriority.emoji}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{issue.title}</span>
                            {issue.description && (
                              <p className="mt-0.5 text-xs text-zinc-500 truncate max-w-xs">
                                {issue.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge config={issueStatus} />
                        </TableCell>
                        <TableCell>
                          {issue.assignee ? (
                            <MemberAvatar
                              name={issue.assignee.name}
                              avatar={issue.assignee.avatar}
                            />
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <EditIssueDialog
                              issue={{
                                id: issue.id,
                                projectId: project.id,
                                title: issue.title,
                                description: issue.description,
                                status: issue.status,
                                priority: issue.priority,
                                type: issue.type,
                                assigneeId: issue.assigneeId,
                              }}
                              members={memberOptions}
                            />
                            <IssueActions
                              issueId={issue.id}
                              currentStatus={issue.status as IssueStatusKey}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
