let leftPanel;

document.addEventListener('DOMContentLoaded', function () {
    leftPanel = document.getElementById('left-panel');

    function updateTime() {
        const timeElement = document.querySelector('.time');
        const now = new Date();

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };

        const formattedTime = now.toLocaleTimeString('en-US', options).replace(',', ' •');

        timeElement.innerText = formattedTime;
    }

    setInterval(updateTime, 1000);

    updateTime();

    const facts = [
        "Sign language is recognized as an official language in many countries.",
        "SignSpace offers live transcription to support the hearing impaired.",
        "Real-time transcription can help improve accessibility for all users.",
        "Over 70 million people worldwide use sign language to communicate.",
        "SignSpace integrates assistive technology to make communication easier.",
        "The first formal sign language was created in France in the 18th century.",
        "There are over 300 different types of sign languages used around the world.",
        "American Sign Language (ASL) is different from British Sign Language (BSL).",
        "Sign language has its own grammar and syntax rules.",
        "Facial expressions play a vital role in sign language communication.",
        "Sign languages are unique to their regions and cultures.",
        "International Sign is a pidgin sign language used at international events.",
        "ASL uses a one-handed alphabet, while BSL uses a two-handed alphabet.",
        "Sign language can convey tone and emotion, just like spoken languages.",
        "SignSpace helps reduce communication barriers in professional settings.",
        "Studies show that learning sign language can improve cognitive abilities.",
        "Sign language is also used by people who can hear but cannot speak.",
        "SignSpace offers a more inclusive environment for virtual meetings.",
        "Children can start learning sign language as early as six months old.",
        "Many countries recognize their local sign language as an official language.",
        "SignSpace promotes digital accessibility for people with hearing impairments.",
        "Real-time transcription is also beneficial for non-native speakers.",
        "Sign languages are often influenced by the local spoken languages.",
        "Sign language is used by many people with Down syndrome to communicate.",
        "SignSpace aims to bridge the gap between hearing and non-hearing individuals.",
        "Learning sign language can boost memory and spatial reasoning skills.",
        "SignSpace’s technology makes meetings accessible for diverse audiences.",
        "Sign language can be used to communicate across long distances.",
        "ASL and BSL differ significantly in vocabulary and structure.",
        "Many deaf people consider sign language a core part of their identity.",
        "Sign language is not a universal language; each country has its own version.",
        "SignSpace includes captioning options for a more complete experience.",
        "Sign language interpreters are highly skilled professionals.",
        "The World Federation of the Deaf advocates for sign language rights.",
        "SignSpace helps improve workplace inclusivity and accessibility.",
        "Learning sign language can improve fine motor skills.",
        "Sign language has been shown to enhance early language acquisition in children.",
        "SignSpace’s transcription ensures important information is not missed.",
        "Sign language has evolved independently in many parts of the world.",
        "SignSpace is committed to accessibility for all communication needs.",
        "Sign language is often taught in schools as a second language option.",
        "SignSpace integrates accessibility tools seamlessly into video calls.",
        "Sign language can be used in loud environments where speaking is difficult.",
        "Real-time transcription can help those with auditory processing issues.",
        "SignSpace empowers deaf professionals by making meetings accessible.",
        "Sign language includes a rich set of idioms and expressions.",
        "Many famous figures advocate for sign language rights and awareness.",
        "SignSpace adapts to meet the needs of a diverse user base.",
        "Sign languages are complex and fully functional natural languages.",
        "Deaf culture and sign language are closely intertwined.",
        "SignSpace provides tools to create more inclusive virtual communities.",
        "Learning sign language can build empathy and understanding.",
        "Sign language uses space and movement in unique ways to convey meaning.",
        "SignSpace’s mission is to promote communication equality.",
        "Sign language is often a primary language for many deaf individuals.",
        "SignSpace’s captioning feature benefits non-native speakers as well.",
        "Sign language is not merely gestures but a full language system.",
        "SignSpace makes collaboration easier across different communication needs.",
        "Some schools offer ASL as a foreign language credit.",
        "SignSpace supports language diversity within virtual meetings.",
        "Sign language provides a sense of belonging in the deaf community.",
        "SignSpace’s real-time tools ensure seamless communication.",
        "Many countries have national days dedicated to sign language awareness.",
        "SignSpace is accessible to users with various disabilities.",
        "The use of sign language has been documented for thousands of years.",
        "SignSpace allows users to interact inclusively in real time.",
        "Sign language can strengthen social connections among deaf individuals.",
        "SignSpace’s transcription feature enhances accessibility for all users.",
        "Sign languages have distinct dialects and regional variations.",
        "SignSpace is helping set new standards for virtual accessibility.",
        "Sign language is vital for deaf education and empowerment.",
        "SignSpace’s assistive tools are user-friendly and adaptable.",
        "Many organizations provide free sign language courses online.",
        "SignSpace bridges communication gaps in a digital world.",
        "Sign language interpreters are often essential in public events.",
        "SignSpace makes online events accessible for diverse audiences.",
        "Sign language has its own literary traditions and storytelling.",
        "SignSpace offers transcription options for a range of languages.",
        "Learning sign language can improve multitasking abilities.",
        "SignSpace’s features are designed with inclusivity in mind.",
        "Many public services are now required to have sign language interpreters.",
        "SignSpace promotes a culture of accessibility and respect.",
        "Deaf individuals often use sign language in social and community events.",
        "SignSpace provides real-time captions to enhance comprehension.",
        "Sign languages are celebrated through various international events.",
        "SignSpace makes business meetings accessible to all.",
        "Many children benefit from learning basic sign language skills.",
        "SignSpace empowers users to interact without barriers.",
        "Sign language can improve spatial and visual memory.",
        "SignSpace promotes equality by making meetings accessible.",
        "Learning sign language can be a rewarding and enjoyable experience.",
        "SignSpace supports closed captioning to aid comprehension.",
        "Many popular apps now include sign language support.",
        "SignSpace integrates with various accessibility technologies.",
        "Sign languages are a natural and important part of human diversity.",
        "SignSpace’s tools support collaborative and accessible environments.",
        "Some animals have been taught to use sign language symbols.",
        "SignSpace brings people together regardless of hearing ability.",
        "Sign language is an expressive and versatile form of communication."
    ];

    function displayRandomFacts() {
        const factsContainer = document.getElementById('facts-container');
        factsContainer.innerHTML = '';
        const randomFacts = facts.sort(() => 0.5 - Math.random()).slice(0, 1);

        randomFacts.forEach(fact => {
            const factElement = document.createElement('p');
            factElement.textContent = fact;
            factsContainer.appendChild(factElement);
        });
    }

    displayRandomFacts();

    const toggleButton = document.getElementById('theme-toggle');

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');

        // Switch icon between sun and moon
        if (document.body.classList.contains('light-themef')) {
            toggleButton.innerText = 'brightness_7';
        } else {
            toggleButton.innerText = 'brightness_4';
        }
    });
});

function loadLeftPanel(panelType, callback) {
    fetch(`/panels/${panelType}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Panel not found');
            }
            return response.text();
        })
        .then(html => {
            leftPanel.innerHTML = html;
            if (callback) {
                callback(); // Execute the callback if provided
            }
        })
        .catch(error => console.error('Error loading left panel:', error));
}


