document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.ubl-lanjutan');
  if (!container) return;

  try {
    /* ========================
       🌐 REST API WORDPRESS
    ======================== */
    const api =
      'https://lampost.co/microweb/ubl/wp-json/wp/v2/posts' +
      '?per_page=4&offset=2&orderby=date&order=desc&_embed';

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal mengambil API');

    const posts = await res.json();

    let output = '';

    posts.forEach(post => {

      const link = post.link;
      const judul = post.title.rendered;

      const media =
        post._embedded?.['wp:featuredmedia']?.[0];

      const gambar =
        media?.source_url || 'image/ai.jpg';

      const tanggal = new Date(post.date)
        .toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

      const category =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Teknokrat';

      output += `
        <a href="berita.ubl.html?id=${post.id}" class="item-info">
          <img
            src="${gambar}"
            alt="${judul}"
            class="img-ubl"
            loading="lazy">
          <div class="berita-microweb">
            <p class="judul-ubl">${judul}</p>
            <div class="info-microweb">
              <p class="tanggal">${tanggal}</p>
              <p class="kategori">${category}</p>
            </div>
          </div>
        </a>
      `;
    });

    container.innerHTML =
      output || '<p>Konten tidak tersedia</p>';

  } catch (err) {
    console.error('API gagal dimuat:', err);
    container.innerHTML =
      '<p>Konten gagal dimuat</p>';
  }

});
