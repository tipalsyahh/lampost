document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.prestasi-terbaru');
  if (!container) return;

  try {
    // ===============================
    // 1️⃣ AMBIL ID KATEGORI NASIONAL
    // ===============================
    const catRes = await fetch(
      'https://lampost.co/wp-json/wp/v2/categories?slug=nasional'
    );
    if (!catRes.ok) throw new Error('Gagal ambil kategori');

    const catData = await catRes.json();
    if (!catData.length) {
      container.insertAdjacentHTML(
        'beforeend',
        '<p>Kategori tidak ditemukan</p>'
      );
      return;
    }

    const categoryId = catData[0].id;

    // ===============================
    // 2️⃣ AMBIL BERITA
    // ===============================
    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/posts?categories=${categoryId}&per_page=2&orderby=date&order=desc&_embed`
    );
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();

    let html = '';

    posts.forEach(post => {

      /* 📝 JUDUL */
      const judul = post.title.rendered;

      /* 🏷️ KATEGORI */
      const kategoriNama =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Nasional';

      const kategoriSlug =
        post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'berita';

      /* 🔗 LINK */
      const link = `halaman.html?${kategoriSlug}|${post.slug}`;

      /* 📅 TANGGAL (ANGKA) */
      const d = new Date(post.date);
      const tanggal = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

      /* ✍️ EDITOR */
      const editor =
        post._embedded?.['wp:term']?.[2]?.[0]?.name || 'Redaksi';

      /* 🖼️ GAMBAR */
      const gambar =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        'image/ai.jpg';

      /* 🧾 DESKRIPSI */
      const deskripsi =
        (post.excerpt?.rendered || '')
          .replace(/(<([^>]+)>)/gi, '')
          .trim()
          .substring(0, 150) + '...';

      html += `
        <a href="${link}" class="item-info">
          <img src="${gambar}" class="img-unila" loading="lazy" alt="${judul}">
          <div class="berita-unila">
            <p class="judul-unila">${judul}</p>

            <p class="kategori">${kategoriNama}</p>
            <div class="info-microweb">
              <p class="editor-kkn">By ${editor}</p>
              <p class="tanggal" id="tanggal-unila-berita">${tanggal}</p>
            </div>

            <p class="deskripsi-unila-lanjutan">${deskripsi}</p>
          </div>
        </a>
      `;
    });

    // ===============================
    // 3️⃣ SISIPKAN KE DOM
    // ===============================
    container.insertAdjacentHTML('beforeend', html);

  } catch (err) {
    console.error(err);
    container.insertAdjacentHTML(
      'beforeend',
      '<p>Gagal memuat berita</p>'
    );
  }

});
