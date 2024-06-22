const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const mongoose = require("mongoose");
const etudiantRoute = require("./routes/etudiantRoute");
const fraisroute = require("./routes/fraisRoute");
const userRoute=require("./routes/userRoute")
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


mongoose
  .connect("mongodb://localhost:27017/projetJS")
  .then(() => console.log("connexion avec la base de donne reussi"))
  .catch((err) => console.error("erreur ", err));

app.use(express.json()).use(cors()).use(etudiantRoute).use(fraisroute).use(userRoute);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
