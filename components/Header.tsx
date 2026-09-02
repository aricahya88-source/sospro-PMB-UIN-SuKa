import Link from "next/link";

const UIN_LOGO = "https://admisi.uin-suka.ac.id/img/logo_uin.png";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Beranda Jelajah Studi UIN SUKA">
          <img className="brand-logo" src={UIN_LOGO} alt="Logo UIN Sunan Kalijaga" />
          <span className="brand-copy">
            <b>Jelajah Studi UIN SUKA</b>
            <span>Microsite Sosialisasi & Promosi</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Navigasi utama">
          <Link href="/program-studi">Program Studi</Link>
          <Link href="/jalur-masuk">Jalur Masuk</Link>
          <Link href="/biaya-beasiswa">Biaya & Beasiswa</Link>
          <Link href="/kegiatan">Kegiatan Sospro</Link>
          <Link href="/faq">FAQ</Link>
          <a className="official-btn" href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noreferrer">Admisi Resmi <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
        </nav>
        <div className="mobile-nav">
          <Link href="/program-studi">Prodi</Link>
          <Link href="/kegiatan">Sospro</Link>
        </div>
      </div>
    </header>
  );
}
