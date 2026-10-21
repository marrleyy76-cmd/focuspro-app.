const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const STORE = "focuspro-v1";
const today = new Date().toISOString().slice(0,10);
let data = loadData();
let currentFilter = "all";
let timerSeconds = 25 * 60;
let timerInitial = timerSeconds;
let timerInterval = null;
let timerRunning = false;

function loadData(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if(saved) return {...saved, tasks:Array.isArray(saved.tasks)?saved.tasks:[], habits:saved.habits || {}};
  } catch(e) {}
  return {tasks:[], focusMinutes:0, habits:{}, premiumInterest:false};
}
function saveData(){ try{localStorage.setItem(STORE,JSON.stringify(data));}catch(e){} }
function escapeHtml(value){return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400);}
function navigate(view){
  $$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${view}`));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  const titles={dashboard:"Seu foco começa aqui.",tasks:"Organize suas tarefas.",focus:"Hora de focar.",habits:"Construa bons hábitos.",premium:"Invista no seu foco."};
  $("#pageTitle").textContent=titles[view]||"FocusPro";
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.goto)));
$("#todayLabel").textContent=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(new Date()).toUpperCase();
$("#year").textContent=new Date().getFullYear();

function renderTasks(){
  const tasks = data.tasks;
  const done=tasks.filter(t=>t.done).length;
  $("#completedCount").textContent=done;
  const filtered=tasks.filter(t=>currentFilter==="all"||(currentFilter==="pending"&&!t.done)||(currentFilter==="done"&&t.done));
  const row=t=>`<div class="task-row ${t.done?"done":""}">
    <input class="task-check" type="checkbox" data-task-check="${t.id}" ${t.done?"checked":""} aria-label="Concluir ${escapeHtml(t.title)}">
    <div class="task-copy"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.subject)} · ${t.done?"Concluída":"Pendente"}</small></div>
    ${t.priority==="high"?'<span class="priority">Prioridade alta</span>':""}
    <button class="delete-task" data-delete-task="${t.id}" aria-label="Excluir tarefa">×</button>
  </div>`;
  $("#allTasks").innerHTML=filtered.length?filtered.map(row).join(""):'<div class="empty">Nenhuma tarefa aqui ainda. Adicione a primeira acima ✦</div>';
  const pending=tasks.filter(t=>!t.done).slice(0,3);
  $("#dashboardTasks").innerHTML=pending.length?pending.map(row).join(""):'<div class="empty">Seu espaço está livre. Adicione uma tarefa para começar.</div>';
  $$("[data-task-check]").forEach(input=>input.addEventListener("change",()=>{
    const t=data.tasks.find(t=>t.id===input.dataset.taskCheck);if(t){t.done=input.checked;saveData();renderTasks();}
  }));
  $$("[data-delete-task]").forEach(btn=>btn.addEventListener("click",()=>{
    data.tasks=data.tasks.filter(t=>t.id!==btn.dataset.deleteTask);saveData();renderTasks();toast("Tarefa excluída.");
  }));
}
$("#taskForm").addEventListener("submit",e=>{
  e.preventDefault();const title=$("#taskTitle").value.trim();if(!title)return;
  data.tasks.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title,subject:$("#taskSubject").value,priority:$("#taskPriority").value,done:false,created:Date.now()});
  saveData();$("#taskTitle").value="";currentFilter="all";$$("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));renderTasks();toast("Tarefa adicionada!");navigate("tasks");
});
$$("[data-filter]").forEach(b=>b.addEventListener("click",()=>{currentFilter=b.dataset.filter;$$("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderTasks();}));

const habits=[{id:"read",emoji:"📖",title:"Ler ou revisar",desc:"Reserve um momento para aprender algo."},{id:"water",emoji:"💧",title:"Fazer uma pausa para água",desc:"Cuide de você enquanto estuda."},{id:"plan",emoji:"📝",title:"Planejar o próximo passo",desc:"Escolha uma prioridade para amanhã."}];
function renderHabits(){
  $("#habitList").innerHTML=habits.map(h=>`<label class="habit-row"><span class="habit-emoji">${h.emoji}</span><span class="habit-copy"><strong>${h.title}</strong><p>${h.desc}</p></span><input type="checkbox" data-habit="${h.id}" ${data.habits[today]?.[h.id]?"checked":""} aria-label="${h.title}"></label>`).join("");
  $$("[data-habit]").forEach(input=>input.addEventListener("change",()=>{
    data.habits[today]=data.habits[today]||{};data.habits[today][input.dataset.habit]=input.checked;saveData();renderStats();toast(input.checked?"Hábito marcado!":"Hábito desmarcado.");
  }));
  renderStats();
}
function renderStats(){const h=data.habits[today]||{};$("#habitCount").textContent=`${habits.filter(x=>h[x.id]).length}/3`;$("#focusMinutes").textContent=data.focusMinutes||0;}
function displayTimer(){const m=Math.floor(timerSeconds/60).toString().padStart(2,"0"),s=(timerSeconds%60).toString().padStart(2,"0");$("#timerDisplay").textContent=`${m}:${s}`;}
function stopTimer(){if(timerInterval)clearInterval(timerInterval);timerInterval=null;timerRunning=false;$("#timerStart").textContent="▶ Começar";}
function selectTimer(minutes,mode){stopTimer();timerSeconds=minutes*60;timerInitial=timerSeconds;displayTimer();$("#timerMode").textContent=mode.toUpperCase()==="FOCO"?"SESSÃO DE FOCO":mode.toUpperCase();$$("[data-minutes]").forEach(b=>b.classList.toggle("active",Number(b.dataset.minutes)===minutes));}
$("#timerStart").addEventListener("click",()=>{
  if(timerRunning){stopTimer();return;}
  timerRunning=true;$("#timerStart").textContent="Ⅱ Pausar";
  timerInterval=setInterval(()=>{
    timerSeconds--;displayTimer();
    if(timerSeconds<=0){
      stopTimer();if(timerInitial===25*60){data.focusMinutes=(data.focusMinutes||0)+25;saveData();renderStats();}
      toast("Ciclo concluído! Faça uma pausa e comemore seu progresso.");$("#timerStart").textContent="▶ Começar";
    }
  },1000);
});
$("#timerReset").addEventListener("click",()=>{stopTimer();timerSeconds=timerInitial;displayTimer();});
$$("[data-minutes]").forEach(b=>b.addEventListener("click",()=>selectTimer(Number(b.dataset.minutes),b.dataset.mode)));
$("#subscribeButton").addEventListener("click",()=>{data.premiumInterest=true;saveData();toast("Interesse registrado neste navegador. Nenhuma cobrança foi realizada.");$("#subscribeButton").textContent="Interesse registrado ✓";});
renderTasks();renderHabits();renderStats();displayTimer();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(()=>{});
