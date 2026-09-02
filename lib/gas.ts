export type GasResponse<T = unknown> = { ok: boolean; data?: T; error?: string };

export async function callGas<T>(action: string, payload: Record<string, unknown> = {}, admin = false): Promise<T> {
  const endpoint = process.env.GAS_ENDPOINT;
  if (!endpoint) throw new Error("GAS_ENDPOINT belum dikonfigurasi.");

  const body = {
    action,
    ...payload,
    ...(admin ? { secret: process.env.GAS_SECRET || "" } : {}),
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Apps Script merespons ${res.status}`);
  const json = (await res.json()) as GasResponse<T>;
  if (!json.ok) throw new Error(json.error || "Terjadi kesalahan pada Apps Script.");
  return json.data as T;
}
