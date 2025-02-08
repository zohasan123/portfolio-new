import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `Projects Count: ${projects.length}`;

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });
  
d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

//test 
let data = [1, 2];
let total = 0;
for (let d of data) {
  total += d;
}
let angle = 0;
let arcData = [];

for (let d of data) {
  let endAngle = angle + (d / total) * 2 * Math.PI;
  arcData.push({ startAngle: angle, endAngle });
  angle = endAngle;
}
let arcs = arcData.map((d) => arcGenerator(d));
arcs.forEach(arc => {
    // TODO, fill in step for appending path to svg using D3
    d3.select("#projects-pie-plot")
    .append("path")
    .attr("d", singlePath)
    .attr("fill", "red")  // Set a single color
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("transform", "translate(0,0)");
    })

let colors = ['gold', 'purple'];
arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors[idx]);   // Fill in the attribute for fill color via indexing the colors variable
});

