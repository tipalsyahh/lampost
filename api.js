document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.info');
  if (!container) return;

  const API_URL =
    'https://lampost.co/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed';

  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    })
    .then(posts => {

      let html = '';

      posts.forEach(post => {

        const judul = post.title.rendered;

        // kategori
        let kategori = 'Berita';
        if (post._embedded?.['wp:term']?.[0]?.[0]) {
          kategori = post._embedded['wp:term'][0][0].name;
        }

        // gambar
        const gambar =
          post._embedded?.['wp:featuredmedia']?.[0]?.source_url
          || 'image/default.jpg';

        html += `
          <a href="halaman.html?id=${post.id}" class="item-berita">
            <img src="${gambar}" alt="${judul}" loading="lazy">
            <div class="info-berita">
              <p>${kategori}</p>
              <h3>${judul}</h3>
              <h4>Baca Selengkapnya</h4>
            </div>
          </a>
        `;
      });

      container.innerHTML = html;

    })
    .catch(err => {
      console.error('Gagal load list berita:', err);
      container.innerHTML = 'Gagal memuat berita';
    });

});
