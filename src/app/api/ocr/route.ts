import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = [];

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

    // Process each file with OCR
    // In a real implementation, you would use a service like Google Cloud Vision, Tesseract, etc.
    // For now, we'll simulate OCR processing

    // Read the first file as an example
    const firstFile = files[0];
    const fileType = firstFile.type;

    // Different processing based on file type
    let extractedText = "";

    if (fileType.startsWith("image/")) {
      // Process image file
      // In a real implementation, you would send the image to an OCR service
      extractedText = await simulateImageOCR(firstFile.name);
    } else if (fileType === "application/pdf") {
      // Process PDF file
      extractedText = await simulatePdfOCR(firstFile.name);
    } else {
      // Process other document types
      extractedText = await simulateDocumentOCR(firstFile.name);
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("Error in OCR route:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}

// Simulate OCR for image files
async function simulateImageOCR(filename: string): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return different text based on filename patterns
  if (
    filename.toLowerCase().includes("eviction") ||
    filename.toLowerCase().includes("notice")
  ) {
    return `NOTICE OF EVICTION

Date: March 15, 2025

Dear Tenant,

This letter serves as formal notice that your tenancy will be terminated in 30 days due to non-payment of rent. You currently owe $1,200 for the months of January and February 2025.

Please vacate the premises by April 15, 2025.

Sincerely,
Property Management`;
  } else if (
    filename.toLowerCase().includes("wage") ||
    filename.toLowerCase().includes("salary")
  ) {
    return `WAGE PAYMENT NOTICE

Employee: John Doe
Employee ID: EMP-2023-456
Period: January 1 - January 31, 2025

Base Salary: $3,000
Overtime: $450
Deductions: $320
Net Pay: $3,130

Payment Date: February 5, 2025`;
  } else {
    return `LEGAL DOCUMENT

This document appears to contain legal text related to a case or agreement. The quality of the image makes it difficult to extract all details accurately.

Key points identified:
- Date: March 2025
- Parties involved: At least two individuals or entities
- Legal matter: Appears to be related to a dispute or agreement
- Contact information: Phone number and email visible
- Signature: Document appears to be signed`;
  }
}

// Simulate OCR for PDF files
async function simulatePdfOCR(filename: string): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return different text based on filename patterns
  if (
    filename.toLowerCase().includes("contract") ||
    filename.toLowerCase().includes("agreement")
  ) {
    return `RENTAL AGREEMENT

THIS AGREEMENT made on the 1st day of January, 2025, between Property Owner LLC ("Landlord") and Jane Smith ("Tenant").

1. PREMISES: Landlord rents to Tenant the residential property located at: 123 Main Street, Apt 4B, Anytown, State 12345.

2. TERM: The term of this Agreement shall be for one year, beginning on January 1, 2025, and ending on December 31, 2025.

3. RENT: Tenant agrees to pay monthly rent of $1,500, due on the 1st day of each month.

4. SECURITY DEPOSIT: Tenant has paid a security deposit of $1,500 to be held by Landlord.

5. UTILITIES: Tenant shall be responsible for payment of all utilities and services.

Signed,

Property Owner LLC                    Jane Smith
_________________                    _________________
Landlord                             Tenant`;
  } else {
    return `LEGAL DOCUMENT

This PDF document contains multiple pages of legal text. The OCR system has identified the following key information:

Document Type: Legal filing or court document
Date: Recent (within last 3 months)
Case Number: Visible but partially illegible
Parties: Multiple individuals and possibly corporate entities
Subject Matter: Appears to be related to a legal dispute
Pages: Multiple (estimated 5-10 pages)

Note: For complete and accurate information, human review of the full document is recommended.`;
  }
}

// Simulate OCR for other document types
async function simulateDocumentOCR(filename: string): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return `DOCUMENT CONTENT

The system has attempted to extract text from this document, but the format may not be fully supported for automated extraction.

Detected content includes:
- Text paragraphs
- Possibly tables or structured data
- Some formatting may be lost

For best results, please consider uploading the document as a PDF or image file.`;
}
