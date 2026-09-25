/**
 * VIBE MUSIC PLAYER — JavaScript
 * Полная логика плеера в точном соответствии с макетом
 */

// ==========================================================================
// 1. ИКОНКА НОТЫ ИЗ ICON.SVG
// ==========================================================================
const ICON_SVG_HTML = `
  <svg class="thumb-svg" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M86 165V79L183 64V145" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="63" cy="168" r="24" stroke="#fff" stroke-width="14"/>
    <circle cx="161" cy="151" r="24" stroke="#fff" stroke-width="14"/>
  </svg>
`;

// ==========================================================================
// 2. СОСТОЯНИЕ (STATE)
// ==========================================================================
let allTracks = [];

let state = {
  category: 'jazz',
  trackId: 1,
  isPlaying: false,
  volume: 0.7,
  previousVolume: 0.7,
  isMuted: false,
  isShuffle: false,
  isRepeat: false,
  theme: 'dark'
};

// Единый HTML5 Audio элемент
const audio = new Audio();
audio.volume = state.volume;

// ==========================================================================
// 3. ЭЛЕМЕНТЫ DOM
// ==========================================================================
const DOM = {
  categoriesList: document.getElementById('categoriesList'),
  mobileCatTabs: document.getElementById('mobileCatTabs'),
  countJazz: document.getElementById('count-jazz'),
  countClassic: document.getElementById('count-classic'),
  countBlues: document.getElementById('count-blues'),

  heroCover: document.getElementById('heroCover'),
  heroHeading: document.getElementById('heroHeading'),
  btnHeroPlay: document.getElementById('btnHeroPlay'),
  btnHeroShuffle: document.getElementById('btnHeroShuffle'),

  tracksList: document.getElementById('tracksList'),
  emptyState: document.getElementById('emptyState'),

  currentTrackCover: document.getElementById('currentTrackCover'),
  currentTrackTitle: document.getElementById('currentTrackTitle'),
  currentTrackArtist: document.getElementById('currentTrackArtist'),
  btnLike: document.getElementById('btnLike'),

  btnShuffle: document.getElementById('btnShuffle'),
  btnPrev: document.getElementById('btnPrev'),
  btnPlayPause: document.getElementById('btnPlayPause'),
  btnNext: document.getElementById('btnNext'),
  btnRepeat: document.getElementById('btnRepeat'),

  timeCurrent: document.getElementById('timeCurrent'),
  timeTotal: document.getElementById('timeTotal'),
  progressBarContainer: document.getElementById('progressBarContainer'),
  progressFilled: document.getElementById('progressFilled'),
  progressThumb: document.getElementById('progressThumb'),

  btnMute: document.getElementById('btnMute'),
  volumeSlider: document.getElementById('volumeSlider'),
  themeToggleBtn: document.getElementById('themeToggleBtn')
};

// ==========================================================================
// 4. ЗАГРУЗКА СПИСКА ТРЕКОВ
// ==========================================================================
const fallbackTracks = [
  {
    id: 1,
    title: "Have Yourself A Merry Little Christmas",
    artist: "Frank Sinatra",
    category: "jazz",
    file: "jazz/Frank Sinatra - Have Yourself A Merry Little Christmas.mp3",
    duration: 255
  },
  {
    id: 2,
    title: "Jingle Bells",
    artist: "Frank Sinatra",
    category: "jazz",
    file: "jazz/Frank Sinatra - Jingle Bells.mp3",
    duration: 193
  },
  {
    id: 3,
    title: "My Way",
    artist: "Frank Sinatra",
    category: "jazz",
    file: "jazz/Frank Sinatra - My Way.mp3",
    duration: 271
  },
  {
    id: 4,
    title: "Strangers In The Night",
    artist: "Frank Sinatra",
    category: "jazz",
    file: "jazz/Frank Sinatra - Strangers In The Night.mp3",
    duration: 151
  },
  {
    id: 5,
    title: "Gloria!",
    artist: "Kim Jo Seph",
    category: "jazz",
    file: "jazz/Kim Jo Seph - Gloria!.mp3",
    duration: 321
  },
  {
    id: 6,
    title: "Hello Dolly",
    artist: "Louis Armstrong",
    category: "jazz",
    file: "jazz/Louis Armstrong - Hello Dolly.mp3",
    duration: 236
  },
  {
    id: 7,
    title: "Let My People Go",
    artist: "Louis Armstrong",
    category: "jazz",
    file: "jazz/Louis Armstrong - Let My People Go.mp3",
    duration: 364
  },
  {
    id: 8,
    title: "What A Wonderful World",
    artist: "Louis Armstrong",
    category: "jazz",
    file: "jazz/Louis Armstrong - What A Wonderful World.mp3",
    duration: 231
  },
  {
    id: 9,
    title: "Summer Storm (The Four Seasons)",
    artist: "Antonio Vivaldi",
    category: "classic",
    file: "classic/Antonio Vivaldi - Summer Storm (The Four Seasons Summer, Op. 8, Rv315).mp3",
    duration: 274
  },
  {
    id: 10,
    title: "Весна (Времена Года RV 315)",
    artist: "Antonio Vivaldi",
    category: "classic",
    file: "classic/Antonio Vivaldi - Весна (Времена Года RV 315).mp3",
    duration: 244
  },
  {
    id: 11,
    title: "Le Vent, Le Cri",
    artist: "Ennio Morricone",
    category: "classic",
    file: "classic/Ennio Morricone - Le Vent, Le Cri.mp3",
    duration: 204
  },
  {
    id: 12,
    title: "Für Elise (Bagatelle In A Minor)",
    artist: "Ludwig Van Beethoven",
    category: "classic",
    file: "classic/Ludwig Van Beethoven - Fur Elise (Bagatelle In A Minor, Woo 59).mp3",
    duration: 332
  },
  {
    id: 13,
    title: "Каприз N24 ля-минор",
    artist: "Niccolo Paganini",
    category: "classic",
    file: "classic/Niccolo Paganini - Каприз N24 ля-минор.mp3",
    duration: 340
  },
  {
    id: 14,
    title: "In This Shirt",
    artist: "The Irrepressibles",
    category: "classic",
    file: "classic/The Irrepressibles - In This Shirt.mp3",
    duration: 562
  },
  {
    id: 15,
    title: "Black Velvet",
    artist: "Alannah Myles",
    category: "blues",
    file: "blues/Alannah Myles - Black Velvet.mp3",
    duration: 476
  },
  {
    id: 16,
    title: "I Just Wanna Be With You",
    artist: "Chris Rea",
    category: "blues",
    file: "blues/Chris Rea - I Just Wanna Be With You.mp3",
    duration: 360
  },
  {
    id: 17,
    title: "The Road To Hell (Part 2)",
    artist: "Chris Rea",
    category: "blues",
    file: "blues/Chris Rea - The Road To Hell. Part 2 (LP Version).mp3",
    duration: 440
  },
  {
    id: 18,
    title: "Have You Ever Seen the Rain",
    artist: "Creedence Clearwater Revived",
    category: "blues",
    file: "blues/Creedence Clearwater Revived - Have You Ever Seen the Rain.mp3",
    duration: 423
  },
  {
    id: 19,
    title: "Oh, Darling!",
    artist: "The Beatles",
    category: "blues",
    file: "blues/The Beatles - Oh, Darling!.mp3",
    duration: 361
  },
  {
    id: 20,
    title: "Living In A Ghost Town",
    artist: "The Rolling Stones",
    category: "blues",
    file: "blues/The Rolling Stones - Living In A Ghost Town.mp3",
    duration: 406
  }
];

async function loadTracks() {
  let loaded = false;
  const tryUrls = ['tracks.json', './tracks.json', 'public/tracks.json', '../tracks.json'];

  for (const url of tryUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          allTracks = data;
          loaded = true;
          break;
        }
      }
    } catch (e) {
      // Continue to next URL
    }
  }

  if (!loaded) {
    allTracks = fallbackTracks;
  }

  updateCategoryCounts();

  const current = getCurrentTrack() || getTracksByCategory(state.category)[0] || allTracks[0];
  if (current) {
    state.trackId = current.id;
    updatePlayerInfo(current);
  }

  renderCategories();
  renderTracks();
  updateHeroSection();
  updateProgressUI();
}

// ==========================================================================
// 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================================================
function getTracksByCategory(cat) {
  return allTracks.filter(t => t.category.toLowerCase() === cat.toLowerCase());
}

function getTrackById(id) {
  return allTracks.find(t => t.id === Number(id));
}

function getCurrentTrack() {
  return getTrackById(state.trackId);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0 || isNaN(seconds)) {
    return "0:00";
  }
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return min + ":" + String(sec).padStart(2, "0");
}

function pluralizeTracks(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${count} треков`;
  if (mod10 === 1) return `${count} трек`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} трека`;
  return `${count} треков`;
}

function getAudioCandidates(filePath) {
  if (!filePath) return [];
  if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('blob:')) {
    return [filePath];
  }
  let clean = filePath.replace(/^\.?\/*/, '');
  let baseClean = clean;
  if (clean.startsWith('public/')) {
    baseClean = clean.substring(7);
  } else if (clean.startsWith('music/')) {
    baseClean = clean.substring(6);
  } else if (clean.startsWith('public/music/')) {
    baseClean = clean.substring(13);
  }

  const list = [
    baseClean,
    './' + baseClean,
    'public/' + baseClean,
    'music/' + baseClean,
    'public/music/' + baseClean,
    '../' + baseClean,
    '../public/' + baseClean
  ];

  const candidates = [];
  list.forEach(p => {
    candidates.push(p);
    try {
      const encoded = encodeURI(p);
      if (encoded !== p) candidates.push(encoded);
    } catch (e) {}
  });

  return [...new Set(candidates)];
}

let currentCandidateIndex = 0;
let currentCandidates = [];

function resolveAudioPath(filePath) {
  currentCandidates = getAudioCandidates(filePath);
  currentCandidateIndex = 0;
  return currentCandidates[0] || '';
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

// ==========================================================================
// 6. ОТРИСОВКА ИНТЕРФЕЙСА
// ==========================================================================
function updateCategoryCounts() {
  const jc = getTracksByCategory('jazz').length;
  const cc = getTracksByCategory('classic').length;
  const bc = getTracksByCategory('blues').length;

  if (DOM.countJazz) DOM.countJazz.textContent = `Плейлист · ${pluralizeTracks(jc)}`;
  if (DOM.countClassic) DOM.countClassic.textContent = `Плейлист · ${pluralizeTracks(cc)}`;
  if (DOM.countBlues) DOM.countBlues.textContent = `Плейлист · ${pluralizeTracks(bc)}`;
}

function renderCategories() {
  const cards = document.querySelectorAll('.category-card');
  const currentTrack = getCurrentTrack();

  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    if (cat === state.category) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }

    if (state.isPlaying && currentTrack && currentTrack.category === cat) {
      card.classList.add('is-cat-playing');
    } else {
      card.classList.remove('is-cat-playing');
    }
  });

  const mTabs = document.querySelectorAll('.m-tab');
  mTabs.forEach(tab => {
    if (tab.getAttribute('data-category') === state.category) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

function updateHeroSection() {
  const titles = { jazz: 'Jazz', classic: 'Classic', blues: 'Blues' };
  DOM.heroHeading.textContent = titles[state.category] || state.category;

  DOM.heroCover.className = 'hero-cover-box';
  if (state.category === 'classic') DOM.heroCover.classList.add('cover-classic');
  if (state.category === 'blues') DOM.heroCover.classList.add('cover-blues');

  const currentTrack = getCurrentTrack();
  const isPlayingInThisCat = state.isPlaying && currentTrack && currentTrack.category === state.category;
  if (isPlayingInThisCat) {
    DOM.btnHeroPlay.classList.add('is-playing');
  } else {
    DOM.btnHeroPlay.classList.remove('is-playing');
  }
}

function renderTracks() {
  const tracks = getTracksByCategory(state.category);

  if (tracks.length === 0) {
    DOM.tracksList.innerHTML = '';
    DOM.emptyState.style.display = 'block';
    return;
  }

  DOM.emptyState.style.display = 'none';

  let html = '';
  tracks.forEach((track, idx) => {
    const isSelected = track.id === state.trackId;
    const isPlayingThis = isSelected && state.isPlaying;
    const num = idx + 1;
    const dur = track.duration ? formatTime(track.duration) : '3:45';

    html += `
      <div class="track-item-row ${isSelected ? 'active' : ''} ${isPlayingThis ? 'is-playing' : ''}" data-track-id="${track.id}">
        <div class="col-number-box">
          <span class="plain-num">${num}</span>
          <span class="hover-play-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="7,5 19,12 7,19"></polygon>
            </svg>
          </span>
          <div class="eq-bars-group">
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
          </div>
        </div>

        <div class="col-track-info">
          <div class="track-thumb-square">
            ${ICON_SVG_HTML}
          </div>
          <div class="track-names-box">
            <div class="track-title-text">${escapeHtml(track.title)}</div>
            <div class="track-artist-text">${escapeHtml(track.artist)}</div>
          </div>
        </div>

        <div class="col-time-dur">${dur}</div>
      </div>
    `;
  });

  DOM.tracksList.innerHTML = html;
}

function updatePlayerInfo(track) {
  if (!track) return;
  DOM.currentTrackTitle.textContent = track.title;
  DOM.currentTrackArtist.textContent = track.artist;

  if (track.duration) {
    DOM.timeTotal.textContent = formatTime(track.duration);
  }

  // Цвет обложки в нижнем плеере по категории
  if (track.category === 'classic') {
    DOM.currentTrackCover.style.backgroundColor = 'var(--cat-classic)';
  } else if (track.category === 'blues') {
    DOM.currentTrackCover.style.backgroundColor = 'var(--cat-blues)';
  } else {
    DOM.currentTrackCover.style.backgroundColor = 'var(--cat-jazz)';
  }
}

// ==========================================================================
// 7. ВОСПРОИЗВЕДЕНИЕ И УПРАВЛЕНИЕ
// ==========================================================================
function selectCategory(cat) {
  if (state.category === cat) return;
  state.category = cat;

  // Музыка НЕ останавливается при смене вкладки категорий!
  renderCategories();
  renderTracks();
  updateHeroSection();
}

function playTrack(trackId, toggleIfSame = true) {
  const targetId = Number(trackId);
  const track = getTrackById(targetId);
  if (!track) return;

  if (state.trackId === targetId && toggleIfSame) {
    togglePlayPause();
    return;
  }

  state.trackId = targetId;
  updatePlayerInfo(track);

  // Назначаем источник аудио
  const resolved = resolveAudioPath(track.file);
  audio.src = resolved;
  audio.currentTime = 0;

  state.isPlaying = true;
  updatePlayPauseUI();
  renderTracks();
  renderCategories();
  updateHeroSection();

  audio.play().catch(e => {
    console.log("Audio playback notice:", e);
  });
}

function togglePlayPause() {
  if (!state.trackId) {
    const list = getTracksByCategory(state.category);
    if (list.length > 0) playTrack(list[0].id, false);
    return;
  }

  const track = getCurrentTrack();
  if (!track) return;

  if (state.isPlaying) {
    state.isPlaying = false;
    audio.pause();
  } else {
    state.isPlaying = true;
    if (!audio.src || audio.src === window.location.href) {
      audio.src = resolveAudioPath(track.file);
    }
    audio.play().catch(() => {});
  }

  updatePlayPauseUI();
  renderTracks();
  renderCategories();
  updateHeroSection();
}

function updatePlayPauseUI() {
  if (state.isPlaying) {
    DOM.btnPlayPause.classList.add('is-playing');
  } else {
    DOM.btnPlayPause.classList.remove('is-playing');
  }
}

function playNextTrack() {
  const currentTrack = getCurrentTrack();
  const cat = currentTrack ? currentTrack.category : state.category;
  const tracks = getTracksByCategory(cat);
  if (tracks.length === 0) return;

  let nextIdx = 0;
  if (state.isShuffle) {
    if (tracks.length > 1) {
      const curIdx = tracks.findIndex(t => t.id === state.trackId);
      do {
        nextIdx = Math.floor(Math.random() * tracks.length);
      } while (nextIdx === curIdx);
    }
  } else {
    const curIdx = tracks.findIndex(t => t.id === state.trackId);
    if (curIdx !== -1) {
      nextIdx = (curIdx + 1) % tracks.length; // по кругу
    }
  }

  playTrack(tracks[nextIdx].id, false);
}

function playPrevTrack() {
  const currentTrack = getCurrentTrack();
  const cat = currentTrack ? currentTrack.category : state.category;
  const tracks = getTracksByCategory(cat);
  if (tracks.length === 0) return;

  const curIdx = tracks.findIndex(t => t.id === state.trackId);
  let prevIdx = tracks.length - 1;
  if (curIdx !== -1) {
    prevIdx = (curIdx - 1 + tracks.length) % tracks.length; // по кругу
  }

  playTrack(tracks[prevIdx].id, false);
}

// ==========================================================================
// 8. ТАЙМЛАЙН И ПЕРЕМОТКА
// ==========================================================================
function updateProgressUI() {
  const cur = audio.currentTime || 0;
  let dur = audio.duration;

  if (!dur || isNaN(dur)) {
    const track = getCurrentTrack();
    dur = (track && track.duration) ? track.duration : 225;
  }

  const percent = dur > 0 ? (cur / dur) * 100 : 0;
  const clamped = Math.min(Math.max(percent, 0), 100);

  DOM.progressFilled.style.width = clamped + '%';
  DOM.progressThumb.style.left = clamped + '%';

  DOM.timeCurrent.textContent = formatTime(cur);
  if (dur > 0) {
    DOM.timeTotal.textContent = formatTime(dur);
  }
}

function handleTimelineSeek(e) {
  const rect = DOM.progressBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);

  let dur = audio.duration;
  if (!Number.isFinite(dur) || dur <= 0) {
    const track = getCurrentTrack();
    dur = (track && track.duration) ? track.duration : 225;
  }

  const newTime = ratio * dur;
  audio.currentTime = newTime;
  updateProgressUI();
}

// ==========================================================================
// 9. ГРОМКОСТЬ
// ==========================================================================
function setVolume(val) {
  const v = Math.min(Math.max(val / 100, 0), 1);
  state.volume = v;
  audio.volume = v;

  if (v > 0) {
    state.isMuted = false;
    DOM.btnMute.classList.remove('muted');
  } else {
    state.isMuted = true;
    DOM.btnMute.classList.add('muted');
  }

  DOM.volumeSlider.value = Math.round(v * 100);
}

function toggleMute() {
  if (state.isMuted || state.volume === 0) {
    const restore = state.previousVolume > 0 ? state.previousVolume : 0.7;
    state.isMuted = false;
    setVolume(restore * 100);
  } else {
    state.previousVolume = state.volume;
    state.isMuted = true;
    setVolume(0);
  }
}

// ==========================================================================
// 10. СОБЫТИЯ И ИНИЦИАЛИЗАЦИЯ
// ==========================================================================
function initApp() {
  audio.addEventListener('timeupdate', updateProgressUI);

  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration && !isNaN(audio.duration)) {
      DOM.timeTotal.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('error', (err) => {
    console.warn("Audio loading failed for source:", audio.src, "trying fallback...");
    if (currentCandidates && currentCandidateIndex + 1 < currentCandidates.length) {
      currentCandidateIndex++;
      const nextCandidate = currentCandidates[currentCandidateIndex];
      console.log("Attempting next audio candidate:", nextCandidate);
      audio.src = nextCandidate;
      if (state.isPlaying) {
        audio.play().catch(() => {});
      }
    }
  });

  audio.addEventListener('ended', () => {
    if (state.isRepeat) {
      audio.currentTime = 0;
      audio.play();
    } else {
      playNextTrack();
    }
  });

  DOM.categoriesList.addEventListener('click', (e) => {
    const card = e.target.closest('.category-card');
    if (card) selectCategory(card.getAttribute('data-category'));
  });

  DOM.mobileCatTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.m-tab');
    if (tab) selectCategory(tab.getAttribute('data-category'));
  });

  DOM.tracksList.addEventListener('click', (e) => {
    const row = e.target.closest('.track-item-row');
    if (row) playTrack(row.getAttribute('data-track-id'), true);
  });

  DOM.btnPlayPause.addEventListener('click', togglePlayPause);
  DOM.btnHeroPlay.addEventListener('click', () => {
    const cur = getCurrentTrack();
    if (state.isPlaying && cur && cur.category === state.category) {
      togglePlayPause();
    } else {
      const list = getTracksByCategory(state.category);
      if (list.length > 0) playTrack(list[0].id, false);
    }
  });

  DOM.btnNext.addEventListener('click', playNextTrack);
  DOM.btnPrev.addEventListener('click', playPrevTrack);

  function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    DOM.btnShuffle.classList.toggle('active', state.isShuffle);
    DOM.btnHeroShuffle.classList.toggle('active', state.isShuffle);
  }
  DOM.btnShuffle.addEventListener('click', toggleShuffle);
  DOM.btnHeroShuffle.addEventListener('click', toggleShuffle);

  DOM.btnRepeat.addEventListener('click', () => {
    state.isRepeat = !state.isRepeat;
    DOM.btnRepeat.classList.toggle('active', state.isRepeat);
  });

  DOM.btnLike.addEventListener('click', () => {
    DOM.btnLike.classList.toggle('liked');
  });

  // Перемотка кликом и перетаскиванием
  let isDragging = false;
  DOM.progressBarContainer.addEventListener('click', handleTimelineSeek);
  DOM.progressBarContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleTimelineSeek(e);
  });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) handleTimelineSeek(e);
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  // Громкость
  DOM.volumeSlider.addEventListener('input', (e) => setVolume(Number(e.target.value)));
  DOM.btnMute.addEventListener('click', toggleMute);

  // Переключение темы (Dark / Light)
  DOM.themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    if (isDark) {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      state.theme = 'light';
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      state.theme = 'dark';
    }
    try {
      localStorage.setItem('vibe-player-theme', state.theme);
    } catch (e) {}
  });

  // Восстановление темы из localStorage
  try {
    const savedTheme = localStorage.getItem('vibe-player-theme');
    if (savedTheme === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      state.theme = 'light';
    }
  } catch (e) {}

  loadTracks();
  setVolume(70);
}

document.addEventListener('DOMContentLoaded', initApp);
