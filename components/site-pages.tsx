"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { profile, publications, projects } from "@/lib/profile";
import { useSite } from "./site-shell";
import ResearchArt from "./research-art";

type Publication = (typeof publications)[number];

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children ? <div className="page-lead">{children}</div> : null}
    </div>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function ContactBand() {
  const { lang } = useSite();
  return (
    <section className="contact-band" aria-labelledby="contact-band-title">
      <div>
        <p className="eyebrow">{lang === "en" ? "KEEP THE CONVERSATION GOING" : "让交流继续"}</p>
        <h2 id="contact-band-title">{lang === "en" ? "An idea worth exploring?" : "有什么值得一起探索的想法？"}</h2>
        <p>{lang === "en" ? "I’m always glad to hear about thoughtful research and interesting questions." : "欢迎交流研究想法，也欢迎分享一个有趣的问题。"}</p>
      </div>
      <a href={`mailto:${profile.email}`} className="text-link">{profile.email} <Arrow diagonal /></a>
    </section>
  );
}

export { default as HomePage } from "./home-page";

function AuthorList({ authors }: { authors: string }) {
  const fragments = authors.split(profile.name);
  return <>{fragments.map((fragment, index) => <span key={index}>{fragment}{index < fragments.length - 1 ? <strong>{profile.name}</strong> : null}</span>)}</>;
}

function Citation({ publication }: { publication: Publication }) {
  const { lang } = useSite();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  if (!publication.bibtex) return null;

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(publication.bibtex);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
      window.setTimeout(() => { fieldRef.current?.focus(); fieldRef.current?.select(); }, 0);
    }
  }

  return (
    <details className="citation">
      <summary>BibTeX <span aria-hidden="true">+</span></summary>
      <div>
        <pre tabIndex={0}>{publication.bibtex}</pre>
        <button type="button" className="small-link" onClick={copy}>{copyState === "copied" ? (lang === "en" ? "Copied ✓" : "已复制 ✓") : (lang === "en" ? "Copy citation" : "复制引用")}</button>
        <p aria-live="polite" className={copyState === "manual" ? "editorial-note" : "sr-only"}>{copyState === "manual" ? (lang === "en" ? "Select and copy the citation below. Your browser did not allow clipboard access." : "浏览器未允许直接复制，请选中下方引用后手动复制。") : copyState === "copied" ? (lang === "en" ? "Citation copied to clipboard." : "引用已复制到剪贴板。") : ""}</p>
        {copyState === "manual" ? <textarea ref={fieldRef} readOnly value={publication.bibtex} rows={8} aria-label={lang === "en" ? "BibTeX citation to copy manually" : "可手动复制的 BibTeX 引用"} onFocus={(event) => event.currentTarget.select()} /> : null}
      </div>
    </details>
  );
}

function PublicationEntry({ publication, index }: { publication: Publication; index: number }) {
  const { lang } = useSite();
  return (
    <article className="publication" id={publication.id}>
      <div className="publication-side"><span className="eyebrow">{publication.year}</span><ResearchArt kind={index === 0 ? "flow" : "network"} /><span className="figure-label">FIG. {String(index + 1).padStart(2, "0")}</span></div>
      <div className="publication-main">
        <div className="publication-meta"><span>{publication.tag}</span><span>{publication.venue[lang]}</span></div>
        <h2>{publication.title}</h2>
        {publication.authors ? <p className="authors"><AuthorList authors={publication.authors} /></p> : null}
        <p className="author-role">{publication.role[lang]}</p>
        <p>{publication.abstract[lang]}</p>
        <details className="contribution"><summary>{lang === "en" ? "My contribution" : "我的贡献"} <span aria-hidden="true">+</span></summary><p>{publication.contribution[lang]}</p></details>
        {publication.url ? <div className="publication-links"><a href={publication.url} target="_blank" rel="noreferrer" className="text-link">{lang === "en" ? "Read the paper" : "阅读论文"} <Arrow diagonal /></a></div> : null}
        <Citation publication={publication} />
      </div>
    </article>
  );
}

export function ResearchPage() {
  const { lang } = useSite();
  const [filter, setFilter] = useState("all");
  const filters = Array.from(new Set(publications.map((publication) => publication.tag)));
  const filtered = publications.filter((publication) => filter === "all" || publication.tag === filter);
  return (
    <div className="page-width">
      <PageIntro eyebrow={lang === "en" ? "01 / RESEARCH" : "01 / 研究"} title={lang === "en" ? "Questions, made concrete." : "把问题，变成具体的研究。"}>
        {lang === "en" ? "Work on language model safety, efficient neural networks, and how we evaluate intelligent systems." : "围绕语言模型安全、高效神经网络，以及智能系统的评测开展研究。"}
      </PageIntro>
      <div className="filter-tabs" role="group" aria-label={lang === "en" ? "Filter research by topic" : "按研究主题筛选"}>
        <button type="button" className={filter === "all" ? "selected" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{lang === "en" ? "All work" : "全部研究"}<span>{publications.length}</span></button>
        {filters.map((tag) => <button key={tag} type="button" className={filter === tag ? "selected" : ""} aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}<span>{publications.filter((publication) => publication.tag === tag).length}</span></button>)}
      </div>
      <p className="sr-only" aria-live="polite">{lang === "en" ? `${filtered.length} research entries shown` : `显示 ${filtered.length} 项研究`}</p>
      <div className="publications">{filtered.map((publication) => <PublicationEntry key={publication.id} publication={publication} index={publications.indexOf(publication)} />)}</div>
      <div className="editorial-note"><p>{lang === "en" ? "For experiments and exploratory work still taking shape, see the project notebook." : "进行中的实验与探索，收录在项目手记中。"}</p><Link href="/projects" className="text-link">{lang === "en" ? "Explore ongoing projects" : "浏览研究项目"} <Arrow /></Link></div>
      <ContactBand />
    </div>
  );
}

export function ProjectsPage() {
  const { lang } = useSite();
  return (
    <div className="page-width">
      <PageIntro eyebrow={lang === "en" ? "02 / PROJECTS" : "02 / 项目"} title={lang === "en" ? "A workshop for ideas." : "想法的实验场。"}>
        {lang === "en" ? "Working notes from experiments in geometry, neural structure, and computation. Some are taking shape; others are waiting for the next question." : "记录关于几何、神经结构与计算的实验。有些正在推进，有些等待下一个值得追问的问题。"}
      </PageIntro>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project-item" id={project.id} key={project.id}>
            <figure className="project-image">
              <ResearchArt kind={project.kind === "geometry" ? "cad" : project.kind === "neuron" ? "neurons" : "loops"} className="project-plate" label={project.subtitle[lang]} />
              <figcaption className="figure-caption"><span>PLATE {project.number}</span><span>{project.subtitle[lang]}</span></figcaption>
            </figure>
            <div className="project-text">
              <div className="publication-meta"><span>{project.number} / {lang === "en" ? "PROJECT NOTE" : "项目手记"}</span><span className="status-label">{project.status[lang]}</span></div>
              <h2>{project.title[lang]}</h2>
              <p className="muted">{project.subtitle[lang]}</p>
              <p>{project.description[lang]}</p>
              <ul className="tags" aria-label={lang === "en" ? "Project topics" : "项目主题"}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <details className="contribution"><summary>{lang === "en" ? "Inside the project" : "项目详情"} <span aria-hidden="true">+</span></summary><p>{project.details[lang]}</p></details>
              <a className="small-link" href={`mailto:${profile.email}?subject=${encodeURIComponent(project.subtitle.en)}`}>{lang === "en" ? "Discuss this project" : "交流这个项目"} <Arrow diagonal /></a>
            </div>
          </article>
        ))}
      </div>
      <ContactBand />
    </div>
  );
}

function EducationTimeline() {
  const { lang } = useSite();
  return (
    <>
      <div className="timeline-row"><span>{profile.education.period}</span><div><h3>{profile.education.school[lang]}</h3><p>{profile.education.detail[lang]}</p><p className="muted">{profile.education.note[lang]}</p></div></div>
      <div className="timeline-row"><span>{lang === "en" ? "Current" : "目前"}</span><div><h3>{lang === "en" ? "Research Intern · Tsinghua University" : "科研实习 · 清华大学"}</h3><p>{lang === "en" ? "Ziyin Liu’s research group" : "刘子寅课题组"}</p><p className="muted">{lang === "en" ? "Research in artificial intelligence and evaluation." : "参与人工智能与模型评测相关研究。"}</p></div></div>
    </>
  );
}

export function AboutPage() {
  const { lang } = useSite();
  return (
    <div className="page-width">
      <PageIntro eyebrow={lang === "en" ? "04 / ABOUT" : "04 / 关于"} title={lang === "en" ? "Hello, I’m Shiteng." : "你好，我是路仕腾。"}>
        {lang === "en" ? "A student, a researcher, and a work in progress." : "一名学生，一名研究探索者，也一直在学习。"}
      </PageIntro>
      <div className="about-grid">
        <figure className="about-photo"><img src="/images/shiteng-hiking.png" alt={lang === "en" ? "Shiteng Lu hiking among trees and misty mountains" : "路仕腾在林木与云雾环绕的山间徒步"} width="1086" height="1448" /><figcaption className="figure-caption">{lang === "en" ? "A moment outside the notebook." : "手记之外，山野之间。"}</figcaption></figure>
        <div className="about-text">
          <p className="eyebrow">{profile.name} / {profile.nameZh}</p>
          <h2>{lang === "en" ? "Following questions across disciplines." : "跟随问题，走向学科之间。"}</h2>
          <p>{profile.bio[lang]}</p>
          <p>{lang === "en" ? "I like research that turns an interesting question into a careful experiment—and leaves room to change our minds when the evidence asks us to." : "我喜欢从一个有意思的问题出发，把它变成可以认真验证的实验，也愿意随着证据修正自己的理解。"}</p>
          <div className="interest-block"><h3>{lang === "en" ? "Questions I’m following" : "正在关注的方向"}</h3><ul className="tags">{profile.interests.map((interest) => <li key={interest.en}>{interest[lang]}</li>)}</ul><p>{lang === "en" ? "I’m also increasingly curious about neuroscience, and hope to explore how ideas about learning and memory can inform our understanding of intelligent systems." : "我也对神经科学愈发好奇，希望进一步探索学习、记忆与智能系统之间的联系。"}</p></div>
          <div className="about-contact"><a className="text-link" href={`mailto:${profile.email}`}>{profile.email} <Arrow diagonal /></a><Link className="text-link" href="/cv">{lang === "en" ? "Curriculum vitae" : "个人简历"} <Arrow /> </Link>{profile.socialLinks.map((link) => <a key={link.url} className="text-link" href={link.url} target="_blank" rel="noreferrer">{link.label} <Arrow diagonal /></a>)}</div>
        </div>
      </div>
      <section className="education-section" aria-labelledby="about-education-title"><div className="section-heading"><div><p className="eyebrow">THE PATH SO FAR</p><h2 id="about-education-title">{lang === "en" ? "Education & experience" : "教育与经历"}</h2></div><Link href="/cv" className="small-link">{lang === "en" ? "View full CV" : "查看完整简历"} <Arrow /></Link></div><EducationTimeline /></section>
      <ContactBand />
    </div>
  );
}

export function CvPage() {
  const { lang } = useSite();
  return (
    <div className="page-width cv-page">
      <div className="cv-toolbar"><p>{lang === "en" ? "A concise record of my education, research, and projects." : "教育、研究与项目经历的简要记录。"}</p><button type="button" className="button outline" onClick={() => window.print()}>{lang === "en" ? "Print / Save PDF" : "打印 / 保存 PDF"} <span aria-hidden="true">↓</span></button></div>
      <article className="cv-paper">
        <header className="cv-heading"><p className="eyebrow">CURRICULUM VITAE</p><h1>{profile.name} <span className="chinese-name">{profile.nameZh}</span></h1><p>{profile.role[lang]}</p><a href={`mailto:${profile.email}`}>{profile.email}</a></header>
        <section aria-labelledby="cv-interests"><h2 id="cv-interests">{lang === "en" ? "Research interests" : "研究兴趣"}</h2><p>{profile.interests.map((interest) => interest[lang]).join(" · ")}</p></section>
        <section aria-labelledby="cv-education"><h2 id="cv-education">{lang === "en" ? "Education & experience" : "教育与经历"}</h2><EducationTimeline /></section>
        <section aria-labelledby="cv-publications"><h2 id="cv-publications">{lang === "en" ? "Publications & manuscripts" : "论文与研究稿件"}</h2>{publications.map((publication) => <div key={publication.id} className="timeline-row"><span>{publication.year}</span><div><h3>{publication.title}</h3>{publication.authors ? <p><AuthorList authors={publication.authors} /></p> : null}<p className="author-role">{publication.venue[lang]} · {publication.role[lang]}</p><p>{publication.contribution[lang]}</p>{publication.url ? <a className="small-link" href={publication.url} target="_blank" rel="noreferrer">{lang === "en" ? "Paper" : "论文"} <Arrow diagonal /></a> : null}</div></div>)}</section>
        <section aria-labelledby="cv-projects"><h2 id="cv-projects">{lang === "en" ? "Research projects" : "研究项目"}</h2>{projects.map((project) => <div className="timeline-row" key={project.id}><span>{project.status[lang]}</span><div><h3>{project.subtitle[lang]}</h3><p>{project.details[lang]}</p></div></div>)}</section>
        <section aria-labelledby="cv-awards"><h2 id="cv-awards">{lang === "en" ? "Selected awards" : "所获奖励"}</h2>{profile.awards.map((award) => <div className="award-row" key={`${award.year}-${award.title.en}`}><span>{award.year}</span><div><strong>{award.title[lang]}</strong><span className="muted">{award.org[lang]}</span></div></div>)}</section>
        <section aria-labelledby="cv-skills"><h2 id="cv-skills">{lang === "en" ? "Tools & skills" : "工具与技能"}</h2><p>{profile.skills.join(" · ")}</p></section>
        <p className="cv-updated">{lang === "en" ? "Last updated" : "最近更新"}: {profile.updated}</p>
      </article>
    </div>
  );
}

export function NotFoundPage() {
  const { lang } = useSite();
  return <div className="page-width not-found"><p className="eyebrow">404 / {lang === "en" ? "A MISSING PAGE" : "暂未找到"}</p><h1>{lang === "en" ? "An uncharted page." : "这一页，还未被写下。"}</h1><p>{lang === "en" ? "This page may have moved, or the address may be incomplete. There are still plenty of questions to explore." : "页面可能已经移动，或者地址尚不完整。还有许多问题，值得继续探索。"}</p><div className="hero-actions"><Link href="/" className="button primary">{lang === "en" ? "Back to home" : "返回首页"} <Arrow /></Link><Link href="/writing" className="button outline">{lang === "en" ? "Visit the notebook" : "阅读手记"} <Arrow /></Link></div></div>;
}
