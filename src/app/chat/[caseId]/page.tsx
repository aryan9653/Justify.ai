import { ChatInterface } from "@/components/chat-interface";
import { DashboardHeader } from "@/components/dashboard-header";
import { GuidancePanel } from "@/components/guidance-panel";

export default function ChatPage({ params }: { params: { caseId: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-0 md:px-6 py-0 md:py-6 flex flex-col md:flex-row">
        <div className="flex-1 md:pr-4 h-[calc(100vh-64px)] md:h-auto">
          <ChatInterface caseId={params.caseId} />
        </div>
        <div className="hidden md:block w-full md:w-96 md:border-l md:pl-4">
          <GuidancePanel caseId={params.caseId} />
        </div>
      </main>
    </div>
  );
}
