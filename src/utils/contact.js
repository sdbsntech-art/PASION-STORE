/**
 * Passion Store - Configuration des contacts et liens de commande
 */

export const CONTACT_INFO = {
    // Numéros au format international pour WhatsApp (sans le +)
    PRIMARY_WHATSAPP: "221773624539",
    SECONDARY_WHATSAPP: "221764685865",
};

/**
 * Récupère le prochain numéro WhatsApp pour alterner les commandes (Load Balancing).
 * Utilise le localStorage pour se souvenir du dernier numéro utilisé.
 * @returns {string} Le numéro de téléphone sélectionné.
 */
export const getNextContactNumber = () => {
    if (typeof window === 'undefined') return CONTACT_INFO.PRIMARY_WHATSAPP;

    const lastUsed = localStorage.getItem('passion_store_last_phone');

    // Si le dernier utilisé était le premier, on prend le deuxième, sinon le premier.
    const nextPhone = (lastUsed === CONTACT_INFO.PRIMARY_WHATSAPP)
        ? CONTACT_INFO.SECONDARY_WHATSAPP
        : CONTACT_INFO.PRIMARY_WHATSAPP;

    // On sauvegarde pour la prochaine fois
    localStorage.setItem('passion_store_last_phone', nextPhone);

    return nextPhone;
};

/**
 * Génère un lien WhatsApp pour la commande d'un produit spécifique.
 * @param {string} productName - Le nom du produit à commander.
 * @param {string} [price] - Le prix optionnel pour plus de précision.
 * @returns {string} L'URL formatée pour WhatsApp.
 */
export const getWhatsAppOrderLink = (productName, price = "") => {
    const priceInfo = price ? ` au prix de ${price}` : "";
    const message = `Bonjour Passion Store, je souhaite commander l'article suivant : ${productName}${priceInfo}. Est-il toujours disponible ?`;

    return `https://wa.me/${getNextContactNumber()}?text=${encodeURIComponent(message)}`;
};