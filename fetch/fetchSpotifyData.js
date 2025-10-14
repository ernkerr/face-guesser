// get customized spotify data after logging in
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
      const errorData = await response.json(); // Attempt to parse error details
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}"
        }`
      );
    }

    // Add `data` and await `response.json()`
    const data = await response.json();
    // console.log("Returning Top Artists:", data);
    return data;
    // return data; // Return the data from the function
  } catch (error) {
    console.error("Error during fetch operation:", error.message);
    throw error; // Re-throw the error if further handling is needed upstream
  }
  // https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists
}

// fetch page 2

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
      const errorData = await response.json(); // Attempt to parse error details
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}"
        }`
      );
    }

    // Add `data` and await `response.json()`
    const data = await response.json();
    console.log("Returning Top Artists Page 2:", data);
    return data; // Return the data from the function
  } catch (error) {
    console.error("Error during fetch operation:", error.message);
    throw error; // Re-throw the error if further handling is needed upstream
  }
  // https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists
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

export async function fetchSavedArtists(token, userID) {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/following?type=artist&limit=50",
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
    console.log("User's Saved Artists: ", data);
    return data;
  } catch (error) {
    console.log("Error fetching saved artists ", error);
  }
  //
}

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
