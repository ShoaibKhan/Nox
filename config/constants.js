const environment = process.env.NODE_ENV || 'development';
export const PublicURL = (environment == "development") ? "http://localhost" : "https://csc398dev.utm.utoronto.ca";
