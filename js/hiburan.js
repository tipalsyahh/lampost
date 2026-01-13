document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.hiburan');
  if (!container) return;

  try {
    // 1️⃣ Ambil ID kategori humaniora dari slug
    const catRes = await fetch(
      'https://lampost.co/wp-json/wp/v2/categories?slug=hiburan'
    );
    if (!catRes.ok) throw new Error('Gagal ambil kategori');

    const catData = await catRes.json();
    if (!catData.length) {
      container.insertAdjacentHTML(
        'beforeend',
        '<p>Kategori humaniora tidak ditemukan</p>'
      );
      return;
    }

    const categoryId = catData[0].id;

    // 2️⃣ Ambil berita humaniora
    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/posts?categories=${categoryId}&per_page=4&orderby=date&order=desc&_embed`
    );
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();

    let html = '';

    posts.forEach(post => {

      const judul = post.title.rendered;
      const tanggal = new Date(post.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const gambar =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || 'image/ai.jpg';

      html += `
        <a href="halaman.html?id=${post.id}" class="item-olahraga">
          <img src="${gambar}" alt="${judul}" class="img-olahraga" loading="lazy">
          <p class="judul">${judul}</p>
          <p class="tanggal">${tanggal}</p>
        </a>
      `;
    });

    // 🔥 Sisipkan hasil ke dalam section humaniora
    container.insertAdjacentHTML('beforeend', html);

  } catch (err) {
    console.error(err);
    container.insertAdjacentHTML(
      'beforeend',
      '<p>Gagal memuat berita humaniora</p>'
    );
  }

});
