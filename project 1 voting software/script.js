let candidates = [
    { name: "Candidate A",  },
    { name: "Candidate B",  },
    { name: "Candidate C", },
    { name: "Candidate D",  }
];

let lastVoteTime = 0;
const cooldownPeriod = 15000; // 15 seconds in milliseconds
const password = "admin123"; // Set your desired password here

function loadVotes() {
    const savedVotes = localStorage.getItem('votes');
    if (savedVotes) {
        candidates = JSON.parse(savedVotes);
    }
}

function saveVotes() {
    localStorage.setItem('votes', JSON.stringify(candidates));
}

function displayCandidates() {
    const candidatesDiv = document.getElementById('candidates');
    candidatesDiv.innerHTML = '';
    candidates.forEach((candidate, index) => {
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';
        candidateDiv.innerHTML = `
            <div class="candidate-info">
                <span>${candidate.name}:</span>
            </div>
            <button onclick="vote(${index})">Vote</button>
        `;
        candidatesDiv.appendChild(candidateDiv);
    });
}

function displayResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Detailed Results</h2>';
    candidates.forEach(candidate => {
        resultsDiv.innerHTML += `<p>${candidate.name}: ${candidate.votes} vote(s)</p>`;
    });
}

function vote(index) {
    const currentTime = new Date().getTime();
    if (currentTime - lastVoteTime < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - (currentTime - lastVoteTime)) / 1000);
        alert(`Please wait ${remainingTime} seconds before voting again.`);
        return;
    }

    candidates[index].votes++;
    saveVotes();
    displayCandidates(); // Update the displayed vote counts
    lastVoteTime = currentTime;
    startCountdown();
    showVoteConfirmation(candidates[index].name);
}

function showVoteConfirmation(candidateName) {
    const confirmationDiv = document.getElementById('voteConfirmation');
    confirmationDiv.textContent = `Vote recorded for ${candidateName}!`;
    setTimeout(() => {
        confirmationDiv.textContent = '';
    }, 3000);
}

function resetVotes() {
    candidates.forEach(candidate => candidate.votes = 0);
    saveVotes();
    displayCandidates(); // Update the displayed vote counts
    alert("Votes have been reset.");
    hideResults();
}

function toggleResults() {
    const resultsDiv = document.getElementById('results');
    const viewResultsButton = document.getElementById('viewResultsButton');
    if (resultsDiv.style.display === 'none') {
        resultsDiv.style.display = 'block';
        viewResultsButton.textContent = 'Hide Detailed Results';
        displayResults();
    } else {
        hideResults();
    }
}

function hideResults() {
    const resultsDiv = document.getElementById('results');
    const viewResultsButton = document.getElementById('viewResultsButton');
    resultsDiv.style.display = 'none';
    viewResultsButton.textContent = 'View Detailed Results';
}

function startCountdown() {
    const countdownDiv = document.getElementById('countdown');
    let secondsLeft = 15;

    const countdownInterval = setInterval(() => {
        countdownDiv.textContent = `Next vote available in: ${secondsLeft} seconds`;
        secondsLeft--;

        if (secondsLeft < 0) {
            clearInterval(countdownInterval);
            countdownDiv.textContent = 'You can vote now!';
        }
    }, 1000);
}

function promptPassword(action) {
    const enteredPassword = prompt("Enter the password:");
    if (enteredPassword === password) {
        if (action === 'view') {
            toggleResults();
        } else if (action === 'reset') {
            resetVotes();
        }
    } else {
        alert("Incorrect password. Access denied.");
    }
}

// Initial setup
loadVotes();
displayCandidates();