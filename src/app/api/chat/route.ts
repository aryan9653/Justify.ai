import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages, caseDetails, language = "en" } = await request.json();

    if (!messages || !messages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Get related legal cases if available
    const relatedCasesInfo =
      caseDetails.relatedCases && caseDetails.relatedCases.length > 0
        ? `Related legal cases:\n${caseDetails.relatedCases
            .map(
              (c: any) =>
                `- ${c.title} (${c.citation}): ${
                  c.summary || "No summary available"
                }`
            )
            .join("\n")}`
        : "No specific legal cases available for reference.";

    // Prepare the prompt with case context, related cases, and chat history
    const prompt = `
      Case Details:
      Title: ${caseDetails.title || "Not specified"}
      Type: ${caseDetails.caseType || "Not specified"}
      Description: ${caseDetails.description || "Not provided"}
      
      ${relatedCasesInfo}
      
      Chat History:
      ${messages
        .map(
          (msg: any) =>
            `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n")}
      
      User: ${messages[messages.length - 1].content}
      Assistant:
    `;

    // Determine the system prompt based on language
    let systemPrompt =
      "You are a helpful AI legal assistant designed to provide guidance on common legal issues. Focus on providing practical, step-by-step guidance for low-income individuals who cannot afford traditional legal services. Provide information about legal processes, document requirements, and potential resources. Always clarify that you are not providing legal advice and recommend consulting with a legal professional when appropriate.";

    if (language !== "en") {
      systemPrompt += ` Please respond in ${getLanguageName(language)}.`;
    }

    // Generate response using Gemini
    const genAI = new GoogleGenerativeAI(
      "AIzaSyDXBqUYp9Lto2BEzHHMRU2LYSh8lHtk_VQ"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(systemPrompt + prompt);

    console.log(result);
    return NextResponse.json({ response: result.response.text });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

// Helper function to get language name from code
function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    hi: "Hindi",
    mr: "Marathi",
    gu: "Gujarati",
    bn: "Bengali",
    ta: "Tamil",
  };

  return languages[code] || code;
}
