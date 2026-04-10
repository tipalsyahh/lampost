const SIDEBAR = `
<nav class="navbar-main">
        <div class="navbar-padding">
            <div class="logo">
                <img src="image/lampost300.png (1).webp" alt="image" class="logo-img">
                <ul>
                    <li><a href="#" id="btnMenu">
                            <i class="bi bi-list"></i> Menu
                        </a></li>
                    <li><a href="harian">E-paper</a></li>
                    <li><a href="index">Beranda</a></li>
                </ul>
            </div>
            <div class="button-user">
                <a href="https://lampost.co/epaper/produk/lampung-post-digital-premium/" class="langganan">Langganan</a>
                <a href="https://lampost.co/epaper/my-account/?wcm_redirect_to=post&wcm_redirect_id=302927" class="login"><i class="bi bi-person-circle"></i>Masuk</a>
                <a href="https://lampost.co/epaper/produk/lampung-post-digital-premium/" class="login-mobile"><i class="bi bi-person-circle"></i></a>
                <a href="#" id="btnMenu" class="menu-mobile">
                    <i class="bi bi-list"></i>
                </a>
            </div>
        </div>
    </nav>
    <nav class="navbar-sub">
        <ul>
            <li><a href="kategori/olahraga/bola">Bola</a></li>
            <li><a href="kategori/pendidikan">Pendidikan</a></li>
            <li class="has-sub">
                <a href="#">Kolom</a>
                <ul class="sub-menu" id="kolom">
                    <li><a href="kategori/opini">Opini</a></li>
                    <li><a href="kategori/refleksi">Refleksi</a></li>
                    <li><a href="kategori/nuansa">Nuansa</a></li>
                    <li><a href="kategori/tajuk-lampung-post">Tajuk</a></li>
                    <li><a href="kategori/forum-guru">Forum Guru</a></li>
                </ul>
            </li>
            <li class="has-sub">
                <a href="#">Video</a>
                <ul class="sub-menu" id="vidio">
                    <li><a href="#">Breking New</a></li>
                    <li><a href="kategori/vidio/bedah-tajuk">Bedah Tajuk</a></li>
                    <li><a href="#">Economic Corner</a></li>
                    <li><a href="#">Podcast</a></li>
                </ul>
            </li>
            <li><a href="kategori/teknologi">Teknologi</a></li>
            <li class="has-sub">
                <a href="#">Ekonomi</a>
                <ul class="sub-menu">
                    <li><a href="microweb/bankindonesialampung">Bank Indonesia Lampung</a></li>
                    <li><a href="microweb/bsi">Bank Syariah Indonesia</a></li>
                    <li><a href="microweb/banklampung">Bank Lampung</a></li>
                    <li><a href="kategori/otomotif">Otomotif</a></li>
                </ul>
            </li>
            <li class="has-sub">
                <a href="#">Lampung</a>
                <ul class="sub-menu">
                    <li><a href="kategori/lampung/bandar-lampung">Bandar Lampung</a></li>
                    <li><a href="microweb/pemprovlampung">Pemprov Lampung</a></li>
                    <li><a href="kategori/lampung/lampung-barat">Lampung Barat</a></li>
                    <li><a href="kategori/lampung/lampung-timur">Lampung Timur</a></li>
                      <li><a href="/kategori/lampung/lampung-selatan">Lampung Selatan</a></li>
                    <li><a href="/kategori/lampung/lampung-tengah">Lampung Tengah</a></li>
                    <li><a href="/kategori/lampung/lampung-utara">Lampung Utara</a></li>
                    <li><a href="/kategori/lampung/pringsewu">Pringsewu</a></li>
                    <li><a href="/kategori/lampung/pesawaran">Pesawaran</a></li>
                    <li><a href="/kategori/lampung/mesuji">Mesuji</a></li>
                    <li><a href="/kategori/lampung/tanggamus">Tanggamus</a></li>
                    <li><a href="/kategori/lampung/metro">Metro</a></li>
                    <li><a href="/kategori/lampung/tulang-bawang">Tulang Bawang</a></li>
                    <li><a href="/kategori/lampung/tulang-bawang-barat">Tulang Bawang Barat</a></li>
                    <li><a href="/kategori/lampung/way-kanan">Way Kanan</a></li>
                    <li><a href="/kategori/lampung/pesisir-barat">Pesisir Barat</a></li>
                </ul>
            </li>
            <li id="link-mobile"><a href="kategori/lampung/bandar-lampung">Bandar Lampung</a></li>
            <li id="link-mobile"><a href="microweb/pemprovlampung">Pemprov Lampung</a></li>
            <li id="link-mobile"><a href="kategori/lampung/lampung-barat">Lampung Barat</a></li>
            <li id="link-mobile"><a href="kategori/lampung/lampung-timur">Lampung Timur</a></li>
            <li><a href="#">Tokoh</a></li>
            <li><a href="indeks">Indeks</a></li>
        </ul>
    </nav>
    <div id="overlay" class="overlay"></div>

    <div id="sidebar" class="sidebar">
        <center>
            <h2>MENU</h2>
        </center>
        <div class="search-sidebar" id="searchSidebar">
            <div class="input-menu">
                <input type="search" class="search-input" placeholder="Cari Artikel Disini.." aria-label="Search"
                    id="input-sidebar">
                <button type="button" class="search-btn" aria-label="Search" id="btn-sidebar-search">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </div>
        <div class="sidebar-isi">
            <ul>
                <li><a href="index"><i class="bi bi-house-door"></i> Beranda</a></li>
                <li><a href="harian"><i class="bi bi-calendar3"></i> Epaper</a></li>
                <li><a href="#"><i class="bi bi-newspaper"></i> Infografik</a></li></br>
                <li class="menu-sidebar">
                    <a href="#">
                        <i class="bi bi-book-half"></i>
                        <span class="menu-text">Microsite</span>
                        <span class="icon-toggle">
                            <i class="bi bi-chevron-down icon-down"></i>
                            <i class="bi bi-chevron-up icon-up"></i>
                        </span>
                    </a>
                    <ul class="dropdown-sidebar">
                        <li><a href="microweb/teknokrat">Universitas Teknokrat Indonesia</a></li>
                        <li><a href="microweb/unila">Universitas Lampung</a></li>
                        <li><a href="microweb/ubl">UBL</a></li>
                        <li><a href="microweb/stiab">STIAB</a></li>
                    </ul>
                </li>
                <li class="menu-sidebar">
                    <a href="#">
                        <i class="bi bi-newspaper"></i>
                        <span class="menu-text">Kolom</span>
                        <span class="icon-toggle">
                            <i class="bi bi-chevron-down icon-down"></i>
                            <i class="bi bi-chevron-up icon-up"></i>
                        </span>
                    </a>
                    <ul class="dropdown-sidebar">
                        <li><a href="kategori/opini">Opini</a></li>
                        <li><a href="kategori/refleksi">Refleksi</a></li>
                        <li><a href="kategori/nuansa">Nuansa</a></li>
                        <li><a href="kategori/tajuk-lampung-post">Tajuk</a></li>
                        <li><a href="kategori/forum-guru">Forum Guru</a></li>
                    </ul>
                </li>
                <li class="menu-sidebar">
                    <a href="#">
                        <i class="bi bi-camera-video"></i>
                        <span class="menu-text">Vidio</span>
                        <span class="icon-toggle">
                            <i class="bi bi-chevron-down icon-down"></i>
                            <i class="bi bi-chevron-up icon-up"></i>
                        </span>
                    </a>
                    <ul class="dropdown-sidebar">
                        <li><a href="#">Breking New</a></li>
                        <li><a href="kategori/vidio/bedah-tajuk">Bedah Tajuk</a></li>
                        <li><a href="#">Economic Corner</a></li>
                        <li><a href="#">Podcash</a></li>
                    </ul>
                </li>
                <li class="menu-sidebar">
                    <a href="#">
                        <i class="bi bi-bank"></i>
                        <span class="menu-text">Ekonomi</span>
                        <span class="icon-toggle">
                            <i class="bi bi-chevron-down icon-down"></i>
                            <i class="bi bi-chevron-up icon-up"></i>
                        </span>
                    </a>
                    <ul class="dropdown-sidebar">
                        <li><a href="microweb/bankindonesialampung">Bank Indonesia Lampung</a></li>
                        <li><a href="microweb/bsi">Bank Syariah Indonesia</a></li>
                        <li><a href="microweb/banklampung">Bank Lampung</a></li>
                        <li><a href="kategori/otomotif">Otomotif</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
`;

document.getElementById("sidebar-container").innerHTML = SIDEBAR;