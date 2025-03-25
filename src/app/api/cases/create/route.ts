import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const caseData = await request.json();

    if (!caseData.title || !caseData.description) {
      return NextResponse.json(
        { error: "Missing required case information" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Validate the input data
    // 2. Store the case in a database
    // 3. Return the created case ID

    // Generate a unique case ID
    const caseId = `case_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    // Simulate database storage
    console.log("Creating case:", { id: caseId, ...caseData });

    return NextResponse.json({
      caseId,
      message: "Case created successfully",
    });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
