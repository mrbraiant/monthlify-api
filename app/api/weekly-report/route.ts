// app/api/weekly-report/route.ts
import { NextRequest, NextResponse } from "next/server";

// Example data, replace this with your real logic
const dummyData = {
  generated_at: new Date().toISOString(),
  project: "Principal",
  week: {
    start: "2026-06-08",
    end: "2026-06-14",
    label: "Jun 8 – Jun 14, 2026",
  },
  summary: {
    total_costs: 1,
    total_amount: 1,
    paid_amount: 0,
    unpaid_amount: 1,
    paid_count: 0,
    unpaid_count: 1,
  },
  costs: [
    {
      id: "6a25f91cdcaf21884d565552",
      title: "Lov",
      amount: 1,
      currency: "EUR",
      category: "utilities",
      icon: "🎵",
      paid: false,
      repeat_interval: 12,
    },
  ],
};

export async function GET(req: NextRequest) {
  // Optional: get query parameter
  const project_id = req.nextUrl.searchParams.get("project_id") || "default";

  // Here you can fetch or calculate the real data
  // For now we return dummyData
  return NextResponse.json(dummyData);
}
