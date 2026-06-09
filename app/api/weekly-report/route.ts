import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = process.env.BROWSERLESS_TOKEN;
    const url = process.env.TARGET_URL;

    if (!token || !url) {
      return NextResponse.json({ error: "Missing config" }, { status: 500 });
    }

    // Use Browserless Content API to render JS
    const res = await fetch(
      `https://chrome.browserless.io/content?token=${token}&url=${encodeURIComponent(
        url,
      )}`,
      { method: "GET" },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch page" },
        { status: 500 },
      );
    }

    const text = await res.text();

    // The page returns the JSON inside <body>, parse it
    const bodyMatch = text.match(/{.*}/s);
    if (!bodyMatch) {
      return NextResponse.json(
        { error: "No JSON found in page" },
        { status: 500 },
      );
    }

    const data = JSON.parse(bodyMatch[0]);

    return NextResponse.json(data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Weekly report fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}
