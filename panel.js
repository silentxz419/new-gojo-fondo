const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

function getConfig() {
  return JSON.parse(fs.readFileSync("./config.json", "utf8"));
}

function saveConfig(data) {
  fs.writeFileSync("./config.json", JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  const c = getConfig();

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Gojo Panel</title>

<style>
body {
  margin: 0;
  font-family: Arial;
  color: white;
  background: url("/gojogod.jpg") no-repeat center center fixed;
  background-size: cover;
}

.overlay {
  background: rgba(0,0,0,0.75);
  min-height: 100vh;
  padding: 20px;
}

.title {
  text-align:center;
  font-size:28px;
  color:#00e5ff;
  text-shadow:0 0 10px #00e5ff;
}

.card {
  background: rgba(0,0,0,0.6);
  padding:20px;
  border-radius:10px;
  width:300px;
}

.container {
  display:flex;
  gap:15px;
  justify-content:center;
  flex-wrap:wrap;
}

input[type="number"], input[type="text"] {
  width:100%;
  padding:5px;
  margin-top:5px;
}

.btn {
  margin-top:10px;
  width:100%;
  padding:10px;
  background:#00e5ff;
  border:none;
  border-radius:8px;
  font-weight:bold;
  cursor:pointer;
}
</style>
</head>

<body>
<div class="overlay">

<div class="title">⚡ GOJO BOT PANEL ⚡</div>

<form method="POST" action="/save">

<div class="container">

  <div class="card">
    <h3>🛡️ Mod</h3>

    <label>
      Anti Spam
      <input type="checkbox" name="antiSpam" ${c.antiSpam ? "checked" : ""}>
    </label>

    <label>
      Anti Toxic
      <input type="checkbox" name="antiToxic" ${c.antiToxic ? "checked" : ""}>
    </label>

    <label>
      IA
      <input type="checkbox" name="aiEnabled" ${c.aiEnabled ? "checked" : ""}>
    </label>
  </div>

  <div class="card">
    <h3>⚙️ Castigos</h3>

    Mute (ms)
    <input type="number" name="muteTime" value="${c.muteTime}">

    Warn mute
    <input type="number" name="muteAfterWarns" value="${c.muteAfterWarns}">

    Warn ban
    <input type="number" name="banAfterWarns" value="${c.banAfterWarns}">
  </div>

  <div class="card">
    <h3>🚫 Canales bloqueados</h3>

    <input type="text" name="blockedChannels"
    value="${c.blockedChannels.join(",")}">
  </div>

</div>

<button class="btn">💾 Guardar</button>

</form>

</div>
</body>
</html>
  `);
});

app.post("/save", (req, res) => {
  const old = getConfig();

  const newConfig = {
    ...old,
    antiSpam: req.body.antiSpam === "on",
    antiToxic: req.body.antiToxic === "on",
    aiEnabled: req.body.aiEnabled === "on",
    muteTime: Number(req.body.muteTime),
    muteAfterWarns: Number(req.body.muteAfterWarns),
    banAfterWarns: Number(req.body.banAfterWarns),
    blockedChannels: req.body.blockedChannels
      ? req.body.blockedChannels.split(",").map(x => x.trim())
      : []
  };

  saveConfig(newConfig);

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Panel activo en http://localhost:3000");
});