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

        let anneeCourante = null;
        let containerActuel = null;

        data.forEach(item => {

            if(catParam == item.Category || catParam == null){

                // si l'année change
                if(item.Date !== anneeCourante){

                    anneeCourante = item.Date;

                    // créer la section année
                    document.querySelector(".catalogue").innerHTML += `
                        <h2 class="year-title">${anneeCourante}</h2>
                        <div class="year-grid" data-year="${anneeCourante}"></div>
                    `;

                    containerActuel = document.querySelector(`[data-year="${anneeCourante}"]`);
                }

                // ajouter la carte dans la grille de l'année
                containerActuel.innerHTML += `
                <div class="doc-card" data-id="${item.ID}">
                    <a>
                        <img>
                        <div class="overlay">
                            <span class="badge">En vedette</span>
                            <div class="info">
                                <h3 class="Titre"></h3>
                                <p class="Category"></p>
                            </div>
                        </div>
                    </a>
                </div>
                `;

                var id = item.ID;
                var card = document.querySelector(`[data-id="${item.ID}"]`);

                const img = card.querySelector("img");
                if(img && item.poster){
                    img.src = "../posters/"+ id + ".jpg";
                }

                const title = card.querySelector(".Titre");
                if(title && item.Titre){
                    title.textContent = item.Titre;
                }

                const cat = card.querySelector(".Category");
                if(cat && item.Category){
                    cat.textContent = item.Category;
                }

                const link = card.querySelector("a");
                if(link){
                    link.href = "film.html?id=" + item.ID;
                }

            }

        });

    }

});
