(function(){
const grid=document.getElementById('games-grid');if(!grid)return;
const userId=670957183;
const sources=['https://games.roblox.com','https://games.roproxy.com'];
async function getJSON(paths){
let lastError;
for(const base of sources)for(const path of paths){
try{const res=await fetch(base+path,{signal:AbortSignal.timeout(8500)});if(!res.ok)throw Error(String(res.status));const data=await res.json();if(data&&Array.isArray(data.data))return data;throw Error('invalid response')}catch(err){lastError=err}
}throw lastError||Error('unavailable');
}
async function loadGames(){
try{
const games=[],seen=new Set();let cursor='';
for(let page=0;page<12;page++){
const path='/v2/users/'+userId+'/games?accessFilter=Public&sortOrder=Desc&limit=50'+(cursor?'&cursor='+encodeURIComponent(cursor):'');
const result=await getJSON([path]);
for(const game of result.data){if(game&&game.id&&!seen.has(game.id)){seen.add(game.id);games.push(game)}}
cursor=result.nextPageCursor;if(!cursor)break;
}
if(!games.length){grid.innerHTML='<p class="games-message">no public games found yet.</p>';return}
const ids=games.map(g=>g.id),icons=new Map();
for(let i=0;i<ids.length;i+=100){
const path='/v1/games/icons?universeIds='+ids.slice(i,i+100).join(',')+'&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false';
for(const base of ['https://thumbnails.roblox.com','https://thumbnails.roproxy.com']){
try{const res=await fetch(base+path,{signal:AbortSignal.timeout(8500)});if(!res.ok)continue;const data=await res.json();if(Array.isArray(data.data)){data.data.forEach(icon=>{if(icon.imageUrl)icons.set(icon.targetId,icon.imageUrl)});break}}catch(e){}
}
}
grid.replaceChildren();
for(const game of games){
const card=document.createElement('a');card.className='game-card';card.href='https://www.roblox.com/games/'+(game.rootPlace&&game.rootPlace.id?game.rootPlace.id:game.id);card.target='_blank';card.rel='noopener noreferrer';card.setAttribute('aria-label',game.name+' — visit game');
const img=document.createElement('img');img.alt=game.name;img.loading='lazy';img.src=icons.get(game.id)||'https://placehold.co/512x512/171717/777777?text=game';
const overlay=document.createElement('span');overlay.className='game-overlay';
const title=document.createElement('span');title.className='game-title';title.textContent=game.name;
const visit=document.createElement('span');visit.className='game-visit';visit.textContent='visit game ↗';
overlay.append(title,visit);card.append(img,overlay);grid.append(card);
}
}catch(e){grid.innerHTML='<p class="games-message">couldn\'t load games right now. <a href="https://www.roblox.com/users/670957183/profile#!/creations" target="_blank" rel="noopener noreferrer">view on roblox</a></p>'}
}
loadGames();
})();
