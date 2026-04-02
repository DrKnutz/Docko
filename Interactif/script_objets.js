// ==============================
// VARIABLES GLOBALES
// ==============================

let historique = [];

// ⚠️ docs doit venir de script.js (catalogue)
// on vérifie juste qu'il existe
if (typeof docs === "undefined") {
    console.warn("docs n'est pas encore défini (script.js pas chargé ?)");
}


// ==============================
// OVERLAY DYNAMIQUE
// ==============================

function ouvrirPopup(element) {

    const id = element.dataset.id;

    if (!id) {
        console.warn("Pas de data-id sur l'image");
        return;
    }

    if (typeof docs === "undefined" || docs.length === 0) {
        console.warn("CSV pas encore chargé");
        return;
    }

    const item = docs.find(d => d.ID && d.ID.trim() === id.trim());

    if (!item) {
        console.error("Film introuvable :", id);
        console.log("Données disponibles :", docs);
        return;
    }

    // afficher overlay
    document.getElementById("overlayPopup").style.display = "flex";

    // remplir automatiquement
    Object.keys(item).forEach(key => {

        const el = document.getElementById(key);

        if (el && item[key]) {
            el.textContent = item[key];
        }

    });

    // IMAGE POSTER
    const poster = document.getElementById("poster");
    if (poster) {
        poster.src = "../posters/" + item.ID + ".jpg";
        poster.alt = item.Titre;
    }

    // LIEN
    const watchLink = document.getElementById("watchLink");
    if (watchLink && item.url) {
        watchLink.href = item.url;
    }

    // ÉQUIPE
    const teamList = document.getElementById("Equipe");

    if (teamList && item.Equipe) {

        teamList.innerHTML = "";

        const membres = item.Equipe.split(",");

        membres.forEach(membre => {
            const li = document.createElement("li");
            li.textContent = membre.trim();
            teamList.appendChild(li);
        });
    }
}


// ==============================
// FERMETURE OVERLAY
// ==============================

function closeOverlay() {
    document.getElementById("overlayPopup").style.display = "none";
}


// ==============================
// INTERACTION IMAGE (ZOOM)
// ==============================

function changerImage(element) {

    let imagePrincipale = document.getElementById("1");

    // sauvegarde historique
    if (!imagePrincipale.src.includes("zoom")) {
        historique.push(imagePrincipale.src);
    }

    // cacher tout
    let zones = document.querySelectorAll(".placement, .droite, .objet");
    zones.forEach(z => z.classList.add("hidden"));

    // changer image
    let nouvelleImage = element.dataset.image;
    if (nouvelleImage) {
        imagePrincipale.src = nouvelleImage;
    }

    // afficher groupe
    let groupe = element.dataset.objets;
    if (groupe) {
        let objets = document.querySelectorAll("." + groupe);
        objets.forEach(obj => obj.classList.remove("hidden"));
    }
}


// ==============================
// RETOUR
// ==============================

function retour() {

    if (historique.length === 0) return;

    let imagePrincipale = document.getElementById("1");

    imagePrincipale.src = historique.pop();

    // cacher objets
    document.querySelectorAll(".objet").forEach(o => o.classList.add("hidden"));

    // afficher zones principales
    document.querySelectorAll(".placement, .droite").forEach(e => e.classList.remove("hidden"));
}


// ==============================
// NAVIGATION
// ==============================

function retourAccueil() {
    window.location.href = "../index.html";
}