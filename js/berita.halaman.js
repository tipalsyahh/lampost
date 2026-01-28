document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.home');
  const loadMoreBtn = document.getElementById('loadMore');
  if (!container) return;

  const PER_PAGE = 10;
  let page = 1;
  let isLoading = false;
  let hasMore = true;

  /* ===============================
     CACHE
  =============================== */
  const mediaCache = {};
  const editorCache = {};

  /* ===============================
     AMBIL QUERY URL
  =============================== */
  const query = decodeURIComponent(
    window.location.search.replace('?', '')
  );
  const kategoriSlug = query.split('|')[0];
  const currentSlug = query.split('|')[1] || null;
  if (!kategoriSlug) return;

  let kategoriId = null;
  let kategoriNama = kategoriSlug;

  /* ===============================
     AMBIL KATEGORI DARI SLUG
  =============================== */
  try {
    const catRes = await fetch(
      `https://lampost.co/wp-json/wp/v2/categories?slug=${kategoriSlug}`
    );
    const catData = await catRes.json();
    if (!catData.length) return;

    kategoriId = catData[0].id;
    kategoriNama = catData[0].name;
  } catch {
    return;
  }

  /* ===============================
     AMBIL GAMBAR
  =============================== */
  async function getMedia(mediaId) {
    if (!mediaId) return 'image/ai.jpg';
    if (mediaCache[mediaId]) return mediaCache[mediaId];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/media/${mediaId}`
    );
    const data = await res.json();

    return (mediaCache[mediaId] =
      data.media_details?.sizes?.medium?.source_url ||
      data.source_url ||
      'image/ai.jpg'
    );
  }

  /* ===============================
     ✍️ EDITOR (SAMA SEPERTI SCRIPT ACUAN)
  =============================== */
  async function getEditor(post) {
    let editor = 'Redaksi';

    const termLink = post._links?.['wp:term']?.[2]?.href;
    if (!termLink) return editor;

    if (editorCache[termLink]) return editorCache[termLink];

    try {
      const res = await fetch(termLink);
      if (res.ok) {
        const data = await res.json();
        editor = data?.[0]?.name || editor;
        editorCache[termLink] = editor;
      }
    } catch (_) {}

    return editor;
  }

  /* ===============================
     LOAD POSTS
  =============================== */
  async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
      const api =
        'https://lampost.co/wp-json/wp/v2/posts' +
        `?categories=${kategoriId}` +
        `&per_page=${PER_PAGE}` +
        `&page=${page}` +
        `&orderby=date&order=desc`;

      const res = await fetch(api);
      if (!res.ok) {
        if (res.status === 400 || res.status === 404) hasMore = false;
        return;
      }

      const posts = await res.json();
      if (!posts.length) {
        hasMore = false;
        return;
      }

      let output = '';
      let adaYangDitampilkan = false;

      await Promise.all(
        posts.map(async post => {
          if (currentSlug && post.slug === currentSlug) return;

          adaYangDitampilkan = true;

          const judul = post.title.rendered;
          const slug = post.slug;

          let deskripsi =
            post.excerpt?.rendered
              ?.replace(/<[^>]+>/g, '')
              ?.trim() || '';

          if (deskripsi.length > 150) {
            deskripsi = deskripsi.slice(0, 150) + '...';
          }

          const gambar = await getMedia(post.featured_media);
          const editor = await getEditor(post);

          const d = new Date(post.date);
          const tanggal =
            `${String(d.getDate()).padStart(2, '0')}/` +
            `${String(d.getMonth() + 1).padStart(2, '0')}/` +
            `${d.getFullYear()}`;

          output += `
            <a href="halaman.html?${kategoriSlug}|${slug}" class="item-info">
              <img src="${gambar}" alt="${judul}" class="img-microweb" loading="lazy">
              <div class="berita-microweb">
                <p class="judul">${judul}</p>
                <p class="kategori">${kategoriNama}</p>
                <div class="info-microweb">
                  <p class="editor">By ${editor}</p>
                  <p class="tanggal">${tanggal}</p>
                </div>
                <p class="deskripsi">${deskripsi}</p>
              </div>
            </a>
          `;
        })
      );

      if (!adaYangDitampilkan) {
        page++;
        isLoading = false;
        loadPosts();
        return;
      }

      container.insertAdjacentHTML('beforeend', output);
      page++;

    } finally {
      isLoading = false;
    }
  }

  loadPosts();
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadPosts);
  }

});
