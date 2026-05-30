/**
 * Passion Store Initial Product Catalog
 * Categories: machine, watch, tablet, tv, book
 */

export const INITIAL_PRODUCTS = [
  // CATEGORY: MACHINES
  {
    id: "macbook-pro-m3-max",
    name: "MacBook Pro 16\" M3 Max",
    category: "machine",
    brand: "Apple",
    model: "M3 Max (Late 2023)",
    description: "La machine de travail ultime pour les professionnels de la tech, du montage vidéo et du développement de pointe.",
    price: 3999,
    rating: 4.9,
    inStock: true,
    specs: {
      "Processeur": "Apple M3 Max (CPU 16 cœurs, GPU 40 cœurs)",
      "Mémoire RAM": "64 Go de mémoire unifiée",
      "Stockage": "2 To SSD ultra-rapide",
      "Écran": "16.2\" Liquid Retina XDR (3024 x 1964), 120Hz ProMotion",
      "Autonomie": "Jusqu'à 22 heures d'autonomie",
      "Ports": "3x Thunderbolt 4, 1x HDMI, 1x Lecteur SDXC, MagSafe 3"
    },
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "asus-rog-zephyrus-g14",
    name: "ASUS ROG Zephyrus G14",
    category: "machine",
    brand: "ASUS",
    model: "GA403 (2024)",
    description: "Le summum du PC portable gamer compact et surpuissant, équipé d'un écran OLED magnifique.",
    price: 2499,
    rating: 4.7,
    inStock: true,
    specs: {
      "Processeur": "AMD Ryzen 9 8945HS (8 cœurs, jusqu'à 5.2 GHz)",
      "Carte Graphique": "NVIDIA GeForce RTX 4070 (8 Go GDDR6)",
      "Mémoire RAM": "32 Go LPDDR5X",
      "Stockage": "1 To SSD NVMe PCIe 4.0",
      "Écran": "14\" ROG Nebula OLED QHD+ (2880 x 1800), 120Hz, HDR",
      "Châssis": "Aluminium CNC premium, 1.5 kg seulement"
    },
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "dell-xps-15-9530",
    name: "Dell XPS 15 9530",
    category: "machine",
    brand: "Dell",
    model: "XPS 9530",
    description: "Une élégance inégalée alliée à des performances redoutables pour le développement de logiciels et les créatifs.",
    price: 2199,
    rating: 4.6,
    inStock: true,
    specs: {
      "Processeur": "Intel Core i9-13900H (14 cœurs, jusqu'à 5.4 GHz)",
      "Carte Graphique": "NVIDIA GeForce RTX 4060 (8 Go GDDR6)",
      "Mémoire RAM": "32 Go DDR5 Dual-Channel",
      "Stockage": "1 To SSD M.2 PCIe NVMe",
      "Écran": "15.6\" OLED 3.5K (3456 x 2160) Tactile, InfinityEdge",
      "Matériaux": "Châssis en aluminium usiné et repose-poignets en fibre de carbone"
    },
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "supermicro-rack-server",
    name: "Serveur Rack Supermicro SuperServer 2U",
    category: "machine",
    brand: "Supermicro",
    model: "SYS-221BT-DNTR",
    description: "Serveur d'entreprise haut de gamme à double nœud, parfait pour la virtualisation, le Big Data et le cloud privé.",
    price: 8500,
    rating: 4.8,
    inStock: false,
    specs: {
      "Processeur": "Dual Intel Xeon Scalable de 4ème génération par nœud",
      "Mémoire RAM": "Supporte jusqu'à 4 To DDR5 ECC LRDIMM par nœud",
      "Baies Disques": "12 baies 2.5\" NVMe/SAS3/SATA3 remplaçables à chaud",
      "Alimentation": "Double alimentation redondante de 1600W Titanium",
      "Réseau": "Double port 10G Base-T intégré",
      "Gestion": "IPMI 2.0 dédié avec support KVM sur IP virtuel"
    },
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  },

  // CATEGORY: WATCHES
  {
    id: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    category: "watch",
    brand: "Apple",
    model: "Ultra 2 Titanium",
    description: "La montre connectée multisport la plus robuste et la plus performante, taillée pour l'aventure et l'endurance.",
    price: 899,
    rating: 4.8,
    inStock: true,
    specs: {
      "Boîtier": "Titane aéronautique de 49 mm, étanche jusqu'à 100m",
      "Écran": "Retina OLED Always-On de 3000 nits, verre saphir",
      "Autonomie": "Jusqu'à 36h en usage normal, 72h en mode économie",
      "GPS": "GPS double fréquence haute précision (L1 + L5)",
      "Capteurs": "Électrocardiogramme, Capteur de température, Oxygène sanguin",
      "Sirène": "Sirène intégrée de 86 décibels (portée de 180 mètres)"
    },
    imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "garmin-fenix-7x-pro",
    name: "Garmin Fenix 7X Pro Solar",
    category: "watch",
    brand: "Garmin",
    model: "Fenix 7X Pro",
    description: "Montre GPS multisport haut de gamme avec écran à recharge solaire et lampe torche à LED intégrée.",
    price: 749,
    rating: 4.9,
    inStock: true,
    specs: {
      "Verre": "Power Sapphire™ à recharge solaire",
      "Autonomie": "Jusqu'à 37 jours en mode montre connectée (solaire)",
      "Cartographie": "Cartes TopoActive préchargées avec navigation virage par virage",
      "Lampes": "Lampe torche LED blanche et rouge intégrée au boîtier",
      "Fonctions Pro": "Score de montée, Score d'endurance, Capteur cardiaque Gen 5",
      "Matériaux": "Lunette en titane et fond de boîtier en acier renforcé"
    },
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
  },

  // CATEGORY: TABLETS
  {
    id: "ipad-pro-m4",
    name: "iPad Pro 13\" (M4)",
    category: "tablet",
    brand: "Apple",
    model: "M4 (2024)",
    description: "L'appareil le plus fin jamais créé par Apple, combinant le processeur M4 révolutionnaire avec un écran Tandem OLED.",
    price: 1219,
    rating: 4.8,
    inStock: true,
    specs: {
      "Processeur": "Apple M4 (CPU 9 cœurs, GPU 10 cœurs avec Ray Tracing)",
      "Écran": "13\" Ultra Retina XDR Tandem OLED, 1600 nits de luminosité max",
      "Épaisseur": "Seulement 5.1 mm",
      "Mémoire RAM": "8 Go de RAM",
      "Stockage": "256 Go de stockage flash ultra-rapide",
      "Accessoires": "Compatible avec Apple Pencil Pro et Magic Keyboard (2024)"
    },
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "samsung-tab-s9-ultra",
    name: "Samsung Galaxy Tab S9 Ultra",
    category: "tablet",
    brand: "Samsung",
    model: "SM-X910",
    description: "Une tablette géante haut de gamme idéale pour le multitâche, le dessin professionnel et le divertissement immersif.",
    price: 1049,
    rating: 4.7,
    inStock: true,
    specs: {
      "Processeur": "Qualcomm Snapdragon 8 Gen 2 pour Galaxy",
      "Écran": "14.6\" Dynamic AMOLED 2X, 120Hz, HDR10+",
      "Stylet": "S Pen inclus dans la boîte, ultra-réactif (latence 2.8ms)",
      "Protection": "Résistance à l'eau et à la poussière certifiée IP68 (tablette et stylet)",
      "Mémoire RAM": "12 Go de RAM",
      "Autonomie": "Batterie massive de 11 200 mAh, charge rapide 45W"
    },
    imageUrl: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80"
  },

  // CATEGORY: TELEVISIONS
  {
    id: "lg-oled-c3-65",
    name: "LG OLED EVO C3 65\"",
    category: "tv",
    brand: "LG",
    model: "OLED65C3 (2023)",
    description: "La référence absolue pour le cinéma à la maison et le jeu vidéo de salon sur console Next-Gen.",
    price: 1899,
    rating: 4.8,
    inStock: true,
    specs: {
      "Dalle": "OLED Evo 4K (3840 x 2160) avec pixels auto-émissifs",
      "Processeur": "α9 AI Processor 4K Gen6 avec AI Picture Pro",
      "Gaming": "4 entrées HDMI 2.1, supporte 4K 120Hz, G-Sync, FreeSync Premium",
      "Audio": "Système sonore virtuel 9.1.2 canaux Dolby Atmos intégré",
      "HDR": "Dolby Vision, HDR10, HLG et Mode Filmmaker",
      "Système": "webOS 23 avec télécommande Magic Remote vocale"
    },
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "samsung-neo-qled-8k",
    name: "Samsung Neo QLED 8K 75\"",
    category: "tv",
    brand: "Samsung",
    model: "QN900C",
    description: "Une immersion visuelle totale grâce à la définition 8K époustouflante et une luminosité Quantum Mini LED incroyable.",
    price: 4499,
    rating: 4.9,
    inStock: true,
    specs: {
      "Définition": "Real 8K (7680 x 4320)",
      "Technologie": "Quantum Matrix Technology Pro (Mini LED haute densité)",
      "Processeur": "Neural Quantum Processor 8K (Upscaling par IA)",
      "Écran": "Design Infinity (Écran sans bordures, épaisseur de 15 mm)",
      "Audio": "Object Tracking Sound Pro (Le son suit le mouvement des objets)",
      "Boîtier déporté": "Boîtier One Connect ultra-fin pour regrouper toute la connectique"
    },
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
  },

  // CATEGORY: BOOKS
  {
    id: "designing-data-intensive-apps",
    name: "Designing Data-Intensive Applications",
    category: "book",
    brand: "O'Reilly Media",
    model: "Martin Kleppmann",
    description: "La bible indispensable pour comprendre l'architecture, la fiabilité et le passage à l'échelle des grands systèmes de données.",
    price: 49,
    rating: 4.9,
    inStock: true,
    specs: {
      "Auteur": "Martin Kleppmann",
      "Éditeur": "O'Reilly Media",
      "Thèmes": "NoSQL, SQL, Replication, Partitions, Transactions, Stream Processing",
      "Pages": "616 pages de contenu technique ultra-détaillé",
      "Langue": "Anglais (Référence mondiale)",
      "Niveau": "Intermédiaire à Avancé en ingénierie logicielle"
    },
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "clean-code-martin",
    name: "Clean Code: A Handbook of Agile Software Craftsmanship",
    category: "book",
    brand: "Prentice Hall",
    model: "Robert C. Martin (Uncle Bob)",
    description: "Le guide intemporel pour apprendre à écrire du code propre, lisible, réutilisable et facilement maintenable au quotidien.",
    price: 39,
    rating: 4.5,
    inStock: true,
    specs: {
      "Auteur": "Robert C. Martin",
      "Éditeur": "Prentice Hall",
      "Thèmes": "Naming, Functions, Comments, Formatting, Error Handling, Unit Testing",
      "Pages": "464 pages pratiques",
      "Langue": "Anglais (Traduit en plusieurs langues)",
      "Niveau": "Idéal pour tous les développeurs juniors et seniors"
    },
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80"
  }
];

// Helper to get products from LocalStorage or initialize with defaults
export const getStoredProducts = () => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  
  const stored = localStorage.getItem('passion_store_products');
  if (stored) {
    try {
      return JSON.parse(stored);
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
