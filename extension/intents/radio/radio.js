import * as intentRunner from "../../background/intentRunner.js";
import * as serviceList from "../../background/serviceList.js";
import * as browserUtil from "../../browserUtil.js";
import { metadata } from "../../services/metadata.js";

intentRunner.registerIntent({
  name: "radio.playStation",
  async run(context) {
    let service = context.slots.service || context.parameters.service;
    
    const SERVICE_BANG_ALIASES = {};
    for (const id in metadata.radio) {
      for (const name of metadata.radio[id].names) {
        SERVICE_BANG_ALIASES[name] = metadata.radio[id].stationUrl;
      }
    }
    
    const stationUrl = SERVICE_BANG_ALIASES[service.toLowerCase().trim()];


    await browserUtil.createAndLoadTab({ url: stationUrl });
    console.log("i am here");
    console.log(service);
    console.log(stationUrl);
  }
});