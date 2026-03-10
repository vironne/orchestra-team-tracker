export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getTeamMemberById } from "@/app/actions/team";
import { TASK_STATUS, TASK_PRIORITY, ISSUE_STATUS, ISSUE_PRIORITY } from "@/lib/constants";
import type { TaskStatusKey, TaskPriorityKey, IssueStatusKey, IssuePriorityKey } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { MemberAvatar } from "@/components/member-avatar";
import { StatusBadge } from "@/components/status-badge";
import { PriorityDot } from "@/components/priority-dot";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Briefcase } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TeamMemberProfilePage({ params }: Props) {
  const { id } = await params;
  const member = await getTeamMemberById(id);

  if (!member) return notFound();

  const tasks = member.assignedTasks ?? [];
  const issues = member.assignedIssues ?? [];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/settings/team"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l&apos;équipe
      </Link>

      {/* Profile header */}
      <div className="flex items-start gap-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <MemberAvatar name={member.name} avatar={member.avatar} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{member.name}</h1>
          {member.role && (
            <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {member.role}
            </p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
            <Mail className="h-4 w-4" />
            {member.email}
          </p>
          <div className="mt-3 flex gap-4">
            <Badge variant="secondary" className="text-xs">
              {tasks.length} tâche{tasks.length !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {issues.length} bug{issues.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs: Tasks + Issues */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tâches ({tasks.length})</TabsTrigger>
          <TabsTrigger value="issues">Bugs ({issues.length})</TabsTrigger>
        </TabsList>

        {/* Tasks tab */}
        <TabsContent value="tasks" className="mt-4">
          {tasks.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Aucune tâche"
              description={`${member.name} n'a pas encore de tâche assignée.`}
            />
          ) : (
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Tâche</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => {
                    const statusConfig = TASK_STATUS[task.status as TaskStatusKey];
                    const priorityConfig = TASK_PRIORITY[task.priority as TaskPriorityKey];
                    return (
                      <TableRow key={task.id} className="border-zinc-800">
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>
                          {task.project ? (
                            <Link
                              href={`/projects/${task.project.id}`}
                              className="text-sm hover:underline text-zinc-400"
                            >
                              {task.project.name}
                            </Link>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {statusConfig && <StatusBadge config={statusConfig} />}
                        </TableCell>
                        <TableCell>
                          {priorityConfig && (
                            <PriorityDot config={priorityConfig} showLabel />
                          )}
                        </TableCell>
                        <TableCell>
                          {task.category ? (
                            <Badge variant="outline" className="text-xs">
                              {task.category.emoji} {task.category.name}
                            </Badge>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Issues tab */}
        <TabsContent value="issues" className="mt-4">
          {issues.length === 0 ? (
            <EmptyState
              icon="🐛"
              title="Aucun bug"
              description={`${member.name} n'a pas encore de bug assigné.`}
            />
          ) : (
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Bug</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => {
                    const statusConfig = ISSUE_STATUS[issue.status as IssueStatusKey];
                    const priorityConfig = ISSUE_PRIORITY[issue.priority as IssuePriorityKey];
                    return (
                      <TableRow key={issue.id} className="border-zinc-800">
                        <TableCell className="font-medium">
                          {issue.title}
                        </TableCell>
                        <TableCell>
                          {issue.project ? (
                            <Link
                              href={`/projects/${issue.project.id}`}
                              className="text-sm hover:underline text-zinc-400"
                            >
                              {issue.project.name}
                            </Link>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {statusConfig && <StatusBadge config={statusConfig} />}
                        </TableCell>
                        <TableCell>
                          {priorityConfig && (
                            <PriorityDot config={priorityConfig} showLabel />
                          )}
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
