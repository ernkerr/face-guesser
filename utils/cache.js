// utils/cache.js

// A simple object to hold cached artists in memory
let artistCache = {};

// Load from localStorage immediately (so hot reload won't clear it)
export function loadCache() {
  console.log("🎵 Loading artist cache from localStorage...");
  try {
    const saved = localStorage.getItem("artistCache");
    if (saved) {
      artistCache = JSON.parse(saved);
      console.log(
        `✅ Loaded ${Object.keys(artistCache).length} items from cache: ${Object.keys(
          artistCache
        ).join(", ")}`
      );
    } else {
      console.log("ℹ️ No cached artists found yet.");
    }
  } catch (error) {
    console.error("❌ Error loading artist cache:", error);
  }
}

// Save cache back to localStorage
function saveCache() {
  try {
    localStorage.setItem("artistCache", JSON.stringify(artistCache));
    console.log("💾 Artist cache saved to localStorage.");
  } catch (error) {
    console.error("❌ Error saving artist cache:", error);
  }
}

// Add new artists to cache (indexed by ID)
export function addArtistsToCache(data) {
  console.log("Caching data:", data);
  if (Array.isArray(data)) {
    let addedCount = 0;
    for (const artist of data) {
      if (!artist || !artist.id) continue;
      if (!artistCache[artist.id]) {
        artistCache[artist.id] = artist;
        addedCount++;
      }
    }
    if (addedCount > 0) {
      console.log(`🎨 Added ${addedCount} new artists to cache.`);
      saveCache();
    } else {
      console.log("ℹ️ No new artists added (all already cached).");
    }
  } else if (typeof data === "object" && data !== null) {
    Object.assign(artistCache, data);
    saveCache();
  }
}

// Check if artist exists in cache
export function isArtistCached(id) {
  return !!artistCache[id];
}

// Return all cached artists
export function getCachedArtists() {
  return artistCache;
}
