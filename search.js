export let breeds = [];

export async function fetchBreedNames() {
    try {
        const response = await fetch("/.netlify/functions/fetch-cat-breeds");
        if(!response.ok) {
            throw new Error(`Failed to fetch breeds, status: ${response.status}`);
        }
        const data = await response.json();
        breeds = data;
    }
    catch(error) {
        console.error(`Error fetching breeds, search does not work: ${error}`);
    }
}

export function showSuggestions(inputValue, suggestions) {
    const filteredBreeds = breeds
        .filter((breed) =>
            breed.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 5);

    suggestions.textContent = "";
    suggestions.replaceChildren();

    if(filteredBreeds.length === 0) {
        const noResult = document.createElement("p");
        noResult.textContent = "No results found";
        noResult.classList.add("suggestions-item");
        suggestions.appendChild(noResult);
    }
    else {
        suggestions.replaceChildren(...filteredBreeds
            .map((breed) => {
                const suggestionItem = document.createElement("a");
                suggestionItem.textContent = breed.name;
                suggestionItem.tabIndex = -1;
                suggestionItem.classList.add("suggestions-item");
                suggestionItem.setAttribute("href", breed.id ? `./uniqueBreed.html?breed=${breed.id}` : "./error.html");
                suggestionItem.classList.add("d-block");
                return suggestionItem;
            })
        );
    }
}

export async function initSearch(inputId, suggestionsId) {
    await fetchBreedNames();
    
    const searchInput = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);

    searchInput.addEventListener("input", ({ target }) => {
        if(target.value.trim() === "") {
            suggestions.classList.add("d-none");
            suggestions.classList.remove("d-block");
            suggestions.textContent = "";
        }
        else {
            showSuggestions(target.value, suggestions);
            suggestions.classList.remove("d-none");
            suggestions.classList.add("d-block");
        }
    });

    searchInput.addEventListener("focus", ({ target }) => {
        if(target.value.trim() !== "") {
            showSuggestions(target.value, suggestions);
            suggestions.classList.remove("d-none");
            suggestions.classList.add("d-block");
        }
    });

    searchInput.addEventListener("focusout", () => {
        setTimeout(() => {
            suggestions.classList.add("d-none");
            suggestions.classList.remove("d-block");
        }, 100);
    });

    suggestions.addEventListener("click", (e) => {
        if(e.target.tagName === "A") {
            const href = e.target.getAttribute("href");
            if(href) {
                window.location.href = href;
            }
            else {
                window.location.href = "./error.html";
            }
            searchInput.value = e.target.textContent;
            suggestions.classList.add("d-none");
            suggestions.classList.remove("d-block");
        }
        searchInput.value = "";
    });
}

initSearch("searchInput", "suggestions");