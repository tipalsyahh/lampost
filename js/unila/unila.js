document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.home');
  const loadMoreBtn = document.getElementById('loadMore');
  if (!container || !loadMoreBtn) return;

  const PER_PAGE = 10;
  let page = 1;
  let isLoading = false;
  let hasMore = true;

  async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
      const api =
        'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts' +
        `?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&_embed`;

      const res = await fetch(api);
      if (!res.ok) {
        if (res.status === 400) {
          hasMore = false;
          loadMoreBtn.style.display = 'none';
          return;
        }
        throw new Error('API gagal');
      }

      const posts = await res.json();

      if (!posts.length) {
        hasMore = false;
        loadMoreBtn.style.display = 'none';
        return;
      }

      let output = '';

      posts.forEach(post => {
        const judul = post.title.rendered;
        const slug = post.slug;

        // Kategori
        const kategori = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Unila';
        const kategoriSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'unila';

        // Link
        const link = `berita.unila.html?${kategoriSlug}|${slug}`;

        // Deskripsi
        let deskripsi = post.excerpt?.rendered?.replace(/<[^>]+>/g, '')?.trim() || '';
        if (deskripsi.length > 150) deskripsi = deskripsi.slice(0, 150) + '...';

        // Gambar dari _embedded
        const gambar = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/ai.jpg';

        // Tanggal
        const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        // Editor
        const editor = post._embedded?.author?.[0]?.name || 'Redaksi';

        // HTML output
        output += `
          <a href="${link}" class="item-info">
            <img src="${gambar}" alt="${judul}" class="img-microweb" loading="lazy">
            <div class="berita-microweb">
              <p class="judul">${judul}</p>
              <div class="info-microweb">
                <p class="editor">By ${editor}</p>
                <p class="tanggal">${tanggal}</p>
                <p class="kategori">${kategori}</p>
              </div>
              <p class="deskripsi">${deskripsi}</p>
            </div>
          </a>
        `;
      });

      container.insertAdjacentHTML('beforeend', output);
      page++;

    } catch (err) {
      console.error('Gagal load berita Unila:', err);
    } finally {
      isLoading = false;
    }
  }

  loadPosts();
  loadMoreBtn.addEventListener('click', loadPosts);

});
