// fetch the users top artists 1-50

import {
  createCustomCategories,
  createStarterCategories,
} from "../categories/customCategories.js";

export default async function fetchTopArtists(token) {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=0",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}"
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during fetch operation:", error.message);
    throw error; // Re-throw the error if further handling is needed upstream
  }
}

// fetch the users top artists 50-100

export async function fetchTopArtists2(token) {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=50",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}"
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during fetch operation:", error.message);
    throw error; // Re-throw the error if further handling is needed upstream
  }
}

// fetch the artists that the user has saved(in their liked songs?)
// Handles pagination (since Spotify only returns 50 at a time)
// and returns a single combined array of ALL saved tracks
export async function fetchSavedArtists(token) {
  let offset = 0; // where we are in the list
  let allTracks = []; // store all saved tracks here

  try {
    while (true) {
      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error getting saved artists", errorData);
        break; // stop the loop if Spotify returns an error
      }

      const data = await response.json();

      console.log(`Fetched ${data.items.length} tracks (offset: ${offset})`);

      // add this list of results to our all tracks array
      allTracks.push(...data.items);

      // if we got fewer than the "limit" rate, we've reached the end
      if (data.items.length < 50) {
        console.log("Finished fetching all saved tracks");
        break;
      }

      // otherwise we'll move the offset up and keep looping
      offset += 50;

      // if offfset = 150 check for genres
      if (offset === 150) {
        createStarterCategories(token, allTracks);
        return;
        // TODO: implement caching
      }
      // then this function can resume
      // and can call check for genres at every interval of 150 ?

      // small delay to avoid rate limits (Spotify’s safety)
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    // return ALL combined results — not just .items
    console.log(`🎵 Total saved tracks fetched: ${allTracks.length}`);
    return allTracks;
  } catch (error) {
    console.log("Error fetching saved artists ", error);
  }
}

// normalize artists
let normalizedCache = JSON.parse(
  localStorage.getItem("normalizedArtists") || "{}"
); // load cache from local storage

export async function normalizeArtist(token, artist) {
  if (!artist || !artist.id) return null;

  // return from cache if available
  if (normalizedCache[artist.id]) return normalizedCache[artist.id];

  // Fetch the full artist object
  console.log("Fetching full artist data for: ", artist.name);

  // small delay to avoid rate limits (like you did in fetchSavedArtists)
  await new Promise((resolve) => setTimeout(resolve, 150));

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const fullArtist = await response.json();
    const artistWithGenres = fullArtist || { ...artist, genres: [] }; // fallback to empty genres

    // save to cache
    normalizedCache[artist.id] = artistWithGenres;
    localStorage.setItem("normalizedArtists", JSON.stringify(normalizedCache));

    return artistWithGenres;
  } catch (e) {
    console.warn("Failed to fetch full artist info", artist.id, e);
    return { ...artist, genres: [] }; // fallback
  }
}

export async function fetchUserID(token) {
  console.log("Trying to fetch the user's ID");
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error details
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}"
        }`
      );
    }

    const data = await response.json();
    // console.log("User ID:", data.id);

    return data.id;
  } catch (error) {
    console.error("Error trying to fetch the user's ID: ", error.message);
    throw error;
  }
}

// TODO
// fetch top tracks and scrape for the artists?

// Get the current user's followed artists.
// https://api.spotify.com/v1/me/following

// 'https://api.spotify.com/v1/me/following?type=artist&after=ID_HERE&limit=50'
// insufficient scope?

// fetch saved artists (artists you follow)

// fetch saved artists here for those
// artists from my saved tracks

//
//
//
//
export async function fetchSpotifyPlaylist(token, playlist_id) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error Getting Spotify Playlist", errorData);
    }
    // do something in the ui (playlist not avaliable, try again, etc.)

    const data = await response.json();
    console.log("Playlist Data:", data);
  } catch (error) {
    console.log("Error at getSpotifyPlaylist", error.message);
  }
}

// // fetched the artists that the user is following
// BUGGY (NO OFFSET?)
// export async function fetchFollowingArtists(token) {
//   try {
//     const response = await fetch(
//       "https://api.spotify.com/v1/me/following?type=artist&limit=50",
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.log("Error getting followed artists", errorData);
//     }

//     const data = await response.json();
//     console.log("User's Followed Artists: ", data);
//     return data;
//   } catch (error) {
//     console.log("Error fetching user's followed artists: ", error);
//   }
// }
