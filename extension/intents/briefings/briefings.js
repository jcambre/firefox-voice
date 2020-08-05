import * as intentRunner from "../../background/intentRunner.js";

intentRunner.registerIntent({
  name: "briefings.news",
  async run(context) {
    const tab = await browser.tabs.create({
      url: "https://www.bbc.co.uk/sounds/play/live:bbc_radio_one",
    });
  }
});