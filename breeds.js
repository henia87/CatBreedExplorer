import { initSearch } from "./search.js";

let url = window.location.search;
let params = new URLSearchParams(url);

async function fetchBreeds() {
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("d-none");

    try {
        const response = await fetch("/.netlify/functions/fetch-cat-breeds");
        if(!response.ok) {
            throw new Error(`Failed to fetch data, status: ${response.status}`);
        }
        const data = await response.json();
        displayBreeds(data);
    }
    catch(error) {
        console.error(`Error fetching data: ${error}`);
        showError();
    }
    finally {
        spinner.classList.add("d-none");
    }
}

function showError() {
    document.getElementById("errorMessage").classList.remove("d-none"); 
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";
}

function displayBreeds(data) {
    const breedRow = document.getElementById("breedRow");
    breedRow.innerHTML = data.map(breed => {
        const imgUrl = breed.image?.url || './images/cat-line-icon.jpg';
        let description = breed.description.length < 150
            ? breed.description + '&nbsp;'.repeat(150 - breed.description.length)
            : breed.description.slice(0, 147) + '...';
        return `
            <div class="col-sm-12 col-md-6 col-lg-3 my-4">
                <div class="card" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="${breed.name}" title="${breed.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${breed.name}</h5>
                        <p class="card-text" >${description}</p>
                        <a href="./uniqueBreed.html?breed=${breed.id}" class="btn btn-secondary mt-auto">More info</a>
                    </div>
                </div>
            </div>
            `;
    }).join('');
}

window.onload = () => {
    initSearch("searchInput", "suggestions");
    fetchBreeds();
}