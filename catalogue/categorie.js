const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv";

const params = new URLSearchParams(window.location.search);
const catParam = params.get("cat");

console.log("hello");

Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results){

        const data = results.data;

        // -----------------
        // Affichage CATALOGUE
        // -----------------

       



            data.forEach(item => {
                if(catParam==item.Category || catParam==null){

            document.querySelector(".catalogue").innerHTML+=`<div class="doc-card" data-id="${item.ID}">
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
</div>`

                // image capsule
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

                // lien vers page film
                const link = card.querySelector("a");
                if(link){
                    link.href = "film.html?id=" + item.ID;
                }

            }});

        }

})
