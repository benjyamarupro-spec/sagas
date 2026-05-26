'use client';
import { useState, useEffect } from 'react';
import { Waves, Music, Trees, Droplets, Mountain, Wind, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

// ============================================================
// DONNÉES
// ============================================================

const TABS = [
  { id: 'overview',         label: 'Overview' },
  { id: 'how-to-get-there', label: 'How to get there' },
  { id: 'best-time',        label: 'Best time to go' },
  { id: 'island-zones',     label: 'Island zones' },
  { id: 'restaurants',      label: 'Restaurants' },
  { id: 'budget',           label: 'Budget' },
  { id: 'tips',             label: 'Tips & tricks' },
];

const ZONES = [
  {
    icon: Waves,
    name: 'Cloud 9',
    tag: 'Surf · Legend',
    tagBg: 'var(--seafoam)', tagColor: 'var(--lagoon)',
    iconBg: 'var(--seafoam)', iconColor: 'var(--lagoon)',
    img: '/images/zones/cloud9.webp',
    desc: 'The most iconic surf break in Southeast Asia. Cloud 9 is a hollow right-hand barrel that draws world-class surfers every October for the Siargao International Surfing Cup. The wooden boardwalk stretching out to the break is a landmark in itself — perfect for sunset watching even if you\'ve never touched a surfboard.',
    vibe: 'For surfers, surf fans, and sunset chasers.',
    best: 'October — competition month, perfect swell',
  },
  {
    icon: Music,
    name: 'General Luna',
    tag: 'Party · Nightlife',
    tagBg: 'var(--golden-light)', tagColor: '#7A5A00',
    iconBg: 'var(--golden-light)', iconColor: '#7A5A00',
    img: '/images/zones/general-luna.webp',
    desc: 'The beating heart of Siargao tourism. General Luna is where everything happens — international restaurants, cocktail bars, surf schools, scooter rentals, live music, and some of the best sunsets in the Philippines. Digital nomads, long-term travelers, and backpackers all converge here.',
    vibe: 'For those who want to be in the middle of it all.',
    best: 'December–March (peak season energy)',
  },
  {
    icon: Droplets,
    name: 'Maasin River',
    tag: 'Nature · Chill',
    tagBg: '#E3F2FD', tagColor: '#1565C0',
    iconBg: '#E3F2FD', iconColor: '#1565C0',
    img: '/images/zones/maasin.webp',
    desc: 'A hidden gem just minutes from General Luna. Maasin River is a peaceful mangrove river where you can kayak or paddleboard through dense jungle canopy. Incredibly photogenic, serene, and almost always uncrowded. One of the best half-day activities on the island.',
    vibe: 'For those who want nature without the effort.',
    best: 'Dry season (Feb–May) for calm water',
  },
  {
    icon: Mountain,
    name: 'Beto Cold Spring',
    tag: 'Hidden Gem · Fresh water',
    tagBg: '#E8F5E9', tagColor: '#2E7D32',
    iconBg: '#E8F5E9', iconColor: '#2E7D32',
    img: '/images/zones/beto-cold-spring.webp',
    desc: 'A natural freshwater spring hidden in the jungle — crystal clear, cold, and incredibly refreshing. Beto Cold Spring is one of Siargao\'s best-kept secrets. Swim in a natural pool fed by underground springs, surrounded by tropical forest. Fewer than 5% of visitors ever find it.',
    vibe: 'For adventurers willing to go off the beaten track.',
    best: 'Any time — water is always cold and clear',
  },
  {
    icon: Trees,
    name: 'Pacifico (North)',
    tag: 'Wild · Off-grid',
    tagBg: '#F3E5F5', tagColor: '#6A1B9A',
    iconBg: '#F3E5F5', iconColor: '#6A1B9A',
    img: '/images/zones/pacifico.webp',
    desc: 'Head 45 minutes north and the island transforms completely. Pacifico is raw, empty, and breathtaking — long stretches of white sand, powerful beach breaks, and almost no tourists. Local fishermen still outnumber visitors here.',
    vibe: 'For surfers and adventurers escaping the crowd.',
    best: 'October–February for surf, any time for solitude',
  },
  {
    icon: Wind,
    name: 'Alegría Beach',
    tag: 'Unspoiled · Local',
    tagBg: '#FFF3E0', tagColor: '#E65100',
    iconBg: '#FFF3E0', iconColor: '#E65100',
    img: '/images/zones/alegria.webp',
    desc: 'One of Siargao\'s most beautiful and least-visited beaches. Alegría sits on the northwestern coast — powdery white sand, turquoise water, and almost no infrastructure. You\'ll need a motorbike and about an hour from General Luna, but the reward is a beach that feels entirely yours.',
    vibe: 'For those who want paradise without the crowd.',
    best: 'Dry season (Feb–May) — calm water, clear sky',
  },
  {
    icon: Droplets,
    name: 'Sugba Lagoon',
    tag: 'Lagoons · Must-do',
    tagBg: '#E1F5FE', tagColor: '#0277BD',
    iconBg: '#E1F5FE', iconColor: '#0277BD',
    img: '/images/zones/sugba-lagoon.webp',
    desc: 'Siargao\'s most iconic photo spot — an emerald green lagoon surrounded by mangroves, accessible only by boat (30–40 min from GL). Sugba is everything you imagine the Philippines to be: turquoise water, swing ropes into the lagoon, paddleboards, and total serenity. Go early morning.',
    vibe: 'For everyone — this one is unmissable.',
    best: 'March–May (calmest seas, best visibility)',
  },
];

const ATTRACTIONS = [
  {
    name: 'Cloud 9 Surfing Area',
    query: 'Cloud 9 Surfing Area General Luna Siargao Philippines',
    type: 'surf',
    color: '#0A5C54',
  },
  {
    name: 'General Luna',
    query: 'General Luna town center Siargao Philippines',
    type: 'town',
    color: '#E8B44A',
  },
  {
    name: 'Maasin River',
    query: 'Maasin River Siargao Philippines',
    type: 'nature',
    color: '#1565C0',
  },
  {
    name: 'Beto Cold Spring',
    query: 'Beto Cold Spring Siargao Philippines',
    type: 'nature',
    color: '#2E7D32',
  },
  {
    name: 'Pacifico Beach',
    query: 'Pacifico Beach Siargao Philippines',
    type: 'beach',
    color: '#6A1B9A',
  },
  {
    name: 'Alegría Beach',
    query: 'Alegria Beach Siargao Philippines',
    type: 'beach',
    color: '#E65100',
  },
  {
    name: 'Sugba Lagoon',
    query: 'Sugba Lagoon Del Carmen Siargao Philippines',
    type: 'lagoon',
    color: '#0277BD',
  },
];

const RESTAURANTS = [
  {
    name: 'Alma Siargao',
    zone: 'General Luna',
    price: '₱₱₱',
    priceLevel: 3,
    cuisine: 'Spanish · Mediterranean',
    desc: "Benjamin's personal favorite. Alma is Siargao's finest Spanish restaurant — beachfront, intimate, and genuinely exceptional. Chef Luis Martinez brings sun-soaked Mediterranean flavors to the island.",
    specialty: 'Tapas & paella — must order both',
    coord: { lat: 9.7820, lng: 126.1520 },
    highlight: true,
  },
  {
    name: 'Ferns',
    zone: 'General Luna',
    price: '₱₱₱',
    priceLevel: 3,
    cuisine: 'International · Garden dining',
    desc: 'Elegant garden setting, one of the most beautiful restaurants on the island. Creative international menu with a strong focus on fresh ingredients.',
    specialty: 'Pasta & grilled meats — both excellent',
    coord: { lat: 9.7835, lng: 126.1535 },
    highlight: false,
  },
  {
    name: 'Wild Artisan Kitchen',
    zone: 'General Luna',
    price: '₱₱₱',
    priceLevel: 3,
    cuisine: 'Artisan · Natural',
    desc: 'Farm-to-table concept using local Siargao ingredients. Creative, beautifully presented dishes in a relaxed open-air setting.',
    specialty: 'Adobe — delicious. Drinks are very good too.',
    coord: { lat: 9.7842, lng: 126.1545 },
    highlight: false,
  },
  {
    name: 'Roots',
    zone: 'General Luna',
    price: '₱₱₱',
    priceLevel: 3,
    cuisine: 'Healthy · Filipino organic',
    desc: 'Set menu concept using 100% Filipino ingredients — everything is local, seasonal, and delicious. No single dish to order; just trust the menu.',
    specialty: 'Full set menu — all from the Philippines, all excellent',
    coord: { lat: 9.7848, lng: 126.1558 },
    highlight: false,
  },
  {
    name: 'Hapag',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Filipino · Comfort food',
    desc: 'Authentic Filipino home cooking at its best. Unpretentious, generous portions, deeply satisfying.',
    specialty: 'Crispy sisig & Bicol express — both must-orders',
    coord: { lat: 9.7855, lng: 126.1562 },
    highlight: false,
  },
  {
    name: 'Cev',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Ceviche · Seafood bar',
    desc: 'The island\'s best ceviche spot. Fresh catch, citrus-marinated, with creative flavor combinations. Perfect lunch spot.',
    specialty: 'General Luna ceviche — the best on the menu',
    coord: { lat: 9.7861, lng: 126.1570 },
    highlight: false,
  },
  {
    name: 'Amore',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Italian · Pizza',
    desc: 'Proper wood-fired pizza on a tropical island. The pastas and pizzas are both excellent — consistently good, great for groups.',
    specialty: 'Pizzas — thin crust, perfectly done',
    coord: { lat: 9.7868, lng: 126.1578 },
    highlight: false,
  },
  {
    name: 'Lamari Siargao',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Seafood · Filipino',
    desc: 'The vibe here is unmatched — right on the water, relaxed energy, and the kitchen delivers across the entire menu. Great for groups.',
    specialty: 'Everything is good — trust the daily specials',
    coord: { lat: 9.7875, lng: 126.1585 },
    highlight: false,
  },
  {
    name: 'Nami',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Japanese · Sushi',
    desc: 'Surprisingly excellent Japanese restaurant. Cozy Japanese-themed decor, attentive staff, and genuinely fresh ingredients. A must-visit for sushi lovers.',
    specialty: 'Bowls & sushi — both outstanding',
    coord: { lat: 9.7882, lng: 126.1592 },
    highlight: false,
  },
  {
    name: 'White Beard',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Café · Brunch · Bar',
    desc: 'The best spot for breakfast and brunch on the island. Relaxed vibe, great coffee, solid food. Also works well as a sundowner bar in the evenings.',
    specialty: 'Brunch — go for the morning sessions',
    coord: { lat: 9.7890, lng: 126.1598 },
    highlight: false,
  },
  {
    name: 'La Mesa',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Thai · Asian fusion',
    desc: 'Thai restaurant with very good execution. Consistent quality, generous portions, fair prices. A reliable choice for Asian food on the island.',
    specialty: 'Pad Thai & Thai basil stir-fried — both excellent',
    coord: { lat: 9.7898, lng: 126.1605 },
    highlight: false,
  },
  {
    name: 'Backside Burger',
    zone: 'Cloud 9',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Burgers · Casual',
    desc: 'Post-surf burgers right at the Cloud 9 boardwalk. The best burger on the island — full stop. Cold beer, great views of the break, surfer energy.',
    specialty: 'The burger — best on the island',
    coord: { lat: 9.8115, lng: 126.1740 },
    highlight: false,
  },
  {
    name: 'El Chapo',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Mexican · Tacos',
    desc: 'The island\'s go-to taco spot. Bold flavors, generous portions, cold drinks. Always packed at dinner — arrive early or wait.',
    specialty: 'Tacos — very good, especially fish tacos',
    coord: { lat: 9.7905, lng: 126.1612 },
    highlight: false,
  },
  {
    name: 'Las Barricas',
    zone: 'General Luna',
    price: '₱₱',
    priceLevel: 2,
    cuisine: 'Bar · Spanish vibes',
    desc: 'The evening spot. Live music, great ambiance, sangria, and tapas. Las Barricas comes alive at night — one of the best places on the island for a night out.',
    specialty: 'Evening drinks + live music — the full experience',
    coord: { lat: 9.7912, lng: 126.1618 },
    highlight: false,
  },
  {
    name: 'CFC Siargao',
    zone: 'General Luna',
    price: '₱',
    priceLevel: 1,
    cuisine: 'Fried Chicken · Local',
    desc: 'The budget institution of Siargao. Crispy, cheap, and deeply satisfying. Conveniently located next to Mad Monkey Catangnan. Best value on the island.',
    specialty: 'Chicken combo — unbeatable for the price',
    coord: { lat: 9.7778, lng: 126.1455 },
    highlight: false,
  },
];

const MONTHS = [
  { m:'Jan', w:'☀️', crowd:'High',     price:3100, stars:4 },
  { m:'Feb', w:'☀️', crowd:'Medium',   price:2650, stars:5 },
  { m:'Mar', w:'☀️', crowd:'Medium',   price:2450, stars:5 },
  { m:'Apr', w:'☀️', crowd:'Low',      price:2200, stars:4 },
  { m:'May', w:'🌤', crowd:'Low',      price:1990, stars:3 },
  { m:'Jun', w:'🌧', crowd:'Low',      price:1850, stars:2 },
  { m:'Jul', w:'🌧', crowd:'Low',      price:1780, stars:2 },
  { m:'Aug', w:'🌧', crowd:'Low',      price:1820, stars:2 },
  { m:'Sep', w:'⛈', crowd:'Very low', price:1750, stars:1 },
  { m:'Oct', w:'🌊', crowd:'High',     price:3400, stars:5 },
  { m:'Nov', w:'🌊', crowd:'Medium',   price:2800, stars:4 },
  { m:'Dec', w:'☀️', crowd:'Very high',price:4100, stars:3 },
];

const BUDGETS = [
  { emoji:'🎒', tier:'Backpacker', range:'₱1,500–2,500/day', items:['Flights from ₱1,780 (best deal)','Hostel dorm ₱400–700/night','CFC or local carinderia ₱150–250/meal','Motorbike rental ₱400–600/day','Island hopping shared tour ₱800'] },
  { emoji:'🏄', tier:'Mid-range', range:'₱3,000–6,000/day', items:['Flights from ₱1,990','Guesthouse or surf resort ₱1,500–3,000/night','Hapag, Cev, or Amore ₱400–800/meal','Surf lessons ₱600–1,200','Private island hopping ₱2,500'] },
  { emoji:'🌴', tier:'Comfort', range:'₱8,000+/day', items:['Flights RT from ₱3,800','Boutique resort ₱4,000–10,000/night','Alma, Ferns, or Roots ₱1,000–2,000/meal','Private speedboat tour ₱5,000+','Yoga retreat or spa'] },
];

const TIPS = [
  { icon:'🔔', text:'Set a price alert — Siargao deals drop fast and disappear in hours' },
  { icon:'✈️', text:'Book Sunlight Air at least 3 weeks ahead — the most popular carrier, fills fast' },
  { icon:'🌊', text:'October = surf competition month. Book 2–3 months early, prices spike to ₱3,400+' },
  { icon:'🛵', text:'Rent a motorbike on the island — essential for exploring beyond General Luna (₱400–600/day)' },
  { icon:'🌙', text:'Go to Sugba Lagoon first thing in the morning — by noon it gets crowded' },
  { icon:'📅', text:'Low season (Jun–Aug) has flights from ₱1,750 but expect afternoon rain' },
  { icon:'💸', text:'Roundtrip is usually cheaper than two one-ways. Always check both directions' },
  { icon:'🧭', text:'Hire a local guide for Beto Cold Spring and North Siargao — roads are unmarked' },
  { icon:'🌿', text:'Maasin River is best at high tide — check local tide charts before going' },
];

function getMonthBg(stars: number) {
  if (stars === 5) return { bg: '#E8F5E9', border: '#A5D6A7' };
  if (stars === 4) return { bg: 'var(--seafoam)', border: 'var(--border)' };
  if (stars === 3) return { bg: 'var(--golden-light)', border: 'rgba(232,180,74,0.4)' };
  if (stars === 2) return { bg: '#F5F5F5', border: '#E0E0E0' };
  return { bg: 'var(--coral-light)', border: 'rgba(224,78,56,0.3)' };
}

function formatPrice(p: number) {
  return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const PRICE_COLORS: Record<number, { bg: string, color: string, label: string }> = {
  1: { bg: '#E8F5E9', color: '#2E7D32', label: 'Budget' },
  2: { bg: 'var(--seafoam)', color: 'var(--lagoon)', label: 'Mid-range' },
  3: { bg: 'var(--golden-light)', color: '#7A5A00', label: 'Upscale' },
};

// ============================================================
// COMPOSANT MAP
// ============================================================

declare global {
  interface Window { google: any; initMap: () => void; }
}

function SiargaoMap({ filter }: { filter: number | 'all' }) {
  useEffect(() => {
    const initMap = () => {
      if (!window.google) return;

      const map = new window.google.maps.Map(
        document.getElementById('siargao-map'),
        {
          center: { lat: 9.7870, lng: 126.1550 },
          zoom: 13,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
            { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }
      );

      const service = new window.google.maps.places.PlacesService(map);

      // --- COUCHE 1 : ATTRACTIONS (marqueurs épingle) ---
      ATTRACTIONS.forEach(attraction => {
        service.findPlaceFromQuery(
          {
            query: attraction.query,
            fields: ['geometry', 'name'],
          },
          (results: any[], status: string) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              results?.[0]?.geometry?.location
            ) {
              const marker = new window.google.maps.Marker({
                position: results[0].geometry.location,
                map,
                title: attraction.name,
                icon: {
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                  fillColor: attraction.color,
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 1.5,
                  scale: 1.6,
                  anchor: new window.google.maps.Point(12, 22),
                },
              });

              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="font-family:Syne,sans-serif;padding:8px;min-width:160px">
                    <p style="font-weight:800;font-size:14px;margin:0 0 4px;color:#071315">
                      📍 ${attraction.name}
                    </p>
                    <p style="font-size:12px;color:${attraction.color};margin:0;font-weight:600;text-transform:uppercase;letter-spacing:1px">
                      ${attraction.type}
                    </p>
                  </div>
                `,
              });

              marker.addListener('click', () => infoWindow.open(map, marker));
            }
          }
        );
      });

      // --- COUCHE 2 : RESTAURANTS (marqueurs cercle) ---
      const visible = filter === 'all'
        ? RESTAURANTS
        : RESTAURANTS.filter(r => r.priceLevel === filter);

      visible.forEach(restaurant => {
        const pc = PRICE_COLORS[restaurant.priceLevel];

        service.findPlaceFromQuery(
          {
            query: `${restaurant.name} General Luna Siargao Philippines`,
            fields: ['geometry', 'name'],
          },
          (results: any[], status: string) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              results?.[0]?.geometry?.location
            ) {
              const marker = new window.google.maps.Marker({
                position: results[0].geometry.location,
                map,
                title: restaurant.name,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: restaurant.highlight ? 11 : 8,
                  fillColor: restaurant.highlight ? '#E8B44A' : pc.color,
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 2,
                },
              });

              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="font-family:Syne,sans-serif;padding:8px;min-width:180px">
                    <p style="font-weight:800;font-size:14px;margin:0 0 4px;color:#071315">
                      ${restaurant.name}${restaurant.highlight ? ' ⭐' : ''}
                    </p>
                    <p style="font-size:12px;color:#4A9080;margin:0 0 4px">${restaurant.cuisine}</p>
                    <p style="font-size:13px;font-weight:800;color:${pc.color};margin:0 0 6px">${restaurant.price}</p>
                    <p style="font-size:12px;color:#071315;margin:0;font-style:italic">${restaurant.specialty}</p>
                  </div>
                `,
              });

              marker.addListener('click', () => infoWindow.open(map, marker));
            }
          }
        );
      });
    };

    if (window.google?.maps?.places) {
      initMap();
    } else {
      window.initMap = initMap;
    }
  }, [filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        id="siargao-map"
        style={{
          width: '100%',
          height: 480,
          borderRadius: 12,
          border: '1px solid var(--border)',
        }}
      />
      {/* Légende */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '8px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>📍</span>
          <span style={{ fontFamily: 'Syne', fontSize: 12, color: 'var(--lagoon-muted)' }}>Attractions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--lagoon)', border: '2px solid white', boxShadow: '0 0 0 1px var(--lagoon)' }} />
          <span style={{ fontFamily: 'Syne', fontSize: 12, color: 'var(--lagoon-muted)' }}>Restaurants</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#E8B44A', border: '2px solid white', boxShadow: '0 0 0 1px #E8B44A' }} />
          <span style={{ fontFamily: 'Syne', fontSize: 12, color: 'var(--lagoon-muted)' }}>⭐ SAGAS team favorite</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mapFilter, setMapFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    const handleScroll = () => {
      const offsets = TABS.map(tab => {
        const el = document.getElementById(tab.id);
        if (!el) return { id: tab.id, top: Infinity };
        return { id: tab.id, top: Math.abs(el.getBoundingClientRect().top - 140) };
      });
      const closest = offsets.reduce((a, b) => a.top < b.top ? a : b);
      setActiveTab(closest.id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&callback=initMap`}
        strategy="lazyOnload"
      />

      {/* HEADER */}
      <div style={{ background: 'var(--nightsurf)', padding: '56px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12, letterSpacing: 1 }}>
            BY THE SAGAS TEAM · LOCAL EXPERTS · UPDATED 2025
          </p>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 52, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
            The Complete Guide<br />to Siargao
          </h1>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Everything you need to know to get there, get around,<br />and fall in love with the island.
          </p>
        </div>
      </div>

      {/* STICKY TABS */}
      <nav style={{ position: 'sticky', top: 64, background: 'var(--nightsurf)', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 40, overflowX: 'auto' }}>
        <div style={{ display: 'flex', padding: '0 40px', minWidth: 'max-content' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => scrollTo(tab.id)} style={{
              background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid white' : '2px solid transparent',
              color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.5)',
              fontFamily: 'Syne', fontWeight: activeTab === tab.id ? 600 : 400, fontSize: 13,
              padding: '16px 20px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ background: 'var(--seafoam)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 40px' }}>

          {/* OVERVIEW */}
          <section id="overview" style={{ paddingTop: 56, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 20 }}>Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { label: 'Location', value: 'Surigao del Norte, Philippines' },
                { label: 'Airport', value: 'Sayak Airport (IAO)' },
                { label: 'Best known for', value: 'Cloud 9, surf, island life' },
                { label: 'Best months', value: 'February–April, October' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
                  <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: 'var(--nightsurf)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HOW TO GET THERE */}
          <section id="how-to-get-there" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>How to get there</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>All routes to Siargao explained.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  from: 'From Cebu',
                  best: 'Sunlight Air direct — 55 min — from ₱1,850',
                  alt: 'Up to 5 daily departures. The easiest and cheapest gateway.',
                  tip: 'Book at least 3 weeks ahead. Morning flights are usually cheapest.',
                  code: 'CEB'
                },
                {
                  from: 'From Clark (Angeles City)',
                  best: 'Sunlight Air direct — 2h 30min — from ₱4,300',
                  alt: 'Clark is 2h from Manila by P2P bus (₱250). Perfect for travelers from Luzon.',
                  tip: 'Much less stressful than flying via NAIA. Take the P2P bus from Cubao or Pasay to Clark.',
                  code: 'CRK'
                },
                {
                  from: 'From Manila (NAIA)',
                  best: 'Take P2P bus to Clark (2h) → Sunlight Air direct to Siargao (2h30)',
                  alt: 'Sunlight Air no longer operates from NAIA. Clark is now the Luzon gateway.',
                  tip: 'Total journey ~5h but stress-free. Buses every hour from Cubao & Pasay.',
                  code: 'CRK'
                },
              ].map((r, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 17, color: 'var(--nightsurf)', marginBottom: 8 }}>{r.from}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, color: 'var(--lagoon)', marginBottom: 4 }}>✅ {r.best}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', marginBottom: 12 }}>{r.alt}</p>
                  <div style={{ background: 'var(--seafoam)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon)' }}>💡 SAGAS tip: {r.tip}</p>
                  </div>
                  <Link href={`/flights?from=${r.code}`} style={{ background: 'var(--lagoon)', color: 'white', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne', fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Search {r.from.replace('From ', '')}→IAO <ChevronRight size={14}/>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* BEST TIME */}
          <section id="best-time" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Best time to go</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>Price and weather guide by month.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              {MONTHS.map((mo, i) => {
                const { bg, border } = getMonthBg(mo.stars);
                return (
                  <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--nightsurf)' }}>{mo.m}</p>
                      <span style={{ fontSize: 16 }}>{mo.w}</span>
                    </div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--lagoon)', marginBottom: 2 }}>₱{formatPrice(mo.price)}</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)' }}>{mo.crowd} crowds</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>{'⭐'.repeat(mo.stars)}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ background: 'var(--golden-light)', border: '1px solid rgba(232,180,74,0.4)', borderRadius: 12, padding: '18px 22px' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: '#7A5A00', lineHeight: 1.6 }}>
                💡 <strong>Best time:</strong> February to April. Reliably dry, fewer crowds, flights from ₱1,990 — 35–45% cheaper than December peak.
              </p>
            </div>
          </section>

          {/* ISLAND ZONES */}
          <section id="island-zones" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Island zones</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>7 distinct areas — each with its own vibe.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {ZONES.map((z, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  <img src={z.img} alt={z.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                      <div style={{ width: 34, height: 34, background: z.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <z.icon size={16} color={z.iconColor} />
                      </div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 17, color: 'var(--nightsurf)' }}>{z.name}</p>
                      <span style={{ background: z.tagBg, color: z.tagColor, borderRadius: 20, padding: '4px 10px', fontFamily: 'Syne', fontWeight: 600, fontSize: 11 }}>{z.tag}</span>
                    </div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', lineHeight: 1.7, marginBottom: 10 }}>{z.desc}</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon)', fontStyle: 'italic', marginBottom: 6 }}>"{z.vibe}"</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 11, color: 'var(--lagoon-muted)' }}>📅 Best for: {z.best}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RESTAURANTS */}
          <section id="restaurants" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Restaurants</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>15 restaurants picked by the SAGAS team — locals who actually eat here.</p>

            {/* MAP */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: 'var(--lagoon-muted)', alignSelf: 'center', marginRight: 4 }}>Filter map:</p>
                {([['all', 'All restaurants'], [1, '₱ Budget'], [2, '₱₱ Mid-range'], [3, '₱₱₱ Upscale']] as const).map(([v, l]) => (
                  <button key={String(v)} onClick={() => setMapFilter(v)} style={{
                    background: mapFilter === v ? 'var(--lagoon)' : 'white',
                    color: mapFilter === v ? 'white' : 'var(--lagoon-muted)',
                    border: `1px solid ${mapFilter === v ? 'var(--lagoon)' : 'var(--border)'}`,
                    borderRadius: 20, padding: '6px 16px',
                    fontFamily: 'Syne', fontWeight: mapFilter === v ? 600 : 400, fontSize: 12,
                    cursor: 'pointer',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
              <SiargaoMap filter={mapFilter} />
              <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', marginTop: 8 }}>
                ⭐ Gold dot = SAGAS team favorite · Click any marker for details
              </p>
            </div>

            {/* RESTAURANT LIST */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {RESTAURANTS.map((r, i) => {
                const pc = PRICE_COLORS[r.priceLevel];
                return (
                  <div key={i} style={{
                    background: 'white',
                    border: r.highlight ? '2px solid var(--golden)' : '1px solid var(--border)',
                    borderRadius: 12, padding: 20,
                    position: 'relative',
                  }}>
                    {r.highlight && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--golden)', color: 'white', borderRadius: 20, padding: '3px 10px', fontFamily: 'Syne', fontWeight: 800, fontSize: 10 }}>
                        ⭐ TEAM FAV
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <MapPin size={14} color="var(--lagoon-muted)" />
                      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)' }}>{r.zone}</p>
                    </div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)', marginBottom: 4 }}>{r.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ background: pc.bg, color: pc.color, borderRadius: 20, padding: '3px 10px', fontFamily: 'Syne', fontWeight: 800, fontSize: 12 }}>{r.price}</span>
                      <span style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)' }}>{r.cuisine}</span>
                    </div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', lineHeight: 1.6, marginBottom: 8 }}>{r.desc}</p>
                    {r.specialty && (
                      <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: 'var(--lagoon)' }}>🍽 Must order: {r.specialty}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* BUDGET */}
          <section id="budget" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Budget guide</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>What to expect at every budget level.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {BUDGETS.map((b, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>{b.emoji}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)', marginBottom: 4 }}>{b.tier}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--lagoon)', marginBottom: 16 }}>{b.range}</p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {b.items.map((item, j) => (
                      <li key={j} style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', display: 'flex', gap: 8 }}>
                        <span style={{ color: 'var(--lagoon)', fontWeight: 800 }}>·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* TIPS */}
          <section id="tips" style={{ paddingTop: 8, paddingBottom: 56, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Tips & tricks</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>Insider knowledge from people who actually live here.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
              {TIPS.map((tip, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
                  <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', lineHeight: 1.6 }}>{tip.text}</p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ background: 'var(--lagoon)', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 20 }}>
                Ready to book your flight to Siargao?
              </p>
              <Link href="/flights" style={{ background: 'var(--coral)', color: 'white', borderRadius: 10, padding: '16px 36px', fontFamily: 'Syne', fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                Search flights now →
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
