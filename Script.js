/* ══ DATA ══ */
const TRUTHS = [
  "What's the most embarrassing thing you've done in public?",
  "Have you ever lied to get out of trouble? What was it?",
  "What's a secret you've never told anyone in this room?",
  "What is the most childish thing you still do?",
  "What's the worst gift you've ever received?",
  "Have you ever ghosted someone? Why?",
  "What's a habit you have that you're embarrassed about?",
  "What's the biggest lie you've ever told your parents?",
  "If you could change one thing about yourself, what would it be?",
  "What's something you pretend to like but actually hate?",
  "Have you ever cheated on a test or game? Explain.",
  "What's the most embarrassing thing on your phone right now?",
  "What's a text message you sent to the wrong person?",
  "Who was your first crush and do they know?",
  "What's the pettiest reason you've ever ended a friendship?",
  "What's the most money you've spent on something completely useless?",
  "Have you ever been caught doing something you shouldn't? What?",
  "What's the weirdest dream you've ever had?",
  "What's one thing you'd never want your parents to find out?",
  "Describe the last time you completely embarrassed yourself.",
  "What is the most ridiculous thing you believed to be true as a child?",
  "What is a weird food combination that you secretly love?",
  "Have you ever accidentally sent a text complaining about someone to that exact person?",
  "What is the absolute worst haircut you have ever had in your life?",
  "If your pet could suddenly speak, what would be the most embarrassing thing they could say about you?",
  "What are the five most recent items currently sitting in your phone's search history?",
  "Who in this room do you think would be the first to go down in a zombie apocalypse?",
  "Have you ever faked being sick just to escape a terrible date or party?",
  "What was your exact first impression of me when we first met?",
  "What is your biggest dating dealbreaker that makes you run away instantly?",
  "Have you ever had a vivid or romantic dream about someone in this room?",
  "What is something flirty you've wanted to say but haven't had the courage to?",
  "What is an unusual non-physical trait that acts as an instant turn-on for you?",
  "What is the biggest lie you have ever told your parents without getting caught?",
  "Name someone you once pretended to like but actually couldn't stand.",
];

const DARES = [
  "Do your best impression of someone in this room.",
  "Speak in an accent of the group's choosing for the next 3 rounds.",
  "Let someone else post a caption to your last Instagram photo.",
  "Do 20 push-ups right now.",
  "Eat a spoonful of the spiciest condiment available.",
  "Call a random contact and sing them Happy Birthday.",
  "Wear your clothes inside-out for the rest of the game.",
  "Let the group go through your camera roll for 30 seconds.",
  "Do your best runway walk across the room.",
  "Text your crush or ex three heart emojis with no context.",
  "Let someone else write a story status on your behalf.",
  "Talk in third person for the next two rounds.",
  "Attempt to lick your elbow for 10 seconds.",
  "Do your best robot dance for 30 seconds.",
  "Say the alphabet backwards as fast as you can.",
  "Imitate a famous person until someone guesses who you are.",
  "Eat a raw lemon slice without making a face.",
  "Let the person to your left draw something on your face with a marker.",
  "Speak only in questions for the next round.",
  "Do a dead-straight impression of the person who picked Dare for you.",
  "Talk in a funny accent chosen by the group for the next three rounds.",
  "Do your best runway walk using a household object as your accessory.",
  "Try to drink a full glass of water while saying a tongue twister.",
  "Let the player to your right completely mess up your hairstyle.",
  "Act like a crazy monkey for 30 seconds without breaking character.",
  "Read aloud the last text message you sent to your best friend.",
  "Show the group the last five people you messaged on social media.",
  "Let someone post a random status update pretending to be you.",
  "Call a random contact and sing Happy Birthday before hanging up.",
  "Reveal your most embarrassing photo from your camera roll.",
  "Whisper three things you want to do with me tonight into my ear.",
  "Do your most dramatic impression of me reacting to a minor inconvenience.",
  "Give the person you're most attracted to in the room a genuine compliment.",
  "Hold eye contact with me for a full minute without laughing.",
  "Put an ice cube down your shirt and keep a straight face until it melts.",
];

/* ══ GAME STATE ══ */
let players = [];
let roundsPerPlayer = 10;
let currentPlayerIdx = 0;
let currentRound = 0;
let totalTurns = 0;
let totalTurnsDone = 0;
let scores = {};
let turnHistory = [];
let waitingForNext = false;
let currentType = null;

/* ══ SETUP ══ */
function addPlayer() {
  if (players.length >= 8) return;
  players.push('');
  renderPlayerList();
  validateStart();
}

function removePlayer() {
  if (players.length <= 2) return;
  players.pop();
  renderPlayerList();
  validateStart();
}

function renderPlayerList() {
  const list = document.getElementById('playerList');
  list.innerHTML = '';
  players.forEach((name, i) => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `
      <span class="player-num">P${i+1}</span>
      <input class="player-input" type="text" maxlength="16"
        placeholder="PLAYER ${i+1} NAME"
        value="${name}"
        oninput="players[${i}]=this.value.trim();validateStart();"
      />`;
    list.appendChild(row);
  });
}

function validateStart() {
  const filled = players.filter(p => p.length > 0).length;
  document.getElementById('startBtn').disabled = filled < 2;
}

function changeRounds(delta) {
  roundsPerPlayer = Math.max(1, Math.min(20, roundsPerPlayer + delta));
  document.getElementById('roundsVal').textContent = roundsPerPlayer;
}

// Init with 2 default slots
players = ['', ''];
renderPlayerList();

/* ══ START ══ */
function startGame() {
  players = players.filter(p => p.length > 0);
  if (players.length < 2) return;

  scores = {};
  turnHistory = {};
  players.forEach(p => {
    scores[p] = { truth: 0, dare: 0 };
    turnHistory[p] = [];
  });

  currentPlayerIdx = 0;
  currentRound = 0;
  totalTurns = players.length * roundsPerPlayer;
  totalTurnsDone = 0;

  showScreen('screenGame');
  updateHUD();
  renderDots();
  drawWheel(currentAngle);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateHUD() {
  const p = players[currentPlayerIdx];
  const playerRound = turnHistory[p].length + 1;
  const globalRound = totalTurnsDone + 1;
  document.getElementById('hudPlayer').textContent = p.toUpperCase();
  document.getElementById('hudRound').textContent = `${playerRound}/${roundsPerPlayer}`;
  document.getElementById('hudTotal').textContent = `${globalRound}/${totalTurns}`;
  document.getElementById('statusInfo').textContent = `${p.toUpperCase()} · ROUND ${playerRound}`;
}

function renderDots() {
  const p = players[currentPlayerIdx];
  const hist = turnHistory[p];
  const dots = document.getElementById('roundDots');
  dots.innerHTML = '';
  for (let i = 0; i < roundsPerPlayer; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    if (i < hist.length) d.classList.add('done-' + hist[i]);
    else if (i === hist.length) d.classList.add('current');
    dots.appendChild(d);
  }
}

/* ══ WHEEL ══ */
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const SIZE = canvas.width;
const CX = SIZE / 2, CY = SIZE / 2, R = SIZE / 2 - 4;
const SEGMENTS = 16;
const ARC = (2 * Math.PI) / SEGMENTS;

const segColors = {
  truth: ['#00b894', '#00cba9', '#00f5c4', '#1de9b6'],
  dare:  ['#c0005a', '#e0006a', '#ff2d6b', '#ff5c87'],
};

function getColor(type, i) { return segColors[type][i % segColors[type].length]; }

let currentAngle = -Math.PI / 2 - ARC / 2;

function drawWheel(angle) {
  ctx.clearRect(0, 0, SIZE, SIZE);

  for (let i = 0; i < SEGMENTS; i++) {
    const start = angle + i * ARC, end = start + ARC;
    const type = i % 2 === 0 ? 'truth' : 'dare';
    const baseColor = getColor(type, Math.floor(i / 2));

    ctx.beginPath(); ctx.moveTo(CX, CY); ctx.arc(CX, CY, R, start, end); ctx.closePath();
    const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, R);
    grad.addColorStop(0, baseColor + '88');
    grad.addColorStop(.65, baseColor + 'cc');
    grad.addColorStop(1, baseColor);
    ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath(); ctx.moveTo(CX, CY); ctx.arc(CX, CY, R, start, end); ctx.closePath();
    ctx.strokeStyle = 'rgba(4,6,15,.6)'; ctx.lineWidth = 2; ctx.stroke();

    ctx.save(); ctx.translate(CX, CY); ctx.rotate(start + ARC / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = type === 'truth' ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.7)';
    ctx.font = `700 ${SIZE * .032}px Orbitron,monospace`;
    ctx.fillText(type === 'truth' ? 'TRUTH' : 'DARE', R - 12, 4);
    ctx.restore();
  }

  ctx.beginPath(); ctx.arc(CX, CY, R, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0,245,196,.3)'; ctx.lineWidth = 2; ctx.stroke();

  const hubGrad = ctx.createRadialGradient(CX - 7, CY - 7, 2, CX, CY, 40);
  hubGrad.addColorStop(0, '#0d1f3c'); hubGrad.addColorStop(1, '#020810');
  ctx.beginPath(); ctx.arc(CX, CY, 40, 0, 2 * Math.PI);
  ctx.fillStyle = hubGrad; ctx.fill();
  ctx.strokeStyle = 'rgba(0,245,196,.35)'; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.strokeStyle = 'rgba(0,245,196,.2)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(CX - 18, CY); ctx.lineTo(CX + 18, CY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX, CY - 18); ctx.lineTo(CX, CY + 18); ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, CY, 3.5, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0,245,196,.8)'; ctx.fill();
}

drawWheel(currentAngle);

let spinning = false;
const spinBtn = document.getElementById('spinBtn');
const resultCard = document.getElementById('resultCard');
const resultLabel = document.getElementById('resultLabel');
const resultText = document.getElementById('resultText');
const tapHint = document.getElementById('tapHint');

function spin() {
  if (spinning || waitingForNext) return;
  spinning = true;
  spinBtn.disabled = true;
  tapHint.style.opacity = '0';
  resultCard.classList.remove('show', 'truth', 'dare');

  const extraSpins = 6 + Math.random() * 5;
  const targetAngle = currentAngle + extraSpins * 2 * Math.PI;
  const duration = 3600 + Math.random() * 1200;
  const startAngle = currentAngle;
  const startTime = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function animate(now) {
    const t = Math.min((now - startTime) / duration, 1);
    currentAngle = startAngle + (targetAngle - startAngle) * easeOut(t);
    drawWheel(currentAngle);
    if (t < 1) { requestAnimationFrame(animate); }
    else {
      currentAngle = currentAngle % (2 * Math.PI);
      spinning = false;
      showResult();
    }
  }
  requestAnimationFrame(animate);
}

function showResult() {
  const pointerAngle = -Math.PI / 2;
  let normalized = ((pointerAngle - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const segIndex = Math.floor(normalized / ARC) % SEGMENTS;
  currentType = segIndex % 2 === 0 ? 'truth' : 'dare';

  const pool = currentType === 'truth' ? TRUTHS : DARES;
  const question = pool[Math.floor(Math.random() * pool.length)];

  resultLabel.textContent = currentType === 'truth' ? 'TRUTH' : 'DARE';
  resultText.textContent = question;
  resultCard.className = `result-card ${currentType}`;
  setTimeout(() => resultCard.classList.add('show'), 50);

  waitingForNext = true;
  spinBtn.disabled = true;
}

function nextTurn() {
  if (!waitingForNext) return;

  const p = players[currentPlayerIdx];
  scores[p][currentType]++;
  turnHistory[p].push(currentType);
  totalTurnsDone++;

  resultCard.classList.remove('show', 'truth', 'dare');
  waitingForNext = false;
  currentType = null;

  if (turnHistory[p].length >= roundsPerPlayer) {
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
    if (totalTurnsDone >= totalTurns) {
      setTimeout(showEndScreen, 400);
      return;
    }
  }

  updateHUD();
  renderDots();
  spinBtn.disabled = false;
  tapHint.style.opacity = '1';
}

function showEndScreen() {
  showScreen('screenEnd');

  const ranked = [...players].sort((a, b) => {
    const ta = scores[a].truth + scores[a].dare;
    const tb = scores[b].truth + scores[b].dare;
    if (tb !== ta) return tb - ta;
    return scores[b].dare - scores[a].dare;
  });

  const board = document.getElementById('scoreboard');
  board.innerHTML = '';
  ranked.forEach((name, i) => {
    const s = scores[name];
    const row = document.createElement('div');
    row.className = 'score-row' + (i === 0 ? ' rank-1' : '');
    row.innerHTML = `
      <span class="score-rank ${i === 0 ? 'gold' : ''}">${i === 0 ? '★' : `#${i + 1}`}</span>
      <span class="score-name">${name.toUpperCase()}</span>
      <div class="score-stats">
        <span class="score-pill t">T: ${s.truth}</span>
        <span class="score-pill d">D: ${s.dare}</span>
      </div>`;
    board.appendChild(row);
  });
}

function playAgain() {
  showScreen('screenSetup');
  renderPlayerList();
  validateStart();
}

spinBtn.addEventListener('click', spin);
canvas.addEventListener('click', spin);

