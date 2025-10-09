import getTopArtists from "../fetch/fetchSpotifyData.js";

const artists = {};

// in this array, we're going to add the results of each of the functions, essentially fetching all of the user's known artists

export default async function fetchUserArtists(token) {
  // getTopArtists() returns an object
  // the actual array of artists is in .items
  // we need to destructure the response
  //
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

  console.log("User's Artists: ", artists);
  //let savedArtists = getSavedArtists(token);
  // savedArtists = [ {}, {}];
}

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
