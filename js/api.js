document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.info');
  if (!container) return;

  const PER_PAGE = 10;
  const MAX_PAGE = 10; // 10 x 10 = 100

  let page = 1;
  let isLoading = false;
  let hasMore = true;

  const API_BASE =
    'https://lampost.co/wp-json/wp/v2/posts?orderby=date&order=desc&_embed';

  // ===============================
  // WAKTU RELATIF
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
    if (hari < 7) return `${hari} hari yang lalu`;
    return `${Math.floor(hari / 30)} bulan yang lalu`;
  }

  // ===============================
  // SENTINEL (AKHIR .info)
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
      .then(res => {
        if (!res.ok) {
          hasMore = false;
          return [];
        }
        return res.json();
      })
      .then(posts => {

        // Page pertama → lewati data ke-1
        if (page === 1) {
          posts.shift();
        }

        if (!posts.length) {
          hasMore = false;
          return;
        }

        let html = '';

        posts.forEach(post => {
          html += `
            <a href="halaman.html?id=${post.id}" class="item-berita">
              <img src="${post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/default.jpg'}" loading="lazy">
              <div class="info-berita">
                <p class="kategori">${post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Berita'}</p>
                <h3 class="judul">${post.title.rendered}</h3>
                <p class="waktu">${waktuYangLalu(post.date)}</p>
                <h4>Baca Selengkapnya</h4>
              </div>
            </a>
          `;
        });

        // Selalu sisipkan sebelum sentinel
        sentinel.insertAdjacentHTML('beforebegin', html);

        page++;
        isLoading = false;
      })
      .catch(() => {
        isLoading = false;
      });
  }

  // ===============================
  // INTERSECTION OBSERVER
  // ===============================
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        loadPosts();
      }
    },
    {
      root: null,
      rootMargin: '300px', // preload
      threshold: 0
    }
  );

  observer.observe(sentinel);

  // ===============================
  // INIT
  // ===============================
  loadPosts();

});
