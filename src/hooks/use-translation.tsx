"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type TranslationContextType = {
  translate: (text: string) => Promise<string>;
  currentLanguage: string;
  setAppLanguage: (language: string) => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");

  const translate = useCallback(
    async (text: string): Promise<string> => {
      if (currentLanguage === "en") return text;

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            targetLanguage: currentLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error("Translation failed");
        }

        const data = await response.json();
        return data.translatedText;
      } catch (error) {
        console.error("Translation error:", error);
        return text; // Fallback to original text
      }
    },
    [currentLanguage]
  );

  const setAppLanguage = useCallback((language: string) => {
    setCurrentLanguage(language);
    document.documentElement.lang = language;
  }, []);

  return (
    <TranslationContext.Provider
      value={{ translate, currentLanguage, setAppLanguage }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
