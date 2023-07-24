# Nox

Nox is a communication platform designed for educational insitutions. Targeted at closing the communication gap between professors and students by allowing professors to get realtime feedback on students level of understanding while they teach.

# User Guide for Teachers 

1) Head on over to the Nox website: https://csc398dev.utm.utoronto.ca

2) Click "Login" on the top right corner. 

![alt text](https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Desktop_home.png "Nox desktop home")

3) Login using your utorID via secured authenticator. 

![alt text](https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Desktop_login.png "Nox professor login")

4) Easily add a new session or analyze your past sessions. 

<img src="https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Prof_sessions.png" width="400" height="300" ref="Nox create session" />

5) Write the code on the board, say it outload or share with all the students so they can connect to your session!

![alt text](https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Prof_dashboard.png "Nox professor dashboard")

6) Start a poll!

![alt text](https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Prof_poll.png "Nox professor poll")

Recommended Usage: Teachers should occasionally tell students to ask questions using the app, and then teachers should respond to those questions.

# User Guide for Students

1) Head on over to the Nox website: https://csc398dev.utm.utoronto.ca

2) Enter the session code provided by your teacher. 
<img src="https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Mobile_login.png" width="300" height="600" /> 

3) Ask questions or upvote questions asked by your classmates by clicking on them!
<img src="https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Mobile_dashboard.png" width="300" height="600" />

4) Participate in polls!
<img src="https://github.com/ShoaibAhmadKhan/Nox/blob/master/pictures/v2/Mobile_poll.png" width="300" height="600" />

# User Guide for Developers

First, you clone the repository into your choice of folder. 

# Running Nox

Here are the steps needed to run the application from your own machine:

1) Open up your terminal, and clone the repository into your designated folder. 

2) Run the setup.bash script (Installs all dependencies, clean build, and starts the server)
```
cd /Nox
./setup.bash
```

# Additional Information

# To stop the server, 
Hit 'Ctrl+C'

# To run the server again after stopping
node server.js

# To start webapp after an update
./updateDev.bash

# Server and Client run on http://localhost:5001

# Message any of the developers if you want to contribute to the project! 
