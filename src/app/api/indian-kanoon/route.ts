import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length < 10) {
      return NextResponse.json({ cases: [] });
    }

    // Extract key legal terms from the query
    const legalTerms = extractLegalTerms(query);

    // Call the Indian Kanoon API
    // Note: In a real implementation, you would use the actual Indian Kanoon API
    // This is a simulated response based on the query
    const cases = await searchIndianKanoon(legalTerms, query);

    return NextResponse.json({ cases });
  } catch (error) {
    console.error("Error in Indian Kanoon API:", error);
    return NextResponse.json(
      { error: "Failed to search legal cases" },
      { status: 500 }
    );
  }
}

// Function to extract legal terms from text
function extractLegalTerms(text: string): string[] {
  // Common legal terms to look for
  const commonLegalTerms = [
    "eviction",
    "rent",
    "lease",
    "tenant",
    "landlord",
    "wage",
    "salary",
    "compensation",
    "employer",
    "employee",
    "divorce",
    "custody",
    "alimony",
    "marriage",
    "child support",
    "property",
    "ownership",
    "title",
    "deed",
    "inheritance",
    "contract",
    "agreement",
    "breach",
    "damages",
    "liability",
    "criminal",
    "offense",
    "bail",
    "arrest",
    "prosecution",
  ];

  const textLower = text.toLowerCase();
  return commonLegalTerms.filter((term) => textLower.includes(term));
}

// Function to search Indian Kanoon (simulated)
async function searchIndianKanoon(terms: string[], query: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Map of case types to relevant precedents
  const casePrecedents: Record<string, any[]> = {
    eviction: [
      {
        title: "Samaraditya Pal v. Smt. Meera Pal",
        citation: "(2019) 8 SCC 714",
        summary:
          "Case regarding eviction notice requirements and tenant rights",
      },
      {
        title: "Atma Ram Properties (P) Ltd. v. Federal Motors (P) Ltd.",
        citation: "(2005) 1 SCC 705",
        summary: "Landmark case on landlord's right to evict for personal use",
      },
    ],
    rent: [
      {
        title: "Sarup Singh Gupta v. S. Jagdish Singh",
        citation: "(2006) 4 SCC 551",
        summary: "Case regarding rent control and fair rent determination",
      },
    ],
    wage: [
      {
        title: "People's Union for Democratic Rights v. Union of India",
        citation: "AIR 1982 SC 1473",
        summary: "Landmark case on minimum wage rights and labor laws",
      },
      {
        title: "Workmen v. Management of Reptakos Brett",
        citation: "AIR 1992 SC 504",
        summary: "Case regarding fair wages and living wage standards",
      },
    ],
    property: [
      {
        title: "Ashok Kapil v. Sana Ullah",
        citation: "(1996) 6 SCC 342",
        summary:
          "Case regarding property ownership disputes and evidence requirements",
      },
      {
        title: "R. Rajagopal Reddy v. Padmini Chandrasekharan",
        citation: "(1995) 2 SCC 630",
        summary: "Case on property title disputes and documentation",
      },
    ],
    family: [
      {
        title: "Amardeep Singh v. Harveen Kaur",
        citation: "(2017) 8 SCC 746",
        summary: "Case regarding mutual consent divorce and waiting period",
      },
      {
        title: "Shamima Farooqui v. Shahid Khan",
        citation: "(2015) 5 SCC 705",
        summary: "Case on maintenance rights in divorce proceedings",
      },
    ],
    criminal: [
      {
        title: "Arnesh Kumar v. State of Bihar",
        citation: "(2014) 8 SCC 273",
        summary: "Case regarding arrest procedures and bail in criminal cases",
      },
      {
        title: "Lalita Kumari v. Govt. of U.P.",
        citation: "(2014) 2 SCC 1",
        summary: "Case on mandatory FIR registration for cognizable offenses",
      },
    ],
  };

  // Find relevant cases based on extracted terms
  let relevantCases: any[] = [];

  for (const term of terms) {
    for (const category in casePrecedents) {
      if (term.includes(category) || category.includes(term)) {
        relevantCases = [...relevantCases, ...casePrecedents[category]];
      }
    }
  }

  // Remove duplicates
  const uniqueCases = relevantCases.filter(
    (caseItem, index, self) =>
      index === self.findIndex((c) => c.title === caseItem.title)
  );

  // Return top 5 most relevant cases
  return uniqueCases.slice(0, 5);
}
