document.addEventListener('DOMContentLoaded', function () {
    const dogList = document.getElementById('dogList');
    const editForm = document.getElementById('editForm');
    const editedNameInput = document.getElementById('editedName');
    const editedBreedInput = document.getElementById('editedBreed');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const addDogButton = document.getElementById('addDogButton');
    const addDogModal = new bootstrap.Modal(document.getElementById('addDogModal'));
    const addDogForm = document.getElementById('addDogForm');
    const dogAPIUrl = 'https://APIFlask_Flavien.defflavien.repl.co/api/dogs'; // L'URL API Flask

    let dogs = [];

    // Fetch dogs when the page loads
    fetchDogs();

    // Function to fetch and display dogs
    function fetchDogs() {
        fetch(dogAPIUrl)
            .then(response => response.json())
            .then(data => {
                dogs = data.res;
                displayDogs();
            })
            .catch(error => console.error('Error fetching dogs:', error));
    }

    // Function to display dogs on the page
    function displayDogs() {
        dogList.innerHTML = '';
        Object.keys(dogs).forEach(key => {
            const dog = dogs[key];
            const card = document.createElement('div');
            card.classList.add('col', 'mb-3');
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${dog.race}</h5>
                        <img src="${dog.img}" alt="${dog.race}" class="card-img-top">
                        <button type="button" class="btn btn-primary edit-button" data-bs-toggle="modal" data-bs-target="#editModal" data-dog-id="${dog.id}">Edit</button>
                    </div>
                </div>
            `;
            dogList.appendChild(card);
        });
    }

    // Event listener for edit buttons
    dogList.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-button')) {
            const dogId = event.target.getAttribute('data-dog-id');
            const dog = dogs.find(dog => dog.id === dogId);
            if (dog) {
                editedNameInput.value = dog.name;
                editedBreedInput.value = dog.breed;
                editForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    const newName = editedNameInput.value;
                    const newBreed = editedBreedInput.value;
                    // Update the dog information (You need to implement the API call to update the dog information)
                    console.log('New Name:', newName);
                    console.log('New Breed:', newBreed);
                    // Close the modal
                    editModal.hide();
                    // Refresh the dog list
                    fetchDogs();
                });
            }
        }
    });

    // Event listener for modal hidden event
    editModal._element.addEventListener('hidden.bs.modal', function () {
        // Clear form inputs when modal is closed
        editedNameInput.value = '';
        editedBreedInput.value = '';
        editForm.removeEventListener('submit', function () {});
    });

    // Event listener for add dog button
    addDogButton.addEventListener('click', function () {
        addDogModal.show();
    });

    // Event listener for add dog form submission
    addDogForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const newDogRace = document.getElementById('newDogRace').value;
        const newDogImg = document.getElementById('newDogImg').value;
        const newDogData = {
            race: newDogRace,
            img: newDogImg
        };
        // Call a function to add the new dog
        addNewDog(newDogData);
        // Clear the form inputs
        document.getElementById('newDogRace').value = '';
        document.getElementById('newDogImg').value = '';
    });

    // Function to add a new dog
    function addNewDog(newDogData) {
        fetch(dogAPIUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDogData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('New dog added:', data);
            // Refresh the dog list
            fetchDogs();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});
