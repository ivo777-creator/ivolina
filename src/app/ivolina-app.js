// ===============================================================
// IVOLINA v2.2.2 — story: hold to pause, pinch to zoom, 7s, likes
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

const RELATIONSHIP_START = new Date('2026-05-08T00:00:00');

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
  { id: 'evt_anniv', emoji: '🌸', title: 'Our first anniversary', date: '2027-05-08', _system: true },
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
:root {
  --ivo: #7BC4F5;
  --ivo-soft: #4A9FE0;
  --niki: #F4A8C8;
  --niki-soft: #E07AAB;
  --accent: var(--ivo);
  --accent-soft: var(--ivo-soft);
  --bg-0: #0A0612;
  --bg-1: #14101F;
  --bg-2: #1E1830;
  --text: #F5F0FF;
  --text-dim: #B8B0CC;
  --text-muted: #7A7290;
  --glass: rgba(30, 24, 48, 0.65);
  --glass-border: rgba(255, 255, 255, 0.08);
}
body[data-user="nikolina"] {
  --accent: var(--niki);
  --accent-soft: var(--niki-soft);
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; }
html, body { overscroll-behavior: none; overflow-x: hidden; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-0); color: var(--text);
  min-height: 100vh; min-height: 100dvh;
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent),
    radial-gradient(ellipse 60% 40% at 80% 110%, color-mix(in srgb, var(--accent) 12%, transparent), transparent),
    linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  transition: background 0.6s ease;
  user-select: none; -webkit-user-select: none;
}
input, textarea { -webkit-user-select: text; user-select: text; }
.display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
.screen { display: none; min-height: 100vh; min-height: 100dvh; padding: env(safe-area-inset-top, 0) 0 env(safe-area-inset-bottom, 0); animation: fadeIn 0.5s cubic-bezier(0.16,1,0.3,1); }
.screen.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
@keyframes heartPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes spin { to { transform: rotate(360deg); } }

#screen-login { display: none; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
#screen-login.active { display: flex; }
.login-title { font-size: 56px; line-height: 1; margin-bottom: 8px; background: linear-gradient(135deg, #7BC4F5 0%, #F4A8C8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.login-subtitle { color: var(--text-dim); font-size: 15px; margin-bottom: 64px; font-style: italic; font-family: 'Fraunces', serif; }
.login-cards { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 360px; }
.login-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 28px; padding: 32px 24px; display: flex; align-items: center; gap: 20px; cursor: pointer; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
.login-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, var(--card-color) 0%, transparent 60%); opacity: 0.18; pointer-events: none; }
.login-card:active { transform: scale(0.97); }
.login-card.ivo { --card-color: #7BC4F5; }
.login-card.niki { --card-color: #F4A8C8; }
.login-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--card-color), color-mix(in srgb, var(--card-color) 40%, #000)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 28px; color: white; box-shadow: 0 8px 24px color-mix(in srgb, var(--card-color) 30%, transparent); flex-shrink: 0; }
.login-card-text { text-align: left; flex: 1; }
.login-name { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; }
.login-hint { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: none; align-items: flex-end; justify-content: center; z-index: 100; animation: fadeIn 0.3s ease; }
.modal-backdrop.active { display: flex; }
@media (min-width: 500px) { .modal-backdrop { align-items: center; } }
.modal { background: var(--bg-2); border: 1px solid var(--glass-border); border-radius: 32px 32px 0 0; padding: 32px 24px calc(32px + env(safe-area-inset-bottom)); width: 100%; max-width: 480px; animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1); max-height: 90vh; overflow-y: auto; }
@media (min-width: 500px) { .modal { border-radius: 32px; margin: 20px; } }
.modal-handle { width: 40px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 24px; }
.modal h2 { font-family: 'Fraunces', serif; font-size: 26px; margin-bottom: 8px; text-align: center; }
.modal p { color: var(--text-dim); font-size: 14px; text-align: center; margin-bottom: 24px; }
.input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 16px; padding: 16px 18px; color: var(--text); font-size: 16px; font-family: inherit; margin-bottom: 16px; }
.input:focus { outline: none; border-color: var(--accent); background: rgba(255,255,255,0.08); }
textarea.input { resize: none; min-height: 100px; line-height: 1.5; }
.btn { width: 100%; border: none; border-radius: 16px; padding: 16px; font-size: 16px; font-weight: 600; font-family: inherit; cursor: pointer; transition: transform 0.2s; margin-bottom: 12px; }
.btn:active { transform: scale(0.97); }
.btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent-soft)); color: #0A0612; box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 30%, transparent); }
.btn-ghost { background: rgba(255,255,255,0.05); color: var(--text); border: 1px solid var(--glass-border); }
.btn-danger { background: rgba(255,90,110,0.15); color: #ff95a5; border: 1px solid rgba(255,90,110,0.3); }

.app-header { padding: calc(env(safe-area-inset-top) + 16px) 20px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; color: var(--text); }
.app-header h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 22px; flex: 1; }
.app-content { padding: 8px 20px 100px; }

/* NEW: home header with avatar */
.home-hero { padding: 12px 4px 28px; display: flex; align-items: center; gap: 16px; }
.home-hero-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 28px; color: white; overflow: hidden; flex-shrink: 0; box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 30%, transparent); cursor: pointer; }
.home-hero-avatar img { width: 100%; height: 100%; object-fit: cover; }
.home-hero-text { flex: 1; min-width: 0; }
.greeting { font-size: 13px; color: var(--text-dim); margin-bottom: 2px; }
.greeting-name { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1.1; background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 60%, #fff) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.greeting-sub { font-family: 'Fraunces', serif; font-style: italic; color: var(--text-dim); font-size: 13px; margin-top: 4px; }

.coins-bar { display: flex; align-items: center; justify-content: space-between; background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 20px; padding: 14px 18px; margin-bottom: 24px; }
.coins-display { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.coin-icon { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ffd56b, #f5a623); display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(245,166,35,0.3); }
.checkin-btn { background: linear-gradient(135deg, var(--accent), var(--accent-soft)); color: #0A0612; border: none; border-radius: 12px; padding: 8px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; }
.checkin-btn:disabled { opacity: 0.5; cursor: default; }

.feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.feature-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 24px; padding: 20px; cursor: pointer; aspect-ratio: 1; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.feature-card:active { transform: scale(0.96); }
.feature-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, var(--accent) 0%, transparent 60%); opacity: 0.12; pointer-events: none; }
.feature-icon { font-size: 28px; line-height: 1; }
.feature-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 500; line-height: 1.2; }
.feature-sub { color: var(--text-dim); font-size: 12px; margin-top: 4px; }
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
.questions-preview-item { font-family: 'Fraunces', serif; font-style: italic; font-size: 13px; color: var(--text-dim); padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 2px solid var(--accent); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: fadeIn 0.6s ease; }

.counter-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 28px; padding: 28px 20px; text-align: center; margin-bottom: 20px; position: relative; overflow: hidden; }
.counter-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, var(--accent) 0%, transparent 70%); opacity: 0.15; pointer-events: none; }
.counter-label { font-family: 'Fraunces', serif; font-style: italic; color: var(--text-dim); font-size: 14px; margin-bottom: 12px; }
.counter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 8px; }
.counter-unit { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 12px 4px; }
.counter-num { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 500; background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #fff)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
.counter-name { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

.event-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 20px; padding: 16px 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 14px; }
.event-emoji { font-size: 28px; width: 48px; height: 48px; background: rgba(255,255,255,0.05); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.event-info { flex: 1; min-width: 0; }
.event-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 500; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.event-countdown { font-size: 12px; color: var(--accent); font-weight: 500; }
.event-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.event-delete { background: none; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer; padding: 8px; }

.section-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 500; margin: 24px 0 14px; display: flex; align-items: center; justify-content: space-between; }
.add-btn { background: var(--accent); color: #0A0612; border: none; border-radius: 12px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }

.question-card { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 22px; padding: 20px; margin-bottom: 14px; cursor: pointer; transition: transform 0.2s; }
.question-card:active { transform: scale(0.98); }
.question-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
.asker-dot { width: 8px; height: 8px; border-radius: 50%; }
.asker-dot.ivo { background: var(--ivo); }
.asker-dot.niki { background: var(--niki); }
.question-text { font-family: 'Fraunces', serif; font-size: 17px; line-height: 1.4; margin-bottom: 12px; }
.question-status { display: flex; gap: 8px; margin-top: 12px; }
.status-pill { font-size: 11px; padding: 4px 10px; border-radius: 100px; font-weight: 500; }
.status-pill.answered { background: rgba(100,220,150,0.15); color: #7ee0a5; }
.status-pill.waiting { background: rgba(255,255,255,0.05); color: var(--text-muted); }

.filter-tabs { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 4px 0; }
.filter-tab { background: var(--glass); border: 1px solid var(--glass-border); color: var(--text-dim); padding: 8px 14px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; font-family: inherit; }
.filter-tab.active { background: var(--accent); color: #0A0612; border-color: var(--accent); }

/* NEW: avatars next to question/answer */
.tiny-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--avc, var(--accent)), var(--accent-soft)); display: inline-flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 12px; color: white; overflow: hidden; flex-shrink: 0; }
.tiny-avatar img { width: 100%; height: 100%; object-fit: cover; }
.tiny-avatar.ivo { --avc: var(--ivo); }
.tiny-avatar.niki { --avc: var(--niki); }
.med-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--avc, var(--accent)), var(--accent-soft)); display: inline-flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 14px; color: white; overflow: hidden; flex-shrink: 0; }
.med-avatar img { width: 100%; height: 100%; object-fit: cover; }
.med-avatar.ivo { --avc: var(--ivo); }
.med-avatar.niki { --avc: var(--niki); }

.answer-block { background: rgba(255,255,255,0.04); border-radius: 18px; padding: 16px 18px; margin-bottom: 12px; border-left: 3px solid var(--accent); }
.answer-author { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.answer-text { font-family: 'Fraunces', serif; font-size: 16px; line-height: 1.5; }
.locked-block { text-align: center; padding: 24px; color: var(--text-muted); font-style: italic; font-family: 'Fraunces', serif; }
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
.cat-chip.active { background: var(--accent); color: #0A0612; border-color: var(--accent); }
.preset-count { text-align: center; font-size: 12px; color: var(--text-muted); margin-bottom: 12px; font-family: 'Fraunces', serif; font-style: italic; }

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

.settings-section { background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 20px; margin-bottom: 16px; overflow: hidden; }
.settings-row { padding: 16px 18px; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.settings-row:last-child { border-bottom: none; }
.settings-label { font-size: 15px; }
.settings-value { color: var(--text-dim); font-size: 14px; }
.avatar-display { width: 88px; height: 88px; border-radius: 50%; margin: 8px auto 16px; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 36px; color: white; overflow: hidden; position: relative; box-shadow: 0 8px 32px color-mix(in srgb, var(--accent) 40%, transparent); }
.avatar-display img { width: 100%; height: 100%; object-fit: cover; }

.toast { position: fixed; top: calc(env(safe-area-inset-top) + 16px); left: 50%; transform: translateX(-50%) translateY(-100px); background: var(--bg-2); border: 1px solid var(--glass-border); color: var(--text); padding: 12px 20px; border-radius: 100px; font-size: 14px; font-weight: 500; z-index: 200; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 8px 32px rgba(0,0,0,0.4); max-width: calc(100vw - 40px); }
.toast.show { transform: translateX(-50%) translateY(0); }
.empty { text-align: center; padding: 40px 20px; color: var(--text-muted); }
.empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
.empty-text { font-family: 'Fraunces', serif; font-style: italic; }
.config-error { padding: 40px 24px; text-align: center; color: var(--text-dim); font-family: 'Fraunces', serif; }
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
.story-avatar { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, var(--avc, var(--accent)), var(--accent-soft)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 22px; color: #fff; }
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
.story-viewer-name { font-family: 'Fraunces', serif; font-size: 16px; }
.story-viewer-time { font-size: 12px; color: rgba(255,255,255,0.6); }
.story-viewer-close { margin-left: auto; background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; line-height: 1; padding: 4px 8px; }
.story-stage { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.story-stage img { max-width: 100%; max-height: 100%; object-fit: contain; animation: storyIn 0.35s cubic-bezier(0.16,1,0.3,1); }
.story-nav { position: absolute; inset: 0; display: flex; }
.story-nav div { flex: 1; }
.story-caption { padding: 12px 20px calc(env(safe-area-inset-bottom) + 20px); color: #fff; font-family: 'Fraunces', serif; font-size: 15px; text-align: center; }
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

/* ===== CHAT ===== */
.chat-divider { text-align: center; margin: 28px 0 16px; font-family: 'Fraunces', serif; font-style: italic; color: var(--text-muted); font-size: 13px; display: flex; align-items: center; gap: 10px; }
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

.chat-composer { position: sticky; bottom: 12px; display: flex; gap: 8px; align-items: flex-end; background: var(--bg-2); border: 1px solid var(--glass-border); border-radius: 24px; padding: 8px; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.chat-input { flex: 1; background: transparent; border: none; color: var(--text); font-family: inherit; font-size: 15px; padding: 10px 12px; resize: none; min-height: 24px; max-height: 120px; outline: none; }
.chat-attach-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.chat-send-btn { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); color: #0A0612; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; font-weight: 700; }
.chat-send-btn:disabled { opacity: 0.4; cursor: default; }
.chat-uploading { padding: 8px 12px; color: var(--text-muted); font-size: 12px; font-style: italic; font-family: 'Fraunces', serif; }
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
    </div>
    <div class="story-row" id="storyRow"></div>
    <input type="file" id="storyFile" accept="image/*" style="display:none;">
    <input type="file" id="storyCamera" accept="image/*" capture="user" style="display:none;">
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
      <div class="counter-label">together since 8 may 2026</div>
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
      <div style="font-family: 'Fraunces', serif; font-size: 32px; margin-top: 4px;" id="anniversaryCountdown">— days</div>
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
    <h1>drawing</h1>
  </div>
  <div class="app-content">
    <div class="canvas-wrap"><canvas id="drawCanvas"></canvas></div>
    <div class="draw-toolbar" id="drawToolbar">
      <div class="color-dot active" style="background: #000;" data-color="#000"></div>
      <div class="color-dot" style="background: #ff5e7a;" data-color="#ff5e7a"></div>
      <div class="color-dot" style="background: #7BC4F5;" data-color="#7BC4F5"></div>
      <div class="color-dot" style="background: #F4A8C8;" data-color="#F4A8C8"></div>
      <div class="color-dot" style="background: #ffd56b;" data-color="#ffd56b"></div>
      <div class="color-dot" style="background: #7ee0a5;" data-color="#7ee0a5"></div>
    </div>
    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
      <button class="tool-btn" style="margin-left: 0;" id="undoBtn">↶ undo</button>
      <button class="tool-btn" style="margin-left: 0;" id="clearBtn">clear</button>
      <button class="tool-btn" style="margin-left: auto; background: var(--accent); color: #0A0612; border-color: var(--accent);" id="saveBtn">save</button>
    </div>
    <div class="section-title">gallery</div>
    <div class="gallery-grid" id="galleryGrid"></div>
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
      <div class="settings-row" id="resetCoinsRow"><span class="settings-label" style="color: var(--text-dim);">reset my coins</span><span class="settings-value">›</span></div>
    </div>
    <div class="settings-section">
      <div class="settings-row" id="logoutRow"><span class="settings-label" style="color: #ff95a5;">logout</span><span class="settings-value">›</span></div>
    </div>
    <div style="text-align: center; margin-top: 32px; color: var(--text-muted); font-size: 12px; font-family: 'Fraunces', serif; font-style: italic;">
      ivolina v2.2.2 · made with love
    </div>
  </div>
</div>

<div class="modal-backdrop" id="modalBackdrop"></div>
<div class="story-viewer" id="storyViewer"></div>
<div class="toast" id="toast"></div>
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

function showScreen(name, opts = {}) {
  // Remember where you were on the screen you're leaving.
  const leaving = document.querySelector('.screen.active');
  if (leaving) state.scrollPositions[leaving.id] = window.scrollY;

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById('screen-' + name);
  if (t) t.classList.add('active');
  if (name === 'home') renderHome();
  if (name === 'memories') renderMemories();
  if (name === 'questions') renderQuestions();
  if (name === 'drawing') initDrawing();
  if (name === 'settings') renderSettings();
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
    el.onclick = () => showScreen(el.dataset.goto);
  });
  document.getElementById('moreCard').onclick = showAboutMore;
}

function showAboutMore() {
  showModal(`
    <div class="modal-handle"></div>
    <h2>more coming soon</h2>
    <p style="text-align: left; line-height: 1.6;">
      Now: categories for questions, and stories that vanish after 24 hours. Coming next: push notifications and a proper drawing studio with brushes, stickers and backgrounds. 🌸
    </p>
    <button class="btn btn-primary" id="aboutOk">got it</button>
  `);
  document.getElementById('aboutOk').onclick = closeModal;
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

function updateCounters() {
  const e = elapsedFromStart();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  if (RELATIONSHIP_START > new Date()) {
    set('cYears', 0); set('cMonths', 0); set('cDays', 0); set('cHours', 0); set('cMins', 0); set('cSecs', 0);
  } else {
    set('cYears', e.years); set('cMonths', e.months); set('cDays', e.monthDays);
    set('cHours', e.hours); set('cMins', e.mins); set('cSecs', e.secs);
  }
  const anniv = new Date('2027-05-08T00:00:00');
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
    return `
      <div class="question-card" data-q="${q.id}">
        <div class="question-meta">
          ${avatarHtml(q.asker, 'tiny')}
          <span>${escapeHtml(askerName)} asked · ${dateStr}</span>
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
    c.onclick = () => openQuestion(c.dataset.q);
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
  await addCoins(500);
  closeModal();
  renderQuestions();
  toast('+500 coins · question sent');
}

// ----- QUESTION DETAIL with CHAT -----
async function openQuestion(id) {
  state.currentQuestionId = id;
  const q = state.questions.find(x => x.id === id);
  if (!q) return;
  showScreen('questionDetail', { resetScroll: true });
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
    <div class="question-card" style="margin-bottom: 24px;">
      <div class="question-meta">
        ${avatarHtml(q.asker, 'tiny')}
        <span>${escapeHtml(state.profile[q.asker]?.name || q.asker)} asked</span>
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
  await addCoins(500);
  toast('+500 coins · answer sent');
  openQuestion(id);
}

// ----- DRAWING -----
function initDrawing() {
  const canvas = document.getElementById('drawCanvas');
  state.drawCanvas = canvas;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = state.drawColor;
  state.drawCtx = ctx;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, rect.width, rect.height);
  state.drawHistory = [];
  saveDrawState();
  let drawing = false;
  let last = null;
  const getPos = (e) => {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };
  const start = (e) => {
    e.preventDefault();
    drawing = true;
    last = getPos(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(last.x + 0.1, last.y + 0.1);
    ctx.stroke();
  };
  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = state.drawColor;
    ctx.stroke();
    last = p;
  };
  const end = () => {
    if (!drawing) return;
    drawing = false;
    saveDrawState();
  };
  canvas.ontouchstart = start;
  canvas.ontouchmove = move;
  canvas.ontouchend = end;
  canvas.onmousedown = start;
  canvas.onmousemove = move;
  canvas.onmouseup = end;
  canvas.onmouseleave = end;
  renderGallery();
}

function saveDrawState() {
  if (!state.drawCtx) return;
  const c = state.drawCanvas;
  state.drawHistory.push(state.drawCtx.getImageData(0, 0, c.width, c.height));
  if (state.drawHistory.length > 30) state.drawHistory.shift();
}

function undoDraw() {
  if (state.drawHistory.length < 2) return;
  state.drawHistory.pop();
  state.drawCtx.putImageData(state.drawHistory[state.drawHistory.length - 1], 0, 0);
}

function clearDraw() {
  const c = state.drawCanvas;
  const rect = c.getBoundingClientRect();
  state.drawCtx.fillStyle = '#fff';
  state.drawCtx.fillRect(0, 0, rect.width, rect.height);
  saveDrawState();
}

function setColor(el, c) {
  state.drawColor = c;
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
}

async function saveDrawing() {
  const dataUrl = state.drawCanvas.toDataURL('image/jpeg', 0.7);
  // Upload to storage; fallback to dataurl on failure (keeps v1 behavior)
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
  await addCoins(150);
  toast('+150 coins · saved');
  clearDraw();
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
async function loadStories() {
  if (!supabase) return;
  try {
    await supabase.rpc('purge_expired_stories');
  } catch (e) {
    // Not fatal — we filter client-side too.
    console.warn('purge_expired_stories unavailable', e);
  }
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
    <p>it disappears after 24 hours</p>
    <button class="btn btn-primary" id="storyFromGallery">choose from gallery</button>
    <button class="btn btn-ghost" id="storyFromCamera">take a photo</button>
    <button class="btn btn-ghost" id="storyCancel">cancel</button>
  `);
  document.getElementById('storyFromGallery').onclick = () => inp.click();
  document.getElementById('storyFromCamera').onclick = () => cam.click();
  document.getElementById('storyCancel').onclick = closeModal;
}

async function handleStoryFile(e) {
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
    // 1440px on the long edge keeps the original aspect ratio and stays sharp.
    const dataUrl = await resizeImageToDataUrl(f, 1440, 0.85);
    const dims = await imageDimensions(dataUrl);
    showStoryConfirm(dataUrl, dims);
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

function imageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = dataUrl;
  });
}

function showStoryConfirm(dataUrl, dims) {
  showModal(`
    <div class="modal-handle"></div>
    <h2>post this?</h2>
    <img class="story-preview-img" src="${dataUrl}" alt="">
    <input type="text" id="storyCaption" class="input" placeholder="caption (optional)" maxlength="120">
    <button class="btn btn-primary" id="storyPost">post to story</button>
    <button class="btn btn-ghost" id="storyBack">choose another</button>
  `);
  document.getElementById('storyPost').onclick = () => postStory(dataUrl, dims);
  document.getElementById('storyBack').onclick = openStoryPicker;
}

async function postStory(dataUrl, dims) {
  if (!supabase) return;
  const btn = document.getElementById('storyPost');
  const caption = (document.getElementById('storyCaption')?.value || '').trim();
  if (btn) { btn.disabled = true; btn.textContent = 'posting…'; }

  try {
    const blob = await (await fetch(dataUrl)).blob();
    const path = `stories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    const id = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

    const { error } = await supabase.from('stories').insert({
      id,
      author: state.user,
      url: pub.publicUrl,
      storage_path: path,
      width: dims.width,
      height: dims.height,
      caption: caption || null,
    });
    if (error) throw error;

    markStorySeen(id);
    await loadStories();
    closeModal();
    renderStoryRow();
    await addCoins(250);
    toast('+250 coins · story posted');
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
function runStoryTimer() {
  const remaining = Math.max(0, STORY_DURATION - storyElapsed);
  storyStartedAt = Date.now();
  storyPaused = false;

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
  clearTimeout(storyTimer);
  storyElapsed += Date.now() - storyStartedAt;

  // Freeze the progress bar exactly where it is.
  const bar = document.getElementById('activeBar');
  if (bar) {
    const frozen = window.getComputedStyle(bar).width;
    bar.style.transition = 'none';
    bar.style.width = frozen;
  }
  const hint = document.getElementById('storyPausedHint');
  if (hint) hint.classList.add('show');
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
  const leftMs = new Date(story.expires_at).getTime() - Date.now();
  const leftH = Math.max(0, Math.floor(leftMs / 3600000));
  const leftM = Math.max(0, Math.floor((leftMs % 3600000) / 60000));

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
      <img id="storyImg" src="${story.url}" alt="" draggable="false">
      <div class="story-paused-hint" id="storyPausedHint">paused</div>
      <div class="story-nav" id="storyNav">
        <div id="storyPrev"></div>
        <div id="storyNext"></div>
      </div>
      ${likeUi}
    </div>
    ${story.caption ? `<div class="story-caption">${escapeHtml(story.caption)}</div>` : ''}
    <div class="story-expiry">
      disappears in ${leftH}h ${leftM}m
      ${isMine ? ' · <button class="story-delete" id="storyDelete">delete now</button>' : ''}
    </div>
  `;

  document.getElementById('storyClose').onclick = closeStoryViewer;
  const del = document.getElementById('storyDelete');
  if (del) del.onclick = () => deleteStory(story);

  const likeBtn = document.getElementById('storyLike');
  if (likeBtn) likeBtn.onclick = (e) => { e.stopPropagation(); toggleStoryLike(story); };

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
  const img = document.getElementById('storyImg');
  const prevZone = document.getElementById('storyPrev');
  if (!nav || !img) return;

  const HOLD_MS = 180;        // longer than this counts as a hold, not a tap
  let holdTimer = null;
  let didHold = false;
  let startX = 0, startY = 0;
  let pinch = null;
  let scale = 1;

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
    if (e.touches.length === 2) {
      e.preventDefault();
      beginPinch(e.touches[0], e.touches[1]);
      return;
    }
    if (e.touches.length === 1) {
      didHold = false;
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
    if (e.touches.length === 1 && !didHold) {
      // A real drag isn't a tap — cancel the pending hold.
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > 12 || dy > 12) { clearTimeout(holdTimer); didHold = true; pauseStory(); }
    }
  }, { passive: false });

  function endTouch(e) {
    clearTimeout(holdTimer);

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

  // Mouse fallback so it still works on a laptop.
  let mouseHold = null, mouseHeld = false;
  nav.addEventListener('mousedown', (e) => {
    mouseHeld = false;
    mouseHold = setTimeout(() => { mouseHeld = true; pauseStory(); }, HOLD_MS);
  });
  nav.addEventListener('mouseup', (e) => {
    clearTimeout(mouseHold);
    if (mouseHeld) { mouseHeld = false; resumeStory(); return; }
    const rect = nav.getBoundingClientRect();
    stepStory(e.clientX - rect.left < rect.width / 2 ? -1 : 1);
  });
  nav.addEventListener('mouseleave', () => {
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
  storyPaused = false;
  storyElapsed = 0;
  const v = document.getElementById('storyViewer');
  v.classList.remove('active');
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

// ----- SETTINGS -----
function renderSettings() {
  const me = state.user;
  const p = state.profile[me];
  const avatarEl = document.getElementById('settingsAvatar');
  if (p?.avatar) avatarEl.innerHTML = `<img src="${p.avatar}">`;
  else avatarEl.textContent = me === 'ivo' ? 'I' : 'N';
  document.getElementById('settingsNameValue').textContent = p?.name || '—';
  document.getElementById('settingsUserValue').textContent = me === 'ivo' ? 'Ivo (blue)' : 'Nikolina (pink)';
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
  document.getElementById('storyFile').onchange = handleStoryFile;
  document.getElementById('storyCamera').onchange = handleStoryFile;
  document.getElementById('addEventBtn').onclick = openAddEvent;
  document.getElementById('askQuestionBtn').onclick = openAskQuestion;
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.onclick = () => filterQuestions(t.dataset.filter);
  });
  document.getElementById('drawToolbar').querySelectorAll('.color-dot').forEach(d => {
    d.onclick = () => setColor(d, d.dataset.color);
  });
  document.getElementById('undoBtn').onclick = undoDraw;
  document.getElementById('clearBtn').onclick = clearDraw;
  document.getElementById('saveBtn').onclick = saveDrawing;
  document.getElementById('settingsAvatarBtn').onclick = () => document.getElementById('settingsAvatarFile').click();
  document.getElementById('settingsAvatarFile').onchange = handleSettingsAvatar;
  document.getElementById('changeNameRow').onclick = changeName;
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
    const session = lsGet('session');
    if (session && PASSWORDS[session]) {
      state.user = session;
      document.body.dataset.user = session;
      const p = state.profile[session];
      if (!p || !p.name) showScreen('setup');
      else showScreen('home');
    } else {
      showScreen('login');
    }
  })();
}
