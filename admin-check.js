

/* =========================
   ADMIN LOGIN
========================= */

function adminLogin(){

  const username =
    document.getElementById("adminUser").value.trim();

  const password =
    document.getElementById("adminPass").value;

  /*
    FIRST DEMO LOGIN

    Username: admin
    Password: admin123
  */

  if(
    username === "admin" &&
    password === "admin123"
  ){

    localStorage.setItem(
      "jalwaAdminLogin",
      "true"
    );

    showAdmin();

  }else{

    alert("Invalid admin username or password.");

  }

}


function showAdmin(){

  document
    .getElementById("loginView")
    .classList.add("hidden");

  document
    .getElementById("adminView")
    .classList.remove("hidden");

  loadDashboard();

}


function adminLogout(){

  localStorage.removeItem(
    "jalwaAdminLogin"
  );

  document
    .getElementById("adminView")
    .classList.add("hidden");

  document
    .getElementById("loginView")
    .classList.remove("hidden");

}


/* =========================
   SECTIONS
========================= */

function showSection(id,button){

  document
    .querySelectorAll(".section")
    .forEach(section => {
      section.classList.add("hidden");
    });

  document
    .getElementById(id)
    .classList.remove("hidden");


  document
    .querySelectorAll(".menu-btn")
    .forEach(btn => {
      btn.classList.remove("active");
    });

  button.classList.add("active");


  const titles = {
    dashboard:"Dashboard",
    users:"Users",
    deposits:"Deposits",
    withdrawals:"Withdrawals",
    transactions:"Transactions",
    notifications:"Notifications",
    settings:"Settings"
  };

  document.getElementById("pageTitle")
    .textContent = titles[id];


  if(id === "dashboard")
    loadDashboard();

  if(id === "users")
    loadUsers();

  if(id === "deposits")
    loadDeposits();

  if(id === "withdrawals")
    loadWithdrawals();

  if(id === "transactions")
    loadTransactions();

  if(id === "notifications")
    loadNotifications();

}


/* =========================
   REQUEST DATA
========================= */

function getRequests(){

  return JSON.parse(
    localStorage.getItem("jalwaRequests") || "[]"
  );

}


/* =========================
   DASHBOARD
========================= */

function loadDashboard(){

  const requests = getRequests();

  const deposits =
    requests.filter(r =>
      r.type === "Deposit" &&
      r.status === "PENDING"
    );

  const withdrawals =
    requests.filter(r =>
      r.type === "Withdrawal" &&
      r.status === "PENDING"
    );


  document.getElementById("totalUsers")
    .textContent =
      localStorage.getItem("jalwaUser") ? "1" : "0";

  document.getElementById("pendingDeposits")
    .textContent = deposits.length;

  document.getElementById("pendingWithdrawals")
    .textContent = withdrawals.length;

  document.getElementById("totalTransactions")
    .textContent = requests.length;


  const recent =
    requests.slice(-5).reverse();

  const box =
    document.getElementById("recentRequests");


  if(!recent.length){

    box.innerHTML =
      `<div class="empty">No requests yet.</div>`;

    return;
  }


  box.innerHTML = `
    <div class="table-wrap">
    <table>
      <tr>
        <th>Type</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Date</th>
      </tr>

      ${recent.map(r => `

        <tr>

          <td>${r.type}</td>

          <td>Rs ${Number(r.amount || 0).toLocaleString()}</td>

          <td>
            <span class="badge ${r.status.toLowerCase()}">
              ${r.status}
            </span>
          </td>

          <td>${r.date || "-"}</td>

        </tr>

      `).join("")}

    </table>
    </div>
  `;

}


/* =========================
   USERS
========================= */

function loadUsers(){

  const saved =
    localStorage.getItem("jalwaUser");

  const box =
    document.getElementById("usersContent");


  if(!saved){

    box.innerHTML =
      `<div class="empty">No users found.</div>`;

    return;
  }


  const user =
    JSON.parse(saved);


  box.innerHTML = `

    <div class="table-wrap">

    <table>

      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Balance</th>
        <th>Referral</th>
        <th>Action</th>
      </tr>

      <tr>

        <td>${user.name || "-"}</td>

        <td>${user.phone || "-"}</td>

        <td>
          Rs ${Number(user.balance || 0).toLocaleString()}
        </td>

        <td>${user.referral || "-"}</td>

        <td>
          <button
            class="action block"
            onclick="adjustBalance()"
          >
            Balance
          </button>
        </td>

      </tr>

    </table>

    </div>
  `;

}


function adjustBalance(){

  const amount =
    prompt("Enter new balance:");

  if(amount === null)
    return;

  const value =
    Number(amount);

  if(isNaN(value) || value < 0){

    alert("Invalid balance.");

    return;
  }


  const saved =
    localStorage.getItem("jalwaUser");

  if(!saved) return;


  const user =
    JSON.parse(saved);

  user.balance = value;


  localStorage.setItem(
    "jalwaUser",
    JSON.stringify(user)
  );


  loadUsers();

  loadDashboard();

  alert("Balance updated.");

}


/* =========================
   DEPOSITS
========================= */

function loadDeposits(){

  const requests = getRequests();

  const deposits =
    requests.filter(r =>
      r.type === "Deposit"
    );

  const box =
    document.getElementById("depositsContent");


  if(!deposits.length){

    box.innerHTML =
      `<div class="empty">No deposit requests.</div>`;

    return;
  }


  box.innerHTML = `

    <div class="table-wrap">

    <table>

      <tr>
        <th>Amount</th>
        <th>Method</th>
        <th>Reference</th>
        <th>Status</th>
        <th>Date</th>
        <th>Action</th>
      </tr>

      ${deposits.map((r,index) => {

        const realIndex =
          requests.indexOf(r);

        return `

        <tr>

          <td>
            Rs ${Number(r.amount || 0).toLocaleString()}
          </td>

          <td>${r.method || "-"}</td>

          <td>${r.reference || "-"}</td>

          <td>
            <span class="badge ${r.status.toLowerCase()}">
              ${r.status}
            </span>
          </td>

          <td>${r.date || "-"}</td>

          <td>

            ${
              r.status === "PENDING"
              ? `
                <button
                  class="action approve"
                  onclick="approveRequest(${realIndex})"
                >
                  APPROVE
                </button>

                <button
                  class="action reject"
                  onclick="rejectRequest(${realIndex})"
                >
                  REJECT
                </button>
              `
              : "-"
            }

          </td>

        </tr>

        `;

      }).join("")}

    </table>

    </div>
  `;

}


/* =========================
   WITHDRAWALS
========================= */

function loadWithdrawals(){

  const requests = getRequests();

  const withdrawals =
    requests.filter(r =>
      r.type === "Withdrawal"
    );

  const box =
    document.getElementById("withdrawalsContent");


  if(!withdrawals.length){

    box.innerHTML =
      `<div class="empty">No withdrawal requests.</div>`;

    return;
  }


  box.innerHTML = `

    <div class="table-wrap">

    <table>

      <tr>
        <th>Amount</th>
        <th>Method</th>
        <th>Bank</th>
        <th>Number</th>
        <th>Name</th>
        <th>Status</th>
        <th>Action</th>
      </tr>

      ${withdrawals.map(r => {

        const realIndex =
          requests.indexOf(r);

        return `

        <tr>

          <td>
            Rs ${Number(r.amount || 0).toLocaleString()}
          </td>

          <td>${r.method || "-"}</td>

          <td>${r.bank || "-"}</td>

          <td>${r.account || "-"}</td>

          <td>${r.accountName || "-"}</td>

          <td>
            <span class="badge ${r.status.toLowerCase()}">
              ${r.status}
            </span>
          </td>

          <td>

            ${
              r.status === "PENDING"
              ? `
                <button
                  class="action approve"
                  onclick="approveRequest(${realIndex})"
                >
                  APPROVE
                </button>

                <button
                  class="action reject"
                  onclick="rejectRequest(${realIndex})"
                >
                  REJECT
                </button>
              `
              : "-"
            }

          </td>

        </tr>

        `;

      }).join("")}

    </table>

    </div>
  `;

}


/* =========================
   APPROVE
========================= */

function approveRequest(index){

  const requests =
    getRequests();

  const request =
    requests[index];


  if(!request)
    return;


  request.status =
    "APPROVED";


  /*
    DEMO BALANCE UPDATE

    Deposit approved:
    amount is added to user balance.

    Withdrawal approved:
    amount is deducted.
  */

  const saved =
    localStorage.getItem("jalwaUser");


  if(saved){

    const user =
      JSON.parse(saved);

    const amount =
      Number(request.amount || 0);


    if(request.type === "Deposit"){

      user.balance =
        Number(user.balance || 0) + amount;

    }
if(request.type === "Deposit" && request.planNumber){

  localStorage.setItem(
    "jalwa_plan_" + request.planNumber,
    Date.now().toString()
  );

}

    if(request.type === "Withdrawal"){

      user.balance =
        Math.max(
          0,
          Number(user.balance || 0) - amount
        );

    }


    localStorage.setItem(
      "jalwaUser",
      JSON.stringify(user)
    );

  }


  localStorage.setItem(
    "jalwaRequests",
    JSON.stringify(requests)
  );


  loadDashboard();
  loadDeposits();
  loadWithdrawals();
  loadTransactions();

  alert("Request approved.");

}


/* =========================
   REJECT
========================= */

function rejectRequest(index){

  const requests =
    getRequests();


  if(!requests[index])
    return;


  requests[index].status =
    "REJECTED";


  localStorage.setItem(
    "jalwaRequests",
    JSON.stringify(requests)
  );


  loadDashboard();
  loadDeposits();
  loadWithdrawals();
  loadTransactions();

  alert("Request rejected.");

}


/* =========================
   TRANSACTIONS
========================= */

function loadTransactions(){

  const requests =
    getRequests();

  const box =
    document.getElementById("transactionsContent");


  if(!requests.length){

    box.innerHTML =
      `<div class="empty">No transactions yet.</div>`;

    return;
  }


  box.innerHTML = `

    <div class="table-wrap">

    <table>

      <tr>
        <th>Type</th>
        <th>Amount</th>
        <th>Method</th>
        <th>Status</th>
        <th>Date</th>
      </tr>

      ${requests.slice().reverse().map(r => `

        <tr>

          <td>${r.type}</td>

          <td>
            Rs ${Number(r.amount || 0).toLocaleString()}
          </td>

          <td>${r.method || "-"}</td>

          <td>
            <span class="badge ${r.status.toLowerCase()}">
              ${r.status}
            </span>
          </td>

          <td>${r.date || "-"}</td>

        </tr>

      `).join("")}

    </table>

    </div>
  `;

}


/* =========================
   NOTIFICATIONS
========================= */

function sendNotification(){

  const text =
    document
      .getElementById("notificationText")
      .value.trim();


  if(!text){

    alert("Write notification first.");

    return;
  }


  const list =
    JSON.parse(
      localStorage.getItem("jalwaNotifications") || "[]"
    );


  list.push({
    text:text,
    date:new Date().toLocaleString()
  });


  localStorage.setItem(
    "jalwaNotifications",
    JSON.stringify(list)
  );


  document.getElementById("notificationText")
    .value = "";


  loadNotifications();

  alert("Notification saved.");

}


function loadNotifications(){

  const list =
    JSON.parse(
      localStorage.getItem("jalwaNotifications") || "[]"
    );


  const box =
    document.getElementById("notificationList");


  if(!list.length){

    box.innerHTML =
      `<div class="empty">No notifications.</div>`;

    return;
  }


  box.innerHTML =
    list.slice().reverse().map(n => `

      <div class="panel">

        <div style="color:#ffe09a;">
          ${n.text}
        </div>

        <div style="font-size:10px;color:#9f896b;margin-top:6px;">
          ${n.date}
        </div>

      </div>

    `).join("");

}


/* =========================
   SETTINGS
========================= */

function saveSettings(){

  const settings = {

    method:
      document.getElementById("paymentMethod").value,

    number:
      document.getElementById("paymentNumber").value,

    name:
      document.getElementById("paymentName").value

  };


  localStorage.setItem(
    "jalwaSettings",
    JSON.stringify(settings)
  );


  alert("Settings saved.");

}


/* =========================
   START
========================= */

window.addEventListener("load",() => {

  const logged =
    localStorage.getItem("jalwaAdminLogin");


  if(logged === "true"){

    showAdmin();

  }

});


