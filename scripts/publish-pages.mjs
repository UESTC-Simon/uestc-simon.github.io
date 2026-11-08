import {spawnSync} from 'node:child_process';
import {mkdtemp,cp,realpath,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
function run(command,args,cwd=root,allowFailure=false){const r=spawnSync(command,args,{cwd,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0&&!allowFailure)throw Error(command+' failed');return r.status;}
run(process.execPath,[path.join(root,'scripts/build-pages.mjs')]);
const tempRoot=await realpath(tmpdir());
const temporary=await mkdtemp(path.join(tempRoot,'shiteng-pages-'));
try{
 await cp(path.join(root,'out'),temporary,{recursive:true});
 run('git',['init','-b','gh-pages'],temporary);
 run('git',['config','user.name','Shiteng Lu'],temporary);
 run('git',['config','user.email','53216610+UESTC-Simon@users.noreply.github.com'],temporary);
 run('git',['remote','add','origin','https://github.com/UESTC-Simon/uestc-simon.github.io.git'],temporary);
 run('git',['fetch','--depth=1','origin','gh-pages'],temporary);
 run('git',['reset','--soft','FETCH_HEAD'],temporary);
 run('git',['add','--all'],temporary);
 if(run('git',['diff','--cached','--quiet'],temporary,true)===0){console.log('No website changes to publish.');}
 else{run('git',['commit','-m','Update static website'],temporary);run('git',['push','origin','HEAD:gh-pages'],temporary);}
 console.log('GitHub Pages: https://uestc-simon.github.io/');
}finally{
 const resolved=await realpath(temporary);
 if(!resolved.startsWith(tempRoot+path.sep)||!path.basename(resolved).startsWith('shiteng-pages-'))throw Error('Unexpected cleanup path');
 await rm(resolved,{recursive:true,force:true});
}
