const para = document.getElementById('infinite');
const counter = document.getElementById('counter');
let wordCount = 0;
let buffer = [];

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function updateCounter() {
  counter.textContent = wordCount + ' mots';
}

function punctuate(text) {
  const words = text.split(' ');
  const punctuated = [];
  for (let i = 0; i < words.length; i++) {
    punctuated.push(words[i]);
    if ((i + 1) % 10 === 0 && i !== words.length - 1) {
      punctuated[punctuated.length - 1] += Math.random() > 0.7 ? '?' : '.';
    }
  }
  if (!punctuated[punctuated.length - 1].match(/[.!?]$/)) {
    punctuated[punctuated.length - 1] += '.';
  }
  return punctuated.join(' ');
}

async function fetchBuffer() {
  const res = await fetch(`/api/lorem?count=10`);
  const data = await res.json();
  if (data.paragraphs) {
    data.paragraphs.forEach(p => buffer.push(punctuate(p)));
  }
}

function appendFromBuffer() {
  for (let i = 0; i < 3; i++) {
    if (buffer.length === 0) return;
    const newText = buffer.shift();
    const span = document.createElement('span');
    span.className = 'fade-in';
    span.textContent = ' ' + newText;
    para.appendChild(span);
    wordCount += countWords(newText);
    updateCounter();
  }
  if (buffer.length < 5) {
    fetchBuffer();
  }
}

// Initial fetch
fetchBuffer().then(() => {
  for (let i = 0; i < 10; i++) {
    appendFromBuffer();
  }
});

// Scroll detection
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + window.innerHeight;
  const nearBottom = document.body.offsetHeight - 300;
  if (scrollY > nearBottom) {
    appendFromBuffer();
  }
});

// Ensure scroll is possible initially
function checkNeedMore() {
  if (document.body.scrollHeight <= window.innerHeight + 50) {
    appendFromBuffer();
    setTimeout(checkNeedMore, 200);
  }
}
checkNeedMore();