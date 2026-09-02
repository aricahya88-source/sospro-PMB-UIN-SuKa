export type GasResponse<T = unknown> = { ok: boolean; data?: T; error?: string };

const GAS_TIMEOUT_MS = 15000;

export async function callGas<T>(
  action: string,
  payload: Record<string, unknown> = {},
  admin = false
): Promise<T> {
  const endpoint = process.env.GAS_ENDPOINT;
  if (!endpoint) throw new Error("GAS_ENDPOINT belum dikonfigurasi.");

  const body = {
    action,
    ...payload,
    ...(admin ? { secret: (process.env.GAS_SECRET || "").trim() } : {}),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GAS_TIMEOUT_MS);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });

    const raw = await res.text();

    if (!res.ok) {
      throw new Error(`Apps Script merespons HTTP ${res.status}.`);
    }

    let json: GasResponse<T>;
    try {
      json = JSON.parse(raw) as GasResponse<T>;
    } catch {
      const preview = raw.replace(/\s+/g, " ").slice(0, 180);
      throw new Error(
        `Respons Apps Script bukan JSON. Pastikan deployment Web App memakai URL /exec dan aksesnya diizinkan. Respons: ${preview || "(kosong)"}`
      );
    }

    if (!json.ok) {
      throw new Error(json.error || "Terjadi kesalahan pada Apps Script.");
    }

    return json.data as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Koneksi ke Apps Script melebihi 15 detik. Periksa GAS_ENDPOINT, status deployment Web App, dan izin akses Apps Script."
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
