/**
 * Passion Store Security System
 * Anti-Plagiarism, Anti-Copy, Anti-Injection & XSS Protection
 */

// 1. Protection Anti-Plagiat & Anti-Copie
export const initAntiPlagiarism = (showNotification = () => {}, config = {}) => {
  if (typeof window === 'undefined') return;

  const {
    blockContextMenu = true,
    blockSelect = true,
    blockCopy = true,
    blockCut = true,
    blockDrag = true,
    blockDevTools = true,
    blockViewSource = true,
    blockSavePage = true,
    blockSelectAll = true
  } = config;

  // Bloquer le clic droit (Menu contextuel)
  const handleContextMenu = (e) => {
    if (!blockContextMenu) return;
    e.preventDefault();
    showNotification("⚠️ Sécurité : Le clic droit et le menu contextuel sont désactivés pour protéger le contenu.");
    return false;
  };

  // Bloquer la sélection de texte
  const handleSelectStart = (e) => {
    if (!blockSelect) return;
    // Except inside form elements or inputs
    const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  };

  // Bloquer le copier-couper-coller
  const handleCopy = (e) => {
    if (!blockCopy) return;
    // Don't block copy in input or textarea
    const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    showNotification("⚠️ Sécurité : La copie du contenu est désactivée.");
    return false;
  };

  const handleCut = (e) => {
    if (!blockCut) return;
    const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    showNotification("⚠️ Sécurité : Le découpage du contenu est désactivé.");
    return false;
  };

  // Bloquer le glisser-déposer de contenu
  const handleDragStart = (e) => {
    if (!blockDrag) return;
    e.preventDefault();
    return false;
  };

  // Bloquer les raccourcis clavier
  const handleKeyDown = (e) => {
    // F12 (Inspecteur)
    if (e.key === 'F12' && blockDevTools) {
      e.preventDefault();
      showNotification("⚠️ Sécurité : L'accès aux outils de développement (F12) est désactivé.");
      return false;
    }

    // Ctrl+Shift+I ou Ctrl+Shift+J (Inspecteur / Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      if (blockDevTools) {
        e.preventDefault();
        showNotification("⚠️ Sécurité : L'accès aux outils de développement est restreint.");
        return false;
      }
    }

    // Ctrl+U (Afficher le code source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      if (blockViewSource) {
        e.preventDefault();
        showNotification("⚠️ Sécurité : L'affichage du code source est désactivé.");
        return false;
      }
    }

    // Ctrl+S (Enregistrer la page)
    if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
      if (blockSavePage) {
        e.preventDefault();
        showNotification("⚠️ Sécurité : L'enregistrement de la page est désactivé.");
        return false;
      }
    }

    // Ctrl+C (Copier)
    if (e.ctrlKey && (e.key === 'C' || e.key === 'c')) {
      // Don't block keyboard copy in inputs
      const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return true;
      }
      if (blockCopy) {
        e.preventDefault();
        showNotification("⚠️ Sécurité : Le raccourci de copie (Ctrl+C) est désactivé.");
        return false;
      }
    }

    // Ctrl+A (Tout sélectionner)
    if (e.ctrlKey && (e.key === 'A' || e.key === 'a')) {
      const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return true;
      }
      if (blockSelectAll) {
        e.preventDefault();
        return false;
      }
    }
  };

  // Enregistrer les écouteurs
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('selectstart', handleSelectStart);
  document.addEventListener('copy', handleCopy);
  document.addEventListener('cut', handleCut);
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('keydown', handleKeyDown);

  // Retourner une fonction pour désinstaller les protections (utile au démontage de React)
  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('selectstart', handleSelectStart);
    document.removeEventListener('copy', handleCopy);
    document.removeEventListener('cut', handleCut);
    document.removeEventListener('dragstart', handleDragStart);
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// 2. Protection Anti-Injection & XSS (Sanitizer)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Échapper les caractères spéciaux HTML pour bloquer le XSS de base
  let clean = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Supprimer les balises script, iframes, styles, event handlers et pseudos-protocoles javascript
  clean = clean.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
  clean = clean.replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '');
  clean = clean.replace(/javascript:/gi, '');
  clean = clean.replace(/on\w+\s*=/gi, '');

  return clean;
};

// Validation stricte de formulaires
export const validateFormFields = (fields) => {
  const errors = {};
  
  if (fields.hasOwnProperty('name')) {
    const name = fields.name.trim();
    if (!name) {
      errors.name = "Le nom est obligatoire.";
    } else if (name.length < 2) {
      errors.name = "Le nom doit comporter au moins 2 caractères.";
    } else if (/[<>{}]/g.test(name)) {
      errors.name = "Caractères non autorisés détectés.";
    }
  }

  if (fields.hasOwnProperty('phone')) {
    const phone = fields.phone.trim();
    if (!phone) {
      errors.phone = "Le numéro de téléphone est obligatoire.";
    } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phone)) {
      errors.phone = "Numéro de téléphone invalide (chiffres et symboles de base uniquement).";
    }
  }

  if (fields.hasOwnProperty('address')) {
    const address = fields.address.trim();
    if (!address) {
      errors.address = "L'adresse est obligatoire.";
    } else if (/[<>{}]/g.test(address)) {
      errors.address = "Caractères non autorisés détectés.";
    }
  }

  if (fields.hasOwnProperty('location')) {
    const location = fields.location.trim();
    if (!location) {
      errors.location = "La ville ou région est obligatoire.";
    } else if (/[<>{}]/g.test(location)) {
      errors.location = "Caractères non autorisés détectés.";
    }
  }

  if (fields.hasOwnProperty('quantity')) {
    const qty = parseInt(fields.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      errors.quantity = "La quantité doit être supérieure à 0.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
