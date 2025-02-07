console.log("IT’S ALIVE!");

console.log("global.js loaded!");


// TODO: Change the urls when you push to GitHub
// let pages = [
//   { url: "", title: "Home" },
//   { url: "projects/", title: "Projects" },
//   { url: "resume/", title: "Resume" },
//   { url: "contacts/", title: "Contact" },
//   { url: "https://github.com/zohasan123", title: "GitHub" },
// ];

// let pages = [
//   { url: "/portfolio-new/index.html", title: "Home" },
//   { url: "/portfolio-new/projects/index.html", title: "Projects" },
//   { url: "/portfolio-new/resume/index.html", title: "Resume" },
//   { url: "/portfolio-new/contacts/index.html", title: "Contact" },
//   { url: "https://github.com/zohasan123", title: "GitHub" },
// ];


// let pages = [
//     { url: "/portfolio-new/", title: "Home" },
//     { url: "/portfolio-new/projects/", title: "Projects" },
//     { url: "/portfolio-new/resume/", title: "Resume" },
//     { url: "/portfolio-new/contacts/", title: "Contacts" },
//     { url: "https://github.com/zohasan123", title: "GitHub" },
//   ];

let pages = [
  { url: "index.html", title: "Home" },
  { url: "projects/index.html", title: "Projects" },
  { url: "resume/index.html", title: "Resume" },
  { url: "contacts/index.html", title: "Contacts" },
  { url: "https://github.com/zohasan123", title: "GitHub" },
];

// Create a <nav> element and prepend it to <body>
let nav = document.createElement("nav");
document.body.prepend(nav);

// Check if we're on the home page
const ARE_WE_HOME = document.documentElement.classList.contains("home");

// Loop through the pages array and create links dynamically
for (let p of pages) {
  // Adjust URL if not on the home page and the URL is relative
  let url = !ARE_WE_HOME && !p.url.startsWith("http") ? "../" + p.url : p.url;
  let title = p.title;

  // Create a link element
  let a = document.createElement("a");
  a.href = url; // Set the href attribute
  a.textContent = title; // Set the link text

  // Highlight the current page
  if (location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  // Open external links in a new tab
  if (a.host !== location.host) {
    a.target = "_blank";
  }

  // Append the link to the <nav>
  nav.append(a);
}

document.body.insertAdjacentHTML(
    "afterbegin",
    `
      <label class="color-scheme">
        Theme:
        <select id="theme-select">
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    `
  );
const select = document.querySelector('.color-scheme select');

function colorScheme(colorScheme) {
    // Update the CSS variable for color-scheme
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    //localStorage.setItem('theme', theme);
    localStorage.colorScheme = colorScheme;
    select.value = colorScheme;
  }
  
  // Event listener to update the theme dynamically and save it to localStorage
  select.addEventListener('input', function (event) {
    //const theme = event.target.value;
    colorScheme(event.target.value); // Apply the selected theme
  });

  if ("colorScheme" in localStorage) {
    colorScheme(localStorage.colorScheme);
  } else {
    colorScheme("light dark");
  }


  export async function fetchGithubData(username) {
      return fetchJSON(`https://api.github.com/users/${username}`);
  }

  export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        console.log(response); // Inspect the response object in the browser console

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json(); // Parse the response
        return data;

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

  
export function renderProjects(projects, containerElement, headingLevel ='h2') {
  // Clear the existing content of the container element
  containerElement.innerHTML = '';
  console.log(projects)

  // Loop through each project to create an article element for each
  for (let project of projects) {
      // Create a new <article> element to hold the project's details
      const article = document.createElement('article');

      // Create the dynamic heading element based on headingLevel
      const heading = document.createElement(headingLevel);
      heading.textContent = project.title;

      // OLD Populate the article with dynamic content
      // article.innerHTML = `
      //     ${heading.outerHTML}  <!-- Add the dynamic heading -->
      //     <img src="${project.image}" alt="${project.title}">
      //     <p>${project.description}</p>
      // `;


      article.innerHTML = `
        ${heading.outerHTML}  <!-- Add the dynamic heading -->
        <img src="${project.image}" alt="${project.title}">
        <div class="project-details">
          <p>${project.description}</p>
          <p class="project-year"><strong>Year:</strong> ${project.year}</p>
        </div>
      `;

      // Append the article to the container element
      containerElement.appendChild(article);
  }
}