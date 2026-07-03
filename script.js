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

  const ellipse = (cx, cy, rx, ry) => (
    `M ${cx - rx} ${cy} C ${cx - rx} ${cy - ry} ${cx + rx} ${cy - ry} ${cx + rx} ${cy} C ${cx + rx} ${cy + ry} ${cx - rx} ${cy + ry} ${cx - rx} ${cy} Z`
  );

  const areaData = [
    { id: 'australasia', kind: 'region', tag: 'Regional frame', name: 'Australasia', status: 'Sources checked describe this as Australia, New Zealand and neighbouring Pacific islands.', summary: 'Use as a broad source frame only. Local authority, First Nations and tangata whenua sources still need their own layers.', next: 'Next research layer: history, local constitutional difference, federal/state/territory/council levels, Indigenous governance and treaty settings.', source: sourceNotes.regions, shape: ellipse(120, 350, 78, 70) },
    { id: 'melanesia', kind: 'region', tag: 'Regional frame', name: 'Melanesia', status: 'Sources checked place New Guinea, Solomon Islands, Vanuatu, Fiji and New Caledonia inside this broad frame.', summary: 'This is a navigation shelf, not a single civic unit. It points toward language, land, colonial history and sovereignty questions that differ sharply by place.', next: 'Next research layer: Bougainville, West Papua, New Caledonia and island-state governance histories.', source: sourceNotes.regions, shape: ellipse(280, 250, 78, 60) },
    { id: 'micronesia', kind: 'region', tag: 'Regional frame', name: 'Micronesia', status: 'Sources checked use this frame for the Mariana, Caroline and Marshall island arcs, with Kiribati links depending on frame.', summary: 'This card is a source frame for a north-western Pacific network, including several US, freely associated and sovereign-state relationships.', next: 'Next research layer: compacts of free association, US territorial government, customary authority and regional organisations.', source: sourceNotes.regions, shape: ellipse(150, 120, 90, 36) },
    { id: 'polynesia', kind: 'region', tag: 'Regional frame', name: 'Polynesia', status: "Sources checked describe a wide triangle from Hawai'i to Aotearoa New Zealand to Rapa Nui/Easter Island.", summary: 'The frame includes very different political statuses, languages and cultural authorities. Treat it as an atlas shelf, not a consent layer.', next: 'Next research layer: kingdom, state, territory, free association and Indigenous governance histories across the triangle.', source: sourceNotes.regions, shape: `${ellipse(520, 38, 45, 20)} ${ellipse(535, 295, 95, 80)}` },

    { id: 'australia', kind: 'state', tag: 'UN member state', name: 'Australia', status: 'Wikipedia list checked says Australia is one of the 14 UN member states located predominantly in Oceania.', summary: 'DFAT also lists Australia as a Pacific Islands Forum member. This site should still treat P4A as an idea/workbench, not an official party or government programme.', next: 'Next research layer: Commonwealth, states, territories, local government, First Nations governance, party registration and constitutional structure.', source: sourceNotes.dfat, shape: ellipse(118, 346, 86, 82) },
    { id: 'fiji', kind: 'state', tag: 'UN member state', name: 'Fiji', status: 'Sources checked list Fiji as a sovereign state and PIF member.', summary: 'A future card needs Fiji-specific constitutional and provincial/local governance sources before any civic comparison.', next: 'Next research layer: republican constitution, Parliament, provinces, municipal councils and chiefly/social governance history.', source: sourceNotes.dfat, shape: ellipse(336, 294, 22, 30) },
    { id: 'kiribati', kind: 'state', tag: 'UN member state', name: 'Kiribati', status: 'Sources checked list Kiribati as a sovereign state and PIF member.', summary: 'The map shows Kiribati across multiple Pacific zones, which is exactly why a simple continent frame is not enough.', next: 'Next research layer: island councils, national Parliament, dispersed geography, climate migration and Line/Phoenix/Gilbert Islands distinctions.', source: sourceNotes.dfat, shape: `${ellipse(292, 156, 20, 20)} ${ellipse(386, 222, 22, 22)} ${ellipse(538, 188, 22, 22)} ${ellipse(596, 268, 24, 22)}` },
    { id: 'marshall-islands', kind: 'state', tag: 'UN member state', name: 'Marshall Islands', status: 'Sources checked list the Marshall Islands as a sovereign state and PIF member.', summary: 'A later governance page should trace the compact relationship with the United States and the nuclear-testing history carefully.', next: 'Next research layer: compact relationship, Nitijela, local governments and atoll governance.', source: sourceNotes.dfat, shape: ellipse(235, 105, 43, 31) },
    { id: 'micronesia-fsm', kind: 'state', tag: 'UN member state', name: 'Federated States of Micronesia', status: 'Sources checked list the Federated States of Micronesia as a sovereign state and PIF member.', summary: 'The map labels Micronesia broadly; this card is specifically for FSM, not the whole Micronesia region.', next: 'Next research layer: federation, four states, compact relationship and municipal/chiefly structures.', source: sourceNotes.dfat, shape: ellipse(146, 128, 74, 24) },
    { id: 'nauru', kind: 'state', tag: 'UN member state', name: 'Nauru', status: 'Sources checked list Nauru as a sovereign state and PIF member.', summary: 'A later history card should handle phosphate extraction and compact state institutions with care.', next: 'Next research layer: Parliament, districts, land tenure and phosphate-era governance.', source: sourceNotes.dfat, shape: ellipse(236, 162, 14, 18) },
    { id: 'new-zealand', kind: 'state', tag: 'UN member state', name: 'Aotearoa New Zealand', status: 'Sources checked list New Zealand as a sovereign state and PIF member.', summary: 'Future governance work needs Treaty of Waitangi, Parliament, local government and Realm relationships treated separately.', next: 'Next research layer: Crown, Parliament, local government, Treaty relationships, Cook Islands, Niue and Tokelau links.', source: sourceNotes.dfat, shape: ellipse(395, 410, 55, 38) },
    { id: 'palau', kind: 'state', tag: 'UN member state', name: 'Palau', status: 'Sources checked list Palau as a sovereign state and PIF member.', summary: 'A future card should separate national institutions, state governments and compact history.', next: 'Next research layer: compact relationship, Council of Chiefs, states and national Congress.', source: sourceNotes.dfat, shape: ellipse(25, 166, 20, 28) },
    { id: 'papua-new-guinea', kind: 'state', tag: 'UN member state', name: 'Papua New Guinea', status: 'Sources checked list Papua New Guinea as a sovereign state and PIF member.', summary: 'PNG needs a deep local page because national, provincial, district, local-level and customary systems all matter.', next: 'Next research layer: Parliament, provinces, autonomous Bougainville, districts, LLGs and customary authority.', source: sourceNotes.dfat, shape: ellipse(160, 170, 72, 40) },
    { id: 'samoa', kind: 'state', tag: 'UN member state', name: 'Samoa', status: 'Sources checked list Samoa as a sovereign state and PIF member.', summary: 'The map labels Samoa beside American Samoa, so the card keeps them separate.', next: 'Next research layer: parliamentary system, faamatai, districts/villages and constitutional history.', source: sourceNotes.dfat, shape: ellipse(498, 220, 18, 12) },
    { id: 'solomon-islands', kind: 'state', tag: 'UN member state', name: 'Solomon Islands', status: 'Sources checked list Solomon Islands as a sovereign state and PIF member.', summary: 'A future page should treat provinces, customary land and recent regional-security history carefully.', next: 'Next research layer: Parliament, provinces, customary land systems and RAMSI/security history.', source: sourceNotes.dfat, shape: ellipse(260, 210, 55, 30) },
    { id: 'tonga', kind: 'state', tag: 'UN member state', name: 'Tonga', status: 'Sources checked list Tonga as a sovereign state and PIF member.', summary: 'Tonga needs a history layer for monarchy, Parliament and local districts rather than a generic island-state template.', next: 'Next research layer: monarchy, Legislative Assembly, nobles, districts and village systems.', source: sourceNotes.dfat, shape: ellipse(405, 338, 20, 28) },
    { id: 'tuvalu', kind: 'state', tag: 'UN member state', name: 'Tuvalu', status: 'Sources checked list Tuvalu as a sovereign state and PIF member.', summary: 'Future governance work should keep climate, atoll geography and island councils close to the institutional story.', next: 'Next research layer: Parliament, island councils, climate diplomacy and constitutional identity.', source: sourceNotes.dfat, shape: ellipse(326, 214, 24, 22) },
    { id: 'vanuatu', kind: 'state', tag: 'UN member state', name: 'Vanuatu', status: 'Sources checked list Vanuatu as a sovereign state and PIF member.', summary: 'Vanuatu should get its own page for Parliament, provinces, customary authority and decentralised island governance.', next: 'Next research layer: Parliament, provinces, area councils, Malvatumauri and customary land.', source: sourceNotes.dfat, shape: ellipse(273, 286, 20, 32) },

    { id: 'cook-islands', kind: 'associated', tag: 'Free association', name: 'Cook Islands', status: 'Sources checked describe Cook Islands as self-governing in free association with New Zealand.', summary: 'The checked list says Cook Islands acts in many ways independently, including treaty-making and diplomatic relations under its own name.', next: 'Next research layer: Parliament, islands, Aronga Mana, Realm relationship and local island government.', source: sourceNotes.list, shape: ellipse(512, 282, 35, 28) },
    { id: 'niue', kind: 'associated', tag: 'Free association', name: 'Niue', status: 'Sources checked describe Niue as self-governing in free association with New Zealand.', summary: 'The card keeps Niue separate from New Zealand even though the constitutional relationship is close.', next: 'Next research layer: Assembly, village councils, Realm relationship and land tenure.', source: sourceNotes.list, shape: ellipse(456, 326, 15, 20) },

    { id: 'ashmore-cartier', kind: 'territory', tag: 'Australia-administered', name: 'Ashmore and Cartier Islands', status: 'Wikipedia template checked lists Ashmore and Cartier Islands under Australia in the territory shelf.', summary: 'The base map does not label this separately; the hit zone is a rough north-west Australia pointer only.', next: 'Next research layer: Australian external territory administration, maritime zones and nearby regional context.', source: sourceNotes.list, shape: ellipse(92, 270, 26, 22) },
    { id: 'christmas-island', kind: 'territory', tag: 'Australia-administered', name: 'Christmas Island', status: 'Wikipedia template checked lists Christmas Island under Australia in the territory shelf.', summary: 'The base map does not label this separately; the hit zone is a rough off-map pointer so the card can still be found from the map.', next: 'Next research layer: Australian external territory administration, shire governance and community history.', source: sourceNotes.list, shape: ellipse(58, 292, 24, 20) },
    { id: 'cocos-keeling', kind: 'territory', tag: 'Australia-administered', name: 'Cocos (Keeling) Islands', status: 'Wikipedia template checked lists Cocos (Keeling) Islands under Australia in the territory shelf.', summary: 'The base map does not label this separately; the hit zone is a rough off-map pointer so the card can still be found from the map.', next: 'Next research layer: Australian external territory administration, shire governance and Cocos Malay history.', source: sourceNotes.list, shape: ellipse(40, 315, 24, 20) },
    { id: 'coral-sea-islands', kind: 'territory', tag: 'Australia-administered', name: 'Coral Sea Islands', status: 'Wikipedia template checked lists Coral Sea Islands under Australia in the territory shelf.', summary: 'The map shows Australian-associated offshore zones east of Australia; this hit zone is approximate.', next: 'Next research layer: external territory administration, environmental management and reef/island status.', source: sourceNotes.list, shape: ellipse(284, 246, 38, 26) },
    { id: 'norfolk-island', kind: 'territory', tag: 'Australia-administered', name: 'Norfolk Island', status: 'Wikipedia template checked lists Norfolk Island under Australia in the territory shelf.', summary: 'Norfolk Island needs a careful governance-history page because its self-government story changed over time.', next: 'Next research layer: Australian external territory administration, regional council, self-government history and Pitcairn-descendant community history.', source: sourceNotes.list, shape: ellipse(404, 386, 23, 20) },

    { id: 'clipperton-island', kind: 'territory', tag: 'France-administered', name: 'Clipperton Island', status: 'Wikipedia template checked lists Clipperton Island under France in the territory shelf.', summary: 'The base map does not show this as a separate labelled area; the hit zone is a rough eastern-edge pointer only.', next: 'Next research layer: French administration, Pacific/Latin America boundary debates and uninhabited-island governance.', source: sourceNotes.followup, shape: ellipse(646, 170, 22, 24) },
    { id: 'french-polynesia', kind: 'territory', tag: 'France-administered', name: 'French Polynesia', status: 'Sources checked list French Polynesia under France and DFAT lists it as a PIF member.', summary: 'A later page should avoid flattening French Polynesia into France; its own institutions and archipelagos matter.', next: 'Next research layer: Assembly, President, communes, archipelagos, French state relationship and nuclear-testing history.', source: sourceNotes.dfat, shape: ellipse(586, 306, 60, 64) },
    { id: 'new-caledonia', kind: 'territory', tag: 'France-administered', name: 'New Caledonia', status: 'Sources checked list New Caledonia under France and DFAT lists it as a PIF member.', summary: 'New Caledonia needs a dedicated current-status research pass before any governance claims beyond source-listing.', next: 'Next research layer: Congress, provinces, customary Senate, Noumea Accord history and referendum sequence.', source: sourceNotes.dfat, shape: ellipse(234, 330, 42, 34) },
    { id: 'wallis-futuna', kind: 'territory', tag: 'France-administered', name: 'Wallis and Futuna', status: 'Sources checked list Wallis and Futuna under France; DFAT lists it as a PIF associate member.', summary: 'A later page should treat French administration and customary kingdoms distinctly.', next: 'Next research layer: territorial assembly, customary kingdoms, French state relationship and village/district structures.', source: sourceNotes.dfat, shape: ellipse(394, 250, 22, 20) },

    { id: 'tokelau', kind: 'territory', tag: 'New Zealand-administered', name: 'Tokelau', status: 'Sources checked list Tokelau under New Zealand; DFAT lists it as a PIF associate member.', summary: 'Tokelau needs its own page for village governance and the New Zealand relationship.', next: 'Next research layer: General Fono, village councils, administrator relationship and self-determination referendums.', source: sourceNotes.dfat, shape: ellipse(414, 216, 26, 22) },
    { id: 'pitcairn-islands', kind: 'territory', tag: 'UK-administered', name: 'Pitcairn Islands', status: 'Wikipedia template checked lists Pitcairn Islands under the United Kingdom.', summary: 'The base map barely shows this area; keep it card-listed until a better detailed map layer is added.', next: 'Next research layer: British overseas territory administration, island council and Pitcairn-descendant history.', source: sourceNotes.list, shape: ellipse(636, 430, 20, 24) },

    { id: 'hawaii', kind: 'followup', tag: 'United States in part', name: "Hawai'i", status: "Wikipedia template checked lists Hawai'i under the United States in the \"in part\" shelf.", summary: "This is a follow-up card because definitions of Oceania vary and Hawai'i needs its own Indigenous/statehood history layer.", next: 'Next research layer: US state government, counties, Native Hawaiian governance, annexation/statehood history and Pacific regional links.', source: sourceNotes.followup, shape: ellipse(520, 38, 45, 22) },
    { id: 'palmyra-atoll', kind: 'followup', tag: 'United States in part', name: 'Palmyra Atoll', status: 'Wikipedia template checked lists Palmyra Atoll under the United States in the "in part" shelf.', summary: 'The base map does not separate Palmyra clearly from other US outlying islands, so this card stays source-listed.', next: 'Next research layer: incorporated US territory status, refuge administration and Pacific classification.', source: sourceNotes.followup, shape: ellipse(535, 195, 26, 28) },
    { id: 'american-samoa', kind: 'territory', tag: 'US-administered', name: 'American Samoa', status: 'Sources checked list American Samoa under the United States; DFAT lists it as a PIF associate member.', summary: 'The map labels American Samoa beside Samoa, so the card keeps them distinct.', next: 'Next research layer: unincorporated territory status, Fono, counties/villages, matai system and citizenship/nationality questions.', source: sourceNotes.dfat, shape: ellipse(474, 238, 22, 16) },
    { id: 'baker-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Baker Island', status: 'Wikipedia template checked lists Baker Island in the US territory shelf.', summary: 'The base map groups several USA circles; this card is source-listed even when the exact island is not individually labelled.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list, shape: ellipse(356, 166, 12, 12) },
    { id: 'guam', kind: 'territory', tag: 'US-administered', name: 'Guam', status: 'Sources checked list Guam under the United States; DFAT lists it as a PIF associate member.', summary: 'Guam needs a separate governance page for its US territorial status and CHamoru political history.', next: 'Next research layer: organic act, legislature, governor, villages, military presence and self-determination debates.', source: sourceNotes.dfat, shape: ellipse(106, 88, 24, 20) },
    { id: 'howland-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Howland Island', status: 'Wikipedia template checked lists Howland Island in the US territory shelf.', summary: 'This card is source-listed; exact map separation will need a better minor-islands layer.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list, shape: ellipse(382, 166, 12, 12) },
    { id: 'jarvis-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Jarvis Island', status: 'Wikipedia template checked lists Jarvis Island in the US territory shelf.', summary: 'This card is source-listed; exact map separation will need a better minor-islands layer.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list, shape: ellipse(448, 112, 12, 12) },
    { id: 'johnston-atoll', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Johnston Atoll', status: 'Wikipedia template checked lists Johnston Atoll in the US territory shelf.', summary: 'This card is source-listed; exact map separation will need a better minor-islands layer.', next: 'Next research layer: US Minor Outlying Islands administration, military/environmental history and refuge status.', source: sourceNotes.list, shape: ellipse(492, 78, 12, 12) },
    { id: 'kingman-reef', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Kingman Reef', status: 'Wikipedia template checked lists Kingman Reef in the US territory shelf.', summary: 'This card is source-listed; exact map separation will need a better minor-islands layer.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and uninhabited-island governance.', source: sourceNotes.list, shape: ellipse(472, 216, 12, 12) },
    { id: 'midway-atoll', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Midway Atoll', status: 'Wikipedia template checked lists Midway Atoll in the US territory shelf.', summary: 'This card is source-listed; exact map separation will need a better minor-islands layer.', next: 'Next research layer: US Minor Outlying Islands administration, refuge status and military/ecological history.', source: sourceNotes.list, shape: ellipse(448, 48, 12, 12) },
    { id: 'northern-mariana-islands', kind: 'territory', tag: 'US-administered', name: 'Northern Mariana Islands', status: 'Sources checked list Northern Mariana Islands under the United States.', summary: 'A later page should distinguish commonwealth status, local government and Indigenous Chamorro/Carolinian history.', next: 'Next research layer: commonwealth covenant, legislature, municipalities and federal relationship.', source: sourceNotes.list, shape: ellipse(118, 34, 28, 28) },
    { id: 'wake-island', kind: 'territory', tag: 'US Minor Outlying Island', name: 'Wake Island', status: 'Wikipedia template checked lists Wake Island in the US territory shelf.', summary: 'This card is source-listed; exact map separation will need a better minor-islands layer.', next: 'Next research layer: US administration, military use, environmental status and uninhabited-island governance.', source: sourceNotes.list, shape: ellipse(560, 74, 12, 12) },

    { id: 'easter-island', kind: 'followup', tag: 'Chile in part', name: 'Rapa Nui / Easter Island', status: 'Wikipedia template checked lists Easter Island under Chile in the "in part" shelf.', summary: 'This is a follow-up card because definitions of Oceania vary and local Rapa Nui authority/history must lead any serious copy. The hit zone is a rough far-eastern pointer only.', next: 'Next research layer: Chilean special territory/province/commune settings, Rapa Nui governance and annexation history.', source: sourceNotes.followup, shape: ellipse(642, 388, 24, 24) },
    { id: 'juan-fernandez-islands', kind: 'followup', tag: 'Chile in part', name: 'Juan Fernandez Islands', status: 'Wikipedia template checked lists Juan Fernandez Islands under Chile in the "in part" shelf.', summary: 'This needs boundary-definition follow-up before being treated as part of an Oceania civic atlas. The hit zone is a rough far-eastern pointer only.', next: 'Next research layer: Chilean regional/communal governance, island history and biogeographic classification.', source: sourceNotes.followup, shape: ellipse(632, 450, 24, 22) },
    { id: 'galapagos-islands', kind: 'followup', tag: 'Ecuador in part', name: 'Galapagos Islands', status: 'Wikipedia template checked lists Galapagos Islands under Ecuador in the "in part" shelf.', summary: 'This is a boundary-sensitive card; do not treat it as settled Oceania without defining the frame. The hit zone is a rough eastern-edge pointer only.', next: 'Next research layer: Ecuadorian province/special regime, conservation governance and Pacific classification debates.', source: sourceNotes.followup, shape: ellipse(638, 118, 24, 24) },
    { id: 'central-papua', kind: 'followup', tag: 'Indonesia in part', name: 'Central Papua', status: 'Wikipedia template checked lists Central Papua under Indonesia in the "in part" shelf.', summary: 'The base map shows western New Guinea broadly. Province-level status needs separate current Indonesian and Papuan sources.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup, shape: ellipse(112, 184, 18, 18) },
    { id: 'highland-papua', kind: 'followup', tag: 'Indonesia in part', name: 'Highland Papua', status: 'Wikipedia template checked lists Highland Papua under Indonesia in the "in part" shelf.', summary: 'The base map does not label this province separately; this hit zone is only a rough western New Guinea pointer.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup, shape: ellipse(150, 164, 18, 18) },
    { id: 'papua-province', kind: 'followup', tag: 'Indonesia in part', name: 'Papua', status: 'Wikipedia template checked lists Papua under Indonesia in the "in part" shelf.', summary: 'This card needs a careful current-source pass because Indonesian provincial boundaries have changed recently.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup, shape: ellipse(174, 206, 19, 19) },
    { id: 'south-papua', kind: 'followup', tag: 'Indonesia in part', name: 'South Papua', status: 'Wikipedia template checked lists South Papua under Indonesia in the "in part" shelf.', summary: 'The base map does not label this province separately; this hit zone is only a rough western New Guinea pointer.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup, shape: ellipse(144, 238, 18, 18) },
    { id: 'southwest-papua', kind: 'followup', tag: 'Indonesia in part', name: 'Southwest Papua', status: 'Wikipedia template checked lists Southwest Papua under Indonesia in the "in part" shelf.', summary: 'This card needs official provincial and Papuan sources before stronger language.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup, shape: ellipse(48, 158, 18, 18) },
    { id: 'west-papua', kind: 'followup', tag: 'Indonesia in part', name: 'West Papua', status: 'Wikipedia template checked lists West Papua under Indonesia in the "in part" shelf.', summary: 'This card needs a careful current-source pass and should not erase contested governance history.', next: 'Next research layer: Indonesian province, regencies, Papuan autonomy, customary governance and contested-history sources.', source: sourceNotes.followup, shape: ellipse(78, 196, 18, 18) }
  ];

  const kindLabels = {
    all: 'All',
    region: 'Regional frame',
    state: 'State / associated',
    associated: 'Associated state',
    territory: 'Territory',
    followup: 'Follow-up'
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
    link.setAttribute('aria-label', area.name);

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

  const matchesFilter = (areaKind, filterKind) => (
    filterKind === 'all' || areaKind === filterKind || (filterKind === 'state' && areaKind === 'associated')
  );

  const matchesMapLayer = (areaKind, filterKind) => (
    filterKind !== 'all' && matchesFilter(areaKind, filterKind)
  );

  const setFilter = (kind) => {
    filterButtons.forEach((button) => {
      const active = button.getAttribute('data-oceania-choice') === kind;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    cards.forEach((card) => {
      const cardKind = card.getAttribute('data-oceania-kind');
      const visible = matchesFilter(cardKind, kind);
      card.hidden = !visible;
    });

    hitLinks.forEach((link) => {
      const area = areaData.find((item) => item.id === link.getAttribute('data-oceania-map-area'));
      const visible = Boolean(area && matchesMapLayer(area.kind, kind));
      link.classList.toggle('is-hidden', !visible);
      link.setAttribute('aria-hidden', String(!visible));
    });
  };

  const setActive = (slug, options = {}) => {
    const area = areaData.find((item) => item.id === slug);
    const target = cards.find((card) => card.getAttribute('data-oceania-card') === slug);
    if (!area || !target) return;

    const targetKind = target.getAttribute('data-oceania-kind');
    const activeFilter = filterButtons.find((button) => button.getAttribute('aria-pressed') === 'true')?.getAttribute('data-oceania-choice') || 'all';
    const hiddenByFilter = !matchesFilter(targetKind, activeFilter);
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
  const requestedArea = areaData.find((item) => item.id === requested);
  const initialFilter = requestedArea
    ? (requestedArea.kind === 'associated' ? 'state' : requestedArea.kind)
    : 'state';
  const initial = requestedArea?.id || 'australia';
  setFilter(initialFilter);
  setActive(initial);
})();
