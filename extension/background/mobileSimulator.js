  // JULIA'S HACK TO SIMULATE MOBILE REQUESTS FOR A BETTER-SIZED CARD
  var targetPage = "https://www.google.com/*";

  console.log("I AM HEEERE")

  var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1";

  function rewriteUserAgentHeader(e) {
    e.requestHeaders.forEach(function(header){
      if (header.name.toLowerCase() == "user-agent") {
        header.value = ua;
      }
    });
    return {requestHeaders: e.requestHeaders};
  }

  browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    {urls: [targetPage]},
    ["blocking", "requestHeaders"]
  );