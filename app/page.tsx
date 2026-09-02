import Link from "next/link";
import { programs, levelMeta, StudyLevel } from "@/data/programs";

const levels: StudyLevel[] = ["S1", "D4", "S2", "S3", "PROFESI"];

export default function HomePage() {
  const counts = Object.fromEntries(levels.map((level) => [level, programs.filter((p) => p.level === level).length])) as Record<StudyLevel, number>;
  const newPrograms = programs.filter((p) => p.isNew);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Sosialisasi & Promosi Pendidikan</span>
            <h1>Temukan jalur studimu di UIN Sunan Kalijaga.</h1>
            <p>
              Jelajahi program Sarjana, Sarjana Terapan, Magister, Doktor, dan Profesi dalam tampilan yang ringkas, mudah dicari, dan terhubung ke sumber resmi.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" href="/program-studi">Jelajahi Program Studi <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
              <Link className="btn btn-outline-light" href="/jalur-masuk">Pelajari Jalur Masuk</Link>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Ringkasan jenjang studi">
            <div className="hero-panel-title">Pilihan jenjang</div>
            <div className="hero-stat-grid">
              {levels.map((level) => (
                <div className="hero-stat" key={level}>
                  <b>{level}</b>
                  <span>{levelMeta[level].title} · {counts[level]} program studi</span>
                </div>
              ))}
            </div>
            <div className="hero-note">Kuota tidak ditampilkan di microsite ini. Untuk informasi pendaftaran final, gunakan situs Admisi resmi.</div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" style={{color: "#0b6b5b"}}>Jelajah studi</span>
              <h2>Pilih jenjang pendidikan</h2>
              <p>Mulai dari jenjang yang ingin ditempuh, lalu gunakan pencarian program studi berdasarkan nama atau fakultas.</p>
            </div>
          </div>
          <div className="level-grid">
            {levels.map((level) => (
              <Link href={`/program-studi?jenjang=${level}`} className="level-card" key={level}>
                <span className="level-pill">{level}</span>
                <h3>{levelMeta[level].title}</h3>
                <p>{levelMeta[level].subtitle}. Tersedia {counts[level]} program studi dalam master data sosialisasi.</p>
                <span className="linkline">Lihat program studi <i className="bi bi-arrow-right" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" style={{color: "#0b6b5b"}}>Program terbaru</span>
              <h2>Kenali program studi baru</h2>
              <p>Program baru ditonjolkan agar mudah ditemukan saat kegiatan sosialisasi. Detail pembukaan dan pendaftaran tetap mengikuti Admisi resmi.</p>
            </div>
            <Link href="/program-studi" className="btn btn-ghost">Lihat semua prodi</Link>
          </div>
          <div className="program-grid">
            {newPrograms.slice(0, 6).map((p) => (
              <article className="program-card" key={p.id}>
                <div className="badge-row"><span className="badge">{p.level}</span><span className="badge new">Prodi Baru</span></div>
                <h3>{p.name}</h3>
                <div className="faculty">{p.faculty}</div>
                <div className="meta"><b>Akreditasi/status:</b> {p.accreditation}</div>
                <div className="actions">
                  <a className="small-link" href={p.officialUrl} target="_blank" rel="noreferrer">{p.officialLabel || "Website prodi"} <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" style={{color: "#0b6b5b"}}>Sosialisasi yang lebih mudah dipahami</span>
              <h2>Satu microsite, tiga kebutuhan.</h2>
            </div>
          </div>
          <div className="feature-grid">
            <div className="feature-card"><div className="feature-icon"><i className="bi bi-search" aria-hidden="true" /></div><h3>Jelajah Program Studi</h3><p>Cari prodi berdasarkan jenjang dan fakultas, lengkap dengan jalur yang tersedia dan tautan ke kanal resmi.</p></div>
            <div className="feature-card"><div className="feature-icon"><i className="bi bi-signpost-split" aria-hidden="true" /></div><h3>Pahami Jalur Masuk</h3><p>Ringkasan jalur S1, D4, S2, S3, serta informasi Program Profesi tanpa menyalin seluruh brosur ke halaman yang panjang.</p></div>
            <div className="feature-card"><div className="feature-icon"><i className="bi bi-gift" aria-hidden="true" /></div><h3>Kegiatan, Presensi & Doorprize</h3><p>Admin menambah kegiatan. Peserta cukup mengisi presensi tanpa akun, lalu peserta hadir dapat diundi melalui wheel.</p></div>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Sumber final</span>
              <h2>Siap mendaftar?</h2>
              <p>Gunakan microsite ini untuk memahami pilihan. Saat akan mendaftar, selalu lanjutkan ke kanal resmi Admisi UIN Sunan Kalijaga.</p>
            </div>
            <a className="btn btn-gold" href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noreferrer">Buka Admisi Resmi <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
