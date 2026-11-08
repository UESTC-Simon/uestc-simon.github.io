"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {createContext,useContext,useEffect,useState} from "react";
import {profile,type Lang} from "@/lib/profile";

const Context=createContext<{lang:Lang;setLang:(v:Lang)=>void;theme:string;toggleTheme:()=>void}>({lang:"en",setLang:()=>{},theme:"light",toggleTheme:()=>{}});
export const useSite=()=>useContext(Context);
export function SiteProvider({children}:{children:React.ReactNode}){
 const [lang,setLanguage]=useState<Lang>("en"); const[theme,setTheme]=useState("light");
 useEffect(()=>{try{const l=localStorage.getItem("sl-language");if(l==="zh"||l==="en")setLanguage(l);if(localStorage.getItem("sl-theme")==="dark")setTheme("dark");}catch{}},[]);
 useEffect(()=>{document.documentElement.lang=lang==="zh"?"zh-CN":"en";document.documentElement.dataset.theme=theme;},[lang,theme]);
 const setLang=(l:Lang)=>{setLanguage(l);try{localStorage.setItem("sl-language",l);}catch{}};
 const toggleTheme=()=>setTheme(t=>{const n=t==="light"?"dark":"light";try{localStorage.setItem("sl-theme",n);}catch{}return n;});
 return <Context.Provider value={{lang,setLang,theme,toggleTheme}}>{children}</Context.Provider>;
}
export function SiteShell({children}:{children:React.ReactNode}){
 const{lang,setLang,theme,toggleTheme}=useSite();const path=usePathname();const[menu,setMenu]=useState(false);
 useEffect(()=>{setMenu(false);},[path]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenu(false);};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[]);
 const nav=[["/research","Research","研究"],["/projects","Projects","项目"],["/writing","Writing","随笔"],["/about","About","关于"]];
 return <><a className="skip-link" href="#main">{lang==="en"?"Skip to content":"跳转到正文"}</a><header className="site-header"><div className="header-inner"><Link href="/" className="wordmark" aria-label="Shiteng Lu — Home"><span className="brand-symbol" aria-hidden="true">✳</span><span>SHITENG LU<span className="brand-note">RESEARCH & FIELDNOTES</span></span></Link><nav className={menu?"main-nav is-open":"main-nav"} id="main-nav" aria-label={lang==="en"?"Main navigation":"主导航"}>{nav.map(([url,en,zh])=><Link href={url} key={url} className={path.startsWith(url)?"active":""} aria-current={path.startsWith(url)?"page":undefined}>{lang==="en"?en:zh}</Link>)}</nav><div className="header-tools"><div className="language-toggle" role="group" aria-label="Language / 语言"><button type="button" onClick={()=>setLang("zh")} aria-pressed={lang==="zh"} aria-label="切换到中文" lang="zh-CN">中文</button><button type="button" onClick={()=>setLang("en")} aria-pressed={lang==="en"} aria-label="Switch to English" lang="en">English</button></div><button className="theme-button" onClick={toggleTheme} aria-label={lang==="en"?(theme==="light"?"Switch to night reading":"Switch to day reading"):(theme==="light"?"切换夜间阅读":"切换日间阅读")}>{theme==="light"?<Moon/>:<Sun/>}</button><button className="menu-toggle" aria-expanded={menu} aria-controls="main-nav" aria-label={lang==="en"?"Toggle menu":"展开导航"} onClick={()=>setMenu(!menu)}>{menu?"×":"☰"}</button></div></div></header><main id="main" tabIndex={-1}>{children}</main><footer className="site-footer"><div><Link href="/" className="footer-name">Shiteng Lu <span>路仕腾</span></Link><p>{lang==="en"?"A small space for research, curiosity, and thinking out loud.":"留一处空间，记录研究、好奇与正在形成的想法。"}</p></div><div className="footer-links">{profile.socialLinks.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}<a href={`mailto:${profile.email}`}>Email ↗</a><Link href="/cv">CV ↗</Link><a href="/feed.xml">RSS ↗</a><a href="#main">{lang==="en"?"Back to top ↑":"回到顶部 ↑"}</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Shiteng Lu</span><span>{lang==="en"?"Always a work in progress.":"保持好奇，持续更新。"}</span></div></footer></>;
}
function Moon(){return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg>;}
function Sun(){return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>;}
