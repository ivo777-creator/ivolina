// ===============================================================
// IVOLINA v2.8.1 — vault memory fix, hidden save, no stale pages
// ===============================================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    realtime: { params: { eventsPerSecond: 5 } },
  });
}

const FIRST_CONTACT = new Date('2026-05-08T00:00:00');       // the day you first spoke
const RELATIONSHIP_START = new Date('2026-07-27T00:00:00');  // the day you became you two
const ANNIVERSARY = new Date('2027-07-27T00:00:00');

const QUESTION_CATEGORIES = [
  { id: 'all',        label: 'all',        emoji: '\u2726' },
  { id: 'relationship', label: 'us',       emoji: '\ud83e\udec2' },
  { id: 'future',     label: 'future',     emoji: '\ud83d\udd2e' },
  { id: 'love',       label: 'love',       emoji: '\ud83c\udf39' },
  { id: 'intimacy',   label: 'intimacy',   emoji: '\ud83d\udd25' },
  { id: 'trust',      label: 'trust',      emoji: '\ud83e\udd1d' },
  { id: 'distance',   label: 'distance',   emoji: '\u2708\ufe0f' },
  { id: 'playful',    label: 'playful',    emoji: '\ud83c\udfa0' },
  { id: 'deep',       label: 'deep',       emoji: '\ud83c\udf0a' },
];

const PRESET_BY_CATEGORY = {
  relationship: [
    "What was the exact moment you knew?",
    "What part of me did you fall for first?",
    "What's a small thing I do that you secretly love?",
    "What's your favorite version of me?",
    "What's the hardest thing about loving me?",
    "What's the easiest thing about loving me?",
    "What's something about us that you're proud of?",
    "When have you felt most chosen by me?",
    "What does 'we' mean to you now, compared to when we started?",
    "What's a part of our story you want to make sure we remember?",
    "What's a way I've changed you that you're grateful for?",
    "What's a way you've seen me grow?",
    "What's the most surprising thing you've learned about me?",
    "What's the most surprising thing you've learned about yourself through me?",
    "What's a story about us you'd tell our grandchildren?",
    "What do we do better than most couples?",
    "What's something we should be more patient with each other about?",
    "If our relationship had a soundtrack, what's the opening song?",
    "What's a moment you realised we were really a team?",
    "What's something you've never thanked me for?",
  ],
  future: [
    "Where do you see us living in five years?",
    "Where would you want our first home to be?",
    "What's something you want to learn together?",
    "What's a tradition you'd love for us to start?",
    "If we had a tiny apartment together right now, what would it smell like?",
    "What do you hope our future kids inherit from me?",
    "If you wrote a letter to us five years from now, what would it say?",
    "What's a dream you have that I'm part of?",
    "What's a dream you have that's just for you?",
    "If we wrote our vows today, what would yours start with?",
    "What's a way you want to grow in our next year?",
    "What does forever mean to you?",
    "What's the first thing we should buy for our home together?",
    "What's a country you want us to see together, and why that one?",
    "What kind of mornings do you want us to have one day?",
    "What's something you want us to have achieved in ten years?",
    "How do you picture an ordinary Tuesday with me, years from now?",
    "What's a fear you have about the future that I could help carry?",
    "What would you want our home to always have in it?",
    "What's one promise you'd make me for the next five years?",
  ],
  love: [
    "Describe the first time you felt loved by me.",
    "What's the most romantic thing we've never done that you'd like to?",
    "What's your love language \u2014 really?",
    "How can I love you better this week?",
    "What's your favorite thing about how I love you?",
    "What's the kindest thing I've ever done for you?",
    "If our love had a color, what would it be and why?",
    "What would your perfect Sunday with me look like?",
    "Describe a perfect evening with me in three sentences.",
    "What's the best gift I've ever given you, even if it wasn't a thing?",
    "What's a habit of mine you secretly find charming?",
    "What's something I do that calms you down?",
    "Which of our songs would you put on first if I walked through the door right now?",
    "What's a song that reminds you of me?",
    "What's the most beautiful thing you've ever caught me doing?",
    "What's something small I could do that would make your whole day?",
    "When do you feel the most loved by me?",
    "What's a compliment you wish I gave you more often?",
    "What would you write on a note left in my pocket?",
    "What's love supposed to feel like on a boring day?",
  ],
  intimacy: [
    "What does intimacy mean to you, beyond the physical?",
    "What's something silly we should do next time we're together?",
    "What's something tender we should do next time we're together?",
    "What's a quiet moment with me you'd freeze in time?",
    "What's a moment with me you wish lasted longer?",
    "When do you feel closest to me, even when we're apart?",
    "What's a side of you I haven't met yet?",
    "What's a side of me you want to see more of?",
    "What makes you feel wanted?",
    "What's something you'd like us to be more open about?",
    "What's a touch you miss the most?",
    "What's the first thing you want to do when we see each other again?",
    "What helps you feel safe enough to be completely yourself with me?",
    "What's something you find attractive about me that isn't physical?",
    "What's a way we could feel closer this week, even from far away?",
    "What do you think about right before you fall asleep?",
    "What's something you'd never say out loud but would write down?",
    "What does being wanted look like to you?",
  ],
  trust: [
    "What does trust look like for you?",
    "What does faithfulness mean to you, beyond not cheating?",
    "What's the most honest thing you can say to me right now?",
    "What's a question you've been afraid to ask me?",
    "What's something you've never told anyone but want me to know?",
    "What's a fear about your past you'd like me to know?",
    "What's something you forgive me for that I didn't know needed forgiving?",
    "When did you first feel safe with me?",
    "What's something I should know about your faith / what you believe?",
    "What does choosing each other mean, on the days it's hard?",
    "What's something you want me to ask you that I never have?",
    "What's something I've said that you still think about?",
    "What helps you tell me a hard truth?",
    "When was the last time you felt truly understood by me?",
    "What would make it easier to bring me a problem?",
    "What's a boundary of yours I should understand better?",
    "What's a way I could be more reliable for you?",
    "What's something you need to hear from me more often?",
  ],
  distance: [
    "What's the loneliest part of long distance?",
    "What's the best part of long distance?",
    "What do you miss most about me on bad days?",
    "What's a small fear you have about us closing the distance?",
    "What's a small ritual you'd like to share across the distance?",
    "If we had one whole day with no phones, no plans \u2014 what would we do?",
    "What's the hardest hour of the day when we're apart?",
    "What makes the distance feel smaller?",
    "What's something I could send you that would help on a hard day?",
    "What do you want our first hour together to look like next time?",
    "What have you learned about yourself through the distance?",
    "What's something about waiting that you didn't expect?",
    "What's a photo of me you keep going back to?",
    "How do you want us to handle the days we can't talk much?",
    "What's the last thing you want to hear before we hang up?",
    "What would make goodbyes at the airport easier?",
  ],
  playful: [
    "If I could read your mind right now, what would I find?",
    "What's the bravest thing we've done together?",
    "If we could relive one day, which one?",
    "What's a memory of us you replay the most?",
    "What's something you want us to never stop doing?",
    "What's something you want to celebrate that we forgot to?",
    "If we swapped lives for a day, what would surprise you most?",
    "What nickname for me have you never told me about?",
    "What's the funniest thing that's ever happened between us?",
    "If we had to win a competition together, what should it be?",
    "What's a terrible idea we should absolutely try once?",
    "What food would you want us to eat on our last day on earth?",
    "If you had to describe me to a stranger in three words?",
    "What's an argument we've had that's funny in hindsight?",
    "What would our reality show be called?",
    "If we adopted a pet tomorrow, what and what name?",
  ],
  deep: [
    "What scares you most about us, honestly?",
    "What does 'home' mean to you?",
    "What was the last thing that made you cry?",
    "What's a moment when you almost gave up but didn't?",
    "What's a hope you have for us that you've never said out loud?",
    "What's a feeling about us you don't have words for yet?",
    "If you could tell past-me one thing, what would it be?",
    "What's something you want to be braver about together?",
    "What does our first year together feel like to you so far?",
    "What's a way you want to be remembered?",
    "What's something you're still carrying that you'd like to put down?",
    "What do you need most right now that you haven't asked for?",
    "What's changed in you in the last year?",
    "What's a belief of yours that's shifted since we met?",
    "What do you want your life to have been about?",
    "What's something you're afraid I'd think differently of you for?",
  ],
};

// Flat list, kept for the home-screen previews.
const PRESET_QUESTIONS = Object.values(PRESET_BY_CATEGORY).flat();

function categoryOf(text) {
  for (const [cat, list] of Object.entries(PRESET_BY_CATEGORY)) {
    if (list.includes(text)) return cat;
  }
  return null;
}

const MOCK_EVENTS = [
  { id: 'evt_anniv', emoji: '🌸', title: 'Our first anniversary', date: '2027-07-27', _system: true },
];

const PASSWORDS = { ivo: 'nikivo7', nikolina: 'nikolinaiivo777' };
const STORAGE_BUCKET = 'ivolina';

// ===============================================================
// STORAGE LAYER
// ===============================================================
async function dbGet(key) {
  if (!supabase) return null;
  const { data } = await supabase.from('kv').select('value').eq('key', key).maybeSingle();
  return data ? data.value : null;
}
async function dbSet(key, value) {
  if (!supabase) return;
  await supabase.from('kv').upsert({ key, value, updated_at: new Date().toISOString() });
}
function lsGet(key) {
  try { return localStorage.getItem('ivolina_' + key); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem('ivolina_' + key, value); } catch {}
}

// Upload an image file (or data URL) to Supabase Storage and return its public URL.
async function uploadImage(fileOrDataUrl, prefix = 'img') {
  if (!supabase) return null;
  let blob;
  if (typeof fileOrDataUrl === 'string') {
    // it's a data URL
    const res = await fetch(fileOrDataUrl);
    blob = await res.blob();
  } else {
    blob = fileOrDataUrl;
  }
  const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    upsert: false,
  });
  if (error) {
    console.error('upload error', error);
    return null;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Resize an image File or data URL to a max dimension, return JPEG data URL.
function resizeImageToDataUrl(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const state = {
  user: null,
  profile: { ivo: null, nikolina: null },
  questions: [],
  events: [],
  coins: { ivo: 0, nikolina: 0 },
  drawings: [],
  filter: 'all',
  drawColor: '#000',
  drawHistory: [],
  drawCanvas: null,
  drawCtx: null,
  questionPreviewCache: null,
  presetCategory: 'all',
  scrollPositions: {},
  catChipsScroll: 0,
  pendingCategory: null,
  stories: [],
  storyIndex: 0,
  // chat
  currentQuestionId: null,
  messagesByQuestion: {},   // questionId -> array
};

// ===============================================================
// CSS (unchanged from v1 + small additions for avatars, chat)
// ===============================================================
const CSS = `
/* ---------------------------------------------------------------
   Aurora — one set of variables, two skins.
   Dark is the default; light comes from the iPhone's own setting
   or from Settings, and is applied as data-theme on <html>.
   --------------------------------------------------------------- */
:root {
  /* The two of you. Dark-mode values. */
  --ivo: #7BC4F5;
  --ivo-soft: #4A9FE0;
  --niki: #F4A8C8;
  --niki-soft: #E07AAB;

  --accent: var(--ivo);
  --accent-soft: var(--ivo-soft);

  --bg-0: #07060B;
  --bg-1: #0D0B14;
  --bg-2: #16131F;

  --text: #FFFFFF;
  --text-dim: #A49DB4;
  --text-muted: #77718A;

  --card: rgba(14, 12, 24, 0.42);
  --card-hover: rgba(14, 12, 24, 0.55);
  --glass: rgba(255, 255, 255, 0.055);
  --glass-border: rgba(255, 255, 255, 0.09);
  --hairline: rgba(255, 255, 255, 0.07);

  --aurora-1: rgba(123, 196, 245, 0.52);
  --aurora-2: rgba(244, 168, 200, 0.44);
  --aurora-3: rgba(168, 130, 245, 0.34);
  --on-accent: #07060B;

  --r-card: 16px;
  --r-pill: 100px;
  --dur: 0.32s;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.4, 0.5, 1);
}

/* Light. Same blue, same pink — deepened so they hold on white. */
html[data-theme="light"] {
  --ivo: #3B8ECE;
  --ivo-soft: #2C6FA8;
  --niki: #D9689B;
  --niki-soft: #B54B7C;

  --bg-0: #FDFCFF;
  --bg-1: #F6F3FA;
  --bg-2: #FFFFFF;

  --text: #151220;
  --text-dim: #5C5668;
  --text-muted: #8A8398;

  --card: rgba(255, 255, 255, 0.72);
  --card-hover: rgba(255, 255, 255, 0.88);
  --glass: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(21, 18, 32, 0.09);
  --hairline: rgba(21, 18, 32, 0.07);

  --aurora-1: rgba(90, 175, 240, 0.42);
  --aurora-2: rgba(240, 140, 185, 0.36);
  --aurora-3: rgba(150, 120, 235, 0.24);
  --on-accent: #FFFFFF;
}

body[data-user="nikolina"] {
  --accent: var(--niki);
  --accent-soft: var(--niki-soft);
}

* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; }
html, body { overscroll-behavior: none; overflow-x: hidden; }
/* No scrollbar anywhere — it breaks the illusion of an app. */
html, body, .screen, .app-content, .preset-list, .sticker-grid,
.tool-row, .swatch-row, .bg-grid, .cat-chips, .filter-tabs, .story-row {
  scrollbar-width: none; -ms-overflow-style: none;
}
html::-webkit-scrollbar, body::-webkit-scrollbar, .screen::-webkit-scrollbar,
.app-content::-webkit-scrollbar, .preset-list::-webkit-scrollbar { display: none; width: 0; height: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
  background: var(--bg-0);
  color: var(--text);
  min-height: 100vh; min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.01em;
  user-select: none; -webkit-user-select: none;
  transition: background-color 0.45s ease, color 0.45s ease;
}

/* The aurora: one light source over the whole screen, falling away
   towards the bottom. Two overlapping washes so neither colour ends
   in a visible edge. */
body::before {
  content: '';
  position: fixed;
  inset: -10%;
  background:
    radial-gradient(105% 72% at 14% -6%, var(--aurora-1), transparent 66%),
    radial-gradient(100% 66% at 92% 4%, var(--aurora-2), transparent 64%),
    radial-gradient(85% 55% at 55% 22%, var(--aurora-3), transparent 62%),
    radial-gradient(135% 80% at 50% -16%, var(--aurora-1), transparent 78%);
  pointer-events: none;
  z-index: -2;
  transition: opacity 0.45s ease;
}
/* The colour carries all the way to the bottom. A fourth, cooler wash
   rises from below so the lower half is part of the aurora too, rather
   than fading out to a flat background. */
body::after {
  content: '';
  position: fixed;
  inset: -10%;
  background:
    radial-gradient(110% 62% at 10% 106%, var(--aurora-2), transparent 68%),
    radial-gradient(100% 58% at 94% 94%, var(--aurora-1), transparent 66%),
    radial-gradient(80% 46% at 48% 78%, var(--aurora-3), transparent 62%);
  pointer-events: none;
  z-index: -2;
}

/* Numbers that should read as numbers, not as decoration. */
.numeral {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.045em;
  font-weight: 600;
}

input, textarea { -webkit-user-select: text; user-select: text; }
.display { font-weight: 600; letter-spacing: -0.035em; }
.screen { display: none; min-height: 100vh; min-height: 100dvh; padding: 0 0 env(safe-area-inset-bottom, 0); animation: fadeIn 0.5s cubic-bezier(0.16,1,0.3,1); }
.screen.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
@keyframes heartPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes spin { to { transform: rotate(360deg); } }

#screen-login { display: none; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
#screen-login.active { display: flex; }
.login-title { font-size: 56px; line-height: 1; margin-bottom: 8px; background: linear-gradient(135deg, #7BC4F5 0%, #F4A8C8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.login-subtitle { color: var(--text-dim); font-size: 15px; margin-bottom: 64px;  }
.login-cards { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 360px; }
.login-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 28px; padding: 32px 24px; display: flex; align-items: center; gap: 20px; cursor: pointer; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
.login-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, var(--card-color) 0%, transparent 60%); opacity: 0.18; pointer-events: none; }
.login-card:active { transform: scale(0.97); }
.login-card.ivo { --card-color: #7BC4F5; }
.login-card.niki { --card-color: #F4A8C8; }
.login-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--card-color), color-mix(in srgb, var(--card-color) 40%, #000)); display: flex; align-items: center; justify-content: center;  font-size: 28px; color: white; box-shadow: 0 8px 24px color-mix(in srgb, var(--card-color) 30%, transparent); flex-shrink: 0; }
.login-card-text { text-align: left; flex: 1; }
.login-name {  font-size: 24px; font-weight: 500; }
.login-hint { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: none; align-items: flex-end; justify-content: center; z-index: 500; animation: fadeIn 0.3s ease; }
.modal-backdrop.active { display: flex; }
@media (min-width: 500px) { .modal-backdrop { align-items: center; } }
.modal { background: var(--bg-2); box-shadow: 0 -12px 48px rgba(0,0,0,0.35); border: 1px solid var(--glass-border); border-radius: 32px 32px 0 0; padding: 32px 24px calc(32px + env(safe-area-inset-bottom)); width: 100%; max-width: 480px; animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1); max-height: 90vh; overflow-y: auto; }
@media (min-width: 500px) { .modal { border-radius: 32px; margin: 20px; } }
.modal-handle { width: 40px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 24px; }
.modal h2 {  font-size: 26px; margin-bottom: 8px; text-align: center; }
.modal p { color: var(--text-dim); font-size: 14px; text-align: center; margin-bottom: 24px; }
.input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 16px; padding: 16px 18px; color: var(--text); font-size: 16px; font-family: inherit; margin-bottom: 16px; }
.input:focus { outline: none; border-color: var(--accent); background: rgba(255,255,255,0.08); }
textarea.input { resize: none; min-height: 100px; line-height: 1.5; }
.btn { width: 100%; border: none; border-radius: 14px; padding: 15px; font-size: 16px; font-weight: 600; font-family: inherit; cursor: pointer; transition: transform 0.2s var(--ease-spring), background 0.2s; margin-bottom: 10px; letter-spacing: -0.01em; }
.btn:active { transform: scale(0.97); }
.btn-primary { background: var(--accent); color: var(--on-accent); font-weight: 600; }
.btn-ghost { background: rgba(255,255,255,0.05); color: var(--text); border: 1px solid var(--glass-border); }
.btn-danger { background: rgba(255,90,110,0.15); color: #ff95a5; border: 1px solid rgba(255,90,110,0.3); }

.app-header { padding: calc(env(safe-area-inset-top) + 16px) 20px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; color: var(--text); }
.app-header h1 {  font-weight: 500; font-size: 22px; flex: 1; }
.app-content { padding: 8px 20px 100px; }
#screen-home .app-content,
#screen-setup .app-content { padding-top: calc(env(safe-area-inset-top) + 14px); }
#screen-login { padding-top: calc(env(safe-area-inset-top) + 40px); }

/* NEW: home header with avatar */
.home-hero { padding: 12px 4px 28px; display: flex; align-items: center; gap: 16px; }
.home-hero-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); display: flex; align-items: center; justify-content: center;  font-size: 28px; color: white; overflow: hidden; flex-shrink: 0; box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 30%, transparent); cursor: pointer; }
.home-hero-avatar img { width: 100%; height: 100%; object-fit: cover; }
.home-hero-text { flex: 1; min-width: 0; }
.greeting { font-size: 13px; color: var(--text-dim); margin-bottom: 2px; }
.greeting-name {  font-size: 30px; font-weight: 400; line-height: 1.1; background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 60%, #fff) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.greeting-sub { font-weight: 400; color: var(--text-dim); font-size: 13px; margin-top: 4px; }

.coins-bar { display: flex; align-items: center; justify-content: space-between; background: var(--card); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 0.5px solid var(--glass-border); border-radius: var(--r-card); padding: 13px 16px; margin-bottom: 18px; }
.coins-display { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.coin-icon { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ffd56b, #f5a623); display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(245,166,35,0.3); }
.checkin-btn { background: var(--accent); color: var(--on-accent); border: none; border-radius: 12px; padding: 8px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; }
.checkin-btn:disabled { opacity: 0.5; cursor: default; }

.feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.feature-card {
  background: var(--card);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 0.5px solid var(--glass-border);
  border-radius: var(--r-card);
  padding: 18px; cursor: pointer; aspect-ratio: 1;
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
  transition: transform var(--dur) var(--ease-spring), background var(--dur) var(--ease);
}
.feature-card:active { background: var(--card-hover); }
.feature-card:active { transform: scale(0.965); }

.feature-icon { font-size: 28px; line-height: 1; }
.feature-title {  font-size: 19px; font-weight: 500; line-height: 1.2; }
.feature-sub { color: var(--text-dim); font-size: 12px; margin-top: 3px; letter-spacing: -0.005em; }
.feature-card.full { grid-column: 1 / -1; aspect-ratio: auto; padding: 24px; min-height: 130px; }
.feature-card.full .feature-title { font-size: 22px; }

.feature-card.drawing-preview { grid-column: 1 / -1; aspect-ratio: auto; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.drawing-preview-img { width: 100%; aspect-ratio: 1; border-radius: 18px; background: #fff; overflow: hidden; }
.drawing-preview-img img { width: 100%; height: 100%; object-fit: contain; background: #fff; }
.drawing-preview-info { min-width: 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
.drawing-preview-info .feature-title { font-size: 20px; }
.drawing-preview-meta { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.drawing-preview-cta { font-size: 12px; color: var(--accent); font-weight: 600; white-space: nowrap; }
.feature-card.questions-preview { grid-column: 1 / -1; aspect-ratio: auto; padding: 22px; min-height: 160px; }
.questions-preview-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.questions-preview-list { display: flex; flex-direction: column; gap: 6px; }
.questions-preview-item { font-weight: 400; font-size: 13px; color: var(--text-dim); padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 2px solid var(--accent); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: fadeIn 0.6s ease; }

.counter-card { background: var(--card); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 0.5px solid var(--glass-border); border-radius: 20px; padding: 24px 18px; text-align: center; margin-bottom: 14px; position: relative; overflow: hidden; }

.counter-label { font-weight: 400; color: var(--text-dim); font-size: 14px; margin-bottom: 12px; }
.counter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 8px; }
.counter-unit { background: var(--hairline); border-radius: 13px; padding: 12px 4px; }
.counter-num {  font-size: 26px; font-weight: 500; background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #fff)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
.counter-name { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

.event-card { background: var(--card); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 0.5px solid var(--glass-border); border-radius: var(--r-card); padding: 15px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 13px; }
.event-emoji { font-size: 28px; width: 48px; height: 48px; background: rgba(255,255,255,0.05); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.event-info { flex: 1; min-width: 0; }
.event-title {  font-size: 17px; font-weight: 500; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.event-countdown { font-size: 12px; color: var(--accent); font-weight: 500; }
.event-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.event-delete { background: none; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer; padding: 8px; }

.section-title {  font-size: 20px; font-weight: 500; margin: 24px 0 14px; display: flex; align-items: center; justify-content: space-between; }
.add-btn { background: var(--accent); color: var(--on-accent); border: none; border-radius: 12px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }

.question-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 22px; padding: 20px; margin-bottom: 14px; cursor: pointer; transition: transform 0.2s; }
.question-card:active { transform: scale(0.98); }
.question-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
.asker-dot { width: 8px; height: 8px; border-radius: 50%; }
.asker-dot.ivo { background: var(--ivo); }
.asker-dot.niki { background: var(--niki); }
.question-text {  font-size: 17px; line-height: 1.4; margin-bottom: 12px; }
.question-status { display: flex; gap: 8px; margin-top: 12px; }
.status-pill { font-size: 11px; padding: 4px 10px; border-radius: 100px; font-weight: 500; }
.status-pill.answered { background: rgba(100,220,150,0.15); color: #7ee0a5; }
.status-pill.waiting { background: rgba(255,255,255,0.05); color: var(--text-muted); }

.filter-tabs { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 4px 0; }
.filter-tab { background: var(--glass); border: 1px solid var(--glass-border); color: var(--text-dim); padding: 8px 14px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; font-family: inherit; }
.filter-tab.active { background: var(--accent); color: var(--on-accent); border-color: var(--accent); font-weight: 600; }

/* NEW: avatars next to question/answer */
.tiny-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--avc, var(--accent)), var(--accent-soft)); display: inline-flex; align-items: center; justify-content: center;  font-size: 12px; color: white; overflow: hidden; flex-shrink: 0; }
.tiny-avatar img { width: 100%; height: 100%; object-fit: cover; }
.tiny-avatar.ivo { --avc: var(--ivo); }
.tiny-avatar.niki { --avc: var(--niki); }
.med-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--avc, var(--accent)), var(--accent-soft)); display: inline-flex; align-items: center; justify-content: center;  font-size: 14px; color: white; overflow: hidden; flex-shrink: 0; }
.med-avatar img { width: 100%; height: 100%; object-fit: cover; }
.med-avatar.ivo { --avc: var(--ivo); }
.med-avatar.niki { --avc: var(--niki); }

.answer-block { background: rgba(255,255,255,0.04); border-radius: 18px; padding: 16px 18px; margin-bottom: 12px; border-left: 3px solid var(--accent); }
.answer-author { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.answer-text {  font-size: 16px; line-height: 1.5; }
.locked-block { text-align: center; padding: 24px; color: var(--text-muted);  }
.preset-list { max-height: 46vh; overflow-y: auto; -webkit-overflow-scrolling: touch; margin-bottom: 16px; border-radius: 16px; background: rgba(255,255,255,0.03); }
.preset-item { padding: 14px 16px; border-bottom: 1px solid var(--glass-border); cursor: pointer; font-size: 14px; line-height: 1.4; display: flex; align-items: flex-start; gap: 10px; }
.preset-item:active { background: rgba(255,255,255,0.06); }
.preset-item:last-child { border-bottom: none; }
.preset-item.asked { opacity: 0.4; }
.preset-item.asked .preset-text { text-decoration: line-through; text-decoration-color: var(--text-muted); }
.preset-text { flex: 1; min-width: 0; }
.preset-badge { font-size: 11px; color: #7ee0a5; flex-shrink: 0; margin-top: 1px; }
.cat-chips { display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 2px 0 12px; margin: 0 -4px; scrollbar-width: none; }
.cat-chips::-webkit-scrollbar { display: none; }
.cat-chip { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--text-dim); padding: 8px 14px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; font-family: inherit; flex-shrink: 0; }
.cat-chip.active { background: var(--accent); color: var(--on-accent); border-color: var(--accent); font-weight: 600; }
.preset-count { text-align: center; font-size: 12px; color: var(--text-muted); margin-bottom: 12px; font-weight: 400; }

.canvas-wrap { aspect-ratio: 1; background: #fff; border-radius: 20px; overflow: hidden; margin-bottom: 16px; touch-action: none; position: relative; }
#drawCanvas { width: 100%; height: 100%; display: block; touch-action: none; }
.draw-toolbar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.color-dot { width: 36px; height: 36px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.2s; }
.color-dot.active { border-color: white; transform: scale(1.1); }
.tool-btn { background: var(--glass); border: 1px solid var(--glass-border); color: var(--text); border-radius: 12px; padding: 8px 14px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; margin-left: auto; }

.gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.gallery-item { aspect-ratio: 1; background: #fff; border-radius: 14px; overflow: hidden; position: relative; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item-meta { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.6)); padding: 8px; font-size: 10px; color: white; display: flex; justify-content: space-between; }

.settings-section { background: var(--card); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 0.5px solid var(--glass-border); border-radius: var(--r-card); margin-bottom: 14px; overflow: hidden; }
.settings-row { padding: 15px 17px; border-bottom: 0.5px solid var(--hairline); display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.settings-row:last-child { border-bottom: none; }
.settings-label { font-size: 15px; }
.settings-value { color: var(--text-dim); font-size: 14px; }
.avatar-display { width: 88px; height: 88px; border-radius: 50%; margin: 8px auto 16px; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); display: flex; align-items: center; justify-content: center;  font-size: 36px; color: white; overflow: hidden; position: relative; box-shadow: 0 8px 32px color-mix(in srgb, var(--accent) 40%, transparent); }
.avatar-display img { width: 100%; height: 100%; object-fit: cover; }

/* Hidden by its OWN height plus the safe area, so it can never leave a
   sliver on screen no matter how tall the notch is. Opacity and
   visibility do the rest, in case a transform is ever interrupted. */
.toast {
  position: fixed; top: calc(env(safe-area-inset-top) + 14px); left: 50%;
  transform: translateX(-50%) translateY(calc(-100% - env(safe-area-inset-top) - 28px));
  background: var(--bg-2); border: 0.5px solid var(--glass-border); color: var(--text);
  padding: 12px 20px; border-radius: var(--r-pill);
  font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
  z-index: 600; max-width: calc(100vw - 40px);
  box-shadow: 0 10px 34px rgba(0,0,0,0.35);
  opacity: 0; visibility: hidden;
  transition: transform 0.38s var(--ease), opacity 0.28s ease, visibility 0s linear 0.38s;
}
.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1; visibility: visible;
  transition: transform 0.38s var(--ease-spring), opacity 0.2s ease, visibility 0s;
}
.empty { text-align: center; padding: 40px 20px; color: var(--text-muted); }
.empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
.empty-text { font-weight: 400; }
.config-error { padding: 40px 24px; text-align: center; color: var(--text-dim);  }
.config-error h2 { font-size: 28px; margin-bottom: 16px; color: var(--text); }
.config-error code { background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 6px; font-family: monospace; font-size: 13px; }

/* ===== STORIES ===== */
@keyframes ringSpin { to { transform: rotate(360deg); } }
@keyframes storyIn { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }

.story-row { display: flex; gap: 16px; align-items: flex-start; padding: 4px 4px 24px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.story-row::-webkit-scrollbar { display: none; }
.story-bubble { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; width: 76px; cursor: pointer; }
.story-ring { width: 68px; height: 68px; border-radius: 50%; padding: 3px; position: relative; display: flex; align-items: center; justify-content: center; }
.story-ring.unseen { background: conic-gradient(from 0deg, #F4A8C8, #ffd56b, #7BC4F5, #F4A8C8); animation: ringSpin 6s linear infinite; }
.story-ring.seen { background: rgba(255,255,255,0.14); }
.story-ring.none { background: transparent; border: 2px dashed var(--glass-border); }
.story-ring-inner { width: 100%; height: 100%; border-radius: 50%; background: var(--bg-0); padding: 2px; }
.story-avatar { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, var(--avc, var(--accent)), var(--accent-soft)); display: flex; align-items: center; justify-content: center;  font-size: 22px; color: #fff; }
.story-avatar img { width: 100%; height: 100%; object-fit: cover; }
.story-avatar.ivo { --avc: var(--ivo); }
.story-avatar.niki { --avc: var(--niki); }
.story-plus { position: absolute; bottom: -2px; right: -2px; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); color: #0A0612; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; border: 3px solid var(--bg-0); line-height: 1; }
.story-label { font-size: 11px; color: var(--text-dim); max-width: 76px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; }

.story-viewer { position: fixed; inset: 0; background: #000; z-index: 300; display: none; flex-direction: column; }
.story-viewer.active { display: flex; }
.story-progress { display: flex; gap: 4px; padding: calc(env(safe-area-inset-top) + 10px) 12px 8px; }
.story-progress-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.25); border-radius: 2px; overflow: hidden; }
.story-progress-fill { height: 100%; width: 0%; background: #fff; border-radius: 2px; }
.story-progress-fill.done { width: 100%; }
.story-viewer-head { display: flex; align-items: center; gap: 10px; padding: 4px 16px 10px; color: #fff; }
.story-viewer-head .med-avatar { border: 1px solid rgba(255,255,255,0.3); }
.story-viewer-name {  font-size: 16px; }
.story-viewer-time { font-size: 12px; color: rgba(255,255,255,0.6); }
.story-viewer-close { margin-left: auto; background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; line-height: 1; padding: 4px 8px; }
.story-stage { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.story-stage img { max-width: 100%; max-height: 100%; object-fit: contain; animation: storyIn 0.35s cubic-bezier(0.16,1,0.3,1); }
.story-nav { position: absolute; inset: 0; display: flex; }
.story-nav div { flex: 1; }
.story-caption { padding: 12px 20px calc(env(safe-area-inset-bottom) + 20px); color: #fff;  font-size: 15px; text-align: center; }
.story-expiry { padding: 0 20px calc(env(safe-area-inset-bottom) + 14px); text-align: center; color: rgba(255,255,255,0.45); font-size: 11px; }
.story-delete { background: none; border: none; color: rgba(255,255,255,0.55); font-size: 12px; cursor: pointer; font-family: inherit; text-decoration: underline; }

.story-preview-img { width: 100%; max-height: 46vh; object-fit: contain; border-radius: 18px; background: #000; margin-bottom: 16px; display: block; }

/* ===== STORY: zoom, pause, likes (v2.2.2) ===== */
@keyframes floatAround {
  0%   { transform: translate(0, 0) rotate(-4deg); }
  25%  { transform: translate(10px, -12px) rotate(3deg); }
  50%  { transform: translate(-6px, -20px) rotate(-2deg); }
  75%  { transform: translate(-12px, -8px) rotate(4deg); }
  100% { transform: translate(0, 0) rotate(-4deg); }
}
@keyframes likeBurst {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.45); }
  70%  { transform: scale(0.92); }
  100% { transform: scale(1); }
}
@keyframes heartFloatUp {
  0%   { opacity: 0; transform: translateY(0) scale(0.6); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-120px) scale(1.4); }
}

.story-stage img {
  transform-origin: 50% 50%;
  will-change: transform;
  touch-action: none;
}
.story-stage img.zooming { transition: none; }
.story-stage img.settling { transition: transform 0.28s cubic-bezier(0.16,1,0.3,1); }

.story-paused-hint {
  position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.55); color: rgba(255,255,255,0.85);
  padding: 5px 12px; border-radius: 100px; font-size: 11px;
  letter-spacing: 0.06em; text-transform: uppercase;
  opacity: 0; transition: opacity 0.2s; pointer-events: none;
}
.story-paused-hint.show { opacity: 1; }

.story-like-btn {
  position: absolute; right: 16px; bottom: 16px;
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: rgba(255,255,255,0.9); font-size: 24px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 5; padding: 0;
}
.story-like-btn.liked { color: #ff4d6d; border-color: rgba(255,77,109,0.6); background: rgba(255,77,109,0.16); }
.story-like-btn.bursting { animation: likeBurst 0.45s cubic-bezier(0.16,1,0.3,1); }

.story-like-fly {
  position: absolute; right: 30px; bottom: 60px;
  font-size: 30px; color: #ff4d6d; pointer-events: none; z-index: 6;
  animation: heartFloatUp 0.9s ease-out forwards;
}

.story-liked-float {
  position: absolute; z-index: 5; display: flex; align-items: center; gap: 6px;
  background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  padding: 5px 10px 5px 5px; border-radius: 100px;
  animation: floatAround 6s ease-in-out infinite;
  pointer-events: none;
}
.story-liked-float .tiny-avatar { width: 26px; height: 26px; font-size: 11px; }
.story-liked-float .lf-heart { font-size: 14px; color: #ff4d6d; }

/* ===== STORY VIDEO (v2.2.3) ===== */
.story-stage video {
  max-width: 100%; max-height: 100%; object-fit: contain;
  transform-origin: 50% 50%; will-change: transform; touch-action: none;
  animation: storyIn 0.35s cubic-bezier(0.16,1,0.3,1);
  background: #000;
}
.story-stage video.zooming { transition: none; }
.story-stage video.settling { transition: transform 0.28s cubic-bezier(0.16,1,0.3,1); }
.story-sound-btn {
  position: absolute; left: 16px; bottom: 16px;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: #fff; font-size: 18px; display: flex; align-items: center;
  justify-content: center; cursor: pointer; z-index: 5; padding: 0;
}
.story-mute-hint {
  position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.55); color: rgba(255,255,255,0.9);
  padding: 6px 14px; border-radius: 100px; font-size: 12px;
  opacity: 0; transition: opacity 0.3s; pointer-events: none; white-space: nowrap;
}
.story-mute-hint.show { opacity: 1; }
video.story-preview-img { width: 100%; max-height: 46vh; }
.story-viewer { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.25s; }

/* ===== DRAWING STUDIO (v2.4) ===== */
.editor-overlay {
  position: fixed; inset: 0; z-index: 250; background: var(--bg-0);
  display: none; flex-direction: column;
  padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);
}
.editor-overlay.active { display: flex; }

.editor-top { display: flex; align-items: center; gap: 10px; padding: 10px 14px; }
.editor-top h2 {  font-size: 18px; font-weight: 500; flex: 1; }
.ed-icon-btn {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--glass); border: 1px solid var(--glass-border);
  color: var(--text); font-size: 17px; display: flex; align-items: center;
  justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0;
}
.ed-icon-btn:disabled { opacity: 0.3; }
.ed-done-btn {
  background: linear-gradient(135deg, var(--accent), var(--accent-soft));
  color: #0A0612; border: none; border-radius: 100px;
  padding: 9px 18px; font-weight: 600; font-size: 14px; cursor: pointer;
  font-family: inherit; flex-shrink: 0;
}

.editor-canvas-wrap {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 4px 12px 8px; min-height: 0; touch-action: none; position: relative;
}
#editorCanvas {
  max-width: 100%; max-height: 100%; border-radius: 16px;
  touch-action: none; display: block;
  box-shadow: 0 12px 40px rgba(0,0,0,0.45);
}
.editor-hint {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.6); color: rgba(255,255,255,0.9);
  padding: 6px 14px; border-radius: 100px; font-size: 12px;
  pointer-events: none; opacity: 0; transition: opacity 0.3s; white-space: nowrap;
}
.editor-hint.show { opacity: 1; }

.editor-tools { padding: 8px 14px calc(30px + env(safe-area-inset-bottom)); }

.tool-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; }
.tool-row::-webkit-scrollbar { display: none; }
.tool-chip {
  background: var(--glass); border: 1px solid var(--glass-border);
  color: var(--text-dim); padding: 8px 13px; border-radius: 100px;
  font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
  font-family: inherit; flex-shrink: 0; display: flex; align-items: center; gap: 5px;
}
.tool-chip.active { background: var(--accent); color: #0A0612; border-color: var(--accent); }

.slider-row { display: flex; align-items: center; gap: 12px; padding: 5px 2px; }
.slider-label { font-size: 11px; color: var(--text-muted); width: 46px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.06em; }

input.ed-slider {
  -webkit-appearance: none; appearance: none;
  flex: 1; height: 22px; border-radius: 11px; outline: none;
  background: transparent; margin: 0; padding: 0;
}
input.ed-slider::-webkit-slider-runnable-track { height: 22px; border-radius: 11px; }
input.ed-slider::-moz-range-track { height: 22px; border-radius: 11px; }
input.ed-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 26px; height: 26px; border-radius: 50%;
  background: #fff; border: 3px solid var(--bg-0);
  box-shadow: 0 2px 8px rgba(0,0,0,0.5); cursor: pointer; margin-top: -2px;
}
input.ed-slider::-moz-range-thumb {
  width: 26px; height: 26px; border-radius: 50%;
  background: #fff; border: 3px solid var(--bg-0);
  box-shadow: 0 2px 8px rgba(0,0,0,0.5); cursor: pointer;
}
#colorSlider { background: linear-gradient(to right,
  #000 0%, #ff0000 10%, #ffff00 25%, #00ff00 40%,
  #00ffff 55%, #0000ff 70%, #ff00ff 85%, #fff 100%); }
#widthSlider { background: var(--glass); border: 1px solid var(--glass-border); }

.swatch-row { display: flex; gap: 7px; padding: 2px 0 6px; overflow-x: auto; scrollbar-width: none; }
.swatch-row::-webkit-scrollbar { display: none; }
.swatch {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  cursor: pointer; border: 2px solid transparent; transition: transform 0.15s;
}
.swatch.active { border-color: #fff; transform: scale(1.12); }

.color-preview {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.35); display: flex;
  align-items: center; justify-content: center;
}
.width-dot { border-radius: 50%; background: #fff; }

.sticker-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));
  gap: 6px; max-height: 190px; overflow-y: auto; padding: 4px;
  background: rgba(255,255,255,0.03); border-radius: 14px;
}
.sticker-btn {
  aspect-ratio: 1; border: none; background: rgba(255,255,255,0.04);
  border-radius: 10px; font-size: 24px; cursor: pointer; padding: 0;
  display: flex; align-items: center; justify-content: center;
}
.sticker-btn.active { background: var(--accent); }

.bg-grid { display: flex; gap: 8px; overflow-x: auto; padding: 4px 0; scrollbar-width: none; }
.bg-grid::-webkit-scrollbar { display: none; }
.bg-swatch {
  width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
  cursor: pointer; border: 2px solid transparent; background-size: cover;
}
.bg-swatch.active { border-color: var(--accent); }

.panel { display: none; padding-top: 6px; }
.panel.open { display: block; animation: fadeIn 0.25s ease; }

.gallery-new-btn {
  width: 100%; border: 1px dashed var(--glass-border); background: var(--glass);
  color: var(--text); border-radius: 20px; padding: 18px; font-size: 15px;
  font-weight: 600; font-family: inherit; cursor: pointer; margin-bottom: 20px;
}

/* ===== APP LOCK (v2.5) ===== */
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }

.lock-screen {
  position: fixed; inset: 0; z-index: 700;
  background: var(--bg-0);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--accent) 20%, transparent), transparent),
    linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%);
  display: none; align-items: center; justify-content: center;
  padding: 24px calc(24px + env(safe-area-inset-left)) calc(24px + env(safe-area-inset-bottom));
}
.lock-screen.active { display: flex; }
.lock-inner { width: 100%; max-width: 320px; text-align: center; }
.lock-mark {  font-size: 34px; margin-bottom: 6px;
  background: linear-gradient(135deg, #7BC4F5 0%, #F4A8C8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.lock-name { font-weight: 400; color: var(--text-dim); font-size: 15px; }
.lock-msg { color: var(--text-muted); font-size: 13px; margin: 14px 0 26px; min-height: 18px; }
.lock-btn { max-width: 280px; margin-left: auto; margin-right: auto; }

.lock-pin { margin-top: 18px; }
.pin-dots { display: flex; gap: 14px; justify-content: center; margin-bottom: 22px; }
.pin-dot { width: 13px; height: 13px; border-radius: 50%; border: 1.5px solid var(--glass-border); }
.pin-dot.on { background: var(--accent); border-color: var(--accent); }
.pin-pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; max-width: 260px; margin: 0 auto; }
.pin-key {
  aspect-ratio: 1; border-radius: 50%; border: 1px solid var(--glass-border);
  background: var(--glass); color: var(--text);
  font-size: 22px; font-family: inherit; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.12s, background 0.12s;
}
.pin-key:active { transform: scale(0.93); background: rgba(255,255,255,0.09); }

/* ===== appearance picker ===== */
.theme-choice {
  width: 100%; display: flex; align-items: center; gap: 10px;
  background: var(--card); border: 0.5px solid var(--glass-border);
  border-radius: 14px; padding: 14px 16px; margin-bottom: 8px;
  cursor: pointer; font-family: inherit; color: var(--text); text-align: left;
  transition: background 0.2s;
}
.theme-choice.active { border-color: var(--accent); }
.theme-choice-label { font-size: 15px; font-weight: 500; letter-spacing: -0.01em; }
.theme-choice-sub { font-size: 12px; color: var(--text-muted); margin-left: auto; }
.theme-check { color: var(--accent); font-size: 15px; width: 14px; }

/* ===== questions coloured by whoever asked ===== */
.question-card {
  border-left: 2.5px solid var(--asker, var(--glass-border));
  border-radius: 0 var(--r-card) var(--r-card) 0;
  background: var(--card);
  position: relative;
  transition: transform var(--dur) var(--ease-spring), opacity 0.3s ease;
}
.question-card.by-ivo  { --asker: var(--ivo);  background: color-mix(in srgb, var(--ivo) 7%, var(--card)); }
.question-card.by-niki { --asker: var(--niki); background: color-mix(in srgb, var(--niki) 7%, var(--card)); }
/* Both answered: the stripe softens a touch, the words stay as they are. */
.question-card.settled { border-left-color: color-mix(in srgb, var(--asker) 45%, transparent); }

.question-meta { align-items: center; }
.asker-label { color: var(--asker, var(--text-muted)); font-weight: 600; }

/* The dot. Only where something is genuinely waiting for you. */
.new-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--asker, var(--accent));
  flex-shrink: 0; margin-left: auto;
  animation: dotIn 0.4s var(--ease-spring);
}
@keyframes dotIn { from { transform: scale(0); } to { transform: scale(1); } }

.card-dot {
  position: absolute; top: 14px; right: 14px;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  animation: dotIn 0.4s var(--ease-spring);
}

/* One dot up top that means: something, somewhere, is new. */
.hero-bell { margin-left: auto; position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.hero-bell-icon { font-size: 15px; color: var(--text-dim); }
.hero-bell .card-dot { top: 1px; right: 1px; border: 1.5px solid var(--bg-0); width: 9px; height: 9px; }

/* ===== motion (v2.6) ===== */
/* 1. Screens arrive instead of appearing. */
.screen { animation: screenIn 0.34s cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes screenIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.screen.from-back { animation: screenBack 0.34s cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes screenBack { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }

/* 2. The seconds turn over rather than snapping. */
@keyframes tick { 0% { opacity: 0.35; transform: translateY(-2px); } 100% { opacity: 1; transform: none; } }
.counter-num.ticked { animation: tick 0.28s cubic-bezier(0.22, 1, 0.36, 1); }

/* 3. Swipe back: the screen follows your thumb, and the one you are
   going back to waits behind it instead of leaving bare background. */
.screen.dragging { animation: none; transition: none; position: relative; z-index: 2; }
.screen.peeking {
  display: block; position: fixed; inset: 0; z-index: 1;
  animation: none; overflow: hidden; pointer-events: none;
}
.swipe-hint {
  position: fixed; left: 0; top: 0; bottom: 0; width: 22px; z-index: 5;
}

/* Everything that can be pressed answers the press. */
.question-card:active, .event-card:active, .settings-row:active,
.login-card:active, .theme-choice:active { transform: scale(0.985); }
.settings-row { transition: transform 0.18s var(--ease-spring), background 0.18s; }
.settings-row:active { background: var(--card-hover); }

@media (prefers-reduced-motion: reduce) {
  .screen, .counter-num.ticked, .new-dot, .card-dot { animation: none !important; }
}

/* ===== the status bar, the way Instagram does it =====
   The app draws behind the clock (viewport-fit=cover +
   black-translucent). This strip sits exactly over that area,
   blurs whatever scrolls underneath, and fades out downwards so
   there is no edge. It is transparent — the aurora shows through.

   One iOS constraint worth knowing: once the app draws behind the
   status bar, the clock and icons are always white. So in light
   mode the strip carries a slight darkening, purely so the white
   clock stays readable. That is the same trick Instagram uses. */
.top-blur {
  position: fixed; top: 0; left: 0; right: 0;
  height: calc(env(safe-area-inset-top) + 6px);
  min-height: 44px;
  z-index: 30; pointer-events: none;
  backdrop-filter: blur(22px) saturate(1.35);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 62%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 62%, transparent 100%);
  background: linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.04) 70%, transparent);
}
html[data-theme="light"] .top-blur {
  background: linear-gradient(180deg, rgba(20,24,40,0.30), rgba(20,24,40,0.10) 70%, transparent);
}

/* ===== what's new ===== */
.whats-new-tag {
  text-align: center; font-size: 11px; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--accent); font-weight: 600;
  margin-bottom: 6px;
}
.whats-new-list { list-style: none; margin: 6px 0 22px; padding: 0; }
.whats-new-list li {
  font-size: 14px; line-height: 1.45; color: var(--text-dim);
  padding: 10px 0 10px 22px; position: relative;
  border-bottom: 0.5px solid var(--hairline);
}
.whats-new-list li:last-child { border-bottom: none; }
.whats-new-list li::before {
  content: ''; position: absolute; left: 4px; top: 17px;
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
}

/* ===== a card growing into its screen ===== */
.card-ghost {
  position: fixed;
  z-index: 20;
  background: var(--card);
  border: 0.5px solid var(--glass-border);
  border-radius: var(--r-card);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  pointer-events: none;
  opacity: 1;
}
.card-ghost.growing {
  transition:
    top 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    left 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease 0.06s;
}
/* Arriving from a card: the screen rises the last little bit rather
   than sliding in from nowhere. */
.screen.morphed { animation: screenMorph 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes screenMorph {
  from { opacity: 0; transform: scale(0.985); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .card-ghost.growing { transition: none; }
  .screen.morphed { animation: none; }
}

/* ===== numbers that roll over ===== */
.roll { display: inline-block; position: relative; overflow: hidden; vertical-align: bottom; line-height: 1.05; }
.roll-in  { animation: rollIn 0.34s cubic-bezier(0.22, 1, 0.36, 1); }
.roll-out { position: absolute; left: 0; right: 0; top: 0; animation: rollOut 0.34s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes rollIn  { from { transform: translateY(90%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes rollOut { from { transform: none; opacity: 1; } to { transform: translateY(-90%); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .roll-in, .roll-out { animation: none; }
  .roll-out { display: none; }
}

/* ===== the vault ===== */
.vault-head-note { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.5; }
.vault-meta { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
.vault-meta-warn { color: #ffb27a; }
.vault-add {
  width: 100%; border: 1px dashed var(--glass-border); background: var(--card);
  color: var(--text); border-radius: var(--r-card); padding: 16px; font-size: 15px;
  font-weight: 600; font-family: inherit; cursor: pointer; margin-bottom: 16px;
  letter-spacing: -0.01em;
}
.vault-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.vault-tile {
  aspect-ratio: 1; border-radius: 10px; overflow: hidden; position: relative;
  background: var(--hairline); cursor: pointer;
  transition: transform 0.2s var(--ease-spring);
}
.vault-tile:active { transform: scale(0.95); }
.vault-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
.vault-badge {
  position: absolute; right: 6px; bottom: 6px; font-size: 10px; color: #fff;
  background: rgba(0,0,0,0.55); border-radius: 100px; padding: 2px 7px;
}
.vault-origin {
  position: absolute; left: 6px; top: 6px; font-size: 9px; color: #fff;
  background: rgba(0,0,0,0.45); border-radius: 100px; padding: 2px 7px;
  letter-spacing: 0.04em;
}
.vault-preview {
  width: 100%; max-height: 52vh; border-radius: 14px; overflow: hidden;
  background: #000; margin-bottom: 14px; display: flex; align-items: center; justify-content: center;
}
.vault-preview img, .vault-preview video { max-width: 100%; max-height: 52vh; display: block; }
.vault-progress {
  position: fixed; left: 50%; bottom: calc(env(safe-area-inset-bottom) + 24px);
  transform: translateX(-50%) translateY(20px);
  background: var(--bg-2); border: 0.5px solid var(--glass-border);
  padding: 10px 18px; border-radius: var(--r-pill); font-size: 13px;
  z-index: 550; opacity: 0; visibility: hidden;
  transition: opacity 0.25s, transform 0.25s var(--ease), visibility 0s linear 0.25s;
}
.vault-progress.show { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); transition-delay: 0s; }

.story-keep-btn {
  position: absolute; right: 16px; bottom: 78px;
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: rgba(255,255,255,0.9); font-size: 19px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 5; padding: 0;
}

/* The save control is invisible on purpose. It sits where the button
   used to be, and takes two taps inside a second. */
.vault-save-hidden {
  display: block; width: 100%; height: 46px;
  background: transparent; border: none; padding: 0; margin-bottom: 10px;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  position: relative;
}
.vault-save-hidden::after {
  content: ''; position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%); width: 26px; height: 2px;
  border-radius: 2px; background: var(--text-muted);
  opacity: 0; transition: opacity 0.25s;
}
.vault-save-hidden.armed::after { opacity: 0.35; }
.vault-save-hidden.working::after {
  opacity: 0.8; background: var(--accent); width: 40px;
}

.vault-video-holder { position: relative; width: 100%; display: flex; align-items: center; justify-content: center; }
.vault-video-holder img { max-width: 100%; max-height: 52vh; display: block; }
.vault-video-holder video { max-width: 100%; max-height: 52vh; display: block; }
.vault-play {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 58px; height: 58px; border-radius: 50%;
  background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  color: #fff; font-size: 20px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

/* ===== CHAT ===== */
.chat-divider { text-align: center; margin: 28px 0 16px; font-weight: 400; color: var(--text-muted); font-size: 13px; display: flex; align-items: center; gap: 10px; }
.chat-divider::before, .chat-divider::after { content: ''; flex: 1; height: 1px; background: var(--glass-border); }

.chat-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.chat-msg { display: flex; gap: 10px; max-width: 88%; }
.chat-msg.mine { align-self: flex-end; flex-direction: row-reverse; }
.chat-bubble { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 18px; padding: 10px 14px; font-size: 15px; line-height: 1.4; word-wrap: break-word; overflow-wrap: break-word; position: relative; min-width: 60px; }
.chat-msg.mine .chat-bubble { background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 80%, transparent), color-mix(in srgb, var(--accent-soft) 80%, transparent)); color: #0A0612; border-color: transparent; }
.chat-bubble.image-bubble { padding: 4px; }
.chat-bubble img { display: block; max-width: 240px; max-height: 320px; border-radius: 14px; }
.chat-msg-meta { font-size: 10px; color: var(--text-muted); margin-top: 4px; display: flex; align-items: center; gap: 6px; }
.chat-msg.mine .chat-msg-meta { justify-content: flex-end; }
.chat-msg-col { display: flex; flex-direction: column; min-width: 0; }
.heart-mark { position: absolute; bottom: -8px; right: -6px; width: 20px; height: 20px; background: var(--bg-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; animation: heartPop 0.4s cubic-bezier(0.16,1,0.3,1); }
.chat-msg.mine .heart-mark { right: auto; left: -6px; }

.chat-composer {
  position: fixed; left: 12px; right: 12px;
  bottom: calc(env(safe-area-inset-bottom) + 10px);
  display: flex; gap: 8px; align-items: flex-end;
  background: var(--bg-2); border: 1px solid var(--glass-border);
  border-radius: 24px; padding: 8px;
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
  z-index: 40;
  transition: transform 0.18s ease-out;
}
@media (min-width: 520px) { .chat-composer { left: 50%; right: auto; width: 480px; margin-left: -240px; } }
/* Room so the last message isn't hidden behind the composer. */
#screen-questionDetail.has-chat .app-content { padding-bottom: 120px; }
.chat-input { flex: 1; background: transparent; border: none; color: var(--text); font-family: inherit; font-size: 16px; padding: 10px 12px; resize: none; min-height: 24px; max-height: 120px; outline: none; }

/* iOS zooms the page whenever you tap a field smaller than 16px, and our
   viewport then won't let you zoom back out. Never go below 16px here. */
input, textarea, select { font-size: 16px !important; -webkit-text-size-adjust: 100%; }
.chat-attach-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.chat-send-btn { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); color: #0A0612; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; font-weight: 700; }
.chat-send-btn:disabled { opacity: 0.4; cursor: default; }
.chat-uploading { padding: 8px 12px; color: var(--text-muted); font-size: 12px;  }
`;

// ===============================================================
// HTML SHELL
// ===============================================================
const HTML = `
<div id="screen-login" class="screen">
  <div class="display login-title">ivolina</div>
  <div class="login-subtitle">a little world, just for two</div>
  <div class="login-cards">
    <div class="login-card ivo" data-who="ivo">
      <div class="login-avatar">I</div>
      <div class="login-card-text"><div class="login-name">Ivo</div><div class="login-hint">tap to continue</div></div>
    </div>
    <div class="login-card niki" data-who="nikolina">
      <div class="login-avatar">N</div>
      <div class="login-card-text"><div class="login-name">Nikolina</div><div class="login-hint">tap to continue</div></div>
    </div>
  </div>
</div>

<div id="screen-setup" class="screen">
  <div class="app-content" style="padding-top: 40px; max-width: 480px; margin: 0 auto;">
    <div class="display login-title" style="font-size: 40px; text-align: center;">welcome</div>
    <div class="login-subtitle" style="margin-bottom: 32px;">tell us about yourself</div>
    <div class="avatar-display" id="setupAvatarDisplay">I</div>
    <input type="file" id="setupAvatarFile" accept="image/*" style="display:none;">
    <button class="btn btn-ghost" id="setupAvatarBtn">choose photo</button>
    <input type="text" id="setupNameInput" class="input" placeholder="display name" style="margin-top: 16px;">
    <button class="btn btn-primary" id="setupContinueBtn">continue</button>
  </div>
</div>

<div id="screen-home" class="screen">
  <div class="app-content">
    <div class="home-hero">
      <div class="home-hero-avatar" id="homeAvatar">—</div>
      <div class="home-hero-text">
        <div class="greeting">welcome back,</div>
        <div class="greeting-name" id="homeName">—</div>
        <div class="greeting-sub" id="homeSub">a little world, just for two</div>
      </div>
      <div class="hero-bell" id="heroBell"><span class="hero-bell-icon">◉</span></div>
    </div>
    <div class="story-row" id="storyRow"></div>
    <input type="file" id="storyFile" accept="image/*,video/*" style="display:none;">
    <input type="file" id="storyCamera" accept="image/*,video/*" capture="environment" style="display:none;">
    <div class="coins-bar">
      <div class="coins-display">
        <div class="coin-icon">★</div>
        <span id="coinsCount">0</span>
        <span style="color: var(--text-muted); font-weight: 400; font-size: 13px; margin-left: 4px;">coins</span>
      </div>
      <button class="checkin-btn" id="checkinBtn">+300 daily</button>
    </div>
    <div class="feature-grid" id="featureGrid"></div>
  </div>
</div>

<div id="screen-memories" class="screen">
  <div class="app-header">
    <div class="back-btn" data-goto="home">‹</div>
    <h1>our timeline</h1>
  </div>
  <div class="app-content">
    <div class="counter-card">
      <div class="counter-label">together since 27 july 2026</div>
      <div class="counter-grid">
        <div class="counter-unit"><div class="counter-num" id="cYears">0</div><div class="counter-name">years</div></div>
        <div class="counter-unit"><div class="counter-num" id="cMonths">0</div><div class="counter-name">months</div></div>
        <div class="counter-unit"><div class="counter-num" id="cDays">0</div><div class="counter-name">days</div></div>
      </div>
      <div class="counter-grid">
        <div class="counter-unit"><div class="counter-num" id="cHours">0</div><div class="counter-name">hours</div></div>
        <div class="counter-unit"><div class="counter-num" id="cMins">0</div><div class="counter-name">mins</div></div>
        <div class="counter-unit"><div class="counter-num" id="cSecs">0</div><div class="counter-name">secs</div></div>
      </div>
    </div>
    <div class="counter-card" style="padding: 20px;">
      <div class="counter-label">until our first anniversary</div>
      <div style=" font-size: 32px; margin-top: 4px;" id="anniversaryCountdown">— days</div>
    </div>

    <div class="counter-card" style="padding: 20px;">
      <div class="counter-label">since we first spoke, 8 may 2026</div>
      <div style=" font-size: 32px; margin-top: 4px;" id="firstContactCount">— days</div>
      <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;" id="firstContactSub"></div>
    </div>
    <div class="section-title">our moments<button class="add-btn" id="addEventBtn">+ add</button></div>
    <div id="eventsList"></div>
  </div>
</div>

<div id="screen-questions" class="screen">
  <div class="app-header">
    <div class="back-btn" data-goto="home">‹</div>
    <h1>questions</h1>
    <button class="add-btn" id="askQuestionBtn">+ ask</button>
  </div>
  <div class="app-content">
    <div class="filter-tabs">
      <button class="filter-tab active" data-filter="all">all</button>
      <button class="filter-tab" data-filter="unanswered">to answer</button>
      <button class="filter-tab" data-filter="theirs">waiting on them</button>
      <button class="filter-tab" data-filter="done">complete</button>
    </div>
    <div id="questionsList"></div>
  </div>
</div>

<div id="screen-questionDetail" class="screen">
  <div class="app-header">
    <div class="back-btn" data-goto="questions">‹</div>
    <h1>question</h1>
  </div>
  <div class="app-content" id="questionDetailContent"></div>
</div>

<div id="screen-drawing" class="screen">
  <div class="app-header">
    <div class="back-btn" data-goto="home">‹</div>
    <h1>drawings</h1>
  </div>
  <div class="app-content">
    <button class="gallery-new-btn" id="newDrawingBtn">✎  start a new drawing</button>
    <div class="section-title">gallery</div>
    <div class="gallery-grid" id="galleryGrid"></div>
  </div>
</div>

<div id="screen-vault" class="screen">
  <div class="app-header">
    <div class="back-btn" data-goto="home">‹</div>
    <h1>kept</h1>
    <button class="add-btn" id="vaultAddBtn">+ add</button>
  </div>
  <div class="app-content">
    <div class="vault-head-note">
      Originals, exactly as they were. Nobody sees these unless they have your Supabase.
    </div>
    <div class="vault-meta" id="vaultMeta"></div>
    <input type="file" id="vaultFile" accept="image/*,video/*" multiple style="display:none;">
    <button class="vault-add" id="vaultAdd">＋  add photos or videos</button>
    <div class="vault-grid" id="vaultGrid"></div>
  </div>
</div>

<div id="screen-settings" class="screen">
  <div class="app-header">
    <div class="back-btn" data-goto="home">‹</div>
    <h1>settings</h1>
  </div>
  <div class="app-content">
    <div class="settings-section">
      <div style="padding: 24px 18px 8px; text-align: center;">
        <div class="avatar-display" id="settingsAvatar">—</div>
        <input type="file" id="settingsAvatarFile" accept="image/*" style="display:none;">
        <button class="btn btn-ghost" style="max-width: 200px; margin: 0 auto;" id="settingsAvatarBtn">change photo</button>
      </div>
      <div class="settings-row" id="changeNameRow"><span class="settings-label">display name</span><span class="settings-value" id="settingsNameValue">—</span></div>
      <div class="settings-row"><span class="settings-label">logged in as</span><span class="settings-value" id="settingsUserValue">—</span></div>
    </div>
    <div class="settings-section">
      <div class="settings-row" data-goto="memories"><span class="settings-label">manage moments & countdowns</span><span class="settings-value">›</span></div>
      <div class="settings-row" id="notesRow">
        <span class="settings-label">what's new</span>
        <span class="settings-value" id="notesVersion">›</span>
      </div>
      <div class="settings-row" id="themeRow">
        <span class="settings-label">appearance</span>
        <span class="settings-value" id="themeValue">—</span>
      </div>
      <div class="settings-row" id="lockRow">
        <span class="settings-label">app lock</span>
        <span class="settings-value" id="lockValue">—</span>
      </div>
      <div class="settings-row" id="notifyRow">
        <span class="settings-label">notifications</span>
        <span class="settings-value" id="notifyValue">—</span>
      </div>
      <div class="settings-row" id="resetCoinsRow"><span class="settings-label" style="color: var(--text-dim);">reset my coins</span><span class="settings-value">›</span></div>
    </div>
    <div class="settings-section">
      <div class="settings-row" id="logoutRow"><span class="settings-label" style="color: #ff95a5;">logout</span><span class="settings-value">›</span></div>
    </div>
    <div style="text-align: center; margin-top: 32px; color: var(--text-muted); font-size: 12px; font-weight: 400;">
      ivolina v2.8.1 · made with love
    </div>
  </div>
</div>

<div class="modal-backdrop" id="modalBackdrop"></div>
<div class="story-viewer" id="storyViewer"></div>
<div class="editor-overlay" id="editorOverlay"></div>
<div class="lock-screen" id="lockScreen"></div>
<div class="top-blur"></div>
<div class="toast" id="toast"></div>
<div class="vault-progress" id="vaultProgress"></div>
`;

// ===============================================================
// HELPERS
// ===============================================================
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Returns HTML for an avatar img/initial. cls = 'tiny' or 'med' etc.
function avatarHtml(who, size = 'tiny') {
  const profile = state.profile[who];
  const initial = who === 'ivo' ? 'I' : 'N';
  const classWho = who === 'ivo' ? 'ivo' : 'niki';
  const cls = size === 'tiny' ? 'tiny-avatar' : 'med-avatar';
  if (profile?.avatar) {
    return `<span class="${cls} ${classWho}"><img src="${profile.avatar}" alt=""></span>`;
  }
  return `<span class="${cls} ${classWho}">${initial}</span>`;
}


// ===============================================================
// CARD → SCREEN (v2.7)
// Tapping a card grows that card into the screen it opens, instead
// of one view replacing another. A copy of the card is flown from
// where it sits to fill the display; the real screen fades in
// underneath and the copy is thrown away.
// ===============================================================
let morphing = false;

function prefersLessMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function morphCardToScreen(cardEl, screenName) {
  // If anything is in the way, or the phone asks for less motion,
  // just go — a missing flourish is better than a stuck screen.
  if (!cardEl || morphing || prefersLessMotion() || !cardEl.getBoundingClientRect) {
    showScreen(screenName);
    return;
  }

  const rect = cardEl.getBoundingClientRect();
  if (!rect.width || !rect.height) { showScreen(screenName); return; }

  morphing = true;

  const ghost = document.createElement('div');
  ghost.className = 'card-ghost';
  ghost.style.top = rect.top + 'px';
  ghost.style.left = rect.left + 'px';
  ghost.style.width = rect.width + 'px';
  ghost.style.height = rect.height + 'px';
  document.body.appendChild(ghost);

  cardEl.style.opacity = '0';

  // Let the ghost land at its starting size before growing it.
  requestAnimationFrame(() => {
    ghost.classList.add('growing');
    ghost.style.top = '0px';
    ghost.style.left = '0px';
    ghost.style.width = '100%';
    ghost.style.height = '100%';
    ghost.style.borderRadius = '0px';
    ghost.style.opacity = '0';
  });

  // Bring the real screen up while the ghost is still expanding, so
  // the two overlap instead of one flashing after the other.
  setTimeout(() => showScreen(screenName, { morphed: true }), 130);

  setTimeout(() => {
    ghost.remove();
    cardEl.style.opacity = '';
    morphing = false;
  }, 460);
}

function showScreen(name, opts = {}) {
  // Remember where you were on the screen you're leaving.
  const leaving = document.querySelector('.screen.active');
  if (leaving) state.scrollPositions[leaving.id] = window.scrollY;

  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active'); s.classList.remove('from-back'); s.classList.remove('morphed');
  });
  const t = document.getElementById('screen-' + name);
  if (t) {
    // A swipe has already moved it into place; animating again would jolt.
    if (opts.back && !opts.silent) t.classList.add('from-back');
    else if (opts.morphed) t.classList.add('morphed');
    t.classList.add('active');
  }
  if (name === 'home') renderHome();
  if (name === 'memories') renderMemories();
  if (name === 'questions') renderQuestions();
  if (name === 'drawing') initDrawing();
  if (name === 'settings') renderSettings();
  if (name === 'vault') renderVault();
  if (name === 'setup') {
    const d = document.getElementById('setupAvatarDisplay');
    d.textContent = state.user === 'ivo' ? 'I' : 'N';
    const p = state.profile[state.user];
    document.getElementById('setupNameInput').value = p?.name || '';
    if (p?.avatar) d.innerHTML = `<img src="${p.avatar}">`;
  }
  // Leaving a question detail screen: stop watching its chat
  if (name !== 'questionDetail') {
    stopChatSubscription();
  }

  // Go back to where you were on this screen. Two frames, because the
  // content has to actually be laid out before the page is tall enough
  // to scroll to that position.
  const target = opts.resetScroll ? 0 : (state.scrollPositions['screen-' + name] || 0);
  requestAnimationFrame(() => {
    window.scrollTo(0, target);
    requestAnimationFrame(() => window.scrollTo(0, target));
  });
}

function askPassword(who) {
  showModal(`
    <div class="modal-handle"></div>
    <h2>${who === 'ivo' ? 'Ivo' : 'Nikolina'}</h2>
    <p>enter the password to continue</p>
    <input type="password" id="pwInput" class="input" placeholder="password" autocomplete="current-password">
    <button class="btn btn-primary" id="pwSubmit">unlock</button>
    <button class="btn btn-ghost" id="pwCancel">cancel</button>
  `);
  document.getElementById('pwSubmit').onclick = () => checkPassword(who);
  document.getElementById('pwCancel').onclick = closeModal;
  document.getElementById('pwInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPassword(who);
  });
  setTimeout(() => document.getElementById('pwInput').focus(), 100);
}

async function checkPassword(who) {
  const input = document.getElementById('pwInput').value;
  if (input === PASSWORDS[who]) {
    state.user = who;
    document.body.dataset.user = who;
    lsSet('session', who);
    markUnlocked();
    closeModal();
    if (!state.profile[who] || !state.profile[who].name) {
      showScreen('setup');
    } else {
      showScreen('home');
      toast(`welcome back, ${state.profile[who].name}`);
    }
  } else {
    const inp = document.getElementById('pwInput');
    inp.style.borderColor = '#ff5e7a';
    inp.value = '';
    inp.placeholder = 'wrong password';
    setTimeout(() => { inp.style.borderColor = ''; }, 1500);
  }
}

function logout() {
  showConfirm('log out?', 'you can sign back in any time.', () => {
    lsSet('session', '');
    state.user = null;
    showScreen('login');
  });
}

// ----- SETUP -----
let pendingAvatar = null;
async function handleSetupAvatar(e) {
  const f = e.target.files[0];
  if (!f) return;
  // Resize for speed
  try {
    const resized = await resizeImageToDataUrl(f, 600, 0.85);
    // Upload to storage; if it fails, keep the data URL as fallback
    const url = await uploadImage(resized, 'avatars');
    pendingAvatar = url || resized;
    const d = document.getElementById('setupAvatarDisplay');
    d.innerHTML = `<img src="${pendingAvatar}">`;
  } catch (err) {
    console.error(err);
    toast('could not load photo');
  }
}

async function finishSetup() {
  const name = document.getElementById('setupNameInput').value.trim();
  if (!name) { toast('please enter a name'); return; }
  const profile = { name, avatar: pendingAvatar || null };
  state.profile[state.user] = profile;
  await dbSet(`profile:${state.user}`, JSON.stringify(profile));
  pendingAvatar = null;
  showScreen('home');
  toast(`welcome, ${name}`);
}

// ----- HOME -----
function pickQuestionPreviews() {
  const now = Date.now();
  if (state.questionPreviewCache && now - state.questionPreviewCache.t < 30000) {
    return state.questionPreviewCache.qs;
  }
  const shuffled = [...PRESET_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 3);
  state.questionPreviewCache = { t: now, qs: shuffled };
  return shuffled;
}


// ---------------------------------------------------------------
// What is genuinely waiting for you. Used for the dots.
// The rule: a dot only appears where YOU still have something to do
// or something to see. If it lights up everywhere, it means nothing.
// ---------------------------------------------------------------

// A question stops being "new" the moment you open it — reading it is
// enough. Whether you've answered is shown by the pills, not the dot.
function openedQuestionIds() {
  try { return new Set(JSON.parse(lsGet('openedQuestions') || '[]')); }
  catch { return new Set(); }
}

function markQuestionOpened(id) {
  const seen = openedQuestionIds();
  if (seen.has(id)) return false;
  seen.add(id);
  lsSet('openedQuestions', JSON.stringify([...seen].slice(-300)));
  return true;
}

function pendingCounts() {
  const me = state.user;
  const other = me === 'ivo' ? 'nikolina' : 'ivo';
  const seen = seenStoryIds();
  const opened = openedQuestionIds();
  return {
    questions: state.questions.filter(q => !q.answers[me] && !opened.has(q.id)).length,
    stories: state.stories.filter(s => s.author === other && !seen.has(s.id)).length,
    drawings: (() => {
      const last = parseInt(lsGet('seenDrawingAt') || '0', 10);
      return state.drawings.filter(d => d.author === other && d.created > last).length;
    })(),
  };
}

function anythingPending() {
  const p = pendingCounts();
  return p.questions + p.stories + p.drawings > 0;
}

function renderHome() {
  const p = state.profile[state.user];
  document.getElementById('homeName').textContent = p?.name || '';

  // Avatar on home
  const avEl = document.getElementById('homeAvatar');
  if (p?.avatar) avEl.innerHTML = `<img src="${p.avatar}">`;
  else avEl.textContent = state.user === 'ivo' ? 'I' : 'N';
  avEl.onclick = () => showScreen('settings');

  document.getElementById('coinsCount').textContent = state.coins[state.user].toLocaleString();
  updateCheckinButton();
  renderStoryRow();

  const pending = pendingCounts();
  const bell = document.getElementById('heroBell');
  if (bell) {
    bell.querySelector('.card-dot')?.remove();
    if (anythingPending()) {
      const d = document.createElement('span');
      d.className = 'card-dot';
      bell.appendChild(d);
    }
    bell.onclick = () => {
      if (pending.questions) showScreen('questions');
      else if (pending.stories) {
        const other = state.user === 'ivo' ? 'nikolina' : 'ivo';
        openStoryViewer(other);
      } else if (pending.drawings) showScreen('drawing');
      else toast('all caught up');
    };
  }

  const grid = document.getElementById('featureGrid');
  const elapsed = elapsedFromStart();
  const previews = pickQuestionPreviews();
  const previewsHtml = previews.map(q => `<div class="questions-preview-item">${escapeHtml(q)}</div>`).join('');
  const latestDrawing = state.drawings.length ? [...state.drawings].sort((a, b) => b.created - a.created)[0] : null;

  let drawingCardHtml;
  if (latestDrawing) {
    const date = new Date(latestDrawing.created);
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const authorName = state.profile[latestDrawing.author]?.name || latestDrawing.author;
    drawingCardHtml = `
      <div class="feature-card drawing-preview" data-goto="drawing">
        ${pending.drawings ? '<span class="card-dot"></span>' : ''}
        <div class="drawing-preview-img"><img src="${latestDrawing.dataurl}" alt=""></div>
        <div class="drawing-preview-info">
          <div style="min-width: 0;">
            <div class="feature-title">latest drawing</div>
            <div class="drawing-preview-meta">by ${escapeHtml(authorName)} · ${dateStr} · ${time}</div>
          </div>
          <div class="drawing-preview-cta">open gallery ›</div>
        </div>
      </div>
    `;
  } else {
    drawingCardHtml = `
      <div class="feature-card" data-goto="drawing">
        <div class="feature-icon">✎</div>
        <div>
          <div class="feature-title">drawing</div>
          <div class="feature-sub">leave something behind</div>
        </div>
      </div>
    `;
  }

  const unanswered = state.questions.filter(q => !q.answers[state.user]).length;
  grid.innerHTML = `
    <div class="feature-card full" data-goto="memories">
      <div class="feature-icon">⏳</div>
      <div>
        <div class="feature-title">our timeline</div>
        <div class="feature-sub">${elapsed.days} days · ${elapsed.hours}h together</div>
      </div>
    </div>
    <div class="feature-card questions-preview" data-goto="questions">
      ${pending.questions ? '<span class="card-dot"></span>' : ''}
      <div class="questions-preview-header">
        <div>
          <div class="feature-title">questions</div>
          <div class="feature-sub">${unanswered || 'ask each other'}${unanswered ? ' to answer' : ''}</div>
        </div>
        <div class="feature-icon">✦</div>
      </div>
      <div class="questions-preview-list">${previewsHtml}</div>
    </div>
    ${drawingCardHtml}
    <div class="feature-card" data-goto="settings">
      <div class="feature-icon">✿</div>
      <div>
        <div class="feature-title">settings</div>
        <div class="feature-sub">your profile</div>
      </div>
    </div>
    <div class="feature-card" id="moreCard">
      <div class="feature-icon">+</div>
      <div>
        <div class="feature-title">more soon</div>
        <div class="feature-sub">coming features</div>
      </div>
    </div>
  `;
  grid.querySelectorAll('[data-goto]').forEach(el => {
    el.onclick = () => morphCardToScreen(el, el.dataset.goto);
  });
  document.getElementById('moreCard').onclick = showAboutMore;
}

function showAboutMore() {
  showModal(`
    <div class="modal-handle"></div>
    <h2>still to come</h2>
    <p style="text-align: left; line-height: 1.6;">
      Ideas we haven't built yet: hugging mode, where you both touch the screen
      and feel each other's fingers; a globe with a thread between Wittenbach and
      Posušje; a translator for Croatian, German and English; and comments under
      each other's stories.
      <br><br>
      Tell Ivo which one you'd want first.
    </p>
    <button class="btn btn-primary" id="aboutOk">got it</button>
  `);
  const ok = document.getElementById('aboutOk');
  ok.onclick = closeModal;

  // Three quick taps on the heading opens the vault.
  const heading = document.querySelector('#modalBackdrop h2');
  if (heading) {
    heading.style.cursor = 'default';
    heading.onclick = () => { if (registerVaultTap()) openVault(); };
  }
}

async function dailyCheckin() {
  const today = new Date().toISOString().split('T')[0];
  const last = lsGet(`checkin:${state.user}`);
  if (last === today) { toast('already checked in today'); return; }
  lsSet(`checkin:${state.user}`, today);
  await addCoins(300);
  toast('+300 coins · see you tomorrow');
  updateCheckinButton();
}

function updateCheckinButton() {
  const today = new Date().toISOString().split('T')[0];
  const last = lsGet(`checkin:${state.user}`);
  const btn = document.getElementById('checkinBtn');
  if (!btn) return;
  if (last === today) { btn.disabled = true; btn.textContent = '✓ today'; }
  else { btn.disabled = false; btn.textContent = '+300 daily'; }
}

async function addCoins(amount) {
  state.coins[state.user] += amount;
  await dbSet(`coins:${state.user}`, String(state.coins[state.user]));
  const el = document.getElementById('coinsCount');
  if (el) {
    el.textContent = state.coins[state.user].toLocaleString();
    el.style.animation = 'pulse 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
}

function resetCoins() {
  showConfirm('reset your coins?', 'this only resets yours.', async () => {
    state.coins[state.user] = 0;
    await dbSet(`coins:${state.user}`, '0');
    renderHome();
    toast('coins reset');
  });
}

// ----- COUNTERS -----
function elapsedFromStart() {
  const now = new Date();
  const diff = now - RELATIONSHIP_START;
  let y = now.getFullYear() - RELATIONSHIP_START.getFullYear();
  let m = now.getMonth() - RELATIONSHIP_START.getMonth();
  let d = now.getDate() - RELATIONSHIP_START.getDate();
  if (d < 0) { m -= 1; const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); }
  if (m < 0) { y -= 1; m += 12; }
  return {
    years: y, months: m, monthDays: d,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

function startCounters() {
  setInterval(() => {
    const screen = document.querySelector('.screen.active');
    if (!screen || screen.id !== 'screen-memories') return;
    updateCounters();
  }, 1000);
}

function daysSince(date) {
  return Math.floor((Date.now() - date.getTime()) / 86400000);
}


// The old number leaves upwards while the new one arrives from below,
// so a ticking second reads as movement rather than a flicker.
function rollNumber(el, value) {
  if (!el) return;
  const next = String(value);
  if (el.dataset.value === next) return;

  const first = el.dataset.value === undefined;
  el.dataset.value = next;

  if (first || prefersLessMotion()) {
    el.textContent = next;
    return;
  }

  const previous = el.textContent;
  el.textContent = '';
  el.classList.add('roll');

  const incoming = document.createElement('span');
  incoming.className = 'roll-in';
  incoming.textContent = next;

  const outgoing = document.createElement('span');
  outgoing.className = 'roll-out';
  outgoing.textContent = previous;

  el.appendChild(outgoing);
  el.appendChild(incoming);

  setTimeout(() => {
    // Only tidy up if nothing newer has arrived in the meantime.
    if (el.dataset.value === next) el.textContent = next;
  }, 340);
}

function updateCounters() {
  const e = elapsedFromStart();

  const fcEl = document.getElementById('firstContactCount');
  if (fcEl) {
    const d = daysSince(FIRST_CONTACT);
    fcEl.textContent = `${d} days`;
    const sub = document.getElementById('firstContactSub');
    if (sub) {
      const beforeTogether = Math.max(0, Math.floor((RELATIONSHIP_START - FIRST_CONTACT) / 86400000));
      sub.textContent = `${beforeTogether} days before we were us`;
    }
  }

  const set = (id, v) => rollNumber(document.getElementById(id), v);
  if (RELATIONSHIP_START > new Date()) {
    set('cYears', 0); set('cMonths', 0); set('cDays', 0); set('cHours', 0); set('cMins', 0); set('cSecs', 0);
  } else {
    set('cYears', e.years); set('cMonths', e.months); set('cDays', e.monthDays);
    set('cHours', e.hours); set('cMins', e.mins); set('cSecs', e.secs);
  }
  const anniv = ANNIVERSARY;
  const diff = anniv - new Date();
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    set('anniversaryCountdown', `${days} days · ${hours}h`);
  } else {
    set('anniversaryCountdown', '🌸 today!');
  }
}

// ----- MEMORIES -----
function renderMemories() {
  updateCounters();
  const list = document.getElementById('eventsList');
  const now = new Date();
  const sorted = [...state.events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.filter(e => new Date(e.date) >= now);
  const past = sorted.filter(e => new Date(e.date) < now);
  const ordered = [...upcoming, ...past];
  if (ordered.length === 0) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">✿</div><div class="empty-text">no moments yet · add your first</div></div>`;
    return;
  }
  list.innerHTML = ordered.map(ev => {
    const d = new Date(ev.date);
    const diffMs = d - now;
    const days = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    const countdown = diffMs > 0
      ? (days === 0 ? 'today' : `in ${days} day${days === 1 ? '' : 's'}`)
      : (days === 0 ? 'today' : `${days} day${days === 1 ? '' : 's'} ago`);
    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `
      <div class="event-card">
        <div class="event-emoji">${ev.emoji || '✿'}</div>
        <div class="event-info">
          <div class="event-title">${escapeHtml(ev.title)}</div>
          <div class="event-countdown">${countdown}</div>
          <div class="event-date">${dateStr}</div>
        </div>
        ${ev._system ? '' : `<button class="event-delete" data-del="${ev.id}">×</button>`}
      </div>
    `;
  }).join('');
  list.querySelectorAll('[data-del]').forEach(b => {
    b.onclick = () => deleteEvent(b.dataset.del);
  });
}

function openAddEvent() {
  showModal(`
    <div class="modal-handle"></div>
    <h2>add a moment</h2>
    <p>upcoming or past — both work</p>
    <input type="text" id="evEmoji" class="input" placeholder="emoji (optional)" maxlength="2" value="✿">
    <input type="text" id="evTitle" class="input" placeholder="what's the moment?">
    <input type="date" id="evDate" class="input">
    <button class="btn btn-primary" id="evSave">save</button>
    <button class="btn btn-ghost" id="evCancel">cancel</button>
  `);
  document.getElementById('evSave').onclick = saveEvent;
  document.getElementById('evCancel').onclick = closeModal;
}

async function saveEvent() {
  const emoji = document.getElementById('evEmoji').value.trim() || '✿';
  const title = document.getElementById('evTitle').value.trim();
  const date = document.getElementById('evDate').value;
  if (!title || !date) { toast('title and date please'); return; }
  state.events.push({ id: 'evt_' + Date.now(), emoji, title, date });
  await dbSet('events:list', JSON.stringify(state.events));
  await addCoins(100);
  closeModal();
  renderMemories();
  toast('+100 coins · moment saved');
}

function deleteEvent(id) {
  showConfirm('delete this moment?', '', async () => {
    state.events = state.events.filter(e => e.id !== id);
    await dbSet('events:list', JSON.stringify(state.events));
    renderMemories();
  });
}

// ----- QUESTIONS LIST -----
function renderQuestions() {
  const list = document.getElementById('questionsList');
  const me = state.user;
  const other = me === 'ivo' ? 'nikolina' : 'ivo';
  const openedIds = openedQuestionIds();
  let filtered = [...state.questions];
  if (state.filter === 'unanswered') filtered = filtered.filter(q => !q.answers[me]);
  else if (state.filter === 'theirs') filtered = filtered.filter(q => q.answers[me] && !q.answers[other]);
  else if (state.filter === 'done') filtered = filtered.filter(q => q.answers.ivo && q.answers.nikolina);
  filtered.sort((a, b) => b.created - a.created);
  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">✦</div><div class="empty-text">${state.questions.length === 0 ? 'no questions yet · ask the first' : 'nothing here'}</div></div>`;
    return;
  }
  list.innerHTML = filtered.map(q => {
    const askerName = state.profile[q.asker]?.name || (q.asker === 'ivo' ? 'Ivo' : 'Nikolina');
    const meAnswered = !!q.answers[me];
    const otherAnswered = !!q.answers[other];
    const dateStr = new Date(q.created).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const settled = meAnswered && otherAnswered;
    // A dot means: you haven't looked at this yet.
    const needsYou = !meAnswered && !openedIds.has(q.id);
    return `
      <div class="question-card by-${q.asker === 'ivo' ? 'ivo' : 'niki'} ${settled ? 'settled' : ''}" data-q="${q.id}">
        <div class="question-meta">
          ${avatarHtml(q.asker, 'tiny')}
          <span class="asker-label">${q.asker === state.user ? 'you' : escapeHtml(askerName)}</span>
          <span>· ${dateStr}</span>
          ${needsYou ? '<span class="new-dot"></span>' : ''}
        </div>
        <div class="question-text">${escapeHtml(q.text)}</div>
        <div class="question-status">
          <span class="status-pill ${meAnswered ? 'answered' : 'waiting'}">${meAnswered ? '✓ you answered' : 'you to answer'}</span>
          <span class="status-pill ${otherAnswered ? 'answered' : 'waiting'}">${otherAnswered ? '✓ they answered' : 'waiting on them'}</span>
        </div>
      </div>
    `;
  }).join('');
  list.querySelectorAll('[data-q]').forEach(c => {
    c.onclick = () => openQuestion(c.dataset.q, c);
  });
}

function filterQuestions(f) {
  state.filter = f;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === f));
  renderQuestions();
}

function openAskQuestion() {
  showModal(`
    <div class="modal-handle"></div>
    <h2>ask a question</h2>
    <p>choose a prompt or write your own</p>
    <textarea id="askInput" class="input" placeholder="write your question..."></textarea>
    <button class="btn btn-ghost" id="askBrowse">browse 80+ prompts</button>
    <button class="btn btn-primary" id="askSubmit">ask</button>
    <button class="btn btn-ghost" id="askCancel">cancel</button>
  `);
  state.pendingCategory = null;
  document.getElementById('askBrowse').onclick = () => showPresets();
  document.getElementById('askSubmit').onclick = submitQuestion;
  document.getElementById('askCancel').onclick = closeModal;
}

// Normalised set of every question text already asked, so we can grey them out.
function askedTextSet() {
  return new Set(state.questions.map(q => (q.text || '').trim().toLowerCase()));
}

function showPresets(category) {
  const cat = category || state.presetCategory || 'all';
  state.presetCategory = cat;

  const asked = askedTextSet();
  const list = cat === 'all' ? PRESET_QUESTIONS : (PRESET_BY_CATEGORY[cat] || []);

  const chips = QUESTION_CATEGORIES.map(c =>
    `<button class="cat-chip ${c.id === cat ? 'active' : ''}" data-cat="${c.id}">${c.emoji} ${escapeHtml(c.label)}</button>`
  ).join('');

  const askedCount = list.filter(q => asked.has(q.trim().toLowerCase())).length;

  const items = list.map(q => {
    const isAsked = asked.has(q.trim().toLowerCase());
    // Index into the FLAT list, so picking works the same for every category.
    const flatIndex = PRESET_QUESTIONS.indexOf(q);
    return `<div class="preset-item ${isAsked ? 'asked' : ''}" data-pre="${flatIndex}">
      <span class="preset-text">${escapeHtml(q)}</span>
      ${isAsked ? '<span class="preset-badge">✓ asked</span>' : ''}
    </div>`;
  }).join('');

  showModal(`
    <div class="modal-handle"></div>
    <h2>choose a prompt</h2>
    <div class="cat-chips">${chips}</div>
    <div class="preset-count">${list.length} questions · ${askedCount} already asked</div>
    <div class="preset-list">${items}</div>
    <button class="btn btn-ghost" id="presetBack">back</button>
  `);

  document.getElementById('presetBack').onclick = openAskQuestion;

  // The chip row is rebuilt on every category switch, so it would snap back
  // to the far left. Put it back where it was, then keep tracking it.
  const chipRow = document.querySelector('.cat-chips');
  if (chipRow) {
    const restored = state.catChipsScroll || 0;
    chipRow.scrollLeft = restored;
    chipRow.addEventListener('scroll', () => {
      state.catChipsScroll = chipRow.scrollLeft;
    }, { passive: true });

    // Only on a first open (nothing remembered yet) do we nudge the active
    // chip into view. Once there's a remembered position, that wins —
    // otherwise this would undo the restore on every category switch.
    if (restored === 0) {
      const activeChip = chipRow.querySelector('.cat-chip.active');
      if (activeChip && activeChip.offsetWidth > 0) {
        const left = activeChip.offsetLeft;
        const right = left + activeChip.offsetWidth;
        if (left < chipRow.scrollLeft || right > chipRow.scrollLeft + chipRow.clientWidth) {
          chipRow.scrollLeft = Math.max(0, left - 16);
          state.catChipsScroll = chipRow.scrollLeft;
        }
      }
    }
  }

  document.querySelectorAll('[data-cat]').forEach(c => {
    c.onclick = () => {
      const row = document.querySelector('.cat-chips');
      if (row) state.catChipsScroll = row.scrollLeft;
      showPresets(c.dataset.cat);
    };
  });
  document.querySelectorAll('[data-pre]').forEach(e => {
    e.onclick = () => pickPreset(parseInt(e.dataset.pre));
  });
}

function pickPreset(i) {
  const q = PRESET_QUESTIONS[i];
  const alreadyAsked = askedTextSet().has(q.trim().toLowerCase());
  showModal(`
    <div class="modal-handle"></div>
    <h2>ask a question</h2>
    <p>${alreadyAsked ? 'asked before — still fine to ask again' : 'edit it if you like'}</p>
    <textarea id="askInput" class="input">${escapeHtml(q)}</textarea>
    <button class="btn btn-primary" id="askSubmit">ask</button>
    <button class="btn btn-ghost" id="askBack">back to prompts</button>
  `);
  // Remember which category this came from, so it gets stored with the question.
  state.pendingCategory = categoryOf(q);
  document.getElementById('askSubmit').onclick = submitQuestion;
  document.getElementById('askBack').onclick = () => showPresets();
}

async function submitQuestion() {
  const text = document.getElementById('askInput').value.trim();
  if (!text) { toast('write a question first'); return; }
  if (!supabase) return;

  const id = 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const { data, error } = await supabase
    .from('questions')
    .insert({ id, text, asker: state.user, category: state.pendingCategory || null })
    .select()
    .single();

  if (error) {
    console.error('submitQuestion', error);
    toast('could not send the question');
    return;
  }

  // Add locally so it shows instantly; realtime will confirm it.
  if (!state.questions.some(q => q.id === data.id)) {
    state.questions.push({
      id: data.id,
      text: data.text,
      asker: data.asker,
      category: data.category || null,
      created: new Date(data.created_at).getTime(),
      answers: {},
    });
  }

  state.pendingCategory = null;
  notifyPartner(
    `${myName()} asked you something`,
    text.length > 70 ? text.slice(0, 70) + '…' : text,
    { tag: 'question' }
  );
  await addCoins(500);
  closeModal();
  renderQuestions();
  toast('+500 coins · question sent');
}

// ----- QUESTION DETAIL with CHAT -----
async function openQuestion(id, fromCard) {
  state.currentQuestionId = id;
  const q = state.questions.find(x => x.id === id);
  if (!q) return;
  markQuestionOpened(id);
  if (fromCard) {
    morphCardToScreen(fromCard, 'questionDetail');
    state.scrollPositions['screen-questionDetail'] = 0;
  } else {
    showScreen('questionDetail', { resetScroll: true });
  }
  renderQuestionDetail();
  // Load chat if both answered
  const me = state.user;
  const other = me === 'ivo' ? 'nikolina' : 'ivo';
  if (q.answers[me] && q.answers[other]) {
    await loadMessages(id);
    renderQuestionDetail();
    startChatSubscription(id);
    scrollChatToBottom();
  }
}

function renderQuestionDetail() {
  const id = state.currentQuestionId;
  const q = state.questions.find(x => x.id === id);
  if (!q) return;
  const me = state.user;
  const other = me === 'ivo' ? 'nikolina' : 'ivo';
  const meAnswered = !!q.answers[me];
  const otherAnswered = !!q.answers[other];
  const meName = state.profile[me]?.name || me;
  const otherName = state.profile[other]?.name || other;

  let content = `
    <div class="question-card by-${q.asker === 'ivo' ? 'ivo' : 'niki'}" style="margin-bottom: 24px;">
      <div class="question-meta">
        ${avatarHtml(q.asker, 'tiny')}
        <span class="asker-label">${q.asker === state.user ? 'you' : escapeHtml(state.profile[q.asker]?.name || q.asker)}</span>
        <span>· asked</span>
      </div>
      <div class="question-text">${escapeHtml(q.text)}</div>
    </div>
  `;

  if (meAnswered) {
    content += `<div class="answer-block">
      <div class="answer-author">${avatarHtml(me, 'tiny')}<span>${escapeHtml(meName)} · you</span></div>
      <div class="answer-text">${escapeHtml(q.answers[me])}</div>
    </div>`;
    if (otherAnswered) {
      content += `<div class="answer-block">
        <div class="answer-author">${avatarHtml(other, 'tiny')}<span>${escapeHtml(otherName)}</span></div>
        <div class="answer-text">${escapeHtml(q.answers[other])}</div>
      </div>`;
      // Chat section
      content += renderChatSection(id);
    } else {
      content += `<div class="locked-block">waiting for ${escapeHtml(otherName)} to answer...</div>`;
    }
  } else {
    if (otherAnswered) content += `<div class="locked-block">${escapeHtml(otherName)} has answered · answer first to reveal</div>`;
    content += `<textarea id="answerInput" class="input" placeholder="your answer..." style="min-height: 140px;"></textarea>
      <button class="btn btn-primary" id="answerSubmit">send answer</button>`;
  }

  // Remember anything half-typed before we rebuild the screen, so an
  // incoming message from the other phone can't erase your draft.
  const oldChat = document.getElementById('chatInput');
  const draftChat = oldChat ? oldChat.value : '';
  const chatHadFocus = document.activeElement === oldChat;
  const oldAnswer = document.getElementById('answerInput');
  const draftAnswer = oldAnswer ? oldAnswer.value : '';
  const answerHadFocus = document.activeElement === oldAnswer;

  document.getElementById('questionDetailContent').innerHTML = content;
  const submit = document.getElementById('answerSubmit');
  if (submit) submit.onclick = () => submitAnswer(q.id);

  wireChatHandlers(id);

  const detail = document.getElementById('screen-questionDetail');
  if (detail) detail.classList.toggle('has-chat', !!document.querySelector('.chat-composer'));
  startKeyboardTracking();
  updateComposerForKeyboard();

  // Put the drafts back.
  const newChat = document.getElementById('chatInput');
  if (newChat && draftChat) {
    newChat.value = draftChat;
    const sendBtn = document.getElementById('chatSendBtn');
    if (sendBtn) sendBtn.disabled = draftChat.trim().length === 0;
    newChat.style.height = 'auto';
    newChat.style.height = Math.min(newChat.scrollHeight, 120) + 'px';
    if (chatHadFocus) newChat.focus();
  }
  const newAnswer = document.getElementById('answerInput');
  if (newAnswer && draftAnswer) {
    newAnswer.value = draftAnswer;
    if (answerHadFocus) newAnswer.focus();
  }
}

function renderChatSection(qid) {
  const msgs = state.messagesByQuestion[qid] || [];
  const me = state.user;
  const msgsHtml = msgs.map(m => renderMessage(m, me === m.author)).join('') ||
    `<div class="empty" style="padding: 20px;"><div class="empty-text">say something to each other 💌</div></div>`;
  return `
    <div class="chat-divider">our conversation</div>
    <div class="chat-list" id="chatList">${msgsHtml}</div>
    <div class="chat-composer">
      <input type="file" id="chatFile" accept="image/*" style="display:none;">
      <input type="file" id="chatCamera" accept="image/*" capture="environment" style="display:none;">
      <button class="chat-attach-btn" id="chatGalleryBtn" title="photo">🖼</button>
      <button class="chat-attach-btn" id="chatCameraBtn" title="camera">📷</button>
      <textarea class="chat-input" id="chatInput" placeholder="message..." rows="1"></textarea>
      <button class="chat-send-btn" id="chatSendBtn" disabled>↑</button>
    </div>
  `;
}

function renderMessage(m, isMine) {
  const author = m.author;
  const authorName = state.profile[author]?.name || (author === 'ivo' ? 'Ivo' : 'Nikolina');
  const time = new Date(m.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const heart = m.liked_by_other ? `<span class="heart-mark">❤</span>` : '';
  const body = m.kind === 'image'
    ? `<div class="chat-bubble image-bubble" data-msg="${m.id}"><img src="${m.body}" alt="">${heart}</div>`
    : `<div class="chat-bubble" data-msg="${m.id}">${escapeHtml(m.body)}${heart}</div>`;
  return `
    <div class="chat-msg ${isMine ? 'mine' : ''}">
      ${avatarHtml(author, 'tiny')}
      <div class="chat-msg-col">
        ${body}
        <div class="chat-msg-meta">
          <span>${escapeHtml(authorName)}</span><span>·</span><span>${time} · ${dateStr}</span>
        </div>
      </div>
    </div>
  `;
}

function wireChatHandlers(qid) {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  if (!input) return;

  input.addEventListener('focus', () => {
    // Give iOS a moment to put the keyboard up, then re-anchor.
    setTimeout(() => { updateComposerForKeyboard(); scrollChatToBottom(); }, 250);
  });
  input.addEventListener('blur', () => {
    setTimeout(updateComposerForKeyboard, 100);
  });
  input.addEventListener('input', () => {
    sendBtn.disabled = input.value.trim().length === 0;
    // auto-grow
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
  sendBtn.onclick = () => sendTextMessage(qid);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTouchDevice()) {
      e.preventDefault();
      sendTextMessage(qid);
    }
  });

  const gallery = document.getElementById('chatGalleryBtn');
  const camera = document.getElementById('chatCameraBtn');
  const fileInp = document.getElementById('chatFile');
  const camInp = document.getElementById('chatCamera');
  gallery.onclick = () => fileInp.click();
  camera.onclick = () => camInp.click();
  fileInp.onchange = (e) => handleChatImage(e, qid);
  camInp.onchange = (e) => handleChatImage(e, qid);

  // Double-tap on bubbles -> like
  document.querySelectorAll('#chatList [data-msg]').forEach(el => {
    attachDoubleTap(el, () => toggleLike(el.dataset.msg));
  });
}

function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

function attachDoubleTap(el, handler) {
  let last = 0;
  const fire = (e) => {
    const now = Date.now();
    if (now - last < 350) {
      e.preventDefault();
      handler();
      last = 0;
    } else {
      last = now;
    }
  };
  el.addEventListener('click', fire);
  el.addEventListener('dblclick', (e) => { e.preventDefault(); handler(); });
}

async function sendTextMessage(qid) {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';
  document.getElementById('chatSendBtn').disabled = true;
  await insertMessage(qid, { kind: 'text', body: text });
}

async function handleChatImage(e, qid) {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  const list = document.getElementById('chatList');
  const tmpId = 'tmp_' + Date.now();
  if (list) {
    list.insertAdjacentHTML('beforeend', `<div class="chat-uploading" id="${tmpId}">uploading photo…</div>`);
    scrollChatToBottom();
  }
  try {
    const dataUrl = await resizeImageToDataUrl(f, 1600, 0.8);
    const url = await uploadImage(dataUrl, 'chat');
    if (!url) throw new Error('upload failed');
    await insertMessage(qid, { kind: 'image', body: url });
  } catch (err) {
    console.error(err);
    toast('could not send photo');
  } finally {
    const tmp = document.getElementById(tmpId);
    if (tmp) tmp.remove();
  }
}

async function insertMessage(qid, { kind, body }) {
  if (!supabase) return;
  const { data, error } = await supabase.from('messages').insert({
    question_id: qid,
    author: state.user,
    kind,
    body,
  }).select().single();
  if (error) {
    console.error(error);
    toast('could not send message');
    return;
  }
  notifyPartner(
    `${myName()} sent you a message`,
    kind === 'image' ? 'a photo 📷' : (body.length > 60 ? body.slice(0, 60) + '…' : body),
    { tag: 'chat-' + qid }
  );

  // Optimistic: also append locally (realtime will reconcile)
  if (!state.messagesByQuestion[qid]) state.messagesByQuestion[qid] = [];
  if (!state.messagesByQuestion[qid].some(m => m.id === data.id)) {
    state.messagesByQuestion[qid].push(data);
    renderQuestionDetail();
    scrollChatToBottom();
  }
}

async function toggleLike(msgId) {
  if (!supabase) return;
  const qid = state.currentQuestionId;
  const msg = (state.messagesByQuestion[qid] || []).find(m => String(m.id) === String(msgId));
  if (!msg) return;
  // Only the OTHER person can like a message
  if (msg.author === state.user) {
    toast('you can like their messages 💕');
    return;
  }
  const newVal = !msg.liked_by_other;
  msg.liked_by_other = newVal;
  renderQuestionDetail();
  const { error } = await supabase.from('messages').update({ liked_by_other: newVal }).eq('id', msg.id);
  if (error) {
    console.error(error);
    msg.liked_by_other = !newVal; // revert
    renderQuestionDetail();
  }
}

async function loadMessages(qid) {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('question_id', qid)
    .order('created_at', { ascending: true });
  if (error) {
    console.error(error);
    return;
  }
  state.messagesByQuestion[qid] = data || [];
}

let chatChannel = null;
function startChatSubscription(qid) {
  stopChatSubscription();
  if (!supabase) return;
  chatChannel = supabase.channel(`chat-${qid}`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'messages', filter: `question_id=eq.${qid}` },
      (payload) => {
        const arr = state.messagesByQuestion[qid] = state.messagesByQuestion[qid] || [];
        if (payload.eventType === 'INSERT') {
          if (!arr.some(m => m.id === payload.new.id)) {
            arr.push(payload.new);
            renderQuestionDetail();
            scrollChatToBottom();
          }
        } else if (payload.eventType === 'UPDATE') {
          const i = arr.findIndex(m => m.id === payload.new.id);
          if (i !== -1) { arr[i] = payload.new; renderQuestionDetail(); }
        } else if (payload.eventType === 'DELETE') {
          state.messagesByQuestion[qid] = arr.filter(m => m.id !== payload.old.id);
          renderQuestionDetail();
        }
      })
    .subscribe();
}

function stopChatSubscription() {
  if (chatChannel && supabase) {
    supabase.removeChannel(chatChannel);
    chatChannel = null;
  }
}

function scrollChatToBottom() {
  setTimeout(() => {
    const list = document.getElementById('chatList');
    if (list) list.scrollTop = list.scrollHeight;
    // Also scroll the page so composer is in view
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 50);
}

async function submitAnswer(id) {
  const text = document.getElementById('answerInput').value.trim();
  if (!text) { toast('write your answer first'); return; }
  const q = state.questions.find(x => x.id === id);
  if (!q || !supabase) return;

  // Each person writes ONLY their own row. The unique(question_id, author)
  // constraint means you two can no longer overwrite each other, even when
  // answering at the exact same second.
  const { error } = await supabase
    .from('answers')
    .upsert(
      { question_id: id, author: state.user, body: text },
      { onConflict: 'question_id,author' }
    );

  if (error) {
    console.error('submitAnswer', error);
    toast('could not send your answer');
    return;
  }

  q.answers[state.user] = text;

  const other = state.user === 'ivo' ? 'nikolina' : 'ivo';
  if (q.answers[other]) {
    notifyPartner(
      `${myName()} answered`,
      'You can both see the answers now 💌',
      { tag: 'answer-' + id }
    );
  } else {
    notifyPartner(
      `${myName()} answered a question`,
      'Answer it yourself to see what they wrote',
      { tag: 'answer-' + id }
    );
  }

  await addCoins(500);
  toast('+500 coins · answer sent');
  openQuestion(id);
}


// The composer is pinned to the bottom of the window. When the keyboard
// opens, iOS shrinks the "visual viewport" but leaves the window alone,
// so we lift the bar by exactly the height the keyboard is covering.
let keyboardTracking = false;

function updateComposerForKeyboard() {
  const composer = document.querySelector('.chat-composer');
  if (!composer) return;
  const vv = window.visualViewport;
  if (!vv) return;
  const covered = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
  composer.style.transform = covered > 0 ? `translateY(-${covered}px)` : '';
}

function startKeyboardTracking() {
  if (keyboardTracking) return;
  const vv = window.visualViewport;
  if (!vv) return;
  keyboardTracking = true;
  vv.addEventListener('resize', updateComposerForKeyboard);
  vv.addEventListener('scroll', updateComposerForKeyboard);
}


// ---------------------------------------------------------------
// Swipe from the left edge to go back, the way iOS does it.
// The screen follows your thumb; let go past a third and it commits.
// ---------------------------------------------------------------
const BACK_TARGETS = {
  'screen-memories': 'home',
  'screen-questions': 'home',
  'screen-questionDetail': 'questions',
  'screen-drawing': 'home',
  'screen-settings': 'home',
};

function startEdgeSwipe() {
  let tracking = false;      // finger is down at the edge
  let engaged = false;       // we've decided this really is a back-swipe
  let startX = 0, startY = 0, dx = 0;
  let screen = null;
  let beneath = null;

  const cleanUp = () => {
    if (screen) {
      screen.classList.remove('dragging');
      screen.style.transition = '';
      screen.style.transform = '';
      screen.style.boxShadow = '';
    }
    if (beneath) {
      beneath.classList.remove('peeking');
      beneath.style.transition = '';
      beneath.style.transform = '';
      beneath.style.opacity = '';
    }
    screen = null; beneath = null;
    tracking = false; engaged = false; dx = 0;
  };

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    if (e.touches[0].clientX > 30) return;
    if (document.getElementById('storyViewer')?.classList.contains('active')) return;
    if (document.getElementById('editorOverlay')?.classList.contains('active')) return;
    if (document.getElementById('lockScreen')?.classList.contains('active')) return;
    if (document.getElementById('modalBackdrop')?.classList.contains('active')) return;
    if (morphing) return;

    const current = document.querySelector('.screen.active');
    if (!current || !BACK_TARGETS[current.id]) return;

    screen = current;
    tracking = true;
    engaged = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dx = 0;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!tracking || !screen) return;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    dx = x - startX;
    const dy = y - startY;

    if (!engaged) {
      // Wait until the direction is clear. Mostly-vertical means they
      // are scrolling, so let go and never fight the page.
      if (Math.abs(dy) > Math.abs(dx)) { tracking = false; return; }
      if (dx < 12) return;
      engaged = true;

      // Bring the screen we're going back to up behind this one, so
      // there is something to reveal rather than bare background.
      const targetName = BACK_TARGETS[screen.id];
      beneath = document.getElementById('screen-' + targetName);
      if (beneath) {
        beneath.classList.add('peeking');
        beneath.style.transform = 'translateX(-22%)';
        beneath.style.opacity = '0.55';
      }
      screen.classList.add('dragging');
      screen.style.boxShadow = '-14px 0 40px rgba(0,0,0,0.4)';
    }

    if (dx < 0) dx = 0;
    e.preventDefault();

    const progress = Math.min(1, dx / window.innerWidth);
    screen.style.transform = `translateX(${dx}px)`;
    if (beneath) {
      beneath.style.transform = `translateX(${-22 + 22 * progress}%)`;
      beneath.style.opacity = String(0.55 + 0.45 * progress);
    }
  }, { passive: false });

  const finish = () => {
    if (!tracking && !engaged) { cleanUp(); return; }
    if (!screen) { cleanUp(); return; }
    if (!engaged) { cleanUp(); return; }

    const target = BACK_TARGETS[screen.id];
    const committed = dx > window.innerWidth / 3;
    const ease = 'transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.28s';

    screen.style.transition = ease;
    screen.style.transform = committed ? `translateX(${window.innerWidth}px)` : 'translateX(0px)';
    if (beneath) {
      beneath.style.transition = ease;
      beneath.style.transform = committed ? 'translateX(0%)' : 'translateX(-22%)';
      beneath.style.opacity = committed ? '1' : '0.55';
    }

    const leaving = screen;
    const arriving = beneath;
    const goBack = committed;
    screen = null; beneath = null;
    tracking = false; engaged = false;

    setTimeout(() => {
      leaving.classList.remove('dragging');
      leaving.style.transition = '';
      leaving.style.transform = '';
      leaving.style.boxShadow = '';
      if (arriving) {
        arriving.classList.remove('peeking');
        arriving.style.transition = '';
        arriving.style.transform = '';
        arriving.style.opacity = '';
      }
      if (goBack && target) showScreen(target, { back: true, silent: true });
    }, 290);
  };

  document.addEventListener('touchend', finish, { passive: true });
  document.addEventListener('touchcancel', () => cleanUp(), { passive: true });
}

// ----- DRAWING -----
function initDrawing() {
  renderGallery();
  // Seeing the gallery counts as seeing the drawings in it.
  const newest = state.drawings.reduce((m, d) => Math.max(m, d.created || 0), 0);
  if (newest) lsSet('seenDrawingAt', String(newest));
}





async function saveDrawing(dataUrl) {
  const url = await uploadImage(dataUrl, 'drawings');
  const stored = url || dataUrl;
  const id = 'd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

  if (supabase) {
    const { error } = await supabase
      .from('drawings')
      .insert({ id, author: state.user, url: stored });
    if (error) {
      console.error('saveDrawing', error);
      toast('could not save the drawing');
      return;
    }
  }

  if (!state.drawings.some(d => d.id === id)) {
    state.drawings.push({ id, author: state.user, dataurl: stored, created: Date.now() });
  }
  notifyPartner(`${myName()} drew something`, 'take a look \u270e', { tag: 'drawing' });
  await addCoins(150);
  toast('+150 coins \u00b7 saved');
  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const sorted = [...state.drawings].sort((a, b) => b.created - a.created);
  if (sorted.length === 0) {
    grid.innerHTML = `<div class="empty" style="grid-column: 1/-1;"><div class="empty-icon">✎</div><div class="empty-text">no drawings yet</div></div>`;
    return;
  }
  grid.innerHTML = sorted.map(d => {
    const date = new Date(d.created);
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const authorName = state.profile[d.author]?.name || d.author;
    return `<div class="gallery-item">
      <img src="${d.dataurl}" alt="">
      <div class="gallery-item-meta"><span>${escapeHtml(authorName)}</span><span>${dateStr}</span></div>
    </div>`;
  }).join('');
}


// ===============================================================
// STORIES
// ===============================================================

// Ask the database to delete anything older than 24 hours, then load
// whatever is still alive.
// Deletes everything past its 24 hours — the database row AND the media
// file itself. Videos are big, so leaving orphaned files behind isn't an
// option. This runs every time the app loads.
async function purgeExpiredStories() {
  if (!supabase) return;
  try {
    const { data: dead, error } = await supabase
      .from('stories')
      .select('id, storage_path')
      .lt('expires_at', new Date().toISOString());
    if (error) throw error;
    if (!dead || !dead.length) return;

    const paths = dead.map(s => s.storage_path).filter(Boolean);
    if (paths.length) {
      const { error: rmErr } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
      // If file removal fails we still drop the rows — an unreachable file
      // is better than a story that refuses to expire.
      if (rmErr) console.warn('story file cleanup failed', rmErr);
    }
    await supabase.from('stories').delete().in('id', dead.map(s => s.id));
  } catch (e) {
    console.warn('purgeExpiredStories', e);
    // Fall back to the database-side function if it exists.
    try { await supabase.rpc('purge_expired_stories'); } catch {}
  }
}

// Files from before v2.2.3 were left behind when a story expired. Once a day
// we list what's actually in the stories folder and delete anything that no
// longer has a row pointing at it.
async function sweepOrphanStoryFiles() {
  if (!supabase) return;
  const today = new Date().toISOString().slice(0, 10);
  if (lsGet('orphanSweep') === today) return;
  lsSet('orphanSweep', today);
  try {
    const { data: files, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('stories', { limit: 500 });
    if (error || !files || !files.length) return;

    const { data: rows } = await supabase.from('stories').select('storage_path');
    const alive = new Set((rows || []).map(r => r.storage_path).filter(Boolean));

    const orphans = files
      .map(f => `stories/${f.name}`)
      .filter(p => !alive.has(p));

    if (orphans.length) {
      await supabase.storage.from(STORAGE_BUCKET).remove(orphans);
      console.info(`cleaned up ${orphans.length} leftover story files`);
    }
  } catch (e) {
    console.warn('sweepOrphanStoryFiles', e);
  }
}

async function loadStories() {
  if (!supabase) return;
  await purgeExpiredStories();
  sweepOrphanStoryFiles();   // not awaited — never hold up the screen
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: true });
  if (error) { console.error('loadStories', error); return; }
  state.stories = data || [];
}

function seenStoryIds() {
  try {
    return new Set(JSON.parse(lsGet('seenStories') || '[]'));
  } catch { return new Set(); }
}

function markStorySeen(id) {
  const seen = seenStoryIds();
  seen.add(id);
  // Keep the list from growing forever.
  const arr = [...seen].slice(-200);
  lsSet('seenStories', JSON.stringify(arr));
}

function storiesOf(who) {
  return state.stories.filter(s => s.author === who);
}

function hasUnseenStories(who) {
  const seen = seenStoryIds();
  return storiesOf(who).some(s => !seen.has(s.id));
}

function renderStoryRow() {
  const row = document.getElementById('storyRow');
  if (!row) return;
  const me = state.user;
  const other = me === 'ivo' ? 'nikolina' : 'ivo';

  const bubble = (who, isMe) => {
    const profile = state.profile[who];
    const name = isMe ? 'your story' : (profile?.name || (who === 'ivo' ? 'Ivo' : 'Nikolina'));
    const count = storiesOf(who).length;
    const cls = who === 'ivo' ? 'ivo' : 'niki';
    let ringClass = 'none';
    if (count > 0) ringClass = hasUnseenStories(who) ? 'unseen' : 'seen';
    const inner = profile?.avatar
      ? `<img src="${profile.avatar}" alt="">`
      : (who === 'ivo' ? 'I' : 'N');
    return `
      <div class="story-bubble" data-story-user="${who}">
        <div class="story-ring ${ringClass}">
          <div class="story-ring-inner">
            <div class="story-avatar ${cls}">${inner}</div>
          </div>
          ${isMe ? '<div class="story-plus" data-add-story="1">+</div>' : ''}
        </div>
        <div class="story-label">${escapeHtml(name)}</div>
      </div>
    `;
  };

  row.innerHTML = bubble(me, true) + bubble(other, false);

  row.querySelectorAll('[data-story-user]').forEach(el => {
    el.onclick = (e) => {
      if (e.target.closest('[data-add-story]')) {
        openStoryPicker();
        return;
      }
      const who = el.dataset.storyUser;
      if (storiesOf(who).length === 0) {
        if (who === state.user) openStoryPicker();
        else toast('no story right now');
        return;
      }
      openStoryViewer(who);
    };
  });
}

// ----- posting a story -----
function openStoryPicker() {
  const inp = document.getElementById('storyFile');
  const cam = document.getElementById('storyCamera');
  showModal(`
    <div class="modal-handle"></div>
    <h2>add to your story</h2>
    <p>photo or video · disappears after 24 hours</p>
    <button class="btn btn-primary" id="storyFromGallery">choose from gallery</button>
    <button class="btn btn-ghost" id="storyFromCamera">take a photo or video</button>
    <button class="btn btn-ghost" id="storyCancel">cancel</button>
  `);
  document.getElementById('storyFromGallery').onclick = () => inp.click();
  document.getElementById('storyFromCamera').onclick = () => cam.click();
  document.getElementById('storyCancel').onclick = closeModal;
}

async function handleStoryFile(e, source = 'gallery') {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;

  // Stay inside the same modal and swap in a loading state, rather than
  // closing and re-opening (which is fragile and looked broken).
  showModal(`
    <div class="modal-handle"></div>
    <h2>reading photo…</h2>
    <p>one moment</p>
    <div style="text-align:center; padding: 12px 0 24px;"><span class="spinner"></span></div>
  `);

  try {
    if (f.type.startsWith('video/')) {
      if (f.size > MAX_VIDEO_BYTES) {
        showModal(`
          <div class="modal-handle"></div>
          <h2>that video is too big</h2>
          <p>${(f.size / 1048576).toFixed(0)} MB · the limit is ${MAX_VIDEO_BYTES / 1048576} MB.
             Try trimming it shorter in the Photos app first.</p>
          <button class="btn btn-primary" id="storyRetry">choose another</button>
          <button class="btn btn-ghost" id="storyGiveUp">cancel</button>
        `);
        document.getElementById('storyRetry').onclick = openStoryPicker;
        document.getElementById('storyGiveUp').onclick = closeModal;
        return;
      }
      const meta = await videoMetadata(f);
      showStoryConfirm(URL.createObjectURL(f), meta, { file: f, kind: 'video' });
      return;
    }

    if (source === 'camera') {
      // Straight from the camera: frame it 9:16 like a story should be.
      const cropped = await cropToPortrait(f);
      const dims = await imageDimensions(cropped);
      showStoryConfirm(cropped, dims, { kind: 'image', source: 'camera', originalFile: f });
      return;
    }

    // From the gallery: 1440px on the long edge, original shape kept.
    const dataUrl = await resizeImageToDataUrl(f, 1440, 0.85);
    const dims = await imageDimensions(dataUrl);
    showStoryConfirm(dataUrl, dims, { kind: 'image', source: 'gallery' });
  } catch (err) {
    console.error('handleStoryFile', err);
    showModal(`
      <div class="modal-handle"></div>
      <h2>could not read that photo</h2>
      <p>try a different one, or take a new picture</p>
      <button class="btn btn-primary" id="storyRetry">try again</button>
      <button class="btn btn-ghost" id="storyGiveUp">cancel</button>
    `);
    document.getElementById('storyRetry').onclick = openStoryPicker;
    document.getElementById('storyGiveUp').onclick = closeModal;
  }
}

// Videos are uploaded as-is (no re-encoding in the browser), so we cap the
// size. 25 MB is roughly 30–45 seconds of iPhone video.
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

function videoMetadata(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      resolve({
        width: v.videoWidth || null,
        height: v.videoHeight || null,
        duration: isFinite(v.duration) ? v.duration : null,
      });
    };
    v.onerror = () => resolve({ width: null, height: null, duration: null });
    v.src = url;
  });
}

// Crops to 9:16 around the centre — the shape a story actually fills.
// Only used for the camera; gallery photos keep whatever shape they have.
function cropToPortrait(file, ratio = 9 / 16, maxH = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const srcRatio = img.width / img.height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;

        if (srcRatio > ratio) {
          // too wide: trim the sides
          sw = Math.round(img.height * ratio);
          sx = Math.round((img.width - sw) / 2);
        } else if (srcRatio < ratio) {
          // too tall: trim top and bottom
          sh = Math.round(img.width / ratio);
          sy = Math.round((img.height - sh) / 2);
        }

        let outH = Math.min(maxH, sh);
        let outW = Math.round(outH * ratio);

        const c = document.createElement('canvas');
        c.width = outW; c.height = outH;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function imageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = dataUrl;
  });
}

function showStoryConfirm(previewUrl, dims, meta = { kind: 'image' }) {
  const isVideo = meta.kind === 'video';
  const lengthNote = isVideo && dims.duration
    ? `<p style="margin-bottom:12px;">${dims.duration.toFixed(0)} seconds</p>`
    : (meta.source === 'camera' ? '<p style="margin-bottom:12px;">framed 9:16</p>' : '');
  showModal(`
    <div class="modal-handle"></div>
    <h2>post this?</h2>
    ${isVideo
      ? `<video class="story-preview-img" src="${previewUrl}" controls playsinline preload="metadata"></video>`
      : `<img class="story-preview-img" src="${previewUrl}" alt="">`}
    ${lengthNote}
    <input type="text" id="storyCaption" class="input" placeholder="caption (optional)" maxlength="120">
    <button class="btn btn-primary" id="storyPost">post to story</button>
    ${isVideo ? '' : '<button class="btn btn-ghost" id="storyDecorate">✎ draw on it</button>'}
    ${meta.source === 'camera' && meta.originalFile ? '<button class="btn btn-ghost" id="storyFullFrame">use the whole photo instead</button>' : ''}
    ${meta.source === 'cameraFull' && meta.originalFile ? '<button class="btn btn-ghost" id="storyCrop">crop it to 9:16</button>' : ''}
    <button class="btn btn-ghost" id="storyBack">choose another</button>
  `);
  document.getElementById('storyPost').onclick = () => postStory(previewUrl, dims, meta);
  document.getElementById('storyBack').onclick = openStoryPicker;
  const dec = document.getElementById('storyDecorate');
  if (dec) dec.onclick = () => decorateStory(previewUrl, dims, meta);

  const full = document.getElementById('storyFullFrame');
  if (full) full.onclick = async () => {
    const whole = await resizeImageToDataUrl(meta.originalFile, 1440, 0.85);
    const d = await imageDimensions(whole);
    showStoryConfirm(whole, d, { kind: 'image', source: 'cameraFull', originalFile: meta.originalFile });
  };

  const recrop = document.getElementById('storyCrop');
  if (recrop) recrop.onclick = async () => {
    const cropped = await cropToPortrait(meta.originalFile);
    const d = await imageDimensions(cropped);
    showStoryConfirm(cropped, d, { kind: 'image', source: 'camera', originalFile: meta.originalFile });
  };
}

// Open the studio with the photo as the canvas, then come back here with
// the decorated version ready to post.
function decorateStory(previewUrl, dims, meta) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    closeModal();
    openEditor({
      mode: 'story',
      image: img,
      storyMeta: meta,
      onDone: async (dataUrl) => {
        const newDims = await imageDimensions(dataUrl);
        showStoryConfirm(dataUrl, { ...newDims, duration: dims.duration }, { kind: 'image' });
      },
    });
  };
  img.onerror = () => toast('could not open the editor');
  img.src = previewUrl;
}

async function postStory(previewUrl, dims, meta = { kind: 'image' }) {
  if (!supabase) return;
  const btn = document.getElementById('storyPost');
  const caption = (document.getElementById('storyCaption')?.value || '').trim();
  const isVideo = meta.kind === 'video';
  if (btn) { btn.disabled = true; btn.textContent = isVideo ? 'uploading video…' : 'posting…'; }

  try {
    // Videos go up as the original file; photos were already shrunk.
    const blob = isVideo ? meta.file : await (await fetch(previewUrl)).blob();
    const ext = isVideo ? ((blob.type && blob.type.split('/')[1]) || 'mp4') : 'jpg';
    const path = `stories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    const id = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

    const { error } = await supabase.from('stories').insert({
      id,
      author: state.user,
      url: pub.publicUrl,
      storage_path: path,
      media_type: isVideo ? 'video' : 'image',
      duration: isVideo ? (dims.duration || null) : null,
      width: dims.width,
      height: dims.height,
      caption: caption || null,
    });
    if (error) throw error;

    markStorySeen(id);
    notifyPartner(
      `${myName()} posted a story`,
      isVideo ? 'a new video 🎬' : 'a new photo ✨',
      { tag: 'story' }
    );
    await loadStories();
    closeModal();
    renderStoryRow();
    await addCoins(250);
    toast(isVideo ? '+250 coins · video posted' : '+250 coins · story posted');
  } catch (err) {
    console.error('postStory', err);
    toast('could not post the story');
    if (btn) { btn.disabled = false; btn.textContent = 'post to story'; }
  }
}

// ----- viewing stories -----
let storyTimer = null;
let storyStartedAt = 0;      // when the current run of the timer began
let storyElapsed = 0;        // how much of the 7s is already used up
let storyPaused = false;
const STORY_DURATION = 7000; // v2.2.2: 5s -> 7s

function openStoryViewer(who) {
  const list = storiesOf(who);
  if (!list.length) return;
  const seen = seenStoryIds();
  const firstUnseen = list.findIndex(s => !seen.has(s.id));
  state.storyViewUser = who;
  state.storyIndex = firstUnseen === -1 ? 0 : firstUnseen;
  document.getElementById('storyViewer').classList.add('active');
  renderStoryFrame();
}

// ---- timer that can actually be paused ----
// Photos run on a fixed 7s timer with a CSS-animated bar.
// Videos run on their own playback clock instead, so the bar matches
// the video however long it is.
let videoRaf = null;

function currentStoryIsVideo() {
  return !!document.getElementById('storyVideo');
}

function stopVideoTracking() {
  if (videoRaf) { cancelAnimationFrame(videoRaf); videoRaf = null; }
}

function trackVideoProgress() {
  const vid = document.getElementById('storyVideo');
  const bar = document.getElementById('activeBar');
  if (!vid) return;
  stopVideoTracking();
  const tick = () => {
    if (!vid.duration || !isFinite(vid.duration)) {
      videoRaf = requestAnimationFrame(tick);
      return;
    }
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = Math.min(100, (vid.currentTime / vid.duration) * 100) + '%';
    }
    videoRaf = requestAnimationFrame(tick);
  };
  videoRaf = requestAnimationFrame(tick);
}

function runStoryTimer() {
  storyPaused = false;

  if (currentStoryIsVideo()) {
    const vid = document.getElementById('storyVideo');
    if (vid) {
      const p = vid.play();
      if (p && p.catch) {
        // iOS blocks sound-on autoplay in some situations. Fall back to
        // muted playback rather than showing a frozen frame.
        p.catch(() => {
          vid.muted = true;
          const hint = document.getElementById('storyMuteHint');
          if (hint) hint.classList.add('show');
          vid.play().catch(() => {});
        });
      }
      trackVideoProgress();
    }
    clearTimeout(storyTimer);
    return;
  }

  const remaining = Math.max(0, STORY_DURATION - storyElapsed);
  storyStartedAt = Date.now();

  const bar = document.getElementById('activeBar');
  if (bar) {
    const pct = (storyElapsed / STORY_DURATION) * 100;
    bar.style.transition = 'none';
    bar.style.width = pct + '%';
    // Force the browser to apply that before starting the animation.
    void bar.offsetWidth;
    bar.style.transition = `width ${remaining}ms linear`;
    bar.style.width = '100%';
  }

  clearTimeout(storyTimer);
  storyTimer = setTimeout(() => stepStory(1), remaining);
}

function pauseStory() {
  if (storyPaused) return;
  storyPaused = true;
  const hint = document.getElementById('storyPausedHint');
  if (hint) hint.classList.add('show');

  if (currentStoryIsVideo()) {
    const vid = document.getElementById('storyVideo');
    if (vid) vid.pause();
    stopVideoTracking();
    return;
  }

  clearTimeout(storyTimer);
  storyElapsed += Date.now() - storyStartedAt;

  // Freeze the progress bar exactly where it is.
  const bar = document.getElementById('activeBar');
  if (bar) {
    const frozen = window.getComputedStyle(bar).width;
    bar.style.transition = 'none';
    bar.style.width = frozen;
  }
}

function resumeStory() {
  if (!storyPaused) return;
  const hint = document.getElementById('storyPausedHint');
  if (hint) hint.classList.remove('show');
  runStoryTimer();
}

function renderStoryFrame() {
  const who = state.storyViewUser;
  const list = storiesOf(who);
  const i = state.storyIndex;
  if (i < 0 || i >= list.length) { closeStoryViewer(); return; }
  const story = list[i];

  markStorySeen(story.id);

  const isMine = who === state.user;
  const other = state.user === 'ivo' ? 'nikolina' : 'ivo';
  const profile = state.profile[who];
  const name = profile?.name || (who === 'ivo' ? 'Ivo' : 'Nikolina');
  const posted = new Date(story.created_at);
  const ageMin = Math.floor((Date.now() - posted.getTime()) / 60000);
  const ageLabel = ageMin < 1 ? 'just now'
    : ageMin < 60 ? `${ageMin}m ago`
    : `${Math.floor(ageMin / 60)}h ago`;
  const bars = list.map((s, idx) => `
    <div class="story-progress-bar">
      <div class="story-progress-fill ${idx < i ? 'done' : ''}" ${idx === i ? 'id="activeBar"' : ''}></div>
    </div>
  `).join('');

  // On your partner's story: a like button.
  // On your own story: their avatar drifting about with a heart, if they liked it.
  const likedByOther = story.liked_by && story.liked_by !== who;
  const likeUi = isMine
    ? (likedByOther
        ? `<div class="story-liked-float" id="storyLikedFloat">
             ${avatarHtml(story.liked_by, 'tiny')}
             <span class="lf-heart">❤</span>
           </div>`
        : '')
    : `<button class="story-like-btn ${story.liked_by === state.user ? 'liked' : ''}" id="storyLike"
         aria-label="like this story">❤</button>`;

  document.getElementById('storyViewer').innerHTML = `
    <div class="story-progress">${bars}</div>
    <div class="story-viewer-head">
      ${avatarHtml(who, 'med')}
      <div>
        <div class="story-viewer-name">${escapeHtml(name)}</div>
        <div class="story-viewer-time">${ageLabel}</div>
      </div>
      <button class="story-viewer-close" id="storyClose">×</button>
    </div>
    <div class="story-stage" id="storyStage">
      ${story.media_type === 'video'
        ? `<video id="storyVideo" src="${story.url}" playsinline webkit-playsinline
                 preload="auto" draggable="false"></video>`
        : `<img id="storyImg" src="${story.url}" alt="" draggable="false">`}
      <div class="story-paused-hint" id="storyPausedHint">paused</div>
      ${story.media_type === 'video' ? '<div class="story-mute-hint" id="storyMuteHint">tap the speaker for sound</div>' : ''}
      ${story.media_type === 'video' ? '<button class="story-sound-btn" id="storySound" aria-label="sound">🔊</button>' : ''}
      <div class="story-nav" id="storyNav">
        <div id="storyPrev"></div>
        <div id="storyNext"></div>
      </div>
      ${likeUi}
      <button class="story-keep-btn" id="storyKeep" aria-label="keep this">⤓</button>
    </div>
    ${story.caption ? `<div class="story-caption">${escapeHtml(story.caption)}</div>` : ''}
    ${isMine ? '<div class="story-expiry"><button class="story-delete" id="storyDelete">delete now</button></div>' : ''}
  `;

  document.getElementById('storyClose').onclick = closeStoryViewer;
  const del = document.getElementById('storyDelete');
  if (del) del.onclick = () => deleteStory(story);

  const likeBtn = document.getElementById('storyLike');
  if (likeBtn) likeBtn.onclick = (e) => { e.stopPropagation(); toggleStoryLike(story); };

  const keepBtn = document.getElementById('storyKeep');
  if (keepBtn) keepBtn.onclick = (e) => {
    e.stopPropagation();
    pauseStory();
    keepStoryInVault(story);
  };

  const vid = document.getElementById('storyVideo');
  if (vid) {
    vid.onended = () => stepStory(1);
    vid.onerror = () => { console.error('video failed to load'); stepStory(1); };
    const soundBtn = document.getElementById('storySound');
    if (soundBtn) {
      soundBtn.onclick = (e) => {
        e.stopPropagation();
        vid.muted = !vid.muted;
        soundBtn.textContent = vid.muted ? '🔇' : '🔊';
        const hint = document.getElementById('storyMuteHint');
        if (hint) hint.classList.remove('show');
      };
    }
  }

  // Park the floating "they liked it" badge somewhere pleasant and random-ish,
  // so it isn't always in the same spot.
  const float = document.getElementById('storyLikedFloat');
  if (float) {
    const spots = [
      { right: '18px', bottom: '22px' },
      { left: '18px',  bottom: '30px' },
      { right: '24px', top: '18px' },
      { left: '22px',  top: '26px' },
    ];
    const spot = spots[Math.abs(hashString(story.id)) % spots.length];
    Object.assign(float.style, spot);
  }

  setupStoryGestures(story);

  storyElapsed = 0;
  runStoryTimer();
}

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

// ---- hold to pause, pinch to zoom where your fingers are ----
function setupStoryGestures(story) {
  const nav = document.getElementById('storyNav');
  // Zoom applies to whichever medium is showing.
  const img = document.getElementById('storyImg') || document.getElementById('storyVideo');
  if (!nav || !img) return;

  const HOLD_MS = 180;        // longer than this counts as a hold, not a tap
  const CLOSE_DISTANCE = 110; // swipe down this far to dismiss
  let holdTimer = null;
  let didHold = false;
  let startX = 0, startY = 0;
  let pinch = null;
  let scale = 1;
  let usedTouch = false;      // once true, ignore Safari's fake mouse events
  let swipe = null;           // vertical dismiss gesture in progress
  const viewer = document.getElementById('storyViewer');

  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  function resetZoom(animate = true) {
    scale = 1;
    img.classList.toggle('settling', animate);
    img.classList.remove('zooming');
    img.style.transform = 'scale(1)';
    setTimeout(() => img.classList.remove('settling'), 300);
  }

  function beginPinch(t0, t1) {
    clearTimeout(holdTimer);
    didHold = true;
    pauseStory();

    // Zoom around the point between the two fingers, expressed as a
    // percentage of the image box. Fixed at pinch start so it can't jump.
    const r = img.getBoundingClientRect();
    const midX = (t0.clientX + t1.clientX) / 2;
    const midY = (t0.clientY + t1.clientY) / 2;
    const ox = Math.min(100, Math.max(0, ((midX - r.left) / r.width) * 100));
    const oy = Math.min(100, Math.max(0, ((midY - r.top) / r.height) * 100));
    img.style.transformOrigin = `${ox}% ${oy}%`;
    img.classList.add('zooming');
    img.classList.remove('settling');

    pinch = { startDist: dist(t0, t1), startScale: scale };
  }

  nav.addEventListener('touchstart', (e) => {
    usedTouch = true;
    if (e.touches.length === 2) {
      e.preventDefault();
      swipe = null;
      beginPinch(e.touches[0], e.touches[1]);
      return;
    }
    if (e.touches.length === 1) {
      didHold = false;
      swipe = null;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => { didHold = true; pauseStory(); }, HOLD_MS);
    }
  }, { passive: false });

  nav.addEventListener('touchmove', (e) => {
    if (pinch && e.touches.length === 2) {
      e.preventDefault();
      const d = dist(e.touches[0], e.touches[1]);
      scale = Math.min(4, Math.max(1, pinch.startScale * (d / pinch.startDist)));
      img.style.transform = `scale(${scale})`;
      return;
    }
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      // Downward drag = dismiss, like Instagram. Follows your finger.
      if (swipe || (dy > 14 && Math.abs(dy) > Math.abs(dx) * 1.2)) {
        e.preventDefault();
        if (!swipe) {
          swipe = true;
          clearTimeout(holdTimer);
          didHold = true;             // so releasing never counts as a tap
          pauseStory();
          if (viewer) viewer.style.transition = 'none';
        }
        const drag = Math.max(0, dy);
        if (viewer) {
          viewer.style.transform = `translateY(${drag}px)`;
          viewer.style.opacity = String(Math.max(0.35, 1 - drag / 500));
        }
        return;
      }

      // Any other real drag isn't a tap — cancel the pending hold.
      if (!didHold && (Math.abs(dx) > 12 || Math.abs(dy) > 12)) {
        clearTimeout(holdTimer); didHold = true; pauseStory();
      }
    }
  }, { passive: false });

  function endTouch(e) {
    clearTimeout(holdTimer);

    // Released a downward swipe: far enough closes, otherwise spring back.
    if (swipe) {
      const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : startY;
      const dragged = Math.max(0, endY - startY);
      swipe = null;
      didHold = false;
      if (viewer) viewer.style.transition = 'transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.25s';
      if (dragged > CLOSE_DISTANCE) {
        if (viewer) {
          viewer.style.transform = `translateY(100%)`;
          viewer.style.opacity = '0';
        }
        setTimeout(closeStoryViewer, 180);
      } else {
        if (viewer) { viewer.style.transform = ''; viewer.style.opacity = ''; }
        resumeStory();
      }
      return;
    }

    if (pinch) {
      // Second finger lifted, or both. Snap back and carry on.
      if (e.touches.length < 2) {
        pinch = null;
        resetZoom(true);
      }
      if (e.touches.length === 0) resumeStory();
      return;
    }

    if (didHold) {
      didHold = false;
      resumeStory();
      return;
    }

    // Short tap: left half goes back, right half goes forward.
    const x = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
    const rect = nav.getBoundingClientRect();
    stepStory(x - rect.left < rect.width / 2 ? -1 : 1);
  }

  nav.addEventListener('touchend', endTouch, { passive: true });
  nav.addEventListener('touchcancel', () => {
    clearTimeout(holdTimer);
    pinch = null;
    resetZoom(false);
    didHold = false;
    resumeStory();
  }, { passive: true });

  // Mouse fallback for laptops. Safari also fires fake mouse events right
  // after every touch — those would navigate a second time and cause a
  // story to skip after you let go of a hold. So once we've seen a touch,
  // mouse handling is switched off for good.
  let mouseHold = null, mouseHeld = false;
  nav.addEventListener('mousedown', () => {
    if (usedTouch) return;
    mouseHeld = false;
    mouseHold = setTimeout(() => { mouseHeld = true; pauseStory(); }, HOLD_MS);
  });
  nav.addEventListener('mouseup', (e) => {
    if (usedTouch) return;
    clearTimeout(mouseHold);
    if (mouseHeld) { mouseHeld = false; resumeStory(); return; }
    const rect = nav.getBoundingClientRect();
    stepStory(e.clientX - rect.left < rect.width / 2 ? -1 : 1);
  });
  nav.addEventListener('mouseleave', () => {
    if (usedTouch) return;
    clearTimeout(mouseHold);
    if (mouseHeld) { mouseHeld = false; resumeStory(); }
  });
}

// ---- likes ----
async function toggleStoryLike(story) {
  if (!supabase) return;
  if (story.author === state.user) return;   // you can't like your own

  const btn = document.getElementById('storyLike');
  const nowLiked = story.liked_by !== state.user;
  const newValue = nowLiked ? state.user : null;

  // Update on screen straight away.
  story.liked_by = newValue;
  if (btn) {
    btn.classList.toggle('liked', nowLiked);
    btn.classList.remove('bursting');
    void btn.offsetWidth;
    btn.classList.add('bursting');
  }
  if (nowLiked) {
    const stage = document.getElementById('storyStage');
    if (stage) {
      const fly = document.createElement('div');
      fly.className = 'story-like-fly';
      fly.textContent = '❤';
      stage.appendChild(fly);
      setTimeout(() => fly.remove(), 900);
    }
    if (navigator.vibrate) navigator.vibrate(12);
  }

  if (nowLiked) {
    notifyPartner(
      `${myName()} liked your story`,
      '❤',
      { to: story.author, tag: 'story-like-' + story.id }
    );
  }

  const { error } = await supabase.from('stories').update({ liked_by: newValue }).eq('id', story.id);
  if (error) {
    console.error('toggleStoryLike', error);
    story.liked_by = nowLiked ? null : state.user;   // put it back
    if (btn) btn.classList.toggle('liked', !nowLiked);
    toast('could not save that like');
    return;
  }

  // Keep our copy in state in sync.
  const inState = state.stories.find(s => s.id === story.id);
  if (inState) inState.liked_by = newValue;
}

// Updates just the like bits of the open story, without re-rendering the
// frame — so the timer keeps running and a pinch in progress isn't lost.
function refreshStoryLikeUi() {
  const list = storiesOf(state.storyViewUser);
  const story = list[state.storyIndex];
  if (!story) return;

  const isMine = story.author === state.user;
  const stage = document.getElementById('storyStage');
  if (!stage) return;

  if (isMine) {
    const likedBy = story.liked_by && story.liked_by !== story.author ? story.liked_by : null;
    let float = document.getElementById('storyLikedFloat');
    if (likedBy && !float) {
      float = document.createElement('div');
      float.className = 'story-liked-float';
      float.id = 'storyLikedFloat';
      float.innerHTML = `${avatarHtml(likedBy, 'tiny')}<span class="lf-heart">❤</span>`;
      const spots = [
        { right: '18px', bottom: '22px' },
        { left: '18px',  bottom: '30px' },
        { right: '24px', top: '18px' },
        { left: '22px',  top: '26px' },
      ];
      Object.assign(float.style, spots[Math.abs(hashString(story.id)) % spots.length]);
      stage.appendChild(float);
      if (navigator.vibrate) navigator.vibrate(12);
    } else if (!likedBy && float) {
      float.remove();
    }
  } else {
    const btn = document.getElementById('storyLike');
    if (btn) btn.classList.toggle('liked', story.liked_by === state.user);
  }
}

function stepStory(dir) {
  clearTimeout(storyTimer);
  const list = storiesOf(state.storyViewUser);
  const next = state.storyIndex + dir;
  if (next < 0) { state.storyIndex = 0; storyElapsed = 0; renderStoryFrame(); return; }
  if (next >= list.length) { closeStoryViewer(); return; }
  state.storyIndex = next;
  storyElapsed = 0;
  renderStoryFrame();
}

function closeStoryViewer() {
  clearTimeout(storyTimer);
  stopVideoTracking();
  storyPaused = false;
  storyElapsed = 0;
  const v = document.getElementById('storyViewer');
  v.classList.remove('active');
  // Undo anything the swipe-to-dismiss gesture left behind.
  v.style.transition = '';
  v.style.transform = '';
  v.style.opacity = '';
  v.innerHTML = '';
  renderStoryRow();
}


async function deleteStory(story) {
  clearTimeout(storyTimer);
  showConfirm('delete this story?', 'it will be gone for both of you.', async () => {
    if (!supabase) return;
    await supabase.from('stories').delete().eq('id', story.id);
    if (story.storage_path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([story.storage_path]);
    }
    await loadStories();
    closeStoryViewer();
    toast('story deleted');
  });
}


// ===============================================================
// PUSH NOTIFICATIONS
// ===============================================================
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// On iPhone this only works once the app has been added to the home screen.
function isStandalone() {
  return window.navigator.standalone === true
    || window.matchMedia('(display-mode: standalone)').matches;
}

let swReloadArmed = false;

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
    reg.update().catch(() => {});

    // If a newer worker takes over while we're running, the page we're
    // looking at is out of date. Reload once, quietly.
    if (!swReloadArmed) {
      swReloadArmed = true;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (sessionStorage.getItem('ivolina_reloaded') === '1') return;
        try { sessionStorage.setItem('ivolina_reloaded', '1'); } catch {}
        window.location.reload();
      });
    }
    return reg;
  } catch (e) {
    console.error('service worker registration failed', e);
    return null;
  }
}

// Must be called from a real tap — browsers refuse otherwise.
async function enableNotifications() {
  if (!pushSupported()) {
    toast('this browser cannot do notifications');
    return false;
  }
  if (!VAPID_PUBLIC_KEY) {
    toast('notifications are not configured yet');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    toast(permission === 'denied' ? 'notifications are blocked in settings' : 'not enabled');
    return false;
  }

  const reg = await registerServiceWorker();
  if (!reg) { toast('could not set up notifications'); return false; }
  await navigator.serviceWorker.ready;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    } catch (e) {
      console.error('subscribe failed', e);
      toast('could not subscribe this device');
      return false;
    }
  }

  const json = sub.toJSON();
  const { error } = await supabase.from('push_subscriptions').upsert({
    endpoint: json.endpoint,
    user_key: state.user,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
    user_agent: navigator.userAgent.slice(0, 200),
  }, { onConflict: 'endpoint' });

  if (error) {
    console.error('saving subscription failed', error);
    toast('could not save this device');
    return false;
  }

  lsSet('pushEnabled', '1');
  toast('notifications are on');
  renderSettings();
  return true;
}

async function disableNotifications() {
  lsSet('pushEnabled', '');
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.toJSON().endpoint;
      await sub.unsubscribe();
      if (supabase) await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
    }
  } catch (e) {
    console.error('unsubscribe failed', e);
  }
  toast('notifications are off');
  renderSettings();
}

async function notificationStatus() {
  if (!pushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'blocked';
  if (Notification.permission !== 'granted') return 'off';
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && await reg.pushManager.getSubscription();
    return sub ? 'on' : 'off';
  } catch { return 'off'; }
}

// Fire-and-forget: never let a notification failure break the action itself.
function notifyPartner(title, message, opts = {}) {
  const other = state.user === 'ivo' ? 'nikolina' : 'ivo';
  fetch('/api/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: opts.to || other,
      title,
      message,
      url: opts.url || '/',
      tag: opts.tag || 'ivolina',
    }),
  }).catch(err => console.warn('notify failed', err));
}

function myName() {
  return state.profile[state.user]?.name || (state.user === 'ivo' ? 'Ivo' : 'Nikolina');
}


async function openNotificationSettings() {
  const st = await notificationStatus();

  if (st === 'unsupported') {
    showModal(`
      <div class="modal-handle"></div>
      <h2>not available here</h2>
      <p style="text-align:left; line-height:1.6;">
        This browser can't do notifications. On an iPhone you need iOS 16.4 or newer,
        and ivolina has to be added to your home screen first.
      </p>
      <button class="btn btn-primary" id="nOk">got it</button>
    `);
    document.getElementById('nOk').onclick = closeModal;
    return;
  }

  if (st === 'blocked') {
    showModal(`
      <div class="modal-handle"></div>
      <h2>blocked</h2>
      <p style="text-align:left; line-height:1.6;">
        Notifications were turned off for ivolina in your phone's settings, so the app
        can't ask again. On iPhone: Settings → Notifications → ivolina → Allow Notifications.
      </p>
      <button class="btn btn-primary" id="nOk">got it</button>
    `);
    document.getElementById('nOk').onclick = closeModal;
    return;
  }

  if (st === 'on') {
    showModal(`
      <div class="modal-handle"></div>
      <h2>notifications are on</h2>
      <p style="text-align:left; line-height:1.6;">
        You'll hear about new messages, questions, answers, drawings and stories —
        plus the days worth celebrating.
      </p>
      <button class="btn btn-ghost" id="nTest">send me a test</button>
      <button class="btn btn-danger" id="nOff">turn off on this phone</button>
      <button class="btn btn-ghost" id="nCancel">close</button>
    `);
    document.getElementById('nTest').onclick = () => {
      notifyPartner('Test from ivolina', 'If you can read this, it works ✨', { to: state.user, tag: 'test' });
      toast('test sent — give it a moment');
    };
    document.getElementById('nOff').onclick = () => { closeModal(); disableNotifications(); };
    document.getElementById('nCancel').onclick = closeModal;
    return;
  }

  const standalone = isStandalone();
  showModal(`
    <div class="modal-handle"></div>
    <h2>turn on notifications</h2>
    <p style="text-align:left; line-height:1.6;">
      Get a notification when ${state.user === 'ivo' ? 'Nikolina' : 'Ivo'} sends a message,
      asks a question, posts a story — and on the days worth celebrating.
      ${standalone ? '' : '<br><br><strong>On iPhone this only works once ivolina is on your home screen.</strong> Tap Share, then "Add to Home Screen", and open it from there.'}
    </p>
    <button class="btn btn-primary" id="nOn">turn on</button>
    <button class="btn btn-ghost" id="nCancel">not now</button>
  `);
  document.getElementById('nOn').onclick = async () => {
    const ok = await enableNotifications();
    if (ok) closeModal();
  };
  document.getElementById('nCancel').onclick = closeModal;
}


// ===============================================================
// DRAWING STUDIO (v2.4)
// Used in two places: the drawing board, and decorating a photo
// before it goes out as a story.
//
// Strokes and stickers are kept as a list of operations rather than
// as bitmap snapshots, so undo is exact and memory stays small even
// on a phone.
// ===============================================================

const BRUSHES = [
  { id: 'pen',    label: 'pen',    icon: '✒️' },
  { id: 'marker', label: 'marker', icon: '🖍' },
  { id: 'neon',   label: 'neon',   icon: '✨' },
  { id: 'chalk',  label: 'chalk',  icon: '🖌' },
  { id: 'eraser', label: 'eraser', icon: '🩹' },
];

const SWATCHES = [
  '#000000', '#ffffff', '#ff4d6d', '#ff8fab', '#F4A8C8',
  '#7BC4F5', '#4A9FE0', '#7ee0a5', '#ffd56b', '#f5a623',
  '#b47aff', '#8b5cf6', '#ff6b35', '#2d3142',
];

const STICKERS = [
  '❤️','💕','💖','💘','💝','😍','🥰','😘','🤍','💌',
  '🌸','🌹','🌷','🌻','✨','⭐','🌙','☀️','🌈','☁️',
  '🎂','🎉','🎁','🍰','🥂','☕','🍕','🍓','🍦','🧸',
  '✈️','🚗','🏠','🗺','📍','⏳','💍','👑','🔥','💫',
];

const TEXT_FONTS = [
  { id: 'serif',  label: 'Classic', css: "'Fraunces', Georgia, serif" },
  { id: 'sans',   label: 'Clean',   css: "'Inter', system-ui, sans-serif" },
  { id: 'bold',   label: 'Strong',  css: "900 1em 'Inter', system-ui, sans-serif", weight: '900' },
  { id: 'mono',   label: 'Typed',   css: "'Courier New', monospace" },
  { id: 'script', label: 'Hand',    css: "'Snell Roundhand', 'Brush Script MT', cursive" },
  { id: 'wide',   label: 'Wide',    css: "'Inter', system-ui, sans-serif", spacing: 0.18 },
];

const TEXT_BG_STYLES = [
  { id: 'none',  label: 'none' },
  { id: 'pill',  label: 'pill' },
  { id: 'block', label: 'block' },
];

const BACKGROUNDS = [
  { id: 'white',  label: 'white',  css: '#ffffff' },
  { id: 'cream',  label: 'cream',  css: '#fdf6e3' },
  { id: 'dark',   label: 'dark',   css: '#1a1625' },
  { id: 'blush',  label: 'blush',  css: 'linear-gradient(135deg,#ffe3ec,#ffc9de)' },
  { id: 'sky',    label: 'sky',    css: 'linear-gradient(135deg,#d8f0ff,#a8d8f5)' },
  { id: 'sunset', label: 'sunset', css: 'linear-gradient(135deg,#ffd6a5,#ffadad)' },
  { id: 'mint',   label: 'mint',   css: 'linear-gradient(135deg,#d9f7e7,#a8e6cf)' },
  { id: 'grid',   label: 'grid',   css: '#ffffff', pattern: 'grid' },
  { id: 'dots',   label: 'dots',   css: '#ffffff', pattern: 'dots' },
  { id: 'lined',  label: 'lined',  css: '#ffffff', pattern: 'lined' },
];

const editor = {
  open: false,
  mode: 'board',        // 'board' | 'story'
  canvas: null,
  ctx: null,
  ops: [],
  redo: [],
  tool: 'pen',
  color: '#000000',
  width: 6,
  bg: BACKGROUNDS[0],
  bgImage: null,        // an Image for story mode
  sticker: null,        // emoji waiting to be placed
  font: 'serif',
  textBg: 'none',
  activeText: null,     // index of the text being nudged about
  rowScroll: {},        // scroll position of each toolbar row
  sliderPos: 0,
  panel: null,          // 'stickers' | 'background' | null
  onDone: null,
  storyMeta: null,
};

// Slider position 0..1000 -> colour. Black at the far left, a full
// rainbow through the middle, white at the far right.
function sliderToColor(v) {
  const t = v / 1000;
  if (t <= 0.08) {
    const k = Math.round((t / 0.08) * 100);
    return `hsl(0, 0%, ${Math.round(k * 0.12)}%)`;
  }
  if (t >= 0.92) {
    const k = (t - 0.92) / 0.08;
    return `hsl(0, 0%, ${Math.round(88 + k * 12)}%)`;
  }
  const hue = Math.round(((t - 0.08) / 0.84) * 340);
  return `hsl(${hue}, 85%, 52%)`;
}

function openEditor(opts = {}) {
  editor.open = true;
  editor.mode = opts.mode || 'board';
  editor.ops = [];
  editor.redo = [];
  editor.tool = 'pen';
  editor.color = editor.mode === 'story' ? '#ffffff' : '#000000';
  editor.width = 6;
  editor.bg = BACKGROUNDS[0];
  editor.bgImage = opts.image || null;
  editor.sticker = null;
  editor.panel = null;
  editor.font = 'serif';
  editor.textBg = 'none';
  editor.activeText = null;
  editor.sliderPos = editor.mode === 'story' ? 1000 : 0;
  editor.onDone = opts.onDone || null;
  editor.storyMeta = opts.storyMeta || null;

  editor.rowScroll = {};

  document.getElementById('editorOverlay').classList.add('active');
  renderEditorShell();     // top bar + canvas: built ONCE
  renderEditorTools();     // toolbar: rebuilt on every change
  sizeEditorCanvas();
  attachEditorDrawing();   // handlers on the one canvas that stays
  redrawEditor();
}

function closeEditor() {
  editor.open = false;
  editor.bgImage = null;
  editor.ops = [];
  editor.redo = [];
  document.getElementById('editorOverlay').classList.remove('active');
}

// The shell holds the canvas. It is rendered exactly once per session,
// so tapping a brush can never wipe the drawing again.
function renderEditorShell() {
  const isStory = editor.mode === 'story';
  document.getElementById('editorOverlay').innerHTML = `
    <div class="editor-top">
      <button class="ed-icon-btn" id="edClose">×</button>
      <h2>${isStory ? 'decorate' : 'drawing'}</h2>
      <button class="ed-icon-btn" id="edUndo" title="undo">↶</button>
      <button class="ed-icon-btn" id="edRedo" title="redo">↷</button>
      <button class="ed-icon-btn" id="edClear" title="clear">🗑</button>
      <button class="ed-done-btn" id="edDone">${isStory ? 'next' : 'save'}</button>
    </div>

    <div class="editor-canvas-wrap" id="edCanvasWrap">
      <canvas id="editorCanvas"></canvas>
      <div class="editor-hint" id="edHint"></div>
    </div>

    <div class="editor-tools" id="edTools"></div>
  `;

  const $ = (id) => document.getElementById(id);
  $('edClose').onclick = () => {
    if (editor.ops.length) showConfirm('discard this?', 'your drawing will be lost.', closeEditor);
    else closeEditor();
  };
  $('edUndo').onclick = undoEditor;
  $('edRedo').onclick = redoEditor;
  $('edClear').onclick = () => {
    if (!editor.ops.length) return;
    showConfirm('clear everything?', '', () => {
      editor.redo = editor.ops.slice();
      editor.ops = [];
      editor.activeText = null;
      redrawEditor();
      updateEditorButtons();
    });
  };
  $('edDone').onclick = finishEditor;
}

// Only the toolbar. Safe to call as often as you like.
function renderEditorTools() {
  const tools = document.getElementById('edTools');
  if (!tools) return;
  const isStory = editor.mode === 'story';

  // Remember how far each horizontal row was scrolled before we rebuild it.
  tools.querySelectorAll('.tool-row').forEach((row, i) => {
    editor.rowScroll[i] = row.scrollLeft;
  });

  const brushRow = BRUSHES.map(b =>
    `<button class="tool-chip ${editor.tool === b.id ? 'active' : ''}" data-brush="${b.id}">${b.icon} ${b.label}</button>`
  ).join('');

  const swatches = SWATCHES.map(c =>
    `<div class="swatch ${editor.color.toLowerCase() === c ? 'active' : ''}" data-swatch="${c}" style="background:${c}"></div>`
  ).join('');

  const stickerBtns = STICKERS.map(e =>
    `<button class="sticker-btn ${editor.sticker === e ? 'active' : ''}" data-sticker="${e}">${e}</button>`
  ).join('');

  const bgSwatches = BACKGROUNDS.map(b =>
    `<div class="bg-swatch ${editor.bg.id === b.id ? 'active' : ''}" data-bg="${b.id}" style="background:${b.css}"></div>`
  ).join('');

  tools.innerHTML = `
      <div class="tool-row">
        ${brushRow}
        <button class="tool-chip ${editor.tool === 'text' ? 'active' : ''}" data-texttool="1">🅣 text</button>
        <button class="tool-chip ${editor.panel === 'stickers' ? 'active' : ''}" data-panel="stickers">🌸 stickers</button>
        ${isStory ? '' : `<button class="tool-chip ${editor.panel === 'background' ? 'active' : ''}" data-panel="background">🎨 paper</button>`}
      </div>

      <div class="slider-row">
        <span class="slider-label">colour</span>
        <input type="range" class="ed-slider" id="colorSlider" min="0" max="1000" value="${editor.sliderPos || 0}">
        <span class="color-preview" id="colorPreview" style="background:${editor.color}"></span>
      </div>

      <div class="swatch-row" id="swatchRow">${swatches}</div>

      <div class="slider-row">
        <span class="slider-label">size</span>
        <input type="range" class="ed-slider" id="widthSlider" min="1" max="60" value="${editor.width}">
        <span class="color-preview" id="widthPreview">
          <span class="width-dot" id="widthDot" style="width:${Math.max(3, Math.min(26, editor.width))}px;height:${Math.max(3, Math.min(26, editor.width))}px"></span>
        </span>
      </div>

      <div class="panel ${editor.panel === 'text' ? 'open' : ''}" id="textPanel">
        <div class="tool-row">
          ${TEXT_FONTS.map(f => `<button class="tool-chip ${editor.font === f.id ? 'active' : ''}" data-font="${f.id}" style="font-family:${f.css.replace(/^900 1em /, '')}">${f.label}</button>`).join('')}
        </div>
        <div class="tool-row">
          ${TEXT_BG_STYLES.map(b => `<button class="tool-chip ${editor.textBg === b.id ? 'active' : ''}" data-textbg="${b.id}">▢ ${b.label}</button>`).join('')}
        </div>
        <button class="btn btn-ghost" id="edAddText" style="margin:6px 0 0;">+ add text</button>
      </div>

      <div class="panel ${editor.panel === 'stickers' ? 'open' : ''}" id="stickerPanel">
        <div class="sticker-grid">${stickerBtns}</div>
      </div>

      <div class="panel ${editor.panel === 'background' ? 'open' : ''}" id="bgPanel">
        <div class="bg-grid">${bgSwatches}</div>
      </div>
  `;

  // Put every row back where it was scrolled to.
  tools.querySelectorAll('.tool-row').forEach((row, i) => {
    if (editor.rowScroll[i]) row.scrollLeft = editor.rowScroll[i];
  });

  wireEditorUi();
}

// Kept so older call sites keep working: it now only touches the toolbar.
function renderEditorUi() {
  renderEditorTools();
}

function wireEditorUi() {
  const $ = (id) => document.getElementById(id);

  document.querySelectorAll('[data-brush]').forEach(b => {
    b.onclick = () => {
      editor.tool = b.dataset.brush;
      editor.sticker = null;
      editor.activeText = null;
      editor.panel = null;
      renderEditorUi();
    };
  });

  document.querySelectorAll('[data-panel]').forEach(b => {
    b.onclick = () => {
      editor.panel = editor.panel === b.dataset.panel ? null : b.dataset.panel;
      if (b.dataset.panel === 'stickers' && editor.tool === 'text') editor.tool = 'pen';
      renderEditorUi();
    };
  });

  document.querySelectorAll('[data-swatch]').forEach(sw => {
    sw.onclick = () => {
      editor.color = sw.dataset.swatch;
      editor.tool = editor.tool === 'eraser' ? 'pen' : editor.tool;
      editor.sticker = null;
      if (editor.activeText != null && editor.ops[editor.activeText]) {
        editor.ops[editor.activeText].color = editor.color;
        redrawEditor();
      }
      renderEditorUi();
    };
  });

  const tt = document.querySelector('[data-texttool]');
  if (tt) tt.onclick = () => {
    editor.tool = 'text';
    editor.sticker = null;
    editor.panel = editor.panel === 'text' ? null : 'text';
    renderEditorUi();
  };

  const addTextBtn = document.getElementById('edAddText');
  if (addTextBtn) addTextBtn.onclick = () => promptForText();

  document.querySelectorAll('[data-font]').forEach(b => {
    b.onclick = () => {
      editor.font = b.dataset.font;
      // Restyle the selected text straight away.
      if (editor.activeText != null && editor.ops[editor.activeText]) {
        editor.ops[editor.activeText].font = editor.font;
        redrawEditor();
      }
      renderEditorUi();
    };
  });

  document.querySelectorAll('[data-textbg]').forEach(b => {
    b.onclick = () => {
      editor.textBg = b.dataset.textbg;
      if (editor.activeText != null && editor.ops[editor.activeText]) {
        editor.ops[editor.activeText].bg = editor.textBg;
        redrawEditor();
      }
      renderEditorUi();
    };
  });

  document.querySelectorAll('[data-sticker]').forEach(b => {
    b.onclick = () => {
      editor.sticker = editor.sticker === b.dataset.sticker ? null : b.dataset.sticker;
      if (editor.sticker) {
        // Leave the text tool, or its tap handling would swallow the placement.
        if (editor.tool === 'text') editor.tool = 'pen';
        editor.activeText = null;
      }
      renderEditorUi();
      if (editor.sticker) showEditorHint('tap the picture to place it');
    };
  });

  document.querySelectorAll('[data-bg]').forEach(b => {
    b.onclick = () => {
      editor.bg = BACKGROUNDS.find(x => x.id === b.dataset.bg) || BACKGROUNDS[0];
      renderEditorUi();
      redrawEditor();
    };
  });

  const cs = $('colorSlider');
  cs.oninput = () => {
    editor.sliderPos = parseInt(cs.value, 10);
    editor.color = sliderToColor(editor.sliderPos);
    if (editor.tool === 'eraser') editor.tool = 'pen';
    editor.sticker = null;
    $('colorPreview').style.background = editor.color;
    document.querySelectorAll('[data-swatch]').forEach(x => x.classList.remove('active'));
    if (editor.activeText != null && editor.ops[editor.activeText]) {
      editor.ops[editor.activeText].color = editor.color;
      redrawEditor();
    }
  };

  const ws = $('widthSlider');
  ws.oninput = () => {
    editor.width = parseInt(ws.value, 10);
    const d = $('widthDot');
    const px = Math.max(3, Math.min(26, editor.width));
    d.style.width = px + 'px';
    d.style.height = px + 'px';
  };

  updateEditorButtons();
}

function showEditorHint(text) {
  const h = document.getElementById('edHint');
  if (!h) return;
  h.textContent = text;
  h.classList.add('show');
  clearTimeout(showEditorHint._t);
  showEditorHint._t = setTimeout(() => h.classList.remove('show'), 1800);
}

function updateEditorButtons() {
  const u = document.getElementById('edUndo');
  const r = document.getElementById('edRedo');
  if (u) u.disabled = editor.ops.length === 0;
  if (r) r.disabled = editor.redo.length === 0;
}

function sizeEditorCanvas() {
  const canvas = document.getElementById('editorCanvas');
  const wrap = document.getElementById('edCanvasWrap');
  if (!canvas || !wrap) return;

  const availW = wrap.clientWidth || 340;
  const availH = wrap.clientHeight || 380;

  // Story keeps the photo's own shape; the drawing board is square.
  let ratio = 1;
  if (editor.mode === 'story' && editor.bgImage && editor.bgImage.naturalHeight) {
    ratio = editor.bgImage.naturalWidth / editor.bgImage.naturalHeight;
  }

  let w = availW;
  let h = w / ratio;
  if (h > availH) { h = availH; w = h * ratio; }

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.style.width = Math.round(w) + 'px';
  canvas.style.height = Math.round(h) + 'px';
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);

  editor.canvas = canvas;
  editor.ctx = canvas.getContext('2d');
}

function paintBackground(ctx, W, H) {
  if (editor.mode === 'story' && editor.bgImage) {
    ctx.drawImage(editor.bgImage, 0, 0, W, H);
    return;
  }
  const bg = editor.bg;

  if (bg.css.startsWith('linear-gradient')) {
    // Pull the two colours out of the CSS so we can paint the same thing.
    const cols = bg.css.match(/#[0-9a-f]{6}/gi) || ['#ffffff', '#eeeeee'];
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, cols[0]);
    g.addColorStop(1, cols[1] || cols[0]);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = bg.css;
  }
  ctx.fillRect(0, 0, W, H);

  if (bg.pattern) {
    ctx.save();
    ctx.strokeStyle = 'rgba(80,90,120,0.20)';
    ctx.fillStyle = 'rgba(80,90,120,0.25)';
    ctx.lineWidth = Math.max(1, W / 500);
    const step = W / 14;
    if (bg.pattern === 'grid') {
      for (let x = step; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = step; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    } else if (bg.pattern === 'lined') {
      for (let y = step; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    } else if (bg.pattern === 'dots') {
      const r = Math.max(1, W / 300);
      for (let x = step; x < W; x += step) {
        for (let y = step; y < H; y += step) {
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    ctx.restore();
  }
}

function applyBrush(ctx, op, W) {
  const px = op.width * (W / 1000);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'source-over';

  switch (op.tool) {
    case 'marker':
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = px * 2.1;
      ctx.strokeStyle = op.color;
      break;
    case 'neon':
      ctx.lineWidth = px;
      ctx.strokeStyle = op.color;
      ctx.shadowBlur = px * 2.6;
      ctx.shadowColor = op.color;
      break;
    case 'chalk':
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = px * 1.35;
      ctx.strokeStyle = op.color;
      break;
    case 'eraser':
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = px * 1.8;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      break;
    default:
      ctx.lineWidth = px;
      ctx.strokeStyle = op.color;
  }
}

// Ink lives on its own layer so the eraser can rub out strokes
// without punching a hole in the background or the photo.
function redrawEditor() {
  const canvas = editor.canvas || document.getElementById('editorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  paintBackground(ctx, W, H);

  const ink = document.createElement('canvas');
  ink.width = W; ink.height = H;
  const ictx = ink.getContext ? ink.getContext('2d') : null;

  // Without a working second layer we simply draw straight onto the
  // canvas. The eraser is the only thing that behaves differently.
  const target = ictx || ctx;

  editor.ops.forEach(op => {
    if (op.kind === 'stroke') {
      if (op.points.length < 2) {
        // A single tap still leaves a dot.
        applyBrush(target, op, W);
        const p = op.points[0];
        target.beginPath();
        target.arc(p.x * W, p.y * H, Math.max(0.6, target.lineWidth / 2), 0, Math.PI * 2);
        target.fillStyle = op.tool === 'eraser' ? 'rgba(0,0,0,1)' : op.color;
        target.fill();
        return;
      }
      applyBrush(target, op, W);
      target.beginPath();
      target.moveTo(op.points[0].x * W, op.points[0].y * H);
      for (let i = 1; i < op.points.length; i++) {
        target.lineTo(op.points[i].x * W, op.points[i].y * H);
      }
      target.stroke();
    } else if (op.kind === 'text') {
      target.globalCompositeOperation = 'source-over';
      target.globalAlpha = 1;
      target.shadowBlur = 0;
      drawTextOp(target, op, W, H);
    } else if (op.kind === 'sticker') {
      target.globalCompositeOperation = 'source-over';
      target.globalAlpha = 1;
      target.shadowBlur = 0;
      const size = op.size * (W / 1000);
      target.font = `${size}px system-ui, "Apple Color Emoji", sans-serif`;
      target.textAlign = 'center';
      target.textBaseline = 'middle';
      target.fillText(op.emoji, op.x * W, op.y * H);
    }
  });

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.shadowBlur = 0;
  if (ictx) ctx.drawImage(ink, 0, 0);
}


function fontCssFor(op, sizePx) {
  const f = TEXT_FONTS.find(x => x.id === op.font) || TEXT_FONTS[0];
  const family = f.css.replace(/^900 1em /, '');
  const weight = f.weight ? f.weight + ' ' : '';
  return `${weight}${sizePx}px ${family}`;
}

function drawTextOp(ctx, op, W, H) {
  const size = op.size * (W / 1000);
  const f = TEXT_FONTS.find(x => x.id === op.font) || TEXT_FONTS[0];
  ctx.font = fontCssFor(op, size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = String(op.text).split('\n');
  const lineH = size * 1.22;
  const spacing = f.spacing ? size * f.spacing : 0;

  const widths = lines.map(l => ctx.measureText(l).width + spacing * Math.max(0, l.length - 1));
  const maxW = Math.max(...widths, 1);
  const totalH = lineH * lines.length;
  const cx = op.x * W;
  const cy = op.y * H;

  // Optional plate behind the words.
  if (op.bg && op.bg !== 'none') {
    const padX = size * 0.45;
    const padY = size * 0.28;
    const bw = maxW + padX * 2;
    const bh = totalH + padY * 2;
    const x = cx - bw / 2;
    const y = cy - bh / 2;
    const r = op.bg === 'pill' ? bh / 2 : size * 0.18;
    ctx.fillStyle = isLightColor(op.color) ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.88)';
    roundRect(ctx, x, y, bw, bh, r);
    ctx.fill();
  }

  ctx.fillStyle = op.color;
  lines.forEach((line, i) => {
    const y = cy - totalH / 2 + lineH * (i + 0.5);
    if (spacing) {
      // Letter spacing has to be done by hand on a canvas.
      const chars = [...line];
      const lineW = ctx.measureText(line).width + spacing * Math.max(0, chars.length - 1);
      let x = cx - lineW / 2;
      ctx.textAlign = 'left';
      chars.forEach(ch => {
        ctx.fillText(ch, x, y);
        x += ctx.measureText(ch).width + spacing;
      });
      ctx.textAlign = 'center';
    } else {
      ctx.fillText(line, cx, y);
    }
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function isLightColor(col) {
  if (!col) return false;
  if (col.startsWith('hsl')) {
    const m = col.match(/hsl\([^,]+,[^,]+,\s*([\d.]+)%/);
    return m ? parseFloat(m[1]) > 62 : false;
  }
  const hex = col.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

// Ask for the words, then drop them in the middle where they can be moved.
function promptForText(existingIndex = null) {
  const existing = existingIndex != null ? editor.ops[existingIndex] : null;
  showModal(`
    <div class="modal-handle"></div>
    <h2>${existing ? 'edit text' : 'add text'}</h2>
    <p>two fingers on the picture to resize it</p>
    <textarea id="edTextInput" class="input" placeholder="type something..." style="min-height:90px;">${existing ? escapeHtml(existing.text) : ''}</textarea>
    <button class="btn btn-primary" id="edTextOk">${existing ? 'save' : 'place it'}</button>
    ${existing ? '<button class="btn btn-danger" id="edTextDel">delete this text</button>' : ''}
    <button class="btn btn-ghost" id="edTextCancel">cancel</button>
  `);
  setTimeout(() => document.getElementById('edTextInput')?.focus(), 120);

  document.getElementById('edTextOk').onclick = () => {
    const val = document.getElementById('edTextInput').value.trim();
    if (!val) { toast('type something first'); return; }
    if (existing) {
      existing.text = val;
      existing.font = editor.font;
      existing.bg = editor.textBg;
      existing.color = editor.color;
    } else {
      editor.ops.push({
        kind: 'text',
        text: val,
        x: 0.5, y: 0.5,
        size: 90,
        font: editor.font,
        color: editor.color,
        bg: editor.textBg,
      });
      editor.redo = [];
      editor.activeText = editor.ops.length - 1;
    }
    closeModal();
    renderEditorUi();
    redrawEditor();
    showEditorHint('drag to move · two fingers to resize');
  };

  const del = document.getElementById('edTextDel');
  if (del) del.onclick = () => {
    editor.ops.splice(existingIndex, 1);
    editor.activeText = null;
    closeModal();
    renderEditorUi();
    redrawEditor();
  };
  document.getElementById('edTextCancel').onclick = closeModal;
}

// Which text (if any) is under this point?
function textAt(px, py) {
  for (let i = editor.ops.length - 1; i >= 0; i--) {
    const op = editor.ops[i];
    if (op.kind !== 'text') continue;
    const halfW = 0.42;
    const halfH = (op.size / 1000) * 0.9;
    if (Math.abs(px - op.x) < halfW && Math.abs(py - op.y) < Math.max(0.05, halfH)) return i;
  }
  return null;
}

function attachEditorDrawing() {
  const canvas = document.getElementById('editorCanvas');
  if (!canvas) return;

  let drawing = false;
  let current = null;
  let dragText = null;      // text being moved with one finger
  let pinchText = null;     // text being resized with two

  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return {
      x: Math.min(1, Math.max(0, (t.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (t.clientY - r.top) / r.height)),
    };
  };

  const start = (e) => {
    e.preventDefault();

    // A sticker waiting to be placed always wins — otherwise the text
    // tool swallows the tap and nothing appears to happen.
    if (editor.sticker) {
      const sp = pos(e);
      editor.ops.push({
        kind: 'sticker',
        emoji: editor.sticker,
        x: sp.x, y: sp.y,
        size: Math.max(60, editor.width * 9),
      });
      editor.redo = [];
      editor.sticker = null;
      renderEditorUi();
      redrawEditor();
      updateEditorButtons();
      return;
    }

    // Two fingers on a selected text: resize it.
    if (e.touches && e.touches.length === 2 && editor.activeText != null) {
      const op = editor.ops[editor.activeText];
      if (op && op.kind === 'text') {
        pinchText = { startDist: dist(e.touches[0], e.touches[1]), startSize: op.size, index: editor.activeText };
        drawing = false;
        current = null;
        return;
      }
    }

    const p = pos(e);

    // Tapping an existing text picks it up rather than drawing over it.
    const hit = textAt(p.x, p.y);
    if (hit != null && (editor.tool === 'text' || editor.activeText === hit)) {
      editor.activeText = hit;
      dragText = { index: hit, grabX: p.x - editor.ops[hit].x, grabY: p.y - editor.ops[hit].y, moved: false };
      renderEditorUi();
      redrawEditor();
      return;
    }

    // Text tool on empty space: ask for the words.
    if (editor.tool === 'text' && hit == null) {
      editor.activeText = null;
      promptForText();
      return;
    }

    drawing = true;
    current = { kind: 'stroke', tool: editor.tool, color: editor.color, width: editor.width, points: [p] };
    editor.ops.push(current);
    editor.redo = [];
    redrawEditor();
  };

  const move = (e) => {
    // Two-finger resize
    if (pinchText && e.touches && e.touches.length === 2) {
      e.preventDefault();
      const op = editor.ops[pinchText.index];
      if (op) {
        const factor = dist(e.touches[0], e.touches[1]) / pinchText.startDist;
        op.size = Math.max(24, Math.min(400, pinchText.startSize * factor));
        redrawEditor();
      }
      return;
    }

    // One-finger move
    if (dragText) {
      e.preventDefault();
      const p = pos(e);
      const op = editor.ops[dragText.index];
      if (op) {
        op.x = Math.min(0.98, Math.max(0.02, p.x - dragText.grabX));
        op.y = Math.min(0.98, Math.max(0.02, p.y - dragText.grabY));
        dragText.moved = true;
        redrawEditor();
      }
      return;
    }

    if (!drawing || !current) return;
    e.preventDefault();
    const p = pos(e);
    const last = current.points[current.points.length - 1];
    // Skip points that are practically on top of each other.
    if (Math.abs(p.x - last.x) < 0.002 && Math.abs(p.y - last.y) < 0.002) return;
    current.points.push(p);
    redrawEditor();
  };

  const end = () => {
    if (pinchText) { pinchText = null; updateEditorButtons(); return; }
    if (dragText) {
      // A tap without moving opens it for editing.
      if (!dragText.moved) promptForText(dragText.index);
      dragText = null;
      updateEditorButtons();
      return;
    }
    if (!drawing) return;
    drawing = false;
    current = null;
    updateEditorButtons();
  };

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end, { passive: true });
  canvas.addEventListener('touchcancel', end, { passive: true });
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
}

function undoEditor() {
  if (!editor.ops.length) return;
  editor.redo.push(editor.ops.pop());
  redrawEditor();
  updateEditorButtons();
}

function redoEditor() {
  if (!editor.redo.length) return;
  editor.ops.push(editor.redo.pop());
  redrawEditor();
  updateEditorButtons();
}

async function finishEditor() {
  const canvas = editor.canvas || document.getElementById('editorCanvas');
  if (!canvas) return;

  // Render once more at a good size for saving.
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  const cb = editor.onDone;
  const meta = editor.storyMeta;
  closeEditor();
  if (cb) await cb(dataUrl, meta);
}



// ===============================================================
// APP LOCK (v2.5)
//
// Face ID via a passkey. If Face ID fails or isn't set up, iOS falls
// back to the device passcode by itself — that part is the system's
// job, not ours. A PIN you choose is kept as a last resort for when
// passkeys aren't available at all.
//
// This locks the screen on this device. It is not a server login:
// someone who knows the address and opens the developer tools can
// still reach the data. That's the next step, when you want it.
// ===============================================================

const LOCK_GRACE_MS = 2 * 60 * 1000;   // 2 minutes away before it re-locks
const PIN_MAX_TRIES = 5;

function lockEnabled() {
  return lsGet('lock:on') === '1';
}

function passkeySupported() {
  return typeof window.PublicKeyCredential !== 'undefined'
    && !!(navigator.credentials && navigator.credentials.create);
}

function b64url(buf) {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '='.repeat((4 - s.length % 4) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomBytes(n) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return a;
}

async function hashPin(pin, salt) {
  const data = new TextEncoder().encode(salt + ':' + pin);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return b64url(digest);
}

// ---- setting it up ----
async function createPasskey() {
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge: randomBytes(32),
      rp: { name: 'ivolina', id: window.location.hostname },
      user: {
        id: new TextEncoder().encode('ivolina-' + state.user),
        name: state.user,
        displayName: state.profile[state.user]?.name || state.user,
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',   // Face ID / Touch ID on this device
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    },
  });
  if (!cred) throw new Error('no credential');
  lsSet('lock:credId', b64url(cred.rawId));
  return true;
}

async function verifyPasskey() {
  const stored = lsGet('lock:credId');
  const opts = {
    challenge: randomBytes(32),
    rpId: window.location.hostname,
    userVerification: 'required',
    timeout: 60000,
  };
  if (stored) opts.allowCredentials = [{ type: 'public-key', id: fromB64url(stored) }];
  const assertion = await navigator.credentials.get({ publicKey: opts });
  return !!assertion;
}

function markUnlocked() {
  lsSet('lock:lastOk', String(Date.now()));
}

function withinGrace() {
  const last = parseInt(lsGet('lock:lastOk') || '0', 10);
  return last > 0 && (Date.now() - last) < LOCK_GRACE_MS;
}

// ---- the lock screen ----
function showLockScreen() {
  const el = document.getElementById('lockScreen');
  if (!el) return;
  const hasPasskey = !!lsGet('lock:credId');
  const name = state.profile[state.user]?.name || '';

  el.innerHTML = `
    <div class="lock-inner">
      <div class="lock-mark"><span>ivolina</span></div>
      <div class="lock-name">${escapeHtml(name)}</div>
      <div class="lock-msg" id="lockMsg">locked</div>

      ${hasPasskey ? '<button class="btn btn-primary lock-btn" id="lockFace">unlock with Face ID</button>' : ''}
      <button class="btn btn-ghost lock-btn" id="lockUsePin">use PIN</button>

      <div class="lock-pin" id="lockPinArea" style="display:none;">
        <div class="pin-dots" id="pinDots"></div>
        <div class="pin-pad" id="pinPad"></div>
      </div>
    </div>
  `;
  el.classList.add('active');

  const face = document.getElementById('lockFace');
  if (face) face.onclick = attemptPasskeyUnlock;
  document.getElementById('lockUsePin').onclick = showPinPad;

  // Offer Face ID straight away — one tap less.
  if (hasPasskey) setTimeout(attemptPasskeyUnlock, 350);
  else showPinPad();
}

function hideLockScreen() {
  const el = document.getElementById('lockScreen');
  if (!el) return;
  el.classList.remove('active');
  el.innerHTML = '';
}

async function attemptPasskeyUnlock() {
  const msg = document.getElementById('lockMsg');
  if (msg) msg.textContent = 'waiting for Face ID…';
  try {
    const ok = await verifyPasskey();
    if (ok) {
      markUnlocked();
      hideLockScreen();
      return;
    }
    if (msg) msg.textContent = 'that didn\u2019t work \u2014 try your PIN';
  } catch (e) {
    console.warn('passkey unlock', e && e.name);
    if (msg) {
      msg.textContent = e && e.name === 'NotAllowedError'
        ? 'cancelled \u2014 try again or use your PIN'
        : 'Face ID unavailable \u2014 use your PIN';
    }
    showPinPad();
  }
}

let pinBuffer = '';

function showPinPad() {
  const area = document.getElementById('lockPinArea');
  if (!area) return;
  area.style.display = 'block';
  pinBuffer = '';
  renderPinDots();

  const pad = document.getElementById('pinPad');
  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];
  pad.innerHTML = keys.map(k =>
    k === '' ? '<div></div>'
      : `<button class="pin-key" data-key="${k}">${k === 'del' ? '\u232B' : k}</button>`
  ).join('');
  pad.querySelectorAll('[data-key]').forEach(b => {
    b.onclick = () => pressPin(b.dataset.key);
  });
}

function renderPinDots() {
  const dots = document.getElementById('pinDots');
  if (!dots) return;
  const len = parseInt(lsGet('lock:pinLen') || '4', 10);
  dots.innerHTML = Array.from({ length: len }, (_, i) =>
    `<span class="pin-dot ${i < pinBuffer.length ? 'on' : ''}"></span>`
  ).join('');
}

async function pressPin(key) {
  const len = parseInt(lsGet('lock:pinLen') || '4', 10);
  if (key === 'del') {
    pinBuffer = pinBuffer.slice(0, -1);
    renderPinDots();
    return;
  }
  if (pinBuffer.length >= len) return;
  pinBuffer += key;
  renderPinDots();
  if (navigator.vibrate) navigator.vibrate(8);

  if (pinBuffer.length === len) {
    const salt = lsGet('lock:pinSalt') || '';
    const hash = await hashPin(pinBuffer, salt);
    const msg = document.getElementById('lockMsg');

    if (hash === lsGet('lock:pinHash')) {
      lsSet('lock:tries', '0');
      markUnlocked();
      hideLockScreen();
      return;
    }

    const tries = parseInt(lsGet('lock:tries') || '0', 10) + 1;
    lsSet('lock:tries', String(tries));
    pinBuffer = '';
    renderPinDots();

    const dotsEl = document.getElementById('pinDots');
    if (dotsEl) {
      dotsEl.style.animation = 'none';
      void dotsEl.offsetWidth;
      dotsEl.style.animation = 'shake 0.35s';
    }
    if (navigator.vibrate) navigator.vibrate([30, 60, 30]);

    if (tries >= PIN_MAX_TRIES) {
      // Not a device wipe — just a pause, so guessing gets slow.
      if (msg) msg.textContent = 'too many tries \u2014 wait a moment';
      const pad = document.getElementById('pinPad');
      if (pad) pad.style.pointerEvents = 'none';
      setTimeout(() => {
        lsSet('lock:tries', '0');
        if (pad) pad.style.pointerEvents = '';
        if (msg) msg.textContent = 'try again';
      }, 30000);
    } else if (msg) {
      msg.textContent = `wrong PIN \u2014 ${PIN_MAX_TRIES - tries} left`;
    }
  }
}

// ---- turning it on and off, from settings ----
async function openLockSettings() {
  const on = lockEnabled();
  const hasPasskey = !!lsGet('lock:credId');

  if (on) {
    showModal(`
      <div class="modal-handle"></div>
      <h2>app lock is on</h2>
      <p style="text-align:left; line-height:1.6;">
        ivolina asks for ${hasPasskey ? 'Face ID' : 'your PIN'} when you open it, and again
        if you\u2019ve been away for more than two minutes.
      </p>
      ${hasPasskey ? '' : '<button class="btn btn-ghost" id="lockAddFace">add Face ID</button>'}
      <button class="btn btn-ghost" id="lockChangePin">change PIN</button>
      <button class="btn btn-danger" id="lockOff">turn off on this phone</button>
      <button class="btn btn-ghost" id="lockCancel">close</button>
    `);
    const addFace = document.getElementById('lockAddFace');
    if (addFace) addFace.onclick = async () => {
      try {
        await createPasskey();
        toast('Face ID added');
        closeModal();
        renderSettings();
      } catch (e) {
        console.warn(e);
        toast('could not set up Face ID here');
      }
    };
    document.getElementById('lockChangePin').onclick = () => askForNewPin(false);
    document.getElementById('lockOff').onclick = () => {
      showConfirm('turn off the lock?', 'anyone with your phone could open ivolina.', () => {
        lsSet('lock:on', '');
        lsSet('lock:credId', '');
        lsSet('lock:pinHash', '');
        lsSet('lock:pinSalt', '');
        renderSettings();
        toast('app lock is off');
      });
    };
    document.getElementById('lockCancel').onclick = closeModal;
    return;
  }

  showModal(`
    <div class="modal-handle"></div>
    <h2>lock ivolina</h2>
    <p style="text-align:left; line-height:1.6;">
      Ask for Face ID when the app opens. If Face ID fails, your iPhone offers
      its own passcode. You\u2019ll also set a PIN as a fallback.
      <br><br>
      This is set up per phone, so do it on hers too.
    </p>
    <button class="btn btn-primary" id="lockStart">set it up</button>
    <button class="btn btn-ghost" id="lockCancel">not now</button>
  `);
  document.getElementById('lockStart').onclick = () => askForNewPin(true);
  document.getElementById('lockCancel').onclick = closeModal;
}

function askForNewPin(thenPasskey) {
  showModal(`
    <div class="modal-handle"></div>
    <h2>choose a PIN</h2>
    <p>four to six digits, used if Face ID can\u2019t be</p>
    <input type="password" inputmode="numeric" pattern="[0-9]*" id="pinNew" class="input" placeholder="new PIN" maxlength="6">
    <input type="password" inputmode="numeric" pattern="[0-9]*" id="pinNew2" class="input" placeholder="repeat it" maxlength="6">
    <button class="btn btn-primary" id="pinSave">save</button>
    <button class="btn btn-ghost" id="pinCancel">cancel</button>
  `);
  setTimeout(() => document.getElementById('pinNew')?.focus(), 120);

  document.getElementById('pinSave').onclick = async () => {
    const a = document.getElementById('pinNew').value.trim();
    const b = document.getElementById('pinNew2').value.trim();
    if (!/^[0-9]{4,6}$/.test(a)) { toast('four to six digits please'); return; }
    if (a !== b) { toast('the two do not match'); return; }

    const salt = b64url(randomBytes(16));
    lsSet('lock:pinSalt', salt);
    lsSet('lock:pinHash', await hashPin(a, salt));
    lsSet('lock:pinLen', String(a.length));
    lsSet('lock:on', '1');
    lsSet('lock:tries', '0');
    markUnlocked();

    if (!thenPasskey) {
      closeModal();
      renderSettings();
      toast('PIN updated');
      return;
    }

    if (!passkeySupported()) {
      closeModal();
      renderSettings();
      toast('lock is on \u2014 Face ID is not available here');
      return;
    }

    showModal(`
      <div class="modal-handle"></div>
      <h2>add Face ID</h2>
      <p style="text-align:left; line-height:1.6;">
        Your iPhone will ask to confirm. After this, opening ivolina just needs a look.
      </p>
      <button class="btn btn-primary" id="faceGo">turn on Face ID</button>
      <button class="btn btn-ghost" id="faceSkip">PIN only for now</button>
    `);
    document.getElementById('faceGo').onclick = async () => {
      try {
        await createPasskey();
        markUnlocked();
        closeModal();
        renderSettings();
        toast('app lock is on');
      } catch (e) {
        console.warn('passkey setup', e && e.name);
        closeModal();
        renderSettings();
        toast('lock is on with your PIN \u2014 Face ID did not set up');
      }
    };
    document.getElementById('faceSkip').onclick = () => {
      closeModal();
      renderSettings();
      toast('app lock is on');
    };
  };
  document.getElementById('pinCancel').onclick = closeModal;
}

// ---- re-lock after being away ----
function startLockWatcher() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      lsSet('lock:hiddenAt', String(Date.now()));
      return;
    }
    if (!lockEnabled() || !state.user) return;
    const hiddenAt = parseInt(lsGet('lock:hiddenAt') || '0', 10);
    if (hiddenAt && Date.now() - hiddenAt >= LOCK_GRACE_MS) {
      showLockScreen();
    } else {
      markUnlocked();
    }
  });
}

function maybeLockOnStart() {
  if (!lockEnabled() || !state.user) return false;
  if (withinGrace()) return false;
  showLockScreen();
  return true;
}



// ===============================================================
// LIGHT / DARK (v2.6)
// Follows the iPhone unless you've chosen otherwise in settings.
// ===============================================================
function themePreference() {
  const t = lsGet('theme');
  return (t === 'light' || t === 'dark') ? t : 'auto';
}

function systemPrefersLight() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
}

function resolvedTheme() {
  const pref = themePreference();
  if (pref === 'auto') return systemPrefersLight() ? 'light' : 'dark';
  return pref;
}

function applyTheme() {
  const theme = resolvedTheme();
  document.documentElement.setAttribute('data-theme', theme);
  // Colour the status bar to match, so the notch doesn't sit on a seam.
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  // The bar behind the clock should be part of the aurora, not a flat
  // slab above it. These are the background with the top of the gradient
  // blended in, so the seam disappears.
  meta.content = theme === 'light' ? '#D5E1F6' : '#3E4A5D';
}

function watchSystemTheme() {
  if (!window.matchMedia) return;
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const onChange = () => { if (themePreference() === 'auto') applyTheme(); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
}

function openThemeSettings() {
  const pref = themePreference();
  const row = (id, label, sub) => `
    <button class="theme-choice ${pref === id ? 'active' : ''}" data-theme-choice="${id}">
      <span class="theme-choice-label">${label}</span>
      <span class="theme-choice-sub">${sub}</span>
      <span class="theme-check">${pref === id ? '✓' : ''}</span>
    </button>`;
  showModal(`
    <div class="modal-handle"></div>
    <h2>appearance</h2>
    <p>dark suits the evenings, but it's your call</p>
    ${row('auto', 'match my iPhone', systemPrefersLight() ? 'light right now' : 'dark right now')}
    ${row('dark', 'always dark', 'the way it was')}
    ${row('light', 'always light', 'same colours, deeper')}
    <button class="btn btn-ghost" id="themeClose" style="margin-top:10px;">close</button>
  `);
  document.querySelectorAll('[data-theme-choice]').forEach(b => {
    b.onclick = () => {
      lsSet('theme', b.dataset.themeChoice === 'auto' ? '' : b.dataset.themeChoice);
      applyTheme();
      openThemeSettings();
      renderSettings();
    };
  });
  document.getElementById('themeClose').onclick = closeModal;
}


// ===============================================================
// WHAT'S NEW (v2.6)
// Shown once after an update, then never again until the next one.
// Add the newest release at the top; older entries can stay.
// ===============================================================
const APP_VERSION = '2.8.1';

const RELEASE_NOTES = {
  '2.8.1': {
    title: 'Somewhere to keep things',
    lines: [
      'A private place for photos and videos — originals, untouched',
      'Save anything back to your phone in the quality you put in',
      'Keep a story before its 24 hours are up',
      'Swiping back now shows the screen you are returning to',
    ],
  },
  '2.7': {
    title: 'It moves now',
    lines: [
      'Tapping a card grows it into the screen it opens',
      'The seconds roll over instead of blinking',
      'More colour — the blue and pink carry the whole screen',
      'A third, violet note where the two meet',
    ],
  },
  '2.6.3': {
    title: 'A new look',
    lines: [
      'Light and dark — ivolina now follows your iPhone, or you can pick one in settings',
      'The iOS typeface throughout, so it reads like the rest of your phone',
      'Questions carry the colour of whoever asked them',
      'A small dot marks anything still waiting for you',
      'Swipe from the left edge to go back',
      'Camera photos for stories are framed 9:16',
    ],
  },
  '2.5': {
    title: 'Locked and dated',
    lines: [
      'Face ID when you open ivolina, with your passcode and a PIN behind it',
      'Together since 27 July 2026 — with the day you first spoke kept alongside',
    ],
  },
};

function showReleaseNotesIfNew() {
  const seen = lsGet('seenVersion');
  if (seen === APP_VERSION) return false;

  // Never take the screen away from something already open — a dialog,
  // the editor, a story. The notes can wait until the next quiet moment.
  if (document.getElementById('modalBackdrop')?.classList.contains('active')) return false;
  if (document.getElementById('editorOverlay')?.classList.contains('active')) return false;
  if (document.getElementById('storyViewer')?.classList.contains('active')) return false;
  if (document.getElementById('lockScreen')?.classList.contains('active')) return false;

  const note = RELEASE_NOTES[APP_VERSION];
  if (!note) {
    lsSet('seenVersion', APP_VERSION);
    return false;
  }

  // A genuinely fresh install means: never logged in here before.
  // Someone who has been using ivolina and simply predates this marker
  // has updated, and should see what changed.
  const brandNew = !seen && !lsGet('session');
  if (brandNew) {
    lsSet('seenVersion', APP_VERSION);
    return false;
  }

  showModal(`
    <div class="modal-handle"></div>
    <div class="whats-new-tag">what's new · ${APP_VERSION}</div>
    <h2>${escapeHtml(note.title)}</h2>
    <ul class="whats-new-list">
      ${note.lines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}
    </ul>
    <button class="btn btn-primary" id="notesOk">got it</button>
  `);
  document.getElementById('notesOk').onclick = () => {
    lsSet('seenVersion', APP_VERSION);
    closeModal();
  };
  return true;
}


// ===============================================================
// THE VAULT (v2.8)
//
// A private place for photos and videos. Reached by tapping
// "still to come" three times quickly — not a secret, just out of
// the way.
//
// Two things make it different from the rest of the app:
//  * the bucket is private, so files have no public address; the
//    app asks for a signed link each time and that link expires
//  * originals are stored untouched, so what you take out is
//    exactly what you put in
// ===============================================================
const VAULT_BUCKET = 'vault';
const SIGNED_URL_TTL = 60 * 60;          // an hour is plenty for one session
const VAULT_WARN_BYTES = 700 * 1024 * 1024;  // Supabase's free tier gives 1 GB

const vault = {
  items: [],
  loaded: false,
  signed: new Map(),   // path -> { url, expires }
  selected: null,
};

async function loadVault() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('vault_items')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('loadVault', error); return; }
  vault.items = data || [];
  vault.loaded = true;
}

// Signed links are cached until shortly before they lapse, so scrolling
// the gallery doesn't ask for a new one on every thumbnail.
async function signedUrl(path) {
  if (!supabase || !path) return null;
  const cached = vault.signed.get(path);
  if (cached && cached.expires > Date.now() + 60000) return cached.url;

  const { data, error } = await supabase.storage
    .from(VAULT_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error || !data) { console.error('signedUrl', error); return null; }

  vault.signed.set(path, { url: data.signedUrl, expires: Date.now() + SIGNED_URL_TTL * 1000 });
  return data.signedUrl;
}

function vaultTotalBytes() {
  return vault.items.reduce((sum, i) => sum + (i.size_bytes || 0), 0);
}

function formatBytes(n) {
  if (!n) return '0 MB';
  if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / 1048576).toFixed(1) + ' MB';
  return (n / 1073741824).toFixed(2) + ' GB';
}

// ---------------------------------------------------------------
// Getting in: three taps on "still to come" inside a second.
// ---------------------------------------------------------------
let vaultTaps = [];

function registerVaultTap() {
  const now = Date.now();
  vaultTaps = vaultTaps.filter(t => now - t < 1000);
  vaultTaps.push(now);
  if (vaultTaps.length >= 3) {
    vaultTaps = [];
    return true;
  }
  return false;
}

async function openVault() {
  // If the app is locked at all, the vault asks again.
  if (lockEnabled()) {
    const ok = await confirmIdentityForVault();
    if (!ok) return;
  }
  closeModal();
  if (!vault.loaded) await loadVault();
  showScreen('vault');
}

function confirmIdentityForVault() {
  return new Promise((resolve) => {
    const hasPasskey = !!lsGet('lock:credId');
    showModal(`
      <div class="modal-handle"></div>
      <h2>just checking</h2>
      <p>this one is private</p>
      ${hasPasskey ? '<button class="btn btn-primary" id="vaultFace">Face ID</button>' : ''}
      <input type="password" inputmode="numeric" pattern="[0-9]*" id="vaultPin" class="input" placeholder="PIN" maxlength="6">
      <button class="btn btn-ghost" id="vaultPinGo">unlock</button>
      <button class="btn btn-ghost" id="vaultCancel">cancel</button>
    `);

    const done = (v) => { resolve(v); };
    const face = document.getElementById('vaultFace');
    if (face) face.onclick = async () => {
      try {
        if (await verifyPasskey()) { markUnlocked(); done(true); }
        else toast('that did not work');
      } catch { toast('use your PIN instead'); }
    };
    document.getElementById('vaultPinGo').onclick = async () => {
      const pin = document.getElementById('vaultPin').value.trim();
      const salt = lsGet('lock:pinSalt') || '';
      if (pin && await hashPin(pin, salt) === lsGet('lock:pinHash')) { markUnlocked(); done(true); }
      else toast('wrong PIN');
    };
    document.getElementById('vaultCancel').onclick = () => { closeModal(); done(false); };
  });
}

// ---------------------------------------------------------------
// The gallery
// ---------------------------------------------------------------
function renderVault() {
  const grid = document.getElementById('vaultGrid');
  const meta = document.getElementById('vaultMeta');
  if (!grid) return;

  const total = vaultTotalBytes();
  if (meta) {
    meta.textContent = vault.items.length
      ? `${vault.items.length} ${vault.items.length === 1 ? 'item' : 'items'} · ${formatBytes(total)}`
      : '';
    meta.classList.toggle('vault-meta-warn', total > VAULT_WARN_BYTES);
  }

  if (!vault.items.length) {
    grid.innerHTML = `<div class="empty" style="grid-column: 1/-1;">
      <div class="empty-icon">✦</div>
      <div class="empty-text">nothing kept here yet</div>
    </div>`;
    return;
  }

  grid.innerHTML = vault.items.map(item => `
    <div class="vault-tile" data-vault="${item.id}">
      <img data-thumb="${escapeHtml(item.thumb_path || item.path)}" alt="">
      ${item.kind === 'video' ? '<span class="vault-badge">▶</span>' : ''}
      ${item.source === 'story' ? '<span class="vault-origin">story</span>' : ''}
    </div>
  `).join('');

  grid.querySelectorAll('[data-vault]').forEach(el => {
    el.onclick = () => openVaultItem(el.dataset.vault);
  });

  // Fill the thumbnails in as their links come back.
  grid.querySelectorAll('[data-thumb]').forEach(async (img) => {
    const url = await signedUrl(img.dataset.thumb);
    if (url) img.src = url;
  });
}

async function openVaultItem(id) {
  const item = vault.items.find(i => i.id === id);
  if (!item) return;
  vault.selected = item;

  const when = new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const who = state.profile[item.owner]?.name || item.owner;

  // Show the light preview first. Loading a full-size original — or worse,
  // a whole video — straight into the page can use enough memory that iOS
  // shuts the app down and reopens it on a stale cached page. So the
  // original is only fetched when it is actually asked for.
  const previewUrl = await signedUrl(item.thumb_path || item.path);

  showModal(`
    <div class="modal-handle"></div>
    <div class="vault-preview" id="vaultPreview">
      ${item.kind === 'video'
        ? `<div class="vault-video-holder" id="vaultVideoHolder">
             <img src="${previewUrl || ''}" alt="">
             <button class="vault-play" id="vaultPlay">▶</button>
           </div>`
        : `<img src="${previewUrl || ''}" alt="" id="vaultImg">`}
    </div>
    <p style="margin-bottom:14px;">${escapeHtml(who)} · ${when} · ${formatBytes(item.size_bytes)}${item.width ? ` · ${item.width}×${item.height}` : ''}</p>
    ${item.kind === 'image' ? '<button class="btn btn-ghost" id="vaultFull">view full size</button>' : ''}
    <button class="vault-save-hidden" id="vaultSave" aria-label="save"></button>
    <button class="btn btn-danger" id="vaultDelete">delete from the vault</button>
    <button class="btn btn-ghost" id="vaultClose">close</button>
  `);

  // Play a video only when asked, and never preload it.
  const play = document.getElementById('vaultPlay');
  if (play) play.onclick = async () => {
    const holder = document.getElementById('vaultVideoHolder');
    const url = await signedUrl(item.path);
    if (!url || !holder) return;
    holder.innerHTML = `<video src="${url}" controls playsinline preload="none" autoplay></video>`;
  };

  const full = document.getElementById('vaultFull');
  if (full) full.onclick = async () => {
    const url = await signedUrl(item.path);
    const img = document.getElementById('vaultImg');
    if (url && img) {
      full.disabled = true;
      full.textContent = 'loading…';
      img.onload = () => { full.textContent = 'full size'; };
      img.src = url;
    }
  };

  // The save button is deliberately invisible: two taps within a second.
  const save = document.getElementById('vaultSave');
  if (save) attachDoubleTapSave(save, item);

  document.getElementById('vaultDelete').onclick = () => deleteVaultItem(item);
  document.getElementById('vaultClose').onclick = closeModal;
}

// Invisible, and only responds to a quick double tap — so nothing is
// saved to the phone by brushing past it.
function attachDoubleTapSave(el, item, onSave) {
  let last = 0;
  const fire = (e) => {
    if (e) e.preventDefault();
    const now = Date.now();
    if (now - last < 1000 && last !== 0) {
      last = 0;
      (onSave || saveVaultItemToPhone)(item, el);
    } else {
      last = now;
      // A single tap gives the faintest acknowledgement, nothing more.
      el.classList.add('armed');
      setTimeout(() => el.classList.remove('armed'), 1000);
    }
  };
  el.addEventListener('click', fire);
  el.addEventListener('dblclick', (e) => { e.preventDefault(); last = 0; (onSave || saveVaultItemToPhone)(item, el); });
}

// On an iPhone the share sheet is the reliable way into Photos.
// A plain download link is the fallback everywhere else.
async function saveVaultItemToPhone(item, btn) {
  if (btn) btn.classList.add('working');
  try {
    const url = await signedUrl(item.path);
    const res = await fetch(url);
    const blob = await res.blob();
    const name = item.file_name || `ivolina-${item.id}.${(item.mime || 'image/jpeg').split('/')[1]}`;
    const file = new File([blob], name, { type: item.mime || blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
      if (btn) btn.classList.remove('working');
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
    toast('saved');
  } catch (e) {
    if (e && e.name === 'AbortError') {
      // They closed the share sheet. Nothing went wrong.
    } else {
      console.error('saveVaultItemToPhone', e);
      toast('could not prepare the file');
    }
  } finally {
    if (btn) btn.classList.remove('working');
  }
}

function deleteVaultItem(item) {
  showConfirm('delete this?', 'it is removed for good, for both of you.', async () => {
    if (!supabase) return;
    const paths = [item.path];
    if (item.thumb_path && item.thumb_path !== item.path) paths.push(item.thumb_path);
    await supabase.storage.from(VAULT_BUCKET).remove(paths);
    await supabase.from('vault_items').delete().eq('id', item.id);
    vault.items = vault.items.filter(i => i.id !== item.id);
    paths.forEach(p => vault.signed.delete(p));
    closeModal();
    renderVault();
    toast('deleted');
  });
}

// ---------------------------------------------------------------
// Putting things in — originals, untouched
// ---------------------------------------------------------------
async function handleVaultUpload(e) {
  const files = [...(e.target.files || [])];
  e.target.value = '';
  if (!files.length) return;

  const bar = document.getElementById('vaultProgress');
  let done = 0;
  const show = (msg) => { if (bar) { bar.textContent = msg; bar.classList.add('show'); } };
  show(`0 / ${files.length}`);

  for (const file of files) {
    try {
      await addToVault(file, 'upload');
    } catch (err) {
      console.error('vault upload', err);
      toast(`could not add ${file.name}`);
    }
    done++;
    show(`${done} / ${files.length}`);
  }

  if (bar) setTimeout(() => bar.classList.remove('show'), 1200);
  await loadVault();
  renderVault();
  toast(files.length === 1 ? 'kept' : `${files.length} kept`);
}

async function addToVault(file, source = 'upload', extra = {}) {
  if (!supabase) return null;

  const isVideo = (file.type || '').startsWith('video/');
  const id = 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const ext = (file.name && file.name.includes('.'))
    ? file.name.split('.').pop().toLowerCase()
    : ((file.type || 'image/jpeg').split('/')[1] || 'jpg');
  const path = `originals/${id}.${ext}`;

  // The original goes up exactly as it is — no resizing, no re-encoding.
  const { error: upErr } = await supabase.storage
    .from(VAULT_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (upErr) throw upErr;

  // A small preview so the gallery doesn't have to load originals.
  let thumbPath = null;
  let dims = { width: extra.width || null, height: extra.height || null };
  if (!isVideo) {
    try {
      const thumbUrl = await resizeImageToDataUrl(file, 500, 0.72);
      const d = await imageDimensions(thumbUrl);
      const full = await imageDimensions(await fileToDataUrl(file));
      dims = { width: full.width, height: full.height };
      const thumbBlob = await (await fetch(thumbUrl)).blob();
      thumbPath = `thumbs/${id}.jpg`;
      await supabase.storage.from(VAULT_BUCKET)
        .upload(thumbPath, thumbBlob, { contentType: 'image/jpeg', upsert: false });
    } catch (e) {
      console.warn('thumbnail failed, using the original', e);
      thumbPath = null;
    }
  }

  const { error } = await supabase.from('vault_items').insert({
    id,
    owner: state.user,
    path,
    thumb_path: thumbPath,
    kind: isVideo ? 'video' : 'image',
    file_name: file.name || null,
    mime: file.type || null,
    size_bytes: file.size || null,
    width: dims.width,
    height: dims.height,
    source,
  });
  if (error) throw error;
  return id;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------
// Keeping a story before it expires
// ---------------------------------------------------------------
async function keepStoryInVault(story) {
  const btn = document.getElementById('storyKeep');
  if (btn) { btn.disabled = true; btn.textContent = 'keeping…'; }
  try {
    const res = await fetch(story.url);
    const blob = await res.blob();
    const ext = story.media_type === 'video' ? 'mp4' : 'jpg';
    const file = new File([blob], `story-${story.id}.${ext}`, { type: blob.type });
    await addToVault(file, 'story', { width: story.width, height: story.height });
    await loadVault();
    if (btn) { btn.textContent = '✓ kept'; }
    toast('kept in the vault');
  } catch (e) {
    console.error('keepStoryInVault', e);
    toast('could not keep it');
    if (btn) { btn.disabled = false; btn.textContent = 'keep this'; }
  }
}


// ----- SETTINGS -----
function renderSettings() {
  const me = state.user;
  const p = state.profile[me];
  const avatarEl = document.getElementById('settingsAvatar');
  if (p?.avatar) avatarEl.innerHTML = `<img src="${p.avatar}">`;
  else avatarEl.textContent = me === 'ivo' ? 'I' : 'N';
  document.getElementById('settingsNameValue').textContent = p?.name || '—';
  document.getElementById('settingsUserValue').textContent = me === 'ivo' ? 'Ivo (blue)' : 'Nikolina (pink)';

  const nver = document.getElementById('notesVersion');
  if (nver) nver.textContent = 'v' + APP_VERSION + ' ›';

  const tv = document.getElementById('themeValue');
  if (tv) {
    const pref = themePreference();
    tv.textContent = (pref === 'auto' ? 'match iPhone' : pref) + ' ›';
  }

  const lv = document.getElementById('lockValue');
  if (lv) {
    lv.textContent = lockEnabled()
      ? (lsGet('lock:credId') ? 'Face ID + PIN ›' : 'PIN ›')
      : 'off ›';
  }

  const nv = document.getElementById('notifyValue');
  if (nv) {
    notificationStatus().then(st => {
      nv.textContent = {
        on: 'on ›',
        off: 'off ›',
        blocked: 'blocked in settings',
        unsupported: 'not available here',
      }[st] || '—';
    });
  }
}

function changeName() {
  const cur = state.profile[state.user]?.name || '';
  showModal(`
    <div class="modal-handle"></div>
    <h2>display name</h2>
    <input type="text" id="newName" class="input" value="${escapeHtml(cur)}" placeholder="your name">
    <button class="btn btn-primary" id="nameSave">save</button>
    <button class="btn btn-ghost" id="nameCancel">cancel</button>
  `);
  document.getElementById('nameSave').onclick = saveName;
  document.getElementById('nameCancel').onclick = closeModal;
  setTimeout(() => document.getElementById('newName').focus(), 100);
}

async function saveName() {
  const newName = document.getElementById('newName').value.trim();
  if (!newName) { toast('name cannot be empty'); return; }
  state.profile[state.user] = { ...(state.profile[state.user] || {}), name: newName };
  await dbSet(`profile:${state.user}`, JSON.stringify(state.profile[state.user]));
  closeModal();
  renderSettings();
  toast('name updated');
}

async function handleSettingsAvatar(e) {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const resized = await resizeImageToDataUrl(f, 600, 0.85);
    const url = await uploadImage(resized, 'avatars');
    const stored = url || resized;
    state.profile[state.user] = { ...(state.profile[state.user] || {}), avatar: stored };
    await dbSet(`profile:${state.user}`, JSON.stringify(state.profile[state.user]));
    renderSettings();
    toast('photo updated');
  } catch (err) {
    console.error(err);
    toast('could not update photo');
  }
}

// ----- MODAL / TOAST -----
// closeModal() clears the content on a 300ms delay so the slide-out
// animation can finish. If a new modal opens before that timer fires,
// the old timer would wipe the NEW modal's content and leave you with a
// blurred, empty overlay. So every open cancels any pending clear.
let modalClearTimer = null;

function showModal(html) {
  const bd = document.getElementById('modalBackdrop');
  clearTimeout(modalClearTimer);
  modalClearTimer = null;
  bd.innerHTML = `<div class="modal">${html}</div>`;
  bd.classList.add('active');
  bd.onclick = (e) => { if (e.target === bd) closeModal(); };
}
function closeModal() {
  const bd = document.getElementById('modalBackdrop');
  bd.classList.remove('active');
  clearTimeout(modalClearTimer);
  modalClearTimer = setTimeout(() => {
    // Only clear if nothing re-opened in the meantime.
    if (!bd.classList.contains('active')) bd.innerHTML = '';
    modalClearTimer = null;
  }, 300);
}
function showConfirm(title, msg, onYes) {
  showModal(`
    <div class="modal-handle"></div>
    <h2>${escapeHtml(title)}</h2>
    ${msg ? `<p>${escapeHtml(msg)}</p>` : '<p></p>'}
    <button class="btn btn-danger" id="confirmYes">yes, continue</button>
    <button class="btn btn-ghost" id="confirmNo">cancel</button>
  `);
  document.getElementById('confirmYes').onclick = async () => { closeModal(); await onYes(); };
  document.getElementById('confirmNo').onclick = closeModal;
}

let toastTimeout;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2400);

  // Belt and braces: a tap dismisses it, and if it is somehow still
  // showing well past its time, take it down anyway.
  t.style.pointerEvents = 'auto';
  t.onclick = () => { clearTimeout(toastTimeout); t.classList.remove('show'); };
  setTimeout(() => {
    if (t.classList.contains('show') && t.textContent === msg) t.classList.remove('show');
  }, 6000);
}

// ----- REALTIME -----
function setupRealtime() {
  if (!supabase) return;
  supabase.channel('ivolina-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'kv' },        () => reloadFromDb())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => reloadFromDb())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' },   () => reloadFromDb())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'drawings' },  () => reloadFromDb())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' },   () => reloadFromDb())
    .subscribe();
}

// True while a text field has focus. Used to make sure a change coming in
// from the other phone never wipes what you are in the middle of writing.
function isComposing() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'TEXTAREA' || tag === 'INPUT';
}

let pendingReload = false;

async function reloadFromDb() {
  if (!state.user) return;

  // Data still gets refreshed in the background — we just don't rebuild the
  // screen under your fingers. The redraw happens as soon as you're done.
  // Don't rebuild a story that's currently being watched — but do let a
  // like land, so you see her heart appear on your own story right away.
  if (document.getElementById('storyViewer')?.classList.contains('active')) {
    const before = state.stories.map(s => s.id + ':' + (s.liked_by || '')).join('|');
    await loadAllState();
    const after = state.stories.map(s => s.id + ':' + (s.liked_by || '')).join('|');
    if (before !== after) refreshStoryLikeUi();
    return;
  }

  if (isComposing()) {
    if (!pendingReload) {
      pendingReload = true;
      const onDone = () => {
        pendingReload = false;
        document.removeEventListener('focusout', onDone);
        setTimeout(() => { if (!isComposing()) reloadFromDb(); }, 150);
      };
      document.addEventListener('focusout', onDone);
    }
    await loadAllState();
    return;
  }

  await loadAllState();
  const active = document.querySelector('.screen.active');
  if (!active) return;

  // A refresh triggered by the other phone shouldn't move your page.
  const keepScroll = window.scrollY;

  if (active.id === 'screen-home') renderHome();
  if (active.id === 'screen-memories') renderMemories();
  if (active.id === 'screen-questions') renderQuestions();
  if (active.id === 'screen-questionDetail') renderQuestionDetail();
  if (active.id === 'screen-drawing') renderGallery();
  if (active.id === 'screen-settings') renderSettings();

  if (Math.abs(window.scrollY - keepScroll) > 2) {
    requestAnimationFrame(() => window.scrollTo(0, keepScroll));
  }
}

async function loadAllState() {
  // Profiles, events and coins still live in kv — they are per-key and
  // never written by both of you at the same moment, so they are safe there.
  const keys = ['profile:ivo', 'profile:nikolina', 'events:list', 'coins:ivo', 'coins:nikolina'];
  const kvResults = await Promise.all(keys.map(k => dbGet(k)));
  const [pIvo, pNiki, evs, cIvo, cNiki] = kvResults;
  state.profile.ivo = pIvo ? safeParse(pIvo) : null;
  state.profile.nikolina = pNiki ? safeParse(pNiki) : null;
  state.events = evs ? safeParse(evs) || [...MOCK_EVENTS] : [...MOCK_EVENTS];
  if (!evs) await dbSet('events:list', JSON.stringify(state.events));
  state.coins.ivo = cIvo ? parseInt(cIvo) : 0;
  state.coins.nikolina = cNiki ? parseInt(cNiki) : 0;

  // Questions, answers and drawings now come from their own tables.
  await Promise.all([loadQuestions(), loadDrawings(), loadStories()]);
}

// Build state.questions in the SAME shape the rest of the app already uses:
// { id, text, asker, created, answers: { ivo, nikolina } }
async function loadQuestions() {
  if (!supabase) return;
  const [qRes, aRes] = await Promise.all([
    supabase.from('questions').select('*'),
    supabase.from('answers').select('*'),
  ]);
  if (qRes.error) { console.error('loadQuestions', qRes.error); return; }
  if (aRes.error) { console.error('loadAnswers', aRes.error); return; }

  const answersByQuestion = {};
  (aRes.data || []).forEach(a => {
    if (!answersByQuestion[a.question_id]) answersByQuestion[a.question_id] = {};
    answersByQuestion[a.question_id][a.author] = a.body;
  });

  state.questions = (qRes.data || []).map(q => ({
    id: q.id,
    text: q.text,
    asker: q.asker,
    category: q.category || null,
    created: new Date(q.created_at).getTime(),
    answers: answersByQuestion[q.id] || {},
  }));
}

async function loadDrawings() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('drawings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(60);
  if (error) { console.error('loadDrawings', error); return; }
  state.drawings = (data || []).map(d => ({
    id: d.id,
    author: d.author,
    dataurl: d.url,
    created: new Date(d.created_at).getTime(),
  }));
}
function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }

// ===============================================================
// EVENT WIRING
// ===============================================================
function wireEvents() {
  document.querySelectorAll('[data-who]').forEach(el => {
    el.onclick = () => askPassword(el.dataset.who);
  });
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.onclick = () => showScreen(el.dataset.goto);
  });
  document.getElementById('setupAvatarBtn').onclick = () => document.getElementById('setupAvatarFile').click();
  document.getElementById('setupAvatarFile').onchange = handleSetupAvatar;
  document.getElementById('setupContinueBtn').onclick = finishSetup;
  document.getElementById('checkinBtn').onclick = dailyCheckin;
  document.getElementById('storyFile').onchange = (e) => handleStoryFile(e, 'gallery');
  document.getElementById('storyCamera').onchange = (e) => handleStoryFile(e, 'camera');
  document.getElementById('addEventBtn').onclick = openAddEvent;
  document.getElementById('askQuestionBtn').onclick = openAskQuestion;
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.onclick = () => filterQuestions(t.dataset.filter);
  });
  const vAdd = document.getElementById('vaultAdd');
  const vAddBtn = document.getElementById('vaultAddBtn');
  const vFile = document.getElementById('vaultFile');
  if (vAdd) vAdd.onclick = () => vFile.click();
  if (vAddBtn) vAddBtn.onclick = () => vFile.click();
  if (vFile) vFile.onchange = handleVaultUpload;

  document.getElementById('newDrawingBtn').onclick = () => {
    openEditor({ mode: 'board', onDone: (dataUrl) => saveDrawing(dataUrl) });
  };
  document.getElementById('settingsAvatarBtn').onclick = () => document.getElementById('settingsAvatarFile').click();
  document.getElementById('settingsAvatarFile').onchange = handleSettingsAvatar;
  document.getElementById('changeNameRow').onclick = changeName;
  document.getElementById('notesRow').onclick = () => {
    lsSet('seenVersion', '');
    if (!showReleaseNotesIfNew()) {
      lsSet('seenVersion', APP_VERSION);
      const n = RELEASE_NOTES[APP_VERSION];
      showModal(`
        <div class="modal-handle"></div>
        <div class="whats-new-tag">what's new · ${APP_VERSION}</div>
        <h2>${escapeHtml(n.title)}</h2>
        <ul class="whats-new-list">${n.lines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
        <button class="btn btn-primary" id="notesOk2">got it</button>
      `);
      document.getElementById('notesOk2').onclick = closeModal;
    }
  };
  document.getElementById('themeRow').onclick = openThemeSettings;
  document.getElementById('lockRow').onclick = openLockSettings;
  document.getElementById('notifyRow').onclick = openNotificationSettings;
  document.getElementById('resetCoinsRow').onclick = resetCoins;
  document.getElementById('logoutRow').onclick = logout;
}

// ===============================================================
// BOOT
// ===============================================================
export function boot() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const root = document.getElementById('ivolina-root') || document.body;

  if (!supabase) {
    root.innerHTML = `
      <div class="config-error">
        <h2>Setup needed</h2>
        <p>Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment variables.</p>
        <p style="margin-top: 16px;">See the README for instructions.</p>
      </div>
    `;
    return;
  }

  applyTheme();
  watchSystemTheme();

  root.innerHTML = HTML;
  wireEvents();

  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('touchmove', e => {
    if (e.scale && e.scale !== 1) e.preventDefault();
  }, { passive: false });

  (async () => {
    await loadAllState();
    setupRealtime();
    startCounters();

    // Keep the service worker current, and make sure the saved subscription
    // still matches this device (they can be rotated by the browser).
    if (pushSupported() && lsGet('pushEnabled') === '1') {
      const reg = await registerServiceWorker();
      if (reg) {
        try {
          const sub = await reg.pushManager.getSubscription();
          if (sub && state.user) {
            const j = sub.toJSON();
            await supabase.from('push_subscriptions').upsert({
              endpoint: j.endpoint,
              user_key: state.user,
              p256dh: j.keys.p256dh,
              auth: j.keys.auth,
              user_agent: navigator.userAgent.slice(0, 200),
            }, { onConflict: 'endpoint' });
          }
        } catch (e) { console.warn('subscription refresh failed', e); }
      }
    } else if ('serviceWorker' in navigator) {
      // Even without notifications, the worker keeps the page fresh.
      registerServiceWorker();
    }
    const session = lsGet('session');
    if (session && PASSWORDS[session]) {
      state.user = session;
      document.body.dataset.user = session;
      const p = state.profile[session];
      if (!p || !p.name) showScreen('setup');
      else showScreen('home');
      const wasLocked = maybeLockOnStart();
      startLockWatcher();
      // Don't stack the notes on top of the lock screen.
      if (!wasLocked) setTimeout(showReleaseNotesIfNew, 700);
    } else {
      showScreen('login');
      startLockWatcher();
    }
  })();
}
