import * as intentRunner from "../../background/intentRunner.js";
import { sendMessage } from "../../communicate.js";


async function getAudioUrl(rssUrl) {
  let bbcResponse = await fetch(rssUrl);
  const textResponse = await bbcResponse.text();
  const parsedRss = new window.DOMParser().parseFromString(textResponse, "text/xml");
  const briefingUrl = parsedRss.querySelector("item > enclosure").getAttribute("url");
  return briefingUrl;
}

intentRunner.registerIntent({
  name: "briefings.news",
  async run(context) {
    const bbcNewsUrl = 'https://podcast.voice.api.bbci.co.uk/rss/audio/p05hh4qy?api_key=TlL9AjCrXfCxVSpLdFjqDeaFjOcIYVbp';
    const briefingUrl = await getAudioUrl(bbcNewsUrl);

    context.keepPopup();
    await sendMessage({
      type: "playExternalAudio",
      audioUrl: briefingUrl,
    });
  }
});

intentRunner.registerIntent({
  name: "briefings.sports",
  async run(context) {
    const bbcSportsUrl = 'https://podcast.voice.api.bbci.co.uk/rss/audio/p05hh4xd?api_key=TlL9AjCrXfCxVSpLdFjqDeaFjOcIYVbp';
    const briefingUrl = await getAudioUrl(bbcSportsUrl);

    context.keepPopup();
    await sendMessage({
      type: "playExternalAudio",
      audioUrl: briefingUrl,
    });
  }
});

intentRunner.registerIntent({
  name: "briefings.flash",
  async run(context) {
    const bbcFlashUrl = 'https://podcast.voice.api.bbci.co.uk/rss/audio/p03q8kd9?api_key=TlL9AjCrXfCxVSpLdFjqDeaFjOcIYVbp';
    const briefingUrl = await getAudioUrl(bbcFlashUrl);

    context.keepPopup();
    await sendMessage({
      type: "playExternalAudio",
      audioUrl: briefingUrl,
    });
  }
});