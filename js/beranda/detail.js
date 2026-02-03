document.addEventListener('DOMContentLoaded', async () => {

  const berita = document.getElementById('berita');
  if (!berita) return;

  const query = decodeURIComponent(window.location.search.replace('?', ''));
  const [kategoriSlug, slug] = query.split('/');

  if (!slug) {
    berita.innerHTML = '<p>Berita tidak ditemukan</p>';
    return;
  }

  try {
    const api =
      `https://lampost.co/wp-json/wp/v2/posts` +
      `?slug=${slug}&orderby=date&order=desc`;

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();
    if (!posts.length) throw new Error('Berita tidak ada');

    const post = posts[0];

    /* ===== Judul ===== */
    const judul = document.querySelector('.judul-berita');
    if (judul) judul.innerHTML = post.title.rendered;

    /* ===== Isi ===== */
    const isi = document.querySelector('.isi-berita');
    isi.innerHTML = post.content.rendered;

    isi.querySelectorAll('p').forEach(p => {
      const text = p.innerHTML
        .replace(/&nbsp;/g, '')
        .replace(/\s+/g, '')
        .trim();
      if (!text) p.remove();
    });

    /* ===== Normalisasi Link ===== */
    isi.querySelectorAll('a[href]').forEach(link => {
      let href = link.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) return;

      try {
        const url = href.startsWith('http')
          ? new URL(href)
          : new URL(href, 'https://lampost.co');

        if (!url.hostname.includes('lampost.co')) return;

        const search = url.searchParams.get('s');
        if (search) {
          link.href = `search.html?q=${encodeURIComponent(search)}`;
          link.target = '_self';
          return;
        }

        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          link.href = `halaman.html?${parts.at(-2)}/${parts.at(-1)}`;
          link.target = '_self';
          return;
        }

        link.href = 'index.html';
        link.target = '_self';

      } catch {
        link.href = 'index.html';
        link.target = '_self';
      }
    });

    /* ===== Gambar di Konten ===== */
    isi.querySelectorAll('img').forEach(img => {
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
    });

    isi.querySelectorAll('figure').forEach(f => {
      f.style.width = '100%';
      f.style.margin = '1rem auto';
    });

    isi.querySelectorAll('.alignleft, .alignright').forEach(el => {
      el.style.float = 'none';
      el.style.margin = '1rem auto';
    });

    /* ===== Featured Image (tanpa embed) ===== */
    const gambar = document.querySelector('.gambar-berita');
    if (gambar && post.featured_media) {
      fetch(`https://lampost.co/wp-json/wp/v2/media/${post.featured_media}`)
        .then(r => r.ok ? r.json() : null)
        .then(m => {
          if (!m) return;
          gambar.src = m.source_url;
          gambar.style.width = '100%';
          gambar.style.height = 'auto';
        })
        .catch(() => {
          gambar.src = 'image/default.jpg';
        });
    }

    /* ===== Tanggal ===== */
    const tanggal = document.getElementById('tanggal');
    if (tanggal) {
      tanggal.innerText = new Date(post.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    /* ===== Editor (tanpa embed) ===== */
    const editorEl = document.getElementById('editor');
    if (editorEl) {
      const termLink = post._links?.['wp:term']?.[2]?.href;

      if (!termLink) {
        editorEl.innerText = 'by Redaksi';
      } else {
        fetch(termLink)
          .then(r => r.ok ? r.json() : [])
          .then(editors => {
            if (!editors.length) {
              editorEl.innerText = 'by Redaksi';
            } else if (editors.length === 1) {
              editorEl.innerText = `by ${editors[0].name}`;
            } else if (editors.length === 2) {
              editorEl.innerText =
                `by ${editors[0].name} and ${editors[1].name}`;
            } else {
              const last = editors.pop().name;
              editorEl.innerText =
                `by ${editors.map(e => e.name).join(', ')}, and ${last}`;
            }
          })
          .catch(() => {
            editorEl.innerText = 'by Redaksi';
          });
      }
    }

    /* ===== Kategori ===== */
    const kategoriEl = document.getElementById('kategori');
    if (kategoriEl && post.categories?.[0]) {
      fetch(`https://lampost.co/wp-json/wp/v2/categories/${post.categories[0]}`)
        .then(r => r.ok ? r.json() : null)
        .then(cat => {
          kategoriEl.innerText = cat?.name || kategoriSlug || 'Berita';
        })
        .catch(() => {
          kategoriEl.innerText = kategoriSlug || 'Berita';
        });
    }

  } catch (err) {
    console.error(err);
    berita.innerHTML = '<p>Gagal memuat berita</p>';
  }

});
