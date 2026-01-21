document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.berita-ubl');
  const loadMoreBtn = document.querySelector('#loadMore');
  if (!container || !loadMoreBtn) return;

  let page = 1;
  const perPage = 10;
  let isLoading = false;

  async function loadPosts() {
    if (isLoading) return;
    isLoading = true;

    try {
      const api =
        `https://lampost.co/microweb/ubl/wp-json/wp/v2/posts` +
        `?per_page=${perPage}&page=${page}&orderby=date&order=desc&_embed`;

      const res = await fetch(api);
      if (!res.ok) throw new Error('Gagal mengambil API');

      const posts = await res.json();

      if (posts.length === 0) {
        loadMoreBtn.style.display = 'none';
        return;
      }

      let output = '';

      posts.forEach(post => {

        const link = post.link;
        const judul = post.title.rendered;

        const category =
          post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Teknokrat';

        const media =
          post._embedded?.['wp:featuredmedia']?.[0];

        const gambar =
          media?.source_url || 'image/ai.jpg';

        const tanggal = new Date(post.date)
          .toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });

        output += `
          <a href="berita.ubl.html?id=${post.id}" class="item-info">
            <img
              src="${gambar}"
              alt="${judul}"
              class="img-ubl"
              loading="lazy">
            <div class="berita-microweb">
              <p class="judul-ubl">${judul}</p>
              <div class="info-microweb">
                <p class="tanggal">${tanggal}</p>
                <p class="kategori">${category}</p>
              </div>
            </div>
          </a>
        `;
      });

      container.insertAdjacentHTML('beforeend', output);
      page++;

    } catch (err) {
      console.error('API gagal dimuat:', err);
      loadMoreBtn.style.display = 'none';
    } finally {
      isLoading = false;
    }
  }

  // Load pertama
  loadPosts();

  // Klik tombol → load 10 lagi
  loadMoreBtn.addEventListener('click', loadPosts);

});
