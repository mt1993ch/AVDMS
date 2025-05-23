// Database schema definition for reference
// This file is mainly for documentation purposes

const AgniveerSchema = {
    // Personal Information
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    batch_no: "TEXT",
    number: "TEXT",
    rank: "TEXT",
    name: "TEXT",
    civil_education: "TEXT",
    date_of_birth: "TEXT",
    date_of_enrolment: "TEXT",
    medical_category: "TEXT",
    date_of_training_commenced: "TEXT",
    
    // Identification
    account_number: "TEXT",
    pan_card_number: "TEXT",
    aadhar_card_number: "TEXT",
    identification_mark_1: "TEXT",
    identification_mark_2: "TEXT",
    
    // Home Address
    village: "TEXT",
    street: "TEXT",
    tehsil: "TEXT", // Tehsil or Taluka Office
    post_office: "TEXT",
    police_station: "TEXT",
    district: "TEXT",
    state: "TEXT",
    pin_code: "TEXT",
    nearest_railway_station: "TEXT",
    
    // Next of Kin (NOK) Details
    nok_name: "TEXT",
    nok_relationship: "TEXT",
    nok_village: "TEXT",
    nok_tehsil: "TEXT",
    nok_post_office: "TEXT",
    nok_police_station: "TEXT",
    nok_district: "TEXT",
    nok_state: "TEXT",
    
    // Miscellaneous
    sports_played: "TEXT",
    hobbies: "TEXT",
    ncc: "TEXT",
    police_verification_status: "TEXT"
};

module.exports = {
    AgniveerSchema
};
