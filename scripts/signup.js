document.addEventListener("DOMContentLoaded", () => {
    const createAccountForm = document.querySelector("#createAccount");

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();

        const emailInput = document.querySelector('.form__input[name="email"]');
        const firstNameInput = document.querySelector('.form__input[name="firstName"]');
        const lastNameInput = document.querySelector('.form__input[name="lastName"]');
        const companyInput = document.querySelector('.form__input[name="company"]');
        const passwordInput = document.querySelector('.form__input[name="password"]');

        const email = emailInput.value;
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const company = companyInput.value;
        const password = passwordInput.value;

        // Send POST request to backend for user registration
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, firstName, lastName, company, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            // Redirect to dashboard or home page after successful registration
            window.location.href = '/dashboard'; // Example redirection to dashboard
        })
        .catch(error => {
            // Display error message to the user
            setFormMessage(createAccountForm, "error", error.message);
        });
    });
});
