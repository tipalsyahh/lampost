document.addEventListener('DOMContentLoaded', async () => {

  const berita = document.getElementById('berita');
  if (!berita) return;

  const BASE = 'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2';

  /* ========================
     🔁 PROXY FALLBACK
  ======================== */
  const PROXIES = [
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];

  async function fetchWithProxy(url) {
    for (const build of PROXIES) {
      try {
        const res = await fetch(build(url));
        if (!res.ok) throw new Error('Proxy gagal');
        return await res.json();
      } catch {
        console.warn('Proxy gagal, lanjut...');
      }
    }
    throw new Error('Semua proxy gagal');
  }

  /* ========================
     🔗 AMBIL SLUG
  ======================== */
  const query = decodeURIComponent(location.search.replace('?', ''));
  const [, slug] = query.split('|');

  if (!slug) {
    berita.innerHTML = '<p>Berita tidak ditemukan</p>';
    return;
  }

  try {
    /* ========================
       📡 LOAD POST (TANPA EMBED)
    ======================== */
    const posts = await fetchWithProxy(
      `${BASE}/posts?slug=${slug}`
    );

    if (!posts.length) throw new Error('Post kosong');
    const post = posts[0];

    /* ========================
       📝 JUDUL
    ======================== */
    document.querySelector('.judul-berita') &&
      (document.querySelector('.judul-berita').innerHTML =
        post.title.rendered);

    /* ========================
       📰 ISI
    ======================== */
    const isi = document.querySelector('.isi-berita');
    if (isi) {
      isi.innerHTML = post.content.rendered;
      isi.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      });
    }

    /* ========================
       📅 TANGGAL
    ======================== */
    const tanggal = document.getElementById('tanggal');
    if (tanggal) {
      tanggal.innerText = new Date(post.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    /* ========================
       ✍️ EDITOR
    ======================== */
    const editor = document.getElementById('editor');
    if (editor) {
      try {
        const author = await fetchWithProxy(
          `${BASE}/users/${post.author}`
        );
        editor.innerText = author.name || 'Redaksi';
      } catch {
        editor.innerText = 'Redaksi';
      }
    }

    /* ========================
       🏷️ KATEGORI
    ======================== */
    const kategori = document.getElementById('kategori');
    if (kategori && post.categories?.length) {
      try {
        const cat = await fetchWithProxy(
          `${BASE}/categories/${post.categories[0]}`
        );
        kategori.innerText = cat.name || 'Berita';
      } catch {
        kategori.innerText = 'Berita';
      }
    }

    /* ========================
       🖼️ GAMBAR (STABIL)
    ======================== */
    const gambar = document.querySelector('.gambar-berita');
    if (gambar && post.featured_media) {
      try {
        const media = await fetchWithProxy(
          `${BASE}/media/${post.featured_media}`
        );
        gambar.src = media.source_url || 'image/default.jpg';
      } catch {
        gambar.src = 'image/default.jpg';
      }
    }

  } catch (err) {
    console.error(err);
    berita.innerHTML =
      '<p>Konten gagal dimuat. Silakan refresh.</p>';
  }

});
