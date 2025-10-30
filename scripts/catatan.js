document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#action-bar button');
    const targetParent = document.querySelector('#action-bar .btn-add-mobile');
    const container = document.querySelector('#action-bar .container')

    function repositionButton() {
        if (window.innerWidth <= 430) {
            if (button.parentNode === container) {
                 targetParent.appendChild(button); // Pindahkan elemen
            }
        } else {
                 container.appendChild(button); // Kembalikan elemen
            
        }
    }

    window.addEventListener('resize', repositionButton);
    repositionButton(); // Jalankan sekali saat dimuat

    // pop up form tambah transaksi
    const modal = document.getElementById('transaction-modal');
    const openBtn = document.querySelector('#action-bar button');
    const closeBtn = document.getElementById('close-modal-btn');
    const form = document.getElementById('transaction-form');

    openBtn.addEventListener('click', () => {
        document.getElementById('date').value = new Date().toISOString().substring(0, 10);
        modal.classList.remove('modal-hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('modal-hidden');
        form.reset();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('modal-hidden');
            form.reset();
        };
    });

    // Simpan data(create)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newRecord = {
        id: Date.now(),
        type: form.type.value,
        item: form.item.value,
        amount: parseFloat(form.amount.value),
        date: form.date.value
        };

        saveRecord(newRecord);
        modal.classList.add('modal-hidden');
        form.reset();

        loadTransactions();
    });

    // Local Storage
    function getRecords() {
        const recordsJSON = localStorage.getItem('financeRecords');
        return recordsJSON ? JSON.parse(recordsJSON) : [];
    };

    function saveRecord(record) {
        let records = getRecords();
        records.push(record);
        localStorage.setItem('financeRecords', JSON.stringify(records));
    };

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

                html += `
                <div class="transaction">
                    <div class="illustration"></div>
                    <div class="explanation">
                        <h3>${record.item}</h3>
                        <p>${new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <div class="interaction">
                        <h3 class="${amountClass}">${sign} Rp ${record.amount.toLocaleString('id-ID')}</h3>
                        <div class="choise">
                            <button type="button" class="detail" data-id="${record.id}">Detail</button>
                            <button type="button" class="edit" data-id="${record.id}">Edit</button>
                            <button type="button" class="delete" data-id="${record.id}">Hapus</button>
                        </div>
                    </div>
                </div>
                `;
            });
        };
        container.innerHTML = html;
        setupTransactionListeners();
    };

    // Delete data
    function deleteRecord(id) {
        let records = getRecords();

        records = records.filter(record => record.id !== Number(id));

        localStorage.setItem('financeRecords', JSON.stringify(records));
    };

    function setupTransactionListeners() {
        const deleteBtn = document.querySelectorAll('.delete');
        deleteBtn.forEach(button => {
            button.addEventListener('click', function () {
                const recordId = this.getAttribute('data-id');
                if (confirm(`Apakah anda yakin ingin menghapus transaksi (ID: ${recordId})`)) {
                    deleteRecord(recordId);
                    loadTransactions();
                };
            });
        });
    };
    loadTransactions();
});