import { registerHandler } from "../communicate.js";

(function() {
    registerHandler("scanForIntents", async message => {
        console.log("HERE I AM");
    
        let intents = [];
    
        const intentElems = document.querySelectorAll('[data-intent]');
        for (let i=0; i < intentElems.length; i++) {
            const intent = intentElems[i];
            const queryText = intent.dataset.intent;
            const response = intent.innerText;
            intents.push({
                queryText,
                response,
                type: "content"
            })
        }
        
        const executableIntents = document.querySelectorAll('[data-executableintent]');
        for (let i=0; i < executableIntents.length; i++) {
            const intent = executableIntents[i];
            const queryText = intent.dataset.executableintent;
            const functionName = intent.innerText;
            intents.push({
                queryText,
                functionName,
                type: "executable"
            })
        }
        console.log(intents);
    
        return intents;
    });

    registerHandler("runFunction", async message => {
        console.log("at least i got here");
        console.log(message);
        const functionName = message.functionName;
        var actualCode = `
        ${ functionName }();
        `;

        var script = document.createElement('script');
        script.textContent = actualCode;
        (document.head||document.documentElement).appendChild(script);
        script.remove();
        // window["downloadCv"](); // reeeeally not sure about this
    });

  })();