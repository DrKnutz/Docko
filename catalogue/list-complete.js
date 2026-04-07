const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv";

const params = new URLSearchParams(window.location.search);
const catParam = params.get("cat");

console.log("hello");

Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results){

        let data = results.data;

        // supprimer lignes vides
        data = data.filter(item => item.ID && item.Date);

        // tri par année (récent → ancien)
        data.sort((a,b) => b.Date - a.Date);

        const mainContainer = document.querySelector(".catalogue");

        let anneeCourante = null;
        let containerActuel = null;

        data.forEach(item => {

            if(catParam == item.Catégorie_catalogue || catParam == null){

                // si l'année change
                if(item.Date !== anneeCourante){

                    anneeCourante = item.Date;

                    // créer la section année
                    mainContainer.innerHTML += `
                        <h2 class="year-title">${anneeCourante}</h2>
                        <div class="year-grid" data-year="${anneeCourante}"></div>
                    `;

                    containerActuel = mainContainer.querySelector(`[data-year="${anneeCourante}"]`);
                }

                // ajouter la carte
                containerActuel.innerHTML += `
                <div class="doc-card" data-id="${item.ID}">
                    <a>
                        <img>
                        <div class="overlay">
                            <div class="info">
                                <h3 class="Titre"></h3>
                                <p class="Category"></p>
                            </div>
                        </div>
                    </a>
                </div>
                `;

                // récupérer la card (important : scoped au container)
                const card = containerActuel.querySelector(`[data-id="${item.ID}"]`);

                // image
                const img = card.querySelector("img");
                if(img && item.poster){
                    img.src = "../posters/"+ item.ID + ".jpg";
                }

                // titre
                const title = card.querySelector(".Titre");
                if(title && item.Titre){
                    title.textContent = item.Titre;
                }

                // catégorie
                const cat = card.querySelector(".Category");
                if(cat && item.Catégorie_catalogue){
                    cat.textContent = item.Catégorie_catalogue;
                }

                // lien
                const link = card.querySelector("a");
                if(link){
                    link.href = "film.html?id=" + item.ID;
                }

                // ✅ BADGE DYNAMIQUE (AJOUTÉ)
                const overlay = card.querySelector(".overlay");

                if (overlay && item.Badge && item.Badge.trim() !== "") {

                    const badge = document.createElement("span");
                    badge.className = "badge";
                    badge.textContent = item.Badge.trim();

                    badge.setAttribute("data-badge", item.Badge.trim());

                    overlay.prepend(badge);
                }

            }

        });

    }

});