// import { fetchJSON, renderProjects, fetchGithubData } from './global.js';
// const projects = await fetchJSON('./lib/projects.json');
// const latestProjects = projects.slice(0, 3);
// const projectsContainer = document.querySelector('.projects');
// renderProjects(latestProjects, projectsContainer, 'h2');


import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
    const projects = await fetchJSON('./lib/projects.json'); // Ensure path is correct
    if (!projects) {
        console.error("Failed to fetch projects.json or it's empty.");
        return;
    }

    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');

    if (projectsContainer) {
        renderProjects(latestProjects, projectsContainer, 'h2');
    } else {
        console.error("No container found with class 'projects'");
    }
});
