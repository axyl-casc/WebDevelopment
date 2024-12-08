const fs = require('fs');
const path = require('path');

/**
 * Loads JSON data from a file in the `data` directory.
 * @param {string} fileName - The name of the file (without extension).
 * @returns {Array|Object} - Parsed JSON data or an empty array in case of an error.
 */
const loadData = (fileName) => {
    const filePath = path.join(__dirname, 'data', `${fileName}.json`);
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${fileName}.json:`, error);
        return [];
    }
};

const circuits = loadData('circuits');
const constructors = loadData('constructors');
const drivers = loadData('drivers');
const races = loadData('races');
const results = loadData('results');

/**
 * Retrieves all circuits.
 * @returns {Array} - An array of all circuit objects.
 */
const getAllCircuits = () => circuits;

/**
 * Retrieves a circuit by its ID.
 * @param {number} id - The ID of the circuit.
 * @returns {Object|undefined} - The circuit object or undefined if not found.
 */
const getCircuitById = (id) => circuits.find(circuit => circuit.circuitId === parseInt(id));

/**
 * Retrieves all constructors.
 * @returns {Array} - An array of all constructor objects.
 */
const getAllConstructors = () => constructors;

/**
 * Retrieves a constructor by its reference name.
 * @param {string} ref - The reference name of the constructor (case-insensitive).
 * @returns {Object|undefined} - The constructor object or undefined if not found.
 */
const getConstructorByRef = (ref) => constructors.find(
    constructor => constructor.constructorRef.toLowerCase() === ref.toLowerCase()
);

/**
 * Retrieves race results for a specific constructor in a specific year.
 * @param {string} ref - The reference name of the constructor (case-insensitive).
 * @param {number} year - The year of the races.
 * @returns {Array} - An array of result objects matching the criteria.
 */
const getConstructorResults = (ref, year) => results.filter(result => 
    result.constructor.ref.toLowerCase() === ref.toLowerCase() && 
    result.race.year === parseInt(year)
);

/**
 * Retrieves all drivers.
 * @returns {Array} - An array of all driver objects.
 */
const getAllDrivers = () => drivers;

/**
 * Retrieves a driver by their reference name.
 * @param {string} ref - The reference name of the driver (case-insensitive).
 * @returns {Object|undefined} - The driver object or undefined if not found.
 */
const getDriverByRef = (ref) => 
    drivers.find(driver => driver.driverRef.toLowerCase() === ref.toLowerCase());

/**
 * Retrieves race results for a specific driver in a specific year.
 * @param {string} ref - The reference name of the driver (case-insensitive).
 * @param {number} year - The year of the races.
 * @returns {Array} - An array of result objects matching the criteria.
 */
const getDriverResults = (ref, year) => 
    results.filter(result => 
        result.driver.ref.toLowerCase() === ref.toLowerCase() && 
        result.race.year === parseInt(year)
    );

    /**
 * Retrieves all races for a specific season.
 * @param {number} year - The year of the season.
 * @returns {Array} - An array of race objects for the specified season.
 */
const getRacesBySeason = (year) => races.filter(race => race.year === parseInt(year));

/**
 * Retrieves a race by its ID.
 * @param {number} id - The ID of the race.
 * @returns {Object|undefined} - The race object or undefined if not found.
 */
const getRaceById = (id) => races.find(race => race.id === parseInt(id));

/**
 * Retrieves all results for a specific race by its ID.
 * @param {number} id - The ID of the race.
 * @returns {Array} - An array of result objects for the specified race.
 */
const getResultsByRaceId = (id) => 
    results.filter(result => result.race.id === parseInt(id));

/**
 * Retrieves all results for a specific season.
 * @param {number} year - The year of the season.
 * @returns {Array} - An array of result objects for the specified season.
 */
const getResultsBySeason = (year) => 
    results.filter(result => result.race.year === parseInt(year));

module.exports = {
    getAllCircuits,
    getCircuitById,
    getAllConstructors,
    getConstructorByRef,
    getConstructorResults,
    getAllDrivers,
    getDriverByRef,
    getDriverResults,
    getRacesBySeason,
    getRaceById,
    getResultsByRaceId,
    getResultsBySeason,
};
