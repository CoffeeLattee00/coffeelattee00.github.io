const contentArea = document.getElementById('lifestyle-content-area');

function renderLifestyle() {
    const lifestylePosts = App.dataCache.lifestyle || [];
    if (lifestylePosts.length === 0) return;

    // Lifestyle is language agnostic structurally, but we might want to support it later
    // Current structure doesn't deeply vary by lang in the JSON example, but if it did:
    // const currentLang = App.lang;

    const html = lifestylePosts.map(category => `
        <div class="category-block">
            <h3 class="category-title">
                ${category.category}
            </h3>
            <div class="lifestyle-grid">
                ${category.items.map(item => `
                    <article class="ls-card" onclick="window.location.href='article.html?type=lifestyle&id=${item.id}'" style="cursor: pointer;">
                        <div class="ls-image-container">
                            <img src="${item.image}" class="ls-image" alt="${item.title}">
                        </div>
                        <h4 class="ls-title">${item.title}</h4>
                        <p class="ls-desc">${item.desc}</p>
                    </article>
                `).join('')}
            </div>
        </div>
    `).join('');

    contentArea.innerHTML = html;
}

// Subscribe if needed (though lifestyle might be static lang currently)
App.onLanguageChange(() => renderLifestyle());

App.fetchData('lifestyle', 'assets/data/lifestyle.json')
    .then(() => renderLifestyle())
    .catch(err => {
        console.error('Lifestyle load error:', err);
        contentArea.innerHTML = `<p style="text-align:center; color: #888;">${App.t('loading_err')}</p>`;
    });
