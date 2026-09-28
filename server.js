const http=require('http');
const fs=require('fs');
const path=require('path');
const PORT=process.env.PORT||3000;
const players=new Map();
const ONLINE_MS=50000;
function clean(){const now=Date.now();for(const [id,p] of players)if(now-p.lastSeen>ONLINE_MS)players.delete(id)}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>s+=c);req.on('end',()=>{try{resolve(JSON.parse(s||'{}'))}catch(e){reject(e)}})})}
function send(res,code,data,type='application/json'){res.writeHead(code,{'Content-Type':type,'Cache-Control':'no-store'});res.end(type==='application/json'?JSON.stringify(data):data)}
const server=http.createServer(async(req,res)=>{
 try{
  if(req.url==='/api/player'&&req.method==='POST'){
   const d=await body(req); if(!d.id)return send(res,400,{error:'id'});
   players.set(String(d.id),{id:String(d.id),nick:String(d.nick||'Player1').slice(0,16),level:Math.max(1,Number(d.level)||1),xp:Math.max(0,Number(d.xp)||0),score:Math.max(0,Number(d.score)||0),lastSeen:Date.now()});
   clean(); return send(res,200,{ok:true});
  }
  if(req.url==='/api/leaderboard'&&req.method==='GET'){
   clean(); const list=[...players.values()].sort((a,b)=>b.level-a.level||b.xp-a.xp||b.score-a.score||a.nick.localeCompare(b.nick)).slice(0,5); return send(res,200,{players:list,online:players.size});
  }
  let p=req.url.split('?')[0]; if(p==='/')p='/index.html'; const file=path.join(__dirname,p);
  if(!file.startsWith(__dirname)||!fs.existsSync(file)||fs.statSync(file).isDirectory())return send(res,404,'Not found','text/plain');
  const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};send(res,200,fs.readFileSync(file),types[ext]||'application/octet-stream');
 }catch(e){send(res,500,{error:'server'})}
});
server.listen(PORT,()=>console.log('RNG Pedras online na porta '+PORT));
