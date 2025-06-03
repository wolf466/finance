const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateTotal() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  balanceEl.textContent = `${(income - expense).toFixed(2)}/=`;
  incomeEl.textContent = `${income.toFixed(2)}/=`;
  expenseEl.textContent = `-${expense.toFixed(2)}/=`;
}

function renderList() {
  transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.name}<br><small>${new Date(t.date).toLocaleDateString()} ${new Date(t.date).toLocaleTimeString()}</small></span>
      <span style="color:${t.type === 'income' ? 'green' : 'red'}">
        ${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}/=
      </span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    transactionList.appendChild(li);
  });

  // Add event listener for delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
    button.addEventListener("click", function () {
      const index = button.getAttribute("data-index");
      deleteTransaction(index);
    });
  });
}

function deleteTransaction(index) {
  // Remove transaction from the array
  transactions.splice(index, 1);

  // Update the list and save the updated transactions to localStorage
  updateTotal();
  saveTransactions();
  renderList();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const transaction = {
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(),  // Automatically use the current date and time
    type: formData.get("type") === "income" ? "income" : "expense"
  };
  transactions.push(transaction);
  form.reset();
  updateTotal();
  saveTransactions();
  renderList();
});

updateTotal();
renderList();
