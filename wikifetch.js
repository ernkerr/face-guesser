//

// async function

export async function fetchWikiData(name) {
  // construct the url baseon on wiki rules?

  const baseUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${TITLE}
`;

  const url = ``;
  // Call `fetch()`, passing in the URL.
  fetch(url)
    // fetch() returns a promise. When we have received a response from the server,
    // the promise's `then()` handler is called with the response.
    .then((response) => {
      // Our handler throws an error if the request did not succeed.
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      // Otherwise (if the response succeeded), our handler fetches the response
      // as text by calling response.text(), and immediately returns the promise
      // returned by `response.text()`.
      return response.text();
    })
    // When response.text() has succeeded, the `then()` handler is called with
    // the text, and we console log the text
    .then((text) => {
      console.log(text);
    })
    // Catch any errors that might happen, and display a message
    // in the `poemDisplay` box.
    .catch((error) => {
      console.log(`Could not fetch verse: ${error}`);
    });
}
