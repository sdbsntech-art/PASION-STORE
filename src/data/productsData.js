/**
 * Passion Store Initial Product Catalog
 * Categories: car, motorcycle
 * Types: sale (Achat), rent (Location)
 */

export const INITIAL_PRODUCTS = [
  // CATEGORY: CARS (SALE & RENT)
  {
    id: "tesla-model-s-plaid",
    name: "Tesla Model S Plaid",
    category: "car",
    type: "sale",
    isPromo: true,
    originalPrice: 119990,
    price: 109990,
    rating: 4.9,
    inStock: true,
    specs: {
      "Puissance": "1020 ch (Tri-Motor)",
      "0-100 km/h": "2.1 s",
      "Autonomie": "600 km (WLTP)",
      "Vitesse Max": "322 km/h",
      "Transmission": "Intégrale (AWD)",
      "Année": "2024",
      "Énergie": "Électrique"
    },
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "porsche-911-gt3-rs",
    name: "Porsche 911 GT3 RS",
    category: "car",
    type: "sale",
    isPromo: false,
    originalPrice: 0,
    price: 248500,
    rating: 5.0,
    inStock: true,
    specs: {
      "Moteur": "Flat-6 atmosphérique 4.0L",
      "Puissance": "525 ch",
      "0-100 km/h": "3.2 s",
      "Transmission": "Propulsion (RWD) - PDK 7 rapports",
      "Année": "2024",
      "Poids": "1450 kg",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bmw-m4-competition",
    name: "BMW M4 Competition",
    category: "car",
    type: "sale",
    isPromo: true,
    originalPrice: 112000,
    price: 105600,
    rating: 4.7,
    inStock: true,
    specs: {
      "Moteur": "6 cylindres en ligne biturbo 3.0L",
      "Puissance": "510 ch",
      "0-100 km/h": "3.9 s",
      "Transmission": "Propulsion (RWD)",
      "Année": "2023",
      "Boîte": "M Steptronic 8 rapports",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "range-rover-sport-sv",
    name: "Range Rover Sport SV",
    category: "car",
    type: "sale",
    isPromo: false,
    originalPrice: 0,
    price: 210000,
    rating: 4.8,
    inStock: false,
    specs: {
      "Moteur": "V8 biturbo 4.4L avec micro-hybridation",
      "Puissance": "635 ch",
      "0-100 km/h": "3.8 s",
      "Transmission": "Intégrale (AWD)",
      "Année": "2024",
      "Suspension": "6D Dynamics active",
      "Énergie": "Hybride Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mercedes-amg-gt-coupe",
    name: "Mercedes-AMG GT Coupé",
    category: "car",
    type: "sale",
    isPromo: false,
    originalPrice: 0,
    price: 195400,
    rating: 4.8,
    inStock: true,
    specs: {
      "Moteur": "V8 biturbo 4.0L AMG",
      "Puissance": "585 ch",
      "0-100 km/h": "3.2 s",
      "Transmission": "Intégrale active 4MATIC+",
      "Année": "2024",
      "Boîte": "AMG SPEEDSHIFT MCT 9G",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "porsche-panamera-rent",
    name: "Porsche Panamera Turbo E-Hybrid",
    category: "car",
    type: "rent",
    isPromo: false,
    originalPrice: 0,
    price: 750,
    rating: 4.9,
    inStock: true,
    specs: {
      "Moteur": "V8 Twin-Turbo 4.0L Hybride",
      "Puissance": "680 ch",
      "0-100 km/h": "3.2 s",
      "Transmission": "Intégrale (AWD)",
      "Année": "2024",
      "Tarif": "Par jour de location",
      "Énergie": "Hybride Rechargeable"
    },
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "tesla-model-y-rent",
    name: "Tesla Model Y Performance",
    category: "car",
    type: "rent",
    isPromo: true,
    originalPrice: 250,
    price: 190,
    rating: 4.6,
    inStock: true,
    specs: {
      "Autonomie": "514 km (WLTP)",
      "Puissance": "534 ch",
      "0-100 km/h": "3.7 s",
      "Transmission": "Intégrale (AWD)",
      "Année": "2023",
      "Tarif": "Par jour de location",
      "Énergie": "Électrique"
    },
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80"
  },

  // CATEGORY: MOTORCYCLES
  {
    id: "ducati-panigale-v4-r",
    name: "Ducati Panigale V4 R",
    category: "motorcycle",
    type: "sale",
    isPromo: true,
    originalPrice: 46990,
    price: 43990,
    rating: 4.9,
    inStock: true,
    specs: {
      "Moteur": "Desmosedici Stradale V4 à 90° de 998 cc",
      "Puissance": "218 ch à 15 500 tr/min",
      "Poids": "172 kg à sec",
      "Vitesse Max": "+300 km/h",
      "Année": "2024",
      "Électronique": "ABS Cornering EVO, DTC EVO 3",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "harley-davidson-fat-boy",
    name: "Harley-Davidson Fat Boy 114",
    category: "motorcycle",
    type: "sale",
    isPromo: false,
    originalPrice: 0,
    price: 27900,
    rating: 4.6,
    inStock: true,
    specs: {
      "Moteur": "Bicylindre en V Milwaukee-Eight 114 (1868 cc)",
      "Couple": "155 Nm à 3250 tr/min",
      "Poids": "317 kg",
      "Selle": "675 mm de hauteur",
      "Année": "2023",
      "Réservoir": "18.9 L",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "yamaha-yzf-r1m",
    name: "Yamaha YZF-R1M",
    category: "motorcycle",
    type: "sale",
    isPromo: false,
    originalPrice: 0,
    price: 27999,
    rating: 4.8,
    inStock: true,
    specs: {
      "Moteur": "4 cylindres crossplane (CP4) de 998 cc",
      "Puissance": "200 ch à 13 500 tr/min",
      "Poids": "202 kg avec pleins",
      "Suspensions": "Öhlins Electronic Racing Suspension",
      "Année": "2024",
      "Carrosserie": "Fibre de Carbone complète",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "vespa-gts-supertech-300",
    name: "Vespa GTS SuperTech 300",
    category: "motorcycle",
    type: "sale",
    isPromo: false,
    originalPrice: 0,
    price: 7999,
    rating: 4.5,
    inStock: true,
    specs: {
      "Moteur": "Monocylindre 4 temps HPE de 278 cc",
      "Puissance": "23.8 ch",
      "Couple": "26 Nm à 5250 tr/min",
      "Écran": "TFT couleur 4.3\" avec Vespa MIA",
      "Année": "2024",
      "Freinage": "ABS double canal et ASR",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bmw-gs-rent",
    name: "BMW R 1250 GS Adventure",
    category: "motorcycle",
    type: "rent",
    isPromo: false,
    originalPrice: 0,
    price: 150,
    rating: 4.7,
    inStock: true,
    specs: {
      "Moteur": "Bicylindre Boxer de 1254 cc",
      "Puissance": "136 ch",
      "Poids": "249 kg",
      "Type": "Trail Adventure",
      "Année": "2023",
      "Tarif": "Par jour de location",
      "Énergie": "Essence"
    },
    imageUrl: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80"
  }
];

// Helper to get products from LocalStorage or initialize with defaults
export const getStoredProducts = () => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  
  const stored = localStorage.getItem('passion_store_products');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Verify if stored catalogue contains modern keys (type, isPromo). Rebuild if not.
      const needsMigration = parsed.some(p => p.type === undefined || p.isPromo === undefined);
      if (needsMigration) {
        localStorage.setItem('passion_store_products', JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse stored products", e);
      return INITIAL_PRODUCTS;
    }
  } else {
    localStorage.setItem('passion_store_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
};

// Helper to save products to LocalStorage
export const saveProducts = (products) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('passion_store_products', JSON.stringify(products));
};
