# Etheral Radiance source code

***This project is diploma work of Alex Gordienko (@alexoid1999)***

## Repository contains next:

> Front - Front-end part of network, written with using TypeScript, HTML, CSS

> ERA_Node_ChatServer - Back-end part of network, Node.JS server with files with web-socket's connection to processing all requests, creating real-time private and group chats, neural network script

***TO COMLETELY UNDERSTANDING OF USED TECHNOLOGIES AND WHAT IS GOING ON HERE, PLEASE READ <a href="https://drive.google.com/file/d/19U2KCNnxzZ7oZa-3WA2Px1hH1B9b7uAU/view?usp=sharing">FULL DESCRIPTION</a> (ukrainian language)***

## Installing

- Front 

Download this folder, unzip it, then open this folder in terminal and insert
```shell
$ yarn install
$ yarn start
```
If all's good, the front-end part will be launched on localhost:3000, but that's not all, because client at once will try to connect to the server. The next step is

- NodeServer 

***Databases must be paste into your MySQL server and make your configure into 'dyploma/NodeServer/src/index.ts' (your login and pass from sql-user to access)***

***To correct displaying photoes in posts configure photoDirectory:***
```js
// dyploma/NodeServer/src/routes/DataParserScripts/postSetter.ts 
9	protected readonly photoDirectory = `/srv/windows/dyploma/Photoes/`;
...
// dyploma/NodeServer/src/routes/DataParserScripts/postGetter.ts
8	protected readonly photoDirectory = `/srv/windows/dyploma/Photoes/`;
```

Then, use
```shell
yarn
yarn install
yarn start
```
to build and start local server.

Now, server has started and ready to work, you can watch messages in terminal about server status


## Test user (from social network's account)
```shell
login: alexoid1999
pass: 18ebyhwb
```

## Some screenshots

- Main page

https://drive.google.com/file/d/1FZlUpL-PTrddJPJyeN0prk1kKsJjP0G3/view?usp=sharing

- Search

https://drive.google.com/file/d/1auFzyGRqC27XcDMwN-w3T-qMCgVxEC60/view?usp=sharing

- Profile

https://drive.google.com/file/d/1JJrxJvE6GSWPIWhOA-wgkWcGWGryrdta/view?usp=sharing


- Chat 

https://drive.google.com/file/d/1yKzQYkUdBcK51N4y_tU2N5c4F1gXeGYD/view?usp=sharing
