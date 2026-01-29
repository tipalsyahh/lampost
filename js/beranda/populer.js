document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.berita-terpopuler');
  if (!container) return;

  const TERM_CACHE = {};
  const MEDIA_CACHE = {};

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
    const kategoriSlug = 'lampung';

    // ===============================
    // 2️⃣ AMBIL POST (TANPA _embed)
    // ===============================
    const postRes = await fetch(
      `https://lampost.co/wp-json/wp/v2/posts?per_page=6&categories=${kategoriId}&orderby=date&order=desc`
    );
    if (!postRes.ok) throw new Error('Gagal mengambil post');

    const posts = await postRes.json();
    if (!posts.length) return;

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
    const htmlArr = [];

    for (const post of posts) {

      /* 📝 JUDUL */
      const judul = post.title.rendered;

      /* 🔗 LINK (GANTI | MENJADI /) */
      const link = `halaman.html?${kategoriSlug}/${post.slug}`;

      /* ⏱️ WAKTU */
      const waktu = waktuYangLalu(post.date);

      // ===============================
      // ✍️ EDITOR (LOGIKA OLAHRAGA)
      // ===============================
      let editor = 'Redaksi';

      const termLink = post._links?.['wp:term']?.[2]?.href;
      if (termLink) {
        if (TERM_CACHE[termLink]) {
          editor = TERM_CACHE[termLink];
        } else {
          try {
            const termRes = await fetch(termLink);
            if (termRes.ok) {
              const termData = await termRes.json();
              editor = termData?.[0]?.name || editor;
              TERM_CACHE[termLink] = editor;
            }
          } catch (_) {}
        }
      }

      // ===============================
      // 🖼️ GAMBAR (LOGIKA OLAHRAGA)
      // ===============================
      let gambar = 'image/default.jpg';

      if (post.featured_media) {
        if (MEDIA_CACHE[post.featured_media]) {
          gambar = MEDIA_CACHE[post.featured_media];
        } else {
          try {
            const mediaRes = await fetch(
              `https://lampost.co/wp-json/wp/v2/media/${post.featured_media}`
            );
            if (mediaRes.ok) {
              const media = await mediaRes.json();
              gambar =
                media.media_details?.sizes?.medium?.source_url ||
                media.source_url ||
                gambar;

              MEDIA_CACHE[post.featured_media] = gambar;
            }
          } catch (_) {}
        }
      }

      htmlArr.push(`
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
      `);
    }

    container.innerHTML = htmlArr.join('');

  } catch (err) {
    console.error('Gagal load berita Lampung:', err);
    container.innerHTML = 'Gagal memuat berita Lampung';
  }

});