document.addEventListener('DOMContentLoaded', async () => {

  const berita = document.getElementById('berita');
  if (!berita) return;

  const query = window.location.search.substring(1);
  const [kategoriSlug, slug] = query.split('|');

  if (!slug) {
    berita.innerHTML = '<p>Berita tidak ditemukan</p>';
    return;
  }

  try {
    const res = await fetch(`https://lampost.co/wp-json/wp/v2/posts?slug=${slug}&_embed`);
    if (!res.ok) throw new Error('Gagal ambil berita');

    const posts = await res.json();
    if (!posts.length) throw new Error('Berita tidak ada');

    const post = posts[0];

    // Judul
    document.querySelector('.judul-berita').innerHTML = post.title.rendered;

    // Editor & Tanggal
    document.getElementById('editor').innerText = post._embedded?.author?.[0]?.name || 'Redaksi';
    document.getElementById('tanggal').innerText = new Date(post.date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Kategori
    const kategoriEl = document.getElementById('kategori');
    if (kategoriEl)
      kategoriEl.innerText = post._embedded?.['wp:term']?.[0]?.[0]?.name || kategoriSlug || 'Berita';

    // Konten
    const isi = document.querySelector('.isi-berita');
    isi.innerHTML = post.content.rendered || '';

    // ===========================
    // Manual mapping slug -> YouTube videoId
    // ===========================
    const videoIdMap = {
      'kpk-endus-aroma-korupsi-ada-bau-busuk-kuota-haji': 'HOterxKOtXE',
      'menteri-purbaya-masih-pakai-gaya-koboi-bagaimana-respon-prabowo': 'm5nnBanrkYo',
      'ruu-tni-kebangkitan-dwifungsi-abri-ancaman-demokrasi': 'vBwNCV0nS_4',
      'politik-nasi-goreng-jalan-konsolidasi-prabowo-megawati': 'AxsUHgzTWes',
      'ada-apa-dibalik-vonis-ringan-kasus-korupsi-timah': 'qxbIf6r6U84',
      'prabowo-wacanakan-akan-maafkan-koruptor-asal-uang-negara-kembali-apa-rakyat-indonesia-setuju': 'nMlvqLRkzjo',
      'hari-santri-nasional-i-kemandirian-pesantren-menuju-indonesia-maju-bedah-tajuk-lampung-post': 'yJ9-aAqINKU', // contoh
      // tambahkan slug lain di sini jika ada
    };

    const videoId = videoIdMap[slug];

    if (videoId) {
      // Buat div thumbnail
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'yt-thumbnail';
      thumbDiv.style.backgroundImage = `url('https://i.ytimg.com/vi/${videoId}/sddefault.jpg')`;
      thumbDiv.style.cursor = 'pointer';
      thumbDiv.style.width = '100%';
      thumbDiv.style.paddingTop = '56.25%'; // 16:9 ratio
      thumbDiv.style.backgroundSize = 'cover';
      thumbDiv.style.backgroundPosition = 'center';
      thumbDiv.style.position = 'relative';
      thumbDiv.style.marginBottom = '1rem';

      // Play icon overlay
      const playIcon = document.createElement('div');
      playIcon.textContent = '▶';
      playIcon.style.position = 'absolute';
      playIcon.style.top = '50%';
      playIcon.style.left = '50%';
      playIcon.style.transform = 'translate(-50%, -50%)';
      playIcon.style.fontSize = '3rem';
      playIcon.style.color = 'white';
      playIcon.style.textShadow = '0 0 5px black';
      thumbDiv.appendChild(playIcon);

      // Klik thumbnail → tampilkan iframe embed YouTube
      thumbDiv.addEventListener('click', () => {
        const iframeWrapper = document.createElement('div');
        iframeWrapper.style.position = 'relative';
        iframeWrapper.style.width = '100%';
        iframeWrapper.style.paddingBottom = '56.25%';

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.border = '0';

        iframeWrapper.appendChild(iframe);
        thumbDiv.replaceWith(iframeWrapper);
      });

      // Tambahkan thumbnail di atas konten
      isi.prepend(thumbDiv);
    }

    // Buat semua gambar di konten responsive
    isi.querySelectorAll('img').forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    });

  } catch (err) {
    console.error(err);
    berita.innerHTML = '<p>Gagal memuat berita</p>';
  }

});
