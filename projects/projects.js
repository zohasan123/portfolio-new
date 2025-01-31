console.log("projects.js loaded!");


import { fetchJSON, renderProjects } from '../global.js';
// const projects = await fetchJSON('../lib/projects.json');
const projects = await fetchJSON('/portfolio-new/lib/projects.json');  // Absolute path
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

