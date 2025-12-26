document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        const emailInput = document.querySelector('.form__input[name="email"]');
        const passwordInput = document.querySelector('.form__input[name="password"]');

        const email = emailInput.value;
        const password = passwordInput.value;

        // Send POST request to backend for user authentication
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid email or password. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            // Redirect to dashboard or home page after successful login
            window.location.href = '/dashboard'; // Example redirection to dashboard
        })
        .catch(error => {
            // Display error message to the user
            setFormMessage(loginForm, "error", error.message);
        });
    });
});
