"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { AlertCircle, CloudUpload, FileText, Loader2 } from "lucide-react";

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
  // Use a separate state variable for files
  const [files, setFiles] = useState<File[]>([]);

  // Form state for title, case type, description, etc.
  const [formData, setFormData] = useState({
    title: "",
    caseType: "",
    description: "",
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
        headers: { "Content-Type": "application/json" },
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

  // Handle file selection from file dialog
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      toast.info(translate("Files selected"), {
        description: translate("Your files are ready for upload."),
      });
    }
  };

  // Handle drag & drop file events
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
      e.dataTransfer.clearData();
      toast.info(translate("Files dropped"), {
        description: translate("Your files have been added."),
      });
    }
  };

  // Clear all selected files
  const clearFiles = () => {
    setFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare case data with collected information
      const caseData = {
        title: formData.title,
        caseType: formData.caseType,
        description: formData.description,
        extractedText: extractedText,
        relatedCases: relatedCases,
        language: currentLanguage,
      };

      // Create the case first
      const response = await fetch("/api/cases/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseData),
      });

      if (!response.ok) {
        throw new Error("Failed to create case");
      }

      const data = await response.json();
      const caseId = data.caseId;

      // Upload files if any were added
      if (files.length > 0) {
        const documentsFormData = new FormData();
        files.forEach((file) => {
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

      // Add the case to the store
      addCase({
        id: caseId,
        title: formData.title,
        caseType: formData.caseType,
        description: formData.description,
        createdAt: new Date().toISOString(),
        status: "new",
      });

      // Navigate to the chat page
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
        {/* Title Input */}
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

        {/* Case Type Select */}
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

        {/* Description Textarea */}
        <div className="space-y-2">
          <Label htmlFor="description">
            {translatedLabels.description || "Case Description"}
          </Label>
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
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <Label className="text-white">Media Files</Label>
          <div
            className="w-full p-6 border-2 border-dashed border-[#333333] rounded-lg bg-[#0A0A0A] flex flex-col items-center justify-center cursor-pointer hover:bg-[#1A1A1A] transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*, application/pdf"
              className="hidden"
              id="fileUpload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileUpload"
              className="text-center text-[#A0A0A0] cursor-pointer"
            >
              <CloudUpload className="w-10 h-10 mx-auto mb-3 text-white" />
              <p>
                Drag & drop files here or{" "}
                <span className="text-white underline">click to upload</span>
              </p>
            </label>
          </div>
        </div>

        {/* File Previews */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-white">
                Selected Files ({files.length})
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFiles}
                className=" border-white hover:bg-white hover:cursor-pointer"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 max-h-[200px] overflow-y-auto p-2">
              {files.map((file, index) => {
                const isImage = file.type.startsWith("image/");
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-[#0A0A0A] p-2 rounded-lg border border-[#333333]"
                  >
                    {isImage ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 flex flex-col items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                        <p className="text-xs text-center text-white mt-1 truncate max-w-[80px]">
                          {file.name}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Cases Section */}
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
