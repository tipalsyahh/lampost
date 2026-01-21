document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.terbaru');
  if (!container) return;

  try {
    const api =
      'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts' +
      '?filter[category_name]=inspirasi&per_page=6&orderby=date&order=desc&_embed';

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal mengambil API');

    const posts = await res.json();

    let output = '';

    posts.forEach(post => {

      /* 📝 JUDUL */
      const judul = post.title.rendered;

      /* 🔤 SLUG → URL (SESUAI CONTOH ANDA) */
      const slug = post.slug;
      const link = `berita.unila.html?judul=${slug}`;

      /* 🖼️ GAMBAR */
      const media =
        post._embedded?.['wp:featuredmedia']?.[0];

      const gambar =
        media?.source_url || 'image/ai.jpg';

      /* 📅 TANGGAL */
      const tanggal = new Date(post.date)
        .toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

      output += `
        <a href="${link}" class="item-microweb">
          <img
            src="${gambar}"
            alt="${judul}"
            class="img-terbaru"
            loading="lazy">

          <div class="berita-microweb">
            <p class="judul-terbaru">${judul}</p>
            <div class="info-microweb">
              <p class="tanggal">${tanggal}</p>
            </div>
          </div>
        </a>
      `;
    });

    container.innerHTML =
      output || '<p>Konten Inspirasi tidak tersedia</p>';

  } catch (err) {
    console.error('API gagal dimuat:', err);
    container.innerHTML =
      '<p>Konten gagal dimuat</p>';
  }

});
