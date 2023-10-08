import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server listening in port ${port}`);
});
