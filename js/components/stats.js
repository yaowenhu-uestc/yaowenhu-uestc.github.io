const counterUrl = "https://hyw-visit-counter.infidive-tv.workers.dev/count";

export async function loadVisitStats() {
  const total = document.querySelector("#total-visits");
  const today = document.querySelector("#today-visits");
  try {
    const response = await fetch(counterUrl, { method: "POST" });
    if (!response.ok) return;

    const counts = await response.json();
    total.textContent = Number(counts.total).toLocaleString("zh-CN");
    today.textContent = Number(counts.today).toLocaleString("zh-CN");
  } catch {
    // 保留默认占位符。
  }
}
