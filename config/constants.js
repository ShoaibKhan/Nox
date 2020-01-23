const environment = process.env.NODE_ENV || 'development';
export const PUBLIC_URL = (environment == "development") ? "http://localhost" : "https://csc398dev.utm.utoronto.ca";
