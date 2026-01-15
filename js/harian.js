document.addEventListener('DOMContentLoaded', async () => {

  const container = document.querySelector('.isi-berita');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (!postId) {
    container.innerHTML = '<p>ID berita tidak ditemukan.</p>';
    return;
  }

  try {
    const res = await fetch(
      `https://lampost.co/epaper/wp-json/wp/v2/posts/${postId}?_embed`
    );

    if (!res.ok) throw new Error('Response error');

    const post = await res.json();

    container.innerHTML = `
      <article>
        <h1>${post.title.rendered}</h1>
        ${
          post._embedded?.['wp:featuredmedia']?.[0]?.source_url
            ? `<img src="${post._embedded['wp:featuredmedia'][0].source_url}">`
            : ''
        }
        <div>${post.content.rendered}</div>
      </article>
    `;

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Gagal memuat berita.</p>';
  }

});
