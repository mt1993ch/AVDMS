/**
 * Utility functions for the offline chatbot
 * This implements a simple pattern matching approach for an offline chatbot
 */

// Knowledge base for the chatbot
const knowledgeBase = [
  {
    patterns: ['hello', 'hi', 'hey', 'greetings'],
    responses: [
      "Hello! I'm your ACDMS assistant. How can I help you today?",
      "Hi there! How can I assist you with the Agniveer Data Management System?",
      "Welcome to ACDMS! I'm here to help you navigate the system."
    ]
  },
  {
    patterns: ['who are you', 'what are you', 'about you', 'your purpose'],
    responses: [
      "I'm the ACDMS assistant, designed to help you with the Agniveer Centralised Data Management System. I can guide you through using the application and answer questions about its features.",
      "I'm an offline assistant for the ACDMS application. I can help you with data entry, searching, and navigating the system."
    ]
  },
  {
    patterns: ['add agniveer', 'new recruit', 'add new', 'create record'],
    responses: [
      "To add a new Agniveer, click on 'Add a New Agniveer' on the home page. You'll need to fill out 5 sections: Personal Information, Identification, Home Address, Next of Kin Details, and Miscellaneous information.",
      "Adding a new Agniveer is easy! From the home page, select 'Add a New Agniveer'. Fill out all required fields (marked with *) and click Submit when you're done."
    ]
  },
  {
    patterns: ['search', 'find agniveer', 'search database', 'locate record'],
    responses: [
      "To search for records, go to 'Search Database' from the home page. You can search by name, batch number, rank, district, and more. For advanced searches, click 'Show Advanced Filters'.",
      "Need to find someone? Use the Search Database feature. Enter any information you have about the Agniveer, and the system will find matching records."
    ]
  },
  {
    patterns: ['edit', 'update', 'modify', 'change record'],
    responses: [
      "To edit an Agniveer's information, go to 'Data Management', find the record you want to update, and click the 'Edit' button. Make your changes and save.",
      "You can edit any record from the Data Management page. Find the Agniveer you need to update, click Edit, make your changes, and click Save Changes."
    ]
  },
  {
    patterns: ['delete', 'remove', 'erase record'],
    responses: [
      "To delete a record, go to 'Data Management', find the Agniveer, and click the 'Delete' button. You'll need to confirm this action, as deletion cannot be undone.",
      "Deleting records is done from the Data Management page. Find the record, click Delete, and confirm your decision when prompted."
    ]
  },
  {
    patterns: ['import', 'import data', 'upload data'],
    responses: [
      "To import data, go to 'Data Management' and click the 'Import from File' button. You can import data from CSV or Excel files. Make sure your file has column headers that match the system fields.",
      "Import functionality allows you to upload records from spreadsheets. Go to Data Management > Import Data, and select your CSV or Excel file."
    ]
  },
  {
    patterns: ['export', 'export data', 'download data', 'backup'],
    responses: [
      "To export data, go to 'Data Management' and click either 'Export as CSV' or 'Export as Excel'. This will download all records in your chosen format.",
      "Exporting data creates a backup of all records. From Data Management, choose either CSV or Excel format for your export."
    ]
  },
  {
    patterns: ['login', 'credentials', 'authentication', 'password'],
    responses: [
      "The system uses fixed credentials for authentication. The username is 'admin' and the password is 'ARCShillong'.",
      "If you're having trouble logging in, remember that the credentials are: Username: admin, Password: ARCShillong"
    ]
  },
  {
    patterns: ['fields', 'required information', 'data fields', 'form fields'],
    responses: [
      "The Agniveer form has 5 main sections: Personal Information (name, rank, DOB, etc.), Identification (account number, Aadhar, PAN), Home Address, Next of Kin Details, and Miscellaneous information like sports and hobbies.",
      "Required fields include Name, Batch No., Rank, Date of Birth, Date of Enrolment, Medical Category, Village, District, State, PIN Code, Next of Kin Name, and Relationship."
    ]
  },
  {
    patterns: ['validation', 'error', 'form error', 'cannot submit'],
    responses: [
      "If you're getting validation errors, make sure all required fields are filled. Check PIN code (6 digits), Aadhar (12 digits), and PAN (10 alphanumeric characters) formats.",
      "Form validation ensures data accuracy. Common errors include incorrect date formats, invalid PIN codes, or missing required fields. Check the error messages for specific guidance."
    ]
  },
  {
    patterns: ['logout', 'sign out', 'exit'],
    responses: [
      "To logout, click the 'Logout' button in the top-right corner of the navigation bar.",
      "You can logout by clicking the Logout button in the header. This will return you to the login screen."
    ]
  },
  {
    patterns: ['dark mode', 'light mode', 'theme', 'change color'],
    responses: [
      "To toggle between dark and light modes, click the sun/moon icon in the top-right corner of the navigation bar.",
      "You can switch between dark and light themes using the icon in the header. Dark mode is easier on the eyes in low-light environments."
    ]
  },
  {
    patterns: ['thank', 'thanks', 'thank you'],
    responses: [
      "You're welcome! Feel free to ask if you need more help.",
      "Happy to assist! Let me know if there's anything else you need.",
      "No problem! I'm here to help with any other questions you might have."
    ]
  },
  {
    patterns: ['help', 'assist', 'support', 'guidance'],
    responses: [
      "I can help you with using ACDMS! Ask me about adding records, searching, importing/exporting data, or navigating the system.",
      "Need assistance? I can help with all aspects of the ACDMS application. Just tell me what you're trying to do."
    ]
  }
];

// Default responses when no pattern is matched
const defaultResponses = [
  "I'm not sure I understand that question. Could you rephrase it or ask about a specific ACDMS feature?",
  "I don't have information about that. I can help with ACDMS features like adding recruits, searching, exporting data, and navigating the application.",
  "I'm sorry, but I'm specifically designed to help with the ACDMS application. Could you ask something about using the system?"
];

// Generate a response based on user input
function generateChatbotResponse(message) {
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Look for matching patterns
  for (const item of knowledgeBase) {
    if (item.patterns.some(pattern => lowerMessage.includes(pattern))) {
      // Return a random response from the matching pattern
      const randomIndex = Math.floor(Math.random() * item.responses.length);
      return item.responses[randomIndex];
    }
  }
  
  // If no match is found, return a default response
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
}

// Simulate typing delay for more natural chat experience
function simulateTypingDelay() {
  // Random delay between 500ms and 1500ms
  const delay = 500 + Math.random() * 1000;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Get relevant suggestions based on current page
function getPageSuggestions(currentPage) {
  switch (currentPage) {
    case 'home':
      return "From the home page, you can navigate to Search Database, Add a New Agniveer, or Data Management. What would you like to do?";
    case 'add':
      return "When adding a new Agniveer, make sure to fill all required fields. The form is divided into 5 sections. Need help with any specific section?";
    case 'search':
      return "You can search by name, batch number, rank, and more. For more specific searches, try the advanced filters. How can I help with your search?";
    case 'manage':
      return "The Data Management page allows you to view, edit, and delete records. You can also import and export data here. What would you like to know more about?";
    default:
      return "I'm here to help you navigate ACDMS. What would you like to know?";
  }
}