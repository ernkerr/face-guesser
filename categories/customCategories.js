import getTopArtists from "../fetch/fetchSpotifyData.js";
import { gameState } from "../utils/gameState.js";
import { defaultOptions } from "./defaultCategories.js";

// in this array, we're going to add the results of each of the functions, essentially fetching all of the user's known artists
const artists = {};

export default async function fetchUserArtists(token) {
  // getTopArtists() returns an object
  // the actual array of artists is in .items
  // we need to destructure the response
  // aka take the items property from the object returned by getTopArtists(token), and store it in a new variable called topArtists
  let { items: topArtists } = await getTopArtists(token);

  // for each artist in topArtists
  // we're going to check if the id is a key in the object artists
  // if it's not, we'll add the returned artist to artists
  topArtists.forEach((artist) => {
    if (!(artist.id in artists)) {
      // this creates a new "key" value pair in the object artists
      artists[artist.id] = artist;
    }
  });
  // if you want an array of the user's top artists to also be stored in the artists object
  // this we can also use for analysis
  artists.topArtists = topArtists;

  console.log("Done fetching top artists: ", artists);

  // TODO: Then get artists from saved artists and playlists too
  // But we can start other functions asynchronously since we have the top artists to start with
  // AIroaster(artists)

  // step 1: fetch the user's artists
  // step 2: getTopArtists(session.provider_token);
  // getSpotifyPlaylist(session.provider_token, "37i9dQZF1DXcBWIGoYBM5M");
  // if not enough? then fetch the user's top listed to going back even further (offset 50?)

  createCustomCategories(artists);
}

// create the categories and add them to the list of categories
// only filter when the user presses start game?

export function createCustomCategories(artists) {
  let availableCategories = [];

  availableCategories.push("Top Artists");
  // TODO: Logic for other categories
  // availableCategories.push("1");
  // availableCategories.push("2");

  return availableCategories;
}

// filter artists based on custom categories

export function filterArtists() {
  if (gameState.category === "DJ") {
    console.log("initiate default game");
    return defaultOptions;
  } else {
    console.log("filter artists called");
    console.log("using topArtists for now");
    // let category = gameState.category;
    // category = "Top Artists"
    // but I want to get the artists.topArtists

    const filteredOptions = artists.topArtists;
    console.log(Array.isArray(artists.topArtists));
    console.log(typeof filteredOptions);
    console.log("returning filtered options: ", filteredOptions);
    return filteredOptions;
  }
}
// create a function that will filter the artists based on the "category" in gameState
// we want to return something that we can use
// let filteredOptions: {
//   name: string,
//   source: string,
//   category: string,
// }[];
// filteredOptions is an array of objects with "name", source: "the link to the image", and category?
// filteredOptions: [{name: 'Fred Again...', source: 'images/fred_again.png', category: 'dj'}]

// 0cmWgDlu9CwTgxPhf403hb
// :
// external_urls
// :
// {spotify: 'https://open.spotify.com/artist/0cmWgDlu9CwTgxPhf403hb'}
// followers
// :
// {href: null, total: 1465472}
// genres
// :
// (4) ['trip hop', 'downtempo', 'nu jazz', 'electronic']
// href
// :
// "https://api.spotify.com/v1/artists/0cmWgDlu9CwTgxPhf403hb"
// id
// :
// "0cmWgDlu9CwTgxPhf403hb"
// images
// :
// (3) [{…}, {…}, {…}]
// name
// :
// "Bonobo"
// popularity
// :
// 62
// type
// :
// "artist"
// uri
// :
// "spotify:artist:0cmWgDlu9CwTgxPhf403hb"
// [[Prototype]]
// :
// Object

// First we call getTopArtists

// export default function generateCustomCategories(token) {
// 1. Get total artists = top artists + saved artists + playlist artists (the playlists created by you)
// https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks
// GET https://api.spotify.com/v1/me/tracks
//
// function that will return allUserArtists
//
// 2.
// from this list get their top genres (for genres that have more than 30 artists, )
//
// we want to return a list of all of the possible categories found
// }

// for each user we just want to get these values once.
// We can store them locally? does it really matter how often this happens?

// store them in a global variable we can return from a function?

// ui
// actually make custom categories it's own button (so they can still play generic ones)
// Once logged in, split into two buttons
// global // personal
// global can be the default when no one's logged in play against others p2

// Need some kind of logic for what kind of categories we could make

// Category Ideas:
// Top Artists
// Genres [tech house, techno, rock, etc.]
// BPM over ${user's max BPM with at least 50? artists}
// Release Radar

// P2: another button that comes up (from last 2 months, last 6 months, etc. pass in value for fetch url so they can see top artists from recently etc.)

// ======= CATEGORY =======
// let categoryTitle = category.toUpperCase();
// document.getElementById("category").textContent = `${categoryTitle}`;
// P2: let user select a category (must be logged in error toast)
// if they are logged in then they can switch the category like they can switch the mode
// get that user's category: artist, rapper,  country singer, etc.

// let category = gameState.category;
// let filteredOptions = options.filter((option) => option.category === category); // filter for the selected category
// console.log("Filtered Options", filteredOptions);
