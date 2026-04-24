const CONFIG = {
    // The system now automatically detects if it is running on Render or Localhost
    BACKEND_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8000' 
        : window.location.origin, // On Render, the frontend and backend are on the same URL
        
    SUPABASE_URL: "https://uobwibltjkozkukrizps.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable_16o_ug2cXlKYikikReO4HA_9UG5xwnf"
};

console.log("CIPHERS: Protocol linked to " + CONFIG.BACKEND_URL);
