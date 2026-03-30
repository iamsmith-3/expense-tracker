const apiUrl = "https://your-expense-tracker-backend.onrender.com";

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

async function fetchTransactions() {
  try {
    const response = await fetch(`${apiUrl}/transactions`);
    const transactions = await response.json();

    transactionList.innerHTML = "";

    transactions.forEach((item) => {
      const li = document.createElement("li");
      li.className = "transaction-item";

      li.innerHTML = `
        <div class="transaction-details">
          <strong>${item.title}</strong>
          <span>${item.category} • ${item.type}</span>
        </div>
        <div>
          <span class="transaction-amount">₦${item.amount}</span>
          <button class="delete-btn" onclick="deleteTransaction('${item._id}')">Delete</button>
        </div>
      `;

      transactionList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}

async function fetchSummary() {
  try {
    const response = await fetch(`${apiUrl}/summary`);
    const summary = await response.json();

    incomeEl.textContent = `₦${summary.income}`;
    expenseEl.textContent = `₦${summary.expense}`;
    balanceEl.textContent = `₦${summary.balance}`;
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

async function addTransaction() {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value.trim();

  if (!title || !amount || !category) return;

  try {
    await fetch(`${apiUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, amount, type, category }),
    });

    titleInput.value = "";
    amountInput.value = "";
    categoryInput.value = "";

    fetchTransactions();
    fetchSummary();
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

async function deleteTransaction(id) {
  try {
    await fetch(`${apiUrl}/transactions/${id}`, {
      method: "DELETE",
    });

    fetchTransactions();
    fetchSummary();
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
}

addBtn.addEventListener("click", addTransaction);

fetchTransactions();
fetchSummary();
