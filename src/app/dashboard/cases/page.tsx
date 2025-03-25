import { DashboardHeader } from "@/components/dashboard-header";
import { PreviousCases } from "@/components/previous-cases";

export default function CasesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Cases</h1>
          <p className="text-muted-foreground mb-8">
            View and continue with your previously submitted legal cases.
          </p>
          <PreviousCases />
        </div>
      </main>
    </div>
  );
}
