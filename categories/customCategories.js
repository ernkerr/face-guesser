import fetchTopArtists, {
  fetchUserID,
  fetchSavedArtists,
} from "../fetch/fetchSpotifyData.js";
import { gameState } from "../utils/gameState.js";
import { defaultOptions } from "./defaultCategories.js";

// in this array, we're going to add the results of each of the functions, essentially fetching all of the user's known artists
const artists = {};
let topArtistArray;

export default async function getUserInfo(token) {
  // getTopArtists() returns an object
  // the actual array of artists is in .items
  // we need to destructure the response
  // aka take the items property from the object returned by getTopArtists(token), and store it in a new variable called topArtists
  let { items: topArtists } = await fetchTopArtists(token);

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
  topArtistArray = topArtists;

  console.log("Done fetching top artists: ", artists);

  let userID = await fetchUserID(token);
  // use the userId to get playlists, etc.

  let {
    artists: { items: savedArtists },
  } = await fetchSavedArtists(token, userID);

  savedArtists.forEach((artist) => {
    if (!(artist.id in artists)) {
      artists[artist.id] = artist;
    }
  });
  console.log("Artists with Saved Artists: ", artists);

  // TODO: Then get artists from saved artists and playlists too
  // But we can start other functions asynchronously since we have the top artists to start with
  // AIroaster(artists)

  // Get total artists = top artists + saved artists + playlist artists (the playlists created by you)
  // https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks
  // GET https://api.spotify.com/v1/me/tracks
  // getSpotifyPlaylist(session.provider_token, "37i9dQZF1DXcBWIGoYBM5M");
  // if not enough? then fetch the user's top listed to going back even further (offset 50?)

  createCustomCategories();
}

// create the categories and add them to the list of categories

export function createCustomCategories() {
  let availableCategories = [];
  availableCategories.push("Top Artists");

  // TODO: Logic for other categories
  const genreCounts = {};
  // availableCategories.push("1");
  // availableCategories.push("2");

  //

  // loop through each artist in artist object and count how many times each genre appears
  // Object.values(artists) returns an array of all the values in an object
  // it allows us to directly loop over the value {name: "", genres: []} , not the key
  // When you use for...in, artist will be the key ("001", "002", etc.), not the artist object.

  for (const artist of Object.values(artists)) {
    // artist is the actual artist object
    //
    // handle invalid artists
    if (!artist || !artist.genres) {
      console.warn("Skipping invalid artist:", artist);
      continue; // ⬅ skip null/undefined ones
    }
    // genreless
    if (artist.genres.length === 0) {
      genreCounts["none"] = (genreCounts["none"] || 0) + 1;
    } else {
      // QUICK NOTE:
      // for...in gives you keys or indices (the id or index)
      // for..of gives you values
      for (const genre of artist.genres) {
        // use the variable genre as the key
        // if the variable already exists, increment it, otherwise start at 0 and add 1 (so it becomes 1)
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    }
  }

  // Object.entries() takes an object and turns it into an array of [key, value] pairs.
  // .sort() sorts arrays in place.
  // (a, b) are elements of the array, in this case [key, value] pairs.
  // b[1] - a[1] means:
  // b[1] is the value of the second element
  // a[1] is the value of the first element
  // Sorting in descending order (largest to smallest) because higher numbers come first.
  // Object.fromEntries turns it into an object again
  const sortedGenres = Object.fromEntries(
    Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
  );
  console.log("Sorted Genres", sortedGenres);
  // if the genre has more than ~ 30 artists, create a category for it

  return availableCategories;

  // categories:
  //
  // 1. top artists (done)
  //
  // 2. liked songs (get from playlist)
  //
  // 3.
  // by genre:

  // you need to look at all the artists’ .genres arrays and count how many times each genre appears.
  // . filter => artists.genre.includes("")
  // look at the most popular genre to the least (make sure there are at least 30 artists?)
  // no genre (if they have multiple artists with no genres);
  //

  //

  // filter artists based on custom categories

  // Category Ideas:
  // Top Artists
  // Genres [tech house, techno, rock, etc.]
  // BPM over ${user's max BPM with at least 50? artists}
  // Release Radar
  // "Newly Discovered" → top artists from the last 2 weeks/months
  // "Classic Favorites" → top artists over the long term
}

export function filterArtists() {
  if (gameState.category === "DJ") return defaultOptions;
  if (gameState.category === "Top Artists") return topArtistArray;

  // let category = gameState.category;
  // category = "Top Artists"
  // but I want to get the artists.topArtists
  // filtered Options should be an ARRAY

  // return filteredOptions;
}

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

// ui
// actually make custom categories it's own button (so they can still play generic ones)
// Once logged in, split into two buttons
// global // personal
// global can be the default when no one's logged in play against others p2

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
