const synth = window.speechSynthesis;
let utterance = null;
let isPlaying = false;

function playVoice() {
  synth.cancel();

  const beritaEl = document.getElementById("berita");
  if (!beritaEl) return;

  const textBerita = beritaEl.innerText;
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

  if (!btn) return; // ⛔ JIKA TIDAK ADA, STOP DI SINI

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
