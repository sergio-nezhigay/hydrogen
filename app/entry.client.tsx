import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode, useEffect} from 'react';
import {hydrateRoot} from 'react-dom/client';

const GTM_ID = 'GTM-WRQRP5RF'; // Replace 'GTM-XXXX' with your actual GTM ID.

let gtmScriptAdded = false;

function addGtmScript() {
  if (gtmScriptAdded) {
    return;
  }

  // Dynamically execute the GTM script in the head
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    const f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_ID);

  // GTM noscript for the body as a fallback
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-XXXX';
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);

  gtmScriptAdded = true; // Set the flag to true after adding GTM script and noscript
}

function App() {
  useEffect(() => {
    addGtmScript();
  }, []);

  return <RemixBrowser />;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
