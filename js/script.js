
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('notes-container')) {
        loadNotes();
    }
});

const notesData = [
    {
        subject: "Matematik",
        note: "Denklem çözme teknikleri üzerinde çalışıldı."
    },
    {
        subject: "İngilizce",
        note: "Yeni kelime listesi verildi."
    },
    {
        subject: "Fizik",
        note: "Elektrik ve manyetizma konuları işlendi."
    },
    {
        subject: "Türkçe",
        note: "Yeni edebiyat metinleri okunacak."
    }
];

function loadNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    notesData.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');

        const noteSubject = document.createElement('h3');
        noteSubject.textContent = note.subject;

        const noteContent = document.createElement('p');
        noteContent.textContent = note.note;

        noteItem.appendChild(noteSubject);
        noteItem.appendChild(noteContent);

        notesContainer.appendChild(noteItem);
    });
}
