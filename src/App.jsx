import { useState, useEffect, useRef } from 'react';
import {
  Car,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Search,
  ArrowUpDown,
  Plus,
  Minus,
  Trash2,
  Lock,
  Settings,
  ClipboardCopy,
  Eye,
  EyeOff,
  Save,
  Check,
  PlusCircle,
  AlertCircle,
  Star,
  Upload,
  Info,
  Gauge
} from 'lucide-react';
import Navbar from './components/Navbar';
import { getNextContactNumber } from './utils/contact';
import { getStoredProducts, saveProducts } from './data/productsData';
import { initAntiPlagiarism, sanitizeInput, validateFormFields } from './utils/security';
import './App.css';

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState(() => getStoredProducts());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Detailed specs modal viewer
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Shopping Cart state
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('passion_store_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Custom Toast Notifications
  const [notifications, setNotifications] = useState([]);

  // Admin authentication and states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('passion_store_is_admin') === 'true';
  });
  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard, products, orders, security, settings
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password modification states (inside settings tab)
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  // Audit Logs for catalog modifications
  const [auditLogs, setAuditLogs] = useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('passion_store_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('passion_store_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Secure hashing algorithm (SHA-256)
  const hashPasscode = async (password) => {
    try {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.error("Hashing failed, falling back to simple hash", e);
      let hash = 0;
      for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString();
    }
  };

  const addAuditLog = (action, target) => {
    const newLog = {
      id: "LOG-" + Math.floor(100000 + Math.random() * 900000),
      action,
      target,
      date: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Client-Side Security Configuration
  const [securityConfig, setSecurityConfig] = useState(() => {
    const defaultSecurity = {
      blockContextMenu: true,
      blockSelect: true,
      blockCopy: true,
      blockCut: true,
      blockDrag: true,
      blockDevTools: true,
      blockViewSource: true,
      blockSavePage: true,
      blockSelectAll: true
    };
    if (typeof window === 'undefined') return defaultSecurity;
    const saved = localStorage.getItem('passion_store_security_config');
    return saved ? JSON.parse(saved) : defaultSecurity;
  });

  // General Administrative Settings
  const [adminSettings, setAdminSettings] = useState(() => {
    const defaultSettings = {
      storeName: "PASSION STORE",
      targetPhone: "+33600000000",
      passphraseHash: "99d17c458ca77e1331f4c33aef3cd92a86008c23d272b831ee9f9cf175e874bd" // SHA-256 of seydoubhk2026
    };
    if (typeof window === 'undefined') return defaultSettings;
    const saved = localStorage.getItem('passion_store_admin_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Simulated Orders Log
  const [orders, setOrders] = useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('passion_store_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Checkout Form fields
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    location: '',
    address: '',
    preference: 'WhatsApp',
    message: ''
  });
  const [checkoutErrors, setCheckoutErrors] = useState({});

  // Product CRUD Form states (Add/Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    model: '',
    category: 'car',
    type: 'sale', // 'sale' or 'rent'
    price: '',
    originalPrice: '', // original price for promos
    isPromo: false,
    imageUrl: '',
    description: '',
    inStock: true,
    specsInput: '' // parsed into spec object
  });
  const [productFormErrors, setProductFormErrors] = useState({});

  // --- SAVE PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('passion_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('passion_store_security_config', JSON.stringify(securityConfig));
  }, [securityConfig]);

  useEffect(() => {
    localStorage.setItem('passion_store_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('passion_store_orders', JSON.stringify(orders));
  }, [orders]);

  // --- NOTIFICATION HANDLER ---
  const showNotification = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message }]);

    // Auto-remove notification after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 4000);
  };

  // --- PLAGIARISM PROTECTION CONTROLLER ---
  useEffect(() => {
    const uninstall = initAntiPlagiarism(showNotification, securityConfig);
    return () => {
      if (uninstall) uninstall();
    };
  }, [securityConfig]);

  // --- SEARCH AND FILTER LOGIC ---
  const filteredProducts = products.filter((product) => {
    // Category match
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;

    // Search query match
    const term = searchQuery.toLowerCase().trim();
    if (!term) return categoryMatch;

    const brandMatch = product.brand?.toLowerCase().includes(term);
    const nameMatch = product.name?.toLowerCase().includes(term);
    const modelMatch = product.model?.toLowerCase().includes(term);
    const descMatch = product.description?.toLowerCase().includes(term);

    // Search in specs values
    const specsMatch = Object.values(product.specs || {}).some(
      (specVal) => String(specVal).toLowerCase().includes(term)
    );

    return categoryMatch && (brandMatch || nameMatch || modelMatch || descMatch || specsMatch);
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0; // default (no sorting change)
  });

  // --- CART OPERATIONS ---
  const addToCart = (product) => {
    if (!product.inStock) {
      showNotification("⚠️ Désolé : Cet article est actuellement en rupture de stock.");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showNotification(`➕ Quantité augmentée pour ${product.name}`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        showNotification(`🛒 ${product.name} ajouté au panier`);
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id, name) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showNotification(`🗑️ ${name} retiré du panier.`);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // --- CHECKOUT OPERATIONS & WHATSAPP REDIRECT ---
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedForm = {
      name: sanitizeInput(checkoutForm.name),
      phone: sanitizeInput(checkoutForm.phone),
      location: sanitizeInput(checkoutForm.location),
      address: sanitizeInput(checkoutForm.address),
      preference: checkoutForm.preference,
      message: sanitizeInput(checkoutForm.message)
    };

    // Stricter validations
    const validation = validateFormFields({
      name: sanitizedForm.name,
      phone: sanitizedForm.phone,
      location: sanitizedForm.location,
      address: sanitizedForm.address
    });

    if (!validation.isValid) {
      setCheckoutErrors(validation.errors);
      showNotification("⚠️ Erreur de validation : Veuillez vérifier les champs saisis.");
      return;
    }

    setCheckoutErrors({});

    // 1. Create simulated order
    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      customerName: sanitizedForm.name,
      phone: sanitizedForm.phone,
      location: sanitizedForm.location,
      address: sanitizedForm.address,
      contactPreference: sanitizedForm.preference,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: getCartTotal(),
      status: 'pending',
      customerMessage: sanitizedForm.message
    };

    // Push order in local state
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Send to Formspree (optional, ignore errors)
    try {
      await fetch('https://formspree.io/f/xqapevvv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sanitizedForm.name,
          phone: sanitizedForm.phone,
          location: sanitizedForm.location,
          address: sanitizedForm.address,
          preference: sanitizedForm.preference,
          message: sanitizedForm.message,
          items: cart.map(i => `${i.name} (x${i.quantity})`).join(', '),
          total: getCartTotal()
        })
      });
    } catch (e) {
      console.warn('Formspree submission failed', e);
    }

    // 3. Format WhatsApp Message
    let textMessage = `🛍️ *NOUVELLE COMMANDE - ${adminSettings.storeName}*\n\n`;
    textMessage += `👤 *Informations Client :*\n`;
    textMessage += `• *Nom:* ${sanitizedForm.name}\n`;
    textMessage += `• *Téléphone:* ${sanitizedForm.phone}\n`;
    textMessage += `• *Ville/Région:* ${sanitizedForm.location}\n`;
    textMessage += `• *Adresse:* ${sanitizedForm.address}\n`;
    textMessage += `• *Moyen de contact favori:* ${sanitizedForm.preference}\n\n`;

    textMessage += `📦 *Articles Commandés :*\n`;
    cart.forEach(item => {
      textMessage += `• ${item.name} (x${item.quantity}) - ${item.price * item.quantity} €\n`;
    });

    textMessage += `\n💰 *MONTANT TOTAL :* *${getCartTotal()} €*\n`;

    if (sanitizedForm.message) {
      textMessage += `\n💬 *Instructions Spéciales :*\n"${sanitizedForm.message}"\n`;
    }

    textMessage += `\n⚡ _Généré automatiquement par Passion Store Sécurisé._`;

    // 4. Open WhatsApp link
    const targetPhone = getNextContactNumber();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(textMessage)}`;

    window.open(whatsappUrl, '_blank');

    // 5. Success procedures
    showNotification("🎉 Commande enregistrée ! Redirection vers WhatsApp...");
    setCart([]);
    setIsCheckoutOpen(false);
    setCheckoutForm({
      name: '',
      phone: '',
      location: '',
      address: '',
      preference: 'WhatsApp',
      message: ''
    });
  };

  // --- ADMIN AUTHENTICATION ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const cleanPass = loginPasscode.trim();
    const cleanUser = loginUsername.trim().toLowerCase();

    const enteredHash = await hashPasscode(cleanPass);
    const storedHash = adminSettings.passphraseHash || "99d17c458ca77e1331f4c33aef3cd92a86008c23d272b831ee9f9cf175e874bd";

    if (enteredHash === storedHash) {
      setIsAdmin(true);
      localStorage.setItem('passion_store_is_admin', 'true');
      setLoginPasscode('');
      setLoginUsername('');
      setLoginError('');
      showNotification("🔓 Authentification réussie. Bienvenue, Administrateur !");
      addAuditLog("Connexion Admin réussie", "Accès accordé");
    } else {
      setLoginError("Identifiant ou mot de passe incorrect.");
      showNotification("❌ Tentative d'accès non autorisée.");
      addAuditLog("Échec de connexion Admin", `Tentative d'accès pour l'utilisateur: ${cleanUser}`);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.setItem('passion_store_is_admin', 'false');
    showNotification("🔒 Session d'administration déconnectée.");
    addAuditLog("Déconnexion Admin", "Session d'administration fermée");
  };

  // --- CATALOG CRUD OPERATIONS ---
  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" du catalogue ?`)) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
      showNotification(`🗑️ Produit "${name}" supprimé.`);
      addAuditLog("Suppression du véhicule", `${name} (ID: ${id})`);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      model: '',
      category: 'car',
      type: 'sale',
      price: '',
      originalPrice: '',
      isPromo: false,
      imageUrl: '',
      description: '',
      inStock: true,
      specsInput: 'Puissance: \n0-100 km/h: \nAutonomie: \nVitesse Max: \nTransmission: \nAnnée: \nÉnergie: '
    });
    setProductFormErrors({});
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);

    // Parse specs object into line-separated key:value text
    let specsText = '';
    if (product.specs) {
      specsText = Object.entries(product.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    }

    setProductForm({
      name: product.name,
      brand: product.brand || '',
      model: product.model || '',
      category: product.category,
      type: product.type || 'sale',
      price: product.price,
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      isPromo: product.isPromo || false,
      imageUrl: product.imageUrl,
      description: product.description,
      inStock: product.inStock,
      specsInput: specsText
    });
    setProductFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = (e) => {
    e.preventDefault();

    // Validations
    const errors = {};
    if (!productForm.name.trim()) errors.name = "Le nom du produit est obligatoire.";
    if (!productForm.brand.trim()) errors.brand = "La marque est obligatoire.";
    if (!String(productForm.price).trim() || isNaN(productForm.price) || Number(productForm.price) <= 0) {
      errors.price = "Le prix doit être un nombre supérieur à 0.";
    }
    if (productForm.isPromo) {
      if (!productForm.originalPrice || isNaN(productForm.originalPrice) || Number(productForm.originalPrice) <= 0) {
        errors.originalPrice = "Le prix original est obligatoire et doit être supérieur à 0.";
      }
    }
    if (!productForm.imageUrl.trim()) errors.imageUrl = "L'URL de l'image est obligatoire.";
    if (!productForm.description.trim()) errors.description = "La description est obligatoire.";

    if (Object.keys(errors).length > 0) {
      setProductFormErrors(errors);
      showNotification("⚠️ Veuillez corriger les erreurs du formulaire.");
      return;
    }

    // Parse specs string into key-value pairs
    const specs = {};
    productForm.specsInput.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val) {
          specs[key] = val;
        }
      }
    });

    if (editingProduct) {
      // Edit mode
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: sanitizeInput(productForm.name),
            brand: sanitizeInput(productForm.brand),
            model: sanitizeInput(productForm.model),
            category: productForm.category,
            type: productForm.type,
            isPromo: productForm.isPromo,
            originalPrice: productForm.isPromo ? Math.round(Number(productForm.originalPrice)) : undefined,
            price: Math.round(Number(productForm.price)),
            imageUrl: productForm.imageUrl,
            description: sanitizeInput(productForm.description),
            inStock: productForm.inStock,
            specs
          };
        }
        return p;
      });
      setProducts(updated);
      saveProducts(updated);
      showNotification(`✏️ Le produit "${productForm.name}" a été mis à jour.`);
    } else {
      // Add mode
      const newId = sanitizeInput(productForm.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const duplicate = products.find(p => p.id === newId);
      const finalId = duplicate ? `${newId}-${Date.now().toString().slice(-4)}` : newId;

      const newProduct = {
        id: finalId,
        name: sanitizeInput(productForm.name),
        brand: sanitizeInput(productForm.brand),
        model: sanitizeInput(productForm.model),
        category: productForm.category,
        type: productForm.type,
        isPromo: productForm.isPromo,
        originalPrice: productForm.isPromo ? Math.round(Number(productForm.originalPrice)) : undefined,
        price: Math.round(Number(productForm.price)),
        imageUrl: productForm.imageUrl,
        description: sanitizeInput(productForm.description),
        inStock: productForm.inStock,
        specs,
        rating: 5.0
      };

      const updated = [newProduct, ...products];
      setProducts(updated);
      saveProducts(updated);
      showNotification(`✨ Le produit "${productForm.name}" a été ajouté.`);
    }

    setIsProductModalOpen(false);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    showNotification(`⚙️ Statut de la commande ${orderId} changé à: ${newStatus === 'completed' ? 'Traité' : newStatus === 'cancelled' ? 'Annulé' : 'En attente'}`);
  };

  // Quick preset security toggles
  const handleToggleSecurity = (key) => {
    setSecurityConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showNotification(`🛡️ Option de sécurité modifiée.`);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showNotification("💾 Configuration d'administration sauvegardée avec succès.");
  };

  return (
    <div className="app-container">
      {/* Visual Mesh Background */}
      <div className="bg-mesh"></div>

      {/* Styled Top Navbar */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onAdminClick={() => setIsAdminOpen(true)}
        isAdmin={isAdmin}
        onLogout={handleAdminLogout}
      />

      <main className="main-content">
        {/* Futuristic Tech Hero Section */}
        <section className="hero-banner glass animate-fade-in-up">
          <div className="pulse-security">
            <span className="pulse-dot"></span>
            <span>PROTECTION CONTRE LE PLAGIAT ACTIVÉE</span>
          </div>
          <h1 className="hero-title">{adminSettings.storeName}</h1>
          <p className="hero-subtitle">
            Explorez notre sélection exclusive de véhicules d'exception. Des voitures de sport surpuissantes aux motos légendaires, trouvez la machine de vos rêves.
          </p>
        </section>

        {/* Filter and Search Hub */}
        <section className="catalog-controls glass animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom, marque, spécification, modèle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sorting-controls">
            <ArrowUpDown size={18} className="text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix : croissant</option>
              <option value="price-desc">Prix : décroissant</option>
              <option value="name-asc">Nom : A - Z</option>
              <option value="rating-desc">Note client</option>
            </select>
          </div>
        </section>

        {/* Products Grid */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {sortedProducts.length > 0 ? (
            <div className="products-grid">
              {sortedProducts.map((product) => (
                <div key={product.id} className="product-card glass glass-hover">
                  <div className="product-image-container">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                    <span className="product-tag">{product.category === 'car' ? 'Voiture' : 'Moto'}</span>
                    <span className={`product-stock-badge ${product.inStock ? 'stock-in' : 'stock-out'}`}>
                      {product.inStock ? 'DISPONIBLE' : 'VENDU'}
                    </span>
                  </div>

                  <div className="product-info">
                    {product.brand && <span className="product-brand">{product.brand}</span>}
                    <h3 className="product-name">{product.name}</h3>

                    {product.rating && (
                      <div className="product-rating">
                        <Star size={14} fill="#fbbf24" stroke="none" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    )}

                    <p className="product-description">{product.description}</p>

                    {product.specs && Object.keys(product.specs).length > 0 && (
                      <div className="product-specs">
                        {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                          <span key={key} className="spec-badge">
                            <strong>{key}:</strong> {val}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="product-price-section">
                      <span className="product-price">
                        {product.isPromo && product.originalPrice ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: '0.4rem' }}>{product.originalPrice.toLocaleString('fr-FR')} €</span>
                            <span style={{ color: '#ff4757' }}>{product.price.toLocaleString('fr-FR')} €</span>
                          </>
                        ) : (
                          <span>{product.price.toLocaleString('fr-FR')} €</span>
                        )}
                        {product.type === 'rent' && <span style={{ marginLeft: '0.3rem', fontSize: '0.85rem' }}>/jour</span>}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedVehicle(product)}
                          className="btn-secondary"
                          style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                          title="Fiche technique complète"
                        >
                          <Info size={14} />
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="btn-primary"
                          style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                        >
                          <ShoppingBag size={14} />
                          <span>Acheter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass empty-state">
              <AlertCircle size={48} className="text-muted" />
              <h2>Aucun produit trouvé</h2>
              <p>Essayez de modifier vos filtres ou d'élargir votre recherche.</p>
            </div>
          )}
        </section>
      </main>

      {/* Floating Cart Trigger Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="cart-floating-trigger"
          title="Ouvrir le panier"
        >
          <ShoppingBag size={24} />
          <span className="cart-count-badge">{getCartCount()}</span>
        </button>
      )}

      {/* Sliding Cart Drawer Panel */}
      {isCartOpen && (
        <>
          <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}></div>
          <div className="cart-drawer glass">
            <div className="cart-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                <ShoppingBag size={20} color="var(--accent-cyan)" />
                <span>Mon Panier ({getCartCount()})</span>
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="modal-close" style={{ position: 'relative', top: 0, right: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">{item.price} €</span>
                    <div className="cart-item-qty">
                      <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn"><Minus size={10} /></button>
                      <span className="qty-val">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn"><Plus size={10} /></button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.name)}
                    className="cart-item-remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary-row">
                <span className="text-secondary">Sous-total</span>
                <span className="cart-summary-total">{getCartTotal()} €</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              >
                Passer la commande
              </button>
            </div>
          </div>
        </>
      )}

      {/* Chic Checkout Form Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <button onClick={() => setIsCheckoutOpen(false)} className="modal-close">
              <X size={18} />
            </button>

            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                <ShoppingBag size={22} color="var(--accent-cyan)" />
                <span>Finaliser ma Commande</span>
              </h2>
              <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Total de votre commande : <strong style={{ color: '#fff' }}>{getCartTotal()} €</strong>
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom complet *</label>
                <input
                  type="text"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  className={`form-input ${checkoutErrors.name ? 'form-input-error' : ''}`}
                  placeholder="Ex: Jean Dupont"
                  required
                />
                {checkoutErrors.name && <span className="error-text">{checkoutErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone WhatsApp (avec indicatif) *</label>
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  className={`form-input ${checkoutErrors.phone ? 'form-input-error' : ''}`}
                  placeholder="Ex: +33612345678"
                  required
                />
                {checkoutErrors.phone && <span className="error-text">{checkoutErrors.phone}</span>}
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Ville / Région *</label>
                  <input
                    type="text"
                    value={checkoutForm.location}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, location: e.target.value })}
                    className={`form-input ${checkoutErrors.location ? 'form-input-error' : ''}`}
                    placeholder="Ex: Paris"
                    required
                  />
                  {checkoutErrors.location && <span className="error-text">{checkoutErrors.location}</span>}
                </div>
                <div>
                  <label className="form-label">Moyen de Contact Préféré</label>
                  <select
                    value={checkoutForm.preference}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, preference: e.target.value })}
                    className="form-select"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                    <option value="Appel direct">Appel direct</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Adresse complète de livraison *</label>
                <textarea
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  className={`form-input ${checkoutErrors.address ? 'form-input-error' : ''}`}
                  rows="3"
                  placeholder="Ex: 12 Rue de la Paix, 75002 Paris"
                  required
                ></textarea>
                {checkoutErrors.address && <span className="error-text">{checkoutErrors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Instructions de livraison / Note</label>
                <textarea
                  value={checkoutForm.message}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, message: e.target.value })}
                  className="form-input"
                  rows="2"
                  placeholder="Ex: Code d'entrée 1234, appeler avant d'arriver..."
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  Commander via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cyber Administrative Dashboard modal */}
      {isAdminOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: adminTab === 'products' || adminTab === 'orders' ? '960px' : '640px' }}>
            <button onClick={() => setIsAdminOpen(false)} className="modal-close">
              <X size={18} />
            </button>

            {/* Login protection screen */}
            {!isAdmin ? (
              <div className="modal-body" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '1.25rem',
                  borderRadius: '50%',
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: '#ef4444'
                }}>
                  <Lock size={32} />
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Espace d'Administration Sécurisé</h2>
                <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '400px', marginInline: 'auto' }}>
                  Veuillez vous authentifier en saisissant le code secret d'accès pour gérer les commandes, les produits et les options anti-plagiat.
                </p>

                <form onSubmit={handleAdminLogin} style={{ maxWidth: '360px', margin: '0 auto', textAlign: 'left' }}>
                  <div className="form-group">
                    <label className="form-label">Identifiant Admin</label>
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Entrez votre identifiant"
                      className="form-input"
                      style={{ fontSize: '1rem' }}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Code d'accès / Passphrase</label>
                    <input
                      type="password"
                      value={loginPasscode}
                      onChange={(e) => setLoginPasscode(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="form-input"
                      style={{ fontSize: '1rem', letterSpacing: '0.1em' }}
                      required
                    />
                    {loginError && <span className="error-text" style={{ marginTop: '0.5rem' }}>{loginError}</span>}
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>Déverrouiller la Console</span>
                  </button>
                </form>
              </div>
            ) : (
              // Administrative Hub Dashboard
              <div className="admin-hub">
                <div className="admin-header">
                  <div className="admin-title-group">
                    <Car size={24} color="var(--accent-cyan)" />
                    <span className="admin-title">Console Administrative</span>
                  </div>

                  <div className="admin-nav-tabs">
                    <button
                      onClick={() => setAdminTab('dashboard')}
                      className={`admin-tab ${adminTab === 'dashboard' ? 'active' : ''}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setAdminTab('products')}
                      className={`admin-tab ${adminTab === 'products' ? 'active' : ''}`}
                    >
                      Produits
                    </button>
                    <button
                      onClick={() => setAdminTab('orders')}
                      className={`admin-tab ${adminTab === 'orders' ? 'active' : ''}`}
                    >
                      Commandes ({orders.length})
                    </button>
                    <button
                      onClick={() => setAdminTab('security')}
                      className={`admin-tab ${adminTab === 'security' ? 'active' : ''}`}
                    >
                      Sécurité
                    </button>
                    <button
                      onClick={() => setAdminTab('settings')}
                      className={`admin-tab ${adminTab === 'settings' ? 'active' : ''}`}
                    >
                      Paramètres
                    </button>
                  </div>
                </div>

                <div className="modal-body" style={{ padding: '0 0 1.5rem' }}>
                  {/* TAB: DASHBOARD OVERVIEW */}
                  {adminTab === 'dashboard' && (
                    <div className="dashboard-tab glass" style={{ padding: '1.5rem' }}>
                      <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Vue d'ensemble de l'administration</h3>
                      <div className="admin-stats-grid">
                        <div className="stat-card glass">
                          <span className="stat-label">Produits total</span>
                          <span className="stat-value">{products.length}</span>
                        </div>
                        <div className="stat-card glass">
                          <span className="stat-label">Commandes totales</span>
                          <span className="stat-value">{orders.length}</span>
                        </div>
                        <div className="stat-card glass">
                          <span className="stat-label">Ventes (€)</span>
                          <span className="stat-value">{orders.reduce((s, o) => s + o.total, 0).toLocaleString('fr-FR')} €</span>
                        </div>
                      </div>
                      <h4 style={{ color: '#fff', marginTop: '1.5rem' }}>Dernières commandes</h4>
                      {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="order-summary glass" style={{ marginBottom: '0.8rem', padding: '0.8rem' }}>
                          <strong>{order.id}</strong> – {order.date} – {order.total} € – {order.status}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB: PRODUCTS CATALOG MANAGER */}
                  {adminTab === 'products' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Catalogue Produits</h3>
                          <p className="text-secondary" style={{ fontSize: '0.8rem' }}>Ajouter, modifier ou supprimer des articles dans la boutique.</p>
                        </div>
                        <button onClick={openAddProductModal} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                          <PlusCircle size={14} />
                          <span>Ajouter un produit</span>
                        </button>
                      </div>

                      <div className="crud-products-list">
                        {products.map(product => (
                          <div key={product.id} className="crud-product-item">
                            <div className="crud-product-left">
                              <img src={product.imageUrl} alt={product.name} className="crud-product-thumb" />
                              <div className="crud-product-details">
                                <span className="crud-product-title">{product.name}</span>
                                <span className="crud-product-meta">
                                  ID: {product.id} • {product.category.toUpperCase()} • <strong>{product.price} €</strong> • {product.inStock ? 'En Stock' : 'Rupture'}
                                </span>
                              </div>
                            </div>
                            <div className="crud-product-actions">
                              <button
                                onClick={() => openEditProductModal(product)}
                                className="btn-secondary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="btn-danger"
                                style={{ padding: '0.4rem', borderRadius: '6px' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: LOCAL CUSTOMER ORDERS LOG */}
                  {adminTab === 'orders' && (
                    <div>
                      <div className="admin-stats-grid">
                        <div className="stat-card glass">
                          <span className="stat-label">Commandes Totales</span>
                          <span className="stat-value">{orders.length}</span>
                        </div>
                        <div className="stat-card glass">
                          <span className="stat-label">En Attente</span>
                          <span className="stat-value text-yellow" style={{ color: '#fbbf24' }}>
                            {orders.filter(o => o.status === 'pending').length}
                          </span>
                        </div>
                        <div className="stat-card glass">
                          <span className="stat-label">Traitées</span>
                          <span className="stat-value text-green" style={{ color: '#34d399' }}>
                            {orders.filter(o => o.status === 'completed').length}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>Historique des Commandes</h3>

                      {orders.length > 0 ? (
                        <div className="orders-table-wrapper">
                          <table className="orders-table">
                            <thead>
                              <tr>
                                <th>Commande ID</th>
                                <th>Date</th>
                                <th>Client</th>
                                <th>Articles</th>
                                <th>Total</th>
                                <th>Statut</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map(order => (
                                <tr key={order.id}>
                                  <td><strong>{order.id}</strong></td>
                                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.date}</td>
                                  <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span>{order.customerName}</span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.phone} • {order.location}</span>
                                    </div>
                                  </td>
                                  <td style={{ fontSize: '0.8rem' }}>
                                    {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                                  </td>
                                  <td><strong>{order.total} €</strong></td>
                                  <td>
                                    <span className={`order-status ${order.status === 'completed' ? 'status-completed' : order.status === 'cancelled' ? 'status-cancelled' : 'status-pending'
                                      }`}>
                                      {order.status === 'completed' ? 'Traité' : order.status === 'cancelled' ? 'Annulé' : 'En attente'}
                                    </span>
                                  </td>
                                  <td>
                                    <select
                                      value={order.status}
                                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                      className="form-select"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                                    >
                                      <option value="pending">En attente</option>
                                      <option value="completed">Traiter</option>
                                      <option value="cancelled">Annuler</option>
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="glass empty-state" style={{ padding: '2rem' }}>
                          <AlertCircle size={32} />
                          <p>Aucune commande passée pour le moment.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: ANTI-PLAGIARISM SECURITY TOGGLES */}
                  {adminTab === 'security' && (
                    <div>
                      <div className="cyber-panel">
                        SYSTEME SECURITY MODULE ACTIVE - REALTIME LISTENERS INITIALIZATION SUCCESSFUL
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Module de Sécurité Anti-Copie</h3>
                        <p className="text-secondary" style={{ fontSize: '0.8rem' }}>Activez ou désactivez les blocages de sécurité client.</p>
                      </div>

                      <div className="security-toggles-grid">
                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Désactiver Clic Droit</span>
                            <span className="toggle-desc">Bloque le menu contextuel web</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockContextMenu}
                              onChange={() => handleToggleSecurity('blockContextMenu')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Bloquer la Sélection</span>
                            <span className="toggle-desc">Empêche de sélectionner le texte</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockSelect}
                              onChange={() => handleToggleSecurity('blockSelect')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Bloquer Copie (Ctrl+C)</span>
                            <span className="toggle-desc">Interdit la copie d'éléments</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockCopy}
                              onChange={() => handleToggleSecurity('blockCopy')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Bloquer Coupage (Ctrl+X)</span>
                            <span className="toggle-desc">Interdit de couper du contenu</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockCut}
                              onChange={() => handleToggleSecurity('blockCut')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Outils Développeur</span>
                            <span className="toggle-desc">Bloque F12, Ctrl+Shift+I/J/C</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockDevTools}
                              onChange={() => handleToggleSecurity('blockDevTools')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Bloquer Code Source</span>
                            <span className="toggle-desc">Désactive le raccourci Ctrl+U</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockViewSource}
                              onChange={() => handleToggleSecurity('blockViewSource')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Bloquer Enregistrement</span>
                            <span className="toggle-desc">Interdit de sauvegarder la page</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockSavePage}
                              onChange={() => handleToggleSecurity('blockSavePage')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>

                        <div className="security-toggle-card">
                          <div className="toggle-info">
                            <span className="toggle-title">Glisser-Déposer</span>
                            <span className="toggle-desc">Bloque le drag & drop d'images</span>
                          </div>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={securityConfig.blockDrag}
                              onChange={() => handleToggleSecurity('blockDrag')}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: GENERAL SETTINGS */}
                  {adminTab === 'settings' && (
                    <div>
                      <form onSubmit={handleSaveSettings}>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Paramètres de la Boutique</h3>
                          <p className="text-secondary" style={{ fontSize: '0.8rem' }}>Personnalisez les coordonnées de Passion Store.</p>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Nom du Magasin</label>
                          <input
                            type="text"
                            value={adminSettings.storeName}
                            onChange={(e) => setAdminSettings({ ...adminSettings, storeName: e.target.value })}
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Numéro de Téléphone Cible WhatsApp (Réception des Commandes)</label>
                          <input
                            type="text"
                            value={adminSettings.targetPhone}
                            onChange={(e) => setAdminSettings({ ...adminSettings, targetPhone: e.target.value })}
                            className="form-input"
                            placeholder="Ex: +33600000000"
                            required
                          />
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                          <Save size={14} />
                          <span>Enregistrer les paramètres</span>
                        </button>
                      </form>

                      {/* Secure Password Change Section */}
                      <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Lock size={16} color="var(--accent-cyan)" />
                          <span>Modifier le mot de passe administrateur</span>
                        </h3>
                        <p className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '1.5rem' }}>Le mot de passe est stocké sous forme de hachage sécurisé (SHA-256). Il ne sera jamais affiché en clair.</p>

                        <div className="form-group">
                          <label className="form-label">Nouveau mot de passe</label>
                          <input
                            type="password"
                            value={newPasscode}
                            onChange={(e) => setNewPasscode(e.target.value)}
                            className="form-input"
                            placeholder="Saisissez le nouveau mot de passe"
                            autoComplete="new-password"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Confirmer le nouveau mot de passe</label>
                          <input
                            type="password"
                            value={confirmPasscode}
                            onChange={(e) => setConfirmPasscode(e.target.value)}
                            className="form-input"
                            placeholder="Confirmez le nouveau mot de passe"
                            autoComplete="new-password"
                          />
                        </div>

                        <button
                          type="button"
                          className="btn-primary"
                          style={{ marginTop: '1rem' }}
                          onClick={async () => {
                            if (!newPasscode.trim() || newPasscode.length < 6) {
                              showNotification("⚠️ Le mot de passe doit contenir au moins 6 caractères.");
                              return;
                            }
                            if (newPasscode !== confirmPasscode) {
                              showNotification("⚠️ Les deux mots de passe ne correspondent pas.");
                              return;
                            }
                            const newHash = await hashPasscode(newPasscode.trim());
                            setAdminSettings(prev => ({ ...prev, passphraseHash: newHash }));
                            setNewPasscode('');
                            setConfirmPasscode('');
                            showNotification("✅ Mot de passe administrateur modifié avec succès.");
                            addAuditLog("Changement de mot de passe", "Le mot de passe admin a été modifié.");
                          }}
                        >
                          <Lock size={14} />
                          <span>Changer le mot de passe</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CRUD Product Modal (Add/Edit) */}
      {isProductModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-content glass">
            <button onClick={() => setIsProductModalOpen(false)} className="modal-close">
              <X size={18} />
            </button>

            <div className="modal-header">
              <h2 style={{ fontSize: '1.5rem' }}>
                {editingProduct ? `Modifier le véhicule: ${editingProduct.name}` : 'Ajouter un nouveau véhicule'}
              </h2>
            </div>

            <form onSubmit={handleProductFormSubmit} className="modal-body">
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nom complet du véhicule *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className={`form-input ${productFormErrors.name ? 'form-input-error' : ''}`}
                    placeholder="Ex: Porsche 911 GT3 RS"
                    required
                  />
                  {productFormErrors.name && <span className="error-text">{productFormErrors.name}</span>}
                </div>
                <div>
                  <label className="form-label">Marque *</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className={`form-input ${productFormErrors.brand ? 'form-input-error' : ''}`}
                    placeholder="Ex: Porsche"
                    required
                  />
                  {productFormErrors.brand && <span className="error-text">{productFormErrors.brand}</span>}
                </div>
                <div>
                  <label className="form-label">Modèle</label>
                  <input
                    type="text"
                    value={productForm.model}
                    onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                    className="form-input"
                    placeholder="Ex: 911 GT3 RS"
                  />
                </div>
                <div>
                  <label className="form-label">Prix (en €) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className={`form-input ${productFormErrors.price ? 'form-input-error' : ''}`}
                    placeholder="Ex: 248500"
                    required
                  />
                  {productFormErrors.price && <span className="error-text">{productFormErrors.price}</span>}

                  <label className="form-label" style={{ marginTop: '1rem' }}>Type *</label>
                  <select
                    value={productForm.type}
                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="sale">Vente</option>
                    <option value="rent">Location</option>
                  </select>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                      type="checkbox"
                      id="promoCheck"
                      checked={productForm.isPromo}
                      onChange={(e) => setProductForm({ ...productForm, isPromo: e.target.checked, originalPrice: e.target.checked ? productForm.price : '' })}
                    />
                    <label htmlFor="promoCheck">Produit en promotion</label>
                  </div>

                  {productForm.isPromo && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <label className="form-label">Prix original (en €) *</label>
                      <input
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                        className={`form-input ${productFormErrors.originalPrice ? 'form-input-error' : ''}`}
                        placeholder="Ex: 270000"
                        required
                      />
                      {productFormErrors.originalPrice && <span className="error-text">{productFormErrors.originalPrice}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo du Véhicule *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className={`form-input ${productFormErrors.imageUrl ? 'form-input-error' : ''}`}
                    placeholder="Lien URL de l'image (ex: https://images.unsplash.com/...)"
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.25rem 0' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OU</span>
                  </div>

                  <div
                    className="image-upload-zone"
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragover'); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('dragover');
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setProductForm(prev => ({ ...prev, imageUrl: event.target.result }));
                          showNotification("📸 Photo locale chargée avec succès !");
                        };
                        reader.readAsDataURL(file);
                      } else {
                        showNotification("⚠️ Fichier invalide. Veuillez déposer une image.");
                      }
                    }}
                    onClick={() => {
                      document.getElementById('file-upload-input').click();
                    }}
                    style={{
                      border: '2px dashed var(--glass-border)',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.01)',
                      transition: 'var(--transition-snappy)'
                    }}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setProductForm(prev => ({ ...prev, imageUrl: event.target.result }));
                            showNotification("📸 Photo locale chargée avec succès !");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Upload size={24} style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Glissez-déposez une image ici ou <span style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>parcourez vos fichiers</span>
                    </p>
                  </div>

                  {productForm.imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <img src={productForm.imageUrl} alt="Aperçu" style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, display: 'block' }}>Photo sélectionnée</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                          {productForm.imageUrl.startsWith('data:') ? 'Image importée localement (Base64)' : productForm.imageUrl}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm(prev => ({ ...prev, imageUrl: '' }))}
                        className="btn-danger"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                </div>
                {productFormErrors.imageUrl && <span className="error-text">{productFormErrors.imageUrl}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description du véhicule *</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className={`form-input ${productFormErrors.description ? 'form-input-error' : ''}`}
                  rows="3"
                  placeholder="Présentez le véhicule en quelques lignes..."
                  required
                ></textarea>
                {productFormErrors.description && <span className="error-text">{productFormErrors.description}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Spécifications techniques (Une par ligne au format Clef: Valeur)</label>
                <textarea
                  value={productForm.specsInput}
                  onChange={(e) => setProductForm({ ...productForm, specsInput: e.target.value })}
                  className="form-input"
                  rows="5"
                  placeholder="Puissance: 525 ch&#10;0-100 km/h: 3.2 s&#10;Autonomie: 600 km&#10;Transmission: Intégrale&#10;Année: 2024"
                ></textarea>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="inStockCheck" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                  Marquer ce véhicule comme <strong>Disponible</strong>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  {editingProduct ? 'Sauvegarder les modifications' : 'Ajouter le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="modal-overlay" style={{ zIndex: 1060 }}>
          <div className="modal-content glass" style={{ maxWidth: '800px' }}>
            <button onClick={() => setSelectedVehicle(null)} className="modal-close">
              <X size={18} />
            </button>

            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
              <span className="product-brand" style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {selectedVehicle.brand}
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem', color: '#fff' }}>
                {selectedVehicle.name}
              </h2>
            </div>

            <div className="modal-body" style={{ padding: '0 2rem 2rem 2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Large Responsive image */}
                <div style={{ width: '100%', height: '360px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <img src={selectedVehicle.imageUrl} alt={selectedVehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Details info */}
                <div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <span className="product-tag" style={{ position: 'static' }}>
                      {selectedVehicle.category === 'car' ? 'Voiture' : 'Moto'}
                    </span>
                    <span className={`product-stock-badge ${selectedVehicle.inStock ? 'stock-in' : 'stock-out'}`} style={{ position: 'static' }}>
                      {selectedVehicle.inStock ? 'DISPONIBLE' : 'VENDU'}
                    </span>
                    {selectedVehicle.rating && (
                      <div className="product-rating" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={14} fill="#fbbf24" stroke="none" />
                        <span style={{ fontWeight: 600, color: '#fbbf24' }}>{selectedVehicle.rating.toFixed(1)} / 5.0</span>
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>Description</h3>
                  <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    {selectedVehicle.description}
                  </p>

                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Gauge size={18} color="var(--accent-cyan)" />
                    <span>Caractéristiques Techniques</span>
                  </h3>

                  {selectedVehicle.specs && Object.keys(selectedVehicle.specs).length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
                      {Object.entries(selectedVehicle.specs).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{key}</span>
                          <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '2.5rem' }}>Aucune caractéristique renseignée.</p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prix de vente</span>
                      <strong style={{ fontSize: '2.2rem', color: '#fff', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'baseline', gap: '0.2rem', lineHeight: 1 }}>
                        {selectedVehicle.price.toLocaleString('fr-FR')} <span style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>€</span>
                      </strong>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={() => setSelectedVehicle(null)}
                        className="btn-secondary"
                        style={{ padding: '0.9rem 1.5rem' }}
                      >
                        Retour
                      </button>
                      <button
                        onClick={() => {
                          addToCart(selectedVehicle);
                          setSelectedVehicle(null);
                        }}
                        disabled={!selectedVehicle.inStock}
                        className="btn-primary"
                        style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
                      >
                        <ShoppingBag size={18} />
                        <span>Réserver / Acheter</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating System-Wide Warning Toasts Container */}
      <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 10000, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {notifications.map((notif) => (
          <div key={notif.id} className="security-toast animate-slide-in-right">
            <span>{notif.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
