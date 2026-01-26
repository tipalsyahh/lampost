document.addEventListener('DOMContentLoaded', async () => {

  const berita = document.getElementById('berita');
  if (!berita) return;

  // 🔥 Ambil kategori & slug judul dari URL (AMAN)
  const query = decodeURIComponent(window.location.search.replace('?', ''));
  const [kategoriSlug, slug] = query.split('|');

  if (!slug) {
    berita.innerHTML = '<p>Berita tidak ditemukan</p>';
    return;
  }

  try {
    const api = `https://lampost.co/wp-json/wp/v2/posts?slug=${slug}&_embed`;
    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();
    if (!posts.length) throw new Error('Berita tidak ada');

    const post = posts[0];

    /* ========================
       📝 JUDUL
    ======================== */
    const judul = document.querySelector('.judul-berita');
    if (judul) judul.innerHTML = post.title.rendered;

    /* ========================
       📰 ISI BERITA
    ======================== */
    const isi = document.querySelector('.isi-berita');
    isi.innerHTML = post.content.rendered;

    /* ========================
       🔁 REDIRECT LINK INTERNAL LAMPOST
       (ARTIKEL & SEARCH)
    ======================== */
    isi.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      try {
        const url = new URL(href);

        if (!url.hostname.includes('lampost.co')) return;

        // 🔎 SEARCH ?s=
        const search = url.searchParams.get('s');
        if (search) {
          link.href = `search.html?q=${encodeURIComponent(search)}`;
          link.target = '_self';
          return;
        }

        // 📰 ARTIKEL /kategori/slug/
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          const kategori = parts[0];
          const slugLink = parts[1];
          link.href = `halaman.html?${kategori}%7C${slugLink}`;
          link.target = '_self';
        }

      } catch (e) {
        // abaikan mailto:, tel:, dll
      }
    });

    /* ========================
       🖼️ AMANKAN IMG (GLOBAL)
    ======================== */
    isi.querySelectorAll('img').forEach(img => {
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.maxWidth = '100%';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.objectFit = 'contain';
    });

    /* ========================
       🖼️ AMANKAN FIGURE WP
    ======================== */
    isi.querySelectorAll('figure').forEach(figure => {
      figure.style.maxWidth = '100%';
      figure.style.width = '100%';
      figure.style.margin = '1rem auto';
      figure.style.boxSizing = 'border-box';

      const img = figure.querySelector('img');
      if (img) {
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.style.maxWidth = '100%';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
      }
    });

    // Netralisir align WP
    isi.querySelectorAll('.alignleft, .alignright').forEach(el => {
      el.style.float = 'none';
      el.style.margin = '1rem auto';
    });

    /* ========================
       🖼️ GAMBAR UTAMA
    ======================== */
    const gambar = document.querySelector('.gambar-berita');
    if (gambar) {
      gambar.src =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        'image/default.jpg';

      gambar.style.maxWidth = '100%';
      gambar.style.width = '100%';
      gambar.style.height = 'auto';
      gambar.style.objectFit = 'contain';
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

const editorEl = document.getElementById('editor');
if (editorEl) {
  const editors = post._embedded?.['wp:term']?.[2] || [];

  // buat teks editor
  let editorText = '';
  if (!editors.length) {
    editorText = 'by Redaksi';
  } else if (editors.length === 1) {
    editorText = `by ${editors[0].name}`;
  } else if (editors.length === 2) {
    editorText = `by ${editors[0].name} and ${editors[1].name}`;
  } else {
    const allButLast = editors.slice(0, -1).map(e => e.name).join(', ');
    const last = editors[editors.length - 1].name;
    editorText = `by ${allButLast}, and ${last}`;
  }

  // update editor
  editorEl.innerText = editorText;

  // hapus "Oleh" hanya di teks sebelum <strong>, tanpa merusak tombol
  const parentMeta = editorEl.parentElement;
  if (parentMeta) {
    Array.from(parentMeta.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue.replace(/^\s*Oleh\s*/i, '');
      }
    });
  }
}

    /* ========================
       🏷️ KATEGORI
    ======================== */
    const kategoriEl = document.getElementById('kategori');
    if (kategoriEl) {
      kategoriEl.innerText =
        post._embedded?.['wp:term']?.[0]?.[0]?.name ||
        kategoriSlug ||
        'Berita';
    }

  } catch (err) {
    console.error(err);
    berita.innerHTML = '<p>Gagal memuat berita</p>';
  }

});
