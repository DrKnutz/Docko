

let historique = [];

function changerImage(element) {

  let imagePrincipale = document.getElementById("1");

  // enregistrer l'image actuelle seulement si on est sur la place
  if (!imagePrincipale.src.includes("zoom")) {
    historique.push(imagePrincipale.src);
  }

  // cacher toutes les zones
  let zones = document.querySelectorAll(".placement, .droite, .objet");
  zones.forEach(z => z.classList.add("hidden"));

  // changer l'image
  let nouvelleImage = element.dataset.image;
  if (nouvelleImage) {
    imagePrincipale.src = nouvelleImage;
  }

  // afficher les objets du bon groupe
  let groupe = element.dataset.objets;
  if (groupe) {
    let objets = document.querySelectorAll("." + groupe);
    objets.forEach(obj => obj.classList.remove("hidden"));
  }

}

    function retour() {

  if (historique.length === 0) return;

  let imagePrincipale = document.getElementById("1");

  imagePrincipale.src = historique.pop();

  // cacher les objets
  document.querySelectorAll(".objet").forEach(o => o.classList.add("hidden"));

  // afficher les échoppes
  document.querySelectorAll(".placement, .droite").forEach(e => e.classList.remove("hidden"));

}

function retourAccueil() {
  window.location.href = "../index.html";
}