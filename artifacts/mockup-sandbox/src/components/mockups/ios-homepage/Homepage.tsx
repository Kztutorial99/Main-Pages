import "./ios.css";

export function Homepage() {
  return (
    <div className="ios-root">
      {/* STATUS BAR */}
      <div className="ios-status-bar">
        <span className="ios-time">9:41</span>
        <div className="ios-status-icons">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="3" width="3" height="9" rx="1" fill="currentColor" opacity="0.3"/>
            <rect x="4.5" y="2" width="3" height="10" rx="1" fill="currentColor" opacity="0.5"/>
            <rect x="9" y="0" width="3" height="12" rx="1" fill="currentColor" opacity="0.75"/>
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill="currentColor"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 2.5C10.2 2.5 12.2 3.4 13.6 4.9L15 3.5C13.2 1.6 10.7 0.5 8 0.5C5.3 0.5 2.8 1.6 1 3.5L2.4 4.9C3.8 3.4 5.8 2.5 8 2.5Z" fill="currentColor"/>
            <path d="M8 5.5C9.4 5.5 10.7 6.1 11.6 7L13 5.6C11.7 4.3 10 3.5 8 3.5C6 3.5 4.3 4.3 3 5.6L4.4 7C5.3 6.1 6.6 5.5 8 5.5Z" fill="currentColor"/>
            <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
          </svg>
          <div className="ios-battery">
            <div className="ios-battery-level" />
            <div className="ios-battery-tip" />
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="ios-nav">
        <div className="ios-nav-inner">
          <div className="ios-nav-brand">
            <img src="/__mockup/images/logo.jpg" alt="Kz.tutorial" className="ios-nav-avatar" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="%23007AFF"/><text y="26" x="8" font-size="18" fill="white">K</text></svg>' }} />
            <div>
              <span className="ios-nav-title">IWX TEAM</span>
              <span className="ios-nav-sub">Termux & Linux Hub</span>
            </div>
          </div>
          <div className="ios-nav-actions">
            <a href="#" className="ios-nav-link">Home</a>
            <a href="#" className="ios-nav-link">Videos</a>
            <a href="#" className="ios-nav-link">Topik</a>
            <a href="https://www.youtube.com/@Kz.tutorial" target="_blank" className="ios-subscribe-btn">
              Subscribe
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="ios-hero">
        <div className="ios-hero-bg">
          <div className="ios-hero-orb ios-hero-orb-1" />
          <div className="ios-hero-orb ios-hero-orb-2" />
          <div className="ios-hero-orb ios-hero-orb-3" />
        </div>
        <div className="ios-hero-content">
          <div className="ios-hero-badge">
            <span className="ios-badge-dot" />
            Powerful · Fast · Open Source
          </div>
          <h1 className="ios-hero-title">
            <span className="ios-hero-title-green">TERMUX</span>
            <br />
            <span className="ios-hero-title-white">LINUX</span>
          </h1>
          <p className="ios-hero-sub">Learn Linux on Android — practical, clear, and easy to understand.</p>

          <div className="ios-hero-tags">
            {["Terminal", "Bash", "Packages", "Development"].map(t => (
              <span key={t} className="ios-hero-tag">{t}</span>
            ))}
          </div>

          <div className="ios-hero-ctas">
            <a href="#" className="ios-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-14 9V3z"/></svg>
              Start Learning Now
            </a>
            <a href="#" className="ios-btn-secondary">
              Explore Termux
            </a>
          </div>

          <div className="ios-hero-features">
            {[
              { icon: "⚡", label: "Fast & Lightweight", sub: "Runs anywhere" },
              { icon: "🔒", label: "Secure & Private", sub: "Full Control" },
              { icon: "🛠", label: "Developer Friendly", sub: "All tools in pocket" },
              { icon: "🌐", label: "Open Source", sub: "Community Driven" },
            ].map(f => (
              <div key={f.label} className="ios-feature-pill">
                <span className="ios-feature-icon">{f.icon}</span>
                <div>
                  <div className="ios-feature-label">{f.label}</div>
                  <div className="ios-feature-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider dots */}
        <div className="ios-slider-dots">
          <span className="ios-dot ios-dot-active" />
          <span className="ios-dot" />
          <span className="ios-dot" />
          <span className="ios-dot" />
        </div>
      </section>

      {/* TICKER */}
      <div className="ios-ticker-wrap">
        <div className="ios-ticker-track">
          {["Tutorial Termux","Linux Open Source","Command Line","Tools & Scripts","Tips & Trik","Automation","Android Developer","Sumber Terbuka","Tutorial Termux","Linux Open Source","Command Line","Tools & Scripts"].map((item, i) => (
            <span key={i} className="ios-ticker-item">
              {i > 0 && <span className="ios-ticker-sep">·</span>}
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* QUICK LINKS */}
      <section className="ios-quick-section">
        <p className="ios-section-tagline">
          Tutorial <span className="ios-accent">Termux, Linux & Android</span> — praktis, jelas, dan mudah dipahami.
        </p>
        <div className="ios-qlink-row">
          <a className="ios-qlink-card" href="#">
            <div className="ios-qlink-icon ios-qlink-green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 9l2 2-2 2M11 13h4"/></svg>
            </div>
            <span className="ios-qlink-label">Termux</span>
            <span className="ios-qlink-sub">Tutorial & Tips</span>
          </a>
          <a className="ios-qlink-card" href="#">
            <div className="ios-qlink-icon ios-qlink-blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/></svg>
            </div>
            <span className="ios-qlink-label">Android</span>
            <span className="ios-qlink-sub">Developer Guide</span>
          </a>
          <a className="ios-qlink-card ios-qlink-card-accent" href="#">
            <div className="ios-qlink-icon ios-qlink-dark">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </div>
            <span className="ios-qlink-label">Tools</span>
            <span className="ios-qlink-sub">GitHub No-Root</span>
          </a>
        </div>
      </section>

      {/* VIDEOS SECTION */}
      <section className="ios-videos-section">
        <div className="ios-section-header">
          <div className="ios-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Paling Banyak Ditonton
          </div>
          <h2 className="ios-section-title">Konten <span className="ios-accent">Unggulan</span></h2>
          <p className="ios-section-desc">Tutorial terpopuler dari @Kz.tutorial — pilihan terbaik untuk mulai belajar</p>
        </div>

        <div className="ios-videos-grid">
          {[
            { id: "C3AEE8_Mzpk", rank: 1, badge: "Most Viewed", title: "Tutorial Termux Lengkap untuk Pemula" },
            { id: "4h8A771ipAE", rank: 2, badge: "Top Rated", title: "Panduan Linux Android Step by Step" },
            { id: "jkAyvGKsA7c", rank: 3, badge: "Trending", title: "Tools & Scripts Keren di Termux" },
          ].map(v => (
            <div className="ios-video-card" key={v.id}>
              <div className="ios-video-rank">#{v.rank}</div>
              <div className="ios-thumb-wrap">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                  alt={`Video ${v.rank}`}
                  className="ios-thumb"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg` }}
                />
                <div className="ios-play-overlay">
                  <div className="ios-play-btn">
                    <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <div className="ios-video-info">
                <span className={`ios-video-badge ios-badge-rank-${v.rank}`}>{v.badge}</span>
                <p className="ios-video-title">{v.title}</p>
                <p className="ios-video-channel">@Kz.tutorial</p>
                <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" className="ios-watch-btn">
                  Watch Now
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="ios-view-all-wrap">
          <a href="https://www.youtube.com/@Kz.tutorial" target="_blank" className="ios-view-all-btn">
            Lihat Semua Tutorial
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="ios-about-section">
        <div className="ios-about-card">
          <div className="ios-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            About
          </div>
          <h2 className="ios-section-title">Tentang <span className="ios-accent">Kz.tutorial</span></h2>
          <p className="ios-about-desc">Kz.tutorial adalah platform edukasi yang menyajikan konten seputar Termux, Linux, dan Android. Dibuat untuk siapa saja yang ingin belajar, dari pemula hingga tingkat lanjut.</p>

          <div className="ios-about-stats">
            {[
              { val: "50+", label: "Tutorial Videos" },
              { val: "10K+", label: "Subscribers" },
              { val: "3", label: "Topik Utama" },
            ].map(s => (
              <div className="ios-stat-item" key={s.label}>
                <span className="ios-stat-val">{s.val}</span>
                <span className="ios-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ios-footer">
        <div className="ios-footer-inner">
          <div className="ios-footer-brand">
            <span className="ios-footer-logo">Kz<span className="ios-accent">.</span>tutorial</span>
            <p className="ios-footer-desc">Tutorial Termux, Linux, dan Android — untuk semua level.</p>
            <a href="https://www.youtube.com/@Kz.tutorial" target="_blank" className="ios-footer-yt">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.52V8.48L15.82 12l-6.07 3.52z"/></svg>
              YouTube Channel
            </a>
          </div>
          <div className="ios-footer-cols">
            {[
              { title: "Konten", links: ["Tutorial Unggulan", "Tentang Platform", "Semua Topik"] },
              { title: "Topik", links: ["Tutorial Termux", "Panduan Linux", "Tools & Scripts", "Tips & Trik"] },
              { title: "Legal", links: ["Kebijakan Privasi", "Syarat Penggunaan", "Disclaimer"] },
            ].map(col => (
              <div className="ios-footer-col" key={col.title}>
                <h5 className="ios-footer-col-title">{col.title}</h5>
                <ul>
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="ios-footer-link">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="ios-footer-divider" />
        <div className="ios-footer-bottom">
          <p className="ios-footer-copy">© 2025 Kz.tutorial. All rights reserved.</p>
          <p className="ios-footer-made">Made with ❤️ for the Open Source community</p>
        </div>
      </footer>
    </div>
  );
}
