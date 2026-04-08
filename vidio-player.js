document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const videos = {
    1: "Fa5eARCeIx4",
    2: "SJnACU2gw1A",
    3: "H9_xyNOTisE",
    4: "6BrCwDpnfEA",
    5: "EQFQF39BaZg",
    6: "6SaPV6oIgKc",
    7: "15O2ZvOjHGk",
    8: "7QZXwzEKA5U",
    9: "_THazAwNp8c",
    10: "NR1tC4SCUNM"
  };

  const videoId = videos[id] || videos[1];

  const iframe = document.getElementById('player');
  const fallback = document.getElementById('fallback');
  const link = document.getElementById('yt-link');

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  iframe.src = embedUrl;

  // set link fallback
  if (link) {
    link.href = `https://www.youtube.com/watch?v=${videoId}`;
  }

  // fallback jika gagal load
  iframe.onerror = () => {
    iframe.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
  };

  // backup check (kadang onerror tidak terpanggil)
  setTimeout(() => {
    try {
      if (!iframe.contentWindow || iframe.contentWindow.length === 0) {
        iframe.style.display = 'none';
        if (fallback) fallback.style.display = 'block';
      }
    } catch (e) {
      iframe.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
    }
  }, 3000);

});
