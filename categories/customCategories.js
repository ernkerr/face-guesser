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
let likedSongsArray = [];
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
  likedSongsArray = artistsSavedTracks;

  //
  // STEP 3
  //
  // console.log("Fetching user ID...");
  let userID = await fetchUserID(token);
  // console.log(`User ID: ${userID}`);
  // use the userId to get playlists, etc.

  // await createCustomCategories(artists);
  console.log("✅ Finished getUserInfo");
}

// create a full list of categories and add them to the list of categories
// only if it's unique

export async function createCustomCategories() {
  console.log("createCustomCategories Called");

  availableCategories.push("Top Artists");
  availableCategories.push("Liked Songs");
  availableCategories.push("Genreless");

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
      // console.warn("Skipping invalid artist:", artist);
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
  // console.log("Sorted Genres:", Object.entries(sortedGenres));
  // console.log(typeof Object.entries(sortedGenres)); // object

  // if the genre has more than ~ 30 artists, create a category for it
  for (const genre of Object.entries(sortedGenres)) {
    if (genre[1] >= 5) {
      // get all of the artists in this genre and add it to the artists object (like top songs)
      availableCategories.push(`${genre[0]}`);
    }
  }

  console.log("Returning avaliable categories: ", availableCategories);
  return availableCategories;
}

export function filterArtists() {
  if (gameState.category === "Top Artists") return topArtistArray;
  if (gameState.category === "Liked Songs") return likedTracksArray;
  if (gameState.category === "Genreless") {
    const allArtists = Object.values(artists);
    return allArtists.filter(
      (artist) => !artist.genres || artist.genres.length === 0
    );
  }

  // Convert the artists object into an array of artist objects for filtering
  const allArtists = Object.values(artists);

  function isGenre(artist) {
    // Ensure artist and artist.genres exist before checking
    if (!artist || !artist.genres) {
      return false;
    }
    console.log("artist genres: ", artist.genres);
    console.log("gamestate category: ", gameState.category);
    // Check if the artist's genres array includes the current gameState.category
    return artist.genres.includes(gameState.category);
  }

  return allArtists.filter(isGenre);
}

// Category Ideas:
// Top Artists
// Genres [tech house, techno, rock, etc.]
// BPM over ${user's max BPM with at least 50? artists}
// Release Radar
// "Newly Discovered" → top artists from the last 2 weeks/months
// "Classic Favorites" → top artists over the long term
