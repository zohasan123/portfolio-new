// import { fetchJSON, renderProjects, fetchGithubData } from './global.js';
// const projects = await fetchJSON('./lib/projects.json');
// const latestProjects = projects.slice(0, 3);
// const projectsContainer = document.querySelector('.projects');
// renderProjects(latestProjects, projectsContainer, 'h2');


import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch latest projects
        const projects = await fetchJSON('./lib/projects.json'); 
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

        // Fetch and display GitHub profile stats
        const githubData = await fetchGithubData('zohasan123'); // Fetch GitHub data
        const profileStats = document.querySelector('#profile-stats'); // Select container

        if (profileStats) {
            profileStats.innerHTML = `
                <dl>
                    <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
                    <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
                    <dt>Followers:</dt><dd>${githubData.followers}</dd>
                    <dt>Following:</dt><dd>${githubData.following}</dd>
                </dl>
            `;
        } else {
            console.error("No container found with id 'profile-stats'");
        }

    } catch (error) {
        console.error("Error loading content:", error);
    }
});
