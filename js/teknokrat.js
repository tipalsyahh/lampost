document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.iklan');
  if (!container) return;

  try {
    const proxy = 'https://api.allorigins.win/raw?url=';
    const target = encodeURIComponent('https://lampost.co/microweb/teknokrat/');
    
    const res = await fetch(proxy + target);
    if (!res.ok) throw new Error('Gagal mengambil halaman');

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Ambil konten utama halaman
    const content =
      doc.querySelector('main') ||
      doc.querySelector('.site-content') ||
      doc.body;

    // Masukkan ke class .iklan
    container.innerHTML = content.innerHTML;

  } catch (err) {
    console.error('Microweb gagal dimuat:', err);
    container.innerHTML =
      '<p style="opacity:.7">Iklan tidak dapat dimuat saat ini</p>';
  }

});