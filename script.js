document.getElementById('ideaForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire

    var libelle = document.getElementById('libelle').value;
    var categorie = document.getElementById('categorie').value;
    var message = document.getElementById('message').value;
    
    var isValid = true;

    // Réinitialiser les messages d'erreur
    document.getElementById('libelleError').textContent = '';
    document.getElementById('messageError').textContent = '';
    document.getElementById('messageContainer').textContent = '';

    // Vérifier si le libellé contient entre 3 et 10 mots
    var libelleWords = libelle.trim().split(/\s+/);
    if (libelleWords.length < 3 || libelleWords.length > 10) {
        displayMessage('Le libellé doit contenir entre 3 et 10 mots.', 'error');
        document.getElementById('libelleError').textContent = 'Le libellé doit contenir entre 3 et 10 mots.';
        isValid = false;
    }

    // Vérifier si le message contient entre 10 et 225 mots
    var messageWords = message.trim().split(/\s+/);
    if (messageWords.length < 10 || messageWords.length > 225) {
        displayMessage('Le message descriptif doit contenir entre 10 et 225 mots.', 'error');
        document.getElementById('messageError').textContent = 'Le message descriptif doit contenir entre 10 et 225 mots.';
        isValid = false;
    }

    // Vérifier si le libellé ou le message contient des balises HTML
    var htmlTagPattern = /<\/?[^>]+(>|$)/g;
    if (htmlTagPattern.test(libelle) || htmlTagPattern.test(message)) {
        displayMessage('Les balises HTML ne sont pas autorisées.', 'error');
        if (htmlTagPattern.test(libelle)) {
            document.getElementById('libelleError').textContent = 'Les balises HTML ne sont pas autorisées dans le libellé.';
        }
        if (htmlTagPattern.test(message)) {
            document.getElementById('messageError').textContent = 'Les balises HTML ne sont pas autorisées dans le message descriptif.';
        }
        isValid = false;
    }

    // Si tout est valide, soumettre le formulaire ou faire autre chose
    if (isValid) {
        var newIdea = {
            libelle: libelle,
            categorie: categorie,
            message: message,
            approved: false
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
    var messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = `<p class="${type}">${message}</p>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 2000); // Message disparaît après 2 secondes
}

function displayIdea(idea) {
    var card = createIdeaCard(idea);
    document.getElementById('ideasCardContainer').appendChild(card);
}

function createIdeaCard(idea) {
    var card = document.createElement('div');
    card.classList.add('card');

    var cardTitle = document.createElement('h3');
    cardTitle.textContent = idea.libelle;

    var cardCategory = document.createElement('p');
    cardCategory.textContent = `Catégorie: ${idea.categorie}`;

    var cardMessage = document.createElement('p');
    cardMessage.textContent = idea.message;

    var cardActions = document.createElement('div');
    cardActions.classList.add('card-actions');

    var approveButton = document.createElement('button');
    approveButton.textContent = idea.approved ? 'Désapprouver' : 'Approuver';
    approveButton.addEventListener('click', () => {
        idea.approved = !idea.approved;
        approveButton.textContent = idea.approved ? 'Désapprouver' : 'Approuver';
        
        if (idea.approved) {
            card.classList.add('approved');
            card.classList.remove('disapproved');
        } else {
            card.classList.add('disapproved');
            card.classList.remove('approved');
        }
        
        localStorage.setItem('ideas', JSON.stringify(ideas));
    });

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.addEventListener('click', () => {
        ideas = ideas.filter(i => i !== idea);
        document.getElementById('ideasCardContainer').removeChild(card);
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
    } else {
        card.classList.add('disapproved');
    }

    return card;
}

// Charger les idées depuis le localStorage
let ideas = [];
if (localStorage.getItem('ideas')) {
    ideas = JSON.parse(localStorage.getItem('ideas'));
    ideas.forEach(idea => displayIdea(idea));
}
