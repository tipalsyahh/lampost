document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.ekonomi');
  if (!container) return;

  // Ambil kategori langsung dari URL yang sudah ada
  const kategoriIDs = [];
  try {
    const catRes = await fetch('https://lampost.co/wp-json/wp/v2/categories?slug=ekonomi-dan-bisnis');
    if (catRes.ok) {
      const catData = await catRes.json();
      if (catData[0]?.id) kategoriIDs.push(catData[0].id);
    }
  } catch (e) {
    console.error('Gagal ambil kategori', e);
  }

  if (kategoriIDs.length === 0) {
    container.innerHTML = 'Kategori tidak ditemukan';
    return;
  }

  // Ambil 5 berita terbaru dari kategori yang dipilih
  const API_URL = `https://lampost.co/wp-json/wp/v2/posts?categories=${kategoriIDs.join(',')}&per_page=5&orderby=date&order=desc&_embed`;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Gagal mengambil data');

    const posts = await res.json();
    let html = '';

    for (const post of posts) {

      const judul = post.title.rendered;

      // kategori
      let kategori = 'Berita';
      if (post._embedded?.['wp:term']?.[0]?.[0]) {
        kategori = post._embedded['wp:term'][0][0].name;
      }

      // gambar
      const gambar = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/default.jpg';

      // tanggal
      const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      html += `
        <a href="halaman.html?id=${post.id}" class="card-link">
          <div class="card-image-wrapper">
            <img src="${gambar}" alt="${judul}" class="card-image" loading="lazy">
            <div class="card-text-overlay">
              <span class="card-text">${judul}</span>
              <div class="card-meta">
                <span class="card-date">${tanggal}</span>
                <span class="card-category">${kategori}</span>
              </div>
            </div>
          </div>
        </a>
      `;
    }

    container.innerHTML = html;

  } catch (err) {
    console.error('Gagal load list berita:', err);
    container.innerHTML = 'Gagal memuat berita';
  }

});
