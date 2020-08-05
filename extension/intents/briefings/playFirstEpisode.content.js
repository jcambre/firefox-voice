import { registerHandler } from "../../communicate.js";

registerHandler("playFirstEpisode", message => {
  const { selector } = message;
  const firstEpisodeElement = document.querySelector(selector);
  firstEpisodeElement.click();
});