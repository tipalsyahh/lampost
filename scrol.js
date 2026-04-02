const btn = document.querySelector('.more-btn');
const extras = document.querySelectorAll('.extra-item');

btn.addEventListener('click', () => {
  extras.forEach(item => {
    item.classList.toggle('active');
  });
});