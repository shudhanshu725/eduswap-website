// Load all items from localStorage
function loadAllItems() {
    const allItems = JSON.parse(localStorage.getItem('allItems')) || JSON.parse(localStorage.getItem('userItems')) || [];
    return allItems;
}

// Display items in the grid
function displayItems(items) {
    const itemsGrid = document.getElementById('browseItemsGrid');
    const itemCount = document.getElementById('itemCount');
    const noItemsFound = document.getElementById('noItemsFound');
    
    if (!itemsGrid) return;
    
    itemCount.textContent = items.length;
    
    if (items.length === 0) {
        itemsGrid.innerHTML = '';
        noItemsFound.style.display = 'block';
        itemsGrid.style.display = 'none';
    } else {
        noItemsFound.style.display = 'none';
        itemsGrid.style.display = 'grid';
        
        itemsGrid.innerHTML = '';
        
        items.forEach((item) => {
            const itemCard = createBrowseItemCard(item);
            itemsGrid.innerHTML += itemCard;
        });
    }
}

// Create item card HTML for browse page
function createBrowseItemCard(item) {
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
        <div class="item-card" onclick="showItemDetails('${item.id}')">
            <div class="item-image">${emoji}</div>
            <div class="item-details">
                <h3>${item.title}</h3>
                <span class="item-category">${item.category}</span>
                <p class="item-description">${item.description.substring(0, 80)}${item.description.length > 80 ? '...' : ''}</p>
                <p class="item-price">₹${item.price}</p>
                <p class="item-seller">Posted by: ${item.postedBy}</p>
            </div>
        </div>
    `;
}

// Show item details in modal
function showItemDetails(itemId) {
    const allItems = loadAllItems();
    const item = allItems.find(i => i.id == itemId);
    
    if (!item) return;
    
    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');
    
    const categoryEmojis = {
        'Books': '📚',
        'Notes': '📝',
        'Calculator': '🧮',
        'Lab Equipment': '🔬',
        'Electronics': '💻',
        'Other': '📦'
    };
    
    const emoji = categoryEmojis[item.category] || '📦';
    
    modalBody.innerHTML = `
        <div class="modal-item-details">
            <div class="modal-item-image">${emoji}</div>
            <h2>${item.title}</h2>
            <span class="item-category">${item.category}</span>
            <p class="item-price">₹${item.price}</p>
            
            <div class="item-info">
                <p><strong>Condition:</strong> ${item.condition}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>College:</strong> ${item.college}</p>
                <p><strong>Posted by:</strong> ${item.postedBy}</p>
                <p><strong>Date Posted:</strong> ${item.datePosted}</p>
            </div>
            
            <div class="contact-info">
                <h3>Contact Information</h3>
                ${item.contactMethod === 'Email'
                    ? `<p>Email: <a href="mailto:${item.postedByEmail}">${item.postedByEmail}</a></p>`
                    : item.contactMethod === 'Both'
                        ? `<p>Email: <a href="mailto:${item.postedByEmail}">${item.postedByEmail}</a></p><p>Phone: ${item.postedByPhone}</p>`
                        : `<p>Phone: ${item.postedByPhone}</p>`}
            </div>
            
            <button class="btn-primary" onclick="closeModal()">Close</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
}

// Filter and search items
function filterItems() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const conditionFilter = document.getElementById('conditionFilter').value;
    
    let allItems = loadAllItems();
    
    // Filter by search term
    if (searchInput) {
        allItems = allItems.filter(item => 
            item.title.toLowerCase().includes(searchInput) || 
            item.description.toLowerCase().includes(searchInput)
        );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
        allItems = allItems.filter(item => item.category === categoryFilter);
    }
    
    // Filter by condition
    if (conditionFilter !== 'all') {
        allItems = allItems.filter(item => item.condition === conditionFilter);
    }
    
    // Filter by price
    if (priceFilter !== 'all') {
        allItems = allItems.filter(item => {
            const price = parseInt(item.price);
            switch(priceFilter) {
                case '0-500':
                    return price < 500;
                case '500-1000':
                    return price >= 500 && price < 1000;
                case '1000-2000':
                    return price >= 1000 && price < 2000;
                case '2000+':
                    return price >= 2000;
                default:
                    return true;
            }
        });
    }
    
    displayItems(allItems);
}

// Event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
    // Load all items on page load
    displayItems(loadAllItems());
    
    // Add event listeners for search and filters
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const conditionFilter = document.getElementById('conditionFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterItems);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterItems);
    }
    
    if (conditionFilter) {
        conditionFilter.addEventListener('change', filterItems);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('itemModal');
    if (modal) {
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        }
    }
    
    // Close modal button
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }
});

