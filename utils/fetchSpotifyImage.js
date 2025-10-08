// spotify api endpoint to refresh the access token
const token_endpoint = "https://accounts.spotify.com/api/token";

// endpoint to get artist's id from name probably
// const now_playing_endpoint =
//   "https://api.spotify.com/v1/me/player/currently-playing";

// credentials from environment variables
const refreshToken =
  "AQB1C8qSZgsZ2QFecfHjznzhRcoU3CGIVkX_w7zvHgqfOlSNhrU_ozJt6bMs33Qi85SfPxGvycSd7pO0VvRl5bZmEr2c7IMwbLblEg3YVXPZaPsn3OYmm14puF97limtXQY";
const clientId = "2a7fa8af6ecb44e79e0f0b9a4e1bb9d0";
const clientSecret = "f09bb4ce01564fccbe844cc337751fd0";

let accessToken = null;
let tokenCreatedAt;

// get new access token from refresh token
const refreshAccessToken = async () => {
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  // send a post request to spotify's token endpoint to refresh the access token
  try {
    const response = await fetch(token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    // send the request and wait for spotify to respond
    const data = await response.json(); // parse that response as JSON

    if (response.ok) {
      accessToken = data.access_token; // Save new token
      tokenCreatedAt = Math.floor(Date.now() / 1000); // Save current time
      return accessToken;
    } else {
      console.error("Failed to refresh token:", data);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

// use previously created access token or check if it needs to be refreshed
const getAccessToken = async () => {
  const oneHour = 3600;
  const currentTime = Math.floor(Date.now() / 1000);

  // if there is a token that was created in the last hour
  // use that token
  if (accessToken && tokenCreatedAt && currentTime - tokenCreatedAt < oneHour) {
    console.log("🔒 Using existing access token.");
    return accessToken;
  }
  // else
  console.log("refreshing token..");
  return await refreshAccessToken();
};

export async function fetchSpotifyImage(name) {
  console.log("async function called!");
  try {
    const access_token = await getAccessToken();
    console.log("Access Token", access_token);
    console.log("name", name);
  } catch (error) {
    // <--- Catch the error object here
    console.error("Error in fetchSpotifyImage:", error); // <--- Log the object
  }
  // going to take in the name of a DJ
  //
  // return the url where we can find the image the src we can use for grid-item
}

// https://accounts.spotify.com/authorize?response_type=code&client_id=2a7fa8af6ecb44e79e0f0b9a4e1bb9d0&scope=SCOPE&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback

// in the future just use this to get their artists if it's not already cached
// we can cache the ones that have been used already in some db somewhere?
// store it locally as they go?

//   curl -d client_id=$CLIENT_ID -d client_secret=$CLIENT_SECRET -d grant_type=authorization_code -d code=$CODE -d redirect_uri=$REDIRECT_URI https://accounts.spotify.com/api/token
