/* terms.js: plug and play "Ownership and Terms of Use" for any project built on the dv runtime.
   Self contained: it brings its own CSS, HTML, and JavaScript, and adds one item to the right sidebar menu.
   Edit CONFIG only. A blank value uses the automatic default (author, title, year, and email come from contents.js).
   This is a general template and is not legal advice; have it reviewed for your jurisdiction. */
(function () {
'use strict';
var D = window.DV; if (!D || !D.menu || !D.modal) return;
var CONFIG = { owner: '', site: '', email: '', law: '', updated: '12 October 2026' };

var M = (D.contents && D.contents.meta) || {};
var owner = CONFIG.owner || M.author || 'the author', site = CONFIG.site || M.title || document.title;
var year = M.year || new Date().getFullYear();
var email = CONFIG.email || ((M.contacts || {}).Email || '').replace(/^mailto:/, '');

function css() {
  if (document.getElementById('dvLegalCss')) return;
  var s = document.createElement('style'); s.id = 'dvLegalCss';
  s.textContent = '.dvLegalBody h3{font-size:1.1rem;margin:1.2rem 0 .3rem;line-height:1.35}.dvLegalBody p{margin:0 0 .8rem;line-height:1.7;overflow-wrap:anywhere}.dvLegalMeta{color:var(--dv-mut)}';
  document.head.appendChild(s);
}
var S = [
  ['1. Ownership', 'All content on this site, including the text, titles, structure, design, graphics, and source code, is owned by ' + owner + ' and is protected by copyright and other intellectual property laws. Copyright © ' + year + ' ' + owner + '. All rights reserved. Third party works that are cited or quoted remain the property of their respective owners and are credited to them.'],
  ['2. Permitted use', 'You may read, bookmark, install, and share links to this site for personal, educational, and non-commercial purposes. You may quote short passages with clear attribution to the author and the title of the work, as scholarly and fair use practice allows.'],
  ['3. Restrictions', 'Without prior written permission from ' + owner + ', you may not copy, republish, sell, rent, translate, adapt, or distribute the content or source code, in whole or in substantial part, present it as your own, or use it for commercial purposes.'],
  ['4. Citation', 'If you cite this work, use the name of the author, the title, the year, and the web address of the page you consulted. Where the site provides a "How to Cite" entry, use it.'],
  ['5. No professional advice', 'The content is provided for information, education, and, where applicable, scholarly or spiritual reflection. It is not legal, medical, financial, or other professional advice, and you remain responsible for your own decisions.'],
  ['6. No warranty', 'The site and its content are provided "as is" and "as available" without warranties of any kind. Reasonable care is taken to be accurate, but errors may remain and the content may change without notice.'],
  ['7. Acceptable use', 'You agree not to misuse the site, including by attempting unauthorized access, disrupting its operation, or using automated tools to copy the whole site.'],
  ['8. Links and third parties', 'The site may link to outside websites that ' + owner + ' does not control and is not responsible for.'],
  ['9. Messages and contact', 'A message sent through the contact form is written by you and sent through your own email application and provider. Do not send confidential or sensitive information.'],
  ['10. Offline use', 'This site can be installed and used offline. A copy stored on your device remains subject to these terms.'],
  ['11. Limitation of liability', 'To the fullest extent permitted by law, ' + owner + ' is not liable for any loss or damage arising from your use of, or inability to use, the site or its content.'],
  ['12. Changes', 'These terms may be updated from time to time. The date shown above is the date of the latest update, and continued use of the site after a change means that you accept the updated terms.']
];
if (CONFIG.law) S.push(['13. Governing law', 'These terms are governed by the laws of ' + CONFIG.law + '.']);
S.push([(S.length + 1) + '. Contact', email ? 'For permission requests or questions about these terms, write to ' + email + '.' : 'For permission requests or questions about these terms, use the contact form on the About the Author page.']);

function open() {
  css();
  var w = document.createElement('div'), p, h, i;
  w.className = 'dvLegalBody';
  p = document.createElement('p'); p.className = 'dvLegalMeta'; p.textContent = site + ' | Last updated: ' + CONFIG.updated; w.appendChild(p);
  for (i = 0; i < S.length; i++) {
    h = document.createElement('h3'); h.textContent = S[i][0]; w.appendChild(h);
    p = document.createElement('p'); p.textContent = S[i][1]; w.appendChild(p);
  }
  D.modal('Ownership and Terms of Use', w);
}
var el = D.menu('right').add({ label: 'Ownership and Terms of Use', fn: open });
el.insertAdjacentHTML('afterbegin', '<svg class="dvIco" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6"/></svg>');
})();
