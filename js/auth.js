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
        
        // For now, just show success (we'll connect to backend later)
        successMsg.textContent = 'Registration successful! Redirecting to login...';
        successMsg.classList.add('show');
        
        // Store user data temporarily in localStorage (we'll replace this with backend later)
        const userData = {
            name,
            email,
            college,
            phone,
            password // In real app, NEVER store passwords in localStorage!
        };
        
        localStorage.setItem('tempUser', JSON.stringify(userData));
        
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
        
        // Get stored user data (temporary - we'll use backend later)
        const storedUser = localStorage.getItem('tempUser');
        
        if (!storedUser) {
            errorMsg.textContent = 'No account found. Please register first.';
            errorMsg.classList.add('show');
            return;
        }
        
        const userData = JSON.parse(storedUser);
        
        // Check credentials
        if (email === userData.email && password === userData.password) {
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

// Run auth check on page load
checkAuth();