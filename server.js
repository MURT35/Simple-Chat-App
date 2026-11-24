import http from 'http';
import fs from 'fs';
import { WebSocketServer , WebSocket } from 'ws';
import path from 'path';
import { json } from 'stream/consumers';
import { isKeyObject } from 'util/types';
const server = http.createServer((req, res) => {
  const isScript = req.url === "/script.js";
  const filePath = isScript ? "./public/script.js" : "./public/index.html";
  const contentType = isScript ? "text/javascript" : "text/html";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});
// const server= http.createServer((req,res)=>{
//     fs.readFile('./public/index.html', (err, data) => {
//     if (err) {
//       res.writeHead(500, { 'Content-Type': 'text/plain' });
//       res.end('Internal Server Error');
//       return;
//     }
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(data);
//   });
// })
const wss= new WebSocketServer({ server })
const PORT = 3001;
wss.on('connection', (socket, req) => { 
    const username = new URL(req.url, "http://localhost").searchParams.get(
  "username",
);
const payload= { type: "system", text: `${username} joined` }
wss.clients.forEach((client)=>{
    if(client.readyState===WebSocket.OPEN){
        client.send(JSON.stringify(payload))
    }
})

socket.on("message",(data)=>{
    const { username, text}=JSON.parse(data)
    const chat = { type: "chat", username, text }
    wss.clients.forEach((client)=>{
    if(client.readyState===WebSocket.OPEN){
        client.send(JSON.stringify(chat))
    }
})
})

socket.on("close", () => {
  const left = { type: "system", text: `${username} left` };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(left));
    }
  });
});


})


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
