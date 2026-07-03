const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('is-open') ?? false;
  navToggle.setAttribute('aria-expanded', String(open));
});

const normalisePath = (value) => {
  const url = new URL(value, location.href);
  return url.pathname.replace(/\/index\.html$/, '/');
};

const currentPath = normalisePath(location.href);
document.querySelectorAll('[data-nav] a').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.includes('#')) return;
  if (normalisePath(href) === currentPath) link.setAttribute('aria-current', 'page');
});

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;

  let url;
  try {
    url = new URL(href, location.href);
  } catch {
    return;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  const isSameOrigin = url.origin === location.origin;
  const currentParts = location.pathname.split('/').filter(Boolean);
  const targetParts = url.pathname.split('/').filter(Boolean);
  const currentRepo = location.hostname.endsWith('github.io') ? currentParts[0] : '';
  const leavesCurrentGithubRepo = Boolean(
    currentRepo &&
    isSameOrigin &&
    targetParts[0] &&
    targetParts[0] !== currentRepo
  );

  if (isSameOrigin && !leavesCurrentGithubRepo) return;
  link.setAttribute('target', '_blank');
  const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
  rel.add('noopener');
  rel.add('noreferrer');
  link.setAttribute('rel', Array.from(rel).join(' '));
});

const reveals = document.querySelectorAll('.reveal');
const showReveal = (element) => element.classList.add('is-visible');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showReveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach(showReveal);
}

(() => {
  const body = document.body;
  if (!body) return;

  const actions = document.createElement('nav');
  actions.className = 'floating-actions';
  actions.setAttribute('aria-label', 'Quick page links');

  const topButton = document.createElement('button');
  topButton.className = 'floating-top-button';
  topButton.type = 'button';
  topButton.textContent = 'Top';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  actions.appendChild(topButton);
  body.appendChild(actions);

  const syncFloatingActions = () => {
    actions.classList.toggle('is-visible', window.scrollY > 220);
  };

  syncFloatingActions();
  window.addEventListener('scroll', syncFloatingActions, { passive: true });
})();

document.querySelectorAll('[data-region-switcher]').forEach((switcher) => {
  const buttons = Array.from(switcher.querySelectorAll('[data-region-choice]'));
  const cards = Array.from(document.querySelectorAll('[data-region-card]'));

  const setRegion = (region) => {
    buttons.forEach((button) => {
      const active = button.getAttribute('data-region-choice') === region;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    cards.forEach((card) => {
      const visible = region === 'all' || card.getAttribute('data-region-card') === region;
      card.hidden = !visible;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => setRegion(button.getAttribute('data-region-choice') || 'all'));
  });

  setRegion('all');
});

(() => {
  const cardGrid = document.querySelector('[data-oceania-card-grid]');
  const hitMap = document.querySelector('[data-oceania-hit-map]');
  const detailPanel = document.querySelector('[data-oceania-detail]');
  if (!cardGrid || !detailPanel) return;

  const filterButtons = Array.from(document.querySelectorAll('[data-oceania-choice]'));
  const svgNS = 'http://www.w3.org/2000/svg';
  const checked = 'Checked 2026-07-03';

  const sourceNotes = {
    regions: `${checked}. Sources: Wikipedia Oceania article region section and UN M49 caveat.`,
    list: `${checked}. Sources: Wikipedia Oceania country and territory list plus Oceania template.`,
    dfat: `${checked}. Sources: Wikipedia list/template and DFAT Pacific regional organisations page.`,
    followup: `${checked}. Sources: Wikipedia Oceania article/template. Classification needs follow-up before stronger claims.`
  };

  const trace = (points) => {
    const [start, ...rest] = points;
    return `M ${start[0]} ${start[1]} ${rest.map(([x, y]) => `L ${x} ${y}`).join(' ')} Z`;
  };

  const multiTrace = (...paths) => paths.map(trace).join(' ');

  const mapShapes = {
    australia: trace([[0, 232], [34, 226], [72, 231], [108, 242], [146, 252], [190, 259], [231, 269], [276, 291], [278, 324], [248, 349], [228, 383], [196, 421], [152, 463], [93, 470], [47, 455], [15, 416], [2, 364]]),
    fiji: trace([[296, 214], [332, 216], [357, 239], [358, 276], [345, 320], [316, 338], [293, 315], [290, 270]]),
    kiribati: multiTrace(
      [[272, 126], [312, 124], [334, 143], [330, 173], [300, 184], [270, 170], [260, 145]],
      [[356, 169], [396, 169], [422, 191], [418, 224], [381, 236], [353, 215]],
      [[474, 118], [515, 121], [548, 150], [548, 196], [520, 219], [486, 208], [465, 174]],
      [[509, 211], [558, 211], [606, 237], [609, 269], [566, 284], [521, 268]]
    ),
    marshallIslands: trace([[191, 75], [229, 62], [268, 76], [306, 95], [310, 126], [287, 147], [245, 143], [203, 134], [190, 105]]),
    micronesiaFsm: trace([[48, 77], [92, 74], [127, 91], [173, 93], [205, 107], [228, 123], [221, 149], [185, 165], [137, 158], [91, 146], [50, 130], [43, 99]]),
    nauru: trace([[232, 135], [253, 130], [273, 142], [274, 167], [259, 183], [237, 178], [225, 157]]),
    newZealand: trace([[309, 352], [371, 346], [429, 362], [475, 393], [468, 435], [429, 472], [348, 478], [296, 454], [260, 423], [268, 386]]),
    palau: trace([[6, 128], [32, 126], [49, 148], [44, 185], [22, 208], [2, 196], [0, 152]]),
    papuaNewGuinea: trace([[79, 129], [140, 128], [184, 146], [219, 166], [222, 197], [197, 219], [151, 222], [109, 207], [79, 181]]),
    samoa: trace([[534, 77], [548, 78], [555, 88], [549, 99], [536, 98], [529, 88]]),
    solomonIslands: trace([[236, 184], [275, 174], [324, 190], [339, 222], [316, 245], [269, 239], [234, 213]]),
    tonga: trace([[354, 263], [379, 255], [401, 276], [403, 319], [386, 348], [361, 335], [348, 300]]),
    tuvalu: trace([[289, 159], [331, 156], [361, 179], [357, 214], [323, 225], [296, 208]]),
    vanuatu: trace([[233, 235], [264, 227], [297, 241], [308, 279], [296, 315], [264, 331], [238, 309], [225, 271]]),
    cookIslands: trace([[435, 224], [482, 212], [526, 224], [567, 249], [570, 287], [535, 319], [487, 314], [447, 293], [424, 258]]),
    niue: trace([[385, 267], [418, 270], [431, 302], [417, 341], [393, 332], [382, 300]]),
    frenchPolynesia: trace([[530, 234], [580, 207], [626, 216], [662, 267], [662, 344], [614, 371], [553, 348], [517, 305]]),
    newCaledonia: trace([[190, 277], [235, 263], [280, 281], [294, 314], [269, 345], [219, 348], [187, 325]]),
    wallisFutuna: trace([[379, 223], [407, 221], [421, 238], [412, 258], [387, 255], [373, 239]]),
    tokelau: trace([[393, 193], [430, 193], [452, 211], [441, 238], [403, 238], [388, 217]]),
    hawaii: trace([[438, 0], [486, 0], [541, 8], [562, 31], [542, 47], [485, 43], [442, 25]]),
    americanSamoa: trace([[529, 98], [549, 96], [558, 110], [550, 122], [532, 119]]),
    guam: trace([[58, 76], [88, 67], [111, 84], [105, 111], [76, 119], [56, 103]]),
    northernMarianaIslands: trace([[83, 7], [117, 2], [137, 12], [133, 42], [111, 75], [84, 63], [76, 31]])
  };

  mapShapes.australasia = `${mapShapes.australia} ${mapShapes.newZealand}`;
  mapShapes.melanesia = `${mapShapes.papuaNewGuinea} ${mapShapes.solomonIslands} ${mapShapes.vanuatu} ${mapShapes.fiji} ${mapShapes.newCaledonia}`;
  mapShapes.micronesia = `${mapShapes.northernMarianaIslands} ${mapShapes.guam} ${mapShapes.palau} ${mapShapes.micronesiaFsm} ${mapShapes.marshallIslands} ${mapShapes.nauru}`;
  mapShapes.polynesia = `${mapShapes.hawaii} ${mapShapes.samoa} ${mapShapes.americanSamoa} ${mapShapes.tokelau} ${mapShapes.wallisFutuna} ${mapShapes.tonga} ${mapShapes.niue} ${mapShapes.cookIslands} ${mapShapes.newZealand} ${mapShapes.frenchPolynesia}`;

  const blobShapes = {
    australia: 'M 75 224 L 88 220 L 104 226 L 147 260 L 154 255 L 181 256 L 188 265 L 189 279 L 184 288 L 176 291 L 176 296 L 184 314 L 186 340 L 207 340 L 224 364 L 221 389 L 202 400 L 182 395 L 174 377 L 164 372 L 166 399 L 151 420 L 139 425 L 146 464 L 135 478 L 111 478 L 102 465 L 66 478 L 17 478 L 0 462 L 0 234 L 19 220 Z M 36 388 L 32 384 L 31 405 L 39 399 Z M 262 373 L 246 376 L 229 364 L 241 342 L 255 333 L 274 343 L 280 357 L 275 369 Z',
    fiji: 'M 296 233 L 306 220 L 321 222 L 330 234 L 329 246 L 339 250 L 341 260 L 354 263 L 359 274 L 359 297 L 342 319 L 330 320 L 326 314 L 330 299 L 315 295 L 319 313 L 315 325 L 307 328 L 299 321 L 292 298 L 296 284 L 293 274 L 299 259 Z M 342 285 L 335 282 L 333 286 L 337 289 Z',
    kiribati: 'M 269 156 L 279 147 L 283 134 L 295 129 L 302 134 L 316 134 L 323 146 L 332 146 L 340 156 L 342 169 L 332 185 L 298 179 L 290 193 L 278 195 L 268 188 L 261 175 Z M 420 171 L 423 188 L 414 203 L 395 199 L 361 208 L 348 192 L 353 178 L 382 159 L 405 158 Z M 495 110 L 513 123 L 524 142 L 529 180 L 536 186 L 558 187 L 569 203 L 565 220 L 531 250 L 504 241 L 501 230 L 505 215 L 478 199 L 480 184 L 489 177 L 488 167 L 483 154 L 468 147 L 464 134 L 476 114 L 485 109 Z',
    marshallIslands: 'M 246 118 L 248 102 L 238 98 L 234 103 L 217 105 L 191 92 L 195 69 L 208 53 L 233 56 L 262 41 L 276 41 L 306 76 L 311 91 L 310 114 L 299 127 L 283 130 L 279 146 L 265 155 L 246 146 Z',
    micronesiaFsm: 'M 227 113 L 240 122 L 243 130 L 242 142 L 232 153 L 198 158 L 177 156 L 159 161 L 147 144 L 140 142 L 77 139 L 45 107 L 56 68 L 73 65 L 81 68 L 82 76 L 93 86 L 126 74 L 161 75 L 183 92 Z',
    nauru: 'M 263 161 L 253 184 L 241 181 L 226 165 L 226 158 L 237 147 L 260 153 Z',
    newZealand: 'M 341 383 L 356 384 L 351 387 L 361 402 L 356 426 L 372 437 L 386 434 L 394 442 L 394 462 L 385 476 L 357 478 L 354 472 L 343 478 L 331 478 L 329 469 L 311 478 L 264 478 L 254 472 L 246 478 L 225 478 L 217 474 L 215 466 L 221 452 L 235 449 L 252 429 L 260 429 L 279 410 L 279 402 L 265 396 L 261 389 L 271 371 L 280 367 L 305 369 L 313 381 L 320 374 Z M 319 438 L 320 448 L 336 442 L 324 438 L 322 432 L 317 433 Z M 329 351 L 339 336 L 360 331 L 374 350 L 373 368 L 358 382 L 322 374 Z',
    palau: 'M 8 133 L 0 122 L 0 105 L 20 89 L 38 89 L 46 101 L 45 128 L 30 138 Z',
    papuaNewGuinea: 'M 139 248 L 85 218 L 90 198 L 81 173 L 91 155 L 106 146 L 124 146 L 146 151 L 155 165 L 168 158 L 189 156 L 211 167 L 216 175 L 215 186 L 192 193 L 172 211 L 179 222 L 187 223 L 185 249 L 165 257 L 156 255 L 151 248 Z',
    solomonIslands: 'M 252 202 L 289 226 L 292 247 L 288 257 L 277 257 L 270 243 L 252 240 L 241 244 L 232 238 L 224 265 L 188 264 L 188 223 L 175 216 L 180 203 L 199 190 L 227 184 L 237 188 L 239 202 Z',
    tonga: 'M 388 264 L 394 271 L 385 282 L 385 292 L 392 302 L 388 318 L 379 327 L 350 327 L 348 314 L 359 300 L 366 277 L 358 274 L 358 261 L 362 256 L 373 255 Z',
    tuvalu: 'M 348 242 L 332 241 L 316 216 L 300 221 L 291 215 L 289 198 L 296 185 L 325 184 L 350 193 L 360 213 L 361 227 L 354 230 L 354 238 Z',
    vanuatu: 'M 236 264 L 230 260 L 236 243 L 260 243 L 287 273 L 288 289 L 271 296 L 247 287 L 237 275 Z',
    cookIslands: 'M 433 265 L 440 263 L 442 257 L 411 227 L 392 227 L 381 233 L 379 228 L 369 226 L 365 216 L 374 206 L 407 204 L 425 214 L 446 205 L 468 209 L 472 201 L 479 201 L 489 211 L 501 215 L 503 225 L 496 248 L 489 253 L 477 253 L 468 262 L 479 267 L 483 278 L 492 278 L 501 286 L 492 322 L 485 331 L 453 324 L 449 314 L 454 308 L 441 308 L 429 285 L 428 301 L 419 310 L 410 311 L 392 302 L 396 277 L 416 273 L 425 281 Z M 473 302 L 471 305 L 476 305 L 478 300 Z',
    frenchPolynesia: 'M 595 375 L 575 380 L 555 365 L 546 349 L 522 346 L 501 334 L 493 321 L 501 285 L 485 276 L 482 261 L 484 254 L 494 251 L 499 242 L 511 242 L 527 250 L 552 245 L 573 225 L 573 205 L 580 192 L 588 186 L 601 185 L 621 194 L 635 211 L 648 272 L 661 295 L 662 309 L 654 339 L 640 359 L 624 362 L 615 358 Z M 552 292 L 545 293 L 545 298 L 556 298 L 557 292 Z',
    newCaledonia: 'M 184 308 L 180 299 L 197 271 L 206 264 L 225 266 L 236 272 L 244 286 L 292 306 L 298 317 L 298 330 L 292 339 L 277 341 L 265 331 L 239 326 L 232 330 L 209 329 L 192 321 Z',
    wallisFutuna: 'M 366 226 L 374 228 L 374 248 L 355 260 L 342 259 L 340 246 L 354 238 L 356 228 Z',
    hawaii: 'M 464 31 L 452 33 L 439 26 L 427 29 L 375 20 L 365 13 L 365 4 L 367 0 L 472 0 L 476 5 L 478 1 L 507 0 L 513 14 L 522 14 L 531 24 L 530 36 L 524 44 L 502 57 L 493 57 L 475 48 L 473 35 L 479 29 Z',
    northernMarianaIslands: 'M 81 61 L 82 55 L 96 57 L 85 54 L 83 44 L 88 9 L 99 1 L 121 5 L 130 16 L 135 33 L 134 64 L 126 69 L 104 61 L 125 72 L 93 86 L 81 74 Z'
  };

  Object.assign(mapShapes, blobShapes);
  mapShapes.australasia = `${mapShapes.australia} ${mapShapes.newZealand}`;
  mapShapes.melanesia = `${mapShapes.papuaNewGuinea} ${mapShapes.solomonIslands} ${mapShapes.vanuatu} ${mapShapes.fiji} ${mapShapes.newCaledonia}`;
  mapShapes.micronesia = `${mapShapes.northernMarianaIslands} ${mapShapes.guam} ${mapShapes.palau} ${mapShapes.micronesiaFsm} ${mapShapes.marshallIslands} ${mapShapes.nauru}`;
  mapShapes.polynesia = `${mapShapes.hawaii} ${mapShapes.samoa} ${mapShapes.americanSamoa} ${mapShapes.tokelau} ${mapShapes.wallisFutuna} ${mapShapes.tonga} ${mapShapes.niue} ${mapShapes.cookIslands} ${mapShapes.newZealand} ${mapShapes.frenchPolynesia}`;

  const areaData = [
    { id: 'australasia', kind: 'region', tag: 'Regional frame', name: 'Australasia', status: 'Sources checked describe this as Australia, New Zealand and neighbouring Pacific islands.', summary: 'Use as a broad source frame only. Local authority, First Nations and tangata whenua sources still need their own layers.', next: 'Next research layer: history, local constitutional difference, federal/state/territory/council levels, Indigenous governance and treaty settings.', source: sourceNotes.regions, shape: mapShapes.australasia },
    { id: 'melanesia', kind: 'region', tag: 'Regional frame', name: 'Melanesia', status: 'Sources checked place New Guinea, Solomon Islands, Vanuatu, Fiji and New Caledonia inside this broad frame.', summary: 'This is a navigation shelf, not a single civic unit. It points toward language, land, colonial history and sovereignty questions that differ sharply by place.', next: 'Next research layer: Bougainville, West Papua, New Caledonia and island-state governance histories.', source: sourceNotes.regions, shape: mapShapes.melanesia },
    { id: 'micronesia', kind: 'region', tag: 'Regional frame', name: 'Micronesia', status: 'Sources checked use this frame for the Mariana, Caroline and Marshall island arcs, with Kiribati links depending on frame.', summary: 'This card is a source frame for a north-western Pacific network, including several US, freely associated and sovereign-state relationships.', next: 'Next research layer: compacts of free association, US territorial government, customary authority and regional organisations.', source: sourceNotes.regions, shape: mapShapes.micronesia },
    { id: 'polynesia', kind: 'region', tag: 'Regional frame', name: 'Polynesia', status: "Sources checked describe a wide triangle from Hawai'i to Aotearoa New Zealand to Rapa Nui/Easter Island.", summary: 'The frame includes very different political statuses, languages and cultural authorities. Treat it as an atlas shelf, not a consent layer.', next: 'Next research layer: kingdom, state, territory, free association and Indigenous governance histories across the triangle.', source: sourceNotes.regions, shape: mapShapes.polynesia },

    { id: 'australia', kind: 'state', tag: 'UN member state', name: 'Australia', status: 'Wikipedia list checked says Australia is one of the 14 UN member states located predominantly in Oceania.', summary: 'DFAT also lists Australia as a Pacific Islands Forum member. This site should still treat P4A as an idea/workbench, not an official party or government programme.', next: 'Next research layer: Commonwealth, states, territories, local government, First Nations governance, party registration and constitutional structure.', source: sourceNotes.dfat, shape: mapShapes.australia },
    { id: 'fiji', kind: 'state', tag: 'UN member state', name: 'Fiji', status: 'Sources checked list Fiji as a sovereign state and PIF member.', summary: 'A future card needs Fiji-specific constitutional and provincial/local governance sources before any civic comparison.', next: 'Next research layer: republican constitution, Parliament, provinces, municipal councils and chiefly/social governance history.', source: sourceNotes.dfat, shape: mapShapes.fiji },
    { id: 'kiribati', kind: 'state', tag: 'UN member state', name: 'Kiribati', status: 'Sources checked list Kiribati as a sovereign state and PIF member.', summary: 'The map shows Kiribati across multiple Pacific zones, which is exactly why a simple continent frame is not enough.', next: 'Next research layer: island councils, national Parliament, dispersed geography, climate migration and Line/Phoenix/Gilbert Islands distinctions.', source: sourceNotes.dfat, shape: mapShapes.kiribati },
    { id: 'marshall-islands', kind: 'state', tag: 'UN member state', name: 'Marshall Islands', status: 'Sources checked list the Marshall Islands as a sovereign state and PIF member.', summary: 'A later governance page should trace the compact relationship with the United States and the nuclear-testing history carefully.', next: 'Next research layer: compact relationship, Nitijela, local governments and atoll governance.', source: sourceNotes.dfat, shape: mapShapes.marshallIslands },
    { id: 'micronesia-fsm', kind: 'state', tag: 'UN member state', name: 'Federated States of Micronesia', status: 'Sources checked list the Federated States of Micronesia as a sovereign state and PIF member.', summary: 'The map labels Micronesia broadly; this card is specifically for FSM, not the whole Micronesia region.', next: 'Next research layer: federation, four states, compact relationship and municipal/chiefly structures.', source: sourceNotes.dfat, shape: mapShapes.micronesiaFsm },
    { id: 'nauru', kind: 'state', tag: 'UN member state', name: 'Nauru', status: 'Sources checked list Nauru as a sovereign state and PIF member.', summary: 'A later history card should handle phosphate extraction and compact state institutions with care.', next: 'Next research layer: Parliament, districts, land tenure and phosphate-era governance.', source: sourceNotes.dfat, shape: mapShapes.nauru },
    { id: 'new-zealand', kind: 'state', tag: 'UN member state', name: 'Aotearoa New Zealand', status: 'Sources checked list New Zealand as a sovereign state and PIF member.', summary: 'Future governance work needs Treaty of Waitangi, Parliament, local government and Realm relationships treated separately.', next: 'Next research layer: Crown, Parliament, local government, Treaty relationships, Cook Islands, Niue and Tokelau links.', source: sourceNotes.dfat, shape: mapShapes.newZealand },
    { id: 'palau', kind: 'state', tag: 'UN member state', name: 'Palau', status: 'Sources checked list Palau as a sovereign state and PIF member.', summary: 'A future card should separate national institutions, state governments and compact history.', next: 'Next research layer: compact relationship, Council of Chiefs, states and national Congress.', source: sourceNotes.dfat, shape: mapShapes.palau },
    { id: 'papua-new-guinea', kind: 'state', tag: 'UN member state', name: 'Papua New Guinea', status: 'Sources checked list Papua New Guinea as a sovereign state and PIF member.', summary: 'PNG needs a deep local page because national, provincial, district, local-level and customary systems all matter.', next: 'Next research layer: Parliament, provinces, autonomous Bougainville, districts, LLGs and customary authority.', source: sourceNotes.dfat, shape: mapShapes.papuaNewGuinea },
    { id: 'samoa', kind: 'state', tag: 'UN member state', name: 'Samoa', status: 'Sources checked list Samoa as a sovereign state and PIF member.', summary: 'The map labels Samoa beside American Samoa, so the card keeps them separate.', next: 'Next research layer: parliamentary system, faamatai, districts/villages and constitutional history.', source: sourceNotes.dfat, shape: mapShapes.samoa },
    { id: 'solomon-islands', kind: 'state', tag: 'UN member state', name: 'Solomon Islands', status: 'Sources checked list Solomon Islands as a sovereign state and PIF member.', summary: 'A future page should treat provinces, customary land and recent regional-security history carefully.', next: 'Next research layer: Parliament, provinces, customary land systems and RAMSI/security history.', source: sourceNotes.dfat, shape: mapShapes.solomonIslands },
    { id: 'tonga', kind: 'state', tag: 'UN member state', name: 'Tonga', status: 'Sources checked list Tonga as a sovereign state and PIF member.', summary: 'Tonga needs a history layer for monarchy, Parliament and local districts rather than a generic island-state template.', next: 'Next research layer: monarchy, Legislative Assembly, nobles, districts and village systems.', source: sourceNotes.dfat, shape: mapShapes.tonga },
    { id: 'tuvalu', kind: 'state', tag: 'UN member state', name: 'Tuvalu', status: 'Sources checked list Tuvalu as a sovereign state and PIF member.', summary: 'Future governance work should keep climate, atoll geography and island councils close to the institutional story.', next: 'Next research layer: Parliament, island councils, climate diplomacy and constitutional identity.', source: sourceNotes.dfat, shape: mapShapes.tuvalu },
    { id: 'vanuatu', kind: 'state', tag: 'UN member state', name: 'Vanuatu', status: 'Sources checked list Vanuatu as a sovereign state and PIF member.', summary: 'Vanuatu should get its own page for Parliament, provinces, customary authority and decentralised island governance.', next: 'Next research layer: Parliament, provinces, area councils, Malvatumauri and customary land.', source: sourceNotes.dfat, shape: mapShapes.vanuatu },

    { id: 'cook-islands', kind: 'associated', tag: 'Free association', name: 'Cook Islands', status: 'Sources checked describe Cook Islands as self-governing in free association with New Zealand.', summary: 'The checked list says Cook Islands acts in many ways independently, including treaty-making and diplomatic relations under its own name.', next: 'Next research layer: Parliament, islands, Aronga Mana, Realm relationship and local island government.', source: sourceNotes.list, shape: mapShapes.cookIslands },
    { id: 'niue', kind: 'associated', tag: 'Free association', name: 'Niue', status: 'Sources checked describe Niue as self-governing in free association with New Zealand.', summary: 'The card keeps Niue separate from New Zealand even though the constitutional relationship is close.', next: 'Next research layer: Assembly, village councils, Realm relationship and land tenure.', source: sourceNotes.list, shape: mapShapes.niue },

    { id: 'ashmore-cartier', kind: 'territory', tag: 'Australia-administered', name: 'Ashmore and Cartier Islands', status: 'Wikipedia template checked lists Ashmore and Cartier Islands under Australia in the territory shelf.', summary: 'The base map checked here does not label this separately, so this entry stays card-only until a detailed territory layer is added.', next: 'Next research layer: Australian external territory administration, maritime zones and nearby regional context.', source: sourceNotes.list },
    { id: 'christmas-island', kind: 'territory', tag: 'Australia-administered', name: 'Christmas Island', status: 'Wikipedia template checked lists Christmas Island under Australia in the territory shelf.', summary: 'The base map checked here does not label this separately, so this entry stays card-only until a detailed territory layer is added.', next: 'Next research layer: Australian external territory administration, shire governance and community history.', source: sourceNotes.list },
    { id: 'cocos-keeling', kind: 'territory', tag: 'Australia-administered', name: 'Cocos (Keeling) Islands', status: 'Wikipedia template checked lists Cocos (Keeling) Islands under Australia in the territory shelf.', summary: 'The base map checked here does not label this separately, so this entry stays card-only until a detailed territory layer is added.', next: 'Next research layer: Australian external territory administration, shire governance and Cocos Malay history.', source: sourceNotes.list },
    { id: 'coral-sea-islands', kind: 'territory', tag: 'Australia-administered', name: 'Coral Sea Islands', status: 'Wikipedia template checked lists Coral Sea Islands under Australia in the territory shelf.', summary: 'The base map checked here does not label this separately, so this entry stays card-only until a detailed reef/island layer is added.', next: 'Next research layer: external territory administration, environmental management and reef/island status.', source: sourceNotes.list },
    { id: 'norfolk-island', kind: 'territory', tag: 'Australia-administered', name: 'Norfolk Island', status: 'Wikipedia template checked lists Norfolk Island under Australia in the territory shelf.', summary: 'The base map checked here does not clearly label this separately, so this entry stays card-only until a detailed territory layer is added.', next: 'Next research layer: Australian external territory administration, regional council, self-government history and Pitcairn-descendant community history.', source: sourceNotes.list },

    { id: 'clipperton-island', kind: 'territory', tag: 'France-administered', name: 'Clipperton Island', status: 'Wikipedia template checked lists Clipperton Island under France in the territory shelf.', summary: 'The base map checked here does not show this as a separate labelled area, so this entry stays card-only until a detailed territory layer is added.', next: 'Next research layer: French administration, Pacific/Latin America boundary debates and uninhabited-island governance.', source: sourceNotes.followup },
    { id: 'french-polynesia', kind: 'territory', tag: 'France-administered', name: 'French Polynesia', status: 'Sources checked list French Polynesia under France and DFAT lists it as a PIF member.', summary: 'A later page should avoid flattening French Polynesia into France; its own institutions and archipelagos matter.', next: 'Next research layer: Assembly, President, communes, archipelagos, French state relationship and nuclear-testing history.', source: sourceNotes.dfat, shape: mapShapes.frenchPolynesia },
    { id: 'new-caledonia', kind: 'territory', tag: 'France-administered', name: 'New Caledonia', status: 'Sources checked list New Caledonia under France and DFAT lists it as a PIF member.', summary: 'New Caledonia needs a dedicated current-status research pass before any governance claims beyond source-listing.', next: 'Next research layer: Congress, provinces, customary Senate, Noumea Accord history and referendum sequence.', source: sourceNotes.dfat, shape: mapShapes.newCaledonia },
    { id: 'wallis-futuna', kind: 'territory', tag: 'France-administered', name: 'Wallis and Futuna', status: 'Sources checked list Wallis and Futuna under France; DFAT lists it as a PIF associate member.', summary: 'A later page should treat French administration and customary kingdoms distinctly.', next: 'Next research layer: territorial assembly, customary kingdoms, French state relationship and village/district structures.', source: sourceNotes.dfat, shape: mapShapes.wallisFutuna },

    { id: 'tokelau', kind: 'territory', tag: 'New Zealand-administered', name: 'Tokelau', status: 'Sources checked list Tokelau under New Zealand; DFAT lists it as a PIF associate member.', summary: 'Tokelau needs its own page for village governance and the New Zealand relationship.', next: 'Next research layer: General Fono, village councils, administrator relationship and self-determination referendums.', source: sourceNotes.dfat, shape: mapShapes.tokelau },
    { id: 'pitcairn-islands', kind: 'territory', tag: 'UK-administered', name: 'Pitcairn Islands', status: 'Wikipedia template checked lists Pitcairn Islands under the United Kingdom.', summary: 'The base map checked here does not clearly label this separately, so this entry stays card-only until a detailed territory layer is added.', next: 'Next research layer: British overseas territory administration, island council and Pitcairn-descendant history.', source: sourceNotes.list },

    { id: 'hawaii', kind: 'followup', tag: 'United States in part', name: "Hawai'i", status: "Wikipedia template checked lists Hawai'i under the United States in the \"in part\" shelf.", summary: "This is a follow-up card because definitions of Oceania vary and Hawai'i needs its own Indigenous/statehood history layer.", next: 'Next research layer: US state government, counties, Native Hawaiian governance, annexation/statehood history and Pacific regional links.', source: sourceNotes.followup, shape: mapShapes.hawaii },
    { id: 'palmyra-atoll', kind: 'followup', tag: 'United States in part', name: 'Palmyra Atoll', status: 'Wikipedia template checked lists Palmyra Atoll under the United States in the "in part" shelf.', summary: 'The base map checked here does not separate Palmyra clearly from other US outlying islands, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: incorporated US territory status, refuge administration and Pacific classification.', source: sourceNotes.followup },
    { id: 'american-samoa', kind: 'territory', tag: 'US-administered', name: 'American Samoa', status: 'Sources checked list American Samoa under the United States; DFAT lists it as a PIF associate member.', summary: 'The map labels American Samoa beside Samoa, so the card keeps them distinct.', next: 'Next research layer: unincorporated territory status, Fono, counties/villages, matai system and citizenship/nationality questions.', source: sourceNotes.dfat, shape: mapShapes.americanSamoa },
    { id: 'baker-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Baker Island', status: 'Wikipedia template checked lists Baker Island in the US territory shelf.', summary: 'The base map checked here does not individually label this island, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list },
    { id: 'guam', kind: 'territory', tag: 'US-administered', name: 'Guam', status: 'Sources checked list Guam under the United States; DFAT lists it as a PIF associate member.', summary: 'Guam needs a separate governance page for its US territorial status and CHamoru political history.', next: 'Next research layer: organic act, legislature, governor, villages, military presence and self-determination debates.', source: sourceNotes.dfat, shape: mapShapes.guam },
    { id: 'howland-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Howland Island', status: 'Wikipedia template checked lists Howland Island in the US territory shelf.', summary: 'The base map checked here does not individually label this island, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list },
    { id: 'jarvis-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Jarvis Island', status: 'Wikipedia template checked lists Jarvis Island in the US territory shelf.', summary: 'The base map checked here does not individually label this island, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list },
    { id: 'johnston-atoll', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Johnston Atoll', status: 'Wikipedia template checked lists Johnston Atoll in the US territory shelf.', summary: 'The base map checked here does not individually label this island, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: US Minor Outlying Islands administration, military/environmental history and refuge status.', source: sourceNotes.list },
    { id: 'kingman-reef', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Kingman Reef', status: 'Wikipedia template checked lists Kingman Reef in the US territory shelf.', summary: 'The base map checked here does not individually label this reef, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list },
    { id: 'midway-atoll', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Midway Atoll', status: 'Wikipedia template checked lists Midway Atoll in the US territory shelf.', summary: 'The base map checked here does not individually label this atoll, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and military/ecological history.', source: sourceNotes.list },
    { id: 'northern-mariana-islands', kind: 'territory', tag: 'US-administered', name: 'Northern Mariana Islands', status: 'Sources checked list Northern Mariana Islands under the United States.', summary: 'A later page should distinguish commonwealth status, local government and Indigenous Chamorro/Carolinian history.', next: 'Next research layer: commonwealth covenant, legislature, municipalities and federal relationship.', source: sourceNotes.list, shape: mapShapes.northernMarianaIslands },
    { id: 'wake-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Wake Island', status: 'Wikipedia template checked lists Wake Island in the US territory shelf.', summary: 'The base map checked here does not individually label this island, so this entry stays card-only until a detailed minor-islands layer is added.', next: 'Next research layer: US administration, military use, environmental status and uninhabited-island governance.', source: sourceNotes.list },

    { id: 'easter-island', kind: 'followup', tag: 'Chile in part', name: 'Rapa Nui / Easter Island', status: 'Wikipedia template checked lists Easter Island under Chile in the "in part" shelf.', summary: 'This is a follow-up card because definitions of Oceania vary and local Rapa Nui authority/history must lead any serious copy. The base map checked here does not label it separately.', next: 'Next research layer: Chilean special territory/province/commune settings, Rapa Nui governance and annexation history.', source: sourceNotes.followup },
    { id: 'juan-fernandez-islands', kind: 'followup', tag: 'Chile in part', name: 'Juan Fernandez Islands', status: 'Wikipedia template checked lists Juan Fernandez Islands under Chile in the "in part" shelf.', summary: 'This needs boundary-definition follow-up before being treated as part of an Oceania civic atlas. The base map checked here does not label it separately.', next: 'Next research layer: Chilean regional/communal governance, island history and biogeographic classification.', source: sourceNotes.followup },
    { id: 'galapagos-islands', kind: 'followup', tag: 'Ecuador in part', name: 'Galapagos Islands', status: 'Wikipedia template checked lists Galapagos Islands under Ecuador in the "in part" shelf.', summary: 'This is a boundary-sensitive card; do not treat it as settled Oceania without defining the frame. The base map checked here does not label it separately.', next: 'Next research layer: Ecuadorian province/special regime, conservation governance and Pacific classification debates.', source: sourceNotes.followup },
    { id: 'central-papua', kind: 'followup', tag: 'Indonesia in part', name: 'Central Papua', status: 'Wikipedia template checked lists Central Papua under Indonesia in the "in part" shelf.', summary: 'The base map shows western New Guinea broadly but does not label this province separately, so this entry stays card-only until a detailed province layer is added.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup },
    { id: 'highland-papua', kind: 'followup', tag: 'Indonesia in part', name: 'Highland Papua', status: 'Wikipedia template checked lists Highland Papua under Indonesia in the "in part" shelf.', summary: 'The base map shows western New Guinea broadly but does not label this province separately, so this entry stays card-only until a detailed province layer is added.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup },
    { id: 'papua-province', kind: 'followup', tag: 'Indonesia in part', name: 'Papua', status: 'Wikipedia template checked lists Papua under Indonesia in the "in part" shelf.', summary: 'This card needs a careful current-source pass because Indonesian provincial boundaries have changed recently. The base map checked here does not label this province separately.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup },
    { id: 'south-papua', kind: 'followup', tag: 'Indonesia in part', name: 'South Papua', status: 'Wikipedia template checked lists South Papua under Indonesia in the "in part" shelf.', summary: 'The base map shows western New Guinea broadly but does not label this province separately, so this entry stays card-only until a detailed province layer is added.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup },
    { id: 'southwest-papua', kind: 'followup', tag: 'Indonesia in part', name: 'Southwest Papua', status: 'Wikipedia template checked lists Southwest Papua under Indonesia in the "in part" shelf.', summary: 'This card needs official provincial and Papuan sources before stronger language. The base map checked here does not label this province separately.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup },
    { id: 'west-papua', kind: 'followup', tag: 'Indonesia in part', name: 'West Papua', status: 'Wikipedia template checked lists West Papua under Indonesia in the "in part" shelf.', summary: 'This card needs a careful current-source pass and should not erase contested governance history. The base map checked here does not label this province separately.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup }
  ];

  const layerColours = {
    region: '255, 224, 122',
    sovereign: '33, 214, 255',
    'australia-admin': '255, 133, 74',
    'france-admin': '42, 215, 126',
    'new-zealand-admin': '202, 117, 255',
    'us-admin': '255, 231, 92',
    'other-territory': '154, 190, 255',
    followup: '116, 154, 255'
  };

  const getPoliticalLayers = (area) => {
    const layers = [];
    if (area.kind === 'region') layers.push('region');
    if (area.kind === 'state' || area.kind === 'associated') layers.push('sovereign');
    if (area.kind === 'followup') layers.push('followup');
    if (area.id === 'australia' || area.tag.includes('Australia-administered')) layers.push('australia-admin');
    if (area.id === 'new-zealand' || area.kind === 'associated' || area.tag.includes('New Zealand-administered')) layers.push('new-zealand-admin');
    if (area.tag.includes('France-administered')) layers.push('france-admin');
    if (area.tag.includes('US-administered') || area.tag.includes('US Minor Outlying Island') || area.id === 'hawaii' || area.id === 'palmyra-atoll') layers.push('us-admin');
    if (area.kind === 'territory' && layers.length === 0) layers.push('other-territory');
    return [...new Set(layers.length ? layers : ['other-territory'])];
  };

  const getZoneColourLayer = (area) => {
    if (area.id === 'australia' || area.tag.includes('Australia-administered')) return 'australia-admin';
    if (area.id === 'new-zealand' || area.kind === 'associated' || area.tag.includes('New Zealand-administered')) return 'new-zealand-admin';
    if (area.tag.includes('France-administered')) return 'france-admin';
    if (area.tag.includes('US-administered') || area.tag.includes('US Minor Outlying Island') || area.id === 'hawaii' || area.id === 'palmyra-atoll') return 'us-admin';
    if (area.kind === 'region') return 'region';
    if (area.kind === 'followup') return 'followup';
    return 'sovereign';
  };

  const setDetail = (area) => {
    detailPanel.querySelector('[data-oceania-detail-kind]').textContent = area.tag;
    detailPanel.querySelector('[data-oceania-detail-name]').textContent = area.name;
    detailPanel.querySelector('[data-oceania-detail-summary]').textContent = area.summary;
    detailPanel.querySelector('[data-oceania-detail-status]').textContent = `${area.status} ${area.next}`;
    detailPanel.querySelector('[data-oceania-detail-source]').textContent = area.source;
  };

  const makeCard = (area) => {
    const card = document.createElement('button');
    card.className = 'oceania-card';
    card.type = 'button';
    card.id = area.id;
    card.setAttribute('data-oceania-card', area.id);
    card.setAttribute('data-oceania-kind', area.kind);
    card.setAttribute('data-oceania-layer', getPoliticalLayers(area).join(' '));
    card.setAttribute('aria-pressed', 'false');

    const tag = document.createElement('span');
    tag.textContent = area.tag;
    const title = document.createElement('h3');
    title.textContent = area.name;
    const status = document.createElement('p');
    status.textContent = area.status;
    const next = document.createElement('small');
    next.textContent = area.next;

    card.append(tag, title, status, next);
    card.addEventListener('pointerenter', () => setActive(area.id));
    card.addEventListener('focus', () => setActive(area.id));
    card.addEventListener('click', () => {
      setActive(area.id, { updateHash: true });
      detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return card;
  };

  const makeHitZone = (area) => {
    if (!hitMap || !area.shape) return null;

    const link = document.createElementNS(svgNS, 'a');
    link.setAttribute('href', `#${area.id}`);
    link.setAttribute('class', 'oceania-hit-link');
    link.setAttribute('data-oceania-map-area', area.id);
    link.setAttribute('data-oceania-layer', getPoliticalLayers(area).join(' '));
    link.setAttribute('aria-label', area.name);
    link.style.setProperty('--zone-rgb', layerColours[getZoneColourLayer(area)] || layerColours.sovereign);

    const title = document.createElementNS(svgNS, 'title');
    title.textContent = area.name;
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('class', 'oceania-hit-zone');
    path.setAttribute('d', area.shape);

    link.append(title, path);
    link.addEventListener('pointerenter', () => setActive(area.id));
    link.addEventListener('focus', () => setActive(area.id));
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setActive(area.id, { updateHash: true });
      if (window.matchMedia('(max-width: 760px)').matches) {
        detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    return link;
  };

  areaData.forEach((area) => {
    cardGrid.appendChild(makeCard(area));
    const hitZone = makeHitZone(area);
    if (hitZone) hitMap.appendChild(hitZone);
  });

  const cards = Array.from(document.querySelectorAll('[data-oceania-card]'));
  const hitLinks = Array.from(document.querySelectorAll('[data-oceania-map-area]'));
  const areaById = new Map(areaData.map((area) => [area.id, area]));

  const matchesFilter = (area, filterKind) => (
    filterKind === 'all' || getPoliticalLayers(area).includes(filterKind)
  );

  const matchesMapLayer = (area, filterKind) => (
    filterKind !== 'all' && Boolean(area.shape) && matchesFilter(area, filterKind)
  );

  const setFilter = (kind) => {
    filterButtons.forEach((button) => {
      const active = button.getAttribute('data-oceania-choice') === kind;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    cards.forEach((card) => {
      const area = areaById.get(card.getAttribute('data-oceania-card'));
      const visible = Boolean(area && matchesFilter(area, kind));
      card.hidden = !visible;
    });

    hitLinks.forEach((link) => {
      const area = areaById.get(link.getAttribute('data-oceania-map-area'));
      const visible = Boolean(area && matchesMapLayer(area, kind));
      link.classList.toggle('is-hidden', !visible);
      link.setAttribute('aria-hidden', String(!visible));
    });
  };

  const setActive = (slug, options = {}) => {
    const area = areaById.get(slug);
    const target = cards.find((card) => card.getAttribute('data-oceania-card') === slug);
    if (!area || !target) return;

    const activeFilter = filterButtons.find((button) => button.getAttribute('aria-pressed') === 'true')?.getAttribute('data-oceania-choice') || 'all';
    const hiddenByFilter = !matchesFilter(area, activeFilter);
    if (hiddenByFilter) setFilter('all');

    setDetail(area);

    cards.forEach((card) => {
      const active = card === target;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
    });
    hitLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('data-oceania-map-area') === slug);
    });

    if (options.updateHash) {
      history.replaceState(null, '', `#${slug}`);
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const kind = button.getAttribute('data-oceania-choice') || 'all';
      setFilter(kind);
      const firstVisible = cards.find((card) => !card.hidden);
      if (firstVisible) setActive(firstVisible.getAttribute('data-oceania-card'));
    });
  });

  const requested = location.hash.replace('#', '').trim();
  const requestedArea = areaById.get(requested);
  const initialFilter = requestedArea
    ? getPoliticalLayers(requestedArea)[0]
    : 'sovereign';
  const initial = requestedArea?.id || 'australia';
  setFilter(initialFilter);
  setActive(initial);
})();
