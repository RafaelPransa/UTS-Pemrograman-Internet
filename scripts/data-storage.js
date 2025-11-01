const STORAGE_KEY = 'financeRecords';

export function getRecords() {
    const recordsJSON = localStorage.getItem(STORAGE_KEY);
    return recordsJSON ? JSON.parse(recordsJSON) : [];
}

export function saveRecord(record) {
    let records = getRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function deleteRecord(id) {
    let records = getRecords();
    records = records.filter(record => record.id !== Number(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function findIdEdit(id) {
    let records = getRecords();
    const foundRecord = records.find(record => record.id === Number(id));
    return foundRecord;
}

export function updateRecord(editedRecord) {
    let records = getRecords();
    
   
    const idToFind = Number(editedRecord.id); 


    const index = records.findIndex(record => record.id === idToFind);

    if (index !== -1) {
        records[index] = editedRecord; 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
}