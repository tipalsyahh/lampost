document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.home');
  const loadMoreBtn = document.getElementById('loadMore');
  if (!container || !loadMoreBtn) return;

  const PER_PAGE = 10;
  let page = 1;
  let isLoading = false;
  let hasMore = true;

  const BASE_API = 'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts';

  async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
      // Tetap pakai _embed untuk featured media, author, kategori
      const api = `${BASE_API}?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&_embed`;

      // Fetch langsung tanpa proxy
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

      // ⚡ Gunakan DocumentFragment agar append ke DOM sekali
      const fragment = document.createDocumentFragment();

      posts.forEach(post => {
        const kategoriNama = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Unila';
        const kategoriSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'unila';
        const kategoriUrl = `kategori.unila.html?kategori=${kategoriSlug}`;

        const judul = post.title.rendered;
        const slug = post.slug;
        const link = `berita.unila.html?berita-terkini|${slug}`;

        let deskripsi = post.excerpt?.rendered?.replace(/<[^>]+>/g, '')?.trim() || '';
        if (deskripsi.length > 150) deskripsi = deskripsi.slice(0, 150) + '...';

        // Ambil gambar dari featured media
        const gambar = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/ai.jpg';

        const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        const editor = post._embedded?.author?.[0]?.name || 'Redaksi';

        // ===== DOM =====
        const linkEl = document.createElement('a');
        linkEl.href = link;
        linkEl.className = 'item-info';

        const img = document.createElement('img');
        img.src = gambar;
        img.alt = judul;
        img.className = 'img-microweb';
        img.loading = 'lazy';

        const beritaDiv = document.createElement('div');
        beritaDiv.className = 'berita-microweb';

        const judulP = document.createElement('p');
        judulP.className = 'judul';
        judulP.textContent = judul;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-microweb';

        const editorP = document.createElement('p');
        editorP.className = 'editor';
        editorP.textContent = `By ${editor}`;

        const tanggalP = document.createElement('p');
        tanggalP.className = 'tanggal';
        tanggalP.textContent = tanggal;

        const kategoriLink = document.createElement('a');
        kategoriLink.href = kategoriUrl;
        kategoriLink.className = 'kategori';
        kategoriLink.textContent = kategoriNama;

        infoDiv.append(editorP, tanggalP, kategoriLink);

        const deskripsiP = document.createElement('p');
        deskripsiP.className = 'deskripsi';
        deskripsiP.textContent = deskripsi;

        beritaDiv.append(judulP, infoDiv, deskripsiP);
        linkEl.append(img, beritaDiv);

        fragment.appendChild(linkEl);
      });

      container.appendChild(fragment);
      page++;

    } catch (err) {
      console.error('Gagal load berita Unila:', err);
    } finally {
      isLoading = false;
    }
  }

  // Load awal
  loadPosts();

  // Load more
  loadMoreBtn.addEventListener('click', loadPosts);
});
