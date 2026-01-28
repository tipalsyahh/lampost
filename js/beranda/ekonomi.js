document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.ekonomi');
  if (!container) return;

  const PER_PAGE = 5;

  /* ===============================
     API BASE (TANPA _embed)
  =============================== */
  const API_BASE =
    'https://lampost.co/wp-json/wp/v2/posts?orderby=date&order=desc';

  const catCache = {};
  const mediaCache = {};
  const termCache = {};

  /* ===============================
     FORMAT TANGGAL
  =============================== */
  const formatTanggal = dateString => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  /* ===============================
     AMBIL KATEGORI
  =============================== */
  async function getCategory(catId) {
    if (!catId) return { name: 'Berita', slug: 'berita' };
    if (catCache[catId]) return catCache[catId];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/categories/${catId}`
    );
    const data = await res.json();

    return (catCache[catId] = {
      name: data.name,
      slug: data.slug
    });
  }

  /* ===============================
     AMBIL GAMBAR
  =============================== */
  async function getMedia(mediaId) {
    if (!mediaId) return 'image/default.jpg';
    if (mediaCache[mediaId]) return mediaCache[mediaId];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/media/${mediaId}`
    );
    const data = await res.json();

    return (mediaCache[mediaId] =
      data.media_details?.sizes?.medium?.source_url ||
      data.source_url ||
      'image/default.jpg'
    );
  }

  /* ===============================
     AMBIL EDITOR (DARI wp:term)
  =============================== */
  async function getEditor(post) {
    let editor = 'Redaksi';

    const termLink = post._links?.['wp:term']?.[2]?.href;
    if (!termLink) return editor;

    if (termCache[termLink]) return termCache[termLink];

    try {
      const res = await fetch(termLink);
      if (res.ok) {
        const data = await res.json();
        editor = data?.[0]?.name || editor;
        termCache[termLink] = editor;
      }
    } catch (_) {}

    return editor;
  }

  /* ===============================
     AMBIL ID KATEGORI EKONOMI
  =============================== */
  let ekonomiID = null;

  try {
    const res = await fetch(
      'https://lampost.co/wp-json/wp/v2/categories?slug=ekonomi-dan-bisnis'
    );
    const data = await res.json();
    if (data[0]) ekonomiID = data[0].id;
  } catch (err) {
    container.innerHTML = 'Kategori tidak ditemukan';
    return;
  }

  if (!ekonomiID) {
    container.innerHTML = 'Kategori tidak ditemukan';
    return;
  }

  /* ===============================
     LOAD POST EKONOMI
  =============================== */
  try {
    const res = await fetch(
      `${API_BASE}&categories=${ekonomiID}&per_page=${PER_PAGE}`
    );
    if (!res.ok) throw new Error();

    const posts = await res.json();
    const htmlArr = [];

    const promises = posts.map(async post => {

      const judul = post.title.rendered;
      const tanggal = formatTanggal(post.date);

      const catId = post.categories?.[0];
      const { name: kategori, slug: kategoriSlug } =
        await getCategory(catId);

      const gambar = await getMedia(post.featured_media);
      const editor = await getEditor(post);

      const deskripsi =
        post.excerpt?.rendered
          ?.replace(/(<([^>]+)>)/gi, '')
          ?.slice(0, 120) + '...';

      const link = `halaman.html?${kategoriSlug}|${post.slug}`;

      htmlArr.push(`
        <a href="${link}" class="item-info">
            <img src="${gambar}" alt="${judul}" class="img-microweb-terbaru" loading="lazy">
            <div class="berita-detail">
              <p class="judul-ekonomi">${judul}</p>
              <p class="kategori">${kategori}</p>
              <div class="info-microweb">
                <p class="editor">Oleh ${editor}</p>
                <p class="tanggal">${tanggal}</p>
              </div>
              <p class="deskripsi">${deskripsi}</p>
            </div>
          </a>
      `);
    });

    await Promise.all(promises);
    container.innerHTML = htmlArr.join('');

  } catch (err) {
    console.error(err);
    container.innerHTML = 'Gagal memuat berita';
  }

});
