document.getElementById('checkButton').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
  
    if (url) {
      // Show loading message
      document.getElementById('results').innerHTML = 'Loading...';
  
      fetch(`http://localhost:3001/accessibility-check?url=${encodeURIComponent(url)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const { score, suggestions, violations } = data;
  
          // Display the score
          let resultHTML = `<h3>Accessibility Score: ${score}%</h3>`;
  
          // Show a summary of violations
          resultHTML += `<p>Total Violations: ${violations}</p>`;
  
          // Display suggestions for improvement
          if (violations > 0) {
            resultHTML += '<h4>Suggestions for Improvement:</h4><ul>';
            suggestions.forEach(suggestion => {
              resultHTML += `
                <li>
                  <b>${suggestion.description}</b>: <a href="${suggestion.helpUrl}" target="_blank">Learn More</a><br>
                  <i>${suggestion.help}</i>
                </li>
              `;
            });
            resultHTML += '</ul>';
          } else {
            resultHTML += '<p>No violations found. Your page is accessible!</p>';
          }
  
          // Update the DOM with the results
          document.getElementById('results').innerHTML = resultHTML;
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('results').innerHTML = 'An error occurred. Please try again later.';
        });
    } else {
      alert('Please enter a URL.');
    }
  });
  