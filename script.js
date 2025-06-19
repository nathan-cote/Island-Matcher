function csvToMatrix(csvText, delimiter = ',') {
  return csvText
    .trim()
    .split('\n') // split into rows
    .map(row => row.split(delimiter)); // split each row into columns
}

function parseIslandsMatrix(matrix) {
  // Skip the first two rows (header and empty row)
  const dataRows = matrix.slice(2);
  
  return dataRows.map(row => {
    // Map CSV columns to our expected properties
    return {
      name: row[1].trim(), // "Wiki Friendly Name"
      affordability: parseFloat(row[7]), // "Affordability (Scaled)"
      tourism: parseFloat(row[11]), // "Touristy (Scaled)"
      populationDensity: parseFloat(row[13]), // "Congestion (Scaled)"
      reachability: parseFloat(row[16]), // "Reachability (Scaled)"
      accessibility: parseFloat(row[15]), // "Accessibility"
      greenSpace: parseFloat(row[18]), // "Green Space (Scaled)"
      servability: parseFloat(row[9]), // "Well-Served (Scaled)"
      streetView: row[5].trim()
    };
  });
}

let islands = [];

fetch('./ISLES_ Data Hub - indicatorsInnerCity.csv')
  .then(response => response.text())
  .then(csvText => {
    const matrix = csvToMatrix(csvText);
    islands = parseIslandsMatrix(matrix);
    console.log('Loaded islands data:', islands);
  })
  .catch(err => console.error(err));

// Helper function to calculate similarity between user preferences and island data
function calculateSimilarity(userPrefs, island) {
    // Calculate Euclidean distance between user preferences and island attributes
    let sumOfSquares = 0;
    const attributes = ['affordability', 'tourism', 'populationDensity', 'reachability', 'accessibility', 'greenSpace', 'servability'];
    
    attributes.forEach(attr => {
        sumOfSquares += Math.pow(userPrefs[attr] - island[attr], 2);
    });
    
    const distance = Math.sqrt(sumOfSquares);
    
    // Convert distance to similarity percentage (lower distance = higher similarity)
    const maxDistance = Math.sqrt(7 * 100);
    const similarity = ((maxDistance - distance) / maxDistance) * 100;
    
    return Math.round(similarity * 10) / 10; // Round to 1 decimal place
}

// Find the most similar island to user preferences
function findMostSimilarIsland(userPrefs) {
    let mostSimilarIsland = null;
    let highestSimilarity = -1;
    
    islands.forEach(island => {
        const similarity = calculateSimilarity(userPrefs, island);
        
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            mostSimilarIsland = island;
        }
    });
    
    return {
        island: mostSimilarIsland,
        similarity: highestSimilarity
    };
}

// Update slider value displays
function setupSliderValueDisplays() {
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(`${slider.id}-value`);
        valueDisplay.textContent = slider.value;
        
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });
    });
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get user preferences
    const userPrefs = {
        affordability: parseInt(document.getElementById('affordability').value),
        tourism: parseInt(document.getElementById('tourism').value),
        populationDensity: parseInt(document.getElementById('population').value),
        reachability: parseInt(document.getElementById('reachability').value),
        accessibility: parseInt(document.getElementById('accessibility').value),
        greenSpace: parseInt(document.getElementById('green-space').value),
        servability: parseInt(document.getElementById('servability').value)
    };
    
    // Find most similar island
    const result = findMostSimilarIsland(userPrefs);
    const island = result.island;
    const similarity = result.similarity;
    
    // Display results
    document.getElementById('island-name').textContent = island.name;
    document.getElementById('result-affordability').textContent = Math.round(island.affordability * 100) / 100;
    document.getElementById('result-tourism').textContent = Math.round(island.tourism * 100) / 100;
    document.getElementById('result-population').textContent = Math.round(island.populationDensity * 100) / 100;
    document.getElementById('result-reachability').textContent = Math.round(island.reachability * 100) / 100;
    document.getElementById('result-accessibility').textContent = Math.round(island.accessibility * 100) / 100;
    document.getElementById('result-green-space').textContent = Math.round(island.greenSpace * 100) / 100;
    document.getElementById('result-servability').textContent = Math.round(island.servability * 100) / 100;
    document.getElementById('result-streetView').textContent = island.streetView;
    document.getElementById('similarity-score').textContent = `${similarity}%`;
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    setupSliderValueDisplays();
    
    document.getElementById('preference-form').addEventListener('submit', handleFormSubmit);
    
    document.getElementById('try-again-btn').addEventListener('click', () => {
        document.getElementById('results').style.display = 'none';
        document.getElementById('preference-form').scrollIntoView({ behavior: 'smooth' });
    });
});