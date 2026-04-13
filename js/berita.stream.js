document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.list-radio');
  const loadMoreBtn = document.getElementById('loadMore');
  if (!container || !loadMoreBtn) return;

  const PER_PAGE = 6;
  const MAX_PAGE = 6;

  let page = 1;
  let isLoading = false;
  let hasMore = true;
  let kategoriId = null;

  const mediaCache = {};
  const editorCache = {};

  (async () => {
    try {
      const res = await fetch('https://lampost.co/wp-json/wp/v2/categories?slug=hiburan');
      const data = await res.json();
      kategoriId = data?.[0]?.id;

      if (!kategoriId) {
        container.innerHTML = '<p>Kategori hiburan tidak ditemukan</p>';
        return;
      }

      loadPosts();
    } catch {
      container.innerHTML = '<p>Kategori tidak tersedia</p>';
    }
  })();

  async function getMedia(id){
    if(!id) return 'image/ai.jpg';
    if(mediaCache[id]) return mediaCache[id];

    try{
      const res = await fetch(`https://lampost.co/wp-json/wp/v2/media/${id}`);
      const data = await res.json();
      return mediaCache[id] = data.source_url || 'image/ai.jpg';
    }catch{
      return 'image/ai.jpg';
    }
  }

  async function getEditor(post){
    let editor = 'Redaksi';
    const link = post._links?.['wp:term']?.[2]?.href;
    if(!link) return editor;
    if(editorCache[link]) return editorCache[link];

    try{
      const res = await fetch(link);
      const data = await res.json();
      editor = data?.[0]?.name || editor;
      editorCache[link] = editor;
    }catch{}

    return editor;
  }

  async function loadPosts(){

    if(isLoading || !hasMore || page > MAX_PAGE){
      loadMoreBtn.style.display = 'none';
      return;
    }

    isLoading = true;
    loadMoreBtn.textContent = 'Loading...';

    try{

      const res = await fetch(
        `https://lampost.co/wp-json/wp/v2/posts?categories=${kategoriId}&per_page=${PER_PAGE}&page=${page}`
      );

      if(!res.ok){
        hasMore = false;
        loadMoreBtn.style.display = 'none';
        return;
      }

      const posts = await res.json();

      const html = posts.map(post => {
        const id = `post-${post.id}`;
        return `
        <a href="halaman.html?hiburan/${post.slug}" class="item-radio" id="${id}">
            <img src="image/ai.jpg" class="img-radio">
            <div class="berita-radio">
                <p class="kategori">Hiburan</p>
                <p class="judul">${post.title.rendered}</p>
                <p class="editor">By ...</p>
            </div>
        </a>`;
      }).join('');

      container.insertAdjacentHTML('beforeend', html);

      posts.forEach(async post => {
        const el = document.getElementById(`post-${post.id}`);
        if(!el) return;

        const img = await getMedia(post.featured_media);
        const editor = await getEditor(post);

        el.querySelector('img').src = img;
        el.querySelector('.editor').textContent = `By ${editor}`;
      });

      page++;

    }catch(e){
      console.error(e);
    }

    isLoading = false;
    loadMoreBtn.textContent = 'Load More';
  }

  loadMoreBtn.addEventListener('click', loadPosts);

});