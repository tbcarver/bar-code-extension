function injectScript(file) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(file);
  (document.head || document.documentElement).appendChild(script);
}

injectScript('content.js');
