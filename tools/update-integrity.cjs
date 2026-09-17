// Run after editing any browser script or stylesheet, before publishing.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=path.join(__dirname,'../dist');
for(const file of fs.readdirSync(dir).filter(f=>/\.(js|css)$/.test(f))){const p=path.join(dir,file);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'));}
const hash=file=>'sha384-'+crypto.createHash('sha384').update(fs.readFileSync(path.join(dir,file))).digest('base64');
let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
html=html.replace(/<script src="([^"]+)"[^>]*>/g,(_,file)=>`<script src="${file}" integrity="${hash(file)}">`);
html=html.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,file)=>`<link rel="stylesheet" href="${file}" integrity="${hash(file)}">`);
const scripts=[...html.matchAll(/<script src="[^"]+" integrity="([^"]+)"/g)].map(m=>`'${m[1]}'`).join(' ');
const policy=`default-src 'none'; script-src ${scripts}; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; worker-src 'none'; manifest-src 'none'`;
html=html.replace(/(<meta http-equiv="Content-Security-Policy" content=")[^"]+/,(_,prefix)=>prefix+policy);
fs.writeFileSync(path.join(dir,'index.html'),html);
const headers=fs.readFileSync(path.join(dir,'_headers'),'utf8').replace(/Content-Security-Policy: .*/,`Content-Security-Policy: ${policy}; frame-ancestors 'none'`);
fs.writeFileSync(path.join(dir,'_headers'),headers);
console.log('Updated script/style integrity and exact-script content policy.');
