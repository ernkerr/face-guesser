// get spotify data
export default async function getTopArtists(token) {
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
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    // Add `data` and await `response.json()`
    const data = await response.json();
    console.log("Top Artists:", data);
    // return data; // Return the data from the function
  } catch (error) {
    console.error("Error during fetch operation:", error.message);
    throw error; // Re-throw the error if further handling is needed upstream
  }
  // https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists
}
