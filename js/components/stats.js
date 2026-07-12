const counterUrl = "https://yaowenhu.goatcounter.com/counter/TOTAL.json";

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

async function getCount(query = "") {
  const separator = query ? "&" : "?";
  const response = await fetch(`${counterUrl}${query}${separator}v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("GoatCounter counter request failed");
  const { count } = await response.json();
  return Number(count).toLocaleString("zh-CN");
}

export async function loadVisitStats() {
  const total = document.querySelector("#total-visits");
  const today = document.querySelector("#today-visits");
  const [totalCount, todayCount] = await Promise.allSettled([
    getCount(),
    getCount(`?start=${shanghaiDate()}`)
  ]);

  if (totalCount.status === "fulfilled") total.textContent = totalCount.value;
  if (todayCount.status === "fulfilled") today.textContent = todayCount.value;
}
