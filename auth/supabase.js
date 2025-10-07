import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://vozbajoajvejveklywpm.supabase.co";
const supabaseKey = "sb_publishable_xqu3kuPJKOq87tV8TxcPwg_lyeA37i8";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function loginWithSpotify() {
  console.log("Login with spotify pressed");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      scopes: "user-read-email user-top-read",
    },
  });

  if (error) {
    console.error("Error logging in:", error);
  } else {
    // redirects user to spotify login
    console.log("Redirecting to Spotify login: ", data.url);
    //TODO: push to history instead
    window.location.href = data.url;
  }
}

// detect login state after redirect
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    console.log("User logged in!");
    console.log("User info", session.user);
    console.log("Spotify access token:", session.provider_token);
    console.log(
      "User's Profile Picture: ",
      session.user.user_metadata.avatar_url
    );
    // update ui
    // pass the
  }
});

// functions to write:
// update ui

// fetchSpotifyArtists

// Make a request to the API endpoint (a URL that returns data, like Spotify’s /me/top/artists).
// function to call spotify's API pass in the token as headers
