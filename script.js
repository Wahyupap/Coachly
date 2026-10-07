const P=[
{id:1,name:"Beginner Running Coaching",cat:"Beginner",price:150000,dur:"4 Weeks",focus:"Running consistency and fundamentals",ico:"🏃",desc:"A structured program for runners who are starting their running journey and want to build consistency.",ben:["Weekly training plan","Basic form and breathing guidance","Progress check-ins"]},
{id:2,name:"5K / 10K Race Preparation",cat:"Race Preparation",price:350000,dur:"6 Weeks",focus:"Speed, endurance, and pacing",ico:"🏅",desc:"A structured program focused on endurance, pacing, and race preparation.",ben:["Interval and tempo sessions","Pacing strategy","Race-week taper plan"]},
{id:3,name:"Half Marathon Coaching",cat:"Race Preparation",price:500000,dur:"8 Weeks",focus:"Long-distance endurance and race strategy",ico:"🏆",desc:"A progressive coaching package for runners preparing for their first or next half marathon.",ben:["Progressive long runs","Fueling and hydration advice","Race strategy"]},
{id:4,name:"Personalized 1-on-1 Coaching",cat:"Personalized Coaching",price:750000,dur:"4 Weeks",focus:"Individual training and coach feedback",ico:"🎯",desc:"A personalized coaching service based on the customer’s individual goals, fitness level, schedule, and running experience.",ben:["Custom plan around your schedule","Direct coach feedback","Flexible weekly adjustments"]}];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rp=n=>"Rp"+n.toLocaleString("en-US");
const ls={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let cart=ls.get("coachly_cart",[]),last=null;
const total=()=>cart.reduce((s,i)=>s+i.price*i.qty,0);
const pick=id=>P.find(p=>p.id===id);

// theme
function setTheme(t){document.body.classList.remove("dark","light");document.body.classList.add(t);$("#theme").textContent=t==="dark"?"☀️":"🌙";ls.set("coachly_theme",t)}
setTheme(ls.get("coachly_theme",matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
$("#theme").onclick=()=>setTheme(document.body.classList.contains("dark")?"light":"dark");

// nav
$$("[data-go]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();document.getElementById(a.dataset.go).scrollIntoView({behavior:"smooth"});$("#links").classList.remove("open")}));
$("#burger").onclick=()=>$("#links").classList.toggle("open");
$("#cartBtn").onclick=()=>$("#cart").scrollIntoView({behavior:"smooth"});
$("#cont").onclick=()=>$("#programs").scrollIntoView({behavior:"smooth"});
addEventListener("scroll",()=>{$("#top").style.display=scrollY>600?"block":"none"});
$("#top").onclick=()=>scrollTo({top:0,behavior:"smooth"});

// services & catalog
$("#svc").innerHTML=P.map(p=>`<div class="card"><div class="ico">${p.ico}</div><h3>${p.name}</h3><div class="price">${rp(p.price)}</div><p class="meta">${p.desc}</p><div class="acts"><button class="btn ghost sm" onclick="showD(${p.id})">View Details</button><button class="btn sm" onclick="add(${p.id})">Add to Cart</button></div></div>`).join("");
function render(){
const q=$("#q").value.toLowerCase(),c=$("#cat").value;
const L=P.filter(p=>(!c||p.cat===c)&&(p.name+p.focus+p.cat).toLowerCase().includes(q));
$("#pg").innerHTML=L.length?L.map(p=>`<div class="card"><div class="ico">${p.ico}</div><span class="tag">${p.cat}</span><h4 style="margin-top:8px">${p.name}</h4><div class="price">${rp(p.price)}</div><div class="meta">⏱ ${p.dur}<br>${p.focus}</div><div class="acts"><button class="btn ghost sm" onclick="showD(${p.id})">View Details</button><button class="btn sm" onclick="add(${p.id})">Add to Cart</button></div></div>`).join(""):`<p class="empty">No programs match your search. Try another keyword or category.</p>`}
$("#q").oninput=render;$("#cat").onchange=render;render();

// cart
function save(){ls.set("coachly_cart",cart);drawCart()}
function add(id){const i=cart.find(x=>x.id===id);i?i.qty++:cart.push({id,name:pick(id).name,price:pick(id).price,qty:1});save()}
function chg(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<1)cart=cart.filter(x=>x.id!==id);save()}
function del(id){cart=cart.filter(x=>x.id!==id);save()}
function drawCart(){
const n=cart.reduce((s,i)=>s+i.qty,0);$("#cnt").textContent=n;$("#cnt2").textContent=n;
$("#items").innerHTML=cart.length?cart.map(i=>`<div class="item"><div><b>${i.name}</b><br><small>${rp(i.price)} each</small><div class="q"><button onclick="chg(${i.id},-1)" aria-label="Decrease">−</button>${i.qty}<button onclick="chg(${i.id},1)" aria-label="Increase">+</button><button class="rm" style="width:auto;border:0;background:none" onclick="del(${i.id})">Remove</button></div></div><b>${rp(i.price*i.qty)}</b></div>`).join(""):`<p class="empty">Your cart is empty. Add a coaching program to begin.</p>`;
$("#sub").textContent=$("#tot").textContent=rp(total())}
$("#clr").onclick=()=>{cart=[];save()};drawCart();

// modals
const open=id=>$(id).classList.add("show"),close=id=>$(id).classList.remove("show");
$$(".ov").forEach(o=>o.addEventListener("click",e=>{if(e.target===o&&o.id!=="receipt")o.classList.remove("show")}));
function showD(id){const p=pick(id);$("#dbody").innerHTML=`<div class="ico">${p.ico}</div><span class="tag">${p.cat}</span><h3>${p.name}</h3><div class="price">${rp(p.price)}</div><p>${p.desc}</p><p class="meta">⏱ Duration: ${p.dur}<br>Focus: ${p.focus}</p><b>Benefits</b><ul>${p.ben.map(b=>`<li>${b}</li>`).join("")}</ul><div class="acts"><button class="btn ghost" onclick="close('#detail')">Close</button><button class="btn" onclick="add(${p.id});close('#detail')">Add to Cart</button></div>`;open("#detail")}
$("#chk").onclick=()=>{
if(!cart.length){alert("Your cart is empty. Add at least one coaching program before checkout.");return}
$("#osum").innerHTML=cart.map(i=>`<div style="display:flex;justify-content:space-between"><span>${i.name} × ${i.qty}</span><span>${rp(i.price*i.qty)}</span></div>`).join("")+`<div style="display:flex;justify-content:space-between;font-weight:700;border-top:1px solid var(--bd);margin-top:8px;padding-top:8px"><span>Total</span><span>${rp(total())}</span></div>`;
$("#amt").value=total();$("#pstat").innerHTML="";open("#checkout")};
$("#cxl").onclick=()=>close("#checkout");
const st=(c,t)=>$("#pstat").innerHTML=`<div class="msg ${c}">${t}</div>`;
$("#cfm").onclick=()=>{
const m=document.querySelector('input[name=pm]:checked'),a=Number($("#amt").value),T=total();
if(!m)return st("bad","Select a payment method (Cash, Card, or Digital Wallet), then confirm again.");
if(!a||a<T)return st("bad",`Payment failed: amount is below the total of ${rp(T)}. Retry with the full amount or choose another payment method.`);
if(m.value!=="Cash"&&Math.random()<.2)return st("bad",`Payment failed: ${m.value} was declined. Retry or choose another payment method.`);
st("ok","Payment successful. Generating receipt…");
const d=new Date(),pad=n=>String(n).padStart(2,"0");
last={id:`COA-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${String(Math.floor(Math.random()*9000)+1000)}`,date:d.toLocaleString(),items:cart.map(i=>({...i})),total:T,paid:a,method:m.value};
setTimeout(()=>{close("#checkout");showR()},600)};
function showR(){const r=last;
$("#rbody").innerHTML=`<div style="text-align:center"><div style="font-size:2.5rem">✅</div><h3>Payment Successful!</h3><div class="logo" style="margin:0">Coach<span>ly</span></div></div>
<p><b>Transaction ID:</b> ${r.id}<br><b>Date &amp; Time:</b> ${r.date}<br><b>Payment Method:</b> ${r.method}</p>
<table><tr><th>Item</th><th>Qty</th><th>Price</th></tr>${r.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>${rp(i.price*i.qty)}</td></tr>`).join("")}
<tr><td colspan="2">Subtotal</td><td>${rp(r.total)}</td></tr><tr><td colspan="2">Discount</td><td>Rp0</td></tr><tr><td colspan="2"><b>Total</b></td><td><b>${rp(r.total)}</b></td></tr><tr><td colspan="2">Paid</td><td>${rp(r.paid)}</td></tr>${r.paid>r.total?`<tr><td colspan="2">Change</td><td>${rp(r.paid-r.total)}</td></tr>`:""}</table>
<div class="stack noprint" style="margin-top:16px"><button class="btn" onclick="print()">Print Receipt</button><button class="btn green" id="nt">New Transaction</button></div>`;
$("#nt").onclick=()=>{cart=[];save();close("#receipt");$("#programs").scrollIntoView({behavior:"smooth"})};
open("#receipt")}

// skill bars
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){$$(".f").forEach(f=>f.style.width=f.dataset.w+"%");o.disconnect()}}),{threshold:.3}).observe($("#bars"));

// contact
$("#cf").addEventListener("submit",e=>{e.preventDefault();let ok=true;
[["fn","Enter your full name."],["em","Enter a valid email address."],["ex","Select your running experience."],["tr","Enter your target race or distance."],["ms","Write a short message."]].forEach(([id,t])=>{
const el=$("#"+id),v=el.value.trim(),bad=!v||(id==="em"&&!/^\S+@\S+\.\S+$/.test(v));
el.parentElement.querySelector(".err").textContent=bad?t:"";if(bad)ok=false});
if(ok){$("#dbody").innerHTML=`<div style="text-align:center"><div style="font-size:2.5rem">🎉</div><h3>Thank you!</h3><p>Your message has been submitted successfully.</p><button class="btn" onclick="close('#detail')">Close</button></div>`;open("#detail");e.target.reset()}});
