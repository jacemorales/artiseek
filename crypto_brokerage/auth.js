document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const authModalContent = document.getElementById('auth-modal-content');
    const startInvestingBtn = document.getElementById('start-investing-btn');

    let users = [];

    const loginFormHtml = `
        <span class="close-button">&times;</span>
        <h2>Login</h2>
        <form id="login-form">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required value="demo@example.com">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required value="password123">
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#" id="show-signup">Sign Up</a></p>
    `;

    const signupFormHtml = `
        <span class="close-button">&times;</span>
        <h2>Sign Up</h2>
        <form id="signup-form">
            <label for="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required>
            <label for="signup-email">Email:</label>
            <input type="email" id="signup-email" name="email" required>
            <label for="signup-password">Password:</label>
            <input type="password" id="signup-password" name="password" required>
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" name="confirmPassword" required>
            <label for="phone">Phone Number (Optional):</label>
            <input type="tel" id="phone" name="phone">
            <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="#" id="show-login">Login</a></p>
    `;

    async function loadInitialData() {
        try {
            const response = await fetch('db.json');
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();

            if (!localStorage.getItem('cryptoUsers')) {
                localStorage.setItem('cryptoUsers', JSON.stringify(data.users));
            }
            users = JSON.parse(localStorage.getItem('cryptoUsers'));
        } catch (error) {
            console.error('Failed to load user data:', error);
            // Fallback with demo user if db.json fails
            if (!localStorage.getItem('cryptoUsers')) {
                users = [{id: 1, fullName: "Demo User", email: "demo@example.com", password: "password123", phone: "123-456-7890", acc_bal: 10000}];
                localStorage.setItem('cryptoUsers', JSON.stringify(users));
            }
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            alert('Login successful!');
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password.');
        }
    }

    function handleSignup(e) {
        e.preventDefault();
        const fullName = e.target.fullName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const phone = e.target.phone.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (users.find(u => u.email === email)) {
            alert('User with this email already exists.');
            return;
        }

        const newUser = {
            id: users.length + 1,
            fullName,
            email,
            password,
            phone,
            total_account_balance: 0,
            investment_balance: 0
        };

        users.push(newUser);
        localStorage.setItem('cryptoUsers', JSON.stringify(users));

        alert('Sign up successful! Logging you in.');
        sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
        window.location.href = 'dashboard.html';
    }

    function openModal() {
        authModal.style.display = 'flex';
        renderLoginForm();
    }

    function closeModal() {
        authModal.style.display = 'none';
        authModalContent.innerHTML = '';
    }

    function renderLoginForm() {
        authModalContent.innerHTML = loginFormHtml;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('show-signup').addEventListener('click', (e) => {
            e.preventDefault();
            renderSignupForm();
        });
        authModalContent.querySelector('.close-button').addEventListener('click', closeModal);
    }

    function renderSignupForm() {
        authModalContent.innerHTML = signupFormHtml;
        document.getElementById('signup-form').addEventListener('submit', handleSignup);
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            renderLoginForm();
        });
        authModalContent.querySelector('.close-button').addEventListener('click', closeModal);
    }

    if(startInvestingBtn) {
        startInvestingBtn.addEventListener('click', openModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target == authModal) {
            closeModal();
        }
    });

    loadInitialData();
});
