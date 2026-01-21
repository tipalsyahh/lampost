document.addEventListener('DOMContentLoaded', async () => {

  const berita = document.getElementById('berita');
  if (!berita) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('judul');

  if (!slug) {
    berita.innerHTML = '<p>Berita tidak ditemukan</p>';
    return;
  }

  try {
    const api =
      `https://lampost.co/microweb/teknokrat/wp-json/wp/v2/posts?slug=${slug}&_embed`;

    const res = await fetch(api);
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();
    if (!posts.length) throw new Error('Berita tidak ada');

    const post = posts[0];

    document.querySelector('.judul-berita').innerHTML =
      post.title.rendered;

    document.querySelector('.isi-berita').innerHTML =
      post.content.rendered;

    document.querySelector('.gambar-berita').src =
      post._embedded?.['wp:featuredmedia']?.[0]?.source_url
      || 'image/default.jpg';

    document.getElementById('tanggal').innerText =
      new Date(post.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

    const editor = document.getElementById('editor');
    if (editor) {
      editor.innerText =
        post._embedded?.author?.[0]?.name || 'Redaksi';
    }

  } catch (err) {
    console.error(err);
    berita.innerHTML = '<p>Gagal memuat berita</p>';
  }

});
