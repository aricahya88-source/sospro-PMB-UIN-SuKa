"use client";

import { useMemo, useState } from "react";
import { programs, StudyLevel } from "@/data/programs";

const levelOptions: Array<"ALL" | StudyLevel> = ["ALL", "S1", "D4", "S2", "S3", "PROFESI"];

export default function ProgramExplorer({ initialLevel = "ALL" }: { initialLevel?: string }) {
  const validInitial = levelOptions.includes(initialLevel as any) ? (initialLevel as "ALL" | StudyLevel) : "ALL";
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"ALL" | StudyLevel>(validInitial);
  const [faculty, setFaculty] = useState("ALL");

  const faculties = useMemo(() => Array.from(new Set(programs.map((p) => p.faculty))).sort(), []);
  const result = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      if (level !== "ALL" && p.level !== level) return false;
      if (faculty !== "ALL" && p.faculty !== faculty) return false;
      if (!q) return true;
      return `${p.name} ${p.faculty} ${(p.concentrations || []).join(" ")}`.toLowerCase().includes(q);
    });
  }, [query, level, faculty]);

  return (
    <>
      <div className="filter-panel">
        <div className="filter-grid">
          <div>
            <label className="label" htmlFor="prodi-search">Cari program studi atau konsentrasi</label>
            <input id="prodi-search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: Informatika, Pendidikan, Hukum, Studi Islam..." />
          </div>
          <div>
            <label className="label" htmlFor="jenjang">Jenjang</label>
            <select id="jenjang" className="select" value={level} onChange={(e) => setLevel(e.target.value as any)}>
              <option value="ALL">Semua jenjang</option>
              <option value="S1">S1 Sarjana</option>
              <option value="D4">D4 Sarjana Terapan</option>
              <option value="S2">S2 Magister</option>
              <option value="S3">S3 Doktor</option>
              <option value="PROFESI">Program Profesi</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="fakultas">Fakultas / Unit</label>
            <select id="fakultas" className="select" value={faculty} onChange={(e) => setFaculty(e.target.value)}>
              <option value="ALL">Semua fakultas</option>
              {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="result-summary">
        <span><strong>{result.length}</strong> program studi ditemukan</span>
        <button className="mini-btn" onClick={() => {setQuery(""); setLevel("ALL"); setFaculty("ALL");}}>Reset filter</button>
      </div>

      <div className="program-grid">
        {result.map((p) => (
          <article className="program-card" key={p.id}>
            <div className="badge-row">
              <span className="badge">{p.level}</span>
              {p.isNew && <span className="badge new">Prodi Baru</span>}
              {p.accreditation && <span className="badge neutral">{p.accreditation}</span>}
            </div>
            <h3>{p.name}</h3>
            <div className="faculty">{p.faculty}</div>
            {p.pathways && p.pathways.length > 0 && <div className="meta"><b>Jalur:</b> {p.pathways.join(" · ")}</div>}
            {p.concentrations && p.concentrations.length > 0 && (
              <details className="details">
                <summary>Lihat konsentrasi ({p.concentrations.length})</summary>
                <ul>{p.concentrations.map((c) => <li key={c}>{c}</li>)}</ul>
              </details>
            )}
            <div className="actions">
              <a className="small-link" href={p.officialUrl} target="_blank" rel="noreferrer">{p.officialLabel || "Website prodi"} <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
              <a className="small-link" href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noreferrer">Admisi <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
            </div>
          </article>
        ))}
      </div>
      {result.length === 0 && <div className="notice">Tidak ada program studi yang cocok dengan filter. Coba hapus kata pencarian atau ubah jenjang/fakultas.</div>}
    </>
  );
}
