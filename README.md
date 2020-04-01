# 191CS124_MEN-Stack
MEN Stack Used - MySQL, Express, Node and React with Bootstrap
  1. MySQL - There are a lot of relational features in the database like - items related to users, being claimed by other
     users, etc...
  2. Node + Express - I am familiar with this backend framework, so...
  3. EJS - My design is card based and has a lot of repeating elements, making either ejs or react a good choice.
     I chose ejs for this project to skip writing installation steps...
  4. Bootstrap - Makes css life easy. Although, a lot of my css is actually not bootstrap...

INSTALLATION INSTRUCTIONS

  Step 1 : Setup NODE and NPM
    1. Windows and Mac Users -
        Go to the following site - https://nodejs.org/en/
        Download the current latest stable release and run the installer
    2. Linux Users - run "sudo apt-get nodejs npm" in terminal to install nodejs and npm

  --- Copy the project files to a directory of your choice and navigate to the project directory.

  Step 2 : Install required NPM packages
    1. Open your preferred terminal (cmd, system terminal, hyper terminal, vscode terminal, etc)
    2. run the command "npm i <package name>" and replace <package name> with the following one after the other
        1. express
        2. ejs
        3. body-parser

  Step 3 : Setup MySQL database for the project

-----------------------------------------

Features that can be added to web app : 

    Server-wide encryption and .env can be implemented
    Right now, my database stores encrypted passwords only with 2 rounds of salting and hashing

    Responsiveness has not been added due to time constraints...
    My WebApp is viewer friendly in design for all screen-widths > 1366 right now.