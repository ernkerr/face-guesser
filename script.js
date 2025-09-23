import { fetchWikiData } from "./wikifetch.js";

const myElement = document.getElementById("myDiv");
myElement.classList.toggle("active"); // Adds 'active' if not present, removes if present

// API for photos

// what do we want from wiki?

const dj = await fetchWikiData("Diplo");
console.log(dj);

fetchWikiData(url);

// we want to fetch an image for the celebrity
