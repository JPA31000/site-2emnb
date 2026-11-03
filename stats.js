/* Relevé de fréquentation anonyme du carnet 2EMNB — voir la page « Stat » (stat.html).
   Pour chaque page ouverte, il envoie : le nom de la page, « nouvelle visite » (premier chargement dans l'onglet) et le type d'appareil.
   Le jour et l'heure sont ajoutés par Google. Aucun cookie, aucune adresse IP ni e-mail, aucun identifiant gardé :
   le seul stockage est un drapeau d'onglet (sessionStorage) qui distingue « nouvelle visite » et « page suivante ».
   Rien n'est envoyé : depuis un fichier local ou un autre site que celui du carnet, avec « Ne pas me suivre » (DNT, GPC),
   si le visiteur a coché « Ne pas compter mes visites » sur la page Stat, ni pour les robots d'indexation. */
(function () {
  'use strict';
  var URL_RELEVE = 'https://script.google.com/macros/s/AKfycbx-d2dnHiXWVYBLNUbZePKlJRF3Kdpx_DUVYhM5ssJQrQuofivZXJqqSoHCze6ackcFwA/exec';   // l'adresse de l'application Web Google (elle finit par /exec) ; vide = relevé éteint (voir MODE_D_EMPLOI.md)
  var HOTES = ['jpa31000.github.io'];
  var CLE_IGNORER = 'carnet-stat-ignorer';
  window.CARNET_STAT = { url: URL_RELEVE, cleIgnorer: CLE_IGNORER };

  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!URL_RELEVE || HOTES.indexOf(location.hostname) < 0 || page === 'stat.html') return;
  try { if (localStorage.getItem(CLE_IGNORER) === '1') return; } catch (e) { /* stockage refusé : on continue */ }
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  if (/bot|crawl|spider|slurp|headless|lighthouse/i.test(navigator.userAgent)) return;

  var nouvelle = true;
  try { nouvelle = !sessionStorage.getItem('carnet-stat-visite'); sessionStorage.setItem('carnet-stat-visite', '1'); } catch (e) { /* tant pis */ }
  var petit = Math.min(screen.width || 0, screen.height || 0);
  var tactile = !!window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var appareil = tactile ? (petit && petit < 600 ? 'mobile' : 'tablette') : 'bureau';
  try {
    // « text/plain » (par défaut pour une chaîne) : requête simple, sans pré-vérification ; la réponse n'est pas lue
    fetch(URL_RELEVE, { method: 'POST', mode: 'no-cors', keepalive: true, body: JSON.stringify({ action: 'visite', page: page, nouvelle: nouvelle, appareil: appareil }) }).catch(function () { /* hors ligne : rien */ });
  } catch (e) { /* navigateur ancien : rien */ }
})();
