var table = document.createElement("table");
table.classList.add("tableau");
var div = document.getElementById("div_grille");
const btHaut = document.getElementById("haut");
const btBas = document.getElementById("bas");
const btGauche = document.getElementById("gauche");
const btDroite = document.getElementById("droite");
const btremzero= document.getElementById("remzero")
var affs=document.getElementById("affScore")
var mouvement = true
let ran;
while (true) {
  ran = Math.floor(Math.random() * 30)
  if (ran >= 15&& ran <= 30) {
    break;
  }
}




let x=ran, y=Math.floor(x*(1.66))







//let table_monstrer=[]
function creationGrille(x,y){// fonction qui créer un tableau html de y.td par x.tr
  var table1 = document.createElement("table");
table1.classList.add("tableau");
for (let i = 0; i < x; i++) { 
  var ligne = document.createElement("tr");
  ligne.classList.add("ligne_tableau");

  for (let j = 0; j < y; j++) {
    var colone = document.createElement("td");
    colone.classList.add("colone_tableau");

    var image = document.createElement('img');// créer un element img qui sera le mur
    image.src = './img/img.png';
    image.setAttribute('alt','Image mur')

    colone.appendChild(image); // ajout de l'image dans le td
    ligne.appendChild(colone); // ajout du td dans le tr
  }

  table1.appendChild(ligne);// ajout du tr dans le tableau
}
return table1
}
table=creationGrille(x,y)

div.appendChild(table);// ajout du tableau dans le div_grille

let numAleatoire= y*Math.floor(x/2)-(Math.floor(x/2));

function terrain() { // fonction qui créer le sol du terrain en suprimant les image du mur
  var numCelluleTerrain = []; // tableau qui contient les numero de cellule du sol du terrain
  let compteur = 0;

   numCelluleTerrain.push(numAleatoire); // ajout de la cellule au tableau des cellule

  while (compteur < (Math.floor((x*y)/6))) { // une boucle qui creer un nombre de cellule obtenu par l'operation (x*y/6 arrondi a l'entier) cellule sol de du terrain aleatoirement en respectant l'obligation d'une presence d'une cellule qui soit a -1 ou +1 ou -25 ou + 25 dans le tableau des cellule
    numAleatoire = Math.floor(Math.random() * x*y);
    if (!numCelluleTerrain.includes(numAleatoire) && (numCelluleTerrain.includes(numAleatoire - y) || numCelluleTerrain.includes(numAleatoire + y) || numCelluleTerrain.includes(numAleatoire - 1) || numCelluleTerrain.includes(numAleatoire + 1))) {
      numCelluleTerrain.push(numAleatoire);
      compteur++;
    }
  }

  /* une fois la liste des cellule a été créée maintenant on va suprimer les images du mur qui sont dans les cellule présentes dans cette liste*/


  for (let i = 0; i < ((x*y)-1); i++) { // une boucle pour creer le sol du terrain en suprimant les image pésente dans le tableau numCelleTerrain
    if (numCelluleTerrain.includes(i)) {
      var cellules = document.querySelectorAll(".colone_tableau");// variable qui stock les cellule de la grille
      var imageASupprimer = cellules[i].querySelector("img"); // variable qui stock les element de type "img"

      
        imageASupprimer.remove(); // commande pour suprimer cette image
      cellules[i].classList.add("sol")
    }
  }

  return numCelluleTerrain; // retourner un tableau qui contient le numero des cellule du sol pour le réutiliser
}



var numTresor = []; // tableau qui stock les cellules des tresor
var numMonster = []; // tableau qui stock les cellule des monstre
var jeux = terrain(); // variable qui stocke les cellule du sol de terrain obtenu de la fonction terrain()
var joueur = [];  // variable qui stock la cellule du joueur

function jeu(jeux) {
  let compteur2 = 0;

  // Placement des monstres
  while (compteur2 < Math.floor((x * y) / 125)) {
    numAleatoire = Math.floor(Math.random() * jeux.length);
    let j = jeux[numAleatoire];
    var cellules = document.querySelectorAll(".colone_tableau");
    if (!numMonster.includes(j)) {
      var image = document.createElement("img");
      image.src = './img/monster.png';
      image.setAttribute('alt', 'Image Monstre');
      cellules[j].appendChild(image);
      numMonster.push(j);
      compteur2++;
    }
  }

  let compteur3 = 0;

  // Placement des trésors
  while (compteur3 < Math.floor((x * y) / 125)) {
    numAleatoire = Math.floor(Math.random() * jeux.length);
    let j = jeux[numAleatoire];
    var cellules = document.querySelectorAll(".colone_tableau");
    if (!numMonster.includes(j) && !numTresor.includes(j)) {
      var image = document.createElement("img");
      image.src = './img/tresor.png';
      image.setAttribute('alt', 'Image tresor');
      cellules[j].appendChild(image);
      numTresor.push(j);
      compteur3++;
    }
  }

  let j;

  // Placement aléatoire du joueur
  while (true) {
    numAleatoire = Math.floor(Math.random() * jeux.length);
    j = jeux[numAleatoire];
    if (!numMonster.includes(j) && !numTresor.includes(j)) {
      break;
    }
  }

  var cellules = document.querySelectorAll(".colone_tableau");

  if (!numMonster.includes(j) && !numTresor.includes(j)) {
    var image = document.createElement("img");
    image.src = './img/joueur.png';
    image.setAttribute('alt', 'Image joueur');
    image.classList.add("joueur");
    cellules[j].appendChild(image);
    joueur = [j];
  }
}

jeu(jeux);

let scorre = 0;

function deplacementJoueur(valeur) {
  if (mouvement) {
    let position = joueur[0];
    position = position + valeur;
    if (jeux.includes(position) && !numMonster.includes(position)) {
      var cellules = document.querySelectorAll(".colone_tableau");
      var image = document.createElement("img");
      image.src = './img/joueur.png';
      image.setAttribute('alt', 'Image joueur');
      image.classList.add("joueur");
      cellules[position].appendChild(image);
      cellules[position - valeur].querySelector("img").remove();
      joueur = [position];
      if (numTresor.includes(position)) {
        cellules[position].querySelector("img").remove();
        let index = numTresor.indexOf(position);
        numTresor.splice(index, 1);
        scorre = scorre + 1;
      }
    } else {
      position = position - valeur;
    }
    affs.textContent = scorre;
    gagner();
  }
}

function gagner() {
  if (scorre === Math.floor((x * y) / 125)) {
    let gagner = document.createElement("p");
    gagner.innerText = "Vous avez gagné !";
    gagner.style.position = "fixed";
    gagner.style.top = "20%";
    gagner.style.marginLeft = "40%";
    gagner.style.backgroundColor = "black";
    gagner.style.fontSize = "5em";
    gagner.style.color = "green";
    document.body.append(gagner);
    mouvement = false;
  }
}

// Fonction pour gérer le déplacement des monstres
function deplacementMonstre() {
  if (mouvement) {
    // Boucle à travers tous les monstres
    for (let i = 0; i < numMonster.length; i++) {
      var cellules = document.querySelectorAll(".colone_tableau");
      var image = document.createElement("img");
      image.src = './img/monster.png';
      image.setAttribute('alt', 'Image de monstrer');
      let tentative = 0;

      // Tentatives de déplacement du monstre (maximum 100)
      while (tentative < 100) {
        numAleatoire = Math.floor(Math.random() * 4);
        let a = tableau_position[numAleatoire];
        let l = numMonster[i];

        if (numMonster.includes(l + a) || numTresor.includes(l + a)) {
          break;
        }

        // Vérification des conditions pour déplacer le monstre
        if (
          !numTresor.includes(l + a) &&
          jeux.includes(l + a) &&
          !numMonster.includes(l + a)
        ) {
          if (joueur == l + a) {
            cellules[l + a].querySelector("img").remove();
            cellules[l + a].appendChild(image);
            numMonster[i] = l + a;

            cellules[l].querySelector("img").remove();

            // Afficher un message de défaite
            let perdu = document.createElement("p");
            perdu.innerText = "Vous avez perdu...";
            perdu.style.position = "fixed";
            perdu.style.top = "20%";
            perdu.style.marginLeft = "40%";
            perdu.style.backgroundColor = "black";
            perdu.style.fontSize = "5em";
            perdu.style.color = "red";
            document.body.append(perdu);
            mouvement = false;
          } else {
            cellules[l + a].appendChild(image);
            numMonster[i] = l + a;
            cellules[l].querySelector("img").remove();
          }
          break;
        }
        tentative++;
      }
    }
  }
}

// Tableau des positions relatives pour le déplacement des monstres
let tableau_position = [-y, -1, 1, y];

// Ajout des événements pour les boutons de déplacement
if (mouvement) {
  btHaut.addEventListener("click", function () {
    deplacementJoueur(-y), deplacementMonstre();
  });

  btBas.addEventListener("click", function () {
    deplacementJoueur(y), deplacementMonstre();
  });

  btDroite.addEventListener("click", function () {
    deplacementJoueur(1), deplacementMonstre();
  });

  btGauche.addEventListener("click", function () {
    deplacementJoueur(-1), deplacementMonstre();
  });

  btremzero.addEventListener("click", function () {
    window.location.reload(true);
  });

  // Écouteur pour les touches fléchées du clavier
  document.addEventListener("keydown", function (event) {
    if (event.key === 'ArrowUp') {
      deplacementJoueur(-y);
      deplacementMonstre();
    } else if (event.key === 'ArrowDown') {
      deplacementJoueur(y);
      deplacementMonstre();
    } else if (event.key === 'ArrowLeft') {
      deplacementJoueur(-1);
      deplacementMonstre();
    } else if (event.key === 'ArrowRight') {
      deplacementJoueur(1);
      deplacementMonstre();
    }
  });

  affs.textContent = scorre;
}