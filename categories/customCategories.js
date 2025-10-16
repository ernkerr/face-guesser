import fetchTopArtists, {
  fetchTopArtists2,
  fetchUserID,
  fetchSavedTracks,
  normalizeArtist,
} from "../fetch/fetchSpotifyData.js";
import { gameState } from "../utils/gameState.js";
import { defaultOptions } from "./defaultCategories.js";
import { loadCache } from "../utils/cache.js";

// Main data containers
// in this array, we're going to add the results of each of the functions, essentially fetching all of the user's known artists
const artists = {}; // holds all artist objects keyed by ID
let availableCategories = []; // category names for the game
let topArtistArray = []; // array of top artists for filtering
let likedTracksArray = [];

let artistsToNormalize = []; // ongoing array of artists which we need to fetch information for

// ----------------------
// When the user selects a category: Top Artists, Liked Songs, etc. etc. then pull all of them 180 per minute
// cache them and then keep pulling them as they play the game populating more and more into the game as the user plays it,
// eliminating them as they go until it reaches a certain. number then let them use those first ones again

// TODO: Then get artists from saved artists and playlists too
// But we can start other functions asynchronously since we have the top artists to start with
// AIroaster(artists)

// ----------------------

// ----------------------
// Helper: add artists uniquely
// ----------------------

async function addUniqueArtists(artists, newArtists) {
  // Separate artists with genres vs. artists that need normalization
  for (let artist of newArtists) {
    if (!artist || !artist.id) continue; // skip invalid entries (null or missing IDs)
    if (artist.id in artists) continue; // if the artist's key is already a key in the object artists, we continue

    // if the artist doesn't have a genre, add them to artistsToNormalize

    // if (!artist.genres || artist.genres.length === 0) {
    // NOTE: I think I can remove this artist.genres.length but I want to make sure it doesn't break anything
    if (!artist.genres) {
      artistsToNormalize.push(artist); // batch for normalization
    } else {
      artists[artist.id] = artist; // add directly if genres exist, this creates a new "key" value pair in the object artists
    }
  }
}

// ----------------------
// Helper: batch normalize artists (get the genres)
// ----------------------

export async function normalizeArtists(token) {
  // if there are artists to normalize,
  if (artistsToNormalize.length > 0) {
    // get the first 50 artists
    const firstbatch = artistsToNormalize.slice(0, 50);

    // normalize them in one API call
    const normalizedArtists = await normalizeArtist(token, firstbatch);

    console.log(
      "calling add unique artists with normalized artists",
      normalizedArtists
    );

    // add the normalized artists to the main object
    addUniqueArtists(normalizedArtists);

    for (const artist of normalizedArtists) {
      if (artist.id && !(artist.id in artists)) {
        artists[artist.id] = artist; // once they are normalized, put them in the artists object
      }
    }
    // remove the artists from the list of artistsToNormalize
    artistsToNormalize.splice(0, 50);
  }
}

// ----------------------
// Helper: pull artists from tracks
// ----------------------

function getArtistsFromTracks(tracks) {
  console.log(`Extracting artists from ${tracks.length} tracks...`);

  // takes all track.track.artists arrays and flattens them into a single list of artist objects
  const savedArtists = tracks.flatMap(
    (t) => t.track?.artists || [] // prevents errors if a track doesn’t have an artist
  );
  console.log(`Extracted ${savedArtists.length} artists from tracks.`);
  return savedArtists;
}

// ----------------------
// Main Function: called when user logs in
// ----------------------

export default async function getUserInfo(token) {
  console.log("🚀 Starting getUserInfo");
  loadCache(); // Load from cache first

  //
  // STEP 1: Get the user's top 100 artists
  //
  console.log("Fetching top artists...");
  let { items: topArtists } = await fetchTopArtists(token);
  await addUniqueArtists(artists, topArtists);

  // store an array of the user's top artists in the artists object
  topArtistArray = topArtists;

  console.log("Fetching more top artists...");
  let { items: topArtists2 } = await fetchTopArtists2(token);
  await addUniqueArtists(artists, topArtists2);
  topArtistArray = [...topArtistArray, ...topArtists2];

  //
  // STEP 2: Get the user's saved artists (from their saved tracks)
  //
  console.log("Fetching saved tracks...");
  const { items: savedTracks } = await fetchSavedTracks(token, 0); // passing in the offset
  console.log(`Received ${savedTracks.length} saved tracks`);

  const artistsSavedTracks = getArtistsFromTracks(savedTracks);

  // function to get artists from tracks
  await addUniqueArtists(artists, artistsSavedTracks);

  // store an array of the artists from the user's saved tracks in the artists object
  likedTracksArray = artistsSavedTracks;

  //
  // STEP 3
  //
  console.log("Fetching user ID...");
  let userID = await fetchUserID(token);
  console.log(`User ID: ${userID}`);
  // use the userId to get playlists, etc.

  // await createCustomCategories(artists);
  console.log("✅ Finished getUserInfo");
}

// create a full list of categories and add them to the list of categories

export async function createCustomCategories(artists) {
  console.log("Creating custom Categories");
  if (!artists) {
    console.warn("createCustomCategories called with no artists!");
    return [];
  }

  availableCategories.push("Top Artists");
  availableCategories.push("Liked Songs");
  // availableCategories.push("Genreless");

  // TODO: Logic for other categories
  const genreCounts = {};

  // NOTE:
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
  console.log("Sorted Genres:", Object.entries(sortedGenres));

  // if the genre has more than ~ 30 artists, create a category for it
  for (const genre of Object.entries(sortedGenres)) {
    if (genre.length >= 5) {
      console.log("New Genre: ", genre);
      // get all of the artists in this genre and add it to the artists object (like top songs)
      availableCategories.push(`${genre.name}`);
      console.log("Added a new avaliable category: ", availableCategories);
    }
  }

  // console.log("Sorted Genres", sortedGenres);

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
  if (gameState.category === "Liked Tracks") return likedTracksArray;

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
