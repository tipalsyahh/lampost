document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.hukum');
  if (!container) return;

  try {
    // 1️⃣ Ambil ID kategori hukum dari slug
    const catRes = await fetch(
      'https://lampost.co/wp-json/wp/v2/categories?slug=hukum'
    );
    if (!catRes.ok) throw new Error('Gagal ambil kategori');

    const catData = await catRes.json();
    if (!catData.length) {
      container.insertAdjacentHTML(
        'beforeend',
        '<p>Kategori hukum tidak ditemukan</p>'
      );
      return;
    }

    const categoryId = catData[0].id;

    // 2️⃣ Ambil berita hukum
    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/posts?categories=${categoryId}&per_page=5&orderby=date&order=desc&_embed`
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
        <a href="halaman.html?id=${post.id}" class="item-hukum">
          <p><i class="bi bi-caret-right-fill"></i></p>
          <p>${judul}</p>
        </a>
      `;
    });

    // 🔥 Sisipkan hasil ke dalam section hukum
    container.insertAdjacentHTML('beforeend', html);

  } catch (err) {
    console.error(err);
    container.insertAdjacentHTML(
      'beforeend',
      '<p>Gagal memuat berita hukum</p>'
    );
  }

});
