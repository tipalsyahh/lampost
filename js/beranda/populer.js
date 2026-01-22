document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.berita-terpopuler');
  if (!container) return;

  try {

    // ===============================
    // 1️⃣ AMBIL ID KATEGORI "lampung"
    // ===============================
    const catRes = await fetch(
      'https://lampost.co/wp-json/wp/v2/categories?slug=lampung'
    );
    if (!catRes.ok) throw new Error('Gagal mengambil kategori');

    const catData = await catRes.json();
    if (!catData.length) throw new Error('Kategori Lampung tidak ditemukan');

    const kategoriId = catData[0].id;

    // ===============================
    // 2️⃣ AMBIL POST BERDASARKAN KATEGORI
    // ===============================
    const postRes = await fetch(
      `https://lampost.co/wp-json/wp/v2/posts?per_page=6&categories=${kategoriId}&orderby=date&order=desc&_embed`
    );
    if (!postRes.ok) throw new Error('Gagal mengambil post');

    const posts = await postRes.json();

    // ===============================
    // 3️⃣ FUNGSI WAKTU RELATIF
    // ===============================
    function waktuYangLalu(dateString) {
      const sekarang = new Date();
      const waktuPost = new Date(dateString);
      const selisih = Math.floor((sekarang - waktuPost) / 1000);

      if (selisih < 60) return `${selisih} detik yang lalu`;
      const menit = Math.floor(selisih / 60);
      if (menit < 60) return `${menit} menit yang lalu`;
      const jam = Math.floor(menit / 60);
      if (jam < 24) return `${jam} jam yang lalu`;
      const hari = Math.floor(jam / 24);
      return `${hari} hari yang lalu`;
    }

    // ===============================
    // 4️⃣ RENDER CARD
    // ===============================
    let html = '';

    posts.forEach(post => {

      /* 📝 JUDUL */
      const judul = post.title.rendered;

      /* 🏷️ KATEGORI SLUG */
      const kategoriSlug =
        post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'berita';

      /* 🔗 LINK (KATEGORI DULU, BARU JUDUL) */
      const link = `halaman.html?${kategoriSlug}|${post.slug}`;

      /* ✍️ EDITOR */
      const editor =
        post._embedded?.['wp:term']?.[2]?.[0]?.name ||
        'Redaksi';

      /* 🖼️ GAMBAR */
      const gambar =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        'image/default.jpg';

      /* ⏱️ WAKTU */
      const waktu = waktuYangLalu(post.date);

      html += `
        <a href="${link}" class="card-link">
          <div class="card-image-wrapper">
            <img src="${gambar}" alt="${judul}" class="card-image" loading="lazy">

            <div class="card-text-overlay">
              <span class="card-category">Lampung</span>
              <span class="card-text">${judul}</span>

              <div class="card-meta">
                <span class="editor">By ${editor}</span>
                <span class="waktu">${waktu}</span>
              </div>
            </div>
          </div>
        </a>
      `;
    });

    container.innerHTML = html;

  } catch (err) {
    console.error('Gagal load berita Lampung:', err);
    container.innerHTML = 'Gagal memuat berita Lampung';
  }

});
