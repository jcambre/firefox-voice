import * as intentRunner from "../../background/intentRunner.js";
import { sendMessage } from "../../communicate.js";


intentRunner.registerIntent({
  name: "briefings.news",
  async run(context) {
    const bbcNewsUrl = 'https://podcast.voice.api.bbci.co.uk/rss/audio/p05hh4qy?api_key=TlL9AjCrXfCxVSpLdFjqDeaFjOcIYVbp';
    let bbcResponse = await fetch(bbcNewsUrl);
    const textResponse = await bbcResponse.text();
    const parsedRss = new window.DOMParser().parseFromString(textResponse, "text/xml");
    const briefingUrl = parsedRss.querySelector("item > enclosure").getAttribute("url");
    
    context.keepPopup();
    await sendMessage({
      type: "playExternalAudio",
      audioUrl: briefingUrl,
    });
  }
});