const express = require('express');
const helper = require('./helper');
const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * Endpoint: GET /api/circuits
 * Description: Retrieves all circuits.
 * Response: JSON array of all circuit objects.
 */
app.get('/api/circuits', (req, res) => {
    res.json(helper.getAllCircuits());
});

/**
 * Endpoint: GET /api/circuits/:id
 * Description: Retrieves a circuit by its ID.
 * Path Parameters:
 *  - id: The ID of the circuit (number).
 * Response: JSON object of the circuit or a 404 error if not found.
 */
app.get('/api/circuits/:id', (req, res) => {
    const circuit = helper.getCircuitById(req.params.id);
    if (circuit) {
        res.json(circuit);
    } else {
        res.status(404).json({ error: 'Circuit not found' });
    }
});

/**
 * Endpoint: GET /api/constructors
 * Description: Retrieves all constructors.
 * Response: JSON array of all constructor objects.
 */
app.get('/api/constructors', (req, res) => {
    res.json(helper.getAllConstructors());
});

/**
 * Endpoint: GET /api/constructors/:ref
 * Description: Retrieves a constructor by its reference name.
 * Path Parameters:
 *  - ref: The reference name of the constructor (string, case-insensitive).
 * Response: JSON object of the constructor or a 404 error if not found.
 */
app.get('/api/constructors/:ref', (req, res) => {
    const constructor = helper.getConstructorByRef(req.params.ref);
    if (constructor) {
        res.json(constructor);
    } else {
        res.status(404).json({ error: 'Constructor not found' });
    }
});

/**
 * Endpoint: GET /api/constructorResults/:ref/:year
 * Description: Retrieves race results for a specific constructor in a specific year.
 * Path Parameters:
 *  - ref: The reference name of the constructor (string, case-insensitive).
 *  - year: The year of the races (number).
 * Response: JSON array of results or a 404 error if no results are found.
 */
app.get('/api/constructorResults/:ref/:year', (req, res) => {
    const results = helper.getConstructorResults(req.params.ref, req.params.year);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given constructor and year' });
    }
});

/**
 * Endpoint: GET /api/drivers
 * Description: Retrieves all drivers.
 * Response: JSON array of all driver objects.
 */
app.get('/api/drivers', (req, res) => {
    res.json(helper.getAllDrivers());
});

/**
 * Endpoint: GET /api/drivers/:ref
 * Description: Retrieves a driver by their reference name.
 * Path Parameters:
 *  - ref: The reference name of the driver (string, case-insensitive).
 * Response: JSON object of the driver or a 404 error if not found.
 */
app.get('/api/drivers/:ref', (req, res) => {
    const driver = helper.getDriverByRef(req.params.ref);
    if (driver) {
        res.json(driver);
    } else {
        res.status(404).json({ error: 'Driver not found' });
    }
});

/**
 * Endpoint: GET /api/driverResults/:ref/:year
 * Description: Retrieves race results for a specific driver in a specific year.
 * Path Parameters:
 *  - ref: The reference name of the driver (string, case-insensitive).
 *  - year: The year of the races (number).
 * Response: JSON array of results or a 404 error if no results are found.
 */
app.get('/api/driverResults/:ref/:year', (req, res) => {
    const results = helper.getDriverResults(req.params.ref, req.params.year);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given driver and year' });
    }
});

/**
 * Endpoint: GET /api/races/season/:year
 * Description: Retrieves all races for a specific season.
 * Path Parameters:
 *  - year: The year of the season (number).
 * Response: JSON array of race objects or a 404 error if no races are found.
 */
app.get('/api/races/season/:year', (req, res) => {
    const races = helper.getRacesBySeason(req.params.year);
    if (races.length > 0) {
        res.json(races);
    } else {
        res.status(404).json({ error: 'No races found for the given season' });
    }
});

/**
 * Endpoint: GET /api/races/id/:id
 * Description: Retrieves a race by its ID.
 * Path Parameters:
 *  - id: The ID of the race (number).
 * Response: JSON object of the race or a 404 error if not found.
 */
app.get('/api/races/id/:id', (req, res) => {
    const race = helper.getRaceById(req.params.id);
    if (race) {
        res.json(race);
    } else {
        res.status(404).json({ error: 'Race not found' });
    }
});

/**
 * Endpoint: GET /api/results/race/:id
 * Description: Retrieves all results for a specific race by its ID.
 * Path Parameters:
 *  - id: The ID of the race (number).
 * Response: JSON array of results or a 404 error if no results are found.
 */
app.get('/api/results/race/:id', (req, res) => {
    const results = helper.getResultsByRaceId(req.params.id);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given race ID' });
    }
});

/**
 * Endpoint: GET /api/results/season/:year
 * Description: Retrieves all results for a specific season.
 * Path Parameters:
 *  - year: The year of the season (number).
 * Response: JSON array of results or a 404 error if no results are found.
 */
app.get('/api/results/season/:year', (req, res) => {
    const results = helper.getResultsBySeason(req.params.year);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given season' });
    }
});


// Catch-all route for undefined endpoints
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});


/**
 * Starts the server and listens on the specified port.
 */
app.listen(PORT, () => {
    console.log(`Server is running`);
});
