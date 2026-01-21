document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.terbaru');
  if (!container) return;

  try {
    const api =
      'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts' +
      '?filter[category_name]=inspirasi&per_page=6&orderby=date&order=desc&_embed';

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal mengambil API');

    const posts = await res.json();

    let output = '';

    posts.forEach(post => {

      const judul = post.title.rendered;

      let deskripsi =
        post.excerpt?.rendered
          ?.replace(/<[^>]+>/g, '')
          ?.trim() || '';

      if (deskripsi.length > 150) {
        deskripsi = deskripsi.slice(0, 150) + '...';
      }

      const category =
        post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Inspirasi';

      const media =
        post._embedded?.['wp:featuredmedia']?.[0];

      const gambar =
        media?.source_url || 'image/ai.jpg';

      const tanggal = new Date(post.date)
        .toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

      output += `
        <a href="berita.unila.html?id=${post.id}" class="item-microweb">
          <img src="${gambar}" alt="${judul}" class="img-terbaru" loading="lazy">
          <div class="berita-microweb">
            <p class="judul-terbaru">${judul}</p>
            <div class="info-microweb">
              <p class="tanggal">${tanggal}</p>
            </div>
          </div>
        </a>
      `;
    });

    container.innerHTML =
      output || '<p>Konten Inspirasi tidak tersedia</p>';

  } catch (err) {
    console.error('API gagal dimuat:', err);
    container.innerHTML =
      '<p>Konten gagal dimuat</p>';
  }

});
