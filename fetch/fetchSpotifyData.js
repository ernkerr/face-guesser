// get customized spotify data after logging in
export default async function getTopArtists(token) {
  try {
    console.log("Fetching Top Artists");
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
    console.log("Returning Top Artists:", data);
    return data;
    // return data; // Return the data from the function
  } catch (error) {
    console.error("Error during fetch operation:", error.message);
    throw error; // Re-throw the error if further handling is needed upstream
  }
  // https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists
}

export async function getSpotifyPlaylist(token, playlist_id) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}`,
      {
        method: "GET",
        headers: `Bearer ${token}`,
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
