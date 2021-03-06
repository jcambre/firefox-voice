/* globals log */

import * as intentRunner from "../../background/intentRunner.js";
import * as serviceList from "../../background/serviceList.js";
import * as browserUtil from "../../browserUtil.js";
import { sendMessage } from "../../communicate.js";

const SERVICES = {};

export function register(service) {
  if (!service.id) {
    log.error("Bad music service, no id:", service);
    throw new Error("Invalid service: no id");
  }
  if (SERVICES[service.id]) {
    throw new Error(
      `Attempt to register two music services with id ${service.id}`
    );
  }
  SERVICES[service.id] = service;
}

export function getServiceNamesAndTitles() {
  let names = Object.keys(SERVICES);
  names.sort();
  names = names.filter(name => !SERVICES[name].skipAutodetect);
  const services = names.map(name => {
    return { name, title: SERVICES[name].title, imgSrc: SERVICES[name].imgSrc };
  });
  services.unshift({ name: "auto", title: "Detect service" });
  return services;
}

async function getService(context, options) {
  options = options || {};
  let ServiceClass;
  const explicitService = context.slots.service || context.parameters.service;
  options.defaultService = options.defaultService || "spotify";
  if (explicitService) {
    ServiceClass = SERVICES[serviceList.mapMusicServiceName(explicitService)];
    if (!ServiceClass) {
      throw new Error(
        `[service] slot refers to unknown service: ${explicitService}`
      );
    }
  } else {
    ServiceClass = await serviceList.getService(
      "musicService",
      SERVICES,
      options
    );
  }
  return new ServiceClass(context);
}

async function pauseAnyButService(context, serviceId) {
  for (const ServiceClass of Object.values(SERVICES)) {
    if (ServiceClass.id === serviceId) {
      continue;
    }
    const service = new ServiceClass(context);
    await service.pauseAny();
  }
}

async function pauseAnyButTab(context, tabId) {
  for (const ServiceClass of Object.values(SERVICES)) {
    const service = new ServiceClass(context);
    await service.pauseAny({ exceptTabId: tabId });
  }
}

intentRunner.registerIntent({
  name: "music.play",
  async run(context) {
    if (context.parameters.prefixQuery !== undefined) {
      context.slots.query =
        context.parameters.prefixQuery + " " + context.slots.query;
    }
    const service = await getService(context, { lookAtCurrentTab: true });
    await service.playQuery(context.slots.query);
    // FIXME: this won't pause other YouTube tabs when you play a new YouTube tab,
    // though maybe YouTube should handle that itself?
    if (service.tab) {
      await pauseAnyButTab(context, service.tab.id);
    } else {
      await pauseAnyButService(context, service.id);
    }
  },
});

intentRunner.registerIntent({
  name: "music.pause",
  async run(context) {
    for (const ServiceClass of Object.values(SERVICES)) {
      const service = new ServiceClass(context);
      await service.pauseAny();
    }
  },
});

intentRunner.registerIntent({
  name: "music.unpause",
  async run(context) {
    for (const ServiceClass of Object.values(SERVICES)) {
      const service = new ServiceClass(context);
      await service.pauseAny({
        exceptTabId: (await browserUtil.activeTab()).id,
      });
    }
    const service = await getService(context, { lookAtCurrentTab: true });
    await service.unpause();
  },
});

intentRunner.registerIntent({
  name: "music.focus",
  async run(context) {
    const service = await getService(context);
    await service.activateOrOpen();
  },
});

intentRunner.registerIntent({
  name: "music.move",
  async run(context) {
    const service = await getService(context, { lookAtCurrentTab: true });
    await service.move(context.parameters.direction);
  },
});

intentRunner.registerIntent({
  name: "music.showTitle",
  async run(context) {
    const tabs = await browser.tabs.query({ audible: true });
    if (!tabs.length) {
      const e = new Error("Nothing is playing");
      e.displayMessage = "Nothing is playing";
      throw e;
    }
    const activeTab = await browserUtil.activeTab();
    log.info(activeTab);
    const musicServiceFav = activeTab.favIconUrl;
    const musicTitle = tabs[0].title;

    const card = {
      answer: {
        imgSrc: musicServiceFav,
        text: musicTitle,
        eduText: `Click mic and say ‘pause’, ‘next’ or ‘stop’`,
      },
    };
    await sendMessage({
      type: "showSearchResults",
      card,
      searchResults: card,
    });
  },
});

intentRunner.registerIntent({
  name: "music.support",
  async run(context) {
    const card = {
      answer: {
        eduMic: `Say a music to set to default`,
        eduText: `Click a music to set to default`,
      },

      music: [],
    };

    await browser.runtime.sendMessage({
      type: "showSearchResults",
      card,
      searchResults: card,
    });
    context.keepPopup();
  },
});

intentRunner.registerIntent({
  name: "music.volume",
  async run(context) {
    const service = await getService(context, {
      lookAtCurrentTab: true,
      lookAtAllTabs: true,
    });
    await service.adjustVolume(
      context.slots.inputVolume,
      context.parameters.volumeLevel
    );
  },
});

intentRunner.registerIntent({
  name: "music.mute",
  async run(context) {
    const service = await getService(context, { lookAtCurrentTab: true });
    await service.mute();
  },
});

intentRunner.registerIntent({
  name: "music.unmute",
  async run(context) {
    const service = await getService(context, { lookAtCurrentTab: true });
    await service.unmute();
  },
});

intentRunner.registerIntent({
  name: "music.playAlbum",
  async run(context) {
    const service = await getService(context, { lookAtCurrentTab: true });
    await service.playAlbum(context.slots.query);
    if (service.tab) {
      await pauseAnyButTab(context, service.tab.id);
    } else {
      await pauseAnyButService(context, service.id);
    }
  },
});

intentRunner.registerIntent({
  name: "music.playPlaylist",
  async run(context) {
    const service = await getService(context, { lookAtCurrentTab: true });
    await service.playPlaylist(context.slots.query);
    if (service.tab) {
      await pauseAnyButTab(context, service.tab.id);
    } else {
      await pauseAnyButService(context, service.id);
    }
  },
});

// FIXME: workaround for a legacy module needing access to this function:
window.music_getServiceNamesAndTitles = getServiceNamesAndTitles;
