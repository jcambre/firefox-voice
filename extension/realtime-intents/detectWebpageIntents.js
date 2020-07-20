(function() {
    communicate.register("scanForIntents", async message => {
        if (document.querySelector('meta[property="speakable"]')) {
            console.log("HERE I AM");
        
            let intents = [];
            let intentElems;
        
            intentElems = document.querySelectorAll('[data-intent]');
            for (let i=0; i < intentElems.length; i++) {
                const intent = intentElems[i];
                const queryText = intent.dataset.intent;
                const response = intent.innerText;
                intents.push({
                    queryText,
                    response
                })
            }
            console.log(intents);
        
            return intents;
        }
    });
  })();