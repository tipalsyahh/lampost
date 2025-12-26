const cards = document.querySelectorAll('.card');
const detailImage = document.querySelector('.detail-image');
const detailText = document.querySelector('.detail-text');

cards.forEach(card => {
    card.addEventListener('click', () => {
        detailImage.innerHTML = `
            <img src="${card.dataset.image}" alt="${card.dataset.title}">
        `;

        detailText.innerHTML = `
            <h2>${card.dataset.title}</h2>
            <p>${card.dataset.content}</p>
        `;
    });
});
