const cards = document.querySelectorAll('.card');
const detailImage = document.querySelector('.detail-image');
const detailTitle = document.querySelector('.detail-title');
const detailContent = document.querySelector('.detail-content');
const detailAction = document.querySelector('.detail-action');

/* ===============================
   FUNGSI RENDER DETAIL
================================ */
function renderDetail(card) {
    // image
    detailImage.innerHTML = `
        <img src="${card.dataset.image}" alt="${card.dataset.title}">
    `;

    // title
    detailTitle.textContent = card.dataset.title;

    // content (100 karakter saja)
    const text = card.dataset.content;
    detailContent.textContent =
        text.length > 100 ? text.substring(0, 100) + '...' : text;

    // button redirect
    detailAction.innerHTML = `
        <button class="detail-btn">
            Baca Selengkapnya
        </button>
    `;

    // redirect ke halaman statis
    const btn = detailAction.querySelector('.detail-btn');
    btn.addEventListener('click', () => {
        window.location.href = card.dataset.link;
    });
}

/* ===============================
   CLICK CARD
================================ */
cards.forEach(card => {
    card.addEventListener('click', () => {
        renderDetail(card);
    });
});

/* ===============================
   LOAD RANDOM CARD SAAT PAGE LOAD
================================ */
window.addEventListener('DOMContentLoaded', () => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    renderDetail(cards[randomIndex]);
});
