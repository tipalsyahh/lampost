const synth = window.speechSynthesis;
let utterance;
let isPlaying = false;

function playVoice() {
    synth.cancel(); // reset dari awal

    const beritaEl = document.getElementById("berita");
    if (!beritaEl) return;

    const textBerita = beritaEl.innerText;
    utterance = new SpeechSynthesisUtterance(textBerita);

    // Bahasa Indonesia
    utterance.lang = "id-ID";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    synth.speak(utterance);
    isPlaying = true;

    document.getElementById("voiceToggle").innerHTML =
        '<i class="bi bi-volume-up"></i>';
}

function stopVoice() {
    synth.cancel();
    isPlaying = false;

    document.getElementById("voiceToggle").innerHTML =
        '<i class="bi bi-volume-mute-fill"></i>';
}

/* ===============================
   AUTO PLAY SAAT HALAMAN DIMUAT
================================ */
window.addEventListener("load", () => {
    setTimeout(() => {
        playVoice();
    }, 600);
});

/* ===============================
   TOGGLE ICON
================================ */
document.getElementById("voiceToggle").addEventListener("click", () => {
    if (isPlaying) {
        stopVoice();
    } else {
        playVoice(); // selalu dari awal
    }
});

/* ===============================
   FIX UTAMA: HENTIKAN SAAT PINDAH HALAMAN
================================ */

// Saat reload / pindah halaman
window.addEventListener("beforeunload", () => {
    synth.cancel();
});

// Saat tab tidak aktif (user pindah tab / halaman SPA)
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        synth.cancel();
        isPlaying = false;
    }
});
