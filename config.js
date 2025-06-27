// API Configuration - Supports both environment variables and direct key
const API_KEY = process.env.TMDB_API_KEY || '79790dd9dbd8d9233e4edeb1af652187';

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_KEY };
}