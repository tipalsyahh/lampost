document.addEventListener('DOMContentLoaded', () => {
  const beritaLeft = document.querySelector('.berita-left');
  const container = document.querySelector('.container-beranda');

  if (!beritaLeft) return;

  let scrollLocked = false;

  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
    scrollLocked = true;
  };

  const unlockScroll = () => {
    document.body.style.overflow = '';
    scrollLocked = false;
  };

  window.addEventListener('scroll', () => {
    const leftRect = beritaLeft.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Jika bagian bawah .berita-left sudah menyentuh viewport
    if (leftRect.bottom <= viewportHeight && !scrollLocked) {
      lockScroll();
    }

    // Jika scroll naik lagi (opsional, agar bisa aktif lagi)
    if (leftRect.bottom > viewportHeight && scrollLocked) {
      unlockScroll();
    }
  });
});
