export const dynamic = "force-dynamic";

import { getTeamMembers } from "@/app/actions/team";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { TeamMemberFormDialog } from "@/components/forms/team-member-form";
import { TeamMemberCard } from "@/components/team-member-card";

export default async function TeamPage() {
  let members: Awaited<ReturnType<typeof getTeamMembers>> = [];

  try {
    members = await getTeamMembers();
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Équipe"
        description="Les membres de l'équipe Orchestra"
      >
        <TeamMemberFormDialog />
      </PageHeader>

      {members.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Aucun membre"
          description="Ajoutez les membres de votre équipe pour commencer l'assignation des tâches."
        >
          <TeamMemberFormDialog />
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
