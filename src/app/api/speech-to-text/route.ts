import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob;
    const language = (formData.get("language") as string) || "en";

    if (!audioBlob) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Save the audio file temporarily
    // 2. Send it to a speech-to-text service (Google Cloud Speech-to-Text, Whisper, etc.)
    // 3. Return the transcribed text

    // For now, we'll simulate transcription based on the language
    const transcribedText = await simulateTranscription(language);

    return NextResponse.json({ text: transcribedText });
  } catch (error) {
    console.error("Error in speech-to-text route:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}

// Simulate transcription based on language
async function simulateTranscription(language: string): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return different text based on language
  switch (language) {
    case "hi":
      return "मुझे पिछले हफ्ते मेरे मकान मालिक से बेदखली का नोटिस मिला। वे दावा करते हैं कि मैंने दो महीने का किराया नहीं दिया है, लेकिन मेरे पास रसीदें हैं जो दिखाती हैं कि मैंने समय पर भुगतान किया था। नोटिस में कहा गया है कि मुझे 15 अप्रैल तक जाना होगा। मुझे नहीं पता कि क्या करना है और मैं वकील का खर्च नहीं उठा सकता। क्या आप मुझे मेरे अधिकारों को समझने में मदद कर सकते हैं?";
    case "mr":
      return "मला गेल्या आठवड्यात माझ्या मालकाकडून निष्कासन नोटीस मिळाली. ते म्हणतात की मी दोन महिन्यांचे भाडे दिलेले नाही, पण माझ्याकडे पावत्या आहेत ज्या दर्शवतात की मी वेळेवर पैसे दिले. नोटीसमध्ये म्हटले आहे की मला 15 एप्रिलपर्यंत जावे लागेल. मला माहित नाही काय करावे आणि मी वकिलाचा खर्च करू शकत नाही. तुम्ही मला माझे अधिकार समजण्यास मदत करू शकता का?";
    case "gu":
      return "મને ગયા અઠવાડિયે મારા મકાનમાલિક તરફથી હકાલપટ્ટીની નોટિસ મળી. તેઓ દાવો કરે છે કે મેં બે મહિનાનું ભાડું ચૂકવ્યું નથી, પરંતુ મારી પાસે રસીદો છે જે બતાવે છે કે મેં સમયસર ચૂકવણી કરી હતી. નોટિસમાં કહેવામાં આવ્યું છે કે મારે 15 એપ્રિલ સુધીમાં જવું પડશે. મને ખબર નથી કે શું કરવું અને હું વકીલનો ખર્ચ ઉઠાવી શકતો નથી. શું તમે મને મારા અધિકારો સમજવામાં મદદ કરી શકો છો?";
    case "bn":
      return "আমি গত সপ্তাহে আমার বাড়িওয়ালার কাছ থেকে উচ্ছেদের নোটিশ পেয়েছি। তারা দাবি করে যে আমি দুই মাসের ভাড়া দেইনি, কিন্তু আমার কাছে রসিদ আছে যা দেখায় যে আমি সময়মতো অর্থ প্রদান করেছি। নোটিশে বলা হয়েছে যে আমাকে ১৫ এপ্রিলের মধ্যে চলে যেতে হবে। আমি জানি না কী করব এবং আমি একজন আইনজীবীর খরচ বহন করতে পারি না। আপনি কি আমাকে আমার অধিকারগুলি বুঝতে সাহায্য করতে পারেন?";
    case "ta":
      return "கடந்த வாரம் என் வீட்டு உரிமையாளரிடமிருந்து வெளியேற்ற அறிவிப்பைப் பெற்றேன். நான் இரண்டு மாத வாடகையைச் செலுத்தவில்லை என்று அவர்கள் கூறுகிறார்கள், ஆனால் நான் உரிய நேரத்தில் பணம் செலுத்தியதைக் காட்டும் ரசீதுகள் என்னிடம் உள்ளன. ஏப்ரல் 15 க்குள் நான் வெளியேற வேண்டும் என்று அறிவிப்பில் கூறப்பட்டுள்ளது. என்ன செய்வது என்று எனக்குத் தெரியவில்லை, மேலும் எனக்கு வழக்கறிஞரை அணுக பணம் இல்லை. என் உரிமைகளைப் புரிந்துகொள்ள நீங்கள் எனக்கு உதவ முடியுமா?";
    default: // English
      return "I received an eviction notice from my landlord last week. They claim I haven't paid rent for two months, but I have receipts showing I paid on time. The notice says I need to leave by April 15th. I don't know what to do and I can't afford a lawyer. Can you help me understand my rights?";
  }
}
