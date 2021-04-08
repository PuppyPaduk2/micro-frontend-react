import express from "express";
import * as http from "http";

const port = process.env.PORT || 2999;
const app = express();

app.use(express.json());

app.get("*", (req, res) => {
  res.send("Server app");
  res.end();
});

http.createServer(app)
  .listen(port, () => console.log(`http://localhost:${port}`));
