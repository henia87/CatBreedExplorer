import { api_key } from "./constants.js";
import { initSearch } from "./search.js";

async function fetchRandomImages() {
    try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=100&size=full&api_key=${api_key}`);
        if(!response.ok) {
            throw new Error(`Failed to fetch data, status: ${response.status}`);
        }
        const data = await response.json();
        displayRandomImages(data);
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

function displayRandomImages(data) {
    const spinner = document.getElementById("spinner");
    spinner.classList.add("d-none");

    const carouselImages = document.getElementById("carouselImages");
    carouselImages.innerHTML = data.map((image, index) => {
        const active = index === 0 ? 'active' : '';
        return `
            <div class="carousel-item ${active}">
                <div class="image-grid">
                    <div class="image-container ratio ratio-1x1">
                        <img src="${image.url}" alt="Cat Image ${index + 1}" class="d-block w-100 h-100 border rounded object-fit-cover">
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.onload = () => {
    initSearch("searchInput", "suggestions");
    fetchRandomImages();
}