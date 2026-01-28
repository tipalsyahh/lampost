document.addEventListener('DOMContentLoaded', async () => {
  const title = document.querySelector('h2.search-title');
  if (!title) return;

  const params = new URLSearchParams(location.search);
  const q = params.get('q') || '';
  title.textContent = `Search Result for '${q}'`;

  const container = document.getElementById('search-results');
  if (!container) return;

  const query = decodeURIComponent(q).trim();
  const queryLower = query.toLowerCase();

  if (!query) {
    container.innerHTML = '<p>Masukkan kata kunci pencarian.</p>';
    return;
  }

  /* ================= CACHE ================= */
  const catCache = {};
  const mediaCache = {};
  const editorCache = {};

  async function getCategory(post) {
    const id = post.categories?.[post.categories.length - 1];
    if (!id) return { name: 'Berita', slug: 'berita' };
    if (catCache[id]) return catCache[id];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/categories/${id}`
    );
    const data = await res.json();

    return (catCache[id] = {
      name: data.name,
      slug: data.slug
    });
  }

  async function getMedia(id) {
    if (!id) return 'image/default.jpg';
    if (mediaCache[id]) return mediaCache[id];

    try {
      const res = await fetch(
        `https://lampost.co/wp-json/wp/v2/media/${id}`
      );
      const data = await res.json();

      return (mediaCache[id] =
        data.media_details?.sizes?.medium?.source_url ||
        data.source_url ||
        'image/default.jpg'
      );
    } catch {
      return 'image/default.jpg';
    }
  }

  async function getEditor(post) {
    if (editorCache[post.id]) return editorCache[post.id];

    let editor = 'Redaksi';
    const term = post._links?.['wp:term']?.[2]?.href;
    if (!term) return editor;

    try {
      const res = await fetch(term);
      const data = await res.json();
      editor = data?.[0]?.name || editor;
    } catch {}

    return (editorCache[post.id] = editor);
  }

  try {
    /* 🔥 SEARCH TANPA _EMBED — 2 HALAMAN (100 DATA) */
    const base =
      `https://lampost.co/wp-json/wp/v2/posts` +
      `?search=${encodeURIComponent(query)}` +
      `&per_page=50`;

    const [res1, res2] = await Promise.all([
      fetch(`${base}&page=1`),
      fetch(`${base}&page=2`)
    ]);

    const posts1 = res1.ok ? await res1.json() : [];
    const posts2 = res2.ok ? await res2.json() : [];

    const posts = [...posts1, ...posts2];

    /* ❗ FILTER TETAP — TIDAK DIUBAH */
    const filtered = posts.filter(post => {
      const title = post.title.rendered.toLowerCase();
      const raw =
        post.excerpt?.rendered || post.content?.rendered || '';
      const text = raw.replace(/(<([^>]+)>)/gi, '').toLowerCase();
      return title.includes(queryLower) || text.includes(queryLower);
    });

    if (!filtered.length) {
      container.innerHTML =
        `<p>Tidak ada hasil untuk <b>${query}</b></p>`;
      return;
    }

    const html = [];

    await Promise.all(
      filtered.map(async post => {

        const judul = post.title.rendered;
        const tanggal = new Date(post.date)
          .toLocaleDateString('id-ID');

        const { name: kategori, slug } =
          await getCategory(post);

        const gambar =
          await getMedia(post.featured_media);

        const editor =
          await getEditor(post);

        const deskripsi =
          (post.excerpt?.rendered ||
           post.content?.rendered || '')
            .replace(/(<([^>]+)>)/gi, '')
            .slice(0, 150) + '...';

        const link =
          `halaman.html?${slug}|${post.slug}`;

        html.push(`
          <a href="${link}" class="item-info">
            <img
              src="${gambar}"
              alt="${judul}"
              class="img-microweb"
              loading="lazy"
              onerror="this.src='image/default.jpg'"
            >
            <div class="berita-microweb">
              <p class="judul">${judul}</p>
              <p class="kategori">${kategori}</p>
              <div class="info-microweb">
                <p class="editor">By ${editor}</p>
                <p class="tanggal">${tanggal}</p>
              </div>
              <p class="deskripsi">${deskripsi}</p>
            </div>
          </a>
        `);
      })
    );

    container.innerHTML = html.join('');

  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p>Gagal memuat hasil pencarian.</p>';
  }
});
