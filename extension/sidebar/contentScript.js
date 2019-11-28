(function() {
    var prev;
  
    if (document.body.addEventListener) {
      document.body.addEventListener('mouseover', handler, false);
    }
    else if (document.body.attachEvent) {
      document.body.attachEvent('mouseover', function(e) {
        return handler(e || window.event);
      });
    }
    else {
      document.body.onmouseover = handler;
    }
  
    function handler(event) {
        console.log('hiii')
      if (event.target === document.body ||
          (prev && prev === event.target)) {
        return;
      }
      if (prev) {
        prev.className = prev.className.replace(/\bhighlight\b/, '');
        prev = undefined;
      }
      if (event.target) {
        prev = event.target;
        prev.className += " highl";
      }
    }
  
  })();