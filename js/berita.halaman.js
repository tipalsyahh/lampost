document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.home');
  const loadMoreBtn = document.getElementById('loadMore');

  if (!container) return;

  const PER_PAGE = 10;
  let page = 1;
  let isLoading = false;
  let hasMore = true;

  // Ambil kategori dari URL
  const query = decodeURIComponent(window.location.search.replace('?', ''));
  const kategoriSlugFromURL = query.split('|')[0];
  if (!kategoriSlugFromURL) return;

  // Ambil ID kategori WP
  let kategoriId = null;
  try {
    const catRes = await fetch('https://lampost.co/wp-json/wp/v2/categories');
    const catData = await catRes.json();
    const kategoriObj = catData.find(cat => cat.slug.toLowerCase() === kategoriSlugFromURL.toLowerCase());
    if (!kategoriObj) return;
    kategoriId = kategoriObj.id;
  } catch (err) {
    console.error('Gagal ambil kategori:', err);
    return;
  }

  async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
      const api = `https://lampost.co/wp-json/wp/v2/posts?categories=${kategoriId}&per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&_embed`;
      const res = await fetch(api);
      if (!res.ok) {
        if (res.status === 400) hasMore = false;
        return;
      }

      const posts = await res.json();
      if (!posts.length) {
        hasMore = false;
        return;
      }

      let output = '';

      posts.forEach(post => {
        const judul = post.title.rendered;
        const kategori = post._embedded?.['wp:term']?.[0]?.[0]?.name || kategoriSlugFromURL;
        const slug = post.slug; // simpan slug untuk redirect
        const link = `halaman.html?${kategoriSlugFromURL}`; // tampilkan kategori saja

        let deskripsi = post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '';
        if (deskripsi.length > 150) deskripsi = deskripsi.slice(0, 150) + '...';

        const gambar = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/ai.jpg';

        const d = new Date(post.date);
        const tanggal = `${String(d.getDate()).padStart(2,'0')}/` +
                         `${String(d.getMonth()+1).padStart(2,'0')}/` +
                         `${d.getFullYear()}`;

        const editors = post._embedded?.['wp:term']?.[2] || [];
        let editorText = '';
        if (!editors.length) editorText = 'by Redaksi';
        else if (editors.length === 1) editorText = `by ${editors[0].name}`;
        else if (editors.length === 2) editorText = `by ${editors[0].name} and ${editors[1].name}`;
        else {
          const allButLast = editors.slice(0,-1).map(e => e.name).join(', ');
          const last = editors[editors.length-1].name;
          editorText = `by ${allButLast}, and ${last}`;
        }

        output += `
          <a href="${link}" class="item-info" data-slug="${slug}">
            <img src="${gambar}" alt="${judul}" class="img-forum-guru" loading="lazy">
            <div class="berita-microweb">
              <p class="judul">${judul}</p>
              <p class="kategori">${kategori}</p>
              <div class="info-microweb">
                <p class="editor">${editorText}</p>
                <p class="tanggal">${tanggal}</p>
              </div>
              <p class="deskripsi">${deskripsi}</p>
            </div>
          </a>
        `;
      });

      container.insertAdjacentHTML('beforeend', output);

      // Tambahkan event listener untuk redirect ke slug
      container.querySelectorAll('a.item-info').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const slug = a.dataset.slug;
          const kategori = kategoriSlugFromURL;
          window.location.href = `halaman.html?${kategori}|${slug}`;
        });
      });

      page++;
    } catch (err) {
      console.error('Gagal load post:', err);
    } finally {
      isLoading = false;
    }
  }

  loadPosts();
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadPosts);
});
