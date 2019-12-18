# Nox

Nox is a communication platform designed for educational insitutions. Targeted at closing the communication gap between professors and students by allowing professors to get realtime feedback on students level of understanding while they teach. 

# Development setup 

We provide a setup script which installs all necessary dependencies for server and client. 

```
nox_setup.sh
```

First, you clone the repository into your choice of folder. 

# Running Nox

Here are the steps needed to run the application from your own machine:

1) Open up your termincal, and clone the repository into your designated folder. 

2) Install dependencies for server
```
cd /Nox
npm install
```

3) Install dependencies for client
cd /Nox/general_client
```
cd /Nox/general_client
npm install
```
4) Run the client & server with concurrently, inside of the Nox folder
```
npm run dev
```
# Additional Information

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
