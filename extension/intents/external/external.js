import * as intentRunner from "../../background/intentRunner.js";

intentRunner.registerIntent({
    name: "external.run",
    async run(context) {
        context.presentMessage(context.slots.response);
    },
});