// URL'den ID ve TYPE'ı al
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
const postType = urlParams.get('type') || 'blog'; // Varsayılan tip blog

function renderArticle() {
    const currentLang = App.lang;
    const loadingEl = document.getElementById('loading');
    const containerEl = document.getElementById('article-container');
    
    // Veri Dosyasını Belirle ve Çek
    let fetchKey = 'blog';
    let fetchUrl = 'assets/data/blog.json';

    if (postType === 'project') {
        fetchKey = 'projects';
        fetchUrl = 'assets/data/projects.json';
    } else if (postType === 'lifestyle') {
        fetchKey = 'lifestyle';
        fetchUrl = 'assets/data/lifestyle.json';
    }

    App.fetchData(fetchKey, fetchUrl)
        .then(dataList => {
            let rawItem;

            if (postType === 'lifestyle') {
                for (const cat of dataList) {
                    // Use loose equality (==) to match string "1" with number 1
                    const found = cat.items.find(i => i.id == postId);
                    if (found) {
                        rawItem = found;
                        break;
                    }
                }
            } else {
                // Use loose equality (==) to match string "1" with number 1
                rawItem = dataList.find(p => p.id == postId);
            }

            if (rawItem) {
                let item = { ...rawItem };

                if (rawItem[currentLang]) {
                    item.title = rawItem[currentLang].title;
                    item.desc = rawItem[currentLang].desc;
                    item.file = rawItem[currentLang].file;
                    if (rawItem[currentLang].category) item.category = rawItem[currentLang].category;
                    // Support content in lang object if needed in future
                    if (rawItem[currentLang].content) item.content = rawItem[currentLang].content;
                }

                document.getElementById('art-title').innerText = item.title;
                document.getElementById('art-date').innerText = item.date || item.category || "Project";
                document.getElementById('art-img').src = item.image;
                document.title = item.title + " - Ahmet Faruk Efe";

                // Direct Content (from Backend CMS)
                if (item.content) {
                    const contentDiv = document.getElementById('art-content');
                    // item.content is Markdown string
                    contentDiv.innerHTML = marked.parse(item.content);
                    
                    generateTOC();
                    MathJax.typesetPromise();

                    loadingEl.style.display = 'none';
                    containerEl.style.display = 'block';
                }
                // File-based Content (Legacy)
                else if (item.file) {
                    fetch(item.file + "?v=" + new Date().getTime())
                        .then(res => {
                            if (!res.ok) throw new Error("Ağ hatası");
                            return res.text();
                        })
                        .then(markdown => {
                            const basePath = item.file.substring(0, item.file.lastIndexOf('/') + 1);
                            const fixedMarkdown = markdown.replace(/!\[(.*?)\]\((?!http|https|\/)(.*?)\)/g, (match, alt, url) => {
                                return `![${alt}](${basePath}${url})`;
                            });

                            const contentDiv = document.getElementById('art-content');
                            contentDiv.innerHTML = marked.parse(fixedMarkdown);

                            generateTOC();
                            MathJax.typesetPromise();

                            loadingEl.style.display = 'none';
                            containerEl.style.display = 'block';
                        })
                        .catch(err => {
                            console.error('File read error:', err);
                            loadingEl.innerText = `${App.t('loading_err')} (${item.file})`;
                        });
                } else {
                    loadingEl.innerText = "Content file not defined.";
                }

            } else {
                loadingEl.innerText = "Content not found.";
            }
        })
        .catch(err => {
            console.error('Data load error:', err);
            loadingEl.innerText = App.t('loading_err');
        });
}

function generateTOC() {
    const tocList = document.getElementById('toc-list');
    const contentDiv = document.getElementById('art-content');
    tocList.innerHTML = '';

    const headers = contentDiv.querySelectorAll('h1, h2, h3');

    if (headers.length === 0) {
        const container = document.querySelector('.toc-container');
        if(container) container.style.display = 'none';
    } else {
        let counts = [0, 0, 0]; // h1, h2, h3 counters

        headers.forEach((header, index) => {
            if (!header.id) header.id = 'header-' + index;

            // Determine level
            const level = parseInt(header.tagName.substring(1));
            
            // Nested numbering logic
            // Assuming h1 is level 1, h2 level 2, h3 level 3
            // Since most articles might start with h2 if Title is h1 (outside content), logic handles that.
            
            if (level === 1) {
                counts[0]++;
                counts[1] = 0;
                counts[2] = 0;
            } else if (level === 2) {
                counts[1]++;
                counts[2] = 0;
            } else if (level === 3) {
                counts[2]++;
            }

            // Build numbering string (e.g. "1. ", "1.2. ", "1.2.3. ")
            let numStr = "";
            if (counts[0] > 0) {
                numStr += counts[0] + ".";
            }
            if (level >= 2 && counts[1] > 0) {
                numStr += counts[1] + ".";
            }
            if (level >= 3 && counts[2] > 0) {
                numStr += counts[2] + ".";
            }
            
            // If only h2 and h3 are used, and h1 count is 0, we might want to start numbering from h2 as top level.
            // But strict hierarchical numbering is usually safer. 
            // Let's refine: If h1 never appears, we shouldn't prefix '0.'.
            
            // Refined Logic for display:
            let displayNum = "";
            if (level === 1) displayNum = `${counts[0]}.`;
            else if (level === 2) {
                if(counts[0] > 0) displayNum = `${counts[0]}.${counts[1]}.`;
                else displayNum = `${counts[1]}.`;
            }
            else if (level === 3) {
                if(counts[0] > 0) displayNum = `${counts[0]}.${counts[1]}.${counts[2]}.`;
                else if(counts[1] > 0) displayNum = `${counts[1]}.${counts[2]}.`;
                else displayNum = `${counts[2]}.`;
            }

            const link = document.createElement('a');
            link.href = '#' + header.id;
            link.className = 'toc-link toc-link-' + header.tagName.toLowerCase();
            // Prepend numbering to the text in TOC
            link.innerText = `${displayNum} ${header.innerText}`;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(header.id).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });

            tocList.appendChild(link);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Nav Active State
    if (postType === 'project') {
        const workLink = document.querySelector('a[href="work.html"]');
        if (workLink) workLink.classList.add('active');
    } else if (postType === 'lifestyle') {
        const lifestyleLink = document.querySelector('a[href="lifestyle.html"]');
        if (lifestyleLink) lifestyleLink.classList.add('active');
    } else {
        const insightsLink = document.querySelector('a[href="insights.html"]');
        if (insightsLink) insightsLink.classList.add('active');
    }

    renderArticle();
});

// Subscribe to language changes (This allows switching lang without reload!)
App.onLanguageChange(() => {
    renderArticle();
});
