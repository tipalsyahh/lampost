document.addEventListener('DOMContentLoaded', () => {

    const container = document.querySelector('.showcase');
    if (!container) return;

    const PER_PAGE = 4;
    const API_BASE = 'https://lampost.co/wp-json/wp/v2/posts?orderby=date&order=desc';

    const catCache = {};
    const mediaCache = {};

    const formatTanggal = dateString =>
        new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

    async function getCategory(catId) {
        if (!catId) return { name: 'Berita', slug: 'berita' };
        if (catCache[catId]) return catCache[catId];

        const res = await fetch(`https://lampost.co/wp-json/wp/v2/categories/${catId}`);
        const data = await res.json();

        return (catCache[catId] = {
            name: data.name,
            slug: data.slug
        });
    }

    async function getMedia(mediaId) {
        if (!mediaId) return 'image/default.jpg';
        if (mediaCache[mediaId]) return mediaCache[mediaId];

        try {
            const res = await fetch(`https://lampost.co/wp-json/wp/v2/media/${mediaId}`);
            if (res.ok) {
                const data = await res.json();
                mediaCache[mediaId] =
                    data.media_details?.sizes?.medium?.source_url ||
                    data.source_url ||
                    'image/default.jpg';
            }
        } catch { }

        return mediaCache[mediaId] || 'image/default.jpg';
    }

    function renderFast(post) {

        const judul = post.title.rendered;
        const tanggal = formatTanggal(post.date);
        const id = `card-${post.id}`;

        const deskripsi =
            post.excerpt?.rendered
                ?.replace(/(<([^>]+)>)/gi, '')
                ?.slice(0, 100);

        return `
      <div class="news-card-big" id="${id}">
        
        <div class="card-header">...</div>

        <img src="image/default.jpg" class="card-img">

        <div class="card-body">
          <h3 class="card-title">${judul}</h3>
          <p class="card-desc">${deskripsi}...</p>

          <ul class="card-list">
            <li>Memuat...</li>
          </ul>

          <div class="card-footer">
            <span>Lampost</span>
            <span>${tanggal}</span>
          </div>
        </div>

      </div>
    `;
    }

    async function enrich(post) {

        const el = document.getElementById(`card-${post.id}`);
        if (!el) return;

        const { name: kategori, slug } =
            await getCategory(post.categories?.[0]);

        const gambar = await getMedia(post.featured_media);

        el.querySelector('.card-header').textContent = kategori;
        el.querySelector('.card-img').src = gambar;

        // 🔥 ambil related berita
        let relatedHTML = '';

        try {
            const res = await fetch(
                `https://lampost.co/wp-json/wp/v2/posts?categories=${post.categories[0]}&per_page=4`
            );

            const related = await res.json();

            relatedHTML = related
                .filter(r => r.id !== post.id)
                .slice(0, 3)
                .map(r => {
                    return `
            <li>
              <a href="halaman.html?${slug}/${r.slug}" class="related-link">
                ${r.title.rendered}
              </a>
            </li>
          `;
                })
                .join('');

        } catch { }

        el.querySelector('.card-list').innerHTML = relatedHTML;

        // 🔥 stop bubble (biar klik list tidak trigger card)
        el.querySelectorAll('.related-link').forEach(link => {
            link.addEventListener('click', e => {
                e.stopPropagation();
            });
        });

        // klik card utama
        el.addEventListener('click', () => {
            window.location.href = `halaman.html?${slug}/${post.slug}`;
        });
    }

    async function init() {
        try {

            const catRes = await fetch(
                'https://lampost.co/wp-json/wp/v2/categories?slug=ekonomi-dan-bisnis'
            );

            const catData = await catRes.json();
            const id = catData[0].id;

            const res = await fetch(
                `${API_BASE}&categories=${id}&per_page=${PER_PAGE}`
            );

            const posts = await res.json();

            container.innerHTML = posts.map(renderFast).join('');

            posts.forEach(post => enrich(post));

        } catch {
            container.innerHTML = 'Gagal memuat berita';
        }
    }

    init();

});