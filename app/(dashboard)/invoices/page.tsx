export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Factures"
        description="Vue globale de toutes les factures — Phase 2"
      />
      <EmptyState
        icon="💰"
        title="Bientôt disponible"
        description="La gestion des factures sera disponible en Phase 2. Chaque facture sera liée à un projet."
      />
    </div>
  );
}
