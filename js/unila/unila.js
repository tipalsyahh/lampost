document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.home');
  const loadMoreBtn = document.getElementById('loadMore');
  if (!container || !loadMoreBtn) return;

  const PER_PAGE = 10;
  let page = 1;
  let isLoading = false;
  let hasMore = true;

  async function fetchPosts(url) {
    try {
      // Jika origin file:// atau online, pakai proxy untuk file://
      if (location.protocol === 'file:') {
        const proxy = 'https://api.allorigins.win/get?url=';
        const res = await fetch(proxy + encodeURIComponent(url));
        if (!res.ok) throw new Error('Proxy API gagal');
        const data = await res.json();
        return JSON.parse(data.contents);
      } else {
        const res = await fetch(url);
        if (!res.ok) throw new Error('API gagal');
        return await res.json();
      }
    } catch (err) {
      console.error('Error fetchPosts:', err);
      return [];
    }
  }

  async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
      const apiUrl =
        'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts' +
        `?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&_embed`;

      const posts = await fetchPosts(apiUrl);

      if (!posts.length) {
        hasMore = false;
        loadMoreBtn.style.display = 'none';
        return;
      }

      let output = '';

      posts.forEach(post => {
        const judul = post.title?.rendered || 'Tidak ada judul';
        const slug = post.slug || '';

        // Kategori
        let kategori = 'Universitaslampung';
        let kategoriSlug = 'Universitaslampung';
        try {
          const terms = post._embedded?.['wp:term']?.[0];
          if (terms && terms.length) {
            kategori = terms[0].name || kategori;
            kategoriSlug = terms[0].slug || kategoriSlug;
          }
        } catch {}

        // Link
        const link = `berita.unila.html?${kategoriSlug}|${slug}`;

        // Deskripsi
        let deskripsi = post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '';
        if (deskripsi.length > 150) deskripsi = deskripsi.slice(0, 150) + '...';

        // Gambar
        const gambar = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/ai.jpg';

        // Tanggal
        const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        // Editor
        const editor = post._embedded?.author?.[0]?.name || 'Redaksi';

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
      console.error('Error loadPosts:', err);
    } finally {
      isLoading = false;
    }
  }

  // Load awal
  loadPosts();

  // Load more
  loadMoreBtn.addEventListener('click', loadPosts);

});
