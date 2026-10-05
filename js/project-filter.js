let allProjects = [];

// load projects from projects.json
async function loadProjects() {
    try {
        const response = await fetch('js/projects.json');
        if (!response.ok) throw new Error('Network response was not ok');
        allProjects = await response.json();
        renderProjects(allProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsGrid').innerHTML =
            '<div style="padding: 26px; color: var(--amber);">Project data unavailable. Check connection.</div>';
    }
}

// render loaded projects
function renderProjects(projectsToRender) {
    const grid = document.getElementById('projectsGrid');
    const countLabel = document.getElementById('projectsCount');

    if (projectsToRender.length === 0) {
        grid.innerHTML =
            '<div style="padding: 26px; color: var(--muted); grid-column: 1 / -1;">No projects found matching those parameters.</div>';
        countLabel.textContent = "0 projects found.";
        return;
    }

    grid.innerHTML = projectsToRender.map(p => {
        const tagsHtml = p.tags.map(tag => `<span>${tag}</span>`).join('');

        return `
        <div class="proj-card">
          <span class="proj-index">MSN / ${p.id}</span>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="proj-tags">${tagsHtml}</div>
          <a href="${p.link}" class="proj-link">View project</a>
        </div>
      `;
    }).join('');

    countLabel.textContent = `Showing ${projectsToRender.length} project(s).`;
}

// Event listener
document.getElementById('projectSearch').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderProjects(allProjects);
        return;
    }

    const keywords = query.split(/[\s,]+/).filter(k => k.length > 0);

    const filteredProjects = allProjects.filter(p => {
        const searchableText = [
            p.title,
            p.description,
            ...p.tags
        ].join(' ').toLowerCase();

        return keywords.every(kw => searchableText.includes(kw));
    });

    renderProjects(filteredProjects);
});

loadProjects();
