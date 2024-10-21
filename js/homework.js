document.addEventListener('DOMContentLoaded', () => {
    const homeworkForm = document.getElementById('homework-form');
    const homeworkContainer = document.getElementById('homework-container');
    const submitButton = document.getElementById('submit-button');
    const cancelButton = document.getElementById('cancel-button');

    loadHomework();

    homeworkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const homeworkId = document.getElementById('homework-id').value;
        const subject = document.getElementById('subject').value.trim();
        const description = document.getElementById('description').value.trim();
        const dueDate = document.getElementById('due-date').value;

        if (homeworkId) {
            updateHomework(homeworkId, subject, description, dueDate);
        } else {
            addHomework(subject, description, dueDate);
        }

        homeworkForm.reset();
        document.getElementById('homework-id').value = '';
        submitButton.textContent = 'Ödev Ekle';
        cancelButton.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        homeworkForm.reset();
        document.getElementById('homework-id').value = '';
        submitButton.textContent = 'Ödev Ekle';
        cancelButton.style.display = 'none';
    });

    function addHomework(subject, description, dueDate) {
        const homeworkList = getHomeworkList();
        const newHomework = {
            id: Date.now(),
            subject,
            description,
            dueDate
        };
        homeworkList.push(newHomework);
        saveHomeworkList(homeworkList);
        renderHomework(newHomework);
    }

    function updateHomework(id, subject, description, dueDate) {
        let homeworkList = getHomeworkList();
        homeworkList = homeworkList.map(hw => {
            if (hw.id === parseInt(id)) {
                return { id: hw.id, subject, description, dueDate };
            }
            return hw;
        });
        saveHomeworkList(homeworkList);
        loadHomework();
    }

    function deleteHomework(id) {
        let homeworkList = getHomeworkList();
        homeworkList = homeworkList.filter(hw => hw.id !== id);
        saveHomeworkList(homeworkList);
        loadHomework();
    }

    function getHomeworkList() {
        const homework = localStorage.getItem('homeworkList');
        return homework ? JSON.parse(homework) : [];
    }

    function saveHomeworkList(list) {
        localStorage.setItem('homeworkList', JSON.stringify(list));
    }

    function loadHomework() {
        homeworkContainer.innerHTML = '';
        const homeworkList = getHomeworkList();
        homeworkList.forEach(hw => renderHomework(hw));
    }

    function renderHomework(hw) {
        const homeworkItem = document.createElement('div');
        homeworkItem.classList.add('homework-item');

        const homeworkTitle = document.createElement('h3');
        homeworkTitle.textContent = hw.subject;

        const homeworkDescription = document.createElement('p');
        homeworkDescription.textContent = hw.description;

        const homeworkDueDate = document.createElement('p');
        homeworkDueDate.classList.add('due-date');
        homeworkDueDate.textContent = `Son Teslim Tarihi: ${formatDate(hw.dueDate)}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Düzenle';
        editButton.addEventListener('click', () => editHomework(hw.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Sil';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            if (confirm('Bu ödevi silmek istediğinize emin misiniz?')) {
                deleteHomework(hw.id);
            }
        });

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        homeworkItem.appendChild(homeworkTitle);
        homeworkItem.appendChild(homeworkDescription);
        homeworkItem.appendChild(homeworkDueDate);
        homeworkItem.appendChild(actionsDiv);

        homeworkContainer.appendChild(homeworkItem);
    }

    function editHomework(id) {
        const homeworkList = getHomeworkList();
        const hw = homeworkList.find(hw => hw.id === id);
        if (hw) {
            document.getElementById('homework-id').value = hw.id;
            document.getElementById('subject').value = hw.subject;
            document.getElementById('description').value = hw.description;
            document.getElementById('due-date').value = hw.dueDate;
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
