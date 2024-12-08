const fs = require('fs');
const path = require('path');

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

const getAllCircuits = () => circuits;

const getCircuitById = (id) => circuits.find(circuit => circuit.id === parseInt(id));

const getAllConstructors = () => constructors;

const getConstructorByRef = (ref) => constructors.find(constructor => constructor.ref.toLowerCase() === ref.toLowerCase());

const getConstructorResults = (ref, year) => results.filter(result => result.constructorRef.toLowerCase() === ref.toLowerCase() && result.year === parseInt(year));

const getAllDrivers = () => drivers;

const getDriverByRef = (ref) => drivers.find(driver => driver.ref.toLowerCase() === ref.toLowerCase());

const getDriverResults = (ref, year) => results.filter(result => result.driverRef.toLowerCase() === ref.toLowerCase() && result.year === parseInt(year));

const getRacesBySeason = (year) => races.filter(race => race.season === parseInt(year));

const getRaceById = (id) => races.find(race => race.id === parseInt(id));

const getResultsByRaceId = (id) => results.filter(result => result.raceId === parseInt(id));

const getResultsBySeason = (year) => results.filter(result => result.season === parseInt(year));

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
