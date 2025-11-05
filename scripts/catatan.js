import {
  getRecords,
  saveRecord,
  deleteRecord,
  findIdEdit,
  updateRecord,
  getFilteredRecords,
} from "./data-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM REFERENCES ---
  const containerAction = document.querySelector("#action-bar .container");
  const btnAddMobileDiv = document.querySelector("#action-bar .btn-add-mobile");
  const modal = document.getElementById("transaction-modal");
  const openBtnDesktop = document.getElementById("open-modal-desktop");
  const formInput = document.getElementById("transaction-form");
  const closeBtn = document.getElementById("close-modal-btn");
  const modalTitle = document.querySelector("#transaction-modal h2");
  const saveBtn = document.getElementById("save-transaction-btn");
  const modalContentScroll = document.querySelector(
    "#transaction-modal .modal-content"
  );

  let currentEditId = null;

  // Filter elements
  const yearFilter = document.getElementById("years");
  const monthFilter = document.getElementById("months");
  const dayFilter = document.getElementById("days");

  // --- UI/HELPER FUNCTIONS ---
  function repositionButton() {
    const button = document.getElementById("open-modal-desktop");
    if (!button) return;

    if (window.innerWidth <= 430) {
      if (button.parentNode === containerAction) {
        btnAddMobileDiv.appendChild(button);
      }
    } else {
      if (button.parentNode === btnAddMobileDiv) {
        containerAction.appendChild(button);
      }
    }
  }

  function resetModalToCreate() {
    currentEditId = null;
    modalTitle.textContent = "Tambah Transaksi";
    saveBtn.textContent = "Simpan";
    formInput.reset();
    setModalReadOnly(false);

    if (modalContentScroll) {
      modalContentScroll.scrollTop = 0;
    }
    modal.classList.add("modal-hidden");
  }

  function fillFormForEdit(record) {
    formInput.type.value = record.type;
    formInput.item.value = record.item;
    formInput.amount.value = record.amount;
    formInput.notes.value = record.notes;
    formInput.date.value = record.date;

    const dateString = new Date(record.date).toISOString().substring(0, 10);
    formInput.date.value = dateString;

    modalTitle.textContent = "Edit Transaksi";
    saveBtn.textContent = "Update";
  }

  function dataForDetail(record) {
    formInput.type.value = record.type;
    formInput.item.value = record.item;
    formInput.amount.value = record.amount;
    formInput.notes.value = record.notes;
    if (formInput.notes.value.length === 0) {
      formInput.notes.value = "Anda tidak menambahkan catatan apapun";
    }
    formInput.date.value = record.date;

    const dateString = new Date(record.date).toISOString().substring(0, 10);
    formInput.date.value = dateString;

    modalTitle.textContent = "Edit Transaksi";
    saveBtn.textContent = "Update";
  }

  function setModalReadOnly(isReadOnly) {
    formInput.item.disabled = isReadOnly;
    formInput.amount.disabled = isReadOnly;
    const typeRadios = formInput.querySelectorAll('input[name="type"]');
    typeRadios.forEach((radio) => {
      radio.disabled = isReadOnly;
    });
    formInput.notes.disabled = isReadOnly;
    formInput.date.disabled = isReadOnly;

    if (isReadOnly) {
      document
        .querySelector("#save-transaction-btn")
        .classList.add("modal-hidden");
    } else {
      document
        .querySelector("#save-transaction-btn")
        .classList.remove("modal-hidden");
    }
  }

  function sumTotal(filter = {}) {
    const records = getFilteredRecords(filter);

    // 2. Lakukan Reduksi pada data yang sudah difilter
    const totals = records.reduce(
      (acc, record) => {
        const amount = Number(record.amount);
        if (record.type === "income") {
          acc.income += amount;
        } else if (record.type === "expense") {
          acc.expense += amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    totals.balance = totals.income - totals.expense;

    // 3. Update DOM
    const summaryIncomeAmount = document.querySelector(
      ".summary-card.income .summary-amount"
    );
    const summaryExpenseAmount = document.querySelector(
      ".summary-card.expense .summary-amount"
    );
    const summaryBalance = document.querySelector(
      ".summary-card.balance .summary-amount"
    );

    summaryIncomeAmount.innerHTML = `Rp ${totals.income.toLocaleString(
      "id-ID"
    )}`;
    summaryExpenseAmount.innerHTML = `Rp ${totals.expense.toLocaleString(
      "id-ID"
    )}`;
    summaryBalance.innerHTML = `Rp ${totals.balance.toLocaleString("id-ID")}`;

    const summaryIncomeDetail = document.querySelector(
      ".summary-card.income .summary-detail"
    );
    const summaryExpenseDetail = document.querySelector(
      ".summary-card.expense .summary-detail"
    );
    const summaryBalanceDetail = document.querySelector(
      ".summary-card.balance .summary-detail"
    );

    const incomeCount = records.filter((r) => r.type === "income").length;
    const expenseCount = records.filter((r) => r.type === "expense").length;
    const totalTransaction = incomeCount + expenseCount;

    summaryIncomeDetail.innerHTML = `${incomeCount} Transaksi;`;
    summaryExpenseDetail.innerHTML = `${expenseCount} Transaksi;`;
    summaryBalanceDetail.innerHTML = `${totalTransaction} Total transaksi;`;
  }

  function loadTransactions(filter = {}) {
    const records = getFilteredRecords(filter);

    const container = document.querySelector(".container-list-transactions");
    let html = "<h2>Daftar Transaksi</h2>";

    if (records.length === 0) {
      html += "<p>Belum ada transaksi yang tercatat.</p>";
    } else {
      records.forEach((record) => {
        const sign = record.type === "income" ? "+" : "-";
        const amountClass = record.type;

        const amountIsValid =
          typeof record.amount === "number" &&
          !isNaN(record.amount) &&
          record.amount !== null &&
          record.amount > 0;
        const displayAmount = amountIsValid
          ? record.amount.toLocaleString("id-ID")
          : "0";

        html += `
                    <div class="transaction">
                        <div class="illustration"></div>
                        <div class="explanation">
                            <h3>${record.item}</h3>
                            <p>${new Date(record.date).toLocaleDateString()}</p>
                        </div>
                        <div class="interaction">
                            <h3 class="${amountClass}">${sign} Rp ${displayAmount}</h3>
                            <div class="choise">
                                <button type="button" class="detail" data-id="${
                                  record.id
                                }">Detail</button>
                                <button type="button" class="edit" data-id="${
                                  record.id
                                }">Edit</button>
                                <button type="button" class="delete" data-id="${
                                  record.id
                                }">Hapus</button>
                            </div>
                        </div>
                    </div>
                `;
      });
    }

    container.innerHTML = html;
    setupTransactionListeners();
    sumTotal(filter);
  }

  function setupTransactionListeners() {
    document.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", function () {
        const recordId = this.getAttribute("data-id");
        if (
          confirm(
            `Apakah anda yakin ingin menghapus transaksi (ID: ${recordId})`
          )
        ) {
          deleteRecord(recordId);
          applyFilters();
        }
      });
    });

    document.querySelectorAll(".edit").forEach((button) => {
      button.addEventListener("click", function () {
        const recordId = this.getAttribute("data-id");
        const recordToEdit = findIdEdit(recordId);
        if (!recordToEdit) return;

        currentEditId = recordToEdit.id;
        fillFormForEdit(recordToEdit);
        modal.classList.remove("modal-hidden");
      });
    });

    document.querySelectorAll(".detail").forEach((button) => {
      button.addEventListener("click", function () {
        const recordId = this.getAttribute("data-id");
        const recordToShow = findIdEdit(recordId);
        if (!recordToShow) return;

        dataForDetail(recordToShow);
        setModalReadOnly(true);

        document.getElementById("modal-title").textContent = "Detail Transaksi";
        document.getElementById("close-modal-btn").textContent = "Tutup";
        document
          .querySelector("#save-transaction-btn")
          .classList.add("modal-hidden");

        modal.classList.remove("modal-hidden");
      });
    });
  }

  // --- SUBMIT LISTENER ---
  formInput.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputAmount = parseFloat(formInput.amount.value);
    const inputItem = formInput.item.value.trim();

    if (isNaN(inputAmount) || inputAmount <= 0) {
      alert("Nominal transaksi harus lebih besar dari Rp 0.");
      return;
    }

    if (inputItem === "") {
      alert("Keterangan/Barang tidak boleh kosong.");
      return;
    }

    const isEditing = currentEditId !== null;
    const targetId = isEditing ? currentEditId : Date.now();

    const data = {
      id: targetId,
      type: formInput.type.value,
      item: inputItem,
      amount: inputAmount,
      notes: formInput.notes.value.trim(),
      date: formInput.date.value,
    };

    if (isEditing) {
      updateRecord(data);
    } else {
      saveRecord(data);
    }

    resetModalToCreate();
    applyFilters();
  });

  function applyFilters() {
    const filters = {
      year: yearFilter.value,
      month: monthFilter.value,
      day: dayFilter.value,
    };

    loadTransactions(filters);
    sumTotal(filters);
  }

  yearFilter.addEventListener("change", applyFilters);
  monthFilter.addEventListener("change", applyFilters);
  dayFilter.addEventListener("change", applyFilters);

  openBtnDesktop.addEventListener("click", () => {
    resetModalToCreate();
    const today = new Date().toISOString().substring(0, 10);
    document.getElementById("date").value = today;
    modal.classList.remove("modal-hidden");
  });

  closeBtn.addEventListener("click", resetModalToCreate);

  modal.addEventListener("click", (e) => {
    if (e.target.id === "transaction-modal") {
      resetModalToCreate();
    }
  });

  // Panggil applyFilters() untuk memuat data awal (dengan filter default/kosong)
  applyFilters();

  window.addEventListener("resize", repositionButton);
  repositionButton();
});
