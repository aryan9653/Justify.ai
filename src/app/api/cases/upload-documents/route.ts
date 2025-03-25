import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const caseId = formData.get("caseId") as string;
    const files = [];

    if (!caseId) {
      return NextResponse.json({ error: "Missing case ID" }, { status: 400 });
    }

    // Extract all files from the form data
    for (const key of Array.from(formData.keys())) {
      if (key.startsWith("file")) {
        const file = formData.get(key) as File;
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Upload the files to a storage service (S3, Google Cloud Storage, etc.)
    // 2. Store the file references in a database linked to the case
    // 3. Return the uploaded file information

    // Simulate file storage
    const uploadedFiles = files.map((file, index) => ({
      id: `file_${Date.now()}_${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/api/files/${caseId}/${file.name}`, // Simulated URL
    }));

    console.log("Uploading documents for case:", caseId, uploadedFiles);

    return NextResponse.json({
      files: uploadedFiles,
      message: "Documents uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading documents:", error);
    return NextResponse.json(
      { error: "Failed to upload documents" },
      { status: 500 }
    );
  }
}
