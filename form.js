const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const retrieveEmail = document.getElementById('retrieve-email');
const spinner = document.getElementById('loading-spinner'); // Spinner element
const rememberMeCheckbox = document.getElementById('remember-me'); // Remember Me checkbox
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', () => {
    const passwordInput = document.getElementById('password-input');
    const icon = this;
    
    // Toggle the type attribute and the icon class
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash'); // Changes to a slash eye icon when visible
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye'); // Reverts to eye icon when hidden
    }
});

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const loginForm = document.querySelector('.sign-in form');
const emailInput = loginForm.querySelector('input[type="email"]');
const passwordInput = loginForm.querySelector('input[type="password"]');
const signInButton = loginForm.querySelector('button[type="submit"]');

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}

function checkFormValidity() {
    const isEmailValid = validateEmail(emailInput.value.trim());
    const isPasswordValid = validatePassword(passwordInput.value.trim());
    signInButton.disabled = !(isEmailValid && isPasswordValid);
}

emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() !== '') {
        emailInput.style.borderColor = validateEmail(emailInput.value) ? '#4CAF50' : '#FF4B2B';
    } else {
        emailInput.style.borderColor = '';
    }
    checkFormValidity();
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim() !== '') {
        passwordInput.style.borderColor = validatePassword(passwordInput.value) ? '#4CAF50' : '#FF4B2B';
    } else {
        passwordInput.style.borderColor = '';
    }
    checkFormValidity();
});

// Load Remember Me state
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('rememberMe') === 'true') {
        emailInput.value = localStorage.getItem('username') || '';
        rememberMeCheckbox.checked = true;
    }
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!signInButton.disabled) {
        const username = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = rememberMeCheckbox.checked;

        // Storing the Remember Me checked user
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('rememberMe');
        }

        // Show the spinner
        spinner.style.display = 'block';

        // 3 Seconds delay for Loading Spinner after that Api call will happen
        setTimeout(async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Success:', data);

                // DOM Manipulation 
                retrieveEmail.innerHTML = `<h2>${username}!</h2>`;

                const paragraph = document.getElementById('info-paragraph');
                paragraph.innerHTML = 'You have successfully logged in.';

                container.classList.add("animation-complete");
                
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to login. Please try again.');
            } finally {
                // Hide the spinner after the API call
                spinner.style.display = 'none';
            }
        }, 3000); 
    } else {
        alert('Please ensure all fields are valid before submitting.');
    }
});