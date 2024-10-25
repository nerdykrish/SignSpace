// Get references to the DOM elements
const localVideo = document.getElementById('localVideo');
const muteBtn = document.getElementById('mute-btn');
const cameraBtn = document.getElementById('camera-btn');
const endBtn = document.getElementById('end-btn');
const transcriptElement = document.getElementById('transcript');
const summaryText = document.getElementById('summary-text');
const todoList = document.querySelector('.tasks-list ul');

// Define media stream variables
let mediaStream;
let isMuted = false;
let isCameraOn = true;

// Function to start the video stream
async function startVideo() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = mediaStream;

        // Send frames to Flask
        sendFramesToFlask();
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

// Function to send video frames to Flask
async function sendFramesToFlask() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Capture frames periodically (e.g., every second)
    setInterval(() => {
        if (!isCameraOn) return; // Only send frames if the camera is on

        canvas.width = localVideo.videoWidth;
        canvas.height = localVideo.videoHeight;
        context.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('video_frame', blob);

            try {
                await fetch('/upload_frame', {
                    method: 'POST',
                    body: formData,
                });
            } catch (error) {
                console.error('Error sending video frame to Flask.', error);
            }
        }, 'image/jpeg');
    }, 1000); // Send frame every second
}

// Mute/Unmute the audio
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    mediaStream.getAudioTracks()[0].enabled = !isMuted;
    muteBtn.innerHTML = isMuted
        ? '<span class="material-icons">volume_mute</span>'
        : '<span class="material-icons">volume_up</span>';
});

// Toggle the camera
cameraBtn.addEventListener('click', () => {
    isCameraOn = !isCameraOn;
    mediaStream.getVideoTracks()[0].enabled = isCameraOn;
    cameraBtn.innerHTML = isCameraOn
        ? '<span class="material-icons">videocam</span>'
        : '<span class="material-icons">videocam_off</span>';
});

// End the call
endBtn.addEventListener('click', () => {
    mediaStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
});

// Function to fetch transcription and other data from Flask
async function fetchMeetingData() {
    try {
        const response = await fetch('/get_meeting_data');
        const data = await response.json();

        // Update the UI with the fetched data
        transcriptElement.innerText = data.transcript;
        summaryText.innerText = data.summary;

        // Update the to-do list
        todoList.innerHTML = '';
        data.todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerText = todo;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching meeting data from Flask.', error);
    }
}

// Periodically fetch meeting data every 1 second
setInterval(fetchMeetingData, 1000); // Adjust the interval as needed

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
startVideo();