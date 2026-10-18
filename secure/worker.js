// Secure admin gateway. GitHub credentials are Cloudflare Worker secrets, never client code.
const REPO = 'songseung88-sys/reporter-toolkit';
const API = 'https://api.github.com/repos/' + REPO + '/contents/catalog.js';
const RAW = 'https://raw.githubusercontent.com/' + REPO + '/main/';
const COOKIE = '__Host-rt_admin';
const ALLOWED = new Map([
  ['/', 'secure/admin.html'], ['/index.html', 'secure/admin.html'],
  ['/app.js', 'app.js'], ['/styles.css', 'styles.css'], ['/catalog.js', 'catalog.js']
]);
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function secureHeaders(contentType='application/json; charset=utf-8') {
  return {
    'Content-Type': contentType, 'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"
  };
}
function json(body,status=200,extra={}) {
  return new Response(JSON.stringify(body),{status,headers:{...secureHeaders(),...extra}});
}
function equalBytes(a,b){
  if(a.length!==b.length)return false;
  let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
  return diff===0;
}
async function digest(value){
  return new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)));
}
async function equalsSecret(given,expected){
  if(!given||!expected||given.length>500)return false;
  const [a,b]=await Promise.all([digest(given),digest(expected)]);
  return equalBytes(a,b);
}
function b64url(buffer){
  let s='';for(const b of new Uint8Array(buffer))s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function fromB64url(value){
  const b64=value.replace(/-/g,'+').replace(/_/g,'/');
  const bin=atob(b64.padEnd(Math.ceil(b64.length/4)*4,'='));
  return Uint8Array.from(bin,c=>c.charCodeAt(0));
}
function encodeBase64Utf8(value){
  const bytes=encoder.encode(value);
  let binary='';
  for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(binary);
}
async function hmac(value,secret){
  const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return b64url(await crypto.subtle.sign('HMAC',key,encoder.encode(value)));
}
async function newSession(env,remember){
  const expiry=Date.now()+(remember?30:0.5)*24*60*60*1000;
  const payload=b64url(encoder.encode(JSON.stringify({expires:expiry,nonce:crypto.randomUUID()})));
  return payload+'.'+await hmac(payload,env.SESSION_SECRET);
}
async function sessionValid(request,env){
  const cookie=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='));
  if(!cookie||!env.SESSION_SECRET)return false;
  const value=cookie.slice(COOKIE.length+1);
  const pieces=value.split('.');
  if(pieces.length!==2||pieces[0].length>500||pieces[1].length>100)return false;
  try{
    const actual=await hmac(pieces[0],env.SESSION_SECRET);
    if(!equalBytes(encoder.encode(actual),encoder.encode(pieces[1])))return false;
    const data=JSON.parse(decoder.decode(fromB64url(pieces[0])));
    return Number.isFinite(data.expires)&&data.expires>Date.now();
  }catch{return false;}
}
function cookieValue(session,remember){
  return COOKIE+'='+session+'; Path=/; HttpOnly; Secure; SameSite=Strict'+(remember?'; Max-Age=2592000':'');
}
function loginHtml(){
  return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>취재 도구함 | 관리자 로그인</title><style>'+
    'body{margin:0;background:#f5f7fb;color:#17243b;font-family:system-ui,"Malgun Gothic",sans-serif;min-height:100vh;display:grid;place-items:center}'+
    'main{width:min(420px,calc(100vw - 36px));background:#fff;padding:34px;border:1px solid #e4e9f2;border-radius:16px;box-shadow:0 15px 50px #15223812}'+
    'h1{font-size:23px;margin:0 0 10px}p{color:#64748b;font-size:14px;margin:0 0 28px}label{font-size:14px;display:block;margin-bottom:8px}'+
    'input[type=password]{display:block;box-sizing:border-box;width:100%;border:1px solid #cbd5e1;border-radius:9px;padding:13px;font-size:16px}'+
    '.remember{display:flex;align-items:center;gap:8px;margin-top:17px;color:#475569}button{margin-top:22px;width:100%;background:#3b6ef5;color:white;border:0;border-radius:9px;padding:13px;font-size:15px;font-weight:700;cursor:pointer}'+
    '#error{min-height:22px;margin-top:12px;color:#b42318;font-size:13px}</style></head><body>'+
    '<main><h1>취재 도구함</h1><p>관리자 로그인</p><form id="login"><label for="password">비밀번호</label>'+
    '<input id="password" type="password" autocomplete="current-password" required maxlength="500" autofocus>'+
    '<label class="remember"><input id="remember" type="checkbox">이 브라우저에서 로그인 유지 (30일)</label>'+
    '<button type="submit">로그인</button><div id="error" role="alert"></div></form></main>'+
    '<script>document.getElementById("login").addEventListener("submit",async e=>{e.preventDefault();'+
    'const button=e.target.querySelector("button"),message=document.getElementById("error");button.disabled=true;message.textContent="";'+
    'try{const response=await fetch("/api/login",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-Reporter-Toolkit":"admin"},'+
    'body:JSON.stringify({password:document.getElementById("password").value,remember:document.getElementById("remember").checked})});'+
    'document.getElementById("password").value="";if(!response.ok)throw Error("비밀번호를 확인해 주세요.");location.replace("/");}'+
    'catch(err){message.textContent=err.message;button.disabled=false;}});</script></body></html>';
}
async function ghRequest(env,method,body=null,authenticated=true){
  const headers={
    'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',
    'User-Agent':'ReporterToolkitAdminWorker',
    ...(authenticated?{'Authorization':'Bearer '+env.GITHUB_TOKEN}:{}),
    ...(body?{'Content-Type':'application/json'}:{})
  };
  let res;
  try{
    res=await fetch(API,{
      method,headers,
      ...(body?{body:JSON.stringify(body)}:{})
    });
  }catch(err){
    throw Object.assign(new Error('GitHub connection failed'),{code:502});
  }
  const response=await res.json().catch(()=>({}));
  if(!res.ok)throw Object.assign(new Error('GitHub HTTP '+res.status),{code:res.status});
  return response;
}
async function publishedCatalog(env){
  let remote, tokenReadStatus=200;
  // Catalog belongs to a public repository. If the token is rejected, the
  // published catalog can still be read anonymously without weakening PUT auth.
  try{
    remote=await ghRequest(env,'GET');
  }catch(err){
    tokenReadStatus=err.code||502;
    if(![401,403,404,429].includes(tokenReadStatus))throw err;
    remote=await ghRequest(env,'GET',null,false);
  }
  if(!remote||typeof remote.content!=='string'||typeof remote.sha!=='string')
    throw Object.assign(new Error('GitHub returned no file contents'),{code:502});
  let catalog;
  try{
    const encoded=remote.content.replace(/\s/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const script=decoder.decode(fromB64url(encoded));
    const found=script.match(/window\.REPORTER_TOOLKIT_SEED\s*=\s*([\s\S]*?)\s*;\s*$/);
    if(!found)throw Error('No catalog assignment');
    catalog=JSON.parse(found[1]);
    if(!validCatalog(catalog))throw Error('Invalid catalog data');
  }catch{
    throw Object.assign(new Error('GitHub catalog format invalid'),{code:502});
  }
  return {sha:remote.sha,catalog,tokenReadStatus};
}
function validCatalog(c){
  if(!c||c.schema!==1||!Array.isArray(c.tools)||c.tools.length>200)return false;
  const ids=new Set();
  return c.tools.every(t=>{
    if(!t||typeof t.id!=='string'||!/^[a-z0-9_-]{1,70}$/.test(t.id)||ids.has(t.id)||
       typeof t.name!=='string'||!t.name.trim()||!Array.isArray(t.releases)||!Array.isArray(t.guide)||
       t.releases.length>500||t.guide.length>100)return false;
    ids.add(t.id);return true;
  });
}
async function handleApi(request,env,url){
  if(!env.ADMIN_PASSWORD||!env.SESSION_SECRET||!env.GITHUB_TOKEN)
    return json({error:'Worker secrets are not configured'},503);
  const method=request.method;
  if(method!=='GET'&&request.headers.get('Origin')!==url.origin)
    return json({error:'Invalid origin'},403);
  if(method==='POST' && url.pathname==='/api/login'){
    if(request.headers.get('X-Reporter-Toolkit')!=='admin')return json({error:'Invalid request'},403);
    if(Number(request.headers.get('content-length'))>2000)return json({error:'Too large'},413);
    const input=await request.json().catch(()=>({}));
    if(!(await equalsSecret(String(input.password||''),env.ADMIN_PASSWORD)))
      return json({error:'Invalid credentials'},401);
    const remember=input.remember===true;
    return json({ok:true},200,{'Set-Cookie':cookieValue(await newSession(env,remember),remember)});
  }
  if(method==='POST'&&url.pathname==='/api/logout'){
    return json({ok:true},200,{'Set-Cookie':COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'});
  }
  if(!(await sessionValid(request,env)))return json({error:'Login required'},401);
  if(method==='GET'&&url.pathname==='/api/session')return json({ok:true});
  if(method==='GET'&&url.pathname==='/api/diagnostics'){
    let tokenStatus=200, publicCatalogStatus=200;
    try{await ghRequest(env,'GET');}
    catch(err){tokenStatus=err.code||502;}
    try{await publishedCatalog(env);}
    catch(err){publicCatalogStatus=err.code||502;}
    return json({
      secretsConfigured:true,
      githubTokenReadHttpStatus:tokenStatus,
      catalogReadHttpStatus:publicCatalogStatus,
      publishingReady:tokenStatus===200&&publicCatalogStatus===200,
      note:'A successful authenticated GET does not guarantee PUT permission.'
    });
  }
  if(method==='GET'&&url.pathname==='/api/catalog'){
    try{return json(await publishedCatalog(env));}
    catch(err){
      return json({error:'Could not read GitHub catalog',githubStatus:err.code||502},502);
    }
  }
  if(method==='PUT'&&url.pathname==='/api/catalog'){
    if(request.headers.get('X-Reporter-Toolkit')!=='admin')return json({error:'Invalid request'},403);
    if(Number(request.headers.get('content-length'))>1000000)return json({error:'Too large'},413);
    const payload=await request.json().catch(()=>null);
    if(!payload||!validCatalog(payload.catalog)||typeof payload.sha!=='string')return json({error:'Invalid catalog'},400);
    const data=JSON.stringify(payload.catalog,null,2);
    if(data.length>700000)return json({error:'Catalog too large'},413);
    try{
      const current=await ghRequest(env,'GET');
      if(current.sha!==payload.sha)return json({error:'Catalog changed on GitHub',sha:current.sha},409);
      const content='// 취재 도구함 게시 데이터.\nwindow.REPORTER_TOOLKIT_SEED = '+
        data.replace(/[\u2028\u2029]/g,c=>c==='\u2028'?'\\u2028':'\\u2029')+';\n';
      const result=await ghRequest(env,'PUT',{message:'Publish reporter toolkit catalog from secure admin',
        sha:current.sha,branch:'main',content:encodeBase64Utf8(content)});
      return json({ok:true,sha:result.content?.sha});
    }catch(err){
      const status=err.code||502;
      return json({error:status===409?'Conflict':status===401?'GitHub token rejected (401)':status===403?'GitHub token lacks permission or is restricted (403)':'Publish error',code:status},status===409?409:502);
    }
  }
  return json({error:'Not found'},404);
}
async function serveStatic(path){
  const resource=ALLOWED.get(path);
  if(!resource)return new Response('Not found',{status:404,headers:secureHeaders('text/plain; charset=utf-8')});
  const res=await fetch(RAW+resource,{headers:{'User-Agent':'ReporterToolkitAdminWorker'},cache:'no-store'});
  if(!res.ok)return new Response('Source unavailable',{status:502,headers:secureHeaders('text/plain; charset=utf-8')});
  let body=await res.text();
  const isHtml=path==='/'||path==='/index.html';
  if(isHtml)body=body.replace('<script src="catalog.js"></script>','<script>window.REPORTER_ADMIN_SERVER = true;</script><script src="catalog.js"></script>');
  const mime=isHtml?'text/html; charset=utf-8':path.endsWith('.css')?'text/css; charset=utf-8':'application/javascript; charset=utf-8';
  return new Response(body,{headers:secureHeaders(mime)});
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.protocol!=='https:')return new Response('HTTPS required',{status:403});
    if(url.pathname.startsWith('/api/'))return handleApi(request,env,url);
    if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
    if(!(await sessionValid(request,env)))
      return new Response(loginHtml(),{headers:secureHeaders('text/html; charset=utf-8')});
    return serveStatic(url.pathname);
  }
};
