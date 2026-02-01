<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WinGo Predictor</title>

<link rel="manifest" href="manifest.json">
<script src="firebase-config.js"></script>

<style>
body{margin:0;background:#000;color:#fff;font-family:sans-serif}
iframe{width:100%;height:100vh;border:0}

/* Widget */
#widget{
 position:fixed;top:0;left:0;width:100%;
 background:#111;padding:12px;
 z-index:999999;display:none;
 box-shadow:0 2px 10px #000;
}

#btn{width:100%;padding:10px;background:#1e88e5;border:0;color:#fff;border-radius:6px}
#history{font-size:12px;margin-top:8px;max-height:80px;overflow:auto}
</style>
</head>

<body>

<div id="widget">
  <b>🎯 WinGo Prediction</b><br>
  Period: <span id="period">--</span><br>
  Number: <span id="number">--</span><br><br>
  <button id="btn">Get Prediction</button>
  <div id="history"></div>
</div>

<iframe id="frame"></iframe>

<script>
/* ===== INITIAL URL ===== */
const START_URL = "https://www.dmwin5.com/#/register?invitationCode=27278184971";
const frame = document.getElementById("frame");
frame.src = START_URL;

/* ===== PERIOD SYNC (30s cycle demo) ===== */
let basePeriod = Number(localStorage.getItem("period")) || 100000;
setInterval(()=>{
  basePeriod++;
  localStorage.setItem("period", basePeriod);
  document.getElementById("period").innerText = basePeriod;
},30000);

/* ===== WinGo-only Widget ===== */
setInterval(()=>{
  let url="";
  try{ url = frame.src }catch(e){}
  document.getElementById("widget").style.display =
    /wingo|game/i.test(url) ? "block" : "none";
},2000);

/* ===== Prediction + History ===== */
const historyBox = document.getElementById("history");

function renderHistory(){
  const h = JSON.parse(localStorage.getItem("history")||"[]");
  historyBox.innerHTML = h.slice(-5).reverse()
    .map(x=>`<div>${x.period} → <span style="color:${x.color}">${x.num}</span></div>`)
    .join("");
}

document.getElementById("btn").onclick = () => {
  if(window.remoteDisablePrediction) return;

  const num = Math.floor(Math.random()*10);
  const period = basePeriod;
  const color = (num===0||num===5)?"violet":(num%2?"green":"red");

  number.innerHTML = `<span style="color:${color}">${num}</span>`;

  const history = JSON.parse(localStorage.getItem("history")||"[]");
  history.push({period,num,color});
  localStorage.setItem("history",JSON.stringify(history));

  renderHistory();
};

renderHistory();

/* ===== PWA ===== */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}
</script>

</body>
</html>
