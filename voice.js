const synth = window.speechSynthesis;
let utterance;
let isPlaying = true;

function playVoice() {
    // Selalu mulai dari awal
    synth.cancel();

    const textBerita = document.getElementById("berita").innerText;
    utterance = new SpeechSynthesisUtterance(textBerita);

    // SET BAHASA INDONESIA
    utterance.lang = "id-ID";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    synth.speak(utterance);
    isPlaying = true;

    // GANTI ICON (ON)
    document.getElementById("voiceToggle").innerHTML =
        '<i class="bi bi-volume-up"></i>';
}

function stopVoice() {
    synth.cancel();
    isPlaying = false;

    // GANTI ICON (OFF)
    document.getElementById("voiceToggle").innerHTML =
        '<i class="bi bi-volume-mute-fill"></i>';
}

// Auto play saat halaman selesai dimuat
window.addEventListener("load", () => {
    setTimeout(() => {
        playVoice();
    }, 600);
});

// Toggle ON / OFF
document.getElementById("voiceToggle").addEventListener("click", () => {
    if (isPlaying) {
        stopVoice();
    } else {
        playVoice(); // mulai dari awal
    }
});