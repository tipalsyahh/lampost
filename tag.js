document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.home');
  const loadMoreBtn = document.getElementById('loadMore');
  const judulTag = document.getElementById('judulTag');

  if (!container || !loadMoreBtn) return;

  const PER_PAGE = 6;
  const MAX_PAGE = 6;

  let page = 1;
  let isLoading = false;
  let hasMore = true;
  let tagId = null;
  let tagName = '';

  const catCache = {};
  const mediaCache = {};
  const editorCache = {};

  const formatTanggal = dateString => {
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, '0')}/` +
           `${String(d.getMonth() + 1).padStart(2, '0')}/` +
           `${d.getFullYear()}`;
  };

  // 🔥 ambil tag dari URL
  const params = new URLSearchParams(window.location.search);
  tagName = params.get('q') || '';

  if (!tagName) {
    container.innerHTML = '<p>Tag tidak ditemukan</p>';
    return;
  }

  // 🔥 set judul halaman
  if (judulTag) {
    const format = tagName.charAt(0).toUpperCase() + tagName.slice(1);
    judulTag.innerText = `Berita "${format}"`;
  }

  document.title = `Berita "${tagName}" - Lampost`;

  // 🔥 ambil ID tag dari WP
  (async () => {
    try {
      const res = await fetch(
        `https://lampost.co/wp-json/wp/v2/tags?search=${encodeURIComponent(tagName)}`
      );
      if (!res.ok) throw new Error();

      const data = await res.json();
      if (!data.length) throw new Error();

      tagId = data[0].id;

      loadPosts();

    } catch {
      container.innerHTML = '<p>Tag tidak tersedia</p>';
    }
  })();

  async function getCategory(catId) {
    if (!catId) return { name: 'Opini', slug: 'opini' };
    if (catCache[catId]) return catCache[catId];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/categories/${catId}`
    );
    const data = await res.json();

    return (catCache[catId] = {
      name: data.name,
      slug: data.slug
    });
  }

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

  async function getEditor(post) {
    let editor = 'Redaksi';

    const termLink = post._links?.['wp:term']?.find(t =>
      !['category', 'post_tag'].includes(t.taxonomy)
    )?.href;

    if (!termLink) return editor;
    if (editorCache[termLink]) return editorCache[termLink];

    try {
      const res = await fetch(termLink);
      if (res.ok) {
        const data = await res.json();
        editor = data?.[0]?.name || editor;
        editorCache[termLink] = editor;
      }
    } catch {}

    return editor;
  }

  async function loadPosts() {
    if (isLoading || !hasMore || page > MAX_PAGE) {
      loadMoreBtn.style.display = 'none';
      return;
    }

    isLoading = true;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';

    try {
      const res = await fetch(
        `https://lampost.co/wp-json/wp/v2/posts` +
        `?tags=${tagId}&per_page=${PER_PAGE}&page=${page}` +
        `&orderby=date&order=desc`
      );

      if (!res.ok) {
        hasMore = false;
        loadMoreBtn.style.display = 'none';
        return;
      }

      let posts = await res.json();
      if (!posts.length) {
        hasMore = false;
        loadMoreBtn.style.display = 'none';
        return;
      }

      posts = posts.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const htmlArr = [];

      await Promise.all(
        posts.map(async post => {

          const judul = post.title.rendered;
          const slug = post.slug;
          const tanggal = formatTanggal(post.date);

          const catId = post.categories?.[0];
          const { name: kategori, slug: kategoriSlug } =
            await getCategory(catId);

          const gambar = await getMedia(post.featured_media);
          const editor = await getEditor(post);

          let deskripsi =
            post.excerpt?.rendered
              ?.replace(/<[^>]+>/g, '')
              ?.trim() || '';

          if (deskripsi.length > 150) {
            deskripsi = deskripsi.slice(0, 150) + '...';
          }

          const link = `../halaman.html?${kategoriSlug}/${slug}`;

          htmlArr.push(`
            <a href="${link}" class="item-info">
              <img src="${gambar}" alt="${judul}" class="img-microweb" loading="lazy">
              <div class="berita-microweb">
                <p class="judul">${judul}</p>
                <p class="kategori">${kategori}</p>
                <div class="info-microweb">
                  <p class="editor">Oleh ${editor}</p>
                  <p class="tanggal">${tanggal}</p>
                </div>
                <p class="deskripsi">${deskripsi}</p>
              </div>
            </a>
          `);

        })
      );

      container.insertAdjacentHTML('beforeend', htmlArr.join(''));
      page++;

    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Load More';
    }
  }

  loadMoreBtn.addEventListener('click', loadPosts);

});