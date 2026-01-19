document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.home');
  if (!container) return;

  try {
    // Proxy agar lolos CORS
    const proxy = 'https://api.allorigins.win/raw?url=';
    const target = encodeURIComponent('https://lampost.co/microweb/teknokrat/');

    const res = await fetch(proxy + target);
    if (!res.ok) throw new Error('Gagal mengambil halaman');

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // 🔎 Ambil artikel (aman untuk berbagai struktur)
    const items = doc.querySelectorAll('article, .post, .item');

    let output = '';

    items.forEach(item => {

      // 🔗 Link
      let link = item.querySelector('a')?.getAttribute('href') || '#';
      if (link.startsWith('/')) {
        link = 'https://lampost.co' + link;
      }

      // 📝 Judul
      const judul =
        item.querySelector('h1, h2, h3')?.innerText?.trim()
        || 'Tanpa Judul';

      // 🖼️ Gambar (FIX lazyload)
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

      // 🚫 Skip jika bukan konten valid
      if (!link || !judul) return;

      output += `
        <a href="${link}" class="item-info" target="_blank" rel="noopener">
          <img src="${gambar}" alt="${judul}" class="img-microweb" loading="lazy">
          <p class="judul">${judul}</p>
        </a>
      `;
    });

    // 🔥 Jika kosong
    if (!output) {
      output = '<p style="opacity:.7">Konten tidak tersedia</p>';
    }

    // Masukkan ke container
    container.innerHTML = output;

  } catch (err) {
    console.error('Microweb gagal dimuat:', err);
    container.innerHTML =
      '<p style="opacity:.7">Iklan tidak dapat dimuat saat ini</p>';
  }

});