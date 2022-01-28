import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); // static file setting
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
    socket["nickname"] = "Anonymous";
    socket.onAny((event) => {
        console.log(`socket event [${event}]`);
    });

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        setTimeout(() => {
            done("hello! is backend message info"); // front에서 실행이 됌 (callback method)
        }, 1000);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    });

    socket.on("new_message", (message, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
        done();
    });

    socket.on("set_nickname", (room, nickname) => {
        socket["nickname"] = nickname;
        socket.to(room).emit("welcome", socket.nickname); // front에서 to 이벤트로 실행 (나 제외 전체)
    })
});

httpServer.listen(3000, handleListen);



