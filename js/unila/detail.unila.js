document.addEventListener('DOMContentLoaded', async () => {

  const root = document.getElementById('berita') || document.body;

  /* ========================
     🔥 AMBIL SLUG DARI URL
     format: ?kategori|slug-berita
  ======================== */
  const query = window.location.search.replace('?', '');
  const [, slug] = query.split('|');

  if (!slug) {
    root.innerHTML = '<p>Berita tidak ditemukan</p>';
    return;
  }

  try {
    /* ========================
       🔗 API (PAKAI _EMBED)
    ======================== */
    const api =
      `https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts` +
      `?slug=${slug}&_embed`;

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();
    if (!posts.length) throw new Error('Berita tidak ada');

    const post = posts[0];

    /* ========================
       📝 JUDUL
    ======================== */
    const judulEl =
      document.querySelector('.judul-berita') ||
      document.querySelector('.judul');

    if (judulEl) judulEl.innerHTML = post.title.rendered;

    /* ========================
       📰 ISI BERITA
    ======================== */
    const isi =
      document.querySelector('.isi-berita') ||
      document.querySelector('.content') ||
      document.querySelector('.entry-content');

    if (isi) {
      isi.innerHTML = post.content.rendered;

      isi.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.loading = 'lazy';
      });
    }

    /* ========================
       🖼️ GAMBAR UTAMA (EMBED)
    ======================== */
    const gambar =
      document.querySelector('.gambar-berita') ||
      document.querySelector('.featured-image') ||
      document.querySelector('img[data-featured]');

    if (gambar) {
      gambar.src =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        gambar.src ||
        'image/default.jpg';

      gambar.alt = post.title.rendered;
    }

    /* ========================
       📅 TANGGAL
    ======================== */
    const tanggal =
      document.getElementById('tanggal') ||
      document.querySelector('.tanggal');

    if (tanggal) {
      tanggal.innerText = new Date(post.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    /* ========================
       ✍️ EDITOR (AUTHOR BENAR)
    ======================== */
    const editor =
      document.getElementById('editor') ||
      document.querySelector('.editor') ||
      document.querySelector('.author');

    if (editor) {
      editor.innerText =
        post._embedded?.author?.[0]?.name || 'Redaksi';
    }

    /* ========================
       🏷️ KATEGORI
    ======================== */
    const kategori =
      document.getElementById('kategori') ||
      document.querySelector('.kategori');

    if (kategori) {
      kategori.innerText =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Berita';
    }

  } catch (err) {
    console.error('Gagal load berita:', err);
    root.innerHTML = '<p>Gagal memuat berita</p>';
  }

});
