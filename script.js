const video = document.getElementById('video');
const snapButton = document.getElementById('snap');
const stripCanvas = document.getElementById('stripCanvas');
const downloadButton = document.getElementById('download');
const ctx = stripCanvas.getContext('2d');
const counter = document.getElementById('counter');

let photos = [];
let currentFilter = 'none';
let countdownInterval;

// Open webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => alert('Camera not accessible: ' + err));

function applyFilter(filter) {
  currentFilter = filter;
  video.style.filter= filter;
}

snapButton.addEventListener('click', () => {
  if (photos.length >= 3) return;
  startCountdown(3);
});

function startCountdown(seconds) {
  let remaining = seconds;
  counter.textContent = `Get ready... ${remaining}`;
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      counter.textContent = `${remaining}...`;
    } else {
      clearInterval(countdownInterval);
      counter.textContent = 'Click!';
      capturePhoto();
    }
  }, 1000);
}

function capturePhoto() {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 320;
  tempCanvas.height = 320;
  const tempCtx = tempCanvas.getContext('2d');


  tempCtx.filter = currentFilter;

  tempCtx.drawImage(video, 0, 0, 320, 320);
  photos.push(tempCanvas);

  counter.textContent = `${photos.length} / 3 photo(s) taken`;

  if (photos.length === 3) {
    createStrip();
  }
}


function createStrip() {
  const gap = 20;
  const photoSize = 320;
  const stripHeight = (photoSize * photos.length) + (gap * (photos.length - 1));

  stripCanvas.width = 340;
  stripCanvas.height = stripHeight;

  ctx.fillStyle = '#a0522d'; // Vintage film color
  ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

  drawPerforationHoles(ctx, stripCanvas.width, stripCanvas.height);

  photos.forEach((photo, i) => {
    const y = i * (photoSize + gap);
    ctx.drawImage(photo, 10, y, photoSize, photoSize);
  });

  downloadButton.disabled = false;
}

function drawPerforationHoles(ctx, width, height) {
  const holeWidth = 6;
  const holeHeight = 12;
  const spacing = 20;

  ctx.fillStyle = 'white'; // perforation hole color
  for (let y = spacing; y < height - spacing; y += holeHeight + spacing) {
    // Left side
    ctx.fillRect(5, y, holeWidth, holeHeight);
    // Right side
    ctx.fillRect(width - holeWidth - 5, y, holeWidth, holeHeight);
  }
}


downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'photostrip.png';
  link.href = stripCanvas.toDataURL();
  link.click();
});
