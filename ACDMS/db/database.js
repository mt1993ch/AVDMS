const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'agniveers.db');
let db;

// Initialize database and create tables if they don't exist
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        try {
            db = new Database(dbPath);
            console.log('Connected to the SQLite database.');
            
            // Create tables
            db.exec(`CREATE TABLE IF NOT EXISTS agniveers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                batch_no TEXT,
                number TEXT,
                rank TEXT,
                name TEXT,
                civil_education TEXT,
                date_of_birth TEXT,
                date_of_enrolment TEXT,
                medical_category TEXT,
                date_of_training_commenced TEXT,
                account_number TEXT,
                pan_card_number TEXT,
                aadhar_card_number TEXT,
                identification_mark_1 TEXT,
                identification_mark_2 TEXT,
                village TEXT,
                street TEXT,
                tehsil TEXT,
                post_office TEXT,
                police_station TEXT,
                district TEXT,
                state TEXT,
                pin_code TEXT,
                nearest_railway_station TEXT,
                nok_name TEXT,
                nok_relationship TEXT,
                nok_village TEXT,
                nok_tehsil TEXT,
                nok_post_office TEXT,
                nok_police_station TEXT,
                nok_district TEXT,
                nok_state TEXT,
                sports_played TEXT,
                hobbies TEXT,
                ncc TEXT,
                police_verification_status TEXT
            )`);
            
            console.log('Database and tables ready.');
            resolve();
        } catch (err) {
            console.error('Database initialization error: ', err);
            reject(err);
        }
    });
}

// Get all Agniveers
function getAllAgniveers() {
    return new Promise((resolve, reject) => {
        try {
            const stmt = db.prepare('SELECT * FROM agniveers');
            const rows = stmt.all();
            resolve(rows);
        } catch (err) {
            console.error('Error fetching all agniveers: ', err);
            reject(err);
        }
    });
}

// Add a new Agniveer
function addAgniveer(agniveerData) {
    return new Promise((resolve, reject) => {
        try {
            // Filter out any fields that don't exist in the database
            const validFields = [
                'batch_no', 'number', 'rank', 'name', 'civil_education', 'date_of_birth',
                'date_of_enrolment', 'medical_category', 'date_of_training_commenced',
                'account_number', 'pan_card_number', 'aadhar_card_number', 
                'identification_mark_1', 'identification_mark_2', 'village', 'street',
                'tehsil', 'post_office', 'police_station', 'district', 'state', 
                'pin_code', 'nearest_railway_station', 'nok_name', 'nok_relationship',
                'nok_village', 'nok_tehsil', 'nok_post_office', 'nok_police_station', 
                'nok_district', 'nok_state', 'sports_played', 'hobbies', 'ncc',
                'police_verification_status'
            ];
            
            const cleanedData = {};
            
            // Map the data to valid field names
            for (const field of validFields) {
                if (agniveerData[field] !== undefined) {
                    cleanedData[field] = agniveerData[field];
                }
            }
            
            // If no valid fields, reject
            if (Object.keys(cleanedData).length === 0) {
                return reject(new Error('No valid fields provided for import'));
            }
            
            // Create SQL with quoted column names to avoid SQL injection
            const columns = Object.keys(cleanedData).map(col => `"${col}"`).join(',');
            const placeholders = Object.keys(cleanedData).map(() => '?').join(',');
            const values = Object.values(cleanedData);
            
            const sql = `INSERT INTO agniveers (${columns}) VALUES (${placeholders})`;
            const stmt = db.prepare(sql);
            const info = stmt.run(...values);
            
            resolve(info.lastInsertRowid);
        } catch (err) {
            console.error('Error adding agniveer: ', err);
            reject(err);
        }
    });
}

// Update an Agniveer
function updateAgniveer(agniveerData) {
    return new Promise((resolve, reject) => {
        try {
            const id = agniveerData.id;
            delete agniveerData.id;
            
            const updates = Object.keys(agniveerData).map(key => `${key} = ?`).join(',');
            const values = [...Object.values(agniveerData), id];
            
            const sql = `UPDATE agniveers SET ${updates} WHERE id = ?`;
            const stmt = db.prepare(sql);
            const info = stmt.run(...values);
            
            resolve(info.changes);
        } catch (err) {
            console.error('Error updating agniveer: ', err);
            reject(err);
        }
    });
}

// Delete an Agniveer
function deleteAgniveer(id) {
    return new Promise((resolve, reject) => {
        try {
            const sql = 'DELETE FROM agniveers WHERE id = ?';
            const stmt = db.prepare(sql);
            const info = stmt.run(id);
            
            resolve(info.changes);
        } catch (err) {
            console.error('Error deleting agniveer: ', err);
            reject(err);
        }
    });
}

// Search Agniveers with filters
function searchAgniveers(filters) {
    return new Promise((resolve, reject) => {
        try {
            let conditions = [];
            let values = [];
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value.trim() !== '') {
                    conditions.push(`${key} LIKE ?`);
                    values.push(`%${value}%`);
                }
            });
            
            let sql = 'SELECT * FROM agniveers';
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            
            const stmt = db.prepare(sql);
            const rows = stmt.all(...values);
            
            resolve(rows);
        } catch (err) {
            console.error('Error searching agniveers: ', err);
            reject(err);
        }
    });
}

module.exports = {
    initializeDatabase,
    getAllAgniveers,
    addAgniveer,
    updateAgniveer,
    deleteAgniveer,
    searchAgniveers
};
