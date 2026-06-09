import { chromium } from "playwright-core";
import chromiumPkg from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function GET() {
  let browser = null;

  try {
    const executablePath = await chromiumPkg.executablePath();

    browser = await chromium.launch({
      args: chromiumPkg.args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(
      "https://monthlify.base44.app/weekly-report?project_id=6a172d8cbb524343154cf5b1",
      {
        waitUntil: "networkidle",
        timeout: 30000,
      },
    );

    const jsonText = await page.evaluate(() => document.body.textContent);

    if (!jsonText) {
      throw new Error("No body content found");
    }

    const data = JSON.parse(jsonText.trim());

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to load report",
      }),
      { status: 500 },
    );
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
