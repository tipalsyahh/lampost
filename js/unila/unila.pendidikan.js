document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.prestasi-terbaru');
  if (!container) return;

  try {
    /* ========================
       1️⃣ AMBIL ID KATEGORI
    ======================== */
    const catRes = await fetch(
      'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/categories?slug=prestasi-mahasiswa'
    );
    if (!catRes.ok) throw new Error('Gagal ambil kategori');

    const catData = await catRes.json();
    if (!catData.length) throw new Error('Kategori tidak ditemukan');

    const kategoriId = catData[0].id;

    /* ========================
       2️⃣ AMBIL POST BERDASARKAN KATEGORI
    ======================== */
    const api =
      'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts' +
      `?categories=${kategoriId}&per_page=2&orderby=date&order=desc&_embed`;

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal mengambil API');

    const posts = await res.json();

    let output = '';

    posts.forEach(post => {

      /* 📝 JUDUL */
      const judul = post.title.rendered;

      /* 🔤 SLUG → URL */
      const slug = post.slug;
      const link = `berita.unila.html?judul=${slug}`;

      /* 📰 DESKRIPSI */
      let deskripsi =
        post.excerpt?.rendered
          ?.replace(/<[^>]+>/g, '')
          ?.trim() || '';

      if (deskripsi.length > 150) {
        deskripsi = deskripsi.slice(0, 150) + '...';
      }

      /* 🏷️ KATEGORI */
      const category =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Prestasi Mahasiswa';

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
          <img src="${gambar}" alt="${judul}" class="img-unila" loading="lazy">

          <div class="berita-unila">
            <p class="judul-unila">${judul}</p>

            <div class="info-microweb">
            <p class="editor">Oleh ${editor}</p>
              <p class="tanggal">${tanggal}</p>
              <p class="kategori">${category}</p>
            </div>

            <p class="deskripsi">${deskripsi}</p>
          </div>
        </a>
      `;
    });

    container.innerHTML =
      output || '<p>Konten Prestasi Mahasiswa tidak tersedia</p>';

  } catch (err) {
    console.error('API gagal dimuat:', err);
    container.innerHTML =
      '<p>Konten gagal dimuat</p>';
  }

});
