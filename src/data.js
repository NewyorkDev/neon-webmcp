export const CATEGORIES = [
  { id: 'barber', label: 'Barbers', labelEs: 'Barberos', glyph: '✂' },
  { id: 'hair', label: 'Hair', labelEs: 'Cabello', glyph: '⌁' },
  { id: 'nails', label: 'Nails', labelEs: 'Uñas', glyph: '✦' },
  { id: 'skincare', label: 'Skin care', labelEs: 'Cuidado facial', glyph: '◌' },
  { id: 'massage', label: 'Massage', labelEs: 'Masaje', glyph: '≈' },
];

export const PROVIDERS = [
  {
    id: 'marco-ruiz', business: 'Cigar City Cuts', name: 'Marco Ruiz', category: 'barber',
    neighborhood: 'Ybor City', distance: 2.1, rating: 4.96, reviews: 418,
    languages: ['English', 'Spanish'], accessible: true, image: './images/marco-ruiz.png',
    accent: '#c8ff35', bio: 'Precision fades, classic cuts, and straight-razor detail in a relaxed neighborhood studio.',
    bioEs: 'Desvanecidos precisos, cortes clásicos y detalles con navaja en un estudio relajado del vecindario.',
    cancellation: 'Free cancellation up to 12 hours before the appointment.',
    services: [
      { id: 'signature-cut', name: 'Signature haircut', nameEs: 'Corte exclusivo', duration: 45, price: 46 },
      { id: 'cut-beard', name: 'Haircut and beard detail', nameEs: 'Corte y arreglo de barba', duration: 60, price: 62 },
      { id: 'kids-cut', name: 'Kids cut', nameEs: 'Corte infantil', duration: 35, price: 34 },
    ],
    slots: [
      { id: 'mr-0910-1030', date: '2026-09-10', time: '10:30 AM' },
      { id: 'mr-0910-1330', date: '2026-09-10', time: '1:30 PM' },
      { id: 'mr-0910-1530', date: '2026-09-10', time: '3:30 PM' },
      { id: 'mr-0911-0900', date: '2026-09-11', time: '9:00 AM' },
    ],
  },
  {
    id: 'nia-brooks', business: 'The Edit Tampa', name: 'Nia Brooks', category: 'hair',
    neighborhood: 'Hyde Park', distance: 3.4, rating: 4.91, reviews: 286,
    languages: ['English'], accessible: true, image: './images/nia-brooks.png',
    accent: '#d9c7ff', bio: 'Healthy-hair specialist known for silk presses, dimensional styling, and thoughtful consultations.',
    bioEs: 'Especialista en cabello saludable, alisados, peinados con dimensión y consultas detalladas.',
    cancellation: 'Free cancellation up to 24 hours before the appointment.',
    services: [
      { id: 'silk-press', name: 'Silk press', nameEs: 'Alisado silk press', duration: 90, price: 95 },
      { id: 'shape-style', name: 'Shape and style', nameEs: 'Forma y peinado', duration: 75, price: 82 },
    ],
    slots: [
      { id: 'nb-0910-1100', date: '2026-09-10', time: '11:00 AM' },
      { id: 'nb-0911-1400', date: '2026-09-11', time: '2:00 PM' },
    ],
  },
  {
    id: 'mei-chen', business: 'Soft Set Studio', name: 'Mei Chen', category: 'nails',
    neighborhood: 'Channelside', distance: 1.6, rating: 4.88, reviews: 193,
    languages: ['English', 'Mandarin'], accessible: true, image: './images/mei-chen.png',
    accent: '#ff8b7b', bio: 'Detailed natural-nail care and modern art in a calm, one-client-at-a-time studio.',
    bioEs: 'Cuidado detallado de uñas naturales y arte moderno en un estudio tranquilo y privado.',
    cancellation: 'Free cancellation up to 12 hours before the appointment.',
    services: [
      { id: 'structured-manicure', name: 'Structured manicure', nameEs: 'Manicura estructurada', duration: 70, price: 68 },
      { id: 'gel-art', name: 'Gel manicure with art', nameEs: 'Manicura en gel con diseño', duration: 85, price: 78 },
    ],
    slots: [
      { id: 'mc-0910-1200', date: '2026-09-10', time: '12:00 PM' },
      { id: 'mc-0912-1000', date: '2026-09-12', time: '10:00 AM' },
    ],
  },
  {
    id: 'sofia-alvarez', business: 'Luz Skin Room', name: 'Sofía Alvarez', category: 'skincare',
    neighborhood: 'West Tampa', distance: 4.2, rating: 4.93, reviews: 241,
    languages: ['English', 'Spanish'], accessible: true, image: './images/sofia-alvarez.png',
    accent: '#d9c7ff', bio: 'Bilingual esthetician offering barrier-first facials and clear, practical home-care guidance.',
    bioEs: 'Esteticista bilingüe que ofrece faciales enfocados en la barrera de la piel y consejos prácticos.',
    cancellation: 'Free cancellation up to 24 hours before the appointment.',
    services: [
      { id: 'custom-facial', name: 'Custom facial', nameEs: 'Facial personalizado', duration: 60, price: 105 },
      { id: 'express-glow', name: 'Express glow', nameEs: 'Luminosidad exprés', duration: 35, price: 72 },
    ],
    slots: [
      { id: 'sa-0910-1430', date: '2026-09-10', time: '2:30 PM' },
      { id: 'sa-0911-1030', date: '2026-09-11', time: '10:30 AM' },
    ],
  },
  {
    id: 'darius-cole', business: 'Palmetto Bodywork', name: 'Darius Cole', category: 'massage',
    neighborhood: 'Seminole Heights', distance: 3.8, rating: 4.89, reviews: 167,
    languages: ['English'], accessible: false, image: './images/darius-cole.png',
    accent: '#c8ff35', bio: 'Restorative bodywork for desk tension, training recovery, and a quieter nervous system.',
    bioEs: 'Masaje restaurativo para tensión de oficina, recuperación física y un sistema nervioso más tranquilo.',
    cancellation: 'Free cancellation up to 24 hours before the appointment.',
    services: [
      { id: 'restorative-60', name: 'Restorative massage', nameEs: 'Masaje restaurativo', duration: 60, price: 110 },
      { id: 'deep-tissue-75', name: 'Deep tissue focus', nameEs: 'Masaje de tejido profundo', duration: 75, price: 138 },
    ],
    slots: [
      { id: 'dc-0910-1600', date: '2026-09-10', time: '4:00 PM' },
      { id: 'dc-0912-1130', date: '2026-09-12', time: '11:30 AM' },
    ],
  },
];

export const DEMO_CUSTOMER = {
  id: 'alex-morgan', name: 'Alex Morgan', email: 'alex@example.test', phone: '(813) 555-0148',
};
