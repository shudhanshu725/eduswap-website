// Load user name
function loadUserName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').textContent = `Hi, ${currentUser.name}`;
    }
}

// Post Item Form Handler
const postItemForm = document.getElementById('postItemForm');

if (postItemForm) {
    postItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('itemTitle').value.trim();
        const category = document.getElementById('itemCategory').value;
        const description = document.getElementById('itemDescription').value.trim();
        const price = document.getElementById('itemPrice').value;
        const condition = document.getElementById('itemCondition').value;
        const contactMethod = document.getElementById('contactMethod').value;
        const termsAgree = document.getElementById('termsAgree').checked;
        
        const errorMsg = document.getElementById('post-error-message');
        const successMsg = document.getElementById('post-success-message');
        
        // Clear previous messages
        errorMsg.classList.remove('show');
        successMsg.classList.remove('show');
        
        // Validation
        if (!termsAgree) {
            errorMsg.textContent = 'Please agree to the terms';
            errorMsg.classList.add('show');
            return;
        }
        
        if (price <= 0) {
            errorMsg.textContent = 'Price must be greater than 0';
            errorMsg.classList.add('show');
            return;
        }
        
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Create item object
        const newItem = {
            id: Date.now(), // Simple unique ID
            title,
            category,
            description,
            price,
            condition,
            contactMethod,
            postedBy: currentUser.name,
            postedByEmail: currentUser.email,
            postedByPhone: currentUser.phone,
            college: currentUser.college,
            datePosted: new Date().toLocaleDateString(),
            views: 0
        };
        
        // Get existing items or create empty array
        let items = JSON.parse(localStorage.getItem('userItems')) || [];
        
        // Add new item
        items.push(newItem);
        
        // Save to localStorage
        localStorage.setItem('userItems', JSON.stringify(items));
        
        // Also save to all items (for browse page)
        let allItems = JSON.parse(localStorage.getItem('allItems')) || [];
        allItems.push(newItem);
        localStorage.setItem('allItems', JSON.stringify(allItems));
        
        // Show success message
        successMsg.textContent = 'Item posted successfully! Redirecting to dashboard...';
        successMsg.classList.add('show');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
}

// Load user name on page load
document.addEventListener('DOMContentLoaded', loadUserName);