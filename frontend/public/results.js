// Assumes this script is loaded after the DOM is ready or wrapped in DOMContentLoaded

document.addEventListener('DOMContentLoaded', function () {
    // Get results from localStorage
    const wpm = localStorage.getItem('wpm') || '0';
    const accuracy = localStorage.getItem('accuracy') || '0';
    const duration = localStorage.getItem('duration') || '60';
    const theme = localStorage.getItem('theme') || 'eclipse';

    // OPTIONAL: Get testID or userID if needed
    const testID = 1; // Replace with dynamic logic if needed

    // Send result to backend
   /* axios.post('http://localhost:3000/save-result', {
        testID: testID,
        accuracy: parseFloat(accuracy),
        words_per_minute: parseInt(wpm),
        time_taken: parseInt(duration)
    })
    .then(response => {
        console.log("Result saved:", response.data);
    })
    .catch(error => {
        console.error("Error saving result:", error);
    });
    */
    // Setup Chart.js chart
    const ctx = document.getElementById('performanceChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['WPM', 'Accuracy (%)'],
            datasets: [{
                data: [wpm, accuracy],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: theme === 'dracula' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: theme === 'dracula' ? '#fff' : '#000'
                    }
                },
                x: {
                    grid: {
                        color: theme === 'dracula' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: theme === 'dracula' ? '#fff' : '#000'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});
