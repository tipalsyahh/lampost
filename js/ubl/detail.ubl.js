document.addEventListener('DOMContentLoaded', () => {

  const berita = document.getElementById('berita');
  if (!berita) {
    console.log('Div #berita tidak ditemukan');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (!postId) {
    berita.innerHTML = 'ID berita tidak ditemukan';
    return;
  }

  const API_URL = `https://lampost.co/microweb/ubl/wp-json/wp/v2/posts/${postId}?_embed`;

  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error('Post tidak ditemukan');
      return res.json();
    })
    .then(post => {

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

    })
    .catch(err => {
      console.error(err);
      berita.innerHTML = 'Gagal memuat berita';
    });

});
