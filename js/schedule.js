document.addEventListener('DOMContentLoaded', () => {
    const scheduleForm = document.getElementById('schedule-form');
    const scheduleContainer = document.getElementById('schedule-container');
    const submitButton = document.getElementById('submit-button');
    const cancelButton = document.getElementById('cancel-button');

    loadSchedule();

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const scheduleId = document.getElementById('schedule-id').value;
        const day = document.getElementById('day').value;
        const subject = document.getElementById('subject').value.trim();
        const time = document.getElementById('time').value;

        if (scheduleId) {
            updateSchedule(scheduleId, day, subject, time);
        } else {
            addSchedule(day, subject, time);
        }

        scheduleForm.reset();
        document.getElementById('schedule-id').value = '';
        submitButton.textContent = 'Ders Ekle';
        cancelButton.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        scheduleForm.reset();
        document.getElementById('schedule-id').value = '';
        submitButton.textContent = 'Ders Ekle';
        cancelButton.style.display = 'none';
    });

    function addSchedule(day, subject, time) {
        const scheduleList = getScheduleList();
        const newSchedule = {
            id: Date.now(),
            day,
            subject,
            time
        };
        scheduleList.push(newSchedule);
        saveScheduleList(scheduleList);
        renderSchedule(newSchedule);
    }

    function updateSchedule(id, day, subject, time) {
        let scheduleList = getScheduleList();
        scheduleList = scheduleList.map(sc => {
            if (sc.id === parseInt(id)) {
                return { id: sc.id, day, subject, time };
            }
            return sc;
        });
        saveScheduleList(scheduleList);
        loadSchedule();
    }

    function deleteSchedule(id) {
        let scheduleList = getScheduleList();
        scheduleList = scheduleList.filter(sc => sc.id !== id);
        saveScheduleList(scheduleList);
        loadSchedule();
    }

    function getScheduleList() {
        const schedule = localStorage.getItem('scheduleList');
        return schedule ? JSON.parse(schedule) : [];
    }

    function saveScheduleList(list) {
        localStorage.setItem('scheduleList', JSON.stringify(list));
    }

    function loadSchedule() {
        scheduleContainer.innerHTML = '';
        const scheduleList = getScheduleList();
        scheduleList.forEach(sc => renderSchedule(sc));
    }

    function renderSchedule(sc) {
        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');

        const scheduleTitle = document.createElement('h3');
        scheduleTitle.textContent = sc.subject;

        const scheduleDay = document.createElement('p');
        scheduleDay.textContent = `Gün: ${sc.day}`;

        const scheduleTime = document.createElement('p');
        scheduleTime.textContent = `Saat: ${formatTime(sc.time)}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Düzenle';
        editButton.addEventListener('click', () => editSchedule(sc.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Sil';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            if (confirm('Bu dersi silmek istediğinize emin misiniz?')) {
                deleteSchedule(sc.id);
            }
        });

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        scheduleItem.appendChild(scheduleTitle);
        scheduleItem.appendChild(scheduleDay);
        scheduleItem.appendChild(scheduleTime);
        scheduleItem.appendChild(actionsDiv);

        scheduleContainer.appendChild(scheduleItem);
    }

    function editSchedule(id) {
        const scheduleList = getScheduleList();
        const sc = scheduleList.find(sc => sc.id === id);
        if (sc) {
            document.getElementById('schedule-id').value = sc.id;
            document.getElementById('day').value = sc.day;
            document.getElementById('subject').value = sc.subject;
            document.getElementById('time').value = sc.time;
            submitButton.textContent = 'Güncelle';
            cancelButton.style.display = 'inline-block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function formatTime(timeString) {
        const [hour, minute] = timeString.split(':');
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minute} ${period}`;
    }
});
