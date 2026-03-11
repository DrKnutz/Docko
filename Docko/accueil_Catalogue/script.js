/* window.addEventListener("scroll", function () {
    const header = document.getElementById("main-header");

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv", {
    download: true,
    header: true,
    complete: function(results) {
        console.log(results);
        results.data.forEach(element => {
            console.log(element["Credits_1"])
            
        });
    }
});
 */

// Chemin vers ton fichier CSV
const urlFichierCSV = "EIDR Tableau - Feuille 1.csv";

// Sélectionner les deux zones où l'on va injecter les films
// Le [0] correspond au premier carrousel (En vedette) et le [1] au deuxième (Dernière fournée)
/*const carrousels = document.querySelectorAll('.carousel-track');
const pisteVedette = carrousels[0];
const pisteDerniereFournee = carrousels[1];

// Fonction pour créer le code HTML d'une carte documentaire
function creerCarteHTML(documentaire, texteBadge) {
    // ATTENTION : Remplace 'Image', 'Titre' et 'Categorie' par les vrais noms de tes colonnes CSV !
    const urlImage = documentaire.Image; // Exemple : images/58_Eduquer.png
    const titre = documentaire.Titre;    // Exemple : Éduquer selon les règles
    const categorie = documentaire.Categorie; // Exemple : Social
    const lien = documentaire.Lien; // Exemple : page.html (optionnel)

    // On construit la carte HTML (avec une condition pour ajouter un lien s'il existe)
    let carteHTML = `<div class="doc-card">`;
    
    if (lien) {
        carteHTML += `<a href="${lien}" class="card-link"></a>`;
    }

    carteHTML += `
        <img src="${urlImage}" alt="Affiche de ${titre}">
        <div class="overlay">
            <span class="badge">${texteBadge}</span>
            <div class="info">
                <h3>${titre}</h3>
                <p>${categorie}</p>
            </div>
        </div>
    </div>`;

    return carteHTML;
}

// Lecture du fichier CSV avec PapaParse
Papa.parse(urlFichierCSV, {
    download: true,
    header: true, // Permet d'utiliser les noms de colonnes du CSV
    skipEmptyLines: true,
    complete: function(resultats) {
        const baseDeDonnees = resultats.data;
        
        // Vider les carrousels actuels (pour remplacer le code HTML écrit en dur)
        pisteVedette.innerHTML = '';
        pisteDerniereFournee.innerHTML = '';

        // Exemple : On prend les 5 premiers éléments pour "En vedette"
        for (let i = 0; i < 5; i++) {
            // On vérifie que l'élément existe bien dans le tableau
            if (baseDeDonnees[i]) {
                const nouvelleCarte = creerCarteHTML(baseDeDonnees[i], "En vedette");
                pisteVedette.innerHTML += nouvelleCarte;
            }
        }

        // Exemple : On prend les 5 éléments suivants (de l'index 5 à 9) pour "Dernière fournée"
        for (let i = 5; i < 10; i++) {
            if (baseDeDonnees[i]) {
                const nouvelleCarte = creerCarteHTML(baseDeDonnees[i], "Dernière fournée");
                pisteDerniereFournee.innerHTML += nouvelleCarte;
            }
        }
        
        console.log("Les films ont été chargés avec succès depuis le CSV !");
    },
    error: function(erreur) {
        console.error("Erreur lors du chargement du fichier CSV :", erreur);
    }
});*/

// L'URL de ton tableau Google Sheets converti en CSV
const urlGoogleSheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1Q8vZ5reRYhGlwqQDLXTNyRh9dhWMlw_iaIB5sL5-tPV8LgmKDu-D7YMNh_bcXVczM34lhd0l9aE/pub?gid=0&single=true&output=csv";

// Sélectionner les deux zones où l'on va injecter les films
const carrousels = document.querySelectorAll('.carousel-track');
const pisteVedette = carrousels[0];
const pisteDerniereFournee = carrousels[1];

// Fonction pour créer le code HTML d'une carte documentaire
function creerCarteHTML(documentaire, texteBadge) {
    // IMPORTANT : Les mots Image, Titre, Categorie et Lien doivent correspondre
    // EXACTEMENT aux noms des colonnes (la première ligne) dans ton Google Sheets.
    // S'ils sont différents, modifie-les ici.
    const urlImage = documentaire.Image;
    const titre = documentaire.Titre;
    const categorie = documentaire.Categorie;
    const lien = documentaire.Lien;

    // On construit la carte HTML
    let carteHTML = `<div class="doc-card">`;

    // Ajoute le lien uniquement si la case n'est pas vide dans le tableau
    if (lien && lien.trim() !== "") {
        carteHTML += `<a href="${lien}" class="card-link"></a>`;
    }

    carteHTML += `
        <img src="${urlImage}" alt="Affiche de ${titre}">
        <div class="overlay">
            <span class="badge">${texteBadge}</span>
            <div class="info">
                <h3>${titre}</h3>
                <p>${categorie}</p>
            </div>
        </div>
    </div>`;

    return carteHTML;
}
// Lecture des données directement depuis Google Sheets avec PapaParse
Papa.parse(urlGoogleSheets, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (resultats) {
        const baseDeDonnees = resultats.data;

        // Vider les carrousels actuels (supprime les fausses données du HTML)
        if (pisteVedette) pisteVedette.innerHTML = '';
        if (pisteDerniereFournee) pisteDerniereFournee.innerHTML = '';

        // Injecter les 5 premiers éléments (lignes 2 à 6 du tableur) pour "En vedette"
        for (let i = 0; i < 5; i++) {
            if (baseDeDonnees[i]) {
                const nouvelleCarte = creerCarteHTML(baseDeDonnees[i], "En vedette");
                if (pisteVedette) pisteVedette.innerHTML += nouvelleCarte;
            }
        }
        // Injecter les 5 éléments suivants (lignes 7 à 11 du tableur) pour "Dernière fournée"
        for (let i = 5; i < 10; i++) {
            if (baseDeDonnees[i]) {
                const nouvelleCarte = creerCarteHTML(baseDeDonnees[i], "Dernière fournée");
                if (pisteDerniereFournee) pisteDerniereFournee.innerHTML += nouvelleCarte;
            }
        }

        console.log("Les films ont été chargés avec succès depuis Google Sheets !");
        console.log(baseDeDonnees); // Affiche les données dans la console pour vérifier
    },
    error: function (erreur) {
        console.error("Erreur lors du chargement des données Google Sheets :", erreur);
    }
});
