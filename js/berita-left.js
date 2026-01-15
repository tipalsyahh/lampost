document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.card-berita');
  const detailBox = document.querySelector('.card-detail');

  if (!container || !detailBox) return;

  const detailImage = detailBox.querySelector('.detail-image');
  const detailTitle = detailBox.querySelector('.detail-title');
  const detailContent = detailBox.querySelector('.detail-content');
  const detailAction = detailBox.querySelector('.detail-action');

  try {
    // 1️⃣ Ambil kategori e-paper
    const catRes = await fetch(
      'https://lampost.co/epaper/wp-json/wp/v2/categories?slug=e-paper'
    );

    if (!catRes.ok) throw new Error('Kategori gagal diambil');

    const catData = await catRes.json();
    if (!catData.length) {
      container.insertAdjacentHTML(
        'beforeend',
        '<p>E-paper belum tersedia</p>'
      );
      return;
    }

    const categoryId = catData[0].id;

    // 2️⃣ Ambil post e-paper
    const res = await fetch(
      `https://lampost.co/epaper/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3&_embed`
    );

    if (!res.ok) throw new Error('Post gagal diambil');

    const posts = await res.json();
    if (!posts.length) {
      container.insertAdjacentHTML(
        'beforeend',
        '<p>E-paper kosong</p>'
      );
      return;
    }

    // 3️⃣ Render card
    let html = '';

    posts.forEach(post => {

      const title = post.title.rendered;
      const content = post.excerpt?.rendered
        ?.replace(/<[^>]*>/g, '')
        ?.trim() || '';

      const image =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || 'image/default.jpg';

      html += `
        <div class="card"
          data-id="${post.id}"
          data-title="${title}"
          data-content="${content}"
          data-image="${image}">
          <img src="${image}" alt="${title}" loading="lazy">
          <p>${title}</p>
        </div>
      `;
    });

    container.innerHTML = html;

    // 4️⃣ Detail random (sama seperti logika awal)
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    detailImage.innerHTML = `<img src="${
      randomPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'image/default.jpg'
    }">`;

    detailTitle.textContent = randomPost.title.rendered;
    detailContent.textContent = randomPost.excerpt?.rendered
      ?.replace(/<[^>]*>/g, '')
      ?.trim();

    detailAction.innerHTML = `
      <a href="koran.html?id=${randomPost.id}" class="detail-btn">
        Baca Selengkapnya
      </a>
    `;

    detailBox.classList.add('active');

    // 5️⃣ Klik card
    container.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (!card) return;

      detailImage.innerHTML = `<img src="${card.dataset.image}">`;
      detailTitle.textContent = card.dataset.title;
      detailContent.textContent = card.dataset.content;

      detailAction.innerHTML = `
        <a href="koran.html?id=${card.dataset.id}" class="detail-btn">
          Baca Selengkapnya
        </a>
      `;
    });

  } catch (err) {
    console.warn('EPAPER diblok oleh server (CORS)');

    // ✅ Fallback aman (TANPA mengubah script lain)
    container.insertAdjacentHTML(
      'beforeend',
      '<p style="opacity:.7">E-paper tidak dapat dimuat saat ini</p>'
    );
  }

});
