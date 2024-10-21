document.addEventListener('DOMContentLoaded', () => {
    const reminderForm = document.getElementById('reminder-form');
    const reminderContainer = document.getElementById('reminder-container');
    const submitButton = document.getElementById('submit-button');
    const cancelButton = document.getElementById('cancel-button');

    loadReminders();

    reminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reminderId = document.getElementById('reminder-id').value;
        const title = document.getElementById('title').value.trim();
        const message = document.getElementById('message').value.trim();
        const reminderDate = document.getElementById('reminder-date').value;

        if (reminderId) {
            updateReminder(reminderId, title, message, reminderDate);
        } else {
            addReminder(title, message, reminderDate);
        }

        reminderForm.reset();
        document.getElementById('reminder-id').value = '';
        submitButton.textContent = 'Hatırlatıcı Ekle';
        cancelButton.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        reminderForm.reset();
        document.getElementById('reminder-id').value = '';
        submitButton.textContent = 'Hatırlatıcı Ekle';
        cancelButton.style.display = 'none';
    });

    function addReminder(title, message, reminderDate) {
        const reminderList = getReminderList();
        const newReminder = {
            id: Date.now(),
            title,
            message,
            reminderDate
        };
        reminderList.push(newReminder);
        saveReminderList(reminderList);
        renderReminder(newReminder);
    }

    function updateReminder(id, title, message, reminderDate) {
        let reminderList = getReminderList();
        reminderList = reminderList.map(rem => {
            if (rem.id === parseInt(id)) {
                return { id: rem.id, title, message, reminderDate };
            }
            return rem;
        });
        saveReminderList(reminderList);
        loadReminders();
    }

    function deleteReminder(id) {
        let reminderList = getReminderList();
        reminderList = reminderList.filter(rem => rem.id !== id);
        saveReminderList(reminderList);
        loadReminders();
    }

    function getReminderList() {
        const reminders = localStorage.getItem('reminderList');
        return reminders ? JSON.parse(reminders) : [];
    }

    function saveReminderList(list) {
        localStorage.setItem('reminderList', JSON.stringify(list));
    }

    function loadReminders() {
        reminderContainer.innerHTML = '';
        const reminderList = getReminderList();
        reminderList.forEach(rem => renderReminder(rem));
    }

    function renderReminder(rem) {
        const reminderItem = document.createElement('div');
        reminderItem.classList.add('reminder-item');

        const reminderTitle = document.createElement('h3');
        reminderTitle.textContent = rem.title;

        const reminderMessage = document.createElement('p');
        reminderMessage.textContent = rem.message;

        const reminderDate = document.createElement('p');
        reminderDate.classList.add('reminder-date');
        reminderDate.textContent = `Hatırlatma Tarihi: ${formatDate(rem.reminderDate)}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Düzenle';
        editButton.addEventListener('click', () => editReminder(rem.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Sil';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            if (confirm('Bu hatırlatıcıyı silmek istediğinize emin misiniz?')) {
                deleteReminder(rem.id);
            }
        });

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        reminderItem.appendChild(reminderTitle);
        reminderItem.appendChild(reminderMessage);
        reminderItem.appendChild(reminderDate);
        reminderItem.appendChild(actionsDiv);

        reminderContainer.appendChild(reminderItem);
    }

    function editReminder(id) {
        const reminderList = getReminderList();
        const rem = reminderList.find(rem => rem.id === id);
        if (rem) {
            document.getElementById('reminder-id').value = rem.id;
            document.getElementById('title').value = rem.title;
            document.getElementById('message').value = rem.message;
            document.getElementById('reminder-date').value = rem.reminderDate;
            submitButton.textContent = 'Güncelle';
            cancelButton.style.display = 'inline-block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString('tr-TR', options);
    }
});
