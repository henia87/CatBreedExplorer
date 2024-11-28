import { initSearch } from "./search.js";

let url = window.location.search;
let params = new URLSearchParams(url);
let breedId = params.get("breed");

async function fetchUniqueBreed() {
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("d-none");

    try {
        const response = await fetch(`/.netlify/functions/fetch-unique-breed?breed=${breedId}`);
        if(!response.ok) {
            console.error(`Failed to fetch data, status: ${response.status}`);
            throw new Error(`Failed to fetch data, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data: ", data);
        displayBreedInfo(data.breed);

        const imgUrl = data.imageUrl || "./images/cat-line-icon.jpg";
        updateImage(imgUrl);
    }   
    catch(error) {  
        console.error(`Error fetching data: ${error}`);
        showError();
    }
}

function updateImage(imgUrl) {
    const imgElement = document.querySelector("#uniqueBreedRow img");
    const spinner = document.getElementById("spinner");

    if(imgElement && imgUrl) {
        imgElement.src = imgUrl ? imgUrl : "./images/cat-line-icon.jpg";

        imgElement.onload = () => {
            spinner.classList.add("d-none");
            imgElement.classList.remove("d-none");
        };

        imgElement.onerror = () => {
            spinner.classList.add("d-none");
            imgElement.src = "./images/cat-line-icon.jpg";
            showError();
        }
    }
    else {
        spinner.classList.add("d-none");
    }
}

function showError() {
    document.getElementById("errorMessage").classList.remove("d-none"); 
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";
}

function switchCharacteristics(characteristic) {
    switch(characteristic) {
        case 0:
            return 0;
        case 1:
            return 20;
        case 2:
            return 40;
        case 3:
            return 60;
        case 4:
            return 80;
        case 5:
            return 100;
        default:
            return "No data";
    }
}

function createCharacteristicHtml(characteristic, value) {
    let characteristicValue = switchCharacteristics(value);
    return `
        <h6>${characteristic}:</h6>
        <div class="progress my-1" role="progressbar" aria-valuenow="${characteristicValue}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width: ${characteristicValue}%">${value}</div>
        </div>
    `;
}

function displayBreedInfo(breed) {
    const uniqueBreedRow = document.getElementById("uniqueBreedRow");
    uniqueBreedRow.innerHTML = `
        <div class="col-12 my-2">
            <div class="d-flex justify-content-between align-items-center my-2">
                <h1>${breed.name}</h1>    
                <div class="d-grid gap-2">
                    <button type="button" class="btn btn-secondary"><a class="link-light link-underline link-underline-opacity-0" href="./breeds.html">Back</a></button>
                </div>
            </div>
            
            <hr>

            <div class="position-relative">
                <div class="spinner-border" id="spinner" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <img class="img-thumbnail w-50 my-2 d-none" src="./images/cat-line-icon.jpg" alt="${breed.name}" title="${breed.name}">
            </div>

            <h5 class="my-2">${breed.description}</h5>

            <hr>

            <h5 class="my-3">Basic data:</h5>

            <h6>Origin:</h6>
            <p>${breed.origin} (${breed.country_code})</p>

            <h6>Weight:</h6>
            <p>${breed.weight.metric} kg</p>

            <h6>Life span:</h6>
            <p>${breed.life_span} years</p>

            <h6>Temperament:</h6>
            <p>${breed.temperament}</p>

            <hr>

            <h5 class="my-3">Characteristics:</h5>

            ${createCharacteristicHtml("Adaptability", breed.adaptability)}
            ${createCharacteristicHtml("Affection level", breed.affection_level)}
            ${createCharacteristicHtml("Child friendly", breed.child_friendly)}
            ${createCharacteristicHtml("Dog friendly", breed.dog_friendly)}
            ${createCharacteristicHtml("Stranger friendly", breed.stranger_friendly)}
            ${createCharacteristicHtml("Energy level", breed.energy_level)}
            ${createCharacteristicHtml("Grooming", breed.grooming)}
            ${createCharacteristicHtml("Health issues", breed.health_issues)}
            ${createCharacteristicHtml("Intelligence", breed.intelligence)}
            ${createCharacteristicHtml("Shedding level", breed.shedding_level)}
            ${createCharacteristicHtml("Social needs", breed.social_needs)}
            ${createCharacteristicHtml("Vocalisation", breed.vocalisation)}
          </div>
        </div>
    `
}

window.onload = () => {
    initSearch("searchInput", "suggestions");
    fetchUniqueBreed();
}