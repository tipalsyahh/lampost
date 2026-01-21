document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.berita-terbaru');
  if (!container) return;

  const API_URL =
    'https://lampost.co/wp-json/wp/v2/posts?per_page=1&orderby=date&order=desc&_embed';

  try {

    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Gagal mengambil data');

    const posts = await res.json();
    let html = '';

    posts.forEach(post => {

      /* 📝 JUDUL */
      const judul = post.title.rendered;

      /* 🔗 LINK (SLUG) */
      const link = `halaman.html?judul=${post.slug}`;

      /* ✍️ EDITOR (CO-AUTHORS LAMPOST) */
      const editor =
        post._embedded?.['wp:term']?.[2]?.[0]?.name ||
        'Redaksi';

      /* 🏷️ KATEGORI */
      const kategori =
        post._embedded?.['wp:term']?.[0]?.[0]?.name ||
        'Berita';

      /* 🖼️ GAMBAR */
      const gambar =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        'image/default.jpg';

      /* 📅 TANGGAL */
      const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      html += `
        <a href="${link}" class="card-link">
          <div class="card-image-wrapper">

            <img src="${gambar}" alt="${judul}" class="card-image" loading="lazy">

            <div class="card-text-overlay">
              <span class="card-text">${judul}</span>

              <div class="card-meta">
                <span class="card-author">By ${editor}</span>
                <span class="card-date">${tanggal}</span>
                <span class="card-category">${kategori}</span>
              </div>

            </div>

          </div>
        </a>
      `;
    });

    container.innerHTML = html;

  } catch (err) {
    console.error('Gagal load list berita:', err);
    container.innerHTML = 'Gagal memuat berita';
  }

});
