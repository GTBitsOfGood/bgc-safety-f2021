import fetch from "isomorphic-unfetch";
import urls from "../../utils/urls";

export const helloWorld = () =>
  fetch(urls.api.example, {
    method: "get",
    mode: "no-cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((json) => {
      if (json == null) {
        throw new Error("Could not connect to API!");
      } else if (!json.success) {
        throw new Error(json.message);
      }

      return json.payload;
    });
