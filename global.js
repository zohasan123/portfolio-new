console.log("IT’S ALIVE!");


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


let pages = [
    { url: "/portfolio-new/", title: "Home" },
    { url: "/portfolio-new/projects/", title: "Projects" },
    { url: "/portfolio-new/resume/", title: "Resume" },
    { url: "/portfolio-new/contacts/", title: "Contacts" },
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

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Clear existing content to prevent duplication
  containerElement.innerHTML = '';

  // Loop through each project and create an article element
  projects.forEach(project => {
      // Create a new <article> element
      const article = document.createElement('article');
      article.classList.add("project");

      // Ensure a valid heading level (fallback to 'h2' if invalid)
      const validHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      const headingTag = validHeadingLevels.includes(headingLevel) ? headingLevel : 'h2';

      // Define the content dynamically with a flexible heading level
      article.innerHTML = `
          <${headingTag}>${project.title}</${headingTag}>
          <img src="${project.image}" alt="${project.title}">
          <p>${project.description}</p>
      `;

      // Append the article to the container element
      containerElement.appendChild(article);
  });
}


