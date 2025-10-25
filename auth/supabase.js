import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { updateUser, updateLogout } from "../ui/renderer.js";

import getUserInfo from "../categories/customCategories.js";
import { showTitleScreen } from "../ui/screens.js";

const supabaseUrl = "https://oonqcxtqkywqfgdjjvbt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbnFjeHRxa3l3cWZnZGpqdmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDU2NDAsImV4cCI6MjA3NjE4MTY0MH0.GmdZzswIzRUiArG24rcwiR3kMq6PQE1Bhuy9YwevRSQ";
export const supabase = createClient(supabaseUrl, supabaseKey);

let customGameGenerated = false; // flag to prevent multiple calls

// Login handler
document
  .getElementById("spotify-btn")
  .addEventListener("click", loginWithSpotify);

export async function loginWithSpotify() {
  console.log("Login with spotify pressed");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      scopes:
        "user-read-email user-top-read user-follow-read user-library-read ",
    },
  });

  if (error) {
    console.error("Error logging in:", error);
  } else {
    // redirects user to spotify login
    console.log("Redirecting to Spotify login: ", data.url);
    // TODO: push to history instead
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
  if (event === "SIGNED_OUT") {
    updateLogout();
    customGameGenerated = false; // reset flag when user logs out
  } else if (session) {
    // Only run once per session
    if (!customGameGenerated) {
      generateCustomGame(session.provider_token);
      showTitleScreen();
      customGameGenerated = true;
    }

    updateUser(
      session.user.user_metadata.avatar_url,
      session.user.user_metadata.full_name
    );
  }
});

// TODO
// but we should have something running in the background (analysis perhaps)
// that runs asynchronously?
// generateTasteAnalysis

function generateCustomGame(token) {
  getUserInfo(token);
}

// Make a request to the API endpoint (a URL that returns data, like Spotify’s /me/top/artists).
// function to call spotify's API pass in the token as headers
