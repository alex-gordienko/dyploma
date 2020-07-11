# Etheral Radiance source code

***This project is diploma work of Alex Gordienko (@alexoid1999)***

## Repository contains next:

> ERA_Front - Front-end part of network, written with using TypeScript, HTML, CSS

> ERA_Apache_Server - Back-end part of network, written with PHP and using in Apache web-server

> ERA_Node_ChatServer - NodeJS server with files to creating real-time private and group chats

> ERA_Node_Neural - NodeJS project with files of neural network

***TO COMLETELY UNDERSTANDING OF USED TECHNOLOGIES AND WHAT IS GOING ON HERE, PLEASE READ <a href="https://drive.google.com/file/d/19U2KCNnxzZ7oZa-3WA2Px1hH1B9b7uAU/view?usp=sharing">FULL DESCRIPTION</a> (ukrainian language)***

## Installing

- ERA_Front 
Download this folder, unzip it, then open this folder in terminal and insert
```shell
$ yarn install
$ yarn start
```
If all's good, the front-end part will be launched on localhost:3000, but that's not all, because client at once will try to connect to the server. The next step is

- ERA_Apache_Server 
Requires to already installed Apache web-server. Personally I recommend to using XAMPP (for Ubuntu) or OpenServer (for Windows). Just download folder from repository, rename to *dyploma* and paste it into default server's folder.


- ERA_Node_ChatServer 
Download this folder, unzip it, then open this folder in terminal and insert
```shell
$ npm install
$ npm start
```
If all's good, you will see phrase *"Server sterted on port 5000"* or same. Now server is started and ready to process requests from chat page from client by link "localhost:3000/chatpage"

- ERA_Node_Neural
Download this folder, unzip it, then open this folder in terminal and insert
```shell
$ npm install
$ npm start
```
Then insert
```shell
$ node app.js --images_dir=\"*your photoes folder here*\" --model_dir=\"./models\" --skip_training
// to get predictions of your photoes, which in selected folder. There is few folders with photoes require
$  node app.js --images_dir=\"*your training sample folder here*\" --model_dir=\"./models\"
// to retrain your own neural model. There is few folders with photoes require, each folder must be named by category (for example, folder *anime* contains anime pics)
```