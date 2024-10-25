document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('login-button');
    const randomFactElement = document.getElementById('random-fact');

    if (localStorage.getItem('loggedIn') === 'true') {
        loginButton.style.display = 'none';
    }

    loginButton.addEventListener('click', function () {
        const username = prompt("Enter Username:");
        const password = prompt("Enter Password:");

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch('/login', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.login) {
                    localStorage.setItem('loggedIn', 'true');
                    loginButton.style.display = 'none';
                } else {
                    alert('Invalid login');
                }
            });
    });

    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = hours + ':' + (minutes < 10 ? '0' : '') + minutes;
        document.getElementById('current-time').textContent = timeString;
    }
    setInterval(updateClock, 1000);

    const facts = [
        "Sign language is recognized as an official language in many countries.",
        "SignSpace offers live transcription to support the hearing impaired.",
        "Real-time transcription can help improve accessibility for all users.",
        "Over 70 million people worldwide use sign language to communicate.",
        "SignSpace integrates assistive technology to make communication easier."
    ];

    function displayRandomFacts() {
        const factsContainer = document.getElementById('facts-container');
        factsContainer.innerHTML = '';

        // Shuffle and select 4-5 random facts
        const randomFacts = facts.sort(() => 0.5 - Math.random()).slice(0, 5);

        // Display each fact
        randomFacts.forEach(fact => {
            const factElement = document.createElement('p');
            factElement.textContent = fact;
            factsContainer.appendChild(factElement);
        });
    }

    // Call displayRandomFacts initially
    displayRandomFacts();


    function updateTime() {
        const timeElement = document.querySelector('.time');
        const now = new Date();

        // Format options for date and time
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };

        // Format the time string
        const formattedTime = now.toLocaleTimeString('en-US', options).replace(',', ' •');

        // Update the time element's content
        timeElement.textContent = formattedTime;
    }

    // Update the time every second
    setInterval(updateTime, 1000);

    // Call updateTime initially to set the time right away
    updateTime();
});
