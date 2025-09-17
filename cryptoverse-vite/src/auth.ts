import { User } from './types';

const authModal = document.getElementById('auth-modal') as HTMLDivElement | null;
const authModalContent = document.getElementById('auth-modal-content') as HTMLDivElement | null;
const startInvestingBtn = document.getElementById('start-investing-btn') as HTMLButtonElement | null;

let users: User[] = [];

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

async function loadInitialData(): Promise<void> {
    try {
        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data: { users: User[] } = await response.json();
        const baseUsers = data.users;

        const storedUsers: User[] = JSON.parse(localStorage.getItem('cryptoUsers') || '[]');

        const newUsers = storedUsers.filter(storedUser =>
            !baseUsers.some(baseUser => baseUser.id === storedUser.id)
        );

        users = [...baseUsers, ...newUsers];
        localStorage.setItem('cryptoUsers', JSON.stringify(users));
    } catch (error) {
        console.error('Failed to load user data:', error);
        const storedUsers = localStorage.getItem('cryptoUsers');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        } else {
            users = [{id: 1, fullName: "Demo User", email: "demo@example.com", password: "password123", phone: "123-456-7890", total_account_balance: 10000, investment_balance: 0, investments: []}];
            localStorage.setItem('cryptoUsers', JSON.stringify(users));
        }
    }
}

function handleLogin(e: SubmitEvent): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password.');
    }
}

function handleSignup(e: SubmitEvent): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const phone = formData.get('phone') as string;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists.');
        return;
    }

    const newUser: User = {
        id: users.length + 1,
        fullName,
        email,
        password,
        phone,
        total_account_balance: 0,
        investment_balance: 0,
        investments: [],
    };

    users.push(newUser);
    localStorage.setItem('cryptoUsers', JSON.stringify(users));

    alert('Sign up successful! Logging you in.');
    sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
    window.location.href = 'dashboard.html';
}

function openModal(): void {
    if (authModal) {
        authModal.style.display = 'flex';
        renderLoginForm();
    }
}

function closeModal(): void {
    if (authModal) {
        authModal.style.display = 'none';
    }
    if (authModalContent) {
        authModalContent.innerHTML = '';
    }
}

function renderLoginForm(): void {
    if (!authModalContent) return;
    authModalContent.innerHTML = loginFormHtml;
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin as EventListener);
    }
    const showSignup = document.getElementById('show-signup');
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            renderSignupForm();
        });
    }
    const closeButton = authModalContent.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
}

function renderSignupForm(): void {
    if (!authModalContent) return;
    authModalContent.innerHTML = signupFormHtml;
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup as EventListener);
    }
    const showLogin = document.getElementById('show-login');
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            renderLoginForm();
        });
    }
    const closeButton = authModalContent.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
}

if (startInvestingBtn) {
    startInvestingBtn.addEventListener('click', openModal);
}

window.addEventListener('click', (event: MouseEvent) => {
    if (event.target === authModal) {
        closeModal();
    }
});

loadInitialData();
