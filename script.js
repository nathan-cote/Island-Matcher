// Sample data - in a real app, you would load this from an API or JSON file
const islands = [
    // Example islands - you would replace with your actual 126 islands data
    {
        name: "Murano",
        affordability: 6,
        tourism: 8,
        populationDensity: 7,
        reachability: 8,
        accessibility: 7,
        greenSpace: 4,
        servability: 7
    },
    {
        name: "Burano",
        affordability: 5,
        tourism: 9,
        populationDensity: 6,
        reachability: 7,
        accessibility: 6,
        greenSpace: 5,
        servability: 6
    },
    {
        name: "Giudecca",
        affordability: 7,
        tourism: 5,
        populationDensity: 6,
        reachability: 6,
        accessibility: 7,
        greenSpace: 7,
        servability: 8
    },
    // Add all 126 islands here with their actual scores
    // ...
];

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
    // Max possible distance is sqrt(7 * 10^2) = ~26.46
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
    document.getElementById('result-affordability').textContent = island.affordability;
    document.getElementById('result-tourism').textContent = island.tourism;
    document.getElementById('result-population').textContent = island.populationDensity;
    document.getElementById('result-reachability').textContent = island.reachability;
    document.getElementById('result-accessibility').textContent = island.accessibility;
    document.getElementById('result-green-space').textContent = island.greenSpace;
    document.getElementById('result-servability').textContent = island.servability;
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