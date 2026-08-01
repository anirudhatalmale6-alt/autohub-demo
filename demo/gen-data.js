// Generates a realistic car inventory dataset for the demo.
const fs = require('fs');

const MAKES = {
  BMW: ['3 Series', '5 Series', 'X3', 'X5', '1 Series'],
  Audi: ['A3', 'A4', 'A6', 'Q5', 'Q7'],
  Mercedes: ['A-Class', 'C-Class', 'E-Class', 'GLC', 'GLA'],
  Volkswagen: ['Golf', 'Passat', 'Polo', 'Tiguan', 'T-Roc'],
  Toyota: ['Corolla', 'Yaris', 'RAV4', 'C-HR', 'Camry'],
  Volvo: ['XC40', 'XC60', 'V60', 'V90', 'S60'],
  Tesla: ['Model 3', 'Model Y', 'Model S'],
  Ford: ['Focus', 'Fiesta', 'Kuga', 'Puma', 'Mondeo'],
};
const FUELS = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const GEARBOX = ['Automatic', 'Manual'];
const BODIES = ['Sedan', 'SUV', 'Hatchback', 'Estate', 'Coupe'];
const COLORS = ['Black', 'White', 'Grey', 'Blue', 'Silver', 'Red'];
const FEATURES = ['Navigation', 'Leather seats', 'Panoramic roof', 'Adaptive cruise', 'Heated seats',
  'Apple CarPlay', 'Parking sensors', 'LED headlights', '360 camera', 'Keyless entry', 'Lane assist'];

// Curated Unsplash car photos (multiple angles) for carousels.
const PHOTO_SETS = [
  ['photo-1555215695-3004980ad54e','photo-1552519507-da3b142c6e3d','photo-1503376780353-7e6692767b70'],
  ['photo-1503736334956-4c8f8e92946d','photo-1541899481282-d53bffe3c35d','photo-1494976388531-d1058494cdd8'],
  ['photo-1533473359331-0135ef1b58bf','photo-1544636331-e26879cd4d9b','photo-1502877338535-766e1452684a'],
  ['photo-1580273916550-e323be2ae537','photo-1542362567-b07e54358753','photo-1552519507-da3b142c6e3d'],
  ['photo-1553440569-bcc63803a83d','photo-1493238792000-8113da705763','photo-1555215695-3004980ad54e'],
  ['photo-1568605117036-5fe5e7bab0b7','photo-1552519507-da3b142c6e3d','photo-1503736334956-4c8f8e92946d'],
];

function pick(a, i) { return a[i % a.length]; }
function rnd(seed) { // deterministic pseudo-random
  let x = Math.sin(seed) * 10000; return x - Math.floor(x);
}

const cars = [];
let id = 1;
const makes = Object.keys(MAKES);
for (let i = 0; i < 240; i++) {
  const make = pick(makes, i);
  const models = MAKES[make];
  const model = pick(models, Math.floor(rnd(i * 3.1) * models.length));
  const year = 2015 + Math.floor(rnd(i * 1.7) * 10); // 2015-2024
  const fuel = pick(FUELS, Math.floor(rnd(i * 2.3) * FUELS.length));
  const mileage = 5000 + Math.floor((rnd(i * 5.9) * 175000) / 500) * 500;
  const basePrice = fuel === 'Electric' ? 32000 : 12000;
  const price = Math.round((basePrice + (year - 2015) * 2200 + rnd(i * 7.7) * 28000) / 100) * 100;
  const body = pick(BODIES, Math.floor(rnd(i * 4.2) * BODIES.length));
  const gearbox = fuel === 'Electric' ? 'Automatic' : pick(GEARBOX, Math.floor(rnd(i * 8.1) * 2));
  const color = pick(COLORS, Math.floor(rnd(i * 9.3) * COLORS.length));
  const power = 90 + Math.floor(rnd(i * 6.6) * 250);
  const photos = PHOTO_SETS[i % PHOTO_SETS.length].map(
    p => `https://images.unsplash.com/${p}?auto=format&fit=crop&w=640&q=70`
  );
  // pick 4-6 features
  const feats = [];
  for (let f = 0; f < FEATURES.length; f++) {
    if (rnd(i * 100 + f) > 0.55) feats.push(FEATURES[f]);
  }
  cars.push({
    id: id++, make, model, year, fuel, mileage, price, body, gearbox, color, power,
    features: feats.slice(0, 6),
    photos,
    location: pick(['Amsterdam','Rotterdam','Utrecht','Eindhoven','The Hague','Groningen'], i),
    doors: pick([3,5,5,4], i),
    seats: body === 'SUV' ? 5 : pick([5,5,4,2], i),
  });
}

fs.writeFileSync(__dirname + '/cars.json', JSON.stringify(cars, null, 0));
console.log('Wrote', cars.length, 'cars');
