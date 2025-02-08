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

// ************************************************************************
// Function for plotting the pie chart, legend, and handling selection
// ************************************************************************
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
searchInput.addEventListener('change', (event) => {
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





























// // 1. Import dependencies first.
// import { fetchJSON, renderProjects } from '../global.js'; 
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// // Global variable to keep track of the selected wedge (none selected by default)
// let selectedIndex = -1;

// // 2. Fetch project data before using it.
// let projects = await fetchJSON('../lib/projects.json'); // fetch your project data

// // 3. Now that projects is defined, render the projects list and update the title.
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');
// const projectsTitle = document.querySelector('.projects-title');
// projectsTitle.textContent = `${projects.length} Projects`;

// // ************************************************************************
// // NEW: Refactored function for plotting the pie chart, legend, and handling selection
// // ************************************************************************
// function renderPieChart(projectsGiven) {
//   // Clear any existing pie slices and legend items.
//   d3.select('svg').selectAll('path').remove();
//   d3.select('.legend').selectAll('li').remove();
  
//   // 4. Re-calculate rolled-up data for the visible projects.
//   let rolledData = d3.rollups(
//     projectsGiven,
//     (v) => v.length,
//     (d) => d.year
//   );
  
//   // 5. Map rolled-up data into an array of objects for the pie chart.
//   let data = rolledData.map(([year, count]) => {
//     return { label: year, value: count };
//   });
  
//   // 6. Set up D3 generators.
//   let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
//   let sliceGenerator = d3.pie().value((d) => d.value);
  
//   // 7. Generate arc data for the pie chart.
//   let arcData = sliceGenerator(data);
  
//   // 8. Generate SVG paths for each arc.
//   let arcs = arcData.map((d) => arcGenerator(d));
  
//   // 9. Define a color scale.
//   let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
//   // 10. Append the pie slices to the SVG with click events.
//   arcs.forEach((arcPath, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arcPath)
//       .attr('fill', colors(idx))
//       .on('click', () => {
//         // Toggle selection: if this wedge is already selected, deselect it.
//         selectedIndex = selectedIndex === idx ? -1 : idx;
//         updateSelection();
//       });
//   });
  
//   // 11. Create the legend items with click events.
//   data.forEach((d, idx) => {
//     d3.select('.legend')
//       .append('li')
//       .attr('style', `--color:${colors(idx)}`)
//       .attr('class', 'legend-item')
//       .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
//       .on('click', () => {
//         // Toggle selection via the legend item as well.
//         selectedIndex = selectedIndex === idx ? -1 : idx;
//         updateSelection();
//       });
//   });
  
//   // Helper function to update CSS classes for both wedges and legend items.
//   function updateSelection() {
//     // Update pie slice classes: add 'selected' only to the currently selected slice.
//     d3.select('svg')
//       .selectAll('path')
//       .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));
      
//     // Update legend item classes: add 'selected' to the currently selected legend item.
//     d3.select('.legend')
//       .selectAll('li')
//       .attr('class', (_, i) => (i === selectedIndex ? 'legend-item selected' : 'legend-item'));
      
//     // Optional: expose the current selection for use in other parts of the application.
//     window.selectedIndex = selectedIndex;
//   }
// }

// // ************************************************************************
// // Call the plotting function on page load (with all projects).
// // ************************************************************************
// renderPieChart(projects);

// // ************************************************************************
// // Set up the search bar event listener to filter projects and update the chart
// // ************************************************************************
// let query = '';
// let searchInput = document.querySelector('.searchBar');
// searchInput.addEventListener('change', (event) => {
//   // Update query value.
//   query = event.target.value;
//   // Filter projects based on the query.
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   // Re-render the projects list.
//   renderProjects(filteredProjects, projectsContainer, 'h2');
//   // Re-render the pie chart and legend using the filtered projects.
//   renderPieChart(filteredProjects);
// });





// // 1. Import dependencies first.
// import { fetchJSON, renderProjects } from '../global.js'; 
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// let selectedIndex = -1;


// // 2. Fetch project data before using it.
// let projects = await fetchJSON('../lib/projects.json'); // fetch your project data

// // 3. Now that projects is defined, render the projects list and update the title.
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');
// const projectsTitle = document.querySelector('.projects-title');
// projectsTitle.textContent = `${projects.length} Projects`;

// // ************************************************************************
// // NEW: Refactored function for plotting the pie chart and legend
// // ************************************************************************
// function renderPieChart(projectsGiven) {
//     // Clear any existing pie slices and legend items.
//     d3.select('svg').selectAll('path').remove();
//     d3.select('.legend').selectAll('li').remove();
  
//     // 4. Re-calculate rolled-up data for the visible projects.
//     let rolledData = d3.rollups(
//       projectsGiven,
//       (v) => v.length,
//       (d) => d.year
//     );
  
//     // 5. Map rolled-up data into an array of objects for the pie chart.
//     let data = rolledData.map(([year, count]) => {
//       return { label: year, value: count };
//     });
  
//     // 6. Set up D3 generators.
//     let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
//     let sliceGenerator = d3.pie().value((d) => d.value);
  
//     // 7. Generate arc data for the pie chart.
//     let arcData = sliceGenerator(data);
  
//     // 8. Generate SVG paths for each arc.
//     let arcs = arcData.map((d) => arcGenerator(d));
  
//     // 9. Define a color scale.
//     let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
//     // 10. Append the pie slices to the SVG.
//     arcs.forEach((arcPath, idx) => {
//       d3.select('svg')
//         .append('path')
//         .attr('d', arcPath)
//         .attr('fill', colors(idx));
//     });
  
//     // 11. Create the legend.
//     data.forEach((d, idx) => {
//       d3.select('.legend')
//         .append('li')
//         .attr('style', `--color:${colors(idx)}`)
//         .attr('class', 'legend-item')
//         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
//     });
//   }
  
//   // ************************************************************************
//   // Call the plotting function on page load (with all projects).
//   // ************************************************************************
//   renderPieChart(projects);
  
//   // ************************************************************************
//   // Set up the search bar event listener to filter projects and update the chart
//   // ************************************************************************
//   let query = '';
//   let searchInput = document.querySelector('.searchBar');
//   searchInput.addEventListener('change', (event) => {
//     // Update query value.
//     query = event.target.value;
//     // Filter projects based on the query.
//     let filteredProjects = projects.filter((project) => {
//       let values = Object.values(project).join('\n').toLowerCase();
//       return values.includes(query.toLowerCase());
//     });
//     // Re-render the projects list.
//     renderProjects(filteredProjects, projectsContainer, 'h2');
//     // Re-render the pie chart and legend using the filtered projects.
//     renderPieChart(filteredProjects);
//   });








/*
let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
});


// 4. Set up D3 generators.
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value((d) => d.value);

// 5. Use d3.rollups() to group projects by year.
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

// 6. Draw a full-circle background arc (optional).
let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
});
d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

// 7. Map rolled-up data into an array of objects for the pie chart.
let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
});

// 8. Generate arc data for the pie chart using the slice generator.
let arcData = sliceGenerator(data);

// (The following manual arc data computation is still here but is not used below.)
let total = 0;
for (let d of data) {
    total += d;
}
let angle = 0;
let manualArcData = [];
for (let d of data) {
    let endAngle = angle + (d / total) * 2 * Math.PI;
    manualArcData.push({ startAngle: angle, endAngle });
    angle = endAngle;
}

// 9. Generate SVG paths for each arc.
let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// 10. Create the legend.
let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // Set the swatch color via a CSS variable
          .attr('class', 'legend-item')            // Assign the class "legend-item"
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});

// 11. Append the pie slices to the SVG.
arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx));   // Fill in the attribute for fill color via indexing the colors variable
});

// 12. (Existing block that uses "singlePath" – note: singlePath is undefined.)
arcs.forEach(arc => {
    // TODO, fill in step for appending path to svg using D3
    d3.select("#projects-pie-plot")
      .append("path")
      .attr("d", singlePath)
      .attr("fill", "red")  // Set a single color
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("transform", "translate(0,0)");
});*/


