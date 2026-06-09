import { NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";

export const runtime = "nodejs";

const REPORT_URL =
  "https://monthlify.base44.app/weekly-report?project_id=6a172d8cbb524343154cf5b1";

export async function GET() {
  let browser = null;

  try {
    browser = await chromium.launch({
      args: chromiumBinary.args,
      executablePath: await chromiumBinary.executablePath(),
      headless: true, // <-- fixed
    });

    const page = await browser.newPage();

    await page.goto(REPORT_URL, { waitUntil: "domcontentloaded" });

    const bodyText = await page.locator("body").textContent();

    if (!bodyText) {
      throw new Error("Empty body");
    }

    const data = JSON.parse(bodyText.trim());

    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Weekly report error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to load report" },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
