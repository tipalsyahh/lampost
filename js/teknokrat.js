document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.home');
  if (!container) return;

  try {
    // 🌐 Proxy CORS
    const proxy = 'https://api.allorigins.win/raw?url=';
    const target = encodeURIComponent('https://lampost.co/microweb/teknokrat/');

    const res = await fetch(proxy + target);
    if (!res.ok) throw new Error('Gagal mengambil halaman');

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // 🔎 Ambil artikel (fleksibel)
    const items = doc.querySelectorAll('article, .post, .item');

    let output = '';

    items.forEach(item => {

      // 🔗 LINK
      let link = item.querySelector('a')?.getAttribute('href') || '';
      if (!link) return;
      if (link.startsWith('/')) link = 'https://lampost.co' + link;

      // 📝 JUDUL
      const judul =
        item.querySelector('h1, h2, h3')?.innerText?.trim() ||
        'Tanpa Judul';

      // 🖼️ GAMBAR (lazyload aman)
      const imgEl = item.querySelector('img');
      let gambar =
        imgEl?.getAttribute('data-src') ||
        imgEl?.getAttribute('data-lazy-src') ||
        imgEl?.getAttribute('src') ||
        imgEl?.src ||
        'image/ai.jpg';

      if (gambar && gambar.startsWith('/')) {
        gambar = 'https://lampost.co' + gambar;
      }

      // 📅 TANGGAL (banyak fallback)
      let tanggal =
        item.querySelector('time')?.innerText?.trim() ||
        item.querySelector('.date, .post-date, .entry-date')?.innerText?.trim() ||
        '';

      // fallback → tanggal hari ini
      if (!tanggal) {
        tanggal = new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      }

      output += `
        <a href="${link}" class="item-info" target="_blank" rel="noopener noreferrer">
          <img src="${gambar}" alt="${judul}" class="img-microweb" loading="lazy">
          <div class="berita-microweb">
          <p class="judul">${judul}</p>
          <p class="tanggal">${tanggal}</p>
          </div>
        </a>
      `;
    });

    // 🚫 Jika tidak ada konten
    if (!output) {
      output = '<p style="opacity:.7">Konten tidak tersedia</p>';
    }

    container.innerHTML = output;

  } catch (err) {
    console.error('Microweb gagal dimuat:', err);
    container.innerHTML =
      '<p style="opacity:.7">Iklan tidak dapat dimuat saat ini</p>';
  }

});
