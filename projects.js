const projectGrid = document.getElementById('projects-list');
const errorState = document.getElementById('projects-error');
const DETAIL_PAGE_PATH = 'project.html';

async function loadProjects() {
    try {
        const response = await fetch('projects.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to load projects.json (${response.status})`);
        }

        const projects = await response.json();
        if (!Array.isArray(projects)) {
            throw new Error('projects.json must contain an array of project objects.');
        }

        renderProjects(projects);
    } catch (error) {
        console.error(error);
        showError('Could not load projects. Please check projects.json format.');
    }
}

function renderProjects(projects) {
    if (!projects.length) {
        showError('No projects found. Add a project object to projects.json.');
        return;
    }

    const cards = projects.map((project) => {
        const normalizedProject = normalizeProject(project);
        const title = escapeHtml(normalizedProject.title);
        const description = escapeHtml(normalizedProject.description);
        const iconClass = normalizedProject.icon;
        const detailLink = `${DETAIL_PAGE_PATH}?slug=${encodeURIComponent(normalizedProject.slug)}`;

        const techTags = Array.isArray(normalizedProject.technologies)
            ? normalizedProject.technologies.map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')
            : '';

        const media = normalizedProject.image
            ? `<img src="${escapeAttribute(normalizedProject.image)}" alt="${title}" class="project-photo" loading="lazy">`
            : `<div class="project-placeholder"><i class="${escapeAttribute(iconClass)}"></i></div>`;

        const links = `
            ${normalizedProject.liveUrl ? `<a href="${escapeAttribute(normalizedProject.liveUrl)}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="Open live project"><i class="fas fa-external-link-alt"></i></a>` : ''}
            ${normalizedProject.githubUrl ? `<a href="${escapeAttribute(normalizedProject.githubUrl)}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub repository"><i class="fab fa-github"></i></a>` : ''}
        `;

        return `
            <article class="project-card">
                <div class="project-image">
                    ${media}
                    <div class="project-overlay">
                        <div class="project-links">
                            ${links.trim()}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <h3><a class="project-title-link" href="${escapeAttribute(detailLink)}">${title}</a></h3>
                    <p>${description}</p>
                    <div class="project-tech">${techTags}</div>
                    <a class="btn btn-secondary project-cta" href="${escapeAttribute(detailLink)}">View Project</a>
                </div>
            </article>
        `;
    });

    projectGrid.innerHTML = cards.join('');
    errorState.hidden = true;
}

function showError(message) {
    errorState.textContent = message;
    errorState.hidden = false;
    projectGrid.innerHTML = '';
}

function normalizeProject(project) {
    const title = project.title || 'Untitled Project';
    const slug = project.slug ? String(project.slug) : createSlug(title);
    return {
        title,
        slug,
        description: project.description || 'No description provided.',
        icon: project.icon || 'fas fa-code',
        image: normalizeImagePath(project.image),
        technologies: Array.isArray(project.technologies) ? project.technologies : [],
        githubUrl: normalizeExternalUrl(project.githubUrl),
        liveUrl: normalizeExternalUrl(project.liveUrl)
    };
}

function normalizeImagePath(image) {
    if (!image) {
        return '';
    }

    const imagePath = String(image).trim();
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
        return imagePath;
    }

    if (imagePath.startsWith('images/')) {
        return imagePath;
    }

    return `images/${imagePath}`;
}

function normalizeExternalUrl(url) {
    if (!url) {
        return '';
    }

    return String(url).trim();
}

function createSlug(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

loadProjects();
