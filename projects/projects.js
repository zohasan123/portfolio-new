// 1. Import dependencies first.
import { fetchJSON, renderProjects } from '../global.js'; 
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Global variable to keep track of the selected wedge (none selected by default)
let selectedIndex = -1;

// NEW: Global variable to store the aggregated pie data (for filtering by year)
let globalPieData = [];

// 2. Fetch project data before using it.
let projects = await fetchJSON('../lib/projects.json'); // fetch your project data

// 3. Now that projects is defined, render the projects list and update the title.
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
renderProjects(projects, projectsContainer, 'h2');
projectsTitle.textContent = `${projects.length} Projects`;


function renderPieChart(projectsGiven) {
  // Clear any existing pie slices and legend items.
  d3.select('svg').selectAll('path').remove();
  d3.select('.legend')
  .selectAll('li')
  .attr('class', (_, i) => (i === selectedIndex ? 'legend-item bolded' : 'legend-item'));
  
  // 4. Re-calculate rolled-up data for the visible projects.
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );
  
  // 5. Map rolled-up data into an array of objects for the pie chart.
  let data = rolledData.map(([year, count]) => {
    return { label: year, value: count };
  });
  
  // Save the aggregated data globally for later filtering.
  globalPieData = data;
  
  // 6. Set up D3 generators.
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  
  // 7. Generate arc data for the pie chart.
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));
  
  // 9. Define a color scale.
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
  d3.select('.legend').selectAll('li').remove();


  // 10. Append the pie slices to the SVG with click events.
  arcs.forEach((arcPath, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arcPath)
      .attr('fill', colors(idx))
      .on('click', () => {
        // Toggle selection: if this wedge is already selected, deselect it.
        selectedIndex = selectedIndex === idx ? -1 : idx;
        updateDisplay(); // Update the projects list based on the selection.
      });
  });
  
  // 11. Create the legend items with click events.
  data.forEach((d, idx) => {
    d3.select('.legend')
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        // Toggle selection via the legend item as well.
        selectedIndex = selectedIndex === idx ? -1 : idx;
        updateDisplay(); // Update the projects list based on the selection.
      });
  });
  
  // Update the selection highlighting on the pie chart and legend items.
  // (The pie slices still use the 'selected' class for fill changes.)
  d3.select('svg')
    .selectAll('path')
    .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));
  d3.select('.legend')
    .selectAll('li')
    // Here we update the class for legend items:
    // When selected, add the "bolded" class to bold the text.
    .attr('class', (_, i) => (i === selectedIndex ? 'legend-item bolded' : 'legend-item'));
}

// ************************************************************************
// updateDisplay() function to filter the projects list based on selection.
// This follows the exact structure you specified:
//
//    if (selectedIndex === -1) {
//      renderProjects(projects, projectsContainer, 'h2');
//    } else {
//      // Filter projects by selected year using the .label property
//    }
// ************************************************************************
function updateDisplay() {
  if (selectedIndex === -1) {
    // No wedge is selected: render all projects.
    renderProjects(projects, projectsContainer, 'h2');
    projectsTitle.textContent = `${projects.length} Projects`;
  } else {
    // A wedge is selected; filter projects by the selected year.
    let selectedYear = globalPieData[selectedIndex].label;  // Using the .label property.
    let filteredProjects = projects.filter(project => project.year === selectedYear);
    renderProjects(filteredProjects, projectsContainer, 'h2');
    projectsTitle.textContent = `${filteredProjects.length} Projects (Year: ${selectedYear})`;
  }
  
  // Update the selection highlighting on the pie chart and legend items.
  d3.select('svg')
    .selectAll('path')
    .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));
  d3.select('.legend')
    .selectAll('li')
    .attr('class', (_, i) => (i === selectedIndex ? 'legend-item bolded' : 'legend-item'));
}

// ************************************************************************
// Initial rendering: Render the pie chart once with all projects.
// ************************************************************************
renderPieChart(projects);

// ************************************************************************
// Set up the search bar event listener to filter projects by text input.
// ************************************************************************
let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  // Reset any wedge selection when performing a text search.
  selectedIndex = -1;
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  renderProjects(filteredProjects, projectsContainer, 'h2');
  // Re-render the pie chart and legend using the filtered projects.
  renderPieChart(filteredProjects);
  projectsTitle.textContent = `${filteredProjects.length} Projects`;
});


