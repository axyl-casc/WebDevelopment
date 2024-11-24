// Select HTML elements
const homeView = document.querySelector('#homeView');
const racesView = document.querySelector('#racesView');
const seasonSelect = document.querySelector('#seasonSelect');
const racesList = document.querySelector('#racesList');
const favoritesPopup = document.querySelector('#favoritesPopup');
const closeFavorites = document.querySelector('#closeFavorites');
const constructorPopup = document.querySelector('#constructorPopup');
const closeConstructorPopup = document.querySelector('#closeConstructorPopup');
const driverPopup = document.querySelector('#driverPopup');
const closeDriverPopup = document.querySelector('#closeDriverPopup');
const circuitPopup = document.querySelector('#circuitPopup');
const closeCircuitPopup = document.querySelector('#closeCircuitPopup');
const homeLink = document.querySelector('#homeLink');
const racesLink = document.querySelector('#racesLink');
const favoritesLink = document.querySelector('#favoritesLink');


// Utility function to fetch data from API or localStorage
async function fetchData(url, storageKey) {
    if (localStorage.getItem(storageKey)) {
        return JSON.parse(localStorage.getItem(storageKey));
    }
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
}

// Populate seasons dropdown
async function populateSeasons() {
    const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php'; // Update API endpoint
    const data = await fetchData(url, 'raceList');
    const uniqueYears = [...new Set(data.map(race => race.year))];
    uniqueYears.forEach(uniqueYear => {
        const option = document.createElement('option');
        option.value = uniqueYear;
        option.textContent = uniqueYear;
        seasonSelect.appendChild(option);
    });
    showView(homeView);
}

async function displayRaces(season) {
    const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
    const response = await fetchData(url, "races_to_display");
    console.log(response);
    localStorage.setItem("season", season);

    racesList.innerHTML = '';

    const buttonTemplate = document.querySelector("#button-template");
    response.forEach(race => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center py-2 border-b border-gray-300";

        li.innerHTML = `${race.round}. ${race.name}<br>(${race.date})`;
        const button = buttonTemplate.content.firstElementChild.cloneNode(true);
        button.textContent = "Results";
        button.addEventListener('click', () => displayRaceDetails(race));

        li.appendChild(button);
        racesList.appendChild(li);
    });
}


// Display race details
async function displayRaceDetails(race) {
    // API URLs
    const resultsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${race.round}`;
    const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${race.round}`;

    // Fetch results and qualifying data
    const results = await fetchData(resultsUrl, `results_${race.round}`);
    const qualifying = await fetchData(qualifyingUrl, `qualifying_${race.round}`);

    // hide selection message
    document.querySelector("#no-race").classList.add("hidden");

    // Show the raceDetailsView section
    document.getElementById('raceDetailsView').classList.remove('hidden');

    // Update the headers with race name and date
// Update the Qualifying Header
qualifyingHeader.innerHTML = `
    <h3 class="text-2xl font-bold mb-2">${race.name}</h3>
    <p class="text-gray-600">Year: ${race.year} - Round: ${race.round}</p>
    <h4 class="text-lg font-semibold mt-4">Qualifying</h4>
`;

// Update the Race Results Header
document.querySelector('#raceResultsHeader').innerHTML = `
    <br><br>
    <h4 class="text-lg font-semibold mt-4">Race Results</h4>
`;

    // Populate the Qualifying Table
    const qualifyingTableBody = document.getElementById('qualifyingTableBody');
    qualifyingTableBody.innerHTML = ''; // Clear previous content

    qualifying.forEach((qualify) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2" data-key="position">${qualify.position}</td>
            <td class="border px-4 py-2" data-key="driver">${qualify.driver.forename}<br>${qualify.driver.surname}</td>
<td class="border px-4 py-2" data-key="constructor">
    <button 
        class="underline"
        onclick="showConstructorPopup('${qualify.constructor.id}')">
        ${qualify.constructor.name}
    </button>
            <td class="border px-4 py-2" data-key="Q1">${qualify.q1 || 'N/A'}</td>
            <td class="border px-4 py-2" data-key="Q2">${qualify.q2 || 'N/A'}</td>
            <td class="border px-4 py-2" data-key="Q3">${qualify.q3 || 'N/A'}</td>
        `;
        qualifyingTableBody.appendChild(row);
    });

    // Populate the Race Results Table
    const raceResultsTableBody = document.getElementById('raceResultsTableBody');
    raceResultsTableBody.innerHTML = ''; // Clear previous content

    results.forEach((result) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2" data-key="position">${result.position}</td>
            <td class="border px-4 py-2" data-key="driver">${result.driver.forename}<br>${result.driver.surname}</td>
<td class="border px-4 py-2" data-key="constructor">
    <button 
        class="underline"
        onclick="showConstructorPopup('${result.constructor.id}')">
        ${result.constructor.name}
    </button>
</td>            <td class="border px-4 py-2" data-key="time">${result.time || 'N/A'}</td>
            <td class="border px-4 py-2">${result.points}</td>
        `;
        raceResultsTableBody.appendChild(row);
    });
}

async function showConstructorPopup(constructorId) {
    try {
        // Fetch constructor details
        const constructorDetailsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?id=${constructorId}`;
        const constructor = await fetchData(constructorDetailsUrl, `constructor_${constructorId}`);
        
        if (!constructor) {
            console.error("Constructor not found.");
            return;
        }

        console.log(constructor);

        // Populate the constructor details
        const detailsContainer = document.getElementById('constructorDetails');
        detailsContainer.innerHTML = `
            <p><strong>Name:</strong> ${constructor.name}</p>
            <p><strong>Nationality:</strong> ${constructor.nationality}</p>
        `;

        // Fetch race results for the constructor
        const raceResultsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php`;
        const raceResults = await fetchData(raceResultsUrl, `all_race_results`);
        console.log(raceResultsUrl);
        console.log(raceResults);
        // Populate the race results table
        const raceResultsTableBody = document.querySelector('#constructorResults');
        raceResultsTableBody.innerHTML = ""; // Clear any existing rows
        if (raceResults && raceResults.length > 0) {
            let hasResults = false; // Flag to track if any matching results were found
        
            raceResults.forEach(result => {
                if (result.constructor.ref == constructor.constructorRef) {
                    hasResults = true; // Set flag to true if a matching result is found
        
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td class="border px-4 py-2" data-key="position">${result.position || "N/A"}</td>
                    <td class="border px-4 py-2" data-key="driver">
                        ${result.driver.forename || "N/A"}<br>${result.driver.surname || "N/A"}
                    </td>
                    <td class="border px-4 py-2" data-key="time">${result.time || "N/A"}</td>
                    <td class="border px-4 py-2" data-key="points">${result.points || "N/A"}</td>
                `;
                
                    raceResultsTableBody.appendChild(row);
                }
            });
        
            // If no matching results were found, add a "No results" row
            if (!hasResults) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" class="text-center px-4 py-2">No results found for this constructor.</td>
                `;
                raceResultsTableBody.appendChild(row);
            }
        } else {
            // If raceResults is empty, add a "No results" row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" class="text-center px-4 py-2">No results available.</td>
            `;
            raceResultsTableBody.appendChild(row);
        }
        

        // Add event listener for "Add to Favorites" button
        const addToFavoritesButton = document.getElementById('addToFavoritesButton');
        addToFavoritesButton.onclick = () => {
            addToFavorites("constructors", {
                id: constructor.id,
                name: constructor.name,
                nationality: constructor.nationality
            });
        };

        // Show the popup
        const popup = document.getElementById('constructorPopup');
        popup.showModal();
    } catch (error) {
        console.error("Error fetching constructor details or race results:", error);
    }
}



// Show/hide views
function showView(viewToShow) {
    homeView.classList.add('hidden');
    racesView.classList.add('hidden');
    viewToShow.classList.remove('hidden');
}

// Event listeners
seasonSelect.addEventListener('change', async () => {
    const selectedSeason = seasonSelect.value;
    if (selectedSeason) {
        showView(racesView);
        await displayRaces(selectedSeason);
    }
});

let sortOrder = 1; // 1 for ascending, -1 for descending
let currentKey = null;

function sortTable(tbody, key) {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Sort rows based on the clicked key
    rows.sort((a, b) => {
        const cellA = a.querySelector(`[data-key="${key}"]`)?.textContent.trim();
        const cellB = b.querySelector(`[data-key="${key}"]`)?.textContent.trim();

        // Numeric sorting for positions, time, or points
        if (!isNaN(cellA) && !isNaN(cellB)) {
            return sortOrder * (parseFloat(cellA) - parseFloat(cellB));
        }

        // String sorting for driver or constructor names
        return sortOrder * cellA.localeCompare(cellB);
    });

    // Reverse order for next click
    if (currentKey == key) {
        sortOrder = -sortOrder; // Reverse the sort order if the same column is clicked
    } else {
        sortOrder = 1; // Reset to ascending order if a new column is clicked
    }
    currentKey = key;
        currentKey = key;

    // Append sorted rows back to the table
    rows.forEach(row => tbody.appendChild(row));
}

function updateSortIndicators(table, key, order) {
    // Clear all indicators in the specific table
    table.querySelectorAll('thead th .sort-indicator').forEach((indicator) => {
        indicator.textContent = '';
    });

    // Update the indicator for the active column in the table
    const activeHeader = table.querySelector(`thead th[data-key="${key}"] .sort-indicator`);
    activeHeader.textContent = order === 1 ? '▲' : '▼';
}
document.querySelectorAll('table').forEach((table) => {
    const tbody = table.querySelector('tbody');
    table.querySelectorAll('thead th').forEach((header) => {
        header.addEventListener('click', () => {
            const key = header.getAttribute('data-key');
            if (key) {
                sortTable(tbody, key);
                updateSortIndicators(table, key, sortOrder);
            }
        });
    });
});

// Initialize Favorites from LocalStorage or Create New
const getFavorites = () => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : { drivers: [], constructors: [], circuits: [] };
};

const saveFavorites = (favorites) => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

// Function to Show the Favorites Popup
function showFavoritesPopup() {

    const favorites = getFavorites(); // Fetch favorites from localStorage
    const popup = document.querySelector('#favoritesPopup');

    console.log(favorites);

    // Validate popup existence
    if (!popup) {
        console.error('Favorites popup element not found in the DOM.');
        return;
    }

    const driversList = popup.querySelector('#favoritesDrivers');
    const constructorsList = popup.querySelector('#favoritesConstructors');
    const circuitsList = popup.querySelector('#favoritesCircuits');

    // Validate list containers
    if (!driversList || !constructorsList || !circuitsList) {
        console.error('One or more favorites list containers not found in the DOM.');
        return;
    }

    // Populate Drivers
    driversList.innerHTML = favorites.drivers.length
        ? favorites.drivers.map(driver => `<li>${driver.name}</li>`).join('')
        : '<li class="text-gray-500">No favorite drivers added.</li>';

    // Populate Constructors
    constructorsList.innerHTML = favorites.constructors.length
        ? favorites.constructors.map(constructor => `<li>${constructor.name}</li>`).join('')
        : '<li class="text-gray-500">No favorite constructors added.</li>';

    // Populate Circuits
    circuitsList.innerHTML = favorites.circuits.length
        ? favorites.circuits.map(circuit => `<li>${circuit.name}</li>`).join('')
        : '<li class="text-gray-500">No favorite circuits added.</li>';

    // Show Popup
    popup.showModal();

}


// Function to Clear All Favorites
function clearFavorites() {
    const emptyFavorites = { drivers: [], constructors: [], circuits: [] };
    saveFavorites(emptyFavorites); // Clear favorites in localStorage
    console.log('Favorites cleared!');
    showFavoritesPopup(); // Refresh the popup
}

function addToFavorites(type, item) {
    const favorites = getFavorites(); // Retrieve favorites from localStorage
    let exists = false; // Track if the item already exists

    // Iterate through the list to check for duplicates
    favorites[type].forEach(fav => {
        if (item.name == fav.name) {
            exists = true; // Mark as existing if a match is found
        }
    });

    if (!exists) {
        // Add item to the appropriate list
        favorites[type].push(item);
        saveFavorites(favorites); // Save updated favorites to localStorage
        console.log(`${item.name} has been added to your favorites!`);
    } else {
        console.log(`${item.name} is already in your favorites!`);
    }
}



// Event Listeners
document.querySelector('#clearFavorites').addEventListener('click', clearFavorites);
document.querySelector('#closeFavorites').addEventListener('click', () => {
    const popup = document.querySelector('#favoritesPopup');
    popup.close();
});

homeLink.addEventListener('click', () => showView(homeView));
racesLink.addEventListener('click', () => showView(racesView));
favoritesLink.addEventListener('click', () => showFavoritesPopup());
closeFavorites.addEventListener('click', () => favoritesPopup.close());
closeConstructorPopup.addEventListener('click', () => constructorPopup.close());
closeDriverPopup.addEventListener('click', () => driverPopup.close());
closeCircuitPopup.addEventListener('click', () => circuitPopup.close());


// run app
document.addEventListener('DOMContentLoaded', populateSeasons);
