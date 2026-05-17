from node:latest

workdir /app

copy package*.json ./

run npm install

copy . ./

expose 3000

cmd ["node", "index.js"]