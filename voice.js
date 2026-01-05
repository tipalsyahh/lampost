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

window.addEventListener("load", () => {
    stopVoice(); 
});

document.getElementById("voiceToggle").addEventListener("click", () => {
    if (isPlaying) {
        stopVoice();
    } else {
        playVoice(); 
    }
});

window.addEventListener("beforeunload", () => {
    synth.cancel();
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopVoice();
    }
});
