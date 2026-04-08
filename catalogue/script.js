const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv";

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
const catParam = params.get("cat");

console.log("hello");

// CHARGEMENT CSV

Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function (results) {

        docs = results.data; // LIGNE IMPORTANTE : on stocke les données du CSV dans une variable globale "docs" pour pouvoir y accéder partout dans le script
        const data = docs;

        console.log("CSV chargé :", docs);

        // PAGE CATALOGUE

        const cards = document.querySelectorAll(".doc-card");

        if (cards.length) {

            cards.forEach(card => {

                const id = card.dataset.id;
                const item = data.find(d => d.ID && d.ID.trim() === id);

                if (!item) return;

                // image capsule
                const img = card.querySelector("img");
                if (img && item.poster) {
                    img.src = "../posters/" + item.ID + ".jpg";
                }

                const title = card.querySelector(".Titre");
                if (title && item.Titre) {
                    title.textContent = item.Titre;
                }

                const cat = card.querySelector(".Category");
                if (cat && item.Catégorie_catalogue) {
                    cat.textContent = item.Catégorie_catalogue;
                }

                // lien vers page film
                const link = card.querySelector("a");
                if (link) {
                    link.href = "film.html?id=" + item.ID;
                }
                const overlay = card.querySelector(".overlay");

        if (overlay && item.Badge && item.Badge.trim() !== "") {

            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = item.Badge.trim();

            // 🔥 utile pour le style dynamique
            badge.setAttribute("data-badge", item.Badge.trim());

            overlay.prepend(badge);
        }


            });

        }
        // L'ANIMATION GSAP (uniquement à l'ouverture du catalogue)
        // verification GSAP est bien chargé sur la page
        if (typeof gsap !== "undefined") {

            // verification si l'animation a déjà été jouée pendant cette visite
            const animationDejaJouee = sessionStorage.getItem("introDocKoJouee");

            if (animationDejaJouee) {
                // SI OUI : On supprime le loader instantanément et on affiche le site
                const loader = document.getElementById("loader");
                const loaderLogo = document.querySelector(".loader-logo");
                if (loader) loader.style.display = "none";
                if (loaderLogo) loaderLogo.style.display = "none";
                // On remet l'opacité à 1 pour le menu et la page, sans durée d'animation
                gsap.set(["#main-header", ".doc-landing-page"], { opacity: 1 });

            } else {
                // SI NON : C'est la première visite, on joue l'animation complète
                const tl = gsap.timeline({
                    // À la toute fin de l'animation, on enregistre la variable dans la mémoire du navigateur
                    onComplete: function () {
                        sessionStorage.setItem("introDocKoJouee", "true");
                    }
                });

                // 1. Apparition du logo
                tl.from(".loader-logo", {
                    duration: 1.2,
                    scale: 0.8,
                    opacity: 0,
                    ease: "power3.out"
                })
                    // 2. Le fond noir glisse vers le haut pour révéler la page
                    .to("#loader", {
                        duration: 0.8,
                        yPercent: -100,
                        ease: "power4.inOut",
                        delay: 0.6
                    })
                    // 3. Le menu (header) apparaît
                    .to("#main-header", {
                        duration: 0.6,
                        opacity: 1,
                        y: 0,
                        ease: "power2.out"
                    }, "-=0.3")
                    // 4. Les sections s'affichent
                    .to(".doc-landing-page", {
                        duration: 0.1,
                        opacity: 1
                    }, "-=0.4")
                    // 5. L'effet de cascade (stagger) sur les documentaires
                    .from(cards, {
                        duration: 0.8,
                        y: 60,
                        opacity: 0,
                        stagger: 0.1,
                        ease: "back.out(1.2)"
                    }, "-=0.2");
            }
        }

        // PAGE FILM

        if (itemId) {

            const item = data.find(d => d.ID && d.ID.trim() === itemId);

            if (!item) return;

            Object.keys(item).forEach(key => {

                const element = document.getElementById(key);

                if (element && item[key]) {
                    element.textContent = item[key];
                }

            });

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
            const tagsContainer = document.getElementById("tagsContainer");

            if (tagsContainer && item.Tags) {

                tagsContainer.innerHTML = "";

                const tags = item.Tags.split(",");

                tags.forEach(tag => {

                    const cleanTag = tag.trim();

                    const span = document.createElement("span");
                    span.className = "tag";
                    span.textContent = cleanTag;

                    // 🔥 rendre cliquable
                    span.style.cursor = "pointer";

                    span.addEventListener("click", () => {
                        window.location.href = "tags.html?tag=" + encodeURIComponent(cleanTag);
                    });

                    tagsContainer.appendChild(span);
                });
            }

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
        }

        // PAGE CATEGORIE

        if (catParam) {

            const filmsCategorie = data.filter(film => 
    film.Catégorie_catalogue &&
    film.Catégorie_catalogue.trim().toLowerCase() === catParam.trim().toLowerCase()
);

            const container = document.querySelector(".catalogue");

            if (container) {

                container.innerHTML = "";

                const card = document.createElement("div");
                card.className = "doc-card";

                card.innerHTML = `
                         <a href="film.html?id=${item.ID}">
        <img src="../posters/${item.ID}.jpg" alt="${item.Titre}">
        <div class="overlay">

            ${item.Badge ? `<span class="badge">${item.Badge}</span>` : ""}

            <div class="info">
                <h3 class="Titre">${item.Titre}</h3>
                <p class="Category">${item.Catégorie_catalogue}</p>
            </div>
        </div>
    </a>
`;

                container.appendChild(card);
            };

            const title = document.getElementById("categoryTitle");

            if (title) {
                title.textContent = catParam;
            };
        }
    }
});