import { CaseUploadForm } from "@/components/case-upload-form";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Upload Your Case</h1>
          <p className="text-muted-foreground mb-8">
            Provide details about your legal issue below. Our AI will analyze
            your case and provide personalized guidance.
          </p>
          <CaseUploadForm />
        </div>
      </main>
    </div>
  );
}
