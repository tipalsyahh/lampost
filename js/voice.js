const synth = window.speechSynthesis;
let utterance = null;
let isPlaying = false;

function playVoice() {
  synth.cancel();

  const beritaEl = document.getElementById("berita");
  if (!beritaEl) return;

  // Ambil semua teks dari #berita kecuali yang ada class "home"
  const nodes = Array.from(beritaEl.childNodes);
  let textBerita = '';
  nodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('home')) {
      return; // abaikan elemen dengan class 'home'
    }
    textBerita += node.innerText || node.textContent || '';
  });

  if (!textBerita.trim()) return; // jika kosong, stop

  utterance = new SpeechSynthesisUtterance(textBerita);
  utterance.lang = "id-ID";

  synth.speak(utterance);
  isPlaying = true;

  const btn = document.getElementById("voiceToggle");
  if (btn) {
    btn.innerHTML = '<i class="bi bi-volume-up"></i>';
  }
}

function stopVoice() {
  synth.cancel();
  isPlaying = false;

  const btn = document.getElementById("voiceToggle");
  if (btn) {
    btn.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
  }
}

/* 🔥 WAJIB: DOMContentLoaded */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("voiceToggle");
  if (!btn) return;

  stopVoice();

  btn.addEventListener("click", () => {
    if (isPlaying) {
      stopVoice();
    } else {
      playVoice();
    }
  });
});

/* keamanan tambahan */
window.addEventListener("beforeunload", () => synth.cancel());

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopVoice();
});
