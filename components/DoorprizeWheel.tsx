"use client";

import { useEffect, useMemo, useState } from "react";
import type { EventItem } from "@/data/demo-events";

type Participant = { id: string; eventId: string; name: string; institution: string; phone?: string; won?: boolean };
type Winner = { id: string; name: string; institution: string; prize?: string };

export default function DoorprizeWheel() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prize, setPrize] = useState("Doorprize");
  const [winner, setWinner] = useState<Winner | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/events").then(r => r.json()).then(j => { if (j.ok) setEvents(j.data || []); else setError(j.error || "Gagal memuat kegiatan."); });
  }, []);

  useEffect(() => {
    if (!eventId) { setParticipants([]); return; }
    setWinner(null); setError("");
    fetch(`/api/admin/attendance?eventId=${encodeURIComponent(eventId)}`).then(r => r.json()).then(j => { if (j.ok) setParticipants(j.data || []); else setError(j.error || "Gagal memuat peserta."); });
  }, [eventId]);

  const eligible = useMemo(() => participants.filter((p) => !p.won), [participants]);

  async function draw() {
    if (!eventId || !eligible.length || spinning) return;
    setSpinning(true); setWinner(null); setError("");
    try {
      const r = await fetch("/api/admin/draw", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId, prize }) });
      const j = await r.json(); if (!r.ok || !j.ok) throw new Error(j.error || "Pengundian gagal.");
      const w = j.data as Winner;
      setRotation((old) => old + 1440 + Math.floor(Math.random() * 720));
      await new Promise((resolve) => setTimeout(resolve, 4800));
      setWinner(w);
      setParticipants((old) => old.map((p) => p.id === w.id ? {...p, won: true} : p));
    } catch (e) { setError(e instanceof Error ? e.message : "Pengundian gagal."); }
    finally { setSpinning(false); }
  }

  return <>
    <div className="filter-panel"><div className="filter-grid" style={{gridTemplateColumns: "1fr 1fr"}}><div><label className="label">Pilih kegiatan</label><select className="select" value={eventId} onChange={(e) => setEventId(e.target.value)}><option value="">— pilih kegiatan —</option>{events.map((e) => <option value={e.id} key={e.id}>{e.title}</option>)}</select></div><div><label className="label">Nama hadiah</label><input className="input" value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="Contoh: Tumbler" /></div></div></div>
    {error && <div className="error-box" style={{marginBottom: 18}}>{error}</div>}
    <div className="wheel-layout">
      <div>
        <div className="wheel-wrap"><div className="wheel-pointer"/><div className="wheel" style={{transform: `rotate(${rotation}deg)`}} /></div>
        <p style={{textAlign: "center", color: "var(--muted)", fontSize: 12}}>Roda adalah animasi visual. Pemilihan pemenang dilakukan di backend dari seluruh peserta eligible.</p>
      </div>
      <div className="winner-card">
        <span className="badge">Doorprize</span>
        <h2 style={{fontSize: 30}}>Undi peserta hadir</h2>
        <p style={{color: "var(--muted)"}}>Peserta hadir: <b>{participants.length}</b> · Eligible: <b>{eligible.length}</b></p>
        {winner ? <div className="success-box"><div style={{fontSize: 12, fontWeight: 800}}><i className="bi bi-trophy-fill" aria-hidden="true" /> SELAMAT</div><div className="winner-name">{winner.name}</div><div>{winner.institution}</div><div style={{marginTop: 10}}><strong>Hadiah:</strong> {winner.prize || prize}</div></div> : <div className="notice green">Pilih kegiatan yang sudah memiliki data presensi, lalu tekan tombol undi.</div>}
        <button className="btn btn-gold" style={{width: "100%", marginTop: 16}} onClick={draw} disabled={spinning || !eventId || !eligible.length}>{spinning ? "Roda berputar..." : "PUTAR WHEEL"}</button>
        <p style={{fontSize: 11, color: "var(--muted)"}}>Pemenang yang tersimpan tidak ikut undian berikutnya pada kegiatan yang sama.</p>
      </div>
    </div>
  </>;
}
