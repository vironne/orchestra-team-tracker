export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function BugsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bugs"
        description="Vue globale de tous les bugs — Phase 2"
      />
      <EmptyState
        icon="🐛"
        title="Bientôt disponible"
        description="La gestion des bugs sera disponible en Phase 2. Les bugs seront toujours rattachés à un projet."
      />
    </div>
  );
}
