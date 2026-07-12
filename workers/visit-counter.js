const allowedOrigin = "https://yaowenhu-uestc.github.io";

function shanghaiDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts();
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export default {
  async fetch(request, env) {
    if (request.headers.get("Origin") !== allowedOrigin) return new Response("Forbidden", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });
    if (request.method !== "POST" || new URL(request.url).pathname !== "/count") return new Response("Not found", { status: 404 });

    const counter = env.VISIT_COUNTER.getByName("global");
    const response = await counter.fetch(request);
    return new Response(response.body, { headers: { ...corsHeaders(), "Content-Type": "application/json" } });
  }
};

export class VisitCounter {
  constructor(ctx) {
    this.storage = ctx.storage;
  }

  async fetch() {
    const todayDate = shanghaiDate();
    const total = (await this.storage.get("total")) || 0;
    const storedDate = await this.storage.get("date");
    const today = storedDate === todayDate ? (await this.storage.get("today")) || 0 : 0;
    const nextTotal = total + 1;
    const nextToday = today + 1;

    await this.storage.put({ total: nextTotal, date: todayDate, today: nextToday });
    return Response.json({ total: nextTotal, today: nextToday });
  }
}
