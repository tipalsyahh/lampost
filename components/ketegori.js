const SIDEBAR = `
<nav class="navbar-main">
        <div class="navbar-padding">
            <div class="logo">
                <img src="../image/lampost300.png (1).webp" alt="image" class="logo-img">
                <ul>
                    <li><a href="#" id="btnMenu">
                            <i class="bi bi-list"></i> Menu
                        </a></li>
                    <li><a href="../harian">E-paper</a></li>
                    <li><a href="../index">Beranda</a></li>
                </ul>
            </div>
            <div class="button-user">
                <a href="#" class="langganan">Langganan</a>
                <a href="#" class="login"><i class="bi bi-person-circle"></i>Masuk</a>
                <a href="#" class="login-mobile"><i class="bi bi-person-circle"></i></a>
                <a href="#" id="btnMenu" class="menu-mobile">
                    <i class="bi bi-list"></i>
                </a>
            </div>
        </div>
    </nav>
    <nav class="navbar-sub">
        <ul>
            <li><a href="olahraga/bola">Bola</a></li>
            <li><a href="pendidikan">Pendidikan</a></li>
            <li class="has-sub">
                <a href="#">Kolom</a>
                <ul class="sub-menu" id="kolom">
                    <li><a href="opini">Opini</a></li>
                    <li><a href="refleksi">Refleksi</a></li>
                    <li><a href="nuansa">Nuansa</a></li>
                    <li><a href="tajuk-lampung-post">Tajuk</a></li>
                    <li><a href="forum-guru">Forum Guru</a></li>
                </ul>
            </li>
            <li class="has-sub">
                <a href="#">Video</a>
                <ul class="sub-menu" id="vidio">
                    <li><a href="#">Breking New</a></li>
                    <li><a href="../kategori/vidio/bedah-tajuk">Bedah Tajuk</a></li>
                    <li><a href="#">Economic Corner</a></li>
                    <li><a href="#">Podcast</a></li>
                </ul>
            </li>
            <li><a href="ekonomi">Ekonomi</a></li>
            <li class="has-sub">
                <a href="#">Lampung</a>
                <ul class="sub-menu">
                    <li><a href="lampung/bandar-lampung">Bandar Lampung</a></li>
                    <li><a href="../microweb/pemprovlampung">Pemprov Lampung</a></li>
                    <li><a href="lampung/lampung-barat">Lampung Barat</a></li>
                    <li><a href="lampung/lampung-timur">Lampung Timur</a></li>
                    <li><a href="lampung/lampung-selatan">Lampung Selatan</a></li>
                    <li><a href="lampung/lampung-tengah">Lampung Tengah</a></li>
                    <li><a href="lampung/lampung-utara">Lampung Utara</a></li>
                    <li><a href="lampung/pringsewu">Pringsewu</a></li>
                    <li><a href="lampung/pesawaran">Pesawaran</a></li>
                    <li><a href="lampung/mesuji">Mesuji</a></li>
                    <li><a href="lampung/tanggamus">Tanggamus</a></li>
                    <li><a href="lampung/metro">Metro</a></li>
                    <li><a href="lampung/tulang-bawang">Tulang Bawang</a></li>
                    <li><a href="lampung/tulang-bawang-barat">Tulang Bawang Barat</a></li>
                    <li><a href="lampung/way-kanan">Way Kanan</a></li>
                    <li><a href="lampung/pesisir-barat">Pesisir Barat</a></li>
                </ul>
            </li>
            <li id="link-mobile"><a href="breaking-news">Breaking News</a></li>
            <li id="link-mobile"><a href="../microweb/pemprovlampung">Pemprov Lampung</a></li>
            <li id="link-mobile"><a href="lampung/lampung-barat">Lampung Barat</a></li>
            <li id="link-mobile"><a href="teknologi">Teknologi</a></li>
            <li><a href="#">Tokoh</a></li>
            <li><a href="../indeks">Indeks</a></li>
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
                <li><a href="../harian"><i class="bi bi-calendar3"></i> Epaper</a></li>
                <li><a href="../index"><i class="bi bi-house-door"></i> Beranda</a></li>
                <li><a href="#"><i class="bi bi-newspaper"></i> Infografik</a></li></br>
                <li class="menu-sidebar">
                    <a href="#">
                        <i class="bi bi-book-half"></i>
                        <span class="menu-text">Mirosite</span>
                        <span class="icon-toggle">
                            <i class="bi bi-chevron-down icon-down"></i>
                            <i class="bi bi-chevron-up icon-up"></i>
                        </span>
                    </a>
                    <ul class="dropdown-sidebar">
                    <li><a href="../microweb/teknokrat">Universitas Teknokrat Indonesia</a></li>
                    <li><a href="../microweb/unila">Universitas Lampung</a></li>
                    <li><a href="../microweb/ubl">UBL</a></li>
                    <li><a href="../microweb/stiab">STIAB</a></li>
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
                        <li><a href="opini">Opini</a></li>
                        <li><a href="refleksi">Refleksi</a></li>
                        <li><a href="nuansa">Nuansa</a></li>
                        <li><a href="tajuk-lampung-post">Tajuk</a></li>
                        <li><a href="forum-guru">Forum Guru</a></li>
                    </ul>
                </li>
                <li class="menu-sidebar">
                    <a href="#">
                        <i class="bi bi-camera-video"></i>
                        <span class="menu-text">Video</span>
                        <span class="icon-toggle">
                            <i class="bi bi-chevron-down icon-down"></i>
                            <i class="bi bi-chevron-up icon-up"></i>
                        </span>
                    </a>
                    <ul class="dropdown-sidebar">
                        <li><a href="#">Breking New</a></li>
                        <li><a href="../kategori/vidio/bedah-tajuk">Bedah Tajuk</a></li>
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
                    <li><a href="lampung/bandar-lampung">Bandar Lampung</a></li>
                    <li><a href="../microweb/pemprovlampung">Pemprov Lampung</a></li>
                    <li><a href="lampung/lampung-barat">Lampung Barat</a></li>
                    <li><a href="lampung/lampung-timur">Lampung Timur</a></li>
                    <li><a href="lampung/lampung-selatan">Lampung Selatan</a></li>
                    <li><a href="lampung/lampung-tengah">Lampung Tengah</a></li>
                    <li><a href="lampung/lampung-utara">Lampung Utara</a></li>
                    <li><a href="lampung/pringsewu">Pringsewu</a></li>
                    <li><a href="lampung/pesawaran">Pesawaran</a></li>
                    <li><a href="lampung/mesuji">Mesuji</a></li>
                    <li><a href="lampung/tanggamus">Tanggamus</a></li>
                    <li><a href="lampung/metro">Metro</a></li>
                    <li><a href="lampung/tulang-bawang">Tulang Bawang</a></li>
                    <li><a href="lampung/tulang-bawang-barat">Tulang Bawang Barat</a></li>
                    <li><a href="lampung/way-kanan">Way Kanan</a></li>
                    <li><a href="lampung/pesisir-barat">Pesisir Barat</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
`;

document.getElementById("sidebar-container").innerHTML = SIDEBAR;