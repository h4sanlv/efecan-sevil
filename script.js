// --- Hareketli yıldız ve kalp partikül arka planı ---
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
canvas.width = w; canvas.height = h;
window.addEventListener('resize', () => {
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w; canvas.height = h;
});

function randomColor() {
  const colors = ['#ffb6b9', '#fbc2eb', '#a1c4fd', '#fff0f5', '#ee9ca7'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const stars = Array.from({length: 80}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 1.2 + 0.5,
  o: Math.random() * 0.5 + 0.5
}));
const hearts = Array.from({length: 18}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  s: Math.random() * 0.7 + 0.5,
  spd: Math.random() * 0.3 + 0.1,
  c: randomColor(),
  t: Math.random() * Math.PI * 2
}));

function drawHeart(x, y, size, color, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t) * 0.2);
  ctx.scale(size, size);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(0, -3, 3, -3, 3, 0);
  ctx.bezierCurveTo(3, 3, 0, 3, 0, 6);
  ctx.bezierCurveTo(0, 3, -3, 3, -3, 0);
  ctx.bezierCurveTo(-3, -3, 0, -3, 0, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function animateBG() {
  ctx.clearRect(0, 0, w, h);
  // Stars
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.o})`;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  // Hearts
  for (const heart of hearts) {
    drawHeart(heart.x, heart.y, heart.s * 8, heart.c, heart.t);
    heart.y -= heart.spd;
    heart.t += 0.01;
    if (heart.y < -20) {
      heart.x = Math.random() * w;
      heart.y = h + 20;
      heart.s = Math.random() * 0.7 + 0.5;
      heart.c = randomColor();
    }
  }
  requestAnimationFrame(animateBG);
}
animateBG();

// --- Cam küre ve zarf açılış animasyonu, typewriter efektli mektup ---
let step = 0;
const flap = document.querySelector('.envelope-flap');
const letter = document.getElementById('envelopeLetter');
const envelope = document.getElementById('envelope3D');
const orb = document.getElementById('glassOrb');
const music = document.getElementById('music');
const tip = document.getElementById('clickTip');
const typewriter = document.getElementById('typewriter');
const audioFlap = document.getElementById('audio-flap');
const audioLetter = document.getElementById('audio-letter');

// Daha romantik ve uzun mektup metni
const mektupMetni = `Efe & Sevil\n\nSevgili Sevil,\n\nSeninle geçen her an, yıldızlar kadar parlak ve kalbimde sonsuz bir iz bırakıyor.\nSenin gülüşünle aydınlanan dünyamda, her gün sana yeniden aşık oluyorum.\nHayatın tüm renkleri, seninle daha güzel, daha anlamlı.\n\nBirlikte kurduğumuz hayaller, paylaştığımız anılar ve geleceğe dair umutlarımız,\nkalbimin en değerli köşesinde saklı.\n\nSeni her şeyden çok seviyorum.\n\nSonsuz sevgimle,\nEfe`;

function typeWriterEffect(text, el, cb) {
  let i = 0;
  el.textContent = '';
  function type() {
    if (i < text.length) {
      el.textContent += text[i] === '\\n' ? '\n' : text[i];
      i++;
      setTimeout(type, 32);
    } else if (cb) {
      cb();
    }
  }
  type();
}

function showImageOverlay(imgSrc) {
  let overlay = document.getElementById('galleryOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'galleryOverlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = '';
  overlay.className = 'active';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '2000';
  const img = document.createElement('img');
  img.src = imgSrc;
  img.style.maxWidth = '90vw';
  img.style.maxHeight = '90vh';
  img.style.borderRadius = '18px';
  img.style.boxShadow = '0 8px 32px #a1c4fdcc, 0 0 0 8px #fff0f5cc';
  overlay.appendChild(img);
  overlay.onclick = function() {
    overlay.className = '';
    overlay.style.display = 'none';
  };
}

function loadGalleryImages() {
  const gallery = document.getElementById('gallery3D');
  gallery.innerHTML = '';
  const imageList = [
    '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg'
  ];
  // İlk satır (4 resim)
  const row1 = document.createElement('div');
  row1.className = 'gallery-row';
  for (let i = 0; i < 4; i++) {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    const img = document.createElement('img');
    img.src = `images/${imageList[i]}`;
    img.alt = `Efe & Sevil ${i + 1}`;
    img.onerror = function() { this.style.display = 'none'; };
    card.appendChild(img);
    card.onclick = function() {
      showImageOverlay(img.src);
    };
    row1.appendChild(card);
  }
  gallery.appendChild(row1);
  // İkinci satır (3 resim)
  const row2 = document.createElement('div');
  row2.className = 'gallery-row';
  for (let i = 4; i < 7; i++) {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    const img = document.createElement('img');
    img.src = `images/${imageList[i]}`;
    img.alt = `Efe & Sevil ${i + 1}`;
    img.onerror = function() { this.style.display = 'none'; };
    card.appendChild(img);
    card.onclick = function() {
      showImageOverlay(img.src);
    };
    row2.appendChild(card);
  }
  gallery.appendChild(row2);
}

// --- GÜNCELLEME: Sayfa açılır açılmaz galeri ve resimleri göster ---
// Bu kısmı kaldırıyorum, orijinal akışa dönüyoruz.

envelope.addEventListener('click', function() {
  step++;
  if (step === 1) {
    flap.classList.add('open');
    tip.textContent = 'Bir daha tıkla...';
    audioFlap && audioFlap.play();
  } else if (step === 2) {
    letter.classList.add('visible');
    tip.textContent = 'Son kez tıkla...';
    setTimeout(() => {
      typewriter.textContent = mektupMetni.replace(/\n/g, '\n');
      audioLetter && audioLetter.play();
    }, 600);
  } else if (step === 3) {
    letter.classList.remove('visible');
    envelope.style.display = 'none';
    orb.style.display = 'none';
    document.querySelector('.center-container').style.display = 'none';
    document.getElementById('galleryHeader').style.display = 'block';
    const gallery = document.getElementById('gallery3D');
    gallery.style.display = 'flex';
    loadGalleryImages();
    tip.style.display = 'none';
  }
});

window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('glassOrb').style.display = 'flex';
  document.getElementById('envelope3D').style.display = 'block';
  document.getElementById('envelopeLetter').style.display = 'block';
  document.getElementById('clickTip').style.display = 'block';
});