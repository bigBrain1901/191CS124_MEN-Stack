# 191CS124_MEN-Stack
## MEN Stack Used - MySQL, Express, Node

1. __MySQL__ - There are a lot of relational features in the database like - items related to users, being claimed by other users, etc...

1. __Node + Express__ - I am familiar with this backend framework, so...

1. __EJS__ - My design is card based and has a lot of repeating elements, making either ejs or react a good choice. I chose ejs for this project.

--------------------------------------

## System Recommendation : Windows or Ubuntu with 1920*1080 resolution :)
I have tested only on these parameters, although lower resolution is accounted for...

## Clone or download this project on your system and then follow along...

## INSTALLATION INSTRUCTIONS

1. __Setup NODE and NPM__

   1. __Windows and Mac Users__ - Go to the following site - https://nodejs.org/en/ 
      Download the current latest stable release and run the installer.

   1. __Linux Users__ - run `sudo apt-get nodejs npm` in terminal to install nodejs and npm directly.

1. __Copy the project files to a directory of your choice and navigate to the project directory.__

1. __Install required NPM packages__
   
   1. Open your preferred terminal (cmd, system terminal, hyper terminal, vscode terminal, etc) in that folder.
   
   1. run the command `npm i package` and replace __package__ with the __following one after the other__.
      1. express
      1. ejs
      1. body-parser
      1. md5
      1. multer
      1. mysql
      
      Alternatively, run `npm i express ejs body-parser md5 multer mysql` on __that__ terminal.
      _It is important this terminal is open in your project folder only._

1. __Setup MySQL database for the project__
   1. Head over to https://dev.mysql.com/downloads/windows/installer/8.0.html and download the installer for any OS you are running.
      1. Get the installer for windows or Mac.
      1. Run `sudo apt install mysql-server` to install followed by `sudo mysql_secure_installation` to setup the root account on linux
   1. Run `mysql --version` to check if MySQL installed successfully. My instructions might be wierd to follow, but you can look-up the documentation on https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/ for assistance.
   1. In projectFolder/Reference Docs, you will find an __exports.sql__ file, which is the database. Fetch its path __"path"__
   1. On terminal, run `mysql -u root -p irisrec < "path/exports.sql"`. Enter the password you setup in step 4.i.b above. Remember to replace the path according to your system as fetched in step 4.iii above.
   1. This will setup my database on your system with following credentials
      1. user: "root"
      1. password: <The one you entered in step 4.iv above>
      1. database: "irisrec"
      and you need to remember this for a later step.
      
1. __Cool! You have Node, Express, NPM-dependencies and MySQL setup, time for action...__

1. __Setup project variables__
   1. Open my project folder in your favourite editor (vs-code, atom, etc..)
   2. Locate the file ___query.js___ in root directory. Check the mysql parameters on lines 6-11 and enter your credentials as in step 4.v above.

1. You are all set! Open a terminal in the root directory of the project and run `node server.js` to run the server. You might want to change the listening port on line 21 of ___server.js___ to another free port on your computer. Default is 3000.

1. On your browser (Chrome, etc..), goto `localhost:3000` to see a page. If it renders, well and good. Otherwise, go through the setup again. You could call me up or reach by WhatsApp, either way!

-----------------------------------------

## Implemented Features

1. User Dashboard - The user can view items where
   1. His bid is highest
   1. The dealine is over and he needs to claim the item
   1. Items he has uploaded for auction.
   
1. Add Item Sheet - The user can upload a new item for auction on this page

1. Auction Dashboard - A common space for bidding where all uploaded items within deadline are open for auction followed by an auction archive where past items and highest bidders are seen.

1. A functional navbar and a landing page has been added and the UI is user friendly.

-----------------------------------------

## Non-essential planned features

1. Server-wide encryption and .env can be implemented. As of now, my database stores encrypted passwords only with 1 round of hashing.

1. Google signin could be added. But since this is an app for NITK only, it wouldn't make sense if not for additional security tests, which I had no time for.

-----------------------------------------

## Known bugs

1. Server side mimetype check for files is limited to .jpg, .jpeg, .png only, although user should technically be able to upload other valid image files.

----------------------------------------
