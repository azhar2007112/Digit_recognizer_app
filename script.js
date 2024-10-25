const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let drawing = false;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// akar line kmn ki korlam r ki
ctx.lineWidth = 12;  
ctx.lineCap = "round";  
ctx.strokeStyle = "white"; 

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function captureCanvas() {
  const dataURL = canvas.toDataURL("image/png");
  
  // digit er chobita  pathacchi  Flask API 
  fetch('http://127.0.0.1:5000/recognize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: dataURL }), // Send the image data as JSON
  })
  .then(response => response.json())
  .then(data => {
    // Clear previous results
    document.getElementById('result').innerHTML = '';

    // Display the top 3 predictions in the HTML
    data.top_3_predictions.forEach((prediction, index) => {
      document.getElementById('result').innerHTML += 
        `<h3>${prediction.digit} : ${(prediction.score * 100).toFixed(4)}%</h3>`;
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
document.getElementById("capture").addEventListener("click", captureCanvas);
document.getElementById("reset").addEventListener("click", resetCanvas);
