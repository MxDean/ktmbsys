function calculate(){

let distance =
parseFloat(
document.getElementById(
"distance"
).value
) || 0;

let attenuation =
parseFloat(
document.getElementById(
"attenuation"
).value
) || 0;

let connector =
parseFloat(
document.getElementById(
"connector"
).value
) || 0;

let splice =
parseFloat(
document.getElementById(
"splice"
).value
) || 0;

let margin =
parseFloat(
document.getElementById(
"margin"
).value
) || 0;

let fiberLoss =
distance * attenuation;

let connectorLoss =
connector * 0.5;

let spliceLoss =
splice * 0.1;

let totalLoss =
fiberLoss +
connectorLoss +
spliceLoss +
margin;

document.getElementById(
"fiberLoss"
).innerHTML =
"Fiber Loss : "
+
fiberLoss.toFixed(2)
+
" dB";

document.getElementById(
"connectorLoss"
).innerHTML =
"Connector Loss : "
+
connectorLoss.toFixed(2)
+
" dB";

document.getElementById(
"spliceLoss"
).innerHTML =
"Splice Loss : "
+
spliceLoss.toFixed(2)
+
" dB";

document.getElementById(
"totalLoss"
).innerHTML =
"Total Loss : "
+
totalLoss.toFixed(2)
+
" dB";

document.getElementById(
"distanceKPI"
).innerHTML =
distance +
" km";

document.getElementById(
"lossKPI"
).innerHTML =
totalLoss.toFixed(2)
+
" dB";

let powerBudget = 25;

let linkMargin =
powerBudget -
totalLoss;

document.getElementById(
"marginKPI"
).innerHTML =
linkMargin.toFixed(2)
+
" dB";

if(linkMargin > 3)
{
document.getElementById(
"statusKPI"
).innerHTML =
"PASS";
}
else
{
document.getElementById(
"statusKPI"
).innerHTML =
"FAIL";
}

}
