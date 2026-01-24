document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.home');
  if (!container) return;

  try {
    // ===============================
    // AMBIL ID KATEGORI BEDAH TAJUK
    // ===============================
    const catRes = await fetch(
      'https://lampost.co/wp-json/wp/v2/categories?slug=bedah-tajuk'
    );
    if (!catRes.ok) throw new Error('Gagal ambil kategori');

    const catData = await catRes.json();
    if (!catData.length) {
      container.insertAdjacentHTML(
        'beforeend',
        '<p>Kategori Bedah Tajuk tidak ditemukan</p>'
      );
      return;
    }

    const categoryId = catData[0].id;

    // ===============================
    // AMBIL POST BEDAH TAJUK
    // ===============================
    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/posts?categories=${categoryId}&per_page=10&orderby=date&order=desc&_embed`
    );
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();
    let output = '';

    posts.forEach(post => {

      const judul = post.title.rendered;
      const slug = post.slug;

      const kategori =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Bedah Tajuk';

      const kategoriSlug =
        post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'bedah-tajuk';

      const link = `detail.bedah-tajuk.html?${kategoriSlug}|${slug}`;

      /* 📅 TANGGAL → ANGKA */
      const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const editor =
        post._embedded?.['wp:term']?.[2]?.[0]?.name || 'Redaksi';

      const gambar =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || 'image/ai.jpg';

      let deskripsi =
        post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '';

      if (deskripsi.length > 150) {
        deskripsi = deskripsi.slice(0, 150) + '...';
      }

      output += `
        <a href="${link}" class="item-info">
          <img src="${gambar}" alt="${judul}" class="img-microweb" loading="lazy">

          <div class="berita-microweb">
            <p class="judul">${judul}</p>

            <div class="info-microweb">
              <p class="editor">By ${editor}</p>
              <p class="tanggal">${tanggal}</p>
              <p class="kategori">${kategori}</p>
            </div>

            <p class="deskripsi">${deskripsi}</p>
          </div>
        </a>
      `;
    });

    container.insertAdjacentHTML('beforeend', output);

  } catch (err) {
    console.error('Gagal load Bedah Tajuk:', err);
    container.insertAdjacentHTML(
      'beforeend',
      '<p>Gagal memuat berita Bedah Tajuk</p>'
    );
  }

});
