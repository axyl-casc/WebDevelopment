# Assignment 3: Formula 1 Data API (COMP 3612)

## Overview
This project is a RESTful API for accessing and querying Formula 1-related data, including circuits, constructors, drivers, races, and results. The API provides endpoints for fetching data by ID, reference names, and year, offering a way to explore various aspects of Formula 1 history and details programmatically.

The API is built using **Node.js** and **Express** and uses JSON files as the data source. It also integrates with a deployed version available at [https://abyssinian-enshrined-rosemary.glitch.me](https://abyssinian-enshrined-rosemary.glitch.me) for testing and live usage. The project includes comprehensive endpoints for various data types and adheres to RESTful principles.

---

## Features
- Retrieve all circuits, constructors, drivers, races, and results.
- Fetch specific circuits, constructors, drivers, and races by their unique identifiers or reference names.
- Filter race results by constructors, drivers, and years.
- Get all races or results for a specific season.
- Robust error handling for invalid or missing data requests.

---

## Technologies Used
- **Node.js**: A JavaScript runtime for server-side development.
- **Express.js**: A web application framework for building RESTful APIs.
- **File System (fs)**: For reading data from JSON files.
- **JavaScript**: The programming language used for server-side logic.
- **Glitch**: For deploying and hosting the API at [https://abyssinian-enshrined-rosemary.glitch.me](https://abyssinian-enshrined-rosemary.glitch.me).

---

## Main Project Files

### **Root Directory**
- `server.js`: The main server file that defines the API routes and starts the server.
- `helper.js`: Contains utility functions for loading data and performing operations like filtering and fetching specific data.

### **Data Directory**
- `data/circuits.json`: JSON file containing information about all Formula 1 circuits.
- `data/constructors.json`: JSON file containing information about constructors.
- `data/drivers.json`: JSON file containing information about drivers.
- `data/races.json`: JSON file containing details about Formula 1 races.
- `data/results.json`: JSON file containing race results.

---

## Endpoints

### Circuits
- **`GET /api/circuits`**: Retrieves all circuits.
- **`GET /api/circuits/:id`**: Retrieves a circuit by its ID.

### Constructors
- **`GET /api/constructors`**: Retrieves all constructors.
- **`GET /api/constructors/:ref`**: Retrieves a constructor by its reference name.
- **`GET /api/constructorResults/:ref/:year`**: Retrieves race results for a specific constructor in a specific year.

### Drivers
- **`GET /api/drivers`**: Retrieves all drivers.
- **`GET /api/drivers/:ref`**: Retrieves a driver by their reference name.
- **`GET /api/driverResults/:ref/:year`**: Retrieves race results for a specific driver in a specific year.

### Races
- **`GET /api/races/season/:year`**: Retrieves all races for a specific season.
- **`GET /api/races/id/:id`**: Retrieves a race by its ID.

### Results
- **`GET /api/results/race/:id`**: Retrieves all results for a specific race by its ID.
- **`GET /api/results/season/:year`**: Retrieves all results for a specific season.

---

## API Test Cases
The following are some example API test cases hosted on [https://abyssinian-enshrined-rosemary.glitch.me](https://abyssinian-enshrined-rosemary.glitch.me):

- [/api/circuits](https://abyssinian-enshrined-rosemary.glitch.me/api/circuits)
- [/api/circuits/1](https://abyssinian-enshrined-rosemary.glitch.me/api/circuits/1)
- [/api/constructors](https://abyssinian-enshrined-rosemary.glitch.me/api/constructors)
- [/api/constructors/mclaren](https://abyssinian-enshrined-rosemary.glitch.me/api/constructors/mclaren)
- [/api/coNSTruCTors/mclaren](https://abyssinian-enshrined-rosemary.glitch.me/api/coNSTruCTors/mclaren)
- [/api/constructors/javascript](https://abyssinian-enshrined-rosemary.glitch.me/api/constructors/javascript)
- [/api/constructorResults/mclaren/2023](https://abyssinian-enshrined-rosemary.glitch.me/api/constructorResults/mclaren/2023)
- [/api/constructorResults/MERCEDES/2020](https://abyssinian-enshrined-rosemary.glitch.me/api/constructorResults/MERCEDES/2020)
- [/api/constructorResults/mclaren/2040](https://abyssinian-enshrined-rosemary.glitch.me/api/constructorResults/mclaren/2040)
- [/api/constructorResults/comp3612/2023](https://abyssinian-enshrined-rosemary.glitch.me/api/constructorResults/comp3612/2023)
- [/api/drivers](https://abyssinian-enshrined-rosemary.glitch.me/api/drivers)
- [/api/drivers/hamilton](https://abyssinian-enshrined-rosemary.glitch.me/api/drivers/hamilton)
- [/api/drivers/HAMilton](https://abyssinian-enshrined-rosemary.glitch.me/api/drivers/HAMilton)
- [/api/drivers/randy](https://abyssinian-enshrined-rosemary.glitch.me/api/drivers/randy)
- [/api/driverResults/piastre/2023](https://abyssinian-enshrined-rosemary.glitch.me/api/driverResults/piastre/2023)
- [/api/driverResults/piastre/2002](https://abyssinian-enshrined-rosemary.glitch.me/api/driverResults/piastre/2002)
- [/api/races/season/2023](https://abyssinian-enshrined-rosemary.glitch.me/api/races/season/2023)
- [/api/races/seasoning/2023](https://abyssinian-enshrined-rosemary.glitch.me/api/races/seasoning/2023)
- [/api/races/season/2032](https://abyssinian-enshrined-rosemary.glitch.me/api/races/season/2032)
- [/api/results/race/1100](https://abyssinian-enshrined-rosemary.glitch.me/api/results/race/1100)
- [/api/results/race/1756348576](https://abyssinian-enshrined-rosemary.glitch.me/api/results/race/1756348576)
- [/api/results/season/2023](https://abyssinian-enshrined-rosemary.glitch.me/api/results/season/2023)
- [/api/results/season/2034](https://abyssinian-enshrined-rosemary.glitch.me/api/results/season/2034)
