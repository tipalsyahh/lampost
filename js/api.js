document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.info');
  if (!container) return;

  const PER_PAGE = 10;
  const MAX_PAGE = 10;

  let page = 1;
  let isLoading = false;
  let hasMore = true;

  const API_BASE =
    'https://lampost.co/wp-json/wp/v2/posts?orderby=date&order=desc&_embed';

  // ===============================
  // FORMAT TANGGAL
  // ===============================
  function formatTanggal(dateString) {
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(dateString);
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  }

  // ===============================
  // SENTINEL
  // ===============================
  const sentinel = document.createElement('div');
  sentinel.style.height = '1px';
  container.appendChild(sentinel);

  // ===============================
  // LOAD POSTS
  // ===============================
  function loadPosts() {
    if (isLoading || !hasMore) return;
    if (page > MAX_PAGE) {
      hasMore = false;
      return;
    }

    isLoading = true;

    fetch(`${API_BASE}&per_page=${PER_PAGE}&page=${page}`)
      .then(res => res.ok ? res.json() : [])
      .then(posts => {

        if (page === 1) posts.shift();
        if (!posts.length) {
          hasMore = false;
          return;
        }

        let html = '';

        posts.forEach(post => {

          /* 📝 JUDUL */
          const judul = post.title.rendered;

          /* 🏷️ KATEGORI */
          const kategori =
            post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Berita';

          /* 🏷️ KATEGORI SLUG */
          const kategoriSlug =
            post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'berita';

          /* 🔗 LINK (KATEGORI DULU, BARU JUDUL) */
          const link = `halaman.html?${kategoriSlug}|${post.slug}`;

          /* 📅 TANGGAL */
          const tanggal = formatTanggal(post.date);

          /* ✍️ EDITOR */
          const editor =
            post._embedded?.['wp:term']?.[2]?.[0]?.name ||
            'Redaksi';

          /* 🖼️ GAMBAR */
          const gambar =
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            'image/default.jpg';

          html += `
            <a href="${link}" class="item-berita">
              <img src="${gambar}" loading="lazy" alt="${judul}">
              <div class="info-berita">
                <p class="judul">${judul}</p>

                <div class="detail-info">
                  <p class="editor">By ${editor}</p>
                  <p class="tanggal">${tanggal}</p>
                  <p class="kategori">${kategori}</p>
                </div>

              </div>
            </a>
          `;
        });

        sentinel.insertAdjacentHTML('beforebegin', html);

        page++;
        isLoading = false;
      })
      .catch(() => isLoading = false);
  }

  // ===============================
  // OBSERVER
  // ===============================
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) loadPosts();
    },
    { rootMargin: '300px' }
  );

  observer.observe(sentinel);

  // ===============================
  // INIT
  // ===============================
  loadPosts();

});
