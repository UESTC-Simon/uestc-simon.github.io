"use client";

import Link from "next/link";
import {useEffect} from "react";
import {profile,publications,projects} from "@/lib/profile";
import {posts} from "@/lib/posts";
import {useSite} from "./site-shell";
import Portrait from "./portrait";
import NeuralField from "./neural-field";
import ResearchArt from "./research-art";
import {PostCard} from "./writing";

function useScrollReveal(){
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const elements=Array.from(document.querySelectorAll<HTMLElement>(".home-page [data-reveal]"));
  if(media.matches||!("IntersectionObserver" in window))return;
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add("is-revealed");observer.unobserve(entry.target);}}},{threshold:0.08});
  elements.forEach(element=>{if(element.getBoundingClientRect().top>window.innerHeight){element.classList.add("reveal-ready");observer.observe(element);}});
  const stop=()=>{if(media.matches){observer.disconnect();elements.forEach(element=>element.classList.add("is-revealed"));}};
  media.addEventListener("change",stop);
  return()=>{observer.disconnect();media.removeEventListener("change",stop);elements.forEach(element=>element.classList.remove("reveal-ready","is-revealed"));};
 },[]);
}

export default function HomePage(){
 const{lang}=useSite();useScrollReveal();
 const featured=posts.find(post=>!post.draft&&post.lang===lang)??posts.find(post=>!post.draft);
 const cad=projects.find(project=>project.id==="cad");
 return <div className="page-width home-page">
  <section className="hero" aria-labelledby="home-title">
   <div className="hero-copy">
    <p className="eyebrow"><span className="hero-kicker-dot" aria-hidden="true"/>{lang==="en"?"RESEARCHER · BUILDER · CURIOUS MIND":"研究 · 创造 · 保持好奇"}</p>
    <h1 id="home-title">{profile.name}<span className="chinese-name">{profile.nameZh}</span></h1>
    <p className="hero-affiliation">{profile.role[lang]}</p>
    <div className="hero-profile">
     <figure className="hero-portrait"><div className="portrait-mount"><Portrait/><span className="portrait-corner" aria-hidden="true"/></div><figcaption><span>{profile.nameZh} / {profile.name}</span><span aria-hidden="true">01</span></figcaption></figure>
     <div className="hero-introduction"><p className="hero-statement">{profile.shortBio[lang]}</p><p>{lang==="en"?"A place for research, work in progress, and thoughts at the intersection of intelligence and computation.":"在这里记录研究、进行中的项目，以及关于智能与计算的思考。"}</p></div>
    </div>
    <div className="hero-actions"><Link className="button primary" href="/research">{lang==="en"?"Explore my research":"了解我的研究"}<span aria-hidden="true">↗</span></Link><Link className="text-link" href="/writing">{lang==="en"?"Open the notebook":"打开思考手记"}<span aria-hidden="true">↗</span></Link></div>
    <div className="hero-socials">{profile.socialLinks.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}<a href={`mailto:${profile.email}`}>Email ↗</a><Link href="/cv">CV ↗</Link></div>
   </div>
   <div className="hero-visual"><NeuralField lang={lang}/></div>
  </section>

  <div className="interlude"><span className="eyebrow">{lang==="en"?"A PERSONAL FIELDNOTE":"一份持续更新的个人手记"}</span><p>{lang==="en"?"Build carefully. Think openly. Keep asking.":"认真构建，开放思考，继续发问。"}</p><span aria-hidden="true">✳</span></div>

  <section className="research-showcase" data-reveal aria-labelledby="selected-title">
   <div className="showcase-heading"><div><p className="eyebrow">01 / {lang==="en"?"SELECTED WORK":"研究选集"}</p><h2 id="selected-title">{lang==="en"?<>Ideas, put to <em>the test.</em></>:<>让想法，<em>经受检验。</em></>}</h2></div><Link className="showcase-link" href="/research">{lang==="en"?"All research":"全部研究"}<span aria-hidden="true">↗</span></Link></div>
   <div className="research-tiles">
    {publications.slice(0,2).map((publication,index)=><Link key={publication.id} className="research-tile" href={`/research#${publication.id}`} aria-label={`${publication.title} — ${publication.venue[lang]}`}>
     <div className="research-tile__top"><span>0{index+1} / {publication.tag}</span><span aria-hidden="true">↗</span></div>
     <div className="research-tile__art"><ResearchArt kind={index===0?"flow":"network"}/><span className="plate-marker" aria-hidden="true">{index===0?"CODE / CONSTRAINT / SAFETY":"SPIKES / EFFICIENCY / VISION"}</span></div>
     <div className="research-tile__copy"><span className="research-tile__status">{publication.venue[lang]}</span><h3>{index===0?(lang==="en"?"The safety of constrained generation.":"约束生成的安全边界。"):(lang==="en"?"Efficient, spiking intelligence.":"高效的脉冲智能。")}</h3><p className="research-tile__label">{index===0?"Grammar-Constrained Decoding":"FALCON · ANN-to-SNN"}</p><div className="research-tile__summary"><p>{publication.abstract[lang]}</p></div><span className="research-tile__action">{lang==="en"?"Read the research":"了解这项研究"}<span aria-hidden="true">→</span></span></div>
    </Link>)}
    {cad&&<Link className="research-tile" href="/projects#cad" aria-label={`${cad.subtitle[lang]} — ${cad.status[lang]}`}><div className="research-tile__top"><span>03 / GEOMETRY & EVALUATION</span><span aria-hidden="true">↗</span></div><div className="research-tile__art"><ResearchArt kind="cad"/><span className="plate-marker" aria-hidden="true">GEOMETRY / STRUCTURE / FUNCTION</span></div><div className="research-tile__copy"><span className="research-tile__status">{cad.status[lang]}</span><h3>{lang==="en"?"Beyond geometric similarity.":"几何相似之外。"}</h3><p className="research-tile__label">{cad.subtitle[lang]}</p><div className="research-tile__summary"><p>{cad.description[lang]}</p></div><span className="research-tile__action">{lang==="en"?"Explore the project":"走进这个项目"}<span aria-hidden="true">→</span></span></div></Link>}
   </div><div className="showcase-footer"><span>{lang==="en"?"RELIABILITY · EFFICIENCY · EVALUATION":"可靠性 · 效率 · 评测"}</span><span aria-hidden="true">↳</span><span>{lang==="en"?"Questions that connect the work.":"让问题，连接不同的研究。"}</span></div>
  </section>

  <section className="notebook-feature" data-reveal aria-labelledby="home-writing-title">
   <div className="notebook-feature__visual"><span className="eyebrow">FIELDNOTES / OPEN ENDED</span><ResearchArt kind="notes" label={lang==="en"?"An open notebook with sketches and questions":"一本记录草图与问题的手稿"}/><p>{lang==="en"?<>Thinking,<br/><em>in progress.</em></>:<>思考，<br/><em>正在发生。</em></>}</p><span className="notebook-feature__index" aria-hidden="true">02</span></div>
   <div className="notebook-feature__text"><p className="eyebrow">02 / {lang==="en"?"THE NOTEBOOK":"思考手记"}</p><h2 id="home-writing-title">{lang==="en"?"Notes & essays.":"笔记与随笔。"}</h2>{featured?<PostCard post={featured}/>:<div className="writing-coming"><h3>{lang==="en"?"Room for unfinished thoughts.":"给未完成的想法留一点空间。"}</h3><p>{lang==="en"?"Reading notes, research reflections, and longer essays will find a home here. The first entries are still to come.":"这里将收录阅读笔记、研究复盘和更深入的思考。第一篇文章，留待写好后再见。"}</p><span className="notebook-status"><span aria-hidden="true"/> {lang==="en"?"A notebook taking shape":"手记正在成形"}</span></div>}<Link className="text-link" href="/writing">{lang==="en"?"Visit the notebook":"打开手记"}<span aria-hidden="true">↗</span></Link></div>
  </section>

  <section className="about-strip" data-reveal aria-labelledby="home-about-title"><span className="eyebrow">03 / {lang==="en"?"BEYOND THE WORK":"研究之外"}</span><div><h2 id="home-about-title">{lang==="en"?"A person behind the papers.":"论文背后，也有日常。"}</h2><p>{lang==="en"?"I study mathematics and physics at UESTC and do research at Tsinghua. This site is a growing record of what I learn along the way.":"我在电子科技大学学习数理基础科学，也在清华大学参与科研。这份个人主页，记录一路上的学习与探索。"}</p></div><Link href="/about" className="text-link">{lang==="en"?"More about me":"更多关于我"}<span aria-hidden="true">↗</span></Link></section>
  <section className="contact-band"><div><p className="eyebrow">{lang==="en"?"KEEP THE CONVERSATION GOING":"让交流继续"}</p><h2>{lang==="en"?"An idea worth exploring?":"有什么值得一起探索的想法？"}</h2><p>{lang==="en"?"I’m always glad to hear about thoughtful research and interesting questions.":"欢迎交流研究想法，也欢迎分享一个有趣的问题。"}</p></div><a className="text-link" href={`mailto:${profile.email}`}>{profile.email} ↗</a></section>
 </div>;
}
