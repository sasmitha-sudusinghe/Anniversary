/**
 * ANNIVERSARY INTERACTIVE CONTROLLER
 * State management, live counter, wax seal unfolding, reasons jar,
 * quiz, bucket list, lightbox, and live personalization.
 */

// Default configuration & state
const DEFAULT_CONFIG = {
  partner1: "Lucas",
  partner2: "Maya",
  // 2 years ago relative to Oct 15, 2026:
  anniversaryDate: "2024-10-15T19:00",
  tagline: "730 days of shared laughter, warm hugs, late-night talks, and realizing every day that choosing you was the easiest decision of my life.",
  letterContent: `Happy 2nd Anniversary!

Two years ago, we began a story that has brought more warmth, laughter, and pure happiness into my world than I ever thought possible. They say the 2nd anniversary is the 'cotton anniversary' — representing how two individual threads weave together to create something unbreakable, resilient, and wonderfully gentle.

Looking back over these 730 days, I am endlessly grateful for everything: the quiet mornings, the silly inside jokes, the adventures we took, and even the simple days spent doing nothing at all as long as we were together.

Thank you for being my anchor, my sweetest comfort, and my greatest adventure. I fell in love with you on day one, and somehow I fall a little deeper every single morning.

Here's to two unforgettable years, and to a lifetime more of holding your hand.`,
  reasons: [
    { num: 1, title: "Your Radiant Smile", text: "The way your entire face lights up whenever you laugh at our silly inside jokes.", icon: "✨" },
    { num: 2, title: "Our Quiet Mornings", text: "How peaceful the world feels when we share our first warm cup of coffee together.", icon: "☕" },
    { num: 3, title: "Your Gentle Kindness", text: "The genuine warmth and empathy you show to everyone and every animal around you.", icon: "🌸" },
    { num: 4, title: "Holding Hands", text: "The comforting way your fingers instinctively interlock with mine whenever we walk.", icon: "🤝" },
    { num: 5, title: "Car Karaoke", text: "Singing our favorite songs at the top of our lungs on long late-night highway drives.", icon: "🎵" },
    { num: 6, title: "Making Anywhere Home", text: "Wherever you are in the world, that is immediately where I feel safe, happy, and home.", icon: "🏡" },
    { num: 7, title: "Your Unstoppable Passion", text: "The spark in your eyes when you talk about the dreams and things you care about.", icon: "🔥" },
    { num: 8, title: "Your Sweet Hugs", text: "How your hugs have an instant superpower to melt away any stressful or tiring day.", icon: "🫂" },
    { num: 9, title: "Everyday Adventures", text: "Turning even a random grocery store run into an adventure full of giggles and fun.", icon: "🛒" },
    { num: 10, title: "Your Unwavering Support", text: "Believing in me and cheering for me even when I doubt myself.", icon: "🌟" },
    { num: 11, title: "The Way You Look At Me", text: "That tender glance from across the room that makes my heart skip a beat every time.", icon: "👀" },
    { num: 12, title: "Simply Being You", text: "Because in a world of billions of people, you are my one and only perfect person.", icon: "💖" }
  ],
  bucketList: [
    { text: "Watch the sunrise together wrapped in a cozy blanket", done: true },
    { text: "Take our first spontaneous road trip with no destination", done: true },
    { text: "Have a candlelit homemade pasta cooking night", done: false },
    { text: "Travel to Paris and share warm croissants in a cafe", done: false },
    { text: "Adopt a sweet pet companion together", done: false },
    { text: "Build our dream cozy home library reading nook", done: false },
    { text: "Stargaze from the back of a pickup truck in the mountains", done: false }
  ],
  quiz: [
    {
      question: "Where did our very first coffee date take place?",
      options: ["A cozy corner cafe with warm croissants", "A crowded downtown rooftop bar", "A random park bench in the rain", "A bookstore cafe reading poetry"],
      correct: 0,
      note: "That cozy European cafe where hours flew by like minutes! ☕"
    },
    {
      question: "What is the traditional gift material for a 2nd Anniversary?",
      options: ["Paper", "Cotton", "Leather", "Silver"],
      correct: 1,
      note: "Cotton! Symbolizing how our two lives have gently woven together into one strong fabric. 🧶"
    },
    {
      question: "Who is guaranteed to take longer to pick what to eat for dinner?",
      options: ["Definitely Her! (Every single time)", "Definitely Him! (Indecisive foodie)", "We end up getting ice cream instead", "It's an eternal debate!"],
      correct: 0,
      note: "Even if it takes 30 minutes to pick, eating with you is always the highlight of the day! 🍕"
    },
    {
      question: "How long does my heart plan on loving you?",
      options: ["730 more days", "Until the stars stop shining", "For today and tomorrow only", "Forever, without end"],
      correct: 3,
      note: "Forever & always. Happy 2nd Anniversary, my darling! 💖"
    }
  ]
};

// Application State
let appState = {};

function loadState() {
  const saved = localStorage.getItem('anniversary_website_data');
  if (saved) {
    try {
      appState = JSON.parse(saved);
      // Ensure merged with defaults in case of new fields
      appState = { ...DEFAULT_CONFIG, ...appState };
    } catch (e) {
      console.error("Failed to parse saved state, using defaults", e);
      appState = { ...DEFAULT_CONFIG };
    }
  } else {
    appState = { ...DEFAULT_CONFIG };
  }
}

function saveState() {
  localStorage.setItem('anniversary_website_data', JSON.stringify(appState));
}

/* ==========================================================================
   RENDER & DOM BINDINGS
   ========================================================================== */
function renderAll() {
  // Update Names across UI
  const combinedNames = `${appState.partner1} & ${appState.partner2}`;
  document.getElementById('nav-brand-names').textContent = combinedNames;
  document.getElementById('hero-names-display').textContent = combinedNames;
  document.getElementById('toast-author-name').textContent = `Forever Yours, ${appState.partner1} ♥ ${appState.partner2}`;
  document.getElementById('envelope-recipient-text').textContent = `To My Darling ${appState.partner2}, On Our 2nd Anniversary`;
  document.getElementById('letter-salutation').textContent = `My Dearest ${appState.partner2},`;
  document.getElementById('letter-signature-text').textContent = `Forever & Always Yours, ${appState.partner1} ♥`;

  // Tagline & Letter
  if (document.getElementById('hero-tagline')) {
    document.getElementById('hero-tagline').textContent = `"${appState.tagline}"`;
  }
  if (document.getElementById('letter-content-text')) {
    document.getElementById('letter-content-text').textContent = appState.letterContent;
  }

  // Anniversary date display
  const annivDate = new Date(appState.anniversaryDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = annivDate.toLocaleDateString(undefined, options);
  document.getElementById('counter-since-date').textContent = `Together Since ${formattedDate}`;
  document.getElementById('letter-display-date').textContent = formattedDate;

  // Render components
  renderReasonsGrid();
  renderBucketList();
  renderQuizQuestion();
}

/* ==========================================================================
   LIVE LOVE COUNTER
   ========================================================================== */
function updateCounter() {
  const startDate = new Date(appState.anniversaryDate).getTime();
  const now = new Date().getTime();
  let diff = now - startDate;

  if (diff < 0) {
    diff = 0; // If future date chosen
  }

  const secondsTotal = Math.floor(diff / 1000);
  const days = Math.floor(secondsTotal / (3600 * 24));
  const hours = Math.floor((secondsTotal % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = Math.floor(secondsTotal % 60);

  document.getElementById('counter-days').textContent = days;
  document.getElementById('counter-hours').textContent = hours < 10 ? '0' + hours : hours;
  document.getElementById('counter-minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
  document.getElementById('counter-seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
}

/* ==========================================================================
   WAX SEAL & LOVE LETTER INTERACTION
   ========================================================================== */
function setupLetterInteraction() {
  const btnSeal = document.getElementById('btn-break-seal');
  const envelopeCard = document.getElementById('envelope-card');
  const closedView = document.getElementById('envelope-closed-view');
  const letterPaper = document.getElementById('letter-paper');
  const btnRefold = document.getElementById('btn-refold-letter');

  btnSeal.addEventListener('click', (e) => {
    // Sound & particles
    if (window.romanticAudio) window.romanticAudio.playWaxSealBreak();
    if (window.canvasEffects) {
      const rect = btnSeal.getBoundingClientRect();
      window.canvasEffects.celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2, 75);
    }

    // Animate open
    closedView.style.transition = 'all 0.5s ease';
    closedView.style.opacity = '0';
    closedView.style.transform = 'scale(0.9)';

    setTimeout(() => {
      closedView.style.display = 'none';
      letterPaper.style.display = 'block';
    }, 400);
  });

  btnRefold.addEventListener('click', () => {
    if (window.romanticAudio) window.romanticAudio.playChime(true);
    letterPaper.style.display = 'none';
    closedView.style.display = 'flex';
    setTimeout(() => {
      closedView.style.opacity = '1';
      closedView.style.transform = 'scale(1)';
    }, 50);
  });
}

/* ==========================================================================
   REASONS FLIP CARDS & ENCHANTED JAR
   ========================================================================== */
function renderReasonsGrid() {
  const container = document.getElementById('reasons-cards-grid');
  if (!container) return;

  container.innerHTML = '';
  appState.reasons.forEach((r, idx) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Reason ${r.num}: ${r.title}`);

    card.innerHTML = `
      <div class="reason-card-inner">
        <div class="reason-card-front">
          <div class="reason-icon">${r.icon}</div>
          <h4 class="reason-card-num">#${r.num} • ${r.title}</h4>
          <span class="reason-tap-hint">Tap to flip & read ♥</span>
        </div>
        <div class="reason-card-back">
          <p class="reason-detail-text">"${r.text}"</p>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
      if (window.romanticAudio) window.romanticAudio.playChime(true);
      if (window.canvasEffects) {
        const rect = card.getBoundingClientRect();
        window.canvasEffects.spawnTrail(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });

    container.appendChild(card);
  });
}

function setupLoveJar() {
  const btnDraw = document.getElementById('btn-draw-reason');
  const scroll = document.getElementById('revealed-scroll');
  const numElem = document.getElementById('revealed-num');
  const textElem = document.getElementById('revealed-text');

  let lastIndex = -1;

  btnDraw.addEventListener('click', (e) => {
    if (!appState.reasons.length) return;

    let idx;
    do {
      idx = Math.floor(Math.random() * appState.reasons.length);
    } while (idx === lastIndex && appState.reasons.length > 1);
    lastIndex = idx;

    const r = appState.reasons[idx];
    numElem.textContent = `Love Note #${r.num} • ${r.title}`;
    textElem.textContent = `"${r.text}"`;

    scroll.style.display = 'block';

    if (window.romanticAudio) window.romanticAudio.playChime(true);
    if (window.canvasEffects) {
      const rect = btnDraw.getBoundingClientRect();
      window.canvasEffects.celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }
  });
}

/* ==========================================================================
   MEMORY QUIZ
   ========================================================================== */
let currentQuizIndex = 0;
let quizScore = 0;

function renderQuizQuestion() {
  const qElem = document.getElementById('quiz-question');
  const optsElem = document.getElementById('quiz-options');
  const statusElem = document.getElementById('quiz-status');
  const nextBtn = document.getElementById('btn-next-quiz');
  const scoreElem = document.getElementById('quiz-score-badge');

  if (!qElem || !optsElem) return;

  const q = appState.quiz[currentQuizIndex];
  if (!q) {
    // Finished Quiz
    qElem.textContent = "You completed our Anniversary Quiz! 🎉";
    optsElem.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0;">
        <p style="font-size: 1.3rem; color: var(--gold-champagne); font-family: var(--font-serif); margin-bottom: 0.5rem;">
          Final Score: ${quizScore} / ${appState.quiz.length}
        </p>
        <p style="color: var(--text-secondary); font-style: italic;">
          ${quizScore === appState.quiz.length ? "You know our story by heart down to every sweet detail! 💕" : "Every moment with you is precious beyond words."}
        </p>
      </div>
    `;
    statusElem.textContent = "";
    nextBtn.style.display = "inline-block";
    nextBtn.textContent = "Play Again ↻";
    scoreElem.textContent = `Score: ${quizScore} / ${appState.quiz.length}`;
    if (window.canvasEffects) window.canvasEffects.celebrate(window.innerWidth / 2, window.innerHeight / 2, 80);
    return;
  }

  qElem.textContent = `Q${currentQuizIndex + 1}: ${q.question}`;
  optsElem.innerHTML = '';
  statusElem.textContent = '';
  nextBtn.style.display = 'none';
  scoreElem.textContent = `Score: ${quizScore} / ${appState.quiz.length}`;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = opt;

    btn.addEventListener('click', () => {
      // Disable all options
      const allBtns = optsElem.querySelectorAll('.quiz-option-btn');
      allBtns.forEach(b => b.disabled = true);

      if (idx === q.correct) {
        btn.classList.add('correct');
        quizScore++;
        statusElem.textContent = `✨ Correct! ${q.note}`;
        if (window.romanticAudio) window.romanticAudio.playChime(true);
        if (window.canvasEffects) {
          const rect = btn.getBoundingClientRect();
          window.canvasEffects.celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
        }
      } else {
        btn.classList.add('incorrect');
        allBtns[q.correct].classList.add('correct');
        statusElem.textContent = `Aww! ${q.note}`;
        if (window.romanticAudio) window.romanticAudio.playChime(false);
      }

      scoreElem.textContent = `Score: ${quizScore} / ${appState.quiz.length}`;
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = currentQuizIndex + 1 < appState.quiz.length ? "Next Memory ➜" : "See Final Score ✨";
    });

    optsElem.appendChild(btn);
  });
}

function setupQuizInteraction() {
  const nextBtn = document.getElementById('btn-next-quiz');
  nextBtn.addEventListener('click', () => {
    if (currentQuizIndex >= appState.quiz.length) {
      currentQuizIndex = 0;
      quizScore = 0;
    } else {
      currentQuizIndex++;
    }
    renderQuizQuestion();
  });
}

/* ==========================================================================
   BUCKET LIST
   ========================================================================== */
function renderBucketList() {
  const listElem = document.getElementById('bucket-list-items');
  const progressText = document.getElementById('bucket-progress-text');
  const progressFill = document.getElementById('bucket-progress-fill');
  if (!listElem) return;

  listElem.innerHTML = '';
  const total = appState.bucketList.length;
  const doneCount = appState.bucketList.filter(item => item.done).length;

  progressText.textContent = `${doneCount} of ${total} Done`;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  progressFill.style.width = `${pct}%`;

  appState.bucketList.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `bucket-item ${item.done ? 'completed' : ''}`;

    li.innerHTML = `
      <input type="checkbox" class="bucket-checkbox" ${item.done ? 'checked' : ''} aria-label="Mark completed">
      <span class="bucket-text">${item.text}</span>
      <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.85rem;" title="Delete">✕</button>
    `;

    const checkbox = li.querySelector('.bucket-checkbox');
    checkbox.addEventListener('change', () => {
      item.done = checkbox.checked;
      saveState();
      renderBucketList();
      if (item.done && window.romanticAudio) window.romanticAudio.playChime(true);
    });

    // Delete item button
    const deleteBtn = li.querySelector('button');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appState.bucketList.splice(index, 1);
      saveState();
      renderBucketList();
    });

    listElem.appendChild(li);
  });
}

function setupBucketListForm() {
  const form = document.getElementById('add-bucket-form');
  const input = document.getElementById('bucket-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appState.bucketList.push({ text: text, done: false });
    saveState();
    renderBucketList();
    input.value = '';

    if (window.romanticAudio) window.romanticAudio.playChime(true);
  });
}

/* ==========================================================================
   IMAGE LIGHTBOX
   ========================================================================== */
function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const imgElem = document.getElementById('lightbox-img');
  const captionElem = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('btn-close-lightbox');

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox');
      const caption = el.getAttribute('data-caption') || '';
      imgElem.src = src;
      captionElem.textContent = caption;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const heroPolaroid = document.getElementById('hero-polaroid');
  if (heroPolaroid) {
    heroPolaroid.addEventListener('click', () => {
      imgElem.src = 'assets/images/hero_sunset.jpg';
      captionElem.textContent = 'Two Years of Us • 730 Days and Forever To Go';
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
}

/* ==========================================================================
   MUSIC TOGGLE BUTTON
   ========================================================================== */
function setupMusicToggle() {
  const btn = document.getElementById('audio-toggle-btn');
  const label = document.getElementById('audio-btn-label');

  // Set initial label
  label.textContent = "Play: A Thousand Years ♫";

  btn.addEventListener('click', async () => {
    if (!window.romanticAudio) return;
    const isNowPlaying = await window.romanticAudio.toggleMusic();
    if (isNowPlaying) {
      btn.classList.add('playing');
      label.textContent = "Christina Perri — A Thousand Years ♫";
    } else {
      btn.classList.remove('playing');
      label.textContent = "Play: A Thousand Years ♫";
    }
  });

  // Also auto-start when clicking wax seal if not yet playing
  const btnSeal = document.getElementById('btn-break-seal');
  if (btnSeal) {
    btnSeal.addEventListener('click', () => {
      if (window.romanticAudio && !window.romanticAudio.isPlaying) {
        setTimeout(async () => {
          const started = await window.romanticAudio.startMusic();
          if (started) {
            btn.classList.add('playing');
            label.textContent = "Christina Perri — A Thousand Years ♫";
          }
        }, 600);
      }
    });
  }
}

/* ==========================================================================
   TOAST & FINALE CELEBRATION
   ========================================================================== */
function setupToastCelebration() {
  const toastBtn = document.getElementById('btn-celebrate-toast');
  toastBtn.addEventListener('click', () => {
    if (window.romanticAudio) {
      window.romanticAudio.playFireworkPop();
    }
    if (window.canvasEffects) {
      // Launch 4 celebratory bursts
      window.canvasEffects.celebrate(window.innerWidth * 0.25, window.innerHeight * 0.4, 70);
      setTimeout(() => window.canvasEffects.celebrate(window.innerWidth * 0.75, window.innerHeight * 0.35, 70), 300);
      setTimeout(() => window.canvasEffects.celebrate(window.innerWidth * 0.5, window.innerHeight * 0.5, 90), 600);
      setTimeout(() => window.canvasEffects.celebrate(window.innerWidth * 0.4, window.innerHeight * 0.6, 60), 900);
    }
  });

  // Memory Like counters
  document.querySelectorAll('.btn-like-memory').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const countSpan = btn.querySelector('.like-count');
      let currentLikes = parseInt(countSpan.textContent) || 0;
      countSpan.textContent = currentLikes + 1;
      btn.style.color = '#ff2e63';

      if (window.romanticAudio) window.romanticAudio.playChime(true);
      if (window.canvasEffects) {
        const rect = btn.getBoundingClientRect();
        window.canvasEffects.celebrate(rect.left + rect.width / 2, rect.top, 25);
      }
    });
  });
}

/* ==========================================================================
   SETTINGS / PERSONALIZATION MODAL
   ========================================================================== */
function setupSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('open-settings-btn');
  const closeBtn = document.getElementById('btn-close-settings');
  const form = document.getElementById('settings-form');
  const resetBtn = document.getElementById('btn-reset-settings');

  const p1Input = document.getElementById('setting-partner1');
  const p2Input = document.getElementById('setting-partner2');
  const dateInput = document.getElementById('setting-anniversary-date');
  const taglineInput = document.getElementById('setting-tagline');
  const letterInput = document.getElementById('setting-letter');

  function openSettings() {
    p1Input.value = appState.partner1;
    p2Input.value = appState.partner2;
    dateInput.value = appState.anniversaryDate;
    taglineInput.value = appState.tagline;
    letterInput.value = appState.letterContent;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeSettings() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', openSettings);
  closeBtn.addEventListener('click', closeSettings);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSettings();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.partner1 = p1Input.value.trim() || DEFAULT_CONFIG.partner1;
    appState.partner2 = p2Input.value.trim() || DEFAULT_CONFIG.partner2;
    appState.anniversaryDate = dateInput.value || DEFAULT_CONFIG.anniversaryDate;
    appState.tagline = taglineInput.value.trim() || DEFAULT_CONFIG.tagline;
    appState.letterContent = letterInput.value.trim() || DEFAULT_CONFIG.letterContent;

    saveState();
    renderAll();
    updateCounter();
    closeSettings();

    if (window.romanticAudio) window.romanticAudio.playChime(true);
    if (window.canvasEffects) {
      window.canvasEffects.celebrate(window.innerWidth / 2, window.innerHeight / 2, 60);
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm("Reset all settings and text back to original defaults?")) {
      appState = { ...DEFAULT_CONFIG };
      saveState();
      renderAll();
      updateCounter();
      closeSettings();
    }
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  updateCounter();
  setInterval(updateCounter, 1000);

  setupLetterInteraction();
  setupLoveJar();
  setupQuizInteraction();
  setupBucketListForm();
  setupLightbox();
  setupMusicToggle();
  setupToastCelebration();
  setupSettingsModal();
});
