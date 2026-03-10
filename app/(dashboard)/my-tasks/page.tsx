export const dynamic = "force-dynamic";

import { getTasks } from "@/app/actions/tasks";
import { getCategories } from "@/app/actions/categories";
import { getTeamMembers } from "@/app/actions/team";
import { getProjects } from "@/app/actions/projects";
import {
  TASK_PRIORITY,
  type TaskPriorityKey,
  type TaskStatusKey,
} from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { TaskFormDialog } from "@/components/forms/task-form";
import { TaskStatusToggle } from "@/components/task-status-toggle";
import { PriorityDot } from "@/components/priority-dot";
import { ProjectContext } from "@/components/project-context";
import { CategoryBadge } from "@/components/category-badge";
import { DeleteTaskButton } from "@/components/delete-task-button";
import { EditTaskDialog } from "@/components/forms/edit-task-form";
import { MyTasksOwnerSelect } from "@/components/my-tasks-owner-select";

type Props = {
  searchParams: Promise<{ user?: string }>;
};

export default async function MyTasksPage({ searchParams }: Props) {
  const { user: selectedUserId } = await searchParams;

  let allTasks: Awaited<ReturnType<typeof getTasks>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let members: Awaited<ReturnType<typeof getTeamMembers>> = [];
  let projects: Awaited<ReturnType<typeof getProjects>> = [];

  try {
    [allTasks, categories, members, projects] = await Promise.all([
      getTasks(),
      getCategories(),
      getTeamMembers(),
      getProjects(),
    ]);
  } catch {
    // DB not connected
  }

  // Use selected user from URL, or fallback to first member
  const currentUser = selectedUserId
    ? members.find((m) => m.id === selectedUserId) ?? members[0] ?? null
    : members[0] ?? null;

  const myTasks = currentUser
    ? allTasks.filter((t) => t.assigneeId === currentUser.id)
    : [];

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
  }));
  const memberOptions = members.map((m) => ({ id: m.id, name: m.name }));
  const projectOptions = projects.map((p) => ({
    id: p.id,
    name: p.name,
    clientName: p.client.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          currentUser ? `Mes tâches — ${currentUser.name}` : "Mes tâches"
        }
        description="Ce que je dois faire aujourd'hui"
      >
        <div className="flex items-center gap-3">
          <MyTasksOwnerSelect
            members={members.map((m) => ({
              id: m.id,
              name: m.name,
              avatar: m.avatar,
            }))}
            currentId={currentUser?.id ?? null}
          />
          <TaskFormDialog
            categories={categoryOptions}
            members={memberOptions}
            projects={projectOptions}
          />
        </div>
      </PageHeader>

      {!currentUser ? (
        <EmptyState
          icon="👤"
          title="Aucun membre d'équipe"
          description="Ajoutez des membres dans Réglages → Équipe pour voir vos tâches."
        />
      ) : myTasks.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="Aucune tâche assignée"
          description={`${currentUser.name} n'a aucune tâche en cours.`}
        />
      ) : (
        <>
          {/* My Tasks */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              📋 MES TÂCHES
              <span className="text-zinc-500">({myTasks.length})</span>
            </h2>
            <div className="rounded-lg border border-zinc-800 divide-y divide-zinc-800/50">
              {myTasks.map((task) => {
                const priorityConfig =
                  TASK_PRIORITY[task.priority as TaskPriorityKey];
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-900/50 transition-colors"
                  >
                    <TaskStatusToggle
                      taskId={task.id}
                      status={task.status as TaskStatusKey}
                    />

                    <PriorityDot config={priorityConfig} />

                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {task.title}
                    </span>

                    <ProjectContext project={task.project} />

                    {task.category && (
                      <CategoryBadge
                        emoji={task.category.emoji}
                        name={task.category.name}
                        color={task.category.color}
                      />
                    )}

                    <EditTaskDialog
                      task={{
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        categoryId: task.categoryId,
                        assigneeId: task.assigneeId,
                        projectId: task.projectId,
                        dueDate: task.dueDate,
                      }}
                      categories={categoryOptions}
                      members={memberOptions}
                      projects={projectOptions}
                    />

                    <DeleteTaskButton
                      taskId={task.id}
                      taskTitle={task.title}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Bugs */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              🐛 MES BUGS ASSIGNÉS
              <span className="text-zinc-500">(0)</span>
            </h2>
            <EmptyState
              icon="🐛"
              title="Pas de bugs assignés"
              description="La gestion des bugs sera disponible en Phase 2."
            />
          </div>
        </>
      )}
    </div>
  );
}
