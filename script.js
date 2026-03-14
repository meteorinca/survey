const fileInput = document.getElementById('fileInput');
const form = document.getElementById('survey-form');
const header = document.getElementById('survey-header');
const resultContainer = document.getElementById('result-container');
const outputCode = document.getElementById('output-code');

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        parseAndBuild(event.target.result);
    };
    reader.readAsText(file);
});

function parseAndBuild(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // Parse Metadata
    const title = lines[0].replace('Survey Title:', '').trim();
    const options = lines[1].replace('Survey Questions:', '').trim().split(' ');
    const questions = lines.slice(3); // Skip Title, Questions, and Format lines

    header.innerHTML = `<h1>${title}</h1>`;
    form.classList.remove('hidden');

    questions.forEach((q, qIdx) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question-block';
        
        let html = `<span class="question-text">${q}</span><div class="options-group">`;
        options.forEach(opt => {
            html += `
                <label>
                    <input type="radio" name="q${qIdx}" value="${opt}" required>
                    ${opt}
                </label>`;
        });
        html += `</div>`;
        qDiv.innerHTML = html;
        form.appendChild(qDiv);
    });

    const btn = document.createElement('button');
    btn.textContent = "Submit Results";
    form.appendChild(btn);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const results = {};
    
    for (let [key, value] of formData.entries()) {
        results[key] = value;
    }

    // Convert object to string, then Base64 encode it
    const jsonStr = JSON.stringify(results);
    const encoded = btoa(jsonStr);

    form.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    outputCode.value = encoded;
});