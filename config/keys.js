// MongoDB connection.
//
// Set MONGO_URI in your environment (e.g. via `.env` loaded by your shell,
// the systemd unit, or your hosting platform's secret manager). For local
// dev a local mongod on the default port is used as a fallback so the
// server still boots without any extra setup.
//
// IMPORTANT: previous versions of this file checked in production
// credentials. Rotate any credential that was ever committed to git history.

module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nox',
};
