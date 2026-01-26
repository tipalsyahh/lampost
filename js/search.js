document.addEventListener('DOMContentLoaded', async () => {
    const searchTitle = document.querySelector('h2.search-title');
    if (!searchTitle) return;

    // Ambil query dari URL
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';

    // Set teks dinamis
    searchTitle.textContent = `Search Result for '${q}'`;

    const container = document.getElementById('search-results');
    if (!container) return;

    const query = decodeURIComponent(new URLSearchParams(window.location.search).get('q') || '').trim();
    const queryLower = query.toLowerCase();

    if (!query) {
        container.innerHTML = '<p>Masukkan kata kunci pencarian.</p>';
        return;
    }

    try {
        // Ambil 50 post saja agar cepat dan ringan
        const api = `https://lampost.co/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&_embed&per_page=50`;
        const res = await fetch(api);
        if (!res.ok) throw new Error('Gagal ambil data pencarian');

        const posts = await res.json();

        // Filter tambahan: cek judul atau deskripsi mengandung kata kunci
        const filteredPosts = posts.filter(post => {
            const judul = post.title.rendered.toLowerCase();
            const deskripsiRaw = post.excerpt?.rendered || post.content?.rendered || '';
            const deskripsi = deskripsiRaw.replace(/(<([^>]+)>)/gi, '').toLowerCase();
            return judul.includes(queryLower) || deskripsi.includes(queryLower);
        });

        if (!filteredPosts.length) {
            container.innerHTML = `<p>Tidak ada hasil untuk: <strong>${query}</strong></p>`;
            return;
        }

        container.innerHTML = filteredPosts.map(post => {
            const kategori = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Berita';
            const link = `halaman.html?${kategori}%7C${post.slug}`;
            const gambar = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/default.jpg';
            const judul = post.title.rendered;
            const editor = post._embedded?.['wp:term']?.[2]?.[0]?.name || 'Redaksi';
            const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
            const deskripsiRaw = post.excerpt?.rendered || post.content?.rendered || '';
            const deskripsi = deskripsiRaw.replace(/(<([^>]+)>)/gi, '').trim().substring(0, 150) + '...';

            return `
        <a href="${link}" class="item-info">
          <img src="${gambar}" alt="${judul}" class="img-microweb" loading="lazy">
          <div class="berita-microweb">
            <p class="judul">${judul}</p>
            <p class="kategori">${kategori}</p>
            <div class="info-microweb">
              <p class="editor">By ${editor}</p>
              <p class="tanggal">${tanggal}</p>
            </div>
            <p class="deskripsi">${deskripsi}</p>
          </div>
        </a>
      `;
        }).join('');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Gagal memuat hasil pencarian.</p>';
    }
});
