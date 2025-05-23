/**
 * ACDMS - Database Initialization Script
 * 
 * This script creates and initializes the SQLite database for the
 * Agniveer Centralised Data Management System (ACDMS).
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Ensure the db directory exists
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    console.log('Creating db directory...');
    fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, 'agniveer.db');
console.log(`Initializing database at: ${dbPath}`);

// Create a new database (or connect to existing one)
const db = new Database(dbPath);

// Enable foreign keys support
db.pragma('foreign_keys = ON');

// Create the tables
console.log('Creating database tables...');

// Agniveer table
db.exec(`
CREATE TABLE IF NOT EXISTS agniveers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_no TEXT,
    number TEXT,
    rank TEXT,
    name TEXT NOT NULL,
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
    police_verification_status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on common search fields
CREATE INDEX IF NOT EXISTS idx_agniveers_name ON agniveers(name);
CREATE INDEX IF NOT EXISTS idx_agniveers_number ON agniveers(number);
CREATE INDEX IF NOT EXISTS idx_agniveers_district ON agniveers(district);
CREATE INDEX IF NOT EXISTS idx_agniveers_state ON agniveers(state);
`);

// Users table for authentication
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add default admin user if not exists
INSERT OR IGNORE INTO users (username, password, role) 
VALUES ('admin', 'ARCShillong', 'admin');
`);

// Activity logs table to track system usage
db.exec(`
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// Create a sample Agniveer record for testing if the table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM agniveers').get();
if (count.count === 0) {
    console.log('Adding sample data for testing...');
    
    const sampleAgniveer = {
        batch_no: 'AG-001',
        number: '12345678',
        rank: 'Private',
        name: 'Test Agniveer',
        civil_education: 'B.A.',
        date_of_birth: '2000-01-01',
        date_of_enrolment: '2023-01-15',
        medical_category: 'SHAPE-1',
        district: 'East Khasi Hills',
        state: 'Meghalaya',
        village: 'Sample Village',
        police_verification_status: 'Completed'
    };
    
    const stmt = db.prepare(`
        INSERT INTO agniveers (
            batch_no, number, rank, name, civil_education, 
            date_of_birth, date_of_enrolment, medical_category,
            district, state, village, police_verification_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
        sampleAgniveer.batch_no,
        sampleAgniveer.number,
        sampleAgniveer.rank,
        sampleAgniveer.name,
        sampleAgniveer.civil_education,
        sampleAgniveer.date_of_birth,
        sampleAgniveer.date_of_enrolment,
        sampleAgniveer.medical_category,
        sampleAgniveer.district,
        sampleAgniveer.state,
        sampleAgniveer.village,
        sampleAgniveer.police_verification_status
    );
}

// Close the database connection
db.close();

console.log('Database initialization completed successfully!');
console.log('You can now start the application with: node server.js');