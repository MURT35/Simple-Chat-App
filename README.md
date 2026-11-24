#  Simple Chat App(Backend)

A real-time chat server built with Node.js and the `ws` WebSocket library. Several browsers can stay connected at once. When someone joins, sends a message, or leaves, the server pushes that event to every connected client immediately. The page does not refresh and the client does not poll.

## What you build

The browser client is already written. The work is the server in `server.js`.

| File | Role |
| --- | --- |
| `server.js` | HTTP server plus WebSocket server |
| `public/index.html` | Chat page |
| `public/script.js` | Browser client: connect, send, and display messages |

The page and the socket share port `3001`.

## How a session works

1. The browser loads `http://localhost:3001`.
2. The user types a name and clicks **Connect**. The client opens `ws://localhost:3001?username=Alice`.
3. On connection, the server reads `username` from the query string and broadcasts `{ "type": "system", "text": "Alice joined" }` to every open client.
4. When the user sends a message, the client sends `{ "username": "Alice", "text": "Hello" }`. The server parses that JSON and broadcasts `{ "type": "chat", "username": "Alice", "text": "Hello" }` to every client, including the sender.
5. When the socket closes, the server broadcasts `{ "type": "system", "text": "Alice left" }` to the clients that are still connected.

Messages are strings on the wire, so every object is sent with `JSON.stringify` and read with `JSON.parse`.

## Run it

```bash
cd build-a-chat-app
npm install
npm start
```

Open `http://localhost:3001` in two browser windows. Use a different username in each, click **Connect**, send a message, then disconnect one window. The other window should show the join line, the chat line, and the leave line.

`index.html` loads `script.js`. The HTTP handler must return `./public/index.html` for `/` with `Content-Type: text/html`, and `./public/script.js` for `/script.js` with `Content-Type: text/javascript`. If every request returns the HTML page, the Connect button has no click handler.

Stop the server with Ctrl+C. Restart it after any change to `server.js`.

## Requirements covered in `server.js`

- Create an HTTP server with `http.createServer` and store it in `server`.
- Create `const wss = new WebSocketServer({ server })`.
- Listen with `wss.on("connection", (socket, req) => { ... })`.
- On connect, read the username and broadcast the system "joined" message.
- On `socket` `"message"`, parse `{ username, text }` and broadcast a `chat` message to all clients.
- On `socket` `"close"`, broadcast a system "left" message to the remaining clients.
- Start the server with `server.listen(PORT, ...)`.
