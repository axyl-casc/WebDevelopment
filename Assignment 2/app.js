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
    const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=2023'; // Update API endpoint
    const data = await fetchData(url, 'seasons');
    data.forEach(season => {
        const option = document.createElement('option');
        option.value = season.season;
        option.textContent = season.season;
        seasonSelect.appendChild(option);
    });
}

async function displayRaces(season) {
    const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
    const response = await fetch(url);
    const json = await response.json();

    console.log(json); // Inspect the structure of the response

    const races = json.MRData?.RaceTable?.Races; // Adjust based on the actual structure

    if (Array.isArray(races)) {
        racesList.innerHTML = '';
        races.forEach(race => {
            const li = document.createElement('li');
            li.textContent = `${race.round}. ${race.raceName} - ${race.date}`;
            li.classList.add('cursor-pointer', 'hover:underline');
            li.addEventListener('click', () => displayRaceDetails(race));
            racesList.appendChild(li);
        });
    } else {
        console.error('Races data is not an array:', races);
    }
}


// Display race details
async function displayRaceDetails(race) {
    const resultsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${race.round}`;
    const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${race.round}`;
    const results = await fetchData(resultsUrl, `results_${race.round}`);
    const qualifying = await fetchData(qualifyingUrl, `qualifying_${race.round}`);
    console.log('Results:', results);
    console.log('Qualifying:', qualifying);
    // Render results and qualifying details (not implemented)
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

homeLink.addEventListener('click', () => showView(homeView));
racesLink.addEventListener('click', () => showView(racesView));
favoritesLink.addEventListener('click', () => favoritesPopup.showModal());
closeFavorites.addEventListener('click', () => favoritesPopup.close());
closeConstructorPopup.addEventListener('click', () => constructorPopup.close());
closeDriverPopup.addEventListener('click', () => driverPopup.close());
closeCircuitPopup.addEventListener('click', () => circuitPopup.close());

// Initialize the app
populateSeasons();
showView(homeView);
