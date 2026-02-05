const gridContainer = document.getElementById('blog-grid-container');

function renderBlog() {
    const blogPosts = App.dataCache.blog || [];
    if (blogPosts.length === 0) return;

    const currentLang = App.lang;
    const btnText = App.t('read_article');

    gridContainer.innerHTML = blogPosts.map(post => {
        let title = post.title;
        let summary = post.summary;

        if (post[currentLang]) {
            title = post[currentLang].title;
            summary = post[currentLang].desc;
        }

        return `
        <article class="blog-card" onclick="window.location.href='article.html?id=${post.id}'" style="cursor: pointer;">
            <div class="blog-image-container" style="background-image: url('${post.image}'); background-size: cover; background-position: center;"></div>
            <div class="blog-content">
                <div class="blog-date">${post.date} • ${post.category}</div>
                <h2 class="blog-title">${title}</h2>
                <p class="blog-excerpt">${summary}</p>
                <span class="read-more">
                    ${btnText}
                </span>
            </div>
        </article>
    `}).join('');
}

App.onLanguageChange(() => renderBlog());

App.fetchData('blog', 'assets/data/blog.json')
    .then(() => renderBlog())
    .catch(err => {
        console.error('Blog load error:', err);
        gridContainer.innerHTML = `<p style="text-align:center; color: #888;">${App.t('loading_err')}</p>`;
    });
