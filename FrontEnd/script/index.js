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

    //   va chercher les données des images et des boutons 
      const imgType = parseInt(img.dataset.img);
      const btnType = parseInt(e.target.dataset.btn);
    
    //   si la donnée du bouton ne correspond pas la donnée image, applique la classe shrink
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

// ------- Affiche les photos dans la gallerie ------------------------------

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
}

//

function photoModal(element) {
  let figure = document.createElement("figure");
  figure.setAttribute('id', `figure-${element.id}`);
  let newFigureModal = document
        .querySelector(".modal__gallery")
        .appendChild(figure);
      newFigureModal.classList.add("modal__figure");
      newFigureModal.innerHTML = `<i class="direction fa-solid fa-arrows-up-down-left-right" style="display: none;"></i>
          <i class=" trash fa-solid fa-trash-can" id="${element.id}"></i><img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous">
          <figcaption>éditer</figcaption>`;
}
// ------------------------------------------------------------------------------------------

// Apparition et disparition des modales

function ouvrirModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.style.display = null;
  modal.setAttribute('aria-modal', 'true');
  eventPropagation(modal);
}

function fermerModal() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
    modal.setAttribute('aria-modal', 'false');
  });
  document.getElementById('photo-submit').reset();
  chosenImage.setAttribute('src', '');
  titleValue = null;
  btnValue = null;
  imageSelected = null;
  document.querySelector('.label-file').removeAttribute("style");
}

function eventPropagation(modal) {
  modal
    .querySelector('.js-modal-stop')
    .addEventListener('click', stopPropagation);
  modal.addEventListener('click', fermerModal);
}

function stopPropagation(event) {
  event.stopPropagation();
}

document.querySelector('.js-modal').addEventListener('click', function(event) {
  event.preventDefault();
  ouvrirModal('.modal');
});

document.querySelector('.js-modal-Form').addEventListener('click', function(event) {
  event.preventDefault();
  fermerModal();
  ouvrirModal('#modal-Form');
});

const closeModalButtons = document.querySelectorAll('.js-close-modal');
closeModalButtons.forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    fermerModal();
  });
});


document.querySelector('.backward').addEventListener('click', function(event) {
  event.preventDefault();
  fermerModal();
  ouvrirModal('.modal');
});

document.querySelector('.js-modal-stop').addEventListener('click', function(event) {
  if (event.target === this) {
    fermerModal();
  }
});



// ---------------------------------------------------------------------------------------------------

// supression de l'image
let galleryModal = document.querySelector('.modal__gallery');

function deleteImg(e) {
let id = e.target.id;
let figureModal = galleryModal.querySelector(`#figure-${id}`);
console.log(figureModal)
figureModal.remove()
let figure = gallery.querySelector(`#figure-${id}`);
console.log(figure)
figure.remove()

fetch("http://localhost:5678/api/works/" + id, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`
  }
}
.then(res => {
  if (res.ok) {
    return res.json();
  }
  throw new Error(res.statusText);
})

.then(data => {
  afficherPhoto()
})
.catch((err) => {})


// Gestion ajout de l'image

let photoForm = document.getElementById('photo-submit');
const submitButton = photoFormquerySelector('input[type^="sub"]');
let btnValue = null;
let titleValue= null;
document.getElementById('category').addEventListener('change', (e) => {
titleValue = document.getElementById('name').value;
btnValue = e.target.options[e.target.selectedIndex].getAttribute('data-btn');
})

let uploadButton = document.getElementById('upload-button');
let chosenImage = document.getElementById('chosen-image');
let fileName = document.getElementById('file-name');

let imageSelected = null;

uploadButton.onchange = () => {
let reader = new FileReader(); 
reader.readAsDataURL(uploadButton.files[0]);
imageSelected = uploadButton.files[0]
reader.onload = () => {
    chosenImage.setAttribute('src',reader.result)
}
let labelClass =ocument.querySelector('.label-file');
labelClass.style.display = 'none';
}

photoForm.addEventListener("submit", function(e){
e.preventDefault();
if (!titleValue || !btnValue ) {
  document.querySelector('.error-message').innerHTML ="Vous devez remplir tous les champs du formulaire"
  // console.error("Vous devez remplir tous les champs du formulaire");
  return;
} else {
  document.querySelector('.error-message').innerHTML = ""
}

let formData = new FormData();
formData.append("image", imageSelected)
formData.append("title", titleValue )
formData.append('category', btnValue)
fetch("http://localhost:5678/api/works", {
  method: "POST",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + token 
  },
  body: formData,
})
.then(res => res.json())
.then(data => {
  afficherPhoto()
})
.catch((err) => {})
fermerModal();
})

// -------------- Gestion login et logout -----------

if(localStorage.getItem("token")) {
  document.querySelector('.login__btn').innerText = "logout"
  const modalOpener = document.querySelector(".modal__link");
  modalOpener.style.display = null;
  const editionMode = document.querySelector(".edition-mode__container");
  
  let categoryButtons = document.querySelector('.buttons');
  categoryButtons.style.display = "none"
  if(document.querySelector('.login__btn').innerText === "logout") {
    document.querySelector('.login__btn').addEventListener('click', () => {
      localStorage.clear()
      window.location.href = "./assets/pages/index.html"
    })
  }
}
