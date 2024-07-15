const ideaForm = document.getElementById('ideaForm');
const libelleInput = document.getElementById('libelle');
const categorieSelect = document.getElementById('categorie');
const messageTextarea = document.getElementById('message');
const messageContainer = document.getElementById('messageContainer');
const ideasCardContainer = document.getElementById('ideasCardContainer');

// Tableau pour stocker les idées soumises
let ideas = [];

// Vérifier s'il y a des idées sauvegardées dans localStorage et les charger
if (localStorage.getItem('ideas')) {
    ideas = JSON.parse(localStorage.getItem('ideas'));
    ideas.forEach(idea => displayIdea(idea));
}

// Écouter l'événement de soumission du formulaire
ideaForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs des champs du formulaire
    const libelle = libelleInput.value.trim();
    const categorie = categorieSelect.value;
    const message = messageTextarea.value.trim();

    let isValid = true;

    // Réinitialiser les messages d'erreur
    document.getElementById('libelleError').textContent = '';
    document.getElementById('messageError').textContent = '';
    messageContainer.textContent = '';

    // Valider le libellé
    if (!libelle || libelle.length < 3 || libelle.length > 10) {
        displayErrorMessage('libelle', 'Le libellé doit avoir entre 3 et 10 caractères.');
        isValid = false;
    } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(libelle)) {
        displayErrorMessage('libelle', 'Le libellé ne doit contenir que des lettres et des espaces.');
        isValid = false;
    }

    // Valider la catégorie
    if (!categorie) {
        displayErrorMessage('categorie', 'Veuillez sélectionner une catégorie.');
        isValid = false;
    }

    // Valider le message
    if (!message) {
        displayErrorMessage('message', 'Le message descriptif est requis.');
        isValid = false;
    }

    // Si tout est valide, soumettre le formulaire ou faire autre chose
    if (isValid) {
        const newIdea = {
            libelle: libelle,
            categorie: categorie,
            message: message,
            approved: false // Nouvelle idée est par défaut non approuvée
        };

        // Ajouter la nouvelle idée au tableau des idées
        ideas.push(newIdea);

        // Sauvegarder les idées dans localStorage
        localStorage.setItem('ideas', JSON.stringify(ideas));

        // Afficher la nouvelle idée
        displayIdea(newIdea);

        // Réinitialiser le formulaire
        ideaForm.reset();

        // Afficher un message de succès
        displayMessage('Votre idée a été soumise avec succès.', 'success');
    }
});

function displayMessage(message, type) {
    messageContainer.innerHTML = `<p class="${type}">${message}</p>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 2000); // Message disparaît après 2 secondes
}

function displayErrorMessage(elementId, message) {
    document.getElementById(elementId + 'Error').textContent = message;
}

function displayIdea(idea) {
    const card = createIdeaCard(idea);
    ideasCardContainer.appendChild(card);
}

function createIdeaCard(idea) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = idea.libelle;

    const cardCategory = document.createElement('p');
    cardCategory.textContent = `Catégorie: ${idea.categorie}`;

    const cardMessage = document.createElement('p');
    cardMessage.textContent = idea.message;

    const cardActions = document.createElement('div');
    cardActions.classList.add('card-actions');

    const approveButton = document.createElement('button');
    approveButton.textContent = idea.approved ? 'Désapprouver' : 'Approuver';
    approveButton.addEventListener('click', () => {
        idea.approved = !idea.approved;
        approveButton.textContent = idea.approved ? 'Désapprouver' : 'Approuver';
        card.classList.toggle('approved');
        localStorage.setItem('ideas', JSON.stringify(ideas));
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.addEventListener('click', () => {
        ideas = ideas.filter(i => i !== idea);
        ideasCardContainer.removeChild(card);
        localStorage.setItem('ideas', JSON.stringify(ideas));
    });

    cardActions.appendChild(approveButton);
    cardActions.appendChild(deleteButton);

    card.appendChild(cardTitle);
    card.appendChild(cardCategory);
    card.appendChild(cardMessage);
    card.appendChild(cardActions);

    if (idea.approved) {
        card.classList.add('approved');
    }

    return card;
}
