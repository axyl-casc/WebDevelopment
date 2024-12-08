const express = require('express');
const helper = require('./helper');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/circuits', (req, res) => {
    res.json(helper.getAllCircuits());
});

app.get('/api/circuits/:id', (req, res) => {
    const circuit = helper.getCircuitById(req.params.id);
    if (circuit) {
        res.json(circuit);
    } else {
        res.status(404).json({ error: 'Circuit not found' });
    }
});

app.get('/api/constructors', (req, res) => {
    res.json(helper.getAllConstructors());
});

app.get('/api/constructors/:ref', (req, res) => {
    const constructor = helper.getConstructorByRef(req.params.ref);
    if (constructor) {
        res.json(constructor);
    } else {
        res.status(404).json({ error: 'Constructor not found' });
    }
});

app.get('/api/constructorResults/:ref/:year', (req, res) => {
    const results = helper.getConstructorResults(req.params.ref, req.params.year);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given constructor and year' });
    }
});

app.get('/api/drivers', (req, res) => {
    res.json(helper.getAllDrivers());
});

app.get('/api/drivers/:ref', (req, res) => {
    const driver = helper.getDriverByRef(req.params.ref);
    if (driver) {
        res.json(driver);
    } else {
        res.status(404).json({ error: 'Driver not found' });
    }
});

app.get('/api/driverResults/:ref/:year', (req, res) => {
    const results = helper.getDriverResults(req.params.ref, req.params.year);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given driver and year' });
    }
});

app.get('/api/races/season/:year', (req, res) => {
    const races = helper.getRacesBySeason(req.params.year);
    if (races.length > 0) {
        res.json(races);
    } else {
        res.status(404).json({ error: 'No races found for the given season' });
    }
});

app.get('/api/races/id/:id', (req, res) => {
    const race = helper.getRaceById(req.params.id);
    if (race) {
        res.json(race);
    } else {
        res.status(404).json({ error: 'Race not found' });
    }
});

app.get('/api/results/race/:id', (req, res) => {
    const results = helper.getResultsByRaceId(req.params.id);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given race ID' });
    }
});

app.get('/api/results/season/:year', (req, res) => {
    const results = helper.getResultsBySeason(req.params.year);
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ error: 'No results found for the given season' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
