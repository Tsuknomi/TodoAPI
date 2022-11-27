const express = require("express");
const path = require("path");
const routes = require("./routes/routes");
const connectToDb = require("./database/db");

connectToDb();
const app = express();

app.set("view engine", "ejs");

// Linkando a pasta public e puxando automaticamente seu conteúdo para o index.ejs
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(routes);


app.listen(3000);

