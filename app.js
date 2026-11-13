// Invitation page: opens the app on a phone, shows a QR code of this same page on a computer.
// The link token only identifies the invitation (no access): the app then sends a sign-in code
// to the invited address. Keep APP_LINK identical to supabase/functions/send-invitation.
(function () {
  'use strict';
  var APP_LINK = /^(partageheritage:\/\/\/?invitation|exp:\/\/(10(\.\d{1,3}){3}|192\.168(\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){2})(:\d{1,5})?\/--\/invitation)$/;
  var DEFAULT_APP_LINK = 'partageheritage://invitation';

  var params = new URLSearchParams(location.hash.slice(1));
  var token = params.get('t') || '';
  var app = params.get('app') || '';
  if (!APP_LINK.test(app)) app = DEFAULT_APP_LINK;

  function show(id) { document.getElementById(id).hidden = false; }

  if (!/^[0-9a-f]{64}$/.test(token)) {
    show('broken');
    return;
  }

  var ua = navigator.userAgent;
  var isPhone = /Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  if (isPhone) {
    var link = document.getElementById('open-app');
    link.href = app + '?t=' + token;
    link.addEventListener('click', function () {
      // If the page is still in front after a moment, the app probably is not installed.
      setTimeout(function () {
        if (document.visibilityState === 'visible') show('not-opened');
      }, 2500);
    });
    show('phone');
  } else {
    var qr = qrcode(0, 'M');
    qr.addData(location.href);
    qr.make();
    document.getElementById('qr').innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    show('computer');
  }
})();
