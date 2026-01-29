document.addEventListener('DOMContentLoaded', () => {

  const heroMain = document.getElementById('hero-main');
  const heroSub1 = document.getElementById('hero-sub-1');
  const heroSub2 = document.getElementById('hero-sub-2');
  if (!heroMain || !heroSub1 || !heroSub2) return;

  const categoryCache = {};
  const mediaCache = {};
  const authorCache = {};

  const formatTanggal = d =>
    new Date(d).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  /* ===============================
     FETCH CATEGORY (CACHED)
  =============================== */
  async function getCategory(catId) {
    if (!catId) return { name: 'Berita', slug: 'berita' };
    if (categoryCache[catId]) return categoryCache[catId];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/categories/${catId}?_fields=name,slug`
    );
    const data = await res.json();

    return (categoryCache[catId] = {
      name: data.name,
      slug: data.slug
    });
  }

  /* ===============================
     FETCH MEDIA (CACHED)
  =============================== */
  async function getMedia(mediaId) {
    if (!mediaId) return 'image/ai.jpg';
    if (mediaCache[mediaId]) return mediaCache[mediaId];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/media/${mediaId}?_fields=source_url,media_details`
    );
    const data = await res.json();

    return (mediaCache[mediaId] =
      data.media_details?.sizes?.medium?.source_url ||
      data.source_url ||
      'image/ai.jpg'
    );
  }

  /* ===============================
     FETCH AUTHOR (CACHED)
  =============================== */
  async function getAuthor(authorId) {
    if (!authorId) return 'Redaksi';
    if (authorCache[authorId]) return authorCache[authorId];

    const res = await fetch(
      `https://lampost.co/wp-json/wp/v2/users/${authorId}?_fields=name`
    );
    const data = await res.json();

    return (authorCache[authorId] = data.name || 'Redaksi');
  }

  /* ===============================
     RENDER CEPAT (PLACEHOLDER)
  =============================== */
  function renderFast(el, post, isMain = false) {
    const judul = post.title.rendered;

    el.innerHTML = `
      <img src="image/ai.jpg" alt="${judul}" loading="lazy">
      <a href="#" class="hero-overlay">
        ${isMain ? `<span class="hero-category">...</span>` : ``}
        <h3 class="hero-title">${judul}</h3>
        ${
          isMain
            ? `<div class="hero-meta">
                 <span class="hero-editor">By ...</span>
                 <span class="hero-date">${formatTanggal(post.date)}</span>
               </div>`
            : ``
        }
      </a>
    `;
  }

  /* ===============================
     ENRICH DATA (ASYNC, CACHED)
  =============================== */
  async function enrich(el, post, isMain = false) {
    const img = await getMedia(post.featured_media);
    const { name, slug } =
      await getCategory(post.categories?.[0]);
    const editor = isMain
      ? await getAuthor(post.author)
      : null;

    el.querySelector('img').src = img;

    const a = el.querySelector('.hero-overlay');
    a.href = `halaman.html?${slug}/${post.slug}`;

    if (isMain) {
      a.querySelector('.hero-category').textContent = name;
      a.querySelector('.hero-editor').textContent = `By ${editor}`;
    }
  }

  /* ===============================
     INIT
  =============================== */
  async function init() {
    try {
      const res = await fetch(
        'https://lampost.co/wp-json/wp/v2/posts' +
        '?per_page=3&orderby=date&order=desc' +
        '&_fields=id,slug,title,date,featured_media,categories,author'
      );
      if (!res.ok) throw new Error();

      const posts = await res.json();
      if (posts.length < 3) return;

      renderFast(heroMain, posts[0], true);
      renderFast(heroSub1, posts[1], false);
      renderFast(heroSub2, posts[2], false);

      // ⏳ enrich paralel
      enrich(heroMain, posts[0], true);
      enrich(heroSub1, posts[1], false);
      enrich(heroSub2, posts[2], false);

    } catch (err) {
      console.error('Hero load gagal:', err);
    }
  }

  init();
});