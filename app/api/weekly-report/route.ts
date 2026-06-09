// app/api/weekly-report/route.ts

import { NextResponse } from "next/server";

const PROJECT_ID = "6a172d8cbb524343154cf5b1";

export async function GET() {
  try {
    const response = await fetch(
      `https://monthlify.base44.app/weekly-report?project_id=${PROJECT_ID}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed: ${response.status}`);
    }

    const report = await response.json();

    return NextResponse.json(report);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load weekly report" },
      { status: 500 },
    );
  }
}
