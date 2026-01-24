document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.info');
  const loadMoreBtn = document.getElementById('loadMore');
  if (!container || !loadMoreBtn) return;

  const PER_PAGE = 14;
  const MAX_PAGE = 10;

  let page = 1;
  let isLoading = false;
  let hasMore = true;

  const API_BASE =
    'https://lampost.co/wp-json/wp/v2/posts?orderby=date&order=desc&_embed';

  // ===============================
  // FORMAT TANGGAL (21/1/2026)
  // ===============================
  function formatTanggal(dateString) {
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  // ===============================
  // LOAD POSTS
  // ===============================
  async function loadPosts() {
    if (isLoading || !hasMore) return;
    if (page > MAX_PAGE) {
      hasMore = false;
      loadMoreBtn.style.display = 'none';
      return;
    }

    isLoading = true;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';

    try {
      const res = await fetch(
        `${API_BASE}&per_page=${PER_PAGE}&page=${page}`
      );

      if (!res.ok) {
        hasMore = false;
        loadMoreBtn.style.display = 'none';
        return;
      }

      let posts = await res.json();

      // 🔥 buang post pertama di halaman awal
      if (page === 1) posts.shift();

      if (!posts.length) {
        hasMore = false;
        loadMoreBtn.style.display = 'none';
        return;
      }

      let html = '';

      posts.forEach(post => {

        /* 📝 JUDUL */
        const judul = post.title.rendered;

        /* 🏷️ KATEGORI */
        const kategori =
          post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Berita';

        const kategoriSlug =
          post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'berita';

        /* 🔗 LINK */
        const link = `halaman.html?${kategoriSlug}|${post.slug}`;

        /* 📅 TANGGAL */
        const tanggal = formatTanggal(post.date);

        /* ✍️ EDITOR */
        const editor =
          post._embedded?.['wp:term']?.[2]?.[0]?.name || 'Redaksi';

        /* 🖼️ GAMBAR (TANPA LAZY LOAD) */
        const gambar =
          post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          'image/default.jpg';

        html += `
          <a href="${link}" class="item-berita">
            <img src="${gambar}" alt="${judul}">
            <div class="info-berita">
              <p class="judul">${judul}</p>

              <div class="detail-info">
                <p class="editor">By ${editor}</p>
                <p class="tanggal">${tanggal}</p>
              </div>

              <p class="kategori">${kategori}</p>
            </div>
          </a>
        `;
      });

      container.insertAdjacentHTML('beforeend', html);
      page++;

    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Load More';
    }
  }

  // ===============================
  // INIT
  // ===============================
  loadPosts();
  loadMoreBtn.addEventListener('click', loadPosts);

});
