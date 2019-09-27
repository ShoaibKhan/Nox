# Install dependencies for server
cd /Nox
npm install

# Install dependencies for client
cd /Nox/general_client
npm run client-install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
