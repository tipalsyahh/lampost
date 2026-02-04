document.addEventListener('DOMContentLoaded',()=>{

document.querySelectorAll('.navbar-sub ul li > a').forEach(a=>{

a.addEventListener('touchstart',e=>{

const li=a.parentElement;
const open=li.classList.contains('active');

document.querySelectorAll('.navbar-sub li')
.forEach(x=>x.classList.remove('active'));

if(!open){
e.preventDefault();
li.classList.add('active');
}

},{passive:false});

});

document.addEventListener('touchstart',e=>{
if(!e.target.closest('.navbar-sub')){
document.querySelectorAll('.navbar-sub li')
.forEach(x=>x.classList.remove('active'));
}
});

});