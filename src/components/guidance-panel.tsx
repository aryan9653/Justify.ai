"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCaseStore } from "@/store/case-store";
import { useGuidanceStore } from "@/store/guidance-store";
import { useLanguageStore } from "@/store/language-store";
import { CheckCircle2, Circle, FileText, HelpCircle } from "lucide-react";

export function GuidancePanel({ caseId }: { caseId: string }) {
  const { guidanceSteps } = useGuidanceStore();
  const { cases } = useCaseStore();
  const { language } = useLanguageStore();

  const currentCase = cases.find((c) => c.id === caseId);
  const steps = guidanceSteps[caseId] || [];

  // Translations
  const translations = {
    en: {
      guidance: "Step-by-Step Guidance",
      followSteps: "Follow these steps for your",
      case: "case",
      noGuidance: "No guidance yet",
      startChatting:
        "Start chatting with the AI assistant to receive personalized guidance for your case.",
      resources: "Resources",
      legalAid: "Legal Aid Directory",
      templates: "Document Templates",
      procedures: "Court Procedures Guide",
      step: "Step",
    },
    hi: {
      guidance: "चरण-दर-चरण मार्गदर्शन",
      followSteps: "अपने केस के लिए इन चरणों का पालन करें",
      case: "केस",
      noGuidance: "अभी तक कोई मार्गदर्शन नहीं",
      startChatting:
        "अपने केस के लिए व्यक्तिगत मार्गदर्शन प्राप्त करने के लिए AI सहायक से चैट करना शुरू करें।",
      resources: "संसाधन",
      legalAid: "कानूनी सहायता निर्देशिका",
      templates: "दस्तावेज़ टेम्पलेट",
      procedures: "अदालती प्रक्रिया गाइड",
      step: "चरण",
    },
    mr: {
      guidance: "पायरी-पायरीने मार्गदर्शन",
      followSteps: "तुमच्या केससाठी या पायऱ्यांचे अनुसरण करा",
      case: "केस",
      noGuidance: "अद्याप कोणतेही मार्गदर्शन नाही",
      startChatting:
        "तुमच्या केससाठी वैयक्तिक मार्गदर्शन मिळवण्यासाठी AI सहाय्यकाशी चॅटिंग सुरू करा.",
      resources: "संसाधने",
      legalAid: "कायदेशीर मदत निर्देशिका",
      templates: "दस्तऐवज टेम्पलेट्स",
      procedures: "न्यायालयीन प्रक्रिया मार्गदर्शक",
      step: "पायरी",
    },
  };

  // Default to English if translation not available
  const t =
    translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">{t.guidance}</h2>
        <p className="text-sm text-muted-foreground">
          {t.followSteps} {currentCase?.caseType} {t.case}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {steps.length > 0 ? (
            steps.map((step, index) => (
              <Card
                key={step.id}
                className={
                  step.completed ? "border-primary/20 bg-primary/5" : ""
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {t.step} {index + 1}: {step.title}
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">{t.noGuidance}</h3>
              <p className="text-muted-foreground mb-4">{t.startChatting}</p>
            </div>
          )}

          {steps.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.resources}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      {t.legalAid}
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      {t.templates}
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      {t.procedures}
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
