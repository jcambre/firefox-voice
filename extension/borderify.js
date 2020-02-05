console.log("I AM HERE");
browser.runtime.onMessage.addListener(message => {
    if (message.type === "onRecommendablePage") {
        console.log("errrmahgerd");
        // document.body.style.border = "5px solid red";
        // document.body.style.position = "relative";
        // document.body.style.top = "50px";
        
        const span = document.createElement("div");
        span.innerHTML = `Try asking Firefox Voice to <b>"read this page"</b>`;
        span.style.cssText =`position: fixed; 
                            z-index: 100; 
                            background: '#3B0052'; 
                            border-radius: 3px; 
                            top: 10px; 
                            width: 200px; 
                            margin-right: 10px; 
                            right: 0px; 
                            padding: 5px; 
                            opacity: 85%; 
                            filter: drop-shadow(0 0 0.25rem crimson);`;
        span.style.backgroundColor = '#3B0052';
        span.style.color = '#fff';
        span.style.fontFamily = 'Inter';
        span.style.fontSize = '0.85em';
        span.style.textAlign = 'center';

        
        document.body.prepend(span);
    }
});
