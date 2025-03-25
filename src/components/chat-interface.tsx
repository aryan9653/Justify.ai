"use client";

import type React from "react";

import { GuidancePanel } from "@/components/guidance-panel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";
import { useCaseStore } from "@/store/case-store";
import { useChatStore } from "@/store/chat-store";
import { useGuidanceStore } from "@/store/guidance-store";
import { useLanguageStore } from "@/store/language-store";
import { Loader2, Mic, MicOff, Scale, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function ChatInterface({ caseId }: { caseId: string }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [translatedLabels, setTranslatedLabels] = useState<
    Record<string, string>
  >({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { messages, addMessage } = useChatStore();
  const { cases } = useCaseStore();
  const { updateGuidance } = useGuidanceStore();
  const { language } = useLanguageStore();
  const { translate, currentLanguage } = useTranslation();
  const isMobile = useMobile();

  const currentCase = cases.find((c) => c.id === caseId);

  // Translate UI labels when language changes
  useEffect(() => {
    async function translateLabels() {
      if (currentLanguage === "en") {
        setTranslatedLabels({
          legalAssistant: "Legal Assistant",
          viewGuidance: "View Guidance",
          typeMessage: "Type your message...",
          thinking: "Thinking...",
          recording: "Recording...",
        });
        return;
      }

      const labels = {
        legalAssistant: await translate("Legal Assistant"),
        viewGuidance: await translate("View Guidance"),
        typeMessage: await translate("Type your message..."),
        thinking: await translate("Thinking..."),
        recording: await translate("Recording..."),
      };

      setTranslatedLabels(labels);
    }

    translateLabels();
  }, [currentLanguage, translate]);

  useEffect(() => {
    // Initialize chat with AI greeting when first loaded
    if (messages.length === 0 && currentCase) {
      setIsLoading(true);

      // Call the API to get the initial greeting
      fetchAIResponse("", true);
    }
  }, [caseId, messages.length, currentCase]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast.info(await translate("Recording started"), {
        description: await translate("Speak clearly to record your message."),
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error(await translate("Microphone access denied"), {
        description: await translate(
          "Please allow microphone access to record audio."
        ),
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all audio tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      toast.info(translatedLabels.stopRecording || "Recording stopped", {
        description: translatedLabels.processing || "Processing your audio...",
      });
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("language", currentLanguage);

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Speech-to-text processing failed");
      }

      const data = await response.json();

      // Add user message with transcribed text
      addMessage({
        id: `msg_${Date.now()}`,
        caseId,
        content: data.text,
        sender: "user",
        timestamp: new Date().toISOString(),
      });

      // Get AI response
      await fetchAIResponse(data.text);
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error(await translate("Processing failed"), {
        description: await translate("Failed to transcribe audio."),
      });
      setIsLoading(false);
    }
  };

  const fetchAIResponse = async (userMessage: string, isInitial = false) => {
    try {
      // If this is the initial message, create a greeting
      if (isInitial) {
        const initialMessage = `Hello! I'm your AI legal assistant. I've reviewed your case about "${currentCase?.title}". I'm here to help guide you through this process. What specific questions do you have about your ${currentCase?.caseType} case?`;

        // Add AI message
        addMessage({
          id: `msg_${Date.now()}`,
          caseId,
          content: initialMessage,
          sender: "ai",
          timestamp: new Date().toISOString(),
        });

        // Add initial guidance steps
        updateGuidance(caseId, [
          {
            id: "step_1",
            title: "Understand Your Rights",
            description:
              "First, let's make sure you understand your basic rights in this situation.",
            completed: false,
          },
          {
            id: "step_2",
            title: "Gather Documentation",
            description: "Collect all relevant documents related to your case.",
            completed: false,
          },
          {
            id: "step_3",
            title: "Review Legal Options",
            description: "We'll explore the legal options available to you.",
            completed: false,
          },
        ]);

        setIsLoading(false);
        return;
      }

      // Prepare messages for the API
      const chatMessages = messages
        .filter((msg) => msg.caseId === caseId)
        .map((msg) => ({
          sender: msg.sender,
          content: msg.content,
        }));

      // Add the new user message if not already in the list
      if (
        userMessage &&
        !chatMessages.some(
          (msg) => msg.sender === "user" && msg.content === userMessage
        )
      ) {
        chatMessages.push({
          sender: "user",
          content: userMessage,
        });
      }

      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatMessages,
          caseDetails: currentCase,
          language: currentLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      // Add AI message
      addMessage({
        id: `msg_${Date.now()}`,
        caseId,
        content: data.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
      });

      // Update guidance steps based on conversation progress
      // In a real implementation, this would be determined by the AI
      const existingSteps =
        useGuidanceStore.getState().guidanceSteps[caseId] || [];
      const updatedSteps = [...existingSteps];

      // Mark first step as completed after first exchange
      if (chatMessages.filter((msg) => msg.sender === "user").length === 1) {
        updatedSteps[0] = { ...updatedSteps[0], completed: true };
      }

      // Add a new step after a few exchanges
      if (
        chatMessages.filter((msg) => msg.sender === "user").length === 3 &&
        updatedSteps.length < 4
      ) {
        updatedSteps.push({
          id: `step_${updatedSteps.length + 1}`,
          title: "Next Steps",
          description:
            "Based on our conversation, here are your recommended next actions.",
          completed: false,
        });
      }

      updateGuidance(caseId, updatedSteps);
    } catch (error) {
      console.error("Error in AI response:", error);

      // Add error message
      addMessage({
        id: `msg_${Date.now()}`,
        caseId,
        content: await translate(
          "I'm sorry, there was an error processing your request. Please try again."
        ),
        sender: "ai",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Add user message
    addMessage({
      id: `msg_${Date.now()}`,
      caseId,
      content: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    });

    setInput("");
    setIsLoading(true);

    await fetchAIResponse(input);
  };

  const filteredMessages = messages.filter((msg) => msg.caseId === caseId);

  return (
    <div className="flex flex-col h-full border rounded-none md:rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">
            {translatedLabels.legalAssistant || "Legal Assistant"}
          </h2>
        </div>
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                {translatedLabels.viewGuidance || "View Guidance"}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <GuidancePanel caseId={caseId} />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  className={
                    message.sender === "user" ? "bg-primary" : "bg-muted"
                  }
                >
                  {message.sender === "user" ? (
                    <User className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Scale className="h-5 w-5 text-primary" />
                  )}
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="bg-muted">
                  <Scale className="h-5 w-5 text-primary" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-4 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p className="text-sm">
                    {translatedLabels.thinking || "Thinking..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isRecording && (
            <div className="flex justify-end">
              <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                <Avatar className="bg-destructive">
                  <Mic className="h-5 w-5 text-destructive-foreground" />
                  <AvatarFallback>Rec</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-4 bg-destructive/10 text-destructive flex items-center animate-pulse">
                  <p className="text-sm">
                    {translatedLabels.recording || "Recording..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder={translatedLabels.typeMessage || "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isRecording}
          />
          {!isRecording ? (
            <>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={startRecording}
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={stopRecording}
              className="animate-pulse"
            >
              <MicOff className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
