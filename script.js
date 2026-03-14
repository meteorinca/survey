async function loadSurvey() {
    try {
        const response = await fetch('survey1.md');
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        const container = document.getElementById('survey-content');
        let html = '';

        lines.forEach((line, index) => {
            if (line.startsWith('# ')) {
                html += `<h1>${line.replace('# ', '')}</h1>`;
            } else if (line.startsWith('### ')) {
                html += `<h3>${line.replace('### ', '')}</h3>`;
            } else {
                html += `
                <div class="question" data-q="${line.trim()}">
                    <p>${line.trim()}</p>
                    <div class="options">
                        <label><input type="radio" name="q${index}" value="H"> <span>High</span></label>
                        <label><input type="radio" name="q${index}" value="M"> <span>Med</span></label>
                        <label><input type="radio" name="q${index}" value="L"> <span>Low</span></label>
                    </div>
                </div>`;
            }
        });

        container.innerHTML = html;
        document.getElementById('submit-btn').style.display = 'block';
    } catch (e) {
        console.error("Error loading survey1.md", e);
    }
}

document.getElementById('submit-btn').onclick = () => {
    const results = {};
    document.querySelectorAll('.question').forEach(q => {
        const label = q.getAttribute('data-q');
        const selected = q.querySelector('input:checked');
        results[label] = selected ? selected.value : null;
    });

    // Compression: Convert JSON to Base64
    const jsonString = JSON.stringify(results);
    const compressed = btoa(jsonString); 

    document.getElementById('survey-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');
    document.getElementById('output-code').value = compressed;
};

function copyToClipboard() {
    const copyText = document.getElementById("output-code");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    alert("Code copied! Text this to me.");
}

loadSurvey();