export const dynamic = "force-dynamic";

import { getTasks } from "@/app/actions/tasks";
import { getCategories } from "@/app/actions/categories";
import { getTeamMembers } from "@/app/actions/team";
import { getProjects } from "@/app/actions/projects";
import { TASK_PRIORITY, type TaskPriorityKey, type TaskStatusKey } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { TaskFormDialog } from "@/components/forms/task-form";
import { TaskStatusToggle } from "@/components/task-status-toggle";
import { PriorityDot } from "@/components/priority-dot";
import { MemberAvatar } from "@/components/member-avatar";
import { ProjectContext } from "@/components/project-context";
import { DeleteTaskButton } from "@/components/delete-task-button";

export default async function TasksPage() {
  let tasks: Awaited<ReturnType<typeof getTasks>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let members: Awaited<ReturnType<typeof getTeamMembers>> = [];
  let projects: Awaited<ReturnType<typeof getProjects>> = [];

  try {
    [tasks, categories, members, projects] = await Promise.all([
      getTasks(),
      getCategories(),
      getTeamMembers(),
      getProjects(),
    ]);
  } catch {
    // DB not connected
  }

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

  // Group tasks by category
  const tasksByCategory = categories.map((cat) => ({
    category: cat,
    tasks: tasks.filter((t) => t.categoryId === cat.id),
  }));

  // Tasks without a matching category (shouldn't happen but safe)
  const categoryIds = new Set(categories.map((c) => c.id));
  const uncategorized = tasks.filter((t) => !categoryIds.has(t.categoryId));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Toutes les tâches"
        description="Organisées par catégorie"
      >
        <TaskFormDialog
          categories={categoryOptions}
          members={memberOptions}
          projects={projectOptions}
        />
      </PageHeader>

      {tasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Aucune tâche"
          description="Créez votre première tâche pour organiser le travail de l'équipe."
        >
          <TaskFormDialog
            categories={categoryOptions}
            members={memberOptions}
            projects={projectOptions}
          />
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {tasksByCategory
            .filter((group) => group.tasks.length > 0)
            .map((group) => (
              <TaskGroup
                key={group.category.id}
                emoji={group.category.emoji}
                name={group.category.name}
                color={group.category.color}
                tasks={group.tasks}
              />
            ))}

          {uncategorized.length > 0 && (
            <TaskGroup
              emoji="❓"
              name="Sans catégorie"
              color="gray"
              tasks={uncategorized}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Task Group Component ──────────────────────────────────

type TaskWithRelations = Awaited<ReturnType<typeof getTasks>>[number];

function TaskGroup({
  emoji,
  name,
  color,
  tasks,
}: {
  emoji: string;
  name: string;
  color: string;
  tasks: TaskWithRelations[];
}) {
  const colorAccents: Record<string, string> = {
    green: "border-emerald-800/50",
    blue: "border-blue-800/50",
    violet: "border-violet-800/50",
    orange: "border-orange-800/50",
    gray: "border-zinc-700/50",
    red: "border-red-800/50",
    yellow: "border-yellow-800/50",
  };

  return (
    <div>
      <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>{emoji}</span>
        {name}
        <span className="text-zinc-600">({tasks.length})</span>
      </h2>
      <div
        className={`rounded-lg border ${colorAccents[color] ?? colorAccents.gray} divide-y divide-zinc-800/50`}
      >
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: TaskWithRelations }) {
  const priorityConfig = TASK_PRIORITY[task.priority as TaskPriorityKey];

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-900/50 transition-colors">
      <TaskStatusToggle
        taskId={task.id}
        status={task.status as TaskStatusKey}
      />

      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {task.title}
      </span>

      <ProjectContext project={task.project} />

      {task.assignee && (
        <MemberAvatar name={task.assignee.name} avatar={task.assignee.avatar} />
      )}

      <PriorityDot config={priorityConfig} />

      {task.dueDate && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {new Date(task.dueDate).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      )}

      <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
    </div>
  );
}
