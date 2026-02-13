const USERS_STORAGE_KEY = 'users';

function getUsers() {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    if (users.length > 0) return users;

    // Backward compatibility for previous single-user storage
    const legacyUser = JSON.parse(localStorage.getItem('tempUser'));
    if (legacyUser) {
        saveUsers([legacyUser]);
        localStorage.removeItem('tempUser');
        return [legacyUser];
    }

    return [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const college = document.getElementById('college').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        const errorMsg = document.getElementById('error-message');
        const successMsg = document.getElementById('success-message');
        
        // Clear previous messages
        errorMsg.classList.remove('show');
        successMsg.classList.remove('show');
        
        // Validation
        if (password.length < 6) {
            errorMsg.textContent = 'Password must be at least 6 characters long';
            errorMsg.classList.add('show');
            return;
        }
        
        if (password !== confirmPassword) {
            errorMsg.textContent = 'Passwords do not match';
            errorMsg.classList.add('show');
            return;
        }
        
        if (!email.includes('@')) {
            errorMsg.textContent = 'Please enter a valid email address';
            errorMsg.classList.add('show');
            return;
        }
        
        const users = getUsers();
        const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());

        if (emailExists) {
            errorMsg.textContent = 'An account with this email already exists';
            errorMsg.classList.add('show');
            return;
        }

        // Store user data locally (for demo app)
        const userData = {
            name,
            email,
            college,
            phone,
            password // In real app, NEVER store plain passwords in localStorage!
        };

        users.push(userData);
        saveUsers(users);

        successMsg.textContent = 'Registration successful! Redirecting to login...';
        successMsg.classList.add('show');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}
// Login Form Handler
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const errorMsg = document.getElementById('login-error-message');
        const successMsg = document.getElementById('login-success-message');
        
        // Clear previous messages
        errorMsg.classList.remove('show');
        successMsg.classList.remove('show');
        
        const users = getUsers();

        if (users.length === 0) {
            errorMsg.textContent = 'No account found. Please register first.';
            errorMsg.classList.add('show');
            return;
        }

        const userData = users.find(
            user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
        );

        if (userData) {
            successMsg.textContent = 'Login successful! Redirecting to dashboard...';
            successMsg.classList.add('show');
            
            // Store logged in user
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            errorMsg.textContent = 'Invalid email or password';
            errorMsg.classList.add('show');
        }
    });
}

// Check if user is logged in (for protected pages)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Protected pages
    const protectedPages = ['dashboard.html', 'post-item.html'];
    
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Update navigation based on login status
function updateNavigation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navElement = document.getElementById('mainNav');
    
    if (!navElement) return;
    
    if (isLoggedIn && currentUser) {
        // Logged in - show Home, Dashboard, Browse, Post Item, and Logout
        navElement.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="browser-item.html">Browse</a></li>
            <li><a href="post-item.html">Post Item</a></li>
            <li><span style="color: #2ecc71; font-weight: bold;">Hi, ${currentUser.name}</span></li>
            <li><button onclick="logout()" class="btn-primary" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Logout</button></li>
        `;
    } else {
        // Not logged in - show Home, Browse, Login, and Sign Up
        navElement.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="browser-item.html">Browse</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html" class="btn-primary">Sign Up</a></li>
        `;
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateNavigation();
});
