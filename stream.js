function updateWIB() {
    const now = new Date();
    const options = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    const timeString = now.toLocaleTimeString("id-ID", options);
    document.getElementById("time").textContent = timeString;
}
setInterval(updateWIB, 1000);
updateWIB();

function openLink(url) {
    window.open(url, '_blank');
}