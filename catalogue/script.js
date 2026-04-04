// --- VÉRIFICATION IMMÉDIATE DE LA SESSION ---
(function() {
    const animationDejaJouee = sessionStorage.getItem("introDocKoJouee");
    if (animationDejaJouee) {
        // On crée une règle CSS temporaire pour cacher le loader avant même qu'il ne s'affiche
        const style = document.createElement('style');
        style.innerHTML = `
            #loader { display: none !important; }
            #main-header, .doc-landing-page { opacity: 1 !important; }
        `;
        document.head.appendChild(style);
    }
})();
//
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv";

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
const catParam = params.get("cat");

console.log("hello");

Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results){

        const data = results.data;

        // -----------------
        // PAGE CATALOGUE
        // -----------------

        const cards = document.querySelectorAll(".doc-card");

        if(cards.length){

            cards.forEach(card => {

                const id = card.dataset.id;
                const item = data.find(d => d.ID === id);
                if(!item) return;

                // image capsule
                const img = card.querySelector("img");
                if(img && item.poster){
                    img.src = "../posters/" + id + ".jpg";
                }

                const title = card.querySelector(".Titre");
                if(title && item.Titre){
                    title.textContent = item.Titre;
                }

                const cat = card.querySelector(".Category");
                if(cat && item.Category){
                    cat.textContent = item.Category;
                }

                // lien vers page film
                const link = card.querySelector("a");
                if(link){
                    link.href = "film.html?id=" + item.ID;
                }

            });

        }
         // L'ANIMATION GSAP (uniquement à l'ouverture du catalogue)
            if (typeof gsap !== "undefined" && !sessionStorage.getItem("introDocKoJouee")) {
                
                const tl = gsap.timeline({
                    onComplete: function() {
                        sessionStorage.setItem("introDocKoJouee", "true");
                    }
                });
// Ton animation reste la même
                tl.from(".loader-logo", { // ou .loader-title selon ce que tu utilises
                    duration: 1.2,
                    scale: 0.8,
                    opacity: 0,
                    ease: "power3.out"
                })
                .to("#loader", {
                    duration: 0.8,
                    yPercent: -100, 
                    ease: "power4.inOut",
                    delay: 0.6 
                })
                .to("#main-header", {
                    duration: 0.6,
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                }, "-=0.3") 
                .to(".doc-landing-page", {
                    duration: 0.1,
                    opacity: 1
                }, "-=0.4")
                .from(cards, {
                    duration: 0.8,
                    y: 60, 
                    opacity: 0,
                    stagger: 0.1, 
                    ease: "back.out(1.2)" 
                }, "-=0.2");

            } else {
                // Si l'animation a déjà été jouée, on s'assure juste que les cartes sont visibles
                gsap.set(cards, { opacity: 1, y: 0 });
                gsap.set(["#main-header", ".doc-landing-page"], { opacity: 1 });
            }

        // PAGE FILM
        // -----------------

        if(itemId){

            const item = data.find(d => d.ID === itemId);
            if(!item) return;

            Object.keys(item).forEach(key => {

                const element = document.getElementById(key);

                if(element && item[key]){
                    element.textContent = item[key];
                }

            });

            const teamList = document.getElementById("Equipe");

if(teamList && item.Equipe){

    teamList.innerHTML = "";

    const membres = item.Equipe.split(",");

    membres.forEach(membre => {
        const li = document.createElement("li");
        li.textContent = membre.trim();
        teamList.appendChild(li);
    });
}

            // IMAGE POSTER
    const poster = document.getElementById("poster");
    if(poster){
        poster.src = "../posters/" + item.ID + ".jpg";
        poster.alt = item.Titre;
    }
    // LIEN DE VISIONNAGE
const watchLink = document.getElementById("watchLink");
if(watchLink && item.url){
    watchLink.href = item.url;
}

        }

        // -----------------
        // PAGE FICHE CATEGORIE (dynamique)
        // -----------------

        if(catParam){

            const filmsCategorie = data.filter(film => film.Category === catParam);

            const container = document.querySelector(".catalogue");
            if(container){

                container.innerHTML = ""; // vider avant de remplir

                filmsCategorie.forEach(item => {

                    const card = document.createElement("div");
                    card.className = "doc-card";

                    card.innerHTML = `
                        <a href="film.html?id=${item.ID}">
                            <img src="${item.poster}" alt="${item.Titre}">
                            <div class="overlay">
                                <div class="info">
                                    <h3 class="Titre">${item.Titre}</h3>
                                    <p class="Category">${item.Category}</p>
                                </div>
                            </div>
                        </a>
                    `;

                    container.appendChild(card);

                });

            }

            // afficher le titre de la catégorie
            const title = document.getElementById("categoryTitle");
            if(title){
                title.textContent = catParam;
            };
        }
    }});