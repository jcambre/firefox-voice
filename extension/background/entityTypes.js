import { languageNames } from "./languages.js";
import { metadata } from "../services/metadata.js";
import { convertEntities } from "../language/compiler.js";
import English from "../language/langs/english.js";

export const allServiceNames = [];

for (const id in metadata.search) {
  const item = metadata.search[id];
  for (const name of item.names) {
    allServiceNames.push(name);
  }
}

export const musicServiceNames = [];

for (const id in metadata.music) {
  const item = metadata.music[id];
  for (const name of item.names) {
    musicServiceNames.push(name);
  }
}

export const radioServiceNames = [];

for (const id in metadata.radio) {
  const item = metadata.radio[id];
  for (const name of item.names) {
    radioServiceNames.push(name);
  }
}

export const entityTypes = convertEntities({
  serviceName: allServiceNames,
  musicServiceName: musicServiceNames,
  radioServiceName: radioServiceNames,
  lang: languageNames(),
  smallNumber: English.numberNames,
});
