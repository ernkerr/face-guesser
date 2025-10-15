// fetch the users top artists 1-50

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

export async function fetchLikedSongs(token, offset) {
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

    if (!response.ok) {
      console.log("Error fetching liked songs: ", error);
    }

    const data = await data.json();

    console.log("Done fetching liked songs for offset: ", offset);
    console.log("Returning data: ", data);
    return data;
  } catch (error) {
    console.log("Error fetching liked songs: ", error);
  }
}

// fetch the artists that the user has saved (in their liked songs?)
// Handles pagination (since Spotify only returns 50 at a time)
// and returns a single combined array of ALL saved tracks
export async function fetchSavedTracks(token, offset) {
  console.log("fetchSavedTracks called");
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

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error getting saved artists", errorData);
    }

    const data = await response.json();
    console.log("Returning fetched tracks");
    return data;
  } catch (error) {
    console.log("Error fetching saved artists ", error);
  }
}

// normalize artists

export async function normalizeArtist(token, artists) {
  if (!artists || artists.length === 0) return [];

  // map the ids into one array
  const ids = artists.map((artist) => artist.id).join(",");
  console.log("normalizeArtist called with artists:", ids);

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
    console.log("Raw data: ", data);
    const artistsData = data.artists;
    console.log("Returning artists data: ", artistsData);
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
