// ==============================
// VARIABLE GLOBALE (TRÈS IMPORTANT)
// ==============================

let docs = [];


// ==============================
// CONFIG
// ==============================

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv";

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
const catParam = params.get("cat");

console.log("hello");


// ==============================
// CHARGEMENT CSV
// ==============================

Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results){

        docs = results.data; // 🔥 LA LIGNE CRUCIALE
        const data = docs;

        console.log("CSV chargé :", docs);

        // ==============================
        // PAGE CATALOGUE
        // ==============================

        const cards = document.querySelectorAll(".doc-card");

        if(cards.length){

            cards.forEach(card => {

                const id = card.dataset.id;
                const item = data.find(d => d.ID && d.ID.trim() === id);

                if(!item) return;

                // image capsule
                const img = card.querySelector("img");
                if(img && item.poster){
                    img.src = "../posters/" + item.ID + ".jpg";
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

        // ==============================
        // ANIMATION GSAP
        // ==============================

        if (typeof gsap !== "undefined") {

            const tl = gsap.timeline();

            tl.from(".loader-title", {
                duration: 1,
                scale: 1.2,
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
        }

        // ==============================
        // PAGE FILM
        // ==============================

        if(itemId){

            const item = data.find(d => d.ID && d.ID.trim() === itemId);

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

            // LIEN
            const watchLink = document.getElementById("watchLink");
            if(watchLink && item.url){
                watchLink.href = item.url;
            }
        }

        // ==============================
        // PAGE CATEGORIE
        // ==============================

        if(catParam){

            const filmsCategorie = data.filter(film => film.Category === catParam);

            const container = document.querySelector(".catalogue");

            if(container){

                container.innerHTML = "";

                filmsCategorie.forEach(item => {

                    const card = document.createElement("div");
                    card.className = "doc-card";

                    card.innerHTML = `
                        <a href="film.html?id=${item.ID}">
                            <img src="../posters/${item.ID}.jpg" alt="${item.Titre}">
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

            const title = document.getElementById("categoryTitle");

            if(title){
                title.textContent = catParam;
            }
        }

    }
});