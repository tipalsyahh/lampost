document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.info');
  if (!container) return;

  fetch('https://lampost.co/wp-json/wp/v2/microweb?per_page=20&_embed')
    .then(res => res.json())
    .then(items => {

      let html = '';

      items.forEach(item => {
        const judul = item.title.rendered;
        const gambar =
          item._embedded?.['wp:featuredmedia']?.[0]?.source_url
          || 'image/default.jpg';

        html += `
          <a href="${item.link}" target="_blank">
            <img src="${gambar}" alt="${judul}">
            <h3>${judul}</h3>
          </a>
        `;
      });

      container.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = 'Gagal memuat microsite';
    });

});
