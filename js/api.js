document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.info');
  if (!container) return;

  const API_URL =
    'https://lampost.co/wp-json/wp/v2/posts?per_page=20&orderby=date&order=desc&_embed';

  // ===============================
  // FUNGSI WAKTU RELATIF
  // ===============================
  function waktuYangLalu(dateString) {
    const sekarang = new Date();
    const waktuPost = new Date(dateString);
    const selisih = Math.floor((sekarang - waktuPost) / 1000);

    if (selisih < 60) return `${selisih} detik yang lalu`;

    const menit = Math.floor(selisih / 60);
    if (menit < 60) return `${menit} menit yang lalu`;

    const jam = Math.floor(menit / 60);
    if (jam < 24) return `${jam} jam yang lalu`;

    const hari = Math.floor(jam / 24);
    if (hari < 7) return `${hari} hari yang lalu`;

    const minggu = Math.floor(hari / 7);
    if (minggu < 4) return `${minggu} minggu yang lalu`;

    const bulan = Math.floor(hari / 30);
    if (bulan < 12) return `${bulan} bulan yang lalu`;

    const tahun = Math.floor(hari / 365);
    return `${tahun} tahun yang lalu`;
  }

  // ===============================
  // FETCH DATA BERITA
  // ===============================
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

        // waktu relatif
        const waktu = waktuYangLalu(post.date);

        html += `
          <a href="halaman.html?id=${post.id}" class="item-berita">
            <img src="${gambar}" alt="${judul}" loading="lazy">
            <div class="info-berita">
              <p class="kategori">${kategori}</p>
              <h3 class="judul">${judul}</h3>
              <p class="waktu">${waktu}</p>
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
