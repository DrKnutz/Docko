const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv";

const params = new URLSearchParams(window.location.search);
const tagParam = params.get("tag");

Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results){

        const data = results.data;

        const container = document.querySelector(".catalogue");
        container.innerHTML = "";

        const title = document.getElementById("categoryTitle");
        if(title){
            title.textContent = tagParam || "Tous les tags";
        }

        data.forEach(item => {

            if(!item.Tags) return;

            const tags = item.Tags.split(",").map(t => t.trim());

            if(tagParam == null || tags.includes(tagParam)){

                const card = document.createElement("div");
                card.className = "doc-card";

                card.innerHTML = `
                    <a href="film.html?id=${item.ID}">
                        <img src="../posters/${item.ID}.jpg">
                        <div class="overlay">
                            <div class="info">
                                <h3>${item.Titre}</h3>
                                <p>${item.Category}</p>
                            </div>
                        </div>
                    </a>
                `;

                container.appendChild(card);
            }
        });

    }
});

