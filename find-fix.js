

/* =========================
   JALWA DEMO APP
========================= */


/* PLANS */
const plans = [
  [1,260,60],
  [2,410,60],
  [3,640,60],
  [4,1010,60],
  [5,1580,60],
  [6,2480,60],
  [7,3890,60],
  [8,6100,60],
  [9,9580,60],
  [10,15040,60],
  [11,23610,60],
  [12,37060,60],
  [13,58180,60],
  [14,91320,60],
  [15,143340,60],
  [16,225000,60]
];


let requestType = "deposit";


/* =========================
   AUTH
========================= */

function showRegister(){

  document.getElementById("loginBox")
    .classList.add("hidden");

  document.getElementById("registerBox")
    .classList.remove("hidden");

}


function showLogin(){

  document.getElementById("registerBox")
    .classList.add("hidden");

  document.getElementById("loginBox")
    .classList.remove("hidden");

}


function register(){

  const name =
    document.getElementById("regName").value.trim();

  const phone =
    document.getElementById("regPhone").value.trim();

  const password =
    document.getElementById("regPassword").value;

  const referral =
    document.getElementById("regReferral").value.trim();


  if(!name || !phone || !password){

    toast("Please complete all required fields.");

    return;
  }


  const user = {
    name:name,
    phone:phone,
    password:password,
    referral:referral || "JALWA" + Math.floor(1000 + Math.random()*9000),
    balance:0
  };


  localStorage.setItem(
    "jalwaUser",
    JSON.stringify(user)
  );


  toast("Registration successful.");

  setTimeout(() => {
    showApp();
  },500);

}


function login(){

  const phone =
    document.getElementById("loginPhone").value.trim();

  const password =
    document.getElementById("loginPassword").value;


  const saved =
    localStorage.getItem("jalwaUser");


  if(!saved){

    toast("No demo account found. Please register first.");

    return;
  }


  const user = JSON.parse(saved);


  if(
    phone !== user.phone ||
    password !== user.password
  ){

    toast("Invalid phone number or password.");

    return;
  }


  showApp();

}


/* =========================
   SHOW APP
========================= */

function showApp(){

  document
    .getElementById("authView")
    .classList.add("hidden");

  document
    .getElementById("appView")
    .classList.remove("hidden");


  loadUser();

  renderPlans();

  populateApproval();

}


/* =========================
   USER
========================= */

function loadUser(){

  const saved =
    localStorage.getItem("jalwaUser");


  if(!saved) return;


  const user = JSON.parse(saved);


  document.getElementById("topBalance")
    .textContent = Number(user.balance || 0).toLocaleString();

  document.getElementById("balance")
    .textContent = Number(user.balance || 0).toLocaleString();

  document.getElementById("accountBalance")
    .textContent = Number(user.balance || 0).toLocaleString();

  document.getElementById("accountName")
    .textContent = user.name || "-";

  document.getElementById("accountPhone")
    .textContent = user.phone || "-";

  document.getElementById("accountReferral")
    .textContent = user.referral || "-";


  const referralLink =
    location.href.split("#")[0] +
    "?ref=" +
    encodeURIComponent(user.referral);


  document.getElementById("refLink")
    .textContent = referralLink;

}


function logout(){

  document
    .getElementById("appView")
    .classList.add("hidden");

  document
    .getElementById("authView")
    .classList.remove("hidden");

  showLogin();

}


/* =========================
   PLANS
========================= */

function renderPlans(){
}

  const container =
    document.getElementById("plans");

  container.innerHTML = "";


  plans.forEach(([number,amount,days]) => {

    const savedStart =
      localStorage.getItem("jalwa_plan_" + number);

    const card =
      document.createElement("div");

    card.className = "plan-card";


    card.innerHTML = `

      <div class="plan-name">
        JALWA-${String(number).padStart(2,"0")}
      </div>

      <div class="plan-amount">
        Rs ${amount.toLocaleString()}
      </div>

      <div class="plan-days">
        Duration: ${days} Days
      </div>

      <div class="demo-daily">
        DAILY DEMO: Rs ${(amount/4).toFixed(0)}
      </div>

      <div
        id="status-${number}"
        class="status"
      >
        ${savedStart
          ? "Approved — " + countdownText(savedStart,days)
          : "Waiting for Demo Admin Approval"}
      </div>

      <button
        class="plan-btn"
        onclick="selectPlan(${number},${amount})"
      >
        SELECT PLAN
      </button>

    `;


    container.appendChild(card);

  });




/* =========================
   APPROVAL
========================= */

function populateApproval(){

  const select =
    document.getElementById("approvalPlan");

  select.innerHTML =
    `<option value="">Select Plan</option>`;


  plans.forEach(([number,amount,days]) => {

    const approved =
      localStorage.getItem("jalwa_plan_" + number);


    const option =
      document.createElement("option");

    option.value = number;

    option.textContent =
      `JALWA-${String(number).padStart(2,"0")} — Rs ${amount.toLocaleString()}${approved ? " — APPROVED" : ""}`;


    select.appendChild(option);

  });

}


function approveSelectedPlan(){

  const number =
    Number(document.getElementById("approvalPlan").value);


  if(!number){

    toast("Please select a plan.");

    return;
  }


  const [,amount,days] =
    plans.find(p => p[0] === number);


  localStorage.setItem(
    "jalwa_plan_" + number,
    Date.now().toString()
  );


  renderPlans();

  populateApproval();


  toast(
    `JALWA-${String(number).padStart(2,"0")} approved for demo.`
  );

}


/* =========================
   COUNTDOWN
========================= */

function countdownText(start,days){

  const startTime =
    Number(start);

  const endTime =
    startTime + days * 24 * 60 * 60 * 1000;

  const remaining =
    endTime - Date.now();


  if(remaining <= 0){

    return "Demo period completed";

  }


  const totalSeconds =
    Math.floor(remaining / 1000);

  const d =
    Math.floor(totalSeconds / 86400);

  const h =
    Math.floor((totalSeconds % 86400) / 3600);

  const m =
    Math.floor((totalSeconds % 3600) / 60);

  const s =
    totalSeconds % 60;


  return `${d}d ${h}h ${m}m ${s}s remaining`;

}


function updateTimers(){

  plans.forEach(([number,amount,days]) => {

    const start =
      localStorage.getItem("jalwa_plan_" + number);

    const status =
      document.getElementById("status-" + number);


    if(!status) return;


    if(start){

      status.textContent =
        "Approved — " +
        countdownText(start,days);

    }else{

      status.textContent =
        "Waiting for Demo Admin Approval";

    }

  });

}


setInterval(updateTimers,1000);


/* =========================
   REQUESTS
========================= */

function openRequest(type){

  requestType = type;


  const modal =
    document.getElementById("requestModal");

  const deposit =
    document.getElementById("depositFields");

  const withdraw =
    document.getElementById("withdrawFields");


  modal.classList.remove("hidden");


  if(type === "deposit"){

    document.getElementById("requestTitle")
      .textContent = "Deposit Request";

    deposit.classList.remove("hidden");
    withdraw.classList.add("hidden");


    document.getElementById("reqRef").value = "";
    document.getElementById("reqShot").value = "";


  }else{

    document.getElementById("requestTitle")
      .textContent = "Withdrawal Request";

    deposit.classList.add("hidden");
    withdraw.classList.remove("hidden");


    document.getElementById("wdMethod").value = "";
    document.getElementById("wdBank").value = "";
    document.getElementById("wdAmount").value = "";
    document.getElementById("wdAccount").value = "";
    document.getElementById("wdName").value = "";


    toggleBankList();

  }

}


function toggleBankList(){

  const method =
    document.getElementById("wdMethod").value;

  const bank =
    document.getElementById("wdBank");


  if(method === "bank"){

    bank.classList.remove("hidden");

  }else{

    bank.classList.add("hidden");
    bank.value = "";

  }

}


function submitRequest(){

  if(requestType === "deposit"){

    const amount =
      Number(document.getElementById("reqAmount").value);

    const ref =
      document.getElementById("reqRef").value.trim();


    if(!amount || amount <= 0){

      toast("Please enter a valid deposit amount.");

      return;
    }


    const requests =
      JSON.parse(
        localStorage.getItem("jalwaRequests") || "[]"
      );


    requests.push({

      type:"Deposit", 
    planNumber: selectedPlanNumber,
    
      method:"Easypaisa",

      destination:"03221619080",

      accountName:"Akhtari Bibi",

      amount:amount,

      reference:ref,

      status:"PENDING",

      date:new Date().toLocaleString()

    });


    localStorage.setItem(
      "jalwaRequests",
      JSON.stringify(requests)
    );


    closeModals();


    toast(
      "Deposit request submitted — PENDING DEMO."
    );


  }else{

    const amount =
      Number(document.getElementById("wdAmount").value);

    const method =
      document.getElementById("wdMethod").value;

    const bank =
      document.getElementById("wdBank").value;

    const account =
      document.getElementById("wdAccount").value.trim();

    const name =
      document.getElementById("wdName").value.trim();


    if(!method){

      toast("Please select withdrawal method.");

      return;
    }


    if(method === "bank" && !bank){

      toast("Please select a bank.");

      return;
    }


    if(!amount || amount <= 0){

      toast("Please enter a valid amount.");

      return;
    }


    if(!account || !name){

      toast("Please enter account number and name.");

      return;
    }


    const requests =
      JSON.parse(
        localStorage.getItem("jalwaRequests") || "[]"
      );


    requests.push({

      type:"Withdrawal",

      method:
        method === "bank"
          ? "Bank Account"
          : method === "jazzcash"
            ? "JazzCash"
            : "Easypaisa",

      bank:method === "bank" ? bank : "",

      amount:amount,

      account:account,

      accountName:name,

      status:"PENDING",

      date:new Date().toLocaleString()

    });


    localStorage.setItem(
      "jalwaRequests",
      JSON.stringify(requests)
    );


    closeModals();


    toast(
      "Withdrawal request submitted — PENDING DEMO."
    );

  }

}


/* =========================
   SELECT PLAN
========================= */

let selectedPlanNumber = null;

function selectPlan(number,amount){

  selectedPlanNumber = number;

  document.getElementById("reqAmount")
    .value = amount;

  openRequest("deposit");

}


/* =========================
   MENU
========================= */

function openMenu(){

  document
    .getElementById("sideMenu")
    .classList.add("open");

  document
    .getElementById("overlay")
    .classList.remove("hidden");

}


function closeMenu(){

  document
    .getElementById("sideMenu")
    .classList.remove("open");

  document
    .getElementById("overlay")
    .classList.add("hidden");

}


/* =========================
   ACCOUNT
========================= */

function showAccount(){

  closeMenu();

  document
    .getElementById("homeSection")
    .classList.add("hidden");

  document
    .getElementById("plansSection")
    .classList.add("hidden");

  document
    .getElementById("accountSection")
    .classList.remove("hidden");

  loadUser();

}


function showHome(){

  document
    .getElementById("accountSection")
    .classList.add("hidden");

  document
    .getElementById("homeSection")
    .classList.remove("hidden");

  document
    .getElementById("plansSection")
    .classList.remove("hidden");

}


function scrollToSection(id){

  closeMenu();

  showHome();


  setTimeout(() => {

    const el =
      document.getElementById(id);

    if(el){

      el.scrollIntoView({
        behavior:"smooth"
      });

    }

  },100);

}


/* =========================
   REFERRAL
========================= */

function copyRef(){

  const text =
    document.getElementById("refLink").textContent;


  navigator.clipboard
    .writeText(text)
    .then(() => {

      toast("Referral link copied.");

    })
    .catch(() => {

      toast("Copy not supported in this browser.");

    });

}


/* =========================
   HISTORY
========================= */

function openHistory(){

  closeMenu();


  const requests =
    JSON.parse(
      localStorage.getItem("jalwaRequests") || "[]"
    );


  if(!requests.length){

    toast("No demo requests yet.");

    return;
  }


  const last =
    requests[requests.length - 1];


  toast(
    `${last.type}: ${last.status} — Rs ${Number(last.amount).toLocaleString()}`
  );

}


/* =========================
   CONTACT / CHANNEL
========================= */

function contactAdmin(){

  toast(
    "Admin contact is a demo placeholder."
  );

}


function joinChannel(){

  toast(
    "Channel link is a demo placeholder."
  );

}


/* =========================
   MODAL
========================= */

function closeModals(){

  document
    .getElementById("requestModal")
    .classList.add("hidden");

}


/* =========================
   TOAST
========================= */

let toastTimer;


function toast(message){

  const box =
    document.getElementById("toast");


  box.textContent = message;

  box.style.display = "block";


  clearTimeout(toastTimer);


  toastTimer =
    setTimeout(() => {

      box.style.display = "none";

    },3000);

}


/* =========================
   START APP
========================= */

window.addEventListener("load",() => {

  const saved =
    localStorage.getItem("jalwaUser");


  if(saved){

    showApp();

  }else{

    document
      .getElementById("authView")
      .classList.remove("hidden");

    document
      .getElementById("appView")
      .classList.add("hidden");

  }

});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => {
        console.log("JALWA service worker registered.");
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function installApp(){

  if(!deferredPrompt){
    toast("Install option is not available yet.");
    return;
  }

  deferredPrompt.prompt();

  deferredPrompt.userChoice.then((choice) => {

    if(choice.outcome === "accepted"){
      toast("JALWA installation started.");
    }

    deferredPrompt = null;

  });

}

window.addEventListener("appinstalled", () => {
  toast("JALWA installed successfully.");
});

