// Load user data and display name
function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userNameDisplay').textContent = `Hi, ${currentUser.name}`;
    }
}

// Load user's posted items
function loadUserItems() {
    const items = JSON.parse(localStorage.getItem('userItems')) || [];
    const itemsGrid = document.getElementById('itemsGrid');
    const noItemsMessage = document.getElementById('noItemsMessage');
    
    // Update stats
    document.getElementById('totalItems').textContent = items.length;
    document.getElementById('activeItems').textContent = items.length;
    document.getElementById('viewCount').textContent = items.length * 15; // Mock view count
    
    if (items.length === 0) {
        noItemsMessage.style.display = 'block';
        itemsGrid.style.display = 'none';
    } else {
        noItemsMessage.style.display = 'none';
        itemsGrid.style.display = 'grid';
        
        itemsGrid.innerHTML = '';
        
        items.forEach((item, index) => {
            const itemCard = createItemCard(item, index);
            itemsGrid.innerHTML += itemCard;
        });
    }
}

// Create item card HTML
function createItemCard(item, index) {
    const categoryEmojis = {
        'Books': '📚',
        'Notes': '📝',
        'Calculator': '🧮',
        'Lab Equipment': '🔬',
        'Electronics': '💻',
        'Other': '📦'
    };
    
    const emoji = categoryEmojis[item.category] || '📦';
    
    return `
        <div class="item-card">
            <div class="item-image">${emoji}</div>
            <div class="item-details">
                <h3>${item.title}</h3>
                <span class="item-category">${item.category}</span>
                <p class="item-description">${item.description}</p>
                <p class="item-price">₹${item.price}</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editItem(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem(${index})">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Delete item function
function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        let items = JSON.parse(localStorage.getItem('userItems')) || [];
        items.splice(index, 1);
        localStorage.setItem('userItems', JSON.stringify(items));
        loadUserItems();
    }
}

// Edit item function (we'll implement this later)
function editItem(index) {
    alert('Edit functionality coming soon! For now, you can delete and re-post the item.');
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadUserItems();
});