"use client";

import { FormEvent, useEffect, useState } from "react";
import type { EventItem } from "@/data/demo-events";

const emptyForm = { title: "", date: "", time: "", location: "", description: "", status: "published", attendanceOpen: true };

export default function AdminEventsManager() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/admin/events", { cache: "no-store" }); const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Gagal memuat kegiatan.");
      setEvents(j.data || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal memuat kegiatan."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, slug: slugify(form.title) };
      const r = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json(); if (!r.ok || !j.ok) throw new Error(j.error || "Gagal menyimpan kegiatan.");
      setForm(emptyForm); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal menyimpan kegiatan."); }
    finally { setSaving(false); }
  }

  async function update(event: EventItem, patch: Partial<EventItem>) {
    setError("");
    try {
      const payload = { ...event, ...patch };
      const r = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json(); if (!r.ok || !j.ok) throw new Error(j.error || "Gagal memperbarui kegiatan.");
      setEvents((old) => old.map((x) => x.id === event.id ? payload : x));
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal memperbarui kegiatan."); }
  }

  return <div className="admin-grid">
    <div className="admin-card">
      <h2>Kegiatan</h2>
      <p style={{color: "var(--muted)", fontSize: 13}}>Admin dapat membuka/menutup presensi tanpa mengubah materi statis website.</p>
      {error && <div className="error-box" style={{marginBottom: 14}}>{error}</div>}
      {loading ? <div className="notice green">Memuat...</div> : events.length === 0 ? <div className="notice">Belum ada kegiatan.</div> : events.map((event) => <div className="event-admin-item" key={event.id}>
        <b>{event.title}</b><span>{event.date} · {event.time} · {event.location}</span>
        <div className="badge-row" style={{marginTop: 7}}><span className="badge neutral">{event.status}</span><span className="badge">Presensi {event.attendanceOpen ? "OPEN" : "CLOSED"}</span></div>
        <div className="inline-actions">
          <button className="mini-btn" onClick={() => update(event, {attendanceOpen: !event.attendanceOpen})}>{event.attendanceOpen ? "Tutup presensi" : "Buka presensi"}</button>
          <button className="mini-btn" onClick={() => update(event, {status: event.status === "published" ? "draft" : "published"})}>{event.status === "published" ? "Jadikan draft" : "Publikasikan"}</button>
          <a className="mini-btn" href={`/kegiatan/${encodeURIComponent(event.id)}`} target="_blank">Lihat publik <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
        </div>
      </div>)}
    </div>

    <form className="admin-card" onSubmit={submit}>
      <h2>Tambah kegiatan</h2>
      <div className="form-field"><label className="label">Nama kegiatan</label><input className="input" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
      <div className="form-row"><div className="form-field"><label className="label">Tanggal</label><input className="input" type="date" required value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} /></div><div className="form-field"><label className="label">Waktu</label><input className="input" placeholder="09:00 WIB" required value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} /></div></div>
      <div className="form-field"><label className="label">Lokasi</label><input className="input" required value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} /></div>
      <div className="form-field"><label className="label">Deskripsi</label><textarea className="textarea" required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
      <div className="form-row"><div className="form-field"><label className="label">Status</label><select className="select" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}><option value="published">Published</option><option value="draft">Draft</option></select></div><div className="form-field"><label className="label">Presensi awal</label><select className="select" value={form.attendanceOpen ? "open" : "closed"} onChange={(e) => setForm({...form, attendanceOpen: e.target.value === "open"})}><option value="open">Dibuka</option><option value="closed">Ditutup</option></select></div></div>
      <button className="btn btn-green" disabled={saving} type="submit">{saving ? "Menyimpan..." : <><i className="bi bi-plus-lg" aria-hidden="true" /> Tambah Kegiatan</>}</button>
    </form>
  </div>;
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
