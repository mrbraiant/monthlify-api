export async function GET() {
  const url =
    "https://monthlify.base44.app/weekly-report?project_id=6a172d8cbb524343154cf5b1";

  const res = await fetch(url);
  const html = await res.text();

  // Try to extract JSON directly from page
  const match =
    html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i) ||
    html.match(/{[\s\S]*"summary"[\s\S]*}/);

  if (!match) {
    return Response.json({
      success: false,
      error: "No JSON found in page",
    });
  }

  let raw = match[1];

  try {
    const json = JSON.parse(raw);

    return Response.json({
      success: true,
      data: json,
    });
  } catch (e) {
    return Response.json({
      success: false,
      error: "JSON parse failed",
      raw: raw.slice(0, 500),
    });
  }
}
