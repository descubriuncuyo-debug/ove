let DATA={stages:[],programs:[],dates:[]};
let activeArea="Todas";
const normalize=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const escapeHtml=s=>(s||"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function renderStages(){
  stageGrid.innerHTML=DATA.stages.map(s=>`<article class="stage-card"><span class="stage-number">${s.number}</span><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.paragraphs[0]||"")}</p>${s.bullets.length?`<details><summary>Ver qué propone</summary><ul>${s.bullets.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul></details>`:""}</article>`).join("");
}
function renderFilters(){
  const areas=["Todas",...new Set(DATA.programs.map(x=>x.area))];
  areaFilters.innerHTML=areas.map(a=>`<button class="filter ${a===activeArea?"active":""}" data-area="${escapeHtml(a)}" type="button">${escapeHtml(a)}</button>`).join("");
}
function renderPrograms(){
  const q=normalize(searchInput.value);
  const filtered=DATA.programs.filter(p=>(activeArea==="Todas"||p.area===activeArea)&&normalize([p.unit,p.careers,...p.modules].join(" ")).includes(q));
  resultCount.textContent=`${filtered.length} ${filtered.length===1?"resultado":"resultados"}`;
  resultList.innerHTML=filtered.length?filtered.map(p=>`<details class="result-card"><summary><span><span class="area-tag">${escapeHtml(p.area)}</span><span class="unit-name">${escapeHtml(p.unit)}</span><span class="career-name">${escapeHtml(p.careers)}</span></span></summary><div class="result-body"><h4>Módulos o instancias de nivelación</h4><div class="module-list">${p.modules.map(m=>`<span class="module">${escapeHtml(m)}</span>`).join("")}</div></div></details>`).join(""):`<div class="empty"><strong>No encontramos coincidencias.</strong><br>Probá con otra carrera, facultad o módulo.</div>`;
}
function renderDates(){
  const q=normalize(dateSearch.value);
  const rows=DATA.dates.filter(x=>normalize(x.unit).includes(q));
  dateGrid.innerHTML=rows.map(x=>`<article class="date-card"><h3>${escapeHtml(x.unit)}</h3><p>${escapeHtml(x.period)}</p></article>`).join("");
}
async function init(){
  try{DATA=await fetch("data.json").then(r=>{if(!r.ok)throw new Error();return r.json()});}
  catch(e){document.body.innerHTML='<main class="section"><h1>No se pudieron cargar los datos</h1><p>Verificá que el archivo data.json se encuentre junto al index.html.</p></main>';return;}
  unitCount.textContent=new Set(DATA.programs.map(x=>x.unit)).size;
  renderStages();renderFilters();renderPrograms();renderDates();
  searchInput.addEventListener("input",renderPrograms);
  dateSearch.addEventListener("input",renderDates);
  areaFilters.addEventListener("click",e=>{const b=e.target.closest("button[data-area]");if(!b)return;activeArea=b.dataset.area;renderFilters();renderPrograms();});
  clearButton.addEventListener("click",()=>{searchInput.value="";activeArea="Todas";renderFilters();renderPrograms();searchInput.focus()});
}
init();
