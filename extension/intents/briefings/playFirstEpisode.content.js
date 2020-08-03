import { registerHandler } from "../../communicate.js";

registerHandler("playFirstEpisode", message => {
  const { selector } = message;
  console.log("i got here");
  console.log(selector);
  const firstEpisodeElement = document.querySelector(selector);
  firstEpisodeElement.click();
});