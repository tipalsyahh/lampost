document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.info');
  if (!container) return;

  fetch('https://lampost.co/wp-json/wp/v2/posts?per_page=6&_embed')
    .then(res => res.json())
    .then(posts => {

      posts.forEach(post => {

        const judul = post.title.rendered;

        // kategori
        let kategori = 'Berita';
        if (post._embedded?.['wp:term']?.[0]?.[0]) {
          kategori = post._embedded['wp:term'][0][0].name;
        }

        // gambar
        let gambar = 'image/default.jpg';
        if (post._embedded?.['wp:featuredmedia']?.[0]) {
          gambar = post._embedded['wp:featuredmedia'][0].source_url;
        }

        container.innerHTML += `
          <a href="halaman.html?id=${post.id}">
            <img src="${gambar}" alt="${judul}">
            <div class="info-berita">
              <p>${kategori}</p>
              <h3>${judul}</h3>
              <h4>Baca Selengkapnya</h4>
            </div>
          </a>
        `;
      });

    })
    .catch(err => {
      console.error('Gagal load list berita:', err);
      container.innerHTML = 'Gagal memuat berita';
    });

});
