document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.ubl-lanjutan');
  if (!container) return;

  try {
    /* ========================
       🌐 REST API WORDPRESS
    ======================== */
    const api =
      'https://lampost.co/microweb/ubl/wp-json/wp/v2/posts' +
      '?per_page=6&offset=2&orderby=date&order=desc&_embed';

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal mengambil API');

    const posts = await res.json();

    let output = '';

    posts.forEach(post => {

      /* 📝 JUDUL */
      const judul = post.title.rendered;

      /* 🔤 SLUG JUDUL */
      const slug = post.slug;

      /* 🏷️ KATEGORI */
      const kategori =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'UBL';

      /* 🏷️ SLUG KATEGORI */
      const kategoriSlug =
        post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'ubl';

      /* 🔗 LINK (KATEGORI DULU, BARU JUDUL) */
      const link = `berita.ubl.html?${kategoriSlug}|${slug}`;

      /* 🖼️ GAMBAR */
      const gambar =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || 'image/ai.jpg';

      /* 📅 TANGGAL */
      const tanggal = new Date(post.date)
        .toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

      /* ✍️ EDITOR */
      const editor =
        post._embedded?.author?.[0]?.name || 'Redaksi';

      output += `
        <a href="${link}" class="item-info">
          <img
            src="${gambar}"
            alt="${judul}"
            class="img-ubl"
            loading="lazy">

          <div class="berita-microweb">
            <p class="judul-ubl">${judul}</p>
            <div class="info-microweb">
              <p class="editor">By ${editor}</p>
              <p class="tanggal">${tanggal}</p>
              <p class="kategori">${kategori}</p>
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
