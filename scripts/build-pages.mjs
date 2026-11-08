import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {writeFile,mkdir,rename,access} from 'node:fs/promises';
import path from 'node:path';
import {buildContent} from './content.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const route=path.resolve(root,'app/writing/[slug]');
const parked=path.resolve(root,'.pages-build/writing-route');
if(![route,parked].every(p=>p.startsWith(root)))throw Error('Unexpected temporary route path');
const exists=async p=>access(p).then(()=>true,()=>false);
if(await exists(parked)&&!await exists(route))await rename(parked,route);
const {count}=await buildContent();
let moved=false;
try{
 if(count===0){await mkdir(path.dirname(parked),{recursive:true});await rename(route,parked);moved=true;}
 const result=spawnSync(process.execPath,[fileURLToPath(new URL('../node_modules/next/dist/bin/next',import.meta.url)),'build','--webpack'],{stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_SITE_URL:'https://uestc-simon.github.io'}});
 if(result.error)throw result.error;
 if(result.status!==0)throw Error('Static export failed');
 await writeFile(new URL('../out/.nojekyll',import.meta.url),'');
}finally{if(moved)await rename(parked,route);}
