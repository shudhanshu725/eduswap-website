// Load user name
function loadUserName() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').textContent = `Hi, ${currentUser.name}`;
    }
}

function getAllItems() {
    return JSON.parse(localStorage.getItem('allItems')) || [];
}

function getEditItemId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('edit');
}

function loadItemForEditing() {
    const editItemId = getEditItemId();
    if (!editItemId) return;

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const allItems = getAllItems();
    const item = allItems.find(i => String(i.id) === String(editItemId));

    if (!item || !currentUser || item.postedByEmail !== currentUser.email) {
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('itemTitle').value = item.title || '';
    document.getElementById('itemCategory').value = item.category || '';
    document.getElementById('itemDescription').value = item.description || '';
    document.getElementById('itemPrice').value = item.price || '';
    document.getElementById('itemCondition').value = item.condition || '';
    document.getElementById('contactMethod').value = item.contactMethod || '';

    const heading = document.querySelector('.post-item-container h1');
    const submitBtn = document.querySelector('#postItemForm button[type="submit"]');
    if (heading) heading.textContent = 'Edit Item';
    if (submitBtn) submitBtn.textContent = 'Update Item';
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
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

        if (!currentUser) {
            errorMsg.textContent = 'Please login before posting an item';
            errorMsg.classList.add('show');
            return;
        }
        
        const editItemId = getEditItemId();
        let allItems = getAllItems();

        if (editItemId) {
            const itemIndex = allItems.findIndex(i => String(i.id) === String(editItemId));

            if (itemIndex === -1 || allItems[itemIndex].postedByEmail !== currentUser.email) {
                errorMsg.textContent = 'You cannot edit this item.';
                errorMsg.classList.add('show');
                return;
            }

            allItems[itemIndex] = {
                ...allItems[itemIndex],
                title,
                category,
                description,
                price,
                condition,
                contactMethod,
                postedBy: currentUser.name,
                postedByPhone: currentUser.phone,
                college: currentUser.college
            };
        } else {
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
            allItems.push(newItem);
        }

        localStorage.setItem('allItems', JSON.stringify(allItems));
        
        // Show success message
        successMsg.textContent = editItemId
            ? 'Item updated successfully! Redirecting to dashboard...'
            : 'Item posted successfully! Redirecting to dashboard...';
        successMsg.classList.add('show');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
}

// Load user name on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserName();
    loadItemForEditing();
});

