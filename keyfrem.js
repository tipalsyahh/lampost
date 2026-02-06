document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.navbar-sub ul');
  if (!nav) return;

  const spacer = document.createElement('li');
  spacer.style.flex = '0 0 16px';
  spacer.style.listStyle = 'none';

  nav.appendChild(spacer);

});
