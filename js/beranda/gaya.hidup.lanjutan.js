document.addEventListener('DOMContentLoaded', async () => {

    const container = document.querySelector('.prestasi-lanjutan');
    if (!container) return;

    try {
        // ===============================
        // 1️⃣ AMBIL ID KATEGORI NASIONAL
        // ===============================
        const catRes = await fetch(
            'https://lampost.co/wp-json/wp/v2/categories?slug=nasional'
        );
        if (!catRes.ok) throw new Error('Gagal ambil kategori');

        const catData = await catRes.json();
        if (!catData.length) {
            container.insertAdjacentHTML(
                'beforeend',
                '<p>Kategori tidak ditemukan</p>'
            );
            return;
        }

        const categoryId = catData[0].id;

        // ===============================
        // 2️⃣ AMBIL BERITA (MULAI DARI KE-3)
        // ===============================
        const res = await fetch(
            `https://lampost.co/wp-json/wp/v2/posts?categories=${categoryId}&offset=2&per_page=6&orderby=date&order=desc&_embed`
        );
        if (!res.ok) throw new Error('Gagal ambil berita');

        const posts = await res.json();

        let html = '';

        posts.forEach(post => {

            const judul = post.title.rendered;

            const kategoriNama =
                post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Nasional';

            const kategoriSlug =
                post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'berita';

            const link = `halaman.html?${kategoriSlug}|${post.slug}`;

            const d = new Date(post.date);
            const tanggal = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

            const editor =
                post._embedded?.['wp:term']?.[2]?.[0]?.name || 'Redaksi';

            const deskripsi =
                (post.excerpt?.rendered || '')
                    .replace(/(<([^>]+)>)/gi, '')
                    .trim()
                    .substring(0, 150) + '...';

            html += `
                <a href="${link}" class="item-info">
                  <div class="berita-unila">
                    <p class="judul-unila-lanjutan">${judul}</p>
                    <p class="kategori">${kategoriNama}</p>
                    <div class="info-microweb">
                      <p class="editor-kkn">By ${editor}</p>
                      <p class="tanggal">${tanggal}</p>
                    </div>
                    <p class="deskripsi-unila-lanjutan">${deskripsi}</p>
                  </div>
                </a>
            `;
        });

        // ===============================
        // 3️⃣ SISIPKAN KE DOM
        // ===============================
        container.insertAdjacentHTML('beforeend', html);

    } catch (err) {
        console.error(err);
        container.insertAdjacentHTML(
            'beforeend',
            '<p>Gagal memuat berita</p>'
        );
    }

});
