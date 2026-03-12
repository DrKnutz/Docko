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
                    img.src = "posters/"+ id + ".jpg";
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

        // -----------------
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
            }

        }

    }
});
