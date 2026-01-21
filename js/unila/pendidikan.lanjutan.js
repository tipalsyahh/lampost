document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.prestasi-lanjutan');
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
      `?categories=${kategoriId}&per_page=4&orderby=date&order=desc&_embed`;

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal mengambil API');

    const posts = await res.json();

    let output = '';

    posts.forEach(post => {

      const judul = post.title.rendered;

      let deskripsi =
        post.excerpt?.rendered
          ?.replace(/<[^>]+>/g, '')
          ?.trim() || '';

      if (deskripsi.length > 150) {
        deskripsi = deskripsi.slice(0, 150) + '...';
      }

      const category =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Prestasi Mahasiswa';

      const tanggal = new Date(post.date)
        .toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

      output += `
        <a href="berita.microweb.html?id=${post.id}" class="item-info">
          <div class="berita-unila">
            <p class="judul-unila-lanjutan">${judul}</p>
            <div class="info-microweb">
              <p class="tanggal">${tanggal}</p>
              <p class="kategori">${category}</p>
            </div>
            <p class="deskripsi-unila-lanjutan">${deskripsi}</p>
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
