const projectContainer = document.getElementById('project-grid-container');

function renderProjects() {
    // Check global cache first
    const projects = App.dataCache.projects || [];
    if (projects.length === 0) return;

    const currentLang = App.lang;
    const btnText = App.t('view_details');

    projectContainer.innerHTML = projects.map(proj => {
        let title = proj.title;
        let desc = proj.desc;

        if (proj[currentLang]) {
            title = proj[currentLang].title;
            desc = proj[currentLang].desc;
        }

        return `
        <article class="project-card">
            <div class="card-image" style="background-image: url('${proj.image}'); background-size: cover; background-position: center;"></div>
            <div class="card-content">
                ${proj.date ? `<span class="project-date">${proj.date}</span>` : ''}
                <h3 class="card-title">${title}</h3>
                <p class="card-desc">${desc}</p>
                <div class="card-actions">
                    <a href="article.html?type=project&id=${proj.id}" class="card-link">${btnText}</a>
                </div>
            </div>
        </article>
    `}).join('');
}

// Subscribe to language changes
App.onLanguageChange(() => {
    renderProjects();
});

// Initial Load
App.fetchData('projects', 'assets/data/projects.json')
    .then(() => renderProjects())
    .catch(err => {
        console.error('Projects load error:', err);
        projectContainer.innerHTML = `<p style="text-align:center; color: #888;">${App.t('loading_err')}</p>`;
    });
