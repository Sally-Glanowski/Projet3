// let token = récupération de cette clé :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
//eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.
//JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"pour obtenir 
//l'autorisation dans swagger et stocker le token

let token = localStorage.getItem("token"); // permet un acces constant des donnée API

// FILTRE DE LA GALERIE:

const boutons = document.querySelectorAll('.buttons button');//je selectionne tous les boutons
let imgs = []

// -------------------------------------------------------------------------------------

// Met la classe sur le bouton selectionné par le click (car il est callback dans filter img)
function affichageBoutonClique(e) {
    boutons.forEach(btn => {
        btn.classList.remove('btn-clicked');
    });
    e.target.classList.add('btn-clicked');
}

function filtrerPhotos(e) {
  affichageBoutonClique(e);
    imgs.forEach(img => {
        // Va dans toute les images et les remet par défaut en expand
      img.classList.remove('img-shrink');
      img.classList.add('img-expand')

    //   va chercher les donné des images et des boutons 
      const imgType = parseInt(img.dataset.img);
      const btnType = parseInt(e.target.dataset.btn);
    
    //   si la donné du bouton ne correspond pas la donné image applique la classe shrink
      if(imgType!== btnType) {
        img.classList.remove('img-expand');
        img.classList.add('img-shrink');
      }
    });
}   

// Le premier bouton ramene toutes les images en grand et se met en surbrillance
function toutes() {
    boutons[0].addEventListener('click', (e) => {
      affichageBoutonClique(e)
        imgs.forEach(img => {
        img.classList.remove('img-shrink');
        img.classList.add('img-expanded');
        });
        });
}
 // selectionne l'ensemble des boutons et active celui qui est cliqué avec la fonction "filtrerPhotos"
function activerFiltre() {
    for(let i = 1; i < boutons.length; i++) {
        boutons[i].addEventListener('click', filtrerPhotos);
        }
}

// -----------------------------------------------------------------------------------------------

// ------- Affiche les photo dans la gallerie ------------------------------

function afficherPhoto() {
    fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.gallery').innerHTML = '';

        data.forEach(element => {
            photoGallery(element)    
        });
        data.forEach(element => {
            photoModal(element)
        })
        imgs = document.querySelectorAll('.gallery figure');
        activerFiltre()
        toutes()
        document.querySelectorAll('.trash').forEach(element => {
          element.addEventListener('click', deleteImg); 
        });
        
    })
}
afficherPhoto()

let counter = 0;
// Crée les éléments figure etc pour chaque photo 
function photoGallery(element) {
  counter++
    const figure = document.createElement("figure");
    figure.setAttribute("data-img", `${element.categoryId}`);
    figure.setAttribute("data-id", `${counter}`);
    figure.setAttribute('id', `figure-${element.id}`)
     let newFigure = document.querySelector(".gallery").appendChild(figure);
    newFigure.innerHTML = `<img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous" ">
    <figcaption>${element.title}</figcaption>`;
