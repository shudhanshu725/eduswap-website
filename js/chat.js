const CHAT_STORAGE_KEY = 'chatMessages';
const CHAT_USERS_STORAGE_KEY = 'users';

let selectedContact = null;
let selectedItemId = null;
let currentUser = null;

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('currentUser'));
}

function getUsers() {
    return (JSON.parse(localStorage.getItem(CHAT_USERS_STORAGE_KEY)) || []).filter(
        user => user && user.email
    );
}

function getAllItems() {
    return JSON.parse(localStorage.getItem('allItems')) || [];
}

function getMessages() {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || [];
}

function saveMessages(messages) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

function getConversationKey(emailA, emailB) {
    return [emailA.toLowerCase(), emailB.toLowerCase()].sort().join('::');
}

function getConversationMessages(contactEmail) {
    if (!currentUser || !contactEmail) return [];

    const conversationKey = getConversationKey(currentUser.email, contactEmail);
    const allMessages = getMessages();

    return allMessages
        .filter(message => message.conversationKey === conversationKey)
        .sort((a, b) => a.timestamp - b.timestamp);
}

function renderContacts() {
    const list = document.getElementById('chatUserList');
    if (!list || !currentUser) return;

    const users = getUsers().filter(
        user => user.email.toLowerCase() !== currentUser.email.toLowerCase()
    );

    if (users.length === 0) {
        list.innerHTML = '<p class="chat-placeholder">No other users found.</p>';
        return;
    }

    list.innerHTML = '';

    users.forEach(user => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chat-user-btn';
        button.textContent = `${user.name} (${user.college || user.email})`;

        if (selectedContact && selectedContact.email === user.email) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            selectedContact = user;
            selectedItemId = null;
            renderContacts();
            renderConversation();
        });

        list.appendChild(button);
    });
}

function renderConversation() {
    const title = document.getElementById('chatTitle');
    const context = document.getElementById('chatItemContext');
    const messagesWrap = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatButton = document.querySelector('#chatForm button');

    if (!title || !context || !messagesWrap || !chatInput || !chatButton) return;

    if (!selectedContact) {
        title.textContent = 'Select a contact';
        context.textContent = '';
        messagesWrap.innerHTML = '<p class="chat-placeholder">No conversation selected.</p>';
        chatInput.disabled = true;
        chatButton.disabled = true;
        return;
    }

    title.textContent = `Chat with ${selectedContact.name}`;
    context.textContent = '';

    if (selectedItemId) {
        const item = getAllItems().find(i => String(i.id) === String(selectedItemId));
        if (item) context.textContent = `Regarding: ${item.title}`;
    }

    const messages = getConversationMessages(selectedContact.email);
    chatInput.disabled = false;
    chatButton.disabled = false;

    if (messages.length === 0) {
        messagesWrap.innerHTML = '<p class="chat-placeholder">No messages yet. Start the conversation.</p>';
        return;
    }

    messagesWrap.innerHTML = '';

    messages.forEach(message => {
        const messageEl = document.createElement('div');
        const isMine = message.from === currentUser.email;
        messageEl.className = `chat-bubble ${isMine ? 'mine' : 'theirs'}`;
        messageEl.innerHTML = `
            <p>${message.text}</p>
            <span>${new Date(message.timestamp).toLocaleString()}</span>
        `;
        messagesWrap.appendChild(messageEl);
    });

    messagesWrap.scrollTop = messagesWrap.scrollHeight;
}

function sendMessage(event) {
    event.preventDefault();

    if (!currentUser || !selectedContact) return;

    const input = document.getElementById('chatInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const messages = getMessages();
    messages.push({
        id: Date.now(),
        conversationKey: getConversationKey(currentUser.email, selectedContact.email),
        from: currentUser.email,
        to: selectedContact.email,
        text,
        itemId: selectedItemId || null,
        timestamp: Date.now()
    });

    saveMessages(messages);
    input.value = '';
    renderConversation();
}

function selectInitialContact() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('user');
    const item = params.get('item');

    if (item) {
        selectedItemId = item;
    }

    if (!email) return;

    const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        selectedContact = user;
        return;
    }

    // Fallback for legacy data where seller is in items but not in users list.
    const itemData = getAllItems().find(i => String(i.id) === String(item));
    if (itemData && itemData.postedByEmail) {
        selectedContact = {
            name: itemData.postedBy || itemData.postedByEmail,
            email: itemData.postedByEmail,
            college: itemData.college || ''
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    currentUser = getCurrentUser();
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    selectInitialContact();
    renderContacts();
    renderConversation();

    const form = document.getElementById('chatForm');
    if (form) {
        form.addEventListener('submit', sendMessage);
    }
});
