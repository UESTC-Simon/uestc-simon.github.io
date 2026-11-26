"use client";

import Link from "next/link";
import { useEffect } from "react";
import { news, profile, projects, publications } from "@/lib/profile";
import { posts } from "@/lib/posts";
import { useSite } from "./site-shell";
import Portrait from "./portrait";
import NeuralField from "./neural-field";
import ResearchArt from "./research-art";
import { PostCard } from "./writing";

function useScrollReveal() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".home-page [data-reveal]"),
    );
    if (media.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-ready");
        observer.observe(element);
      }
    });
    const stop = () => {
      if (media.matches) {
        observer.disconnect();
        elements.forEach((element) => element.classList.add("is-revealed"));
      }
    };
    media.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", stop);
      elements.forEach((element) =>
        element.classList.remove("reveal-ready", "is-revealed"),
      );
    };
  }, []);
}

function SocialIcon({ kind }: { kind: "github" | "scholar" | "mail" | "cv" }) {
  if (kind === "github") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }
  if (kind === "scholar") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 3 2 9l10 6 10-6-10-6Z" />
        <path d="M6 11.5v5.2c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8v-5.2" />
      </svg>
    );
  }
  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h4" />
    </svg>
  );
}

export default function HomePage() {
  const { lang } = useSite();
  useScrollReveal();
  const featured =
    posts.find((post) => !post.draft && post.lang === lang) ??
    posts.find((post) => !post.draft);
  const nisb = projects.find((project) => project.id === "nisb");

  return (
    <div className="page-width home-page">
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="hero-kicker-dot" aria-hidden="true" />
            {lang === "en"
              ? "RESEARCHER · BUILDER · CURIOUS MIND"
              : "研究 · 创造 · 保持好奇"}
          </p>
          <h1 id="home-title">
            {profile.name}
            <span className="chinese-name">{profile.nameZh}</span>
          </h1>
          <p className="hero-affiliation">{profile.role[lang]}</p>
          <div className="hero-profile">
            <figure className="hero-portrait">
              <div className="portrait-mount">
                <Portrait />
                <span className="portrait-corner" aria-hidden="true" />
              </div>
              <figcaption>
                <span>
                  {profile.nameZh} / {profile.name}
                </span>
                <span aria-hidden="true">01</span>
              </figcaption>
            </figure>
            <div className="hero-introduction">
              <p className="hero-statement">{profile.shortBio[lang]}</p>
              <p>{profile.heroNote[lang]}</p>
            </div>
          </div>
          <div className="hero-actions">
            <Link className="button primary" href="/research">
              {lang === "en" ? "Explore my research" : "了解我的研究"}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/projects">
              {lang === "en" ? "Active projects" : "查看项目进展"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="hero-socials" aria-label={lang === "en" ? "Profile links" : "个人链接"}>
            {profile.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-chip"
              >
                <SocialIcon kind={link.kind} />
                <span>{link.label}</span>
                <span className="chip-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
            <a href={`mailto:${profile.email}`} className="social-chip">
              <SocialIcon kind="mail" />
              <span>Email</span>
              <span className="chip-arrow" aria-hidden="true">↗</span>
            </a>
            <Link href="/cv" className="social-chip">
              <SocialIcon kind="cv" />
              <span>CV</span>
              <span className="chip-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <NeuralField lang={lang} />
        </div>
      </section>

      <div className="interlude">
        <span className="eyebrow">
          {lang === "en" ? "A PERSONAL FIELDNOTE" : "一份持续更新的个人手记"}
        </span>
        <p>
          {lang === "en"
            ? "Build carefully. Think openly. Keep asking."
            : "认真构建，开放思考，继续发问。"}
        </p>
        <span className="interlude-updated">
          {lang === "en" ? `UPDATED ${profile.updated.slice(0, 7).replace("-", ".")}` : `更新于 ${profile.updated.slice(0, 7).replace("-", ".")}`}
        </span>
      </div>

      <section
        className="research-showcase"
        data-reveal
        aria-labelledby="selected-title"
      >
        <div className="showcase-heading">
          <div>
            <p className="eyebrow">
              01 / {lang === "en" ? "SELECTED RESEARCH" : "代表研究"}
            </p>
            <h2 id="selected-title">
              {lang === "en" ? (
                <>
                  Ideas, put to <em>the test.</em>
                </>
              ) : (
                <>
                  让想法，<em>经受检验。</em>
                </>
              )}
            </h2>
          </div>
          <Link className="showcase-link" href="/research">
            {lang === "en" ? "All research & BibTeX" : "全部论文与引用"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="research-tiles">
          {publications.slice(0, 3).map((publication, index) => (
            <Link
              key={publication.id}
              className="research-tile"
              href={`/research#${publication.id}`}
              aria-label={`${publication.title} — ${publication.venue[lang]}`}
            >
              <div className="research-tile__top">
                <span>
                  0{index + 1} / {publication.tag}
                </span>
                <span aria-hidden="true">↗</span>
              </div>
              <div className="research-tile__art">
                <ResearchArt kind={publication.artKind} />
                <span className="plate-marker" aria-hidden="true">
                  {publication.plateMarker}
                </span>
              </div>
              <div className="research-tile__copy">
                <div className="research-tile__badges">
                  <span
                    className={`research-tile__status ${
                      publication.statusTone === "accepted" ? "is-accepted" : ""
                    }`}
                  >
                    {publication.venue[lang]}
                  </span>
                  <span className="research-tile__role">
                    {publication.role[lang]}
                  </span>
                </div>
                <h3>{publication.homeTitle[lang]}</h3>
                <p className="research-tile__label">{publication.homeLabel}</p>
                <div className="research-tile__summary">
                  <p>{publication.homeSummary[lang]}</p>
                </div>
                <div className="research-tile__action">
                  <span className="tile-action-label">
                    {lang === "en" ? "Read the research" : "了解这项研究"}
                  </span>
                  <span className="tile-action-meta">
                    {publication.url ? "arXiv" : ""}
                    {publication.url && publication.codeUrl ? " · " : ""}
                    {publication.codeUrl ? "Code" : ""}
                    <span className="tile-action-arrow" aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="showcase-footer">
          <span>
            {lang === "en"
              ? "CAD EVALUATION · LLM SAFETY · EFFICIENT AI"
              : "CAD 几何评测 · 模型安全 · 高效神经网络"}
          </span>
          <span aria-hidden="true">↳</span>
          <span>
            {lang === "en"
              ? "Questions that connect the work."
              : "让问题，连接不同的研究。"}
          </span>
        </div>
      </section>

      <section
        className="updates-spread"
        data-reveal
        aria-labelledby="updates-title"
      >
        <div className="updates-column">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                02 / {lang === "en" ? "RECENT UPDATES" : "近期动态"}
              </p>
              <h2 id="updates-title">
                {lang === "en" ? "Progress log." : "研究进度记录。"}
              </h2>
            </div>
            <Link className="small-link" href="/cv">
              {lang === "en" ? "Full CV" : "完整简历"} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ol className="news-list">
            {news.map((item, idx) => (
              <li key={`${item.date}-${idx}`} className="news-item">
                <Link href={item.href} className="news-link">
                  <div className="news-meta">
                    <time className="news-date">{item.date}</time>
                    <span className={`news-badge is-${item.kind}`}>
                      {item.badge[lang]}
                    </span>
                  </div>
                  <p className="news-text">{item.text[lang]}</p>
                  <span className="news-arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="focus-column">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {lang === "en" ? "ACTIVE RESEARCH" : "当前主力项目"}
              </p>
              <h2>
                {lang === "en" ? "On the bench now." : "正在推进。"}
              </h2>
            </div>
            <Link className="small-link" href="/projects">
              {lang === "en" ? "All projects" : "全部项目"} <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {nisb ? (
            <article className="focus-card">
              <div className="focus-card__art">
                <ResearchArt
                  kind="neurons"
                  label={nisb.subtitle[lang]}
                />
                <span className="focus-card__status">
                  <span className="focus-dot" aria-hidden="true" />
                  {nisb.status[lang]}
                </span>
              </div>
              <div className="focus-card__body">
                <h3>{nisb.subtitle[lang]}</h3>
                <p>{nisb.description[lang]}</p>
                {nisb.milestones ? (
                  <ol className="focus-milestones">
                    {nisb.milestones.map((m, i) => (
                      <li key={m.phase.en} className={i === nisb.milestones!.length - 1 ? "is-current" : ""}>
                        <span className="milestone-step">0{i + 1}</span>
                        <div>
                          <strong>{m.phase[lang]}</strong>
                          <span>{m.text[lang]}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : null}
                <div className="focus-card__footer">
                  <Link className="text-link" href="/projects#nisb">
                    {lang === "en" ? "Read project details" : "查看项目详情"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      {featured ? (
        <section
          className="notebook-feature"
          data-reveal
          aria-labelledby="home-writing-title"
        >
          <div className="notebook-feature__visual">
            <span className="eyebrow">FIELDNOTES / OPEN ENDED</span>
            <ResearchArt
              kind="notes"
              label={
                lang === "en"
                  ? "An open notebook with sketches and questions"
                  : "一本记录草图与问题的手稿"
              }
            />
            <p>
              {lang === "en" ? (
                <>
                  Thinking,
                  <br />
                  <em>in progress.</em>
                </>
              ) : (
                <>
                  思考，
                  <br />
                  <em>正在发生。</em>
                </>
              )}
            </p>
            <span className="notebook-feature__index" aria-hidden="true">
              03
            </span>
          </div>
          <div className="notebook-feature__text">
            <p className="eyebrow">
              03 / {lang === "en" ? "THE NOTEBOOK" : "思考手记"}
            </p>
            <h2 id="home-writing-title">
              {lang === "en" ? "Notes & essays." : "笔记与随笔。"}
            </h2>
            <PostCard post={featured} />
            <Link className="text-link" href="/writing">
              {lang === "en" ? "Visit the notebook" : "打开手记"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      ) : (
        <section className="notebook-strip" data-reveal aria-labelledby="home-writing-title">
          <div className="notebook-strip__meta">
            <span className="eyebrow">
              03 / {lang === "en" ? "FIELDNOTES & CONJECTURES" : "手记与猜想"}
            </span>
            <h2 id="home-writing-title">
              {lang === "en"
                ? "Fieldnotes & open conjectures."
                : "思考手记与开放猜想。"}
            </h2>
          </div>
          <p className="notebook-strip__copy">
            {lang === "en"
              ? "Long-form research essays are being drafted for the notebook; speculative ideas like Looped Transformers live under Open Conjectures."
              : "研究复盘与长篇随笔正在整理中；尚未投入实验的早期构思（如循环 Transformer）则记录在开放猜想栏目里。"}
          </p>
          <div className="notebook-strip__links">
            <Link className="small-link" href="/projects#loops">
              {lang === "en" ? "Open conjectures" : "查看研究猜想"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="small-link" href="/writing">
              {lang === "en" ? "Writing archive" : "进入随笔页"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      )}

      <section
        className="about-strip"
        data-reveal
        aria-labelledby="home-about-title"
      >
        <span className="eyebrow">
          04 / {lang === "en" ? "BEYOND THE WORK" : "研究之外"}
        </span>
        <div>
          <h2 id="home-about-title">
            {lang === "en"
              ? "A person behind the papers."
              : "论文背后，也有日常。"}
          </h2>
          <p>
            {lang === "en"
              ? "I study mathematics and physics at UESTC and do research in Ziyin Liu’s group at Tsinghua. This site is a living record of the questions, code, and experiments along the way."
              : "我在电子科技大学学习数理基础科学，也在清华大学刘子寅课题组参与科研。这份主页记录一路上的问题、代码与实验进展。"}
          </p>
        </div>
        <Link href="/about" className="text-link">
          {lang === "en" ? "More about me" : "更多关于我"}
          <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="contact-band">
        <div>
          <p className="eyebrow">
            {lang === "en" ? "KEEP THE CONVERSATION GOING" : "让交流继续"}
          </p>
          <h2>
            {lang === "en"
              ? "An idea worth exploring?"
              : "有什么值得一起探索的想法？"}
          </h2>
          <p>
            {lang === "en"
              ? "I’m always glad to hear about thoughtful research, collaborations, and interesting questions."
              : "欢迎交流研究想法、合作机会，也欢迎分享一个有趣的问题。"}
          </p>
        </div>
        <a className="text-link" href={`mailto:${profile.email}`}>
          {profile.email} ↗
        </a>
      </section>
    </div>
  );
}
