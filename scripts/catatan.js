import { getRecords, saveRecord, deleteRecord, findIdEdit, updateRecord } from './data-storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const containerAction = document.querySelector('#action-bar .container');
    const btnAddMobileDiv = document.querySelector('#action-bar .btn-add-mobile');
    const modal = document.getElementById('transaction-modal');
    const openBtnDesktop = document.getElementById('open-modal-desktop');
    const formInput = document.getElementById('transaction-form');
    const closeBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.querySelector('#transaction-modal h2');
    const saveBtn = document.getElementById('save-transaction-btn');
    
    let currentEditId = null; 

    // Btton pindah(responsive)
    function repositionButton() {
        const button = document.getElementById('open-modal-desktop');
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
        modalTitle.textContent = 'Input Transaksi Baru';
        saveBtn.textContent = 'Simpan';
        formInput.reset();
        modal.classList.add('modal-hidden');
    }
    
    function fillFormForEdit(record) {
        formInput.type.value = record.type;
        formInput.item.value = record.item;
        formInput.amount.value = record.amount;
        
        const dateString = new Date(record.date).toISOString().substring(0, 10);
        formInput.date.value = dateString; 
        
        modalTitle.textContent = 'Edit Transaksi';
        saveBtn.textContent = 'Update';
    }

    function loadTransactions() {
        const records = getRecords();
        const container = document.querySelector('.container-list-transactions');

        let html = '<h2>Daftar Transaksi</h2>';
        if (records.length === 0) {
             html += '<p>Belum ada transaksi yang tercatat.</p>';
        } else {
             records.forEach(record => {
                 const sign = record.type === 'income' ? '+' : '-';
                 const amountClass = record.type;
                 
                 const amountIsValid = typeof record.amount === 'number' && !isNaN(record.amount) && record.amount !== null && record.amount > 0;
                 const displayAmount = amountIsValid ? record.amount.toLocaleString('id-ID') : '0';
                 
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
                                <button type="button" class="detail" data-id="${record.id}">Detail</button>
                                <button type="button" class="edit" data-id="${record.id}">Edit</button>
                                <button type="button" class="delete" data-id="${record.id}">Hapus</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        container.innerHTML = html;
        setupTransactionListeners();
    }

    function setupTransactionListeners() {
        document.querySelectorAll('.delete').forEach(button => {
             button.addEventListener('click', function () {
                 const recordId = this.getAttribute('data-id');
                 if (confirm(`Apakah anda yakin ingin menghapus transaksi (ID: ${recordId})`)) {
                     deleteRecord(recordId);
                     loadTransactions();
                 };
             });
        });

        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', function() {
                const recordId = this.getAttribute('data-id');
                const recordToEdit = findIdEdit(recordId);
                if(!recordToEdit) return;

                currentEditId = recordToEdit.id;
                fillFormForEdit(recordToEdit);
                modal.classList.remove('modal-hidden');
            });
        });
    }

    formInput.addEventListener('submit', (e) => {
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
            date: formInput.date.value
        };

        if (isEditing) {
            updateRecord(data);
        } else {
            saveRecord(data);
        }

        resetModalToCreate(); 
        loadTransactions(); 
    });

    openBtnDesktop.addEventListener('click', () => { 
        document.getElementById('date').value = new Date().toISOString().substring(0, 10);
        resetModalToCreate(); // Reset sebelum membuka
        modal.classList.remove('modal-hidden');
    });
    

    closeBtn.addEventListener('click', resetModalToCreate); 

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'transaction-modal') {
            resetModalToCreate();
        }
    });

    loadTransactions();

    window.addEventListener('resize', repositionButton);
    repositionButton(); 
});