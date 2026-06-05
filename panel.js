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

/* PAGINA PRINCIPAL */

app.get("/", (req, res) => {

res.send(`

<!DOCTYPE html>

<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Satoru Gojo Bot</title>

<style>

body{
margin:0;
font-family:Arial,sans-serif;
background:
linear-gradient(rgba(0,0,0,.75),rgba(0,0,0,.85)),
url('/gojogod.jpg');
background-size:cover;
background-position:center;
background-attachment:fixed;
color:white;
text-align:center;
}

.hero{
padding:120px 20px;
}

h1{
font-size:80px;
text-shadow:0 0 20px #00e5ff;
}

p{
font-size:22px;
color:#dbeafe;
}

.btn{
display:inline-block;
padding:15px 35px;
margin:10px;
border-radius:10px;
text-decoration:none;
font-weight:bold;
}

.invite{
background:#5865F2;
color:white;
}

.panel{
background:#00e5ff;
color:black;
}

.card{
background:rgba(0,0,0,.6);
max-width:700px;
margin:20px auto;
padding:25px;
border-radius:15px;
backdrop-filter:blur(10px);
}

footer{
padding:30px;
color:#94a3b8;
}

</style>

</head>

<body>

<div class="hero">

<h1>⚡ SATORU GOJO ⚡</h1>

<p>El hechicero más fuerte llegó a Discord.</p>

<a class="btn invite"
href="https://discord.com/oauth2/authorize?client_id=1510666930627936356&permissions=8&scope=bot%20applications.commands">
🤖 Invitar Bot </a>

<a class="btn panel" href="/panel">
⚙️ Abrir Panel
</a>

</div>

<div class="card">
🤖 Inteligencia Artificial Avanzada
</div>

<div class="card">
💬 Conversaciones estilo Gojo
</div>

<div class="card">
⚙️ Configuración completa desde la web
</div>

<footer>
© 2026 Satoru Gojo Bot
</footer>

</body>
</html>
`);

});

/* PANEL */

app.get("/panel", (req, res) => {

const c = getConfig();

res.send(`

<!DOCTYPE html>

<html>
<head>

<title>Gojo Panel</title>

<style>

body{
margin:0;
font-family:Arial;
color:white;
background:url("/gojogod.jpg") no-repeat center center fixed;
background-size:cover;
}

.overlay{
background:rgba(0,0,0,.75);
min-height:100vh;
padding:20px;
}

.back{
display:inline-block;
margin-bottom:20px;
padding:10px 20px;
background:#00e5ff;
color:black;
text-decoration:none;
border-radius:8px;
font-weight:bold;
}

.title{
text-align:center;
font-size:32px;
color:#00e5ff;
text-shadow:0 0 15px #00e5ff;
margin-bottom:20px;
}

.card{
background:rgba(0,0,0,.6);
padding:20px;
border-radius:12px;
width:320px;
}

.container{
display:flex;
gap:15px;
justify-content:center;
flex-wrap:wrap;
}

input[type="number"],
input[type="text"]{
width:100%;
padding:8px;
margin-top:5px;
border:none;
border-radius:5px;
}

.btn{
margin-top:10px;
width:100%;
padding:12px;
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

<a class="back" href="/">🏠 Volver al Inicio</a>

<div class="title">
⚡ GOJO BOT PANEL ⚡
</div>

<form method="POST" action="/save">

<div class="container">

<div class="card">

<h3>🛡️ Moderación</h3>

<label>
Anti Spam
<input type="checkbox" name="antiSpam" ${c.antiSpam ? "checked" : ""}>
</label>

<br><br>

<label>
Anti Toxic
<input type="checkbox" name="antiToxic" ${c.antiToxic ? "checked" : ""}>
</label>

<br><br>

<label>
IA
<input type="checkbox" name="aiEnabled" ${c.aiEnabled ? "checked" : ""}>
</label>

</div>

<div class="card">

<h3>⚙️ Castigos</h3>

Mute (ms)

<input type="number" name="muteTime" value="${c.muteTime}">

<br><br>

Warn mute

<input type="number" name="muteAfterWarns" value="${c.muteAfterWarns}">

<br><br>

Warn ban

<input type="number" name="banAfterWarns" value="${c.banAfterWarns}">

</div>

<div class="card">

<h3>🚫 Canales bloqueados</h3>

<input
type="text"
name="blockedChannels"
value="${c.blockedChannels.join(",")}"

>

</div>

</div>

<br>

<button class="btn">
💾 Guardar Configuración
</button>

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

res.redirect("/panel");

});

app.listen(process.env.PORT || 3000, () => {
console.log("⚡ Gojo Panel Online");
});
