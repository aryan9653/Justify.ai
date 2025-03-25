"use client";

import { useCaseStore } from "@/store/case-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language-store";

export function PreviousCases() {
  const { cases } = useCaseStore();
  const { language } = useLanguageStore();

  // Sort cases by creation date (newest first)
  const sortedCases = [...cases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Translations
  const translations = {
    en: {
      noCases: "You haven't submitted any cases yet.",
      createCase: "Create a New Case",
      continueChat: "Continue Chat",
      status: {
        new: "New",
        "in-progress": "In Progress",
        resolved: "Resolved",
      },
      created: "Created",
      caseTypes: {
        eviction: "Eviction",
        "wage-theft": "Wage Theft",
        "family-law": "Family Law",
        "consumer-rights": "Consumer Rights",
        other: "Other",
      },
    },
    hi: {
      noCases: "आपने अभी तक कोई केस जमा नहीं किया है।",
      createCase: "नया केस बनाएं",
      continueChat: "चैट जारी रखें",
      status: {
        new: "नया",
        "in-progress": "प्रगति पर",
        resolved: "हल किया गया",
      },
      created: "बनाया गया",
      caseTypes: {
        eviction: "बेदखली",
        "wage-theft": "वेतन चोरी",
        "family-law": "पारिवारिक कानून",
        "consumer-rights": "उपभोक्ता अधिकार",
        other: "अन्य",
      },
    },
    mr: {
      noCases: "आपण अद्याप कोणताही केस सबमिट केलेला नाही.",
      createCase: "नवीन केस तयार करा",
      continueChat: "चॅट सुरू ठेवा",
      status: {
        new: "नवीन",
        "in-progress": "प्रगतीपथावर",
        resolved: "निराकरण झाले",
      },
      created: "तयार केले",
      caseTypes: {
        eviction: "निष्कासन",
        "wage-theft": "वेतन चोरी",
        "family-law": "कौटुंबिक कायदा",
        "consumer-rights": "ग्राहक अधिकार",
        other: "इतर",
      },
    },
  };

  // Default to English if translation not available
  const t =
    translations[language as keyof typeof translations] || translations.en;

  if (sortedCases.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{t.noCases}</h3>
        <Link href="/dashboard">
          <Button className="mt-4">{t.createCase}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedCases.map((caseItem) => (
        <Card key={caseItem.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{caseItem.title}</CardTitle>
                <CardDescription>
                  {t.caseTypes[caseItem.caseType as keyof typeof t.caseTypes] ||
                    caseItem.caseType}
                </CardDescription>
              </div>
              <Badge
                variant={
                  caseItem.status === "new"
                    ? "default"
                    : caseItem.status === "in-progress"
                    ? "secondary"
                    : "outline"
                }
              >
                {t.status[caseItem.status as keyof typeof t.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {caseItem.description}
            </p>
            <div className="flex items-center mt-4 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {t.created}: {new Date(caseItem.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/chat/${caseItem.id}`} className="w-full">
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                {t.continueChat}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
