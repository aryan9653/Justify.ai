import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing text or target language" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Send the text to a translation service (Google Cloud Translation, DeepL, etc.)
    // 2. Return the translated text

    // For now, we'll simulate translation for common phrases
    const translatedText = await simulateTranslation(text, targetLanguage);

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Error in translation route:", error);
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}

// Simulate translation
async function simulateTranslation(
  text: string,
  targetLanguage: string
): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Common phrases translations
  const translations: Record<string, Record<string, string>> = {
    // UI elements
    "Case Title": {
      hi: "केस का शीर्षक",
      mr: "केस शीर्षक",
      gu: "કેસ શીર્ષક",
      bn: "কেস শিরোনাম",
      ta: "வழக்கு தலைப்பு",
    },
    "Case Type": {
      hi: "केस का प्रकार",
      mr: "केस प्रकार",
      gu: "કેસ પ્રકાર",
      bn: "কেস প্রকার",
      ta: "வழக்கு வகை",
    },
    "Case Description": {
      hi: "केस का विवरण",
      mr: "केस वर्णन",
      gu: "કેસ વર્ણન",
      bn: "কেস বিবরণ",
      ta: "வழக்கு விளக்கம்",
    },
    "Upload Documents": {
      hi: "दस्तावेज़ अपलोड करें",
      mr: "दस्तऐवज अपलोड करा",
      gu: "દસ્તાવેજો અપલોડ કરો",
      bn: "নথি আপলোড করুন",
      ta: "ஆவணங்களை பதிவேற்றவும்",
    },
    "Submit Case": {
      hi: "केस जमा करें",
      mr: "केस सबमिट करा",
      gu: "કેસ સબમિટ કરો",
      bn: "কেস জমা দিন",
      ta: "வழக்கைச் சமர்ப்பிக்கவும்",
    },
    "Processing...": {
      hi: "प्रोसेसिंग...",
      mr: "प्रक्रिया सुरू आहे...",
      gu: "પ્રક્રિયા ચાલુ છે...",
      bn: "প্রক্রিয়াকরণ হচ্ছে...",
      ta: "செயலாக்கம்...",
    },

    // Chat messages
    "Hello! I'm your AI legal assistant.": {
      hi: "नमस्ते! मैं आपका AI कानूनी सहायक हूँ।",
      mr: "नमस्कार! मी तुमचा AI कायदेशीर सहाय्यक आहे.",
      gu: "નમસ્તે! હું તમારો AI કાનૂની સહાયક છું.",
      bn: "হ্যালো! আমি আপনার AI আইনি সহকারী।",
      ta: "வணக்கம்! நான் உங்கள் AI சட்ட உதவியாளர்.",
    },
    "What specific questions do you have?": {
      hi: "आपके पास क्या विशिष्ट प्रश्न हैं?",
      mr: "तुमच्याकडे कोणते विशिष्ट प्रश्न आहेत?",
      gu: "તમારી પાસે કયા ચોક્કસ પ્રશ્નો છે?",
      bn: "আপনার কি নির্দিষ্ট প্রশ্ন আছে?",
      ta: "உங்களிடம் என்ன குறிப்பிட்ட கேள்விகள் உள்ளன?",
    },
  };

  // Check if we have a direct translation for this text
  if (translations[text] && translations[text][targetLanguage]) {
    return translations[text][targetLanguage];
  }

  // If no direct translation, return the original text
  // In a real implementation, you would call a translation API here
  return text;
}
