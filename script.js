// Toggle password visibility
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = passwordInput.parentElement.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Show register form
function showRegister() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
    document.getElementById("form-title").innerText = "Register";
    clearStatus();
}

// Show login form
function showLogin() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("form-title").innerText = "Login";
    clearStatus();
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('auth-status');
    statusDiv.textContent = message;
    statusDiv.className = 'auth-status ' + type;
}

// Clear status message
function clearStatus() {
    const statusDiv = document.getElementById('auth-status');
    statusDiv.textContent = '';
    statusDiv.className = 'auth-status';
    statusDiv.style.display = 'none';
}

// Check if user is logged in
function checkAuth() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        showDashboard();
    }
}

// Show dashboard
function showDashboard() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    document.body.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1>Welcome to Your Dashboard</h1>
                <div class="user-info">
                    <span>Hello, <strong>${loggedInUser.username}</strong></span>
                    <button id="logout-btn">Logout</button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="welcome-message">
                    <h2>Welcome back!</h2>
                    <p>Email: ${loggedInUser.email}</p>
                    <p>Member since: ${new Date(loggedInUser.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Users</h3>
                        <div class="value">${users.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Your Status</h3>
                        <div class="value">Active</div>
                    </div>
                    <div class="stat-card">
                        <h3>Last Login</h3>
                        <div class="value">Now</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="goToSignUpPage()" style="background: #2ecc71;">Go to Advanced Sign Up</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    location.reload();
}

// Register form handler
document.getElementById("register-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

    // Validation
    let isValid = true;
    let errors = [];

    if (username.length < 3) {
        errors.push("Username must be at least 3 characters");
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Please enter a valid email address");
        isValid = false;
    }

    if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
        isValid = false;
    }

    if (password !== confirmPassword) {
        errors.push("Passwords do not match");
        isValid = false;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        errors.push("Email already registered");
        isValid = false;
    }

    if (users.some(user => user.username === username)) {
        errors.push("Username already taken");
        isValid = false;
    }

    if (!isValid) {
        showStatus(errors.join('\n'), 'error');
        return;
    }

    // Create new user
    const newUser = {
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        isActive: true
    };

    // Save to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    localStorage.setItem('loggedInUser', JSON.stringify({
        username: username,
        email: email,
        loggedInAt: new Date().toISOString()
    }));

    showStatus("Registration successful! Redirecting...", 'success');
    
    setTimeout(() => {
        showDashboard();
    }, 1500);
});

// Login form handler
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    // Get users from storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => 
        (u.username === username || u.email === username) && 
        u.password === password
    );

    if (user) {
        // Set logged in user
        localStorage.setItem('loggedInUser', JSON.stringify({
            username: user.username,
            email: user.email,
            loggedInAt: new Date().toISOString()
        }));

        showStatus("Login successful! Redirecting...", 'success');
        
        setTimeout(() => {
            showDashboard();
        }, 1500);
    } else {
        showStatus("Invalid username/email or password", 'error');
    }
});

// Redirect to advanced sign-up page
function goToSignUpPage() {
    window.location.href = 'signup.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Add some sample data if none exists
    if (!localStorage.getItem('users')) {
        const sampleUsers = [
            {
                username: "admin",
                email: "admin@example.com",
                password: "admin123",
                createdAt: new Date().toISOString(),
                isActive: true
            }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
});