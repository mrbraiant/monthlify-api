// app/api/fetch-report/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("running");

  try {
    const token = process.env.BROWSERLESS_TOKEN;
    const url = process.env.TARGET_URL;

    if (!token || !url) {
      return NextResponse.json({ error: "Missing config" }, { status: 500 });
    }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          context: { url },
        }),
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

    console.log(
      "BROWSERLESS RESPONSE DATA:",
      JSON.stringify(result.data).slice(0, 500),
    );

    return NextResponse.json(result.data, { status: 200 });
  } catch (err: any) {
    console.error("Weekly report fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}
