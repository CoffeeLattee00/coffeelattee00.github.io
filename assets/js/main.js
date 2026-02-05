/* ============================
   GLOBAL STATE & UTILS
   ============================ */
const App = {
    // Current Language
    lang: localStorage.getItem("ahmet_fe_lang") || "en",

    // Translation Data (Moved from global scope)
    translations: {
        en: {
            nav_work: "My Works",
            nav_insights: "Technical Blogs",
            nav_home: "Ahmet Faruk Efe",
            nav_lifestyle: "Lifestyle",
            nav_contact: "Contact",
            contact_title: "Contact",
            contact_intro: "Feel free to reach out for collaborations or just a friendly hello.",
            contact_email: "Email",
            contact_social: "Social Profiles",
            toc_title: "Table of Contents",
            hero_greeting: "Hello, I'm",
            hero_title: "Mechanical Engineer & Visionary",
            hero_desc: "Designing the future through engineering, innovation, and leadership.",
            btn_work: "View My Works",
            btn_contact: "Contact Me",
            model_title: "Interactive Engineering",
            model_desc: "Explore the detailed mechanical design of a plastic extrusion mold directly in your browser.",
            model_hint: "Drag to rotate • Scroll to zoom",
            work_title: "My Works",
            work_desc: "My personal knowledge bank, extending from academic research to industrial application methods, and from engineering theories to technical design standards.",
            proj1_desc: "High-precision mechanical design and flow analysis for industrial plastic production.",
            proj2_desc: "Sustainable waste management system design focused on efficiency and automation.",
            proj3_desc: "Comprehensive analysis of thermodynamic cycles in renewable energy systems.",
            insights_title: "Technical Blogs",
            insights_desc: "My personal deductions, AI strategies, and technical analyses on not just 'how' technology works, but how we should approach it.",
            blog1_excerpt: "Exploring how 3D printing is revolutionizing rapid prototyping in mechanical engineering.",
            blog2_excerpt: "Why soft skills and emotional intelligence are crucial for modern technical leaders.",
            blog3_excerpt: "A deep dive into selecting eco-friendly materials without compromising structural integrity.",
            lifestyle_title: "Lifestyle & Interests",
            ls_travel: "Travel",
            ls_travel_desc: "Exploring new cultures and expanding horizons. From Erasmus memories to global adventures.",
            ls_soc: "Psychology & Sociology",
            ls_soc_desc: "Understanding human behavior and social dynamics to become a better leader.",
            ls_photo: "Photography",
            ls_photo_desc: "Capturing moments of symmetry and industrial beauty.",
            footer_text: "Engineering the future with passion and precision.",

            // JS UI Strings
            view_details: "View Details →",
            read_article: "Read Article &rarr;",
            loading_err: "Failed to load content."
        },
        tr: {
            nav_work: "Çalışmalarım",
            nav_insights: "Teknik Bloglar",
            nav_home: "Ahmet Faruk Efe",
            nav_lifestyle: "Yaşam",
            nav_contact: "İletişim",
            contact_title: "İletişim",
            contact_intro: "İşbirlikleri veya sadece bir merhaba demek için çekinmeden yazabilirsiniz.",
            contact_email: "E-posta",
            contact_social: "Sosyal Medya",
            toc_title: "İçindekiler",
            hero_greeting: "Merhaba, Ben",
            hero_title: "Makine Mühendisi & Vizyoner",
            hero_desc: "Mühendislik, inovasyon ve liderlik ile geleceği tasarlıyorum.",
            btn_work: "Çalışmalarımı Gör",
            btn_contact: "İletişime Geç",
            model_title: "İnteraktif Mühendislik",
            model_desc: "Plastik ekstrüzyon kalıbının detaylı mekanik tasarımını tarayıcınızda inceleyin.",
            model_hint: "Çevirmek için sürükleyin • Yakınlaştırmak için kaydırın",
            work_title: "Çalışmalarım",
            work_desc: "Akademik araştırmalardan endüstriyel uygulama yöntemlerine, mühendislik teorilerinden teknik tasarım standartlarına kadar uzanan kişisel bilgi bankam.",
            proj1_desc: "Endüstriyel plastik üretimi için yüksek hassasiyetli mekanik tasarım ve akış analizi.",
            proj2_desc: "Verimlilik ve otomasyona odaklanmış sürdürülebilir atık yönetim sistemi tasarımı.",
            proj3_desc: "Yenilenebilir enerji sistemlerinde termodinamik çevrimlerin kapsamlı analizi.",
            insights_title: "Teknik Bloglar",
            insights_desc: "Teknolojinin sadece 'nasıl' çalıştığına değil, ona nasıl yaklaşmamız gerektiğine dair kişisel çıkarımlarım, yapay zeka stratejileri ve teknik analizlerim.",
            blog1_excerpt: "3D baskının makine mühendisliğinde hızlı prototiplemeyi nasıl devrimleştirdiğini keşfedin.",
            blog2_excerpt: "Modern teknik liderler için sosyal beceriler ve duygusal zeka neden kritiktir.",
            blog3_excerpt: "Yapısal bütünlükten ödün vermeden çevre dostu malzeme seçimi üzerine derinlemesine bir bakış.",
            lifestyle_title: "Yaşam & İlgi Alanları",
            ls_travel: "Seyahat",
            ls_travel_desc: "Yeni kültürler keşfetmek ve ufukları genişletmek. Erasmus anılarından küresel maceralara.",
            ls_soc: "Psikoloji & Sosyoloji",
            ls_soc_desc: "Daha iyi bir lider olmak için insan davranışlarını ve sosyal dinamikleri anlamak.",
            ls_photo: "Fotoğrafçılık",
            ls_photo_desc: "Simetri ve endüstriyel güzelliğin anlarını yakalamak.",
            footer_text: "Tutku ve hassasiyetle geleceği mühendislik ile tasarlıyorum.",

            // JS UI Strings
            view_details: "Detayları Gör →",
            read_article: "Yazıyı Oku &rarr;",
            loading_err: "İçerik yüklenemedi."
        }
    },

    // Global Cache for fetched JSONs
    dataCache: {
        projects: null,
        blog: null,
        lifestyle: null
    },

    // Event System for Language Change
    handlers: [],
    onLanguageChange: function(fn) {
        this.handlers.push(fn);
    },
    
    // Set Language Logic
    setLanguage: function(lang) {
        this.lang = lang;
        localStorage.setItem("ahmet_fe_lang", lang);

        // 1. Update UI Static Text
        this.updateStaticText();

        // 2. Update Toggle Buttons
        this.updateButtons();

        // 3. Trigger Subscribers (e.g., render functions)
        this.handlers.forEach(fn => fn(lang));
    },

    updateStaticText: function() {
        const translatableElements = document.querySelectorAll("[data-key]");
        translatableElements.forEach(el => {
            const key = el.getAttribute("data-key");
            if (this.translations[this.lang] && this.translations[this.lang][key]) {
                el.innerText = this.translations[this.lang][key];
            }
        });
    },

    updateButtons: function() {
        const langBtnEn = document.getElementById("btn-en");
        const langBtnTr = document.getElementById("btn-tr");
        
        if (this.lang === "en") {
            if (langBtnEn) langBtnEn.classList.add("active");
            if (langBtnTr) langBtnTr.classList.remove("active");
        } else {
            if (langBtnTr) langBtnTr.classList.add("active");
            if (langBtnEn) langBtnEn.classList.remove("active");
        }
    },

    // Helper: Get Translated Text
    t: function(key) {
        return this.translations[this.lang][key] || key;
    },

    // Helper: Fetch with Cache
    fetchData: function(key, url) {
        if (this.dataCache[key]) {
            return Promise.resolve(this.dataCache[key]);
        }
        return fetch(url + '?v=' + new Date().getTime())
            .then(res => {
                if(!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                this.dataCache[key] = data;
                return data;
            });
    }
};

/* ============================
   INITIALIZATION
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
    // Initial Setup
    App.updateStaticText();
    App.updateButtons();
    
    // Highlight Active Link
    const pathName = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if(link.getAttribute('href') === pathName) {
            link.classList.add('active');
        }
    });

    // Language Buttons
    const langBtnEn = document.getElementById("btn-en");
    const langBtnTr = document.getElementById("btn-tr");
    if (langBtnEn) langBtnEn.addEventListener("click", () => App.setLanguage("en"));
    if (langBtnTr) langBtnTr.addEventListener("click", () => App.setLanguage("tr"));

    // Initialize Search
    searchSystem.init();
});

/* ============================
   NAVBAR SCROLL EFFECT
   ============================ */
const header = document.getElementById("main-header");
if(header){
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

console.log("System Status: Online. Ahmet Faruk Efe Portfolio Ready.");

/* ============================
   SEARCH SYSTEM LOGIC
   ============================ */
const searchSystem = {
    init: function () {
        this.injectSearchUI();
        // Use global App cache system
        this.loadData();
        this.addEventListeners();
    },

    loadData: function() {
        // Run quietly in background
        App.fetchData('projects', 'assets/data/projects.json').catch(e => console.log(e));
        App.fetchData('blog', 'assets/data/blog.json').catch(e => console.log(e));
    },

    injectSearchUI: function () {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.querySelector('.search-trigger')) {
            const searchLi = document.createElement('li');
            searchLi.innerHTML = `
                <button class="search-trigger" aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            `;
            navLinks.appendChild(searchLi);
        }

        if (!document.querySelector('.search-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'search-overlay';
            overlay.innerHTML = `
                <button class="search-close">&times;</button>
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search..." autocomplete="off">
                    <div class="search-results"></div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    },

    search: function (query) {
        if (!query) return [];
        query = query.toLowerCase();

        let results = [];
        const currentLang = App.lang;

        // Use cached data directly
        const projects = App.dataCache.projects || [];
        const blogPosts = App.dataCache.blog || [];

        // Search Projects
        if (projects.length > 0) {
            const projResults = projects.filter(p => {
                let title = p.title;
                let category = p.category || "";
                
                if (p[currentLang]) {
                    title = p[currentLang].title;
                    if(p[currentLang].category) category = p[currentLang].category;
                }
                return title.toLowerCase().includes(query) || category.toLowerCase().includes(query);
            }).map(p => {
                let title = p.title;
                let category = p.category || "";
                if (p[currentLang]) {
                    title = p[currentLang].title;
                    if(p[currentLang].category) category = p[currentLang].category;
                }
                return {
                    id: p.id,
                    title: title,
                    desc: category,
                    image: p.image,
                    type: 'Project',
                    link: `article.html?type=project&id=${p.id}`
                };
            });
            results = [...results, ...projResults];
        }

        // Search Blog
        if (blogPosts.length > 0) {
            const blogResults = blogPosts.filter(b => {
                let title = b.title;
                if (b[currentLang]) title = b[currentLang].title;
                return title.toLowerCase().includes(query) || (b.tags && b.tags.some(t => t.toLowerCase().includes(query)));
            }).map(b => {
                let title = b.title;
                if (b[currentLang]) title = b[currentLang].title;
                return {
                    id: b.id,
                    title: title,
                    desc: b.date,
                    image: b.image,
                    type: 'Insight',
                    link: `article.html?type=blog&id=${b.id}`
                };
            });
            results = [...results, ...blogResults];
        }

        return results;
    },

    renderResults: function (results) {
        const container = document.querySelector('.search-results');
        container.innerHTML = '';
        if (results.length === 0) return;

        results.forEach(res => {
            const item = document.createElement('a');
            item.className = 'search-result-item';
            item.href = res.link;
            item.innerHTML = `
                <img src="${res.image}" alt="${res.title}" class="result-thumb" onerror="this.src='assets/images/proj_placeholder.jpg'">
                <div class="result-info">
                    <h4>${res.title} <span class="result-type">${res.type}</span></h4>
                    <p>${res.desc}</p>
                </div>
            `;
            container.appendChild(item);
        });
    },

    addEventListeners: function () {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.search-trigger')) {
                const overlay = document.querySelector('.search-overlay');
                overlay.classList.add('active');
                setTimeout(() => overlay.querySelector('.search-input').focus(), 100);
            }
            if (e.target.closest('.search-close') || e.target.classList.contains('search-overlay')) {
                document.querySelector('.search-overlay').classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelector('.search-overlay').classList.remove('active');
            }
        });

        // Event delegation for input
        document.body.addEventListener('keyup', (e) => {
            if (e.target.classList.contains('search-input')) {
                const query = e.target.value.trim();
                const results = this.search(query);
                this.renderResults(results);
            }
        });
    }
};