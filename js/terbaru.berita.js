document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.terbaru');
  if (!container) return;

  const API =
    'https://lampost.co/wp-json/wp/v2/posts' +
    '?per_page=6&orderby=date&order=desc&_embed';

  /* ================= CACHE ================= */
  const catCache = {};

  const formatTanggal = dateString =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

  function getCategory(post) {
    const cat =
      post._embedded?.['wp:term']?.[0]?.[0];

    return {
      name: cat?.name || 'Teknokrat',
      slug: cat?.slug || 'teknokrat'
    };
  }

  async function loadPosts() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Fetch error');

      const posts = await res.json();
      const htmlArr = [];

      posts.forEach(post => {

        const judul = post.title.rendered;
        const slug = post.slug;
        const tanggal = formatTanggal(post.date);

        const id = `terbaru-${post.id}`;

        // 🔥 AMBIL CEPAT (EMBED → TIDAK BLOCKING)
        const gambar =
          post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          'image/ai.jpg';

        // 🔥 TAMPILKAN LANGSUNG
        htmlArr.push(`
          <a href="#" class="item-microweb" id="${id}">
            <img
              src="${gambar}"
              alt="${judul}"
              class="img-terbaru-teknokrat"
              loading="lazy"
              decoding="async"
            >
            <div class="berita-microweb">
              <p class="judul-terbaru">${judul}</p>
              <div class="info-microweb">
                <p class="tanggal">${tanggal}</p>
              </div>
            </div>
          </a>
        `);

        // ⏳ LINK & KATEGORI (MENYUSUL, NON-BLOCKING)
        (async () => {
          const { name, slug: categorySlug } =
            getCategory(post);

          const el = document.getElementById(id);
          if (!el) return;

          el.href = `halaman.html?${categorySlug}/${slug}`;
        })();

      });

      container.innerHTML =
        htmlArr.join('') || '<p>Konten tidak tersedia</p>';

    } catch (err) {
      console.error('API gagal dimuat:', err);
      container.innerHTML = '<p>Konten gagal dimuat</p>';
    }
  }

  // 🚀 LOAD LANGSUNG
  loadPosts();

});