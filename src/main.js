import './styles.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CATEGORIES, CUSTOMER_PROFILES, PROVIDERS } from './data.js';
import { createMarketplaceEngine } from './engine.js';
import { installWebMcp, TOOL_DEFINITIONS } from './webmcp.js';

const root = document.querySelector('#app');
const t = (state, en, es) => state.locale === 'es' ? es : en;
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const dateLabel = (value, locale = 'en') => new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

let nativeTools = 0;
let lastError = '';
let mapInstance = null;
let mapFrame = null;
let customerLoggedIn = false;
let loginOpen = false;
let customerPage = 'marketplace';
const engine = createMarketplaceEngine({ onChange: render });

function icon(name) {
  const paths = {
    pin: '<path d="M12 21s6-5.4 6-12a6 6 0 1 0-12 0c0 6.6 6 12 6 12Z"/><circle cx="12" cy="9" r="2"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

function providerCard(provider, state) {
  const full = PROVIDERS.find((item) => item.id === provider.id) || provider;
  return `<article class="provider-card" data-provider="${provider.id}">
    <div class="provider-photo"><img src="${full.image}" alt="Fictional provider ${escapeHtml(full.name)}"><span class="next-pill">${t(state, 'Next', 'Próximo')} ${full.slots[0].time}</span>${provider.matchScore != null ? `<strong class="match-score">${provider.matchScore}% ${t(state, 'fit', 'compatible')}</strong>` : ''}${full.isNew ? `<span class="new-provider">${t(state, 'NEW PROVIDER', 'NUEVO')}</span>` : ''}</div>
    <div class="provider-copy">
      <div class="rating">${icon('star')} ${full.rating} <span>(${full.reviews})</span></div>
      <h3>${escapeHtml(full.business)}</h3>
      <p>${escapeHtml(full.name)} · ${full.neighborhood}</p>
      <div class="specialty-row">${full.specialties.slice(0, 2).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      ${provider.reasons?.length ? `<p class="match-reason">${icon('check')} ${escapeHtml(provider.reasons[0])}</p>` : ''}
      ${full.promotion ? `<div class="promotion"><b>${escapeHtml(full.promotion.label)}</b><span>${escapeHtml(full.promotion.detail)}</span></div>` : ''}
      <div class="provider-meta"><span>${full.languages.join(' + ')}</span><span>${provider.distance ?? full.distance} mi</span></div>
      <div class="card-bottom"><strong>${t(state, 'From', 'Desde')} ${money(Math.min(...full.services.map((item) => item.price)))}</strong><button data-open="${provider.id}">${t(state, 'View times', 'Ver horarios')} ${icon('arrow')}</button></div>
    </div>
  </article>`;
}

function customerView(state) {
  const results = state.results.length ? state.results : PROVIDERS;
  const provider = PROVIDERS.find((item) => item.id === state.selectedProviderId);
  const service = provider?.services.find((item) => item.id === state.selectedServiceId);
  return `<main>
    <section class="hero modern-hero">
      <div class="hero-orb orb-one"></div><div class="hero-orb orb-two"></div>
      <p class="market-locale"><span class="us-flag" aria-hidden="true">🇺🇸</span><span>${t(state, 'Tampa, Florida · English marketplace', 'Tampa, Florida · Mercado en español')}</span><i></i></p>
      <h1>${t(state, 'Search for a service.<br><em>Book it with a sentence.</em>', 'Busca un servicio.<br><em>Resérvalo con una frase.</em>')}</h1>
      <p class="hero-lede">${t(state, 'Find the right local professional yourself, or ask your AI to compare, rebook, and manage the details.', 'Encuentra al profesional ideal o pide a tu IA que compare, vuelva a reservar y gestione los detalles.')}</p>
      <div class="search-shell">
        <label class="service-search"><span>${t(state, 'Search for your service', 'Busca tu servicio')}</span><select id="category-select"><option value="">${t(state, 'Haircut, massage, nails, skincare...', 'Corte, masaje, uñas, cuidado de piel...')}</option>${CATEGORIES.map((category) => `<option value="${category.id}" ${category.id === state.preferences.category ? 'selected' : ''}>${state.locale === 'es' ? category.labelEs : category.label}</option>`).join('')}</select></label>
        <label><span>${t(state, 'Provider language', 'Idioma del profesional')}</span><select id="language-select"><option value="">${t(state, 'Any language', 'Cualquier idioma')}</option><option>English</option><option ${state.preferences.spokenLanguage === 'Spanish' ? 'selected' : ''}>Spanish</option><option>Mandarin</option></select></label>
        <label><span>${t(state, 'Date', 'Fecha')}</span><input id="date-input" type="date" value="${state.preferences.date}"></label>
        <button id="search-button" class="search-button">${t(state, 'Search', 'Buscar')} ${icon('arrow')}</button>
      </div>
      <div class="agent-prompts"><button id="agent-demo" class="agent-prompt"><span class="agent-dot"></span><b>${t(state, 'Ask AI to find my best fit', 'Pedir a la IA mi mejor opción')}</b><small>${t(state, 'Compare price, distance, reviews and availability', 'Comparar precio, distancia, reseñas y disponibilidad')}</small></button><button id="rebook-demo" class="agent-prompt rebook"><span class="agent-dot"></span><b>${t(state, 'Rebook what I usually get', 'Reservar lo de siempre')}</b><small>${t(state, 'Book an exact match. Ask before any substitution.', 'Reservar si coincide. Preguntar antes de sustituir.')}</small></button></div>
    </section>

    ${state.rebookingException ? `<section class="rebooking-exception page-width"><div class="exception-mark">!</div><div><p class="eyebrow dark">${t(state, 'CUSTOMER CHOICE REQUIRED', 'SE REQUIERE TU DECISIÓN')}</p><h2>${t(state, `${state.rebookingException.provider.name} is not available in that window.`, `${state.rebookingException.provider.name} no está disponible en ese horario.`)}</h2><p>${t(state, 'Your saved permission does not cover substitutions. Choose another day with your usual provider, or compare other providers for the requested time.', 'Tu permiso guardado no cubre sustituciones. Elige otro día con tu profesional habitual o compara otros profesionales.')}</p><div class="exception-actions"><button id="exception-same-provider">${t(state, 'Same provider, another day', 'Mismo profesional, otro día')}</button><button id="exception-compare">${t(state, 'Compare other providers', 'Comparar profesionales')}</button></div></div></section>` : ''}

    <section class="category-section page-width">
      <div class="service-directory"><div><p class="eyebrow dark">${t(state, 'POPULAR SERVICES', 'SERVICIOS POPULARES')}</p><h2>${t(state, 'What do you need?', '¿Qué necesitas?')}</h2></div><div class="category-rail">${CATEGORIES.map((category) => `<button data-category="${category.id}" class="category-tile"><b>${state.locale === 'es' ? category.labelEs : category.label}</b><span>${t(state, 'View providers', 'Ver profesionales')} ${icon('arrow')}</span></button>`).join('')}</div></div>
      <div class="persona-switcher"><span>${t(state, 'DEMO PERSONALIZATION', 'PERSONALIZACIÓN DEMO')}</span>${CUSTOMER_PROFILES.map((customer) => `<button data-customer="${customer.id}" class="${state.customerProfileId === customer.id ? 'active' : ''}"><b>${customer.name} ${customer.relationship.returning ? `<em>${customer.relationship.visits} ${t(state, 'visits', 'visitas')}</em>` : `<em>${t(state, 'new', 'nuevo')}</em>`}</b><small>${customer.headline}</small></button>`).join('')}</div>
    </section>

    <section class="providers-section page-width" id="providers">
      <div class="section-head"><div><p class="eyebrow dark">${t(state, 'EXPLAINABLE FIT · NO PAID PLACEMENT', 'COMPATIBILIDAD EXPLICABLE')}</p><h2>${state.results.length ? t(state, `${state.results.length} personalized matches.`, `${state.results.length} resultados personalizados.`) : t(state, 'People worth meeting.', 'Profesionales que vale la pena conocer.')}</h2></div>${state.comparison ? `<div class="comparison-badge">${icon('check')} ${t(state, 'Goals, distance, value, trust and availability compared', 'Objetivos, distancia, valor y disponibilidad comparados')}</div>` : ''}</div>
      <div class="market-map-shell"><div><b>${t(state, 'Proximity changes the answer', 'La proximidad cambia el resultado')}</b><span>${t(state, 'OpenStreetMap and Leaflet, no location API key required', 'OpenStreetMap y Leaflet, sin clave requerida')}</span></div><div id="market-map" aria-label="Map of fictional Tampa providers"></div></div>
      ${state.comparison ? comparisonView(state) : ''}
      <div class="provider-grid">${results.map((item) => providerCard(item, state)).join('')}</div>
    </section>

    ${provider ? `<section class="profile-drawer" id="profile">
      <button id="close-profile" class="close" aria-label="Close">×</button>
      <div class="profile-image"><img src="${provider.image}" alt="Fictional provider ${escapeHtml(provider.name)}"><span>${provider.neighborhood}</span></div>
      <div class="profile-content">
        <p class="eyebrow dark">${provider.languages.join(' · ')}</p><h2>${provider.business}</h2><div class="profile-rating">${icon('star')} <b>${provider.rating}</b> from ${provider.reviews} ${t(state, 'reviews', 'reseñas')}</div>
        <p class="profile-bio">${state.locale === 'es' ? provider.bioEs : provider.bio}</p>
        <div class="profile-proof"><div><b>${t(state, 'Specializes in', 'Especialidades')}</b>${provider.specialties.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div><div><b>${t(state, 'Review themes', 'Temas en reseñas')}</b>${provider.reviewThemes.map((item) => `<span>“${escapeHtml(item.theme)}” · ${item.mentions}</span>`).join('')}</div></div>
        ${provider.promotion ? `<div class="profile-promo"><b>${escapeHtml(provider.promotion.label)}</b><span>${escapeHtml(provider.promotion.detail)} · ${t(state, 'Regular pricing shown transparently', 'Precio regular visible')}</span></div>` : ''}
        <h3>${t(state, 'Choose a service', 'Elige un servicio')}</h3>
        <div class="service-list">${provider.services.map((item) => `<button data-service="${item.id}" class="${item.id === state.selectedServiceId ? 'selected' : ''}"><span><b>${state.locale === 'es' ? item.nameEs : item.name}</b><small>${item.duration} min</small></span><strong>${money(item.price)}</strong></button>`).join('')}</div>
        ${state.availability.length ? `<div class="slots"><h3>${t(state, 'Available times', 'Horarios disponibles')}</h3>${state.availability.map((slot) => `<button data-slot="${slot.id}" class="${slot.id === state.selectedSlotId ? 'selected' : ''}"><small>${dateLabel(slot.date, state.locale)}</small><b>${slot.time}</b></button>`).join('')}</div>` : service ? `<p class="loading-line">${t(state, 'Checking available times...', 'Buscando horarios disponibles...')}</p>` : ''}
        ${state.selectedSlotId ? `<button id="prepare-review" class="primary-wide">${t(state, 'Review this appointment', 'Revisar esta cita')} ${icon('arrow')}</button>` : ''}
      </div>
    </section>` : ''}

    ${state.review ? reviewView(state) : ''}
    ${state.booking ? successView(state) : ''}
    ${activityPanel(state)}
  </main>`;
}

function comparisonView(state) {
  return `<div class="fit-ledger"><div class="fit-ledger-head"><div><p class="eyebrow dark">${t(state, 'WHY THIS ORDER', 'POR QUÉ ESTE ORDEN')}</p><h3>${t(state, 'The same six providers, ranked for this person.', 'Los mismos seis profesionales, clasificados para esta persona.')}</h3></div><span>${t(state, 'Deterministic fit score', 'Puntuación verificable')}</span></div><div class="fit-table">${state.comparison.map((item, index) => `<article><b class="rank">0${index + 1}</b><div><strong>${escapeHtml(item.business)}</strong><small>${escapeHtml(item.reasons.slice(0, 2).join(' · '))}</small>${item.tradeoffs.length ? `<em>${escapeHtml(item.tradeoffs[0])}</em>` : '<em>No major constraint conflicts</em>'}</div><div class="score-stack"><b>${item.matchScore}%</b><span>S ${item.scoreBreakdown.specialty} · D ${item.scoreBreakdown.distance} · V ${item.scoreBreakdown.value} · T ${item.scoreBreakdown.trust}</span></div></article>`).join('')}</div></div>`;
}

function reviewView(state) {
  const review = state.review;
  const standingPermission = review.authorizationMode === 'standing_exact_match_permission';
  return `<section class="review-overlay" id="review"><div class="review-card">
    <p class="eyebrow dark">04 · ${t(state, 'YOUR APPROVAL', 'TU APROBACIÓN')}</p><h2>${t(state, 'One last look.', 'Una última revisión.')}</h2>
    <div class="review-provider"><span style="background:${PROVIDERS.find((item) => item.id === review.provider.id).accent}">${review.provider.name.split(' ').map((word) => word[0]).join('')}</span><div><b>${review.provider.business}</b><small>${review.provider.name} · ${review.provider.neighborhood}</small></div></div>
    <dl><div><dt>${t(state, 'Service', 'Servicio')}</dt><dd>${state.locale === 'es' ? review.service.nameEs : review.service.name}</dd></div><div><dt>${t(state, 'When', 'Cuándo')}</dt><dd>${dateLabel(review.slot.date, state.locale)} · ${review.slot.time}</dd></div><div><dt>${t(state, 'Duration', 'Duración')}</dt><dd>${review.service.duration} min</dd></div><div><dt>${t(state, 'Total', 'Total')}</dt><dd>${money(review.price)} · $0 ${t(state, 'due now', 'ahora')}</dd></div></dl>
    <p class="policy">${review.cancellation}</p>
    ${state.approved ? `<div class="approval-complete">${icon('check')} <span><b>${standingPermission ? t(state, 'Matches your saved booking policy', 'Coincide con tu política guardada') : t(state, 'You approved this exact appointment', 'Aprobaste esta cita exacta')}</b><small>${standingPermission ? t(state, `Usual provider · pay in person · under $${state.bookingPolicy.maxServicePrice}. Substitutions still ask.`, `Profesional habitual · pago en persona · menos de $${state.bookingPolicy.maxServicePrice}. Los cambios requieren permiso.`) : t(state, 'The agent may now request it.', 'El agente ya puede solicitarla.')}</small></span></div><button id="book-button" class="primary-wide">${t(state, 'Book sandbox appointment', 'Reservar cita de prueba')} ${icon('arrow')}</button>` : `<button id="approve-button" class="approve-button">${t(state, 'Approve this exception', 'Aprobar esta excepción')}</button><small class="approval-note">${t(state, review.authorizationReason === 'price_above_customer_limit' ? `This service exceeds your $${state.bookingPolicy.maxServicePrice} limit.` : 'The provider, service, or time differs from your saved instruction.', review.authorizationReason === 'price_above_customer_limit' ? `Este servicio supera tu límite de $${state.bookingPolicy.maxServicePrice}.` : 'El profesional, servicio u horario no coincide con tu instrucción.')}</small>`}
  </div></section>`;
}

function successView(state) {
  return `<section class="success-toast"><span>${icon('check')}</span><div><p class="eyebrow">${t(state, 'CONFIRMED IN THE SANDBOX', 'CONFIRMADO EN LA PRUEBA')}</p><h3>${state.booking.reference}</h3><p>${t(state, 'Switch to Marco’s provider account to see it on his calendar.', 'Cambia a la cuenta de Marco para verla en su calendario.')}</p></div><button data-role="provider">${t(state, 'Open provider calendar', 'Abrir calendario')} ${icon('arrow')}</button></section>`;
}

function activityPanel(state) {
  const tokens = state.events.reduce((sum, event) => sum + event.inputTokensEstimated + event.outputTokensEstimated, 0);
  const eventRows = state.events.slice().reverse().map((event, index) => `<details class="trace-event ${event.status === 'blocked' ? 'blocked' : ''}" ${index === 0 ? 'open' : ''}><summary><span class="trace-number">${String(state.events.length - index).padStart(2, '0')}</span><span><b>${event.action}</b><small>${event.target || 'document.modelContext'} · ${event.status || 'success'}</small></span><em>≈ ${event.inputTokensEstimated + event.outputTokensEstimated}</em></summary><div class="trace-flow"><span>AGENT REQUEST</span><i>→</i><span>WEBMCP TOOL</span><i>→</i><span>SHARED UI STATE</span></div><div class="trace-json"><section><b>INPUT</b><pre>${escapeHtml(JSON.stringify(event.input ?? {}, null, 2))}</pre></section><section><b>OUTPUT</b><pre>${escapeHtml(JSON.stringify(event.output ?? {}, null, 2))}</pre></section></div></details>`).join('');
  return `<aside class="activity-panel"><div class="activity-head"><span class="agent-dot"></span><div><b>${t(state, 'Live WebMCP trace', 'Registro WebMCP en vivo')}</b><small>${nativeTools || TOOL_DEFINITIONS.length} ${t(state, 'native site tools available', 'herramientas nativas disponibles')}</small></div><button id="toggle-activity">${state.events.length}</button></div><div class="activity-body"><div class="metrics"><span><b>${state.events.length}</b> ${t(state, 'tool calls', 'llamadas')}</span><span><b>${tokens}</b> ${t(state, 'estimated JSON I/O tokens', 'tokens JSON estimados')}</span></div><p class="trace-caption">${t(state, 'This is the real data exchanged between the AI browser and the page.', 'Estos son los datos reales entre el navegador con IA y la página.')}</p>${lastError ? `<p class="tool-error">${escapeHtml(lastError)}</p>` : ''}<div class="trace-list">${eventRows || `<p class="trace-empty">${t(state, 'Run an AI shortcut to see each request and response.', 'Ejecuta un atajo para ver cada solicitud y respuesta.')}</p>`}</div></div></aside>`;
}

function customerAccountView(state) {
  const customer = CUSTOMER_PROFILES.find((item) => item.id === state.customerProfileId) || CUSTOMER_PROFILES[0];
  const usualProvider = PROVIDERS.find((item) => item.id === customer.relationship.lastProviderId);
  const bookings = engine.getBookings().filter((booking) => booking.customer.id === customer.id || booking.customer.email === customer.email);
  return `<main class="account-main page-width">
    <section class="account-hero"><div><p class="eyebrow">CUSTOMER ACCOUNT</p><h1>${t(state, `Welcome back, ${customer.name.split(' ')[0]}.`, `Hola de nuevo, ${customer.name.split(' ')[0]}.`)}</h1><p>${t(state, 'Your providers, appointments, and booking confirmations in one place.', 'Tus profesionales, citas y confirmaciones en un solo lugar.')}</p></div><button id="account-rebook" class="account-primary">${t(state, 'Ask AI to rebook', 'Pedir a la IA que reserve')} ${icon('arrow')}</button></section>
    <section class="account-grid">
      <article class="account-card relationship-card"><p class="eyebrow dark">${t(state, 'YOUR USUAL PROVIDER', 'TU PROFESIONAL HABITUAL')}</p>${usualProvider ? `<div class="usual-provider"><img src="${usualProvider.image}" alt="${escapeHtml(usualProvider.name)}"><div><h2>${escapeHtml(usualProvider.name)}</h2><p>${escapeHtml(usualProvider.business)} · ${usualProvider.neighborhood}</p><span>${usualProvider.languages.join(' · ')}</span><b>${customer.relationship.visits} ${t(state, 'completed visits', 'visitas completadas')}</b></div></div><p class="memory-note">“${escapeHtml(customer.relationship.note)}”</p>` : `<p>${t(state, 'No previous provider yet.', 'Aún no hay profesional anterior.')}</p>`}</article>
      <article class="account-card"><p class="eyebrow dark">${t(state, 'AI BOOKING POLICY', 'POLÍTICA DE RESERVA IA')}</p><div class="booking-policy"><span class="policy-status">${state.bookingPermission === 'book_exact_matches' ? t(state, 'ACTIVE', 'ACTIVA') : t(state, 'REVIEW ALL', 'REVISAR TODO')}</span><h3>${t(state, 'Book exact matches when I ask.', 'Reserva coincidencias exactas cuando lo pida.')}</h3><p>${t(state, 'The agent can act inside these limits without interrupting me.', 'El agente puede actuar dentro de estos límites sin interrumpirme.')}</p><div class="policy-controls"><label><span>${t(state, 'Maximum service price', 'Precio máximo')}</span><select id="policy-price-limit">${[25,35,50,75,100].map((amount) => `<option value="${amount}" ${amount === state.bookingPolicy.maxServicePrice ? 'selected' : ''}>$${amount}</option>`).join('')}</select></label><div><span>${t(state, 'Payment', 'Pago')}</span><b>${t(state, 'Pay in person', 'Pagar en persona')}</b></div><div><span>${t(state, 'Exceptions', 'Excepciones')}</span><b>${t(state, 'Ask me', 'Preguntarme')}</b></div></div><ul><li>${t(state, 'Usual provider and service can book automatically', 'Profesional y servicio habitual pueden reservar automáticamente')}</li><li>${t(state, 'Ask if provider, service, or time window changes', 'Preguntar si cambia el profesional, servicio u horario')}</li><li>${t(state, 'Ask above my price limit', 'Preguntar si supera mi límite')}</li></ul><button id="booking-permission">${state.bookingPermission === 'book_exact_matches' ? t(state, 'Require review every time', 'Revisar cada vez') : t(state, 'Use smart booking policy', 'Usar política inteligente')}</button></div></article>
    </section>
    <section class="appointments-card"><div class="appointments-head"><div><p class="eyebrow dark">${t(state, 'APPOINTMENTS', 'CITAS')}</p><h2>${bookings.length ? t(state, 'Your booking is confirmed.', 'Tu reserva está confirmada.') : t(state, 'Your next appointment.', 'Tu próxima cita.')}</h2></div><span class="status-pill">${bookings.length ? t(state, 'CONFIRMED', 'CONFIRMADA') : t(state, 'READY TO REBOOK', 'LISTA PARA RESERVAR')}</span></div>
      ${bookings.length ? bookings.map((booking) => `<article class="appointment-row"><div class="calendar-date"><b>${new Date(`${booking.slot.date}T12:00:00`).getDate()}</b><span>${new Date(`${booking.slot.date}T12:00:00`).toLocaleString(state.locale === 'es' ? 'es-US' : 'en-US', { month: 'short' })}</span></div><div><h3>${booking.service.name}</h3><p>${booking.provider.name} at ${booking.provider.business}</p><small>${booking.slot.time} · ${booking.service.duration} min · ${booking.reference}</small></div><div class="notification-proof"><b>${icon('check')} ${t(state, 'Confirmation preview ready', 'Vista de confirmación lista')}</b><span>${customer.email} · ${t(state, 'not actually sent', 'no enviada')}</span></div></article>`).join('') : `<article class="appointment-row"><div class="calendar-date"><b>03</b><span>SEP</span></div><div><h3>${t(state, 'Signature haircut', 'Corte exclusivo')}</h3><p>${usualProvider?.name} at ${usualProvider?.business}</p><small>${t(state, 'Ask your AI assistant to find the best lunch time.', 'Pide a tu asistente que encuentre un horario al mediodía.')}</small></div><span class="status-pill muted">${t(state, 'NOT BOOKED', 'SIN RESERVAR')}</span></article>`}
    </section>
  </main>`;
}

function loginModal(state) {
  if (!loginOpen) return '';
  return `<section class="login-overlay"><form id="login-form" class="login-card"><button type="button" id="close-login" class="close">×</button><img src="./images/booksy-reloaded-logo.png" alt="Booksy Reloaded"><p class="eyebrow dark">${t(state, 'CUSTOMER SIGN IN', 'INICIO DE SESIÓN')}</p><h2>${t(state, 'See your appointments.', 'Consulta tus citas.')}</h2><label>${t(state, 'Username', 'Usuario')}<input id="login-username" autocomplete="username" value="alex@demo.local"></label><label>${t(state, 'Password', 'Contraseña')}<input id="login-password" type="password" autocomplete="current-password" value="bookme"></label>${lastError ? `<p class="login-error">${escapeHtml(lastError)}</p>` : ''}<button type="submit" class="approve-button">${t(state, 'Sign in to demo account', 'Entrar a la cuenta demo')}</button><small>${t(state, 'Demo credentials are prefilled. No real account data is used.', 'Las credenciales demo están completas. No se usan datos reales.')}</small></form></section>`;
}

function providerView(state) {
  const bookings = engine.getBookings().filter((booking) => booking.provider.id === 'marco-ruiz');
  return `<main class="business-main"><section class="business-hero page-width"><div><p class="eyebrow">BOOKSY RELOADED FOR BUSINESS · CIGAR CITY CUTS</p><h1>${t(state, 'Good morning, Marco.', 'Buenos días, Marco.')}</h1><p>${t(state, 'Your schedule is current. New WebMCP appointments appear here immediately.', 'Tu calendario está actualizado. Las nuevas citas WebMCP aparecen aquí de inmediato.')}</p></div><div class="business-stat"><small>${t(state, 'CONFIRMED TODAY', 'CONFIRMADAS HOY')}</small><b>${bookings.length}</b><span>+$${bookings.reduce((sum, item) => sum + item.price, 0)} ${t(state, 'booked', 'reservado')}</span></div></section>
    <section class="calendar-shell page-width"><div class="calendar-head"><div><p class="eyebrow dark">${t(state, 'PROVIDER CALENDAR', 'CALENDARIO')}</p><h2>${bookings[0] ? dateLabel(bookings[0].slot.date, state.locale) : t(state, 'Thursday, September 10', 'Jueves, 10 de septiembre')}</h2></div><div class="calendar-actions"><button>${t(state, 'Block time', 'Bloquear hora')}</button><button class="dark-button">+ ${t(state, 'New appointment', 'Nueva cita')}</button></div></div>
      <div class="calendar-grid"><div class="time-column"><span>9 AM</span><span>10 AM</span><span>11 AM</span><span>12 PM</span><span>1 PM</span><span>2 PM</span><span>3 PM</span><span>4 PM</span></div><div class="day-column"><div class="grid-lines"></div><article class="existing appt-one"><b>Jordan Lee</b><span>Signature haircut · 45 min</span></article><article class="existing appt-two"><b>Sam Patel</b><span>Cut and beard detail · 60 min</span></article>${bookings.map((booking) => `<article class="new-booking"><div class="new-label"><span class="agent-dot"></span> WEBMCP · JUST NOW</div><b>${escapeHtml(booking.customer.name)}</b><span>${state.locale === 'es' ? booking.service.nameEs : booking.service.name} · ${booking.service.duration} min</span><small>${booking.slot.time} · ${money(booking.price)} · ${booking.status}</small></article>`).join('')}</div><aside class="business-feed"><h3>${t(state, 'Appointment feed', 'Actividad de citas')}</h3>${bookings.length ? bookings.map((booking) => `<div class="feed-item"><span>${icon('check')}</span><div><b>${t(state, 'New confirmed appointment', 'Nueva cita confirmada')}</b><p>${booking.customer.name} booked ${booking.service.name}.</p><small>${booking.reference}</small></div></div>`).join('') : `<div class="feed-empty">${t(state, 'Complete the customer demo and the appointment will appear here.', 'Completa la demostración del cliente y la cita aparecerá aquí.')}</div>`}<div class="provider-proof"><b>${t(state, 'Sandbox guarantees', 'Garantías de prueba')}</b><span>✓ ${t(state, 'No real customer notification', 'Sin notificación real')}</span><span>✓ ${t(state, 'No payment or production inventory', 'Sin pago ni inventario real')}</span><span>✓ ${t(state, 'Browser-local persistence', 'Persistencia local')}</span></div></aside></div>
    </section><button id="reset-demo" class="reset-demo">${t(state, 'Reset all demo data', 'Restablecer datos')}</button></main>`;
}

function header(state) {
  return `<header class="site-header"><button class="brand" id="home-button" aria-label="Booksy Reloaded home"><img src="./images/booksy-reloaded-logo.png" alt="Booksy Reloaded"></button><nav><button data-role="customer" class="${state.role === 'customer' && customerPage === 'marketplace' ? 'active' : ''}">${t(state, 'Find a service', 'Buscar servicio')}</button><button id="customer-account-nav" class="${state.role === 'customer' && customerPage === 'account' ? 'active' : ''}">${t(state, 'Appointments', 'Citas')}</button><button data-role="provider" class="${state.role === 'provider' ? 'active' : ''}">${t(state, 'For providers', 'Para profesionales')}</button></nav><div class="header-actions"><button id="locale-button" class="locale-button"><span class="us-flag" aria-hidden="true">${state.locale === 'en' ? '🇺🇸' : '🇪🇸'}</span><span>${state.locale === 'en' ? 'EN' : 'ES'}</span></button><button id="account-button" class="account-button">${icon('user')}<span><small>${state.role === 'customer' ? (customerLoggedIn ? t(state, 'SIGNED IN', 'SESIÓN ACTIVA') : t(state, 'CUSTOMER LOGIN', 'INICIAR SESIÓN')) : t(state, 'PROVIDER DEMO', 'PROFESIONAL DEMO')}</small><b>${state.role === 'customer' && !customerLoggedIn ? t(state, 'Demo account', 'Cuenta demo') : state.role === 'customer' ? 'Alex Morgan' : 'Marco Ruiz'}</b></span></button></div></header>`;
}

function bind(state) {
  root.querySelectorAll('[data-role]').forEach((button) => button.addEventListener('click', () => { customerPage = 'marketplace'; engine.setRole(button.dataset.role); }));
  root.querySelector('#home-button')?.addEventListener('click', () => { customerPage = 'marketplace'; engine.setRole('customer'); });
  root.querySelector('#account-button')?.addEventListener('click', () => { if (state.role === 'provider') return; if (customerLoggedIn) customerPage = 'account'; else loginOpen = true; render(state); });
  root.querySelector('#customer-account-nav')?.addEventListener('click', () => { if (customerLoggedIn) customerPage = 'account'; else loginOpen = true; render(state); });
  root.querySelector('#close-login')?.addEventListener('click', () => { loginOpen = false; lastError = ''; render(state); });
  root.querySelector('#login-form')?.addEventListener('submit', (event) => { event.preventDefault(); const user = root.querySelector('#login-username').value; const password = root.querySelector('#login-password').value; if (user === 'alex@demo.local' && password === 'bookme') { customerLoggedIn = true; loginOpen = false; customerPage = 'account'; lastError = ''; engine.authenticate('alex-morgan'); safeRun('get_authentication_status', {}); } else { lastError = 'Use the prefilled demo credentials.'; render(state); } });
  root.querySelector('#booking-permission')?.addEventListener('click', () => engine.setBookingPermission(state.bookingPermission === 'book_exact_matches' ? 'review_every_booking' : 'book_exact_matches'));
  root.querySelector('#policy-price-limit')?.addEventListener('change', (event) => engine.setBookingPolicy({ maxServicePrice: Number(event.target.value) }));
  root.querySelector('#exception-same-provider')?.addEventListener('click', () => safeRun('find_rebooking_options', { customerProfileId: state.customerProfileId, requestedDate: '2026-09-10', timePreference: 'any' }));
  root.querySelector('#exception-compare')?.addEventListener('click', () => { safeRun('personalize_recommendations', { customerProfileId: state.customerProfileId, category: 'barber', date: state.preferences.date }); safeRun('compare_providers', {}); });
  root.querySelector('#account-rebook')?.addEventListener('click', () => { customerPage = 'marketplace'; render(state); setTimeout(runRebookDemo, 50); });
  root.querySelector('#locale-button')?.addEventListener('click', () => engine.setLocale(state.locale === 'en' ? 'es' : 'en'));
  root.querySelectorAll('[data-customer]').forEach((button) => button.addEventListener('click', () => { safeRun('personalize_recommendations', { customerProfileId: button.dataset.customer, category: '', date: state.preferences.date }); safeRun('compare_providers', {}); }));
  root.querySelector('#search-button')?.addEventListener('click', () => { safeRun('personalize_recommendations', { customerProfileId: state.customerProfileId, category: root.querySelector('#category-select').value, spokenLanguage: root.querySelector('#language-select').value, date: root.querySelector('#date-input').value }); safeRun('compare_providers', {}); });
  root.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => safeRun('search_providers', { category: button.dataset.category, spokenLanguage: '', minimumRating: 4.5, accessibleOnly: false })));
  root.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => safeRun('get_provider_profile', { providerId: button.dataset.open })));
  root.querySelector('#close-profile')?.addEventListener('click', () => { engine.run('set_marketplace_preferences', state.preferences); });
  root.querySelectorAll('[data-service]').forEach((button) => button.addEventListener('click', () => safeRun('find_service_availability', { providerId: state.selectedProviderId, serviceId: button.dataset.service, date: state.preferences.date })));
  root.querySelectorAll('[data-slot]').forEach((button) => button.addEventListener('click', () => safeRun('select_appointment', { providerId: state.selectedProviderId, serviceId: state.selectedServiceId, slotId: button.dataset.slot })));
  root.querySelector('#prepare-review')?.addEventListener('click', () => safeRun('prepare_booking_review', {}));
  root.querySelector('#approve-button')?.addEventListener('click', () => { lastError = ''; engine.approve(); });
  root.querySelector('#book-button')?.addEventListener('click', () => safeRun('request_booking', { confirmed: true }));
  root.querySelector('#agent-demo')?.addEventListener('click', runGuidedDemo);
  root.querySelector('#rebook-demo')?.addEventListener('click', runRebookDemo);
  root.querySelector('#toggle-activity')?.addEventListener('click', () => root.querySelector('.activity-panel')?.classList.toggle('expanded'));
  root.querySelector('#reset-demo')?.addEventListener('click', () => engine.reset());
}

function safeRun(name, input = {}) {
  try { lastError = ''; return engine.run(name, input); }
  catch (error) { lastError = error.message; engine.recordFailure(name, input, error); return null; }
}

function runGuidedDemo() {
  safeRun('personalize_recommendations', { customerProfileId: 'alex-morgan', category: '', date: '2026-09-10' });
  safeRun('compare_providers', {});
  safeRun('get_provider_profile', { providerId: 'marco-ruiz' });
  safeRun('find_service_availability', { providerId: 'marco-ruiz', serviceId: 'signature-cut', date: '2026-09-10' });
  safeRun('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0910-1030' });
  safeRun('prepare_booking_review', {});
  setTimeout(() => document.querySelector('#review')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
}

function runRebookDemo() {
  if (engine.getState().session.status !== 'signed_in') {
    safeRun('get_authentication_status', {});
    loginOpen = true;
    lastError = '';
    render(engine.getState());
    return;
  }
  safeRun('get_customer_history', { customerProfileId: 'alex-morgan' });
  safeRun('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
  setTimeout(() => document.querySelector('#profile')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
}

function render(state = engine.getState()) {
  if (mapFrame !== null) { cancelAnimationFrame(mapFrame); mapFrame = null; }
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }
  root.innerHTML = `${header(state)}${state.role === 'customer' ? (customerPage === 'account' ? customerAccountView(state) : customerView(state)) : providerView(state)}${loginModal(state)}<footer><b>BOOKSY RELOADED</b><span>${t(state, 'Independent WebMCP prototype · Not affiliated with Booksy · No real appointments', 'Prototipo WebMCP independiente · No afiliado con Booksy · Sin citas reales')}</span></footer>`;
  document.documentElement.lang = state.locale;
  bind(state);
  if (state.role === 'customer' && customerPage === 'marketplace') {
    mapFrame = requestAnimationFrame(() => {
      mapFrame = null;
      mountMap(state);
    });
  }
}

function mountMap(state) {
  const mapRoot = document.querySelector('#market-map');
  if (!mapRoot) return;
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }
  const activeCustomer = CUSTOMER_PROFILES.find((item) => item.id === state.customerProfileId) || CUSTOMER_PROFILES[0];
  mapInstance = L.map(mapRoot, { zoomControl: false, attributionControl: true, scrollWheelZoom: false }).setView(activeCustomer.coordinates, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(mapInstance);
  L.circleMarker(activeCustomer.coordinates, { radius: 10, color: '#171717', weight: 4, fillColor: '#c8ff35', fillOpacity: 1 }).addTo(mapInstance).bindTooltip(`${activeCustomer.name} · ${activeCustomer.home}`);
  const visible = state.results.length ? state.results : PROVIDERS;
  visible.forEach((result, index) => {
    const provider = PROVIDERS.find((item) => item.id === result.id) || result;
    L.circleMarker(provider.coordinates, { radius: result.matchScore ? 7 + result.matchScore / 20 : 9, color: '#171717', weight: 3, fillColor: index === 0 && state.results.length ? '#ff806f' : provider.accent, fillOpacity: 0.95 }).addTo(mapInstance).bindTooltip(`${provider.business} · ${result.matchScore ?? 'Unranked'}${result.matchScore ? '% fit' : ''}`);
  });
}

render();
nativeTools = (await installWebMcp(engine)).length;
render(engine.getState());
