const express = require("express");
const uuid = require('uuid');
const speakeasy = require("speakeasy");
const {JsonDB} = require("node-json-db");
const {Config} = require("node-json-db/dist/lib/JsonDBConfig");


console.clear();

const app = express();
app.use(express.json());

const db = new JsonDB(new Config('myDb', true, true, '/'));

app.get("/api", (_, res) => {
  res.sendStatus(200);
});

app.post("/api/register", (_, res) => {

  try{
    const id = uuid.v4();
    const temp_secret = speakeasy.generateSecret();
    db.push(`/users/${id}`, { id,  temp_secret });
    res.status(201).json({
      user_id: id,
      secret: temp_secret.base32
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

app.post('/api/verify', async (req, res) => {
  const {token, userID} = req.body;


  try{   
    const data = await db.getData(`/users/${userID}`);
    const secret = data.temp_secret.base32;


    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token
    });


    await db.push(`/users/${userID}`, {userID, secret});

    if(verified){
      res.status(200).json({ verified: true });
    }else{
      res.status(400).json({ verified: false });
    }
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }


})


app.listen(8080, () => {
    console.log("Server listening on port 8080");
});