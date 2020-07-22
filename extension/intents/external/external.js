import * as intentRunner from "../../background/intentRunner.js";

intentRunner.registerIntent({
    name: "external.run",
    async run(context) {
        if (context.slots.type === "content") {
            context.presentMessage(context.slots.response);
        } else {
            const activeTabId = context.slots.activeTabId;
            await browser.tabs.sendMessage(activeTabId, {type: "runFunction", functionName: context.slots.functionName }); 
            context.done(0);
        }
    },
});