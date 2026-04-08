// ==============================
// VARIABLES GLOBALES
// ==============================

let historique = [];
let timers = [];
let timersTransition = [];
const DUREE_GIF = 4500;

if (typeof docs === "undefined") {
    console.warn("docs n'est pas encore défini (script.js pas chargé ?)");
}

// ==============================
// OVERLAY
// ==============================

function ouvrirPopup(element) {
    const id = element.dataset.id;
    if (!id) return console.warn("Pas de data-id sur l'image");
    if (typeof docs === "undefined" || !docs.length) return console.warn("CSV pas encore chargé");

    const item = docs.find(d => d.ID?.trim() === id.trim());
    if (!item) return console.error("Film introuvable :", id);

    document.getElementById("overlayPopup").style.display = "flex";

    Object.keys(item).forEach(key => {
        const el = document.getElementById(key);
        if (el && item[key]) el.textContent = item[key];
    });

    const poster = document.getElementById("poster");
    if (poster) { poster.src = `../posters/${item.ID}.jpg`; poster.alt = item.Titre; }

    const watchLink = document.getElementById("watchLink");
    if (watchLink && item.url) watchLink.href = item.url;

    const teamList = document.getElementById("Equipe");
    if (teamList && item.Equipe) {
        teamList.innerHTML = item.Equipe.split(",")
            .map(m => `<li>${m.trim()}</li>`).join("");
    }
    const tagsContainer = document.getElementById("tagsContainer");

    if (tagsContainer && item.Tags) {

        tagsContainer.innerHTML = "";

        const tags = item.Tags.split(",");

        tags.forEach(tag => {

            const cleanTag = tag.trim();

            if (!cleanTag) return;

            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = cleanTag;

            tagsContainer.appendChild(span);
        });
    }
}

function closeOverlay() {
    document.getElementById("overlayPopup").style.display = "none";
}

// ==============================
// GIFs ACCUEIL
// ==============================

function afficherGif(selector) {
    const gif = document.querySelector(selector);
    if (!gif) return console.warn("GIF introuvable :", selector);

    const src = gif.src;
    gif.src = "";
    requestAnimationFrame(() => {
        gif.src = src;
        requestAnimationFrame(() => gif.classList.add("visible"));
    });
    setTimeout(() => gif.classList.remove("visible"), DUREE_GIF);
}

function demarrerGifs() {
    arreterGifs();
    timers.push(setTimeout(function boucle1() {
        afficherGif(".gif-1");
        timers.push(setTimeout(boucle1, 25000));
    }, 5000));
    timers.push(setTimeout(function boucle2() {
        afficherGif(".gif-2");
        timers.push(setTimeout(boucle2, 35000));
    }, 15000));
}

function arreterGifs() {
    timers.forEach(t => clearTimeout(t));
    timers = [];
    document.querySelectorAll(".gif-accueil").forEach(g => g.classList.remove("visible"));
}

demarrerGifs();

// ==============================
// NAVIGATION
// ==============================

function retourAccueil() {
    window.location.href = "../index.html";
}

function retour() {
    timersTransition.forEach(t => clearTimeout(t));
    timersTransition = [];

    document.getElementById("fondu-noir").style.opacity = "0";

    const conteneur = document.querySelector(".image");
    conteneur.classList.remove("zoom-vers");
    conteneur.style.overflow = "hidden";

    const imagePrincipale = document.getElementById("1");
    imagePrincipale.classList.remove("zoom-transition");
    imagePrincipale.src = historique.pop();

    document.querySelectorAll(".objet").forEach(o => o.classList.add("hidden"));
    document.querySelectorAll(".placement, .droite").forEach(e => e.classList.remove("hidden"));
    document.querySelector(".gif-permanent").classList.remove("hidden");

    demarrerGifs();

    mettreAJourBoutonRetour();
}

function mettreAJourBoutonRetour() {
    document.getElementById("retour").disabled = historique.length === 0;
}

// Appelle-la au chargement
mettreAJourBoutonRetour();

// ==============================
// TRANSITIONS
// ==============================

function changerImage(element) {
    timersTransition.forEach(t => clearTimeout(t));
    timersTransition = [];

    const imagePrincipale = document.getElementById("1");
    const gifTransition = document.getElementById("gif-transition");
    const fondu = document.getElementById("fondu-noir");
    const conteneur = document.querySelector(".image");

    if (!imagePrincipale.src.includes("zoom")) {
        historique.push(imagePrincipale.src);
        mettreAJourBoutonRetour();
        document.querySelector(".gif-permanent").classList.add("hidden");
    }

    arreterGifs();

    const { transition, gif, image: imagefinale, objets: groupe } = element.dataset;

    // Calcul origine zoom depuis le clic
    const containerRect = conteneur.getBoundingClientRect();
    const originX = ((event.clientX - containerRect.left) / containerRect.width) * 100;
    const originY = ((event.clientY - containerRect.top) / containerRect.height) * 100;

    // Fonction utilitaire : lancer le zoom du conteneur
    function lancerZoom() {
        conteneur.style.overflow = "visible";
        conteneur.style.transformOrigin = `${originX}% ${originY}%`;
        conteneur.classList.remove("zoom-vers");
        void conteneur.offsetWidth;
        conteneur.classList.add("zoom-vers");
    }

    // Fonction utilitaire : arrêter le zoom et cacher les zones
    function finZoom() {
        conteneur.classList.remove("zoom-vers");
        conteneur.style.transformOrigin = "center";
        conteneur.style.overflow = "hidden";
        document.querySelectorAll(".placement, .droite, .objet").forEach(z => z.classList.add("hidden"));
    }

    // Fonction utilitaire : fondu noir puis refondue
    function fonduNoir(delai, callback) {
        timersTransition.push(setTimeout(() => {
            fondu.style.opacity = "1";
            timersTransition.push(setTimeout(() => {
                callback();
                setTimeout(() => { fondu.style.opacity = "0"; }, 100);
            }, 400));
        }, delai));
    }

    // ==============================
    // CAS 1 : ns1 → zoom droite → ns2
    // ==============================
    if (transition) {
        lancerZoom();
        gifTransition.src = gif || "../Interactif/Animation/transition.GIF";
        gifTransition.classList.remove("hidden");
        new Image().src = imagefinale;

        fonduNoir(1600, () => {
            finZoom();
            gifTransition.classList.add("hidden");
            gifTransition.src = "";
            imagePrincipale.src = transition;

            // Pause sur ns1 puis zoom droite
            timersTransition.push(setTimeout(() => {
                void imagePrincipale.offsetWidth;
                imagePrincipale.classList.add("zoom-transition");

                fonduNoir(700, () => {
                    imagePrincipale.classList.remove("zoom-transition");
                    imagePrincipale.src = imagefinale;
                    if (groupe) {
                        document.querySelectorAll("." + groupe).forEach(o => o.classList.remove("hidden"));
                    }
                });
            }, 2000));
        });

    // ==============================
    // CAS 2 : zoom vers échoppe + GIF
    // ==============================
    } else if (gif) {
        lancerZoom();
        gifTransition.src = gif;
        gifTransition.classList.remove("hidden");
        new Image().src = imagefinale;

        fonduNoir(1000, () => {
            finZoom();
            gifTransition.classList.add("hidden");
            gifTransition.src = "";
            imagePrincipale.src = imagefinale;
            if (groupe) {
                document.querySelectorAll("." + groupe).forEach(o => o.classList.remove("hidden"));
            }
        });

    // ==============================
    // CAS 3 : comportement normal
    // ==============================
    } else {
        document.querySelectorAll(".placement, .droite, .objet").forEach(z => z.classList.add("hidden"));
        if (imagefinale) imagePrincipale.src = imagefinale;
        if (groupe) {
            document.querySelectorAll("." + groupe).forEach(o => o.classList.remove("hidden"));
        }
    }
}


