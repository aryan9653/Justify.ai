"use client";

import type React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";
import { useCaseStore } from "@/store/case-store";
import { useLanguageStore } from "@/store/language-store";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function CaseUploadForm() {
  const router = useRouter();
  const { addCase } = useCaseStore();
  const { language } = useLanguageStore();
  const { translate, currentLanguage } = useTranslation();
  const isMobile = useMobile();

  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [relatedCases, setRelatedCases] = useState<any[]>([]);
  const [translatedLabels, setTranslatedLabels] = useState<
    Record<string, string>
  >({});

  // Create a ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    caseType: "",
    description: "",
    documents: null as File[] | null,
  });

  // Translate UI labels when language changes
  useEffect(() => {
    async function translateLabels() {
      if (currentLanguage === "en") {
        setTranslatedLabels({
          caseTitle: "Case Title",
          caseType: "Case Type",
          description: "Case Description",
          documents: "Upload Documents",
          submit: "Submit Case",
          processing: "Processing...",
          uploadInstructions:
            "Upload any relevant documents (notices, contracts, letters, etc.)",
          extractedText: "Extracted Text",
          titlePlaceholder: "E.g., Eviction Notice, Wage Dispute",
          descriptionPlaceholder:
            "Please describe your legal issue in detail. Include relevant dates, names, and any actions already taken.",
          relatedCases: "Related Legal Cases",
          noRelatedCases:
            "No related cases found yet. Submit your case details for analysis.",
        });
        return;
      }

      const labels = {
        caseTitle: await translate("Case Title"),
        caseType: await translate("Case Type"),
        description: await translate("Case Description"),
        documents: await translate("Upload Documents"),
        submit: await translate("Submit Case"),
        processing: await translate("Processing..."),
        uploadInstructions: await translate(
          "Upload any relevant documents (notices, contracts, letters, etc.)"
        ),
        extractedText: await translate("Extracted Text"),
        titlePlaceholder: await translate(
          "E.g., Eviction Notice, Wage Dispute"
        ),
        descriptionPlaceholder: await translate(
          "Please describe your legal issue in detail. Include relevant dates, names, and any actions already taken."
        ),
        relatedCases: await translate("Related Legal Cases"),
        noRelatedCases: await translate(
          "No related cases found yet. Submit your case details for analysis."
        ),
      };

      setTranslatedLabels(labels);
    }

    translateLabels();
  }, [currentLanguage, translate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If description is updated and has more than 20 characters, search for related cases
    if (name === "description" && value.length > 20) {
      searchRelatedCases(value);
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, caseType: value }));
  };

  const searchRelatedCases = async (query: string) => {
    try {
      const response = await fetch("/api/indian-kanoon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch related cases");
      }

      const data = await response.json();
      setRelatedCases(data.cases || []);
    } catch (error) {
      console.error("Error searching related cases:", error);
    }
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, documents: files }));
      toast.info(translate("Files selected"), {
        description: translate("Your documents are ready for upload."),
      });
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare case data with all collected information
      const caseData = {
        title: formData.title,
        caseType: formData.caseType,
        description: formData.description,
        extractedText: extractedText,
        relatedCases: relatedCases,
        language: currentLanguage,
      };

      // Submit case data to API
      const response = await fetch("/api/cases/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseData),
      });

      if (!response.ok) {
        throw new Error("Failed to create case");
      }

      const data = await response.json();
      const caseId = data.caseId;

      // Upload documents if any
      if (formData.documents && formData.documents.length > 0) {
        const documentsFormData = new FormData();
        formData.documents.forEach((file) => {
          documentsFormData.append("documents", file);
        });
        documentsFormData.append("caseId", caseId);

        const uploadResponse = await fetch("/api/cases/upload-documents", {
          method: "POST",
          body: documentsFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload documents");
        }
      }

      // Add case to Zustand store
      addCase({
        id: caseId,
        title: formData.title,
        caseType: formData.caseType,
        description: formData.description,
        createdAt: new Date().toISOString(),
        status: "new",
      });

      // Navigate to chat page
      router.push(`/chat/${caseId}`);
    } catch (error) {
      console.error("Error submitting case:", error);
      toast.error(await translate("Submission failed"), {
        description: await translate(
          "Failed to submit your case. Please try again."
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            {translatedLabels.caseTitle || "Case Title"}
          </Label>
          <Input
            id="title"
            name="title"
            placeholder={
              translatedLabels.titlePlaceholder ||
              "E.g., Eviction Notice, Wage Dispute"
            }
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="caseType">
            {translatedLabels.caseType || "Case Type"}
          </Label>
          <Select
            value={formData.caseType}
            onValueChange={handleSelectChange}
            required
          >
            <SelectTrigger id="caseType">
              <SelectValue
                placeholder={
                  translatedLabels.caseType
                    ? `${translatedLabels.caseType}...`
                    : "Select case type..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eviction">Eviction</SelectItem>
              <SelectItem value="wage-theft">Wage Theft</SelectItem>
              <SelectItem value="family-law">Family Law</SelectItem>
              <SelectItem value="consumer-rights">Consumer Rights</SelectItem>
              <SelectItem value="property-dispute">Property Dispute</SelectItem>
              <SelectItem value="criminal-case">Criminal Case</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            {translatedLabels.description || "Case Description"}
          </Label>
          <div className="flex flex-col gap-4">
            <Textarea
              id="description"
              name="description"
              placeholder={
                translatedLabels.descriptionPlaceholder ||
                "Please describe your legal issue in detail..."
              }
              rows={6}
              value={formData.description}
              onChange={handleChange}
              required
              className="resize-none"
            />

            <div className="flex flex-wrap gap-2">
              {/* File upload button */}
              <Button
                type="button"
                onClick={triggerFileInput}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
                {translatedLabels.documents || "Upload Documents"}
              </Button>
              {/* Hidden file input */}
              <Input
                id="documents"
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>

            {/* Document list if uploaded */}
            {formData.documents && formData.documents.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">
                  {translate("Selected files")}:
                </p>
                <ul className="text-sm space-y-1">
                  {formData.documents.map((file, index) => (
                    <li key={index} className="text-muted-foreground">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related cases section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">
            {translatedLabels.relatedCases || "Related Legal Cases"}
          </h3>

          {relatedCases.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {relatedCases.map((caseItem, index) => (
                <div key={index} className="p-2 text-sm border-b last:border-0">
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {caseItem.citation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {translatedLabels.noRelatedCases ||
                  "No related cases found yet"}
              </AlertTitle>
              <AlertDescription>
                {translatedLabels.noRelatedCases ||
                  "No related cases found yet. Submit your case details for analysis."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {translatedLabels.processing || "Processing..."}
            </>
          ) : (
            translatedLabels.submit || "Submit Case"
          )}
        </Button>
      </form>
    </Card>
  );
}
