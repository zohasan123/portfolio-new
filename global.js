console.log("IT’S ALIVE!");



let pages = [
  { url: "/portfolio-new/index.html", title: "Home" },
  { url: "/portfolio-new/projects/index.html", title: "Projects" },
  { url: "/portfolio-new/resume/index.html", title: "Resume" },
  { url: "/portfolio-new/contacts/index.html", title: "Contact" },
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
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // Open external links in a new tab
  a.toggleAttribute("target", a.host !== location.host);

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