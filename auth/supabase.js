import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { updateUser, updateLogout } from "../ui/updater.js";
import getTopArtists from "../utils/fetchSpotifyData.js";

const supabaseUrl = "https://vozbajoajvejveklywpm.supabase.co";
const supabaseKey = "sb_publishable_xqu3kuPJKOq87tV8TxcPwg_lyeA37i8";
const supabase = createClient(supabaseUrl, supabaseKey);

// Login handler
document
  .getElementById("spotify-btn")
  .addEventListener("click", loginWithSpotify);

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

// Logout handler
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
  else updateLogout();
});

// detect login state after redirect
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Session:", session);
  if (session) {
    updateUser(
      session.user.user_metadata.avatar_url,
      session.user.user_metadata.full_name
    );
    // TODO
    // here we should have some sort of logic for a user's custom categories
    // we should pass in this provider_token to pass down to spotify functions
    // but we should have something running in the background (analysis perhaps)
    // that runs asynchronously?
    getTopArtists(session.provider_token);
  } else {
    updateLogout();
  }
});

// // Usage
// getFavoriteColor(token)

// functions to write:
// update ui

// fetchSpotifyArtists

// Make a request to the API endpoint (a URL that returns data, like Spotify’s /me/top/artists).
// function to call spotify's API pass in the token as headers
