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

    for (const post of posts) {

      const judul = post.title.rendered;

      // kategori
      let kategori = 'Berita';
      if (post._embedded?.['wp:term']?.[0]?.[0]) {
        kategori = post._embedded['wp:term'][0][0].name;
      }

      // gambar
      const gambar =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || 'image/default.jpg';

      // ===== AUTHOR (FIX UTAMA) =====
      let author = 'Admin';

      // 1️⃣ Coba dari _embed (jika tersedia)
      if (post._embedded?.author?.[0]?.name) {
        author = post._embedded.author[0].name;
      }
      // 2️⃣ Fallback: fetch user berdasarkan author ID
      else if (post.author) {
        try {
          const authorRes = await fetch(
            `https://lampost.co/wp-json/wp/v2/users/${post.author}`
          );
          if (authorRes.ok) {
            const authorData = await authorRes.json();
            author = authorData.name;
          }
        } catch (e) {
          author = 'Admin';
        }
      }

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

              <span class="card-category">${kategori}</span>

              <span class="card-text">${judul}</span>

              <div class="card-meta">
                <span class="card-author">lampost</span>
                <span class="card-date">${tanggal}</span>
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
