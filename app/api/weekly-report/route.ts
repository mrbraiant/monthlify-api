// app/api/fetch-report/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("running");

  try {
    const token = process.env.BROWSERLESS_TOKEN;
    const projectId = req.nextUrl.searchParams.get("project_id"); // dynamic project_id

    if (!token) {
      return NextResponse.json(
        { error: "Missing BROWSERLESS_TOKEN" },
        { status: 500 },
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing project_id query parameter" },
        { status: 400 },
      );
    }

    // Build the target URL dynamically
    const url = `https://monthlify.base44.app/weekly-report?project_id=${encodeURIComponent(projectId)}`;

    // Browserless Function API code
    const code = `
      export default async ({ page, context }) => {
        await page.goto(context.url, { waitUntil: 'networkidle2' });
        const data = await page.evaluate(() => {
          // Grab the JS-rendered data
          return window.__NEXT_DATA__ || { html: document.body.innerText };
        });
        return { data, type: 'application/json' };
      };
    `;

    const res = await fetch(
      `https://production-sfo.browserless.io/function?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, context: { url } }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Browserless request failed", details: text },
        { status: res.status },
      );
    }

    const result = await res.json();

    // Parse the stringified JSON if needed
    let data =
      typeof result.data === "string" ? JSON.parse(result.data) : result.data;

    // If Browserless wrapped JSON inside "html", unwrap it
    if (data?.html && typeof data.html === "string") {
      data = JSON.parse(data.html);
    }

    console.log("BROWSERLESS PARSED DATA:", JSON.stringify(data).slice(0, 500));

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Weekly report fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}
