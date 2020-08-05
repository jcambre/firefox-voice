import * as intentRunner from "../../background/intentRunner.js";
import * as browserUtil from "../../browserUtil.js";
import * as content from "../../background/content.js";

intentRunner.registerIntent({
  name: "briefings.news",
  async run(context) {
    const tab = await browser.tabs.create({
      url: "https://www.bbc.co.uk/sounds/brand/p05hh4qy",
    });

    const firstEpisodeSelector = ".sc-c-playable-list-card__link";

    await browserUtil.waitForPageToLoadUsingSelector(tab.id, {
      selector: firstEpisodeSelector,
    });
    await content.inject(tab.id, [
      "/intents/briefings/playFirstEpisode.content.js",
    ]);
    const found = await browser.tabs.sendMessage(tab.id, {
      type: "playFirstEpisode",
      selector: firstEpisodeSelector,
    });
  }
});