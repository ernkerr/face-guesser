// fetch the users top artists 1-50

import { addArtistsToCache, getCachedArtists } from "../utils/cache.js";

export default async function fetchTopArtists(token) {

  const cached = getCachedArtists();

  if (cached.topArtists) {

    console.log("Returning cached top artists");

    return cached.topArtists;

  }



  try {

    console.log("Fetching top artists from API");

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

    addArtistsToCache({ topArtists: data }); // Cache the response

    return data;

  } catch (error) {

    console.error("Error during fetch operation:", error.message);

    throw error; // Re-throw the error if further handling is needed upstream

  }

}



// fetch the users top artists 50-100



export async function fetchTopArtists2(token) {

  const cached = getCachedArtists();

  if (cached.topArtists2) {

    console.log("Returning cached top artists 2");

    return cached.topArtists2;

  }



  try {

    console.log("Fetching top artists 2 from API");

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

    addArtistsToCache({ topArtists2: data }); // Cache the response

    return data;

  } catch (error) {

    console.error("Error during fetch operation:", error.message);

    throw error; // Re-throw the error if further handling is needed upstream

  }

}



// fetch the artists that the user has saved (in their liked songs?)

// Handles pagination (since Spotify only returns 50 at a time)

// and returns a single combined array of ALL saved tracks

export async function fetchSavedTracks(token, offset) {

  const cacheKey = `savedTracks_${offset}`;

  const cached = getCachedArtists();

  if (cached[cacheKey]) {

    console.log(`Returning cached saved tracks for offset: ${offset}`);

    return cached[cacheKey];

  }



  const fetchWithRetry = async (retry = false) => {

    console.log(`Fetching saved tracks for offset: ${offset} from API`);

    try {

      const response = await fetch(

        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,

        {

          method: "GET",

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );



      if (response.status === 429) {

        if (retry) {

          console.log("Rate limit hit again. Stopping.");

          return null;

        }

        console.log("Rate limit hit. Retrying in 60 seconds...");

        await new Promise((resolve) => setTimeout(resolve, 60000));

        return fetchWithRetry(true);

      }



      if (!response.ok) {

        const errorData = await response.json();

        console.log("Error getting saved artists", errorData);

        return null;

      }



      const data = await response.json();

      addArtistsToCache({ [cacheKey]: data }); // Cache the response

      console.log("Returning fetched tracks");

      return data;

    } catch (error) {

      console.log("Error fetching saved artists ", error);

      return null;

    }

  };



  return fetchWithRetry();

}



// normalize artists



export async function normalizeArtist(token, artists) {

  if (!artists || artists.length === 0) return [];



  // map the ids into one array

  const ids = artists.map((artist) => artist.id).join(",");

  console.log("Normalizing artists from API");



  try {

    const response = await fetch(

      `https://api.spotify.com/v1/artists?ids=${ids}`,

      {

        headers: { Authorization: `Bearer ${token}` },

      }

    );



    if (!response.ok) {

      const errorData = await response.json();

      console.log("Error normalizing artists: ", errorData);

    }



        const data = await response.json();



        const artistsData = data.artists;



        return artistsData;

  } catch (e) {

    console.warn("Failed to fetch artist batch", e);

  }

}

// Save all newly fetched artists to localStorage
// localStorage.setItem("normalizedArtists", JSON.stringify(normalizedCache));

//   // Fetch the full artist object
//   console.log("Fetching full artist data for: ", artist.name);

//   // small delay to avoid rate limits (like you did in fetchSavedArtists)
//   await new Promise((resolve) => setTimeout(resolve, 150));

//   try {
//     const response = await fetch(
//       `https://api.spotify.com/v1/artists/${artist.id}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     const fullArtist = await response.json();
//     const artistWithGenres = fullArtist || { ...artist, genres: [] }; // fallback to empty genres

//     // save to cache
//     normalizedCache[artist.id] = artistWithGenres;
//     localStorage.setItem("normalizedArtists", JSON.stringify(normalizedCache));

//     return artistWithGenres;
//   } catch (e) {
//     console.warn("Failed to fetch full artist info", artist.id, e);
//     return { ...artist, genres: [] }; // fallback
//   }
// }

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
