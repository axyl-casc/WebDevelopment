// Select HTML elements
const homeView = document.querySelector('#homeView');
const racesView = document.querySelector('#racesView');
const seasonSelect = document.querySelector('#seasonSelect');
const racesList = document.querySelector('#racesList');
const favouritesPopup = document.querySelector('#favouritesPopup');
const closefavourites = document.querySelector('#closefavourites');
const constructorPopup = document.querySelector('#constructorPopup');
const closeConstructorPopup = document.querySelector('#closeConstructorPopup');
const driverPopup = document.querySelector('#driverPopup');
const closeDriverPopup = document.querySelector('#closeDriverPopup');
const circuitPopup = document.querySelector('#circuitPopup');
const closeCircuitPopup = document.querySelector('#closeCircuitPopup');
const homeLink = document.querySelector('#homeLink');
const racesLink = document.querySelector('#racesLink');
const favouritesLink = document.querySelector('#favouritesLink');

/**
 * Displays a toast notification with the specified text.
 * 
 * This function updates the toast message content and shows it on the screen by 
 * manipulating its visibility and opacity classes. The toast automatically hides 
 * after 3 seconds with a fade-out transition.
 * 
 * @param {string} text - The message to display in the toast notification.
 * @returns {void}
 * 
 * @example
 * // Example usage:
 * showToast('Item added to favorites!');
 * showToast('Error: Unable to save changes.');
 */
function showToast(text) {
    const toast = document.querySelector('#toast');
    const toastContainer = document.querySelector('#toast-container');

    if (!toast || !toastContainer) {
        console.error("Toast elements not found in the DOM");
        return;
    }

    toast.textContent = text;

    // Show the toast
    toastContainer.classList.remove('hidden');
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toastContainer.classList.add('hidden');
        }, 500); 
    }, 3000);
}

/**
 * Generates an HTML button element.
 * @param {string} onClickFunction - The name of the JavaScript function to call on click.
 * @param {string} functionParameter - The parameter to pass to the function.
 * @param {string} displayText - The text to display on the button.
 * @returns {string} - The HTML string for the button.
 * @example
 * const buttonHTML = generateButtonHTML('alert', 'Hello', 'Click Me');
 * console.log(buttonHTML);
 * // Output: <button onclick="alert('Hello')">Click Me</button>
 */
function generateButtonHTML(onClickFunction, functionParameter, displayText) {
    return `
        <button 
            class="px-4 py-2 text-gray-800 rounded shadow-sm hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-transform duration-200"
            onclick="${onClickFunction}('${functionParameter}')">
            ${displayText}
        </button>`;
}

/**
 * Fetches data from the API or retrieves it  from localStorage if available.
 * 
 * This utility function checks if data associated with a given storage key exists
 * in localStorage. If found, it parses and returns the stored data. If not, it
 * fetches the data from the specified URL, stores it in localStorage, and then
 * returns the fetched data.
 * 
 * @async
 * @param {string} url - The URL of the API endpoint to fetch data from.
 * @param {string} storageKey - The key used to store and retrieve data from localStorage.
 * @returns {Promise<Object>} - A promise that resolves to the data (either from localStorage or fetched from the API).
 * 
 * @example
 * // Usage example
 * try {
 *   const data = await fetchData('https://api.example.com/data', 'exampleData');
 *   console.log(data);
 * } catch (error) {
 *   console.error('Error fetching data:', error);
 * }
 */

async function fetchData(url, storageKey) {
    if (localStorage.getItem(storageKey)) {
        return JSON.parse(localStorage.getItem(storageKey));
    }
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
}
/**
 * Populates the seasons dropdown menu with unique years from race data.
 * 
 * This function retrieves race data from an API or localStorage, extracts unique
 * years from the data, and appends them as options to the `seasonSelect` dropdown.
 * It also ensures the `homeView` is displayed when called.
 * 
 * @async
 * @returns {Promise<void>} - A promise that resolves when the dropdown has been populated.
 * 
 * @example
 * // Usage example
 * try {
 *   await populateSeasons();
 *   console.log('Seasons dropdown populated');
 * } catch (error) {
 *   console.error('Error populating seasons:', error);
 * }
 */
async function populateSeasons() {
    showView(homeView);
    const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php'; // Update API endpoint
    const data = await fetchData(url, 'raceList');
    const uniqueYears = [...new Set(data.map(race => race.year))];
    uniqueYears.forEach(uniqueYear => {
        const option = document.createElement('option');
        option.value = uniqueYear;
        option.textContent = uniqueYear;
        seasonSelect.appendChild(option);
    });
}
/**
 * Displays the list of races for a given Formula 1 season.
 * 
 * This function fetches race data for the specified season, updates the local storage
 * with the season value, clears any existing race entries in the `racesList`, and 
 * dynamically populates the list with the retrieved races. Each race entry includes
 * a "Results" button that, when clicked, triggers the `displayRaceDetails` function
 * to show detailed information about the selected race.
 * 
 * @async
 * @param {string|number} season - The Formula 1 season year to fetch races for.
 * @returns {Promise<void>} - A promise that resolves once the race list has been updated.
 * 
 * @example
 * // Usage example:
 * try {
 *   await displayRaces(2023);
 *   console.log('Races for the 2023 season displayed.');
 * } catch (error) {
 *   console.error('Error displaying races:', error);
 * }
 */
async function displayRaces(season) {
    const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
    const response = await fetchData(url, "races_to_display");
    console.log(response);
    localStorage.setItem("season", season);

    racesList.innerHTML = '';

    const buttonTemplate = document.querySelector("#results-button-template");
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


/**
 * Displays detailed information about a specific race, including qualifying and race results.
 * 
 * This function fetches qualifying and race result data for the given race using its round number.
 * It updates the DOM with race details, including qualifying results, race results, and dynamic
 * links to additional information about drivers, constructors, and the circuit. It also ensures
 * the race details view is displayed while hiding any irrelevant sections.
 * 
 * @async
 * @param {Object} race - The race object containing details such as round, year, and circuit.
 * @param {number} race.round - The round number of the race.
 * @param {string} race.year - The year of the race season.
 * @param {Object} race.circuit - The circuit information for the race.
 * @param {string} race.circuit.id - The unique ID of the circuit.
 * @param {string} race.name - The name of the race.
 * @returns {Promise<void>} - A promise that resolves once the race details are displayed.
 * 
 * @example
 * // Usage example:
 * try {
 *   await displayRaceDetails({
 *     round: 5,
 *     year: 2023,
 *     circuit: { id: 'silverstone' },
 *     name: 'British Grand Prix'
 *   });
 *   console.log('Race details displayed.');
 * } catch (error) {
 *   console.error('Error displaying race details:', error);
 * }
 */

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
    document.querySelector('#raceDetailsView').classList.remove('hidden');

    // Update the headers with race name and date
    document.querySelector("#raceDetailsHeader").innerHTML =
        `<h3 class="text-black text-lg hover:text-gray-800 ml-2">
        ${generateButtonHTML("showCircuitPopup", race.circuit.id, race.name)}
    </h3>
    <p class="text-gray-600">Year: ${race.year} - Round: ${race.round}</p>`;
    // Update the Qualifying Header
    qualifyingHeader.innerHTML = `
    <h4 class="text-lg font-semibold mt-4">Qualifying</h4>
`;

    // Update the Race Results Header
    document.querySelector('#raceResultsHeader').innerHTML = `
    <br><br>
    <h4 class="text-lg font-semibold mt-4">Race Results</h4>
`;

    // Populate the Qualifying Table
    const qualifyingTableBody = document.querySelector('#qualifyingTableBody');
    qualifyingTableBody.innerHTML = ''; // Clear previous content

    qualifying.forEach((qualify) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2" data-key="position">${qualify.position}</td>
<td class="border px-4 py-2" data-key="driver">
    ${generateButtonHTML(
            'showDriverPopup',
            qualify.driver.id,
            `${qualify.driver.forename} ${qualify.driver.surname}`
        )}
</td><td class="border px-4 py-2" data-key="constructor">
${generateButtonHTML(
            'showConstructorPopup',
            qualify.constructor.id,
            qualify.constructor.name
        )}
            <td class="border px-4 py-2" data-key="Q1">${qualify.q1 || 'N/A'}</td>
            <td class="border px-4 py-2" data-key="Q2">${qualify.q2 || 'N/A'}</td>
            <td class="border px-4 py-2" data-key="Q3">${qualify.q3 || 'N/A'}</td>
        `;
        qualifyingTableBody.appendChild(row);
    });

    // Populate the Race Results Table
    const raceResultsTableBody = document.querySelector('#raceResultsTableBody');
    raceResultsTableBody.innerHTML = ''; // Clear previous content

    results.forEach((result) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2" data-key="position">${result.position}</td>
<td class="border px-4 py-2" data-key="driver">
    ${generateButtonHTML(
            'showDriverPopup',
            result.driver.id,
            `${result.driver.forename} ${result.driver.surname}`
        )}
</td>
<td class="border px-4 py-2" data-key="constructor">
${generateButtonHTML(
            'showConstructorPopup',
            result.constructor.id,
            result.constructor.name
        )}
</td>            <td class="border px-4 py-2" data-key="time">${result.time || 'N/A'}</td>
            <td class="border px-4 py-2" data-key="points">${result.points}</td>
        `;
        raceResultsTableBody.appendChild(row);
    });
}
/**
 * Displays a popup with detailed information about a specific Formula 1 driver, including race results.
 * 
 * This function fetches driver details and their race results from APIs, populates the driver information
 * section and race results table, and provides an option to add the driver to favourites. It then displays
 * the driver popup.
 * 
 * @async
 * @param {number|string} driverId - The unique ID of the driver whose details are to be displayed.
 * @returns {Promise<void>} - A promise that resolves once the driver popup has been populated and displayed.
 * 
 * @example
 * // Usage example:
 * try {
 *   await showDriverPopup(123);
 *   console.log('Driver popup displayed successfully.');
 * } catch (error) {
 *   console.error('Error displaying driver popup:', error);
 * }
 */

async function showDriverPopup(driverId) {
    console.log("Showing driver popup");
    try {
        // Fetch driver details
        const driverDetailsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1//drivers.php?id=${driverId}`;
        const driver = await fetchData(driverDetailsUrl, `driver_${driverId}`);

        if (!driver) {
            console.error("Driver not found.");
            return;
        }

        console.log(driver);

        // Populate the driver details
        const detailsContainer = document.querySelector('#driverDetails');
        detailsContainer.innerHTML = `
            <p><strong>First Name:</strong> ${driver.forename}</p>
            <p><strong>Last Name:</strong> ${driver.surname}</p>
            <p><strong>Driver Number:</strong> ${driver.number}</p>
            <p><strong>Code:</strong> ${driver.code}</p>
            <p><strong>Date of Birth:</strong> ${driver.dob}</p>
            <p><strong>Nationality:</strong> ${driver.nationality}</p>
            <p><strong>More Info:</strong> <a href="${driver.url}" target="_blank">Wikipedia</a></p>
        `;

        // Fetch race results for the driver
        const raceResultsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?driver=${driver.driverId}`;
        const raceResults = await fetchData(raceResultsUrl, `driver_race_results_${driverId}`);
        console.log(raceResultsUrl);
        console.log(raceResults);
        // Populate the race results table
        const raceResultsTableBody = document.querySelector('#driverResults');
        raceResultsTableBody.innerHTML = ""; // Clear any existing rows
        if (raceResults && raceResults.length > 0) {
            raceResults.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border px-4 py-2" data-key="race">${result.race.name}</td>
                    <td class="border px-4 py-2" data-key="position">${result.position || "N/A"}</td>
                    <td class="border px-4 py-2" data-key="time">${result.time || "N/A"}</td>
                    <td class="border px-4 py-2" data-key="points">${result.points || "N/A"}</td>
                `;

                raceResultsTableBody.appendChild(row);
            });
        } else {
            // If no race results, add a "No results" row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" class="text-center px-4 py-2">No race results found for this driver.</td>
            `;
            raceResultsTableBody.appendChild(row);
        }

        // Add event listener for "Add to favourites" button
        const addTofavouritesButton = document.querySelector('#driverAddTofavouritesButton');
        addTofavouritesButton.onclick = () => {
            addTofavourites("drivers", {
                id: driverId,
                name: `${driver.forename} ${driver.surname}`,
                nationality: driver.nationality
            });
        };

        // Show the popup
        const popup = document.querySelector('#driverPopup');
        popup.showModal();
    } catch (error) {
        console.error("Error fetching driver details or race results:", error);
    }
}

/**
 * Displays a popup with detailed information about a specific Formula 1 constructor, including race results.
 * 
 * This function fetches constructor details and race results from APIs, populates the constructor 
 * information section and race results table, and provides an option to add the constructor to favourites.
 * It then displays the constructor popup.
 * 
 * @async
 * @param {number|string} constructorId - The unique ID of the constructor whose details are to be displayed.
 * @returns {Promise<void>} - A promise that resolves once the constructor popup has been populated and displayed.
 * 
 * @example
 * // Usage example:
 * try {
 *   await showConstructorPopup(5);
 *   console.log('Constructor popup displayed successfully.');
 * } catch (error) {
 *   console.error('Error displaying constructor popup:', error);
 * }
 */

async function showConstructorPopup(constructorId) {
    try {
        // Fetch constructor details
        const constructorDetailsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?id=${constructorId}`;
        const constructor = await fetchData(constructorDetailsUrl, `constructor_${constructorId}`);

        if (!constructor) {
            console.error("Constructor not found.");
            return;
        }

        // Populate the constructor details
        const detailsContainer = document.querySelector('#constructorDetails');
        detailsContainer.innerHTML = `
            <p><strong>Name:</strong> ${constructor.name}</p>
            <p><strong>Nationality:</strong> ${constructor.nationality}</p>
            <p><strong>More Info:</strong> <a href="${constructor.url}" target="_blank">Wikipedia</a></p>
        `;

        // Fetch race results for the constructor
        const raceResultsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php`;
        const raceResults = await fetchData(raceResultsUrl, `all_race_results`);

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


        // Add event listener for "Add to favourites" button
        const addTofavouritesButton = document.querySelector('#constructorAddTofavouritesButton');
        addTofavouritesButton.onclick = () => {
            addTofavourites("constructors", {
                id: constructor.id,
                name: constructor.name,
                nationality: constructor.nationality
            });
        };

        // Show the popup
        const popup = document.querySelector('#constructorPopup');
        popup.showModal();
    } catch (error) {
        console.error("Error fetching constructor details or race results:", error);
    }
}

/**
 * Displays a popup with detailed information about a specific Formula 1 circuit.
 * 
 * This function fetches circuit details from an API, populates the circuit information
 * section dynamically, and provides functionality to add the circuit to favourites or close
 * the popup. The circuit details include its name, location, country, coordinates, and
 * a link to more information.
 * 
 * @async
 * @param {number|string} circuitId - The unique ID of the circuit whose details are to be displayed.
 * @returns {Promise<void>} - A promise that resolves once the circuit popup has been populated and displayed.
 * 
 * @example
 * // Usage example:
 * try {
 *   await showCircuitPopup(10);
 *   console.log('Circuit popup displayed successfully.');
 * } catch (error) {
 *   console.error('Error displaying circuit popup:', error);
 * }
 */

async function showCircuitPopup(circuitId) {
    try {

        const circuitDetailsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1//circuits.php?id=${circuitId}`;
        const circuit = await fetchData(circuitDetailsUrl, `circuit_${circuitId}`);

        // Populate circuit details dynamically
        const circuitDetailsContainer = document.querySelector('#circuitDetails');
        circuitDetailsContainer.innerHTML = `
            <p><strong>Name:</strong> ${circuit.name}</p>
            <p><strong>Location:</strong> ${circuit.location}</p>
            <p><strong>Country:</strong> ${circuit.country}</p>
            <p><strong>Coordinates:</strong> (${circuit.lat}, ${circuit.lng})</p>
<p><strong>More Info:</strong> <a href="${circuit.url}" target="_blank">Wikipedia</a></p>
        `;

        // Add event listener for "Add to favourites" button
        const addTofavouritesButton = document.querySelector('#circuitAddTofavouritesButton');
        addTofavouritesButton.onclick = () => {
            addTofavourites("circuits", {
                id: circuit.id,
                name: circuit.name,
                location: circuit.location,
                country: circuit.country
            });

        };

        // Add event listener for "Close" button
        const closeButton = document.querySelector('#closeCircuitPopup');
        closeButton.onclick = () => {
            const popup = document.querySelector('#circuitPopup');
            popup.close();
        };

        // Show the popup
        const popup = document.querySelector('#circuitPopup');
        popup.showModal();
    } catch (error) {
        console.error("Error displaying circuit details:", error);
    }
}


/**
 * Toggles visibility between views by hiding all views and showing the specified view.
 * 
 * This function hides the `homeView` and `racesView` by adding the `hidden` class and
 * then displays the specified view by removing the `hidden` class.
 * 
 * @param {HTMLElement} viewToShow - The DOM element representing the view to be displayed.
 * @returns {void}
 * 
 * @example
 * // Show the races view:
 * showView(racesView);
 * 
 * // Show the home view:
 * showView(homeView);
 */

function showView(viewToShow) {
    homeView.classList.add('hidden');
    racesView.classList.add('hidden');
    viewToShow.classList.remove('hidden');
}






// --------------------------------------------------------------------------------------------------







let sortOrder = 1; // 1 for ascending, -1 for descending
let currentKey = null;


/**
 * Sorts the rows of a table's `<tbody>` element based on a specified column key.
 * 
 * This function dynamically sorts table rows by extracting the content of the column
 * specified by the `key` attribute. It supports numeric sorting (e.g., positions, points, or times)
 * and string-based sorting (e.g., driver or constructor names). The sort order toggles between
 * ascending and descending when the same column is sorted consecutively.
 * 
 * @param {HTMLElement} tbody - The `<tbody>` element containing the rows to be sorted.
 * @param {string} key - The `data-key` attribute of the column to sort by.
 * @returns {void}
 * 
 * @example
 * // Example usage:
 * const tbody = document.querySelector('#raceResultsTableBody');
 * sortTable(tbody, 'position'); // Sorts rows by the "position" column
 */

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


/**
 * Updates the sort indicators for a table to reflect the current sort column and order.
 * 
 * This function clears existing sort indicators in the table header and sets the appropriate
 * indicator (▲ for ascending or ▼ for descending) for the currently active column based on
 * the specified sort key and order.
 * 
 * @param {HTMLElement} table - The table element containing the headers and sort indicators.
 * @param {string} key - The `data-key` attribute of the column being sorted.
 * @param {number} order - The sort order, where `1` represents ascending and `-1` represents descending.
 * @returns {void}
 * 
 * @example
 * // Example usage:
 * const table = document.querySelector('#raceResultsTable');
 * updateSortIndicators(table, 'position', 1); // Updates indicators for ascending sort by "position"
 * updateSortIndicators(table, 'name', -1);    // Updates indicators for descending sort by "name"
 */
function updateSortIndicators(table, key, order) {
    // Clear all indicators in the specific table
    table.querySelectorAll('thead th .sort-indicator').forEach((indicator) => {
        indicator.textContent = '';
    });

    // Update the indicator for the active column in the table
    const activeHeader = table.querySelector(`thead th[data-key="${key}"] .sort-indicator`);
    activeHeader.textContent = order === 1 ? '▲' : '▼';
}

/**
 * Retrieves the favourites data from localStorage or initializes a new favourites object.
 * 
 * This function checks localStorage for existing favourites data. If found, it parses and returns the data.
 * If no data is found, it initializes and returns a new favourites object with empty arrays for drivers,
 * constructors, and circuits.
 * 
 * @returns {Object} - An object containing favourites data with the structure:
 *   {
 *     drivers: Array,       // Array of favourite drivers
 *     constructors: Array,  // Array of favourite constructors
 *     circuits: Array       // Array of favourite circuits
 *   }
 * 
 * @example
 * // Example usage:
 * const favourites = getfavourites();
 * console.log(favourites.drivers); // Outputs an array of favourite drivers
 * console.log(favourites.constructors); // Outputs an array of favourite constructors
 * console.log(favourites.circuits); // Outputs an array of favourite circuits
 */
const getfavourites = () => {
    const storedfavourites = localStorage.getItem('favourites');
    return storedfavourites ? JSON.parse(storedfavourites) : { drivers: [], constructors: [], circuits: [] };
};
/**
 * Saves the favourites data to localStorage.
 * 
 * This function serializes the provided favourites object and stores it in localStorage
 * under the key `favourites`.
 * 
 * @param {Object} favourites - The favourites object to be saved. The expected structure is:
 *   {
 *     drivers: Array,       // Array of favourite drivers
 *     constructors: Array,  // Array of favourite constructors
 *     circuits: Array       // Array of favourite circuits
 *   }
 * @returns {void}
 * 
 * @example
 * // Example usage:
 * const favourites = {
 *   drivers: [{ id: 1, name: "Lewis Hamilton" }],
 *   constructors: [{ id: 44, name: "Mercedes" }],
 *   circuits: [{ id: 10, name: "Silverstone" }]
 * };
 * savefavourites(favourites);
 */
const savefavourites = (favourites) => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
};

/**
 * Displays the favourites Popup with the user's saved favourites.
 * 
 * This function retrieves the user's favourites from localStorage using the `getfavourites` function,
 * validates the presence of the popup and its list containers in the DOM, and populates the popup
 * with the user's favourite drivers, constructors, and circuits. If no favourites are available, it displays
 * a message indicating the absence of favourites in each category. Finally, it displays the popup.
 * 
 * @returns {void}
 * 
 * @example
 * // Example usage:
 * showfavouritesPopup();
 */
function showfavouritesPopup() {

    const favourites = getfavourites(); // Fetch favourites from localStorage
    const popup = document.querySelector('#favouritesPopup');

    console.log(favourites);

    // Validate popup existence
    if (!popup) {
        console.error('favourites popup element not found in the DOM.');
        return;
    }

    const driversList = popup.querySelector('#favouritesDrivers');
    const constructorsList = popup.querySelector('#favouritesConstructors');
    const circuitsList = popup.querySelector('#favouritesCircuits');

    // Validate list containers
    if (!driversList || !constructorsList || !circuitsList) {
        console.error('One or more favourites list containers not found in the DOM.');
        return;
    }

    // Populate Drivers
    driversList.innerHTML = favourites.drivers.length
        ? favourites.drivers.map(driver => `<li>${driver.name}</li>`).join('')
        : '<li class="text-gray-500">No favourite drivers added.</li>';

    // Populate Constructors
    constructorsList.innerHTML = favourites.constructors.length
        ? favourites.constructors.map(constructor => `<li>${constructor.name}</li>`).join('')
        : '<li class="text-gray-500">No favourite constructors added.</li>';

    // Populate Circuits
    circuitsList.innerHTML = favourites.circuits.length
        ? favourites.circuits.map(circuit => `<li>${circuit.name}</li>`).join('')
        : '<li class="text-gray-500">No favourite circuits added.</li>';

    // Show Popup
    popup.showModal();

}


/**
 * Clears all user favourites and refreshes the favourites Popup.
 * 
 * This function resets the favourites data in localStorage by saving an empty favourites object.
 * After clearing the favourites, it logs a confirmation message to the console and refreshes
 * the favourites Popup to reflect the changes.
 * 
 * @returns {void}
 * 
 * @example
 * // Example usage:
 * clearfavourites(); // Clears all saved favourites and refreshes the popup
 */

function clearfavourites() {
    const emptyfavourites = { drivers: [], constructors: [], circuits: [] };
    savefavourites(emptyfavourites); // Clear favourites in localStorage
    console.log('favourites cleared!');
    showfavouritesPopup(); // Refresh the popup
    showToast("Favourites cleared!");
}

/**
 * Adds an item to the user's favourites list if it doesn't already exist.
 * 
 * This function checks whether a given item (driver, constructor, or circuit) is already in the 
 * favourites list. If not, it adds the item to the appropriate category, saves the updated favourites 
 * to localStorage, and displays a confirmation message. If the item already exists, it displays 
 * a message indicating that the item is already in the favourites.
 * 
 * @param {string} type - The type of favourite to add (e.g., "drivers", "constructors", "circuits").
 * @param {Object} item - The item to be added to the favourites. The item object should contain:
 *   @param {string} item.name - The name of the favourite item.
 *   @param {number|string} item.id - The unique identifier for the item.
 *   @param {string} [item.nationality] - Optional nationality of the item.
 * @returns {void}
 * 
 * @example
 * // Add a driver to favourites:
 * addTofavourites('drivers', { id: 1, name: 'Lewis Hamilton', nationality: 'British' });
 * 
 * // Add a circuit to favourites:
 * addTofavourites('circuits', { id: 10, name: 'Silverstone', location: 'England' });
 */

function addTofavourites(type, item) {
    const favourites = getfavourites(); // Retrieve favourites from localStorage
    let exists = false; // Track if the item already exists

    // Iterate through the list to check for duplicates
    favourites[type].forEach(fav => {
        if (item.name == fav.name) {
            exists = true; // Mark as existing if a match is found
        }
    });

    if (!exists) {
        // Add item to the appropriate list
        favourites[type].push(item);
        savefavourites(favourites); // Save updated favourites to localStorage
        console.log(`${item.name} has been added to your favourites!`);
        showToast(`${item.name} added to favourites!`);
    } else {
        showToast(`${item.name} already in favourites!`);
        console.log(`${item.name} is already in your favourites!`);
    }
}


// run app
document.addEventListener('DOMContentLoaded', () => {
    populateSeasons();
    // event listeners addon

    seasonSelect.addEventListener('change', async () => {
        const selectedSeason = seasonSelect.value;
        if (selectedSeason) {
            showView(racesView);
            await displayRaces(selectedSeason);
        }
    });

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

    // Event Listeners
    document.querySelector('#clearfavourites').addEventListener('click', clearfavourites);
    document.querySelector('#closefavourites').addEventListener('click', () => {
        const popup = document.querySelector('#favouritesPopup');
        popup.close();
    });

    homeLink.addEventListener('click', () => {
        // reset the season selector
        document.querySelector("#seasonSelect").value = "";
        showView(homeView);
    });
    racesLink.addEventListener('click', () => showView(racesView));
    favouritesLink.addEventListener('click', () => showfavouritesPopup());
    closefavourites.addEventListener('click', () => favouritesPopup.close());
    closeConstructorPopup.addEventListener('click', () => constructorPopup.close());
    closeDriverPopup.addEventListener('click', () => driverPopup.close());
    closeCircuitPopup.addEventListener('click', () => circuitPopup.close());

});
