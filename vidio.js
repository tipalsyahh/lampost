const track = document.querySelector('.video-track');
const next = document.querySelector('.video-next');
const prev = document.querySelector('.video-prev');

let isMobile = window.innerWidth <= 768;

function initSlider() {
    if (window.innerWidth <= 768) {
        track.style.transform = 'none';
        return;
    }

    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + 15;
    const visible = 2;

    let index = visible;
    let isAnimating = false;

    const firstClones = cards.slice(0, visible).map(el => el.cloneNode(true));
    const lastClones = cards.slice(-visible).map(el => el.cloneNode(true));

    lastClones.reverse().forEach(clone => {
        track.insertBefore(clone, track.firstChild);
    });

    firstClones.forEach(clone => {
        track.appendChild(clone);
    });

    track.style.transform = `translateX(-${cardWidth * index}px)`;

    function slideNext() {
        if (isAnimating) return;
        isAnimating = true;

        index++;
        track.style.transition = '0.4s';
        track.style.transform = `translateX(-${cardWidth * index}px)`;

        setTimeout(() => {
            if (index >= cards.length + visible) {
                track.style.transition = 'none';
                index = visible;
                track.style.transform = `translateX(-${cardWidth * index}px)`;
            }
            isAnimating = false;
        }, 400);
    }

    function slidePrev() {
        if (isAnimating) return;
        isAnimating = true;

        index--;
        track.style.transition = '0.4s';
        track.style.transform = `translateX(-${cardWidth * index}px)`;

        setTimeout(() => {
            if (index < visible) {
                track.style.transition = 'none';
                index = cards.length + visible - 1;
                track.style.transform = `translateX(-${cardWidth * index}px)`;
            }
            isAnimating = false;
        }, 400);
    }

    next.onclick = slideNext;
    prev.onclick = slidePrev;

    /* 🔥 TAMBAHAN OPEN NEW TAB (TIDAK UBAH LOGIKA LAIN) */
    track.addEventListener('click', function(e) {
        const link = e.target.closest('.video-card');
        if (!link) return;

        e.preventDefault();
        window.open(link.href, '_blank');
    });
}

initSlider();