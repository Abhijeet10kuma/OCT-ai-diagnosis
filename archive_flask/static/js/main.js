document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. GLOBAL UI & SCROLL ANIMATIONS
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger stats counter if it's the stats bar
                if (entry.target.classList.contains('stats-bar')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .glass-card, .condition-card, .stat-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    function animateCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const updateCount = () => {
                const inc = target / 50;
                if (count < target) {
                    count += inc;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // ==========================================
    // 2. HERO PARTICLES
    // ==========================================
    const pContainer = document.getElementById('particles-js');
    if (pContainer) {
        for(let i=0; i<50; i++) {
            let p = document.createElement('div');
            p.style.position = 'absolute';
            p.style.width = Math.random() * 4 + 'px';
            p.style.height = p.style.width;
            p.style.background = 'rgba(55, 138, 221, 0.5)';
            p.style.borderRadius = '50%';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = Math.random() * 100 + 'vh';
            p.style.animation = `float ${Math.random()*10 + 5}s linear infinite alternate`;
            pContainer.appendChild(p);
        }
    }

    // ==========================================
    // 4. OCT SCAN UPLOAD & AI INFERENCE
    // ==========================================
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadPanel = document.getElementById('uploadPanel');
    const analysisPanel = document.getElementById('analysisPanel');
    const resultPanel = document.getElementById('resultPanel');
    const imagePreview = document.getElementById('imagePreview');
    const scanLine = document.getElementById('scanLine');
    const analysisText = document.getElementById('analysisText');
    const sampleBtn = document.getElementById('sampleBtn');
    
    // Result elements
    const rBadge = document.getElementById('resultBadge');
    const rTitle = document.getElementById('resultTitle');
    const cFill = document.getElementById('confidenceFill');
    const cText = document.getElementById('confidenceText');
    const rDesc = document.getElementById('resultDesc');
    const rAction = document.getElementById('resultAction');

    const conditionData = {
        CNV: { badge: 'HIGH RISK', badgeClass: 'badge-red', color: '#E24B4A', title: 'Choroidal Neovascularization (CNV)', desc: 'Abnormal blood vessels detected beneath the retinal layer.', action: 'See an ophthalmologist immediately.' },
        DME: { badge: 'URGENT', badgeClass: 'badge-red', color: '#EF9F27', title: 'Diabetic Macular Edema (DME)', desc: 'Fluid accumulation in the macular region detected.', action: 'Consult your doctor as soon as possible.' },
        DRUSEN: { badge: 'MONITOR', badgeClass: 'badge-amber', color: '#FAC775', title: 'Drusen Deposits', desc: 'Yellow deposits under the retina — early AMD indicator.', action: 'Schedule a routine ophthalmology appointment.' },
        NORMAL: { badge: 'ALL CLEAR', badgeClass: 'badge-green', color: '#639922', title: 'No Abnormality Detected', desc: 'Retinal scan appears healthy with no detected pathology.', action: 'Continue annual eye exams.' }
    };

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', e => e.preventDefault());
    uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', e => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    sampleBtn.addEventListener('click', () => {
        // Fetch a dummy image or prompt user for actual file
        fileInput.click();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        resultPanel.style.display = 'none';
        uploadPanel.style.display = 'block';
        cFill.style.width = '0%';
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) { alert('Please upload an image.'); return; }
        
        const reader = new FileReader();
        reader.onload = e => {
            imagePreview.src = e.target.result;
            // Save image locally for the new tab
            localStorage.setItem('eyeai_image', e.target.result);
            startAnalysisFlow(file);
        };
        reader.readAsDataURL(file);
    }

    async function startAnalysisFlow(file) {
        uploadPanel.style.display = 'none';
        analysisPanel.style.display = 'block';
        scanLine.style.display = 'block';
        
        const textPhases = ["Loading scan...", "Preprocessing image...", "Running AI model...", "Analyzing retinal layers...", "Generating report..."];
        let phase = 0;
        const textInterval = setInterval(() => {
            phase++;
            if(phase < textPhases.length) analysisText.innerText = textPhases[phase];
        }, 600);

        // Fetch real prediction
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/predict', { method: 'POST', body: formData });
            const data = await response.json();
            
            setTimeout(() => {
                clearInterval(textInterval);
                showResult(data.prediction, data.confidence);
            }, 3000); // Enforce 3s minimum animation

        } catch(err) {
            clearInterval(textInterval);
            alert("Error running inference. Ensure backend is running.");
            document.getElementById('resetBtn').click();
        }
    }

    function showResult(prediction, confidence) {
        // Save the AI result to localStorage
        localStorage.setItem('eyeai_prediction', prediction);
        localStorage.setItem('eyeai_confidence', confidence.toFixed(1));

        // Switch UI to an action panel
        analysisPanel.style.display = 'none';
        scanLine.style.display = 'none';
        resultPanel.style.display = 'block';
        
        // Hide inline results, prompt user to open new tab
        rBadge.style.display = 'none';
        rTitle.innerText = "Analysis Complete";
        rTitle.style.color = "#378ADD";
        
        document.querySelector('.confidence-container').style.display = 'none';
        rDesc.innerText = "Your AI diagnostic report is ready. Click the button below to view your results in a new tab.";
        rDesc.style.textAlign = "center";
        rDesc.style.margin = "2rem 0";
        rDesc.style.fontSize = "1.1rem";
        
        document.getElementById('resultActionBox').style.display = 'none';
        
        // Try to automatically open it. If popup blocker prevents it, the user can click the button.
        window.open('/report', '_blank');
    }

    // ==========================================
    // 5. MODAL LOGIC
    // ==========================================
    window.openModal = function(condition) {
        const info = conditionData[condition];
        document.getElementById('modalBody').innerHTML = `
            <h2 style="color: ${info.color}">${info.title}</h2>
            <br>
            <p><strong>Description:</strong> ${info.desc}</p>
            <p class="mt-1"><strong>Action Required:</strong> ${info.action}</p>
            <p class="mt-1"><em>Model inference classes are restricted to CNV, DME, DRUSEN, and NORMAL.</em></p>
        `;
        document.getElementById('conditionModal').style.display = 'flex';
    };

    window.closeModal = function() {
        document.getElementById('conditionModal').style.display = 'none';
    };

    // ==========================================
    // 6. SYMPTOM CHECKER
    // ==========================================
    document.getElementById('checkSymptomsBtn').addEventListener('click', () => {
        let cnvScore = 0, dmeScore = 0, drusenScore = 0, normalScore = 0;
        
        const checks = Array.from(document.querySelectorAll('#symptomGrid input:checked')).map(el => el.value);
        if(checks.length === 0) return alert("Select at least one symptom");

        if(checks.includes('sudden_vision_loss')) cnvScore += 5;
        if(checks.includes('distorted_vision')) { cnvScore += 3; dmeScore += 2; }
        if(checks.includes('blurry_vision')) { dmeScore += 3; drusenScore += 2; }
        if(checks.includes('colors_faded')) dmeScore += 4;
        if(checks.includes('blind_spot')) { cnvScore += 3; drusenScore += 2; }
        if(checks.includes('mild_blurring')) drusenScore += 3;
        if(checks.includes('none')) normalScore += 10;
        
        if(document.getElementById('sympDiabetic').checked) dmeScore += 5;
        if(document.getElementById('sympAge').checked) { drusenScore += 3; cnvScore += 2; }

        let maxScore = Math.max(cnvScore, dmeScore, drusenScore, normalScore);
        let resultCond = 'NORMAL';
        if(maxScore === cnvScore) resultCond = 'CNV';
        else if(maxScore === dmeScore) resultCond = 'DME';
        else if(maxScore === drusenScore) resultCond = 'DRUSEN';

        const resEl = document.getElementById('symptomResult');
        resEl.style.display = 'block';
        resEl.innerHTML = `<h3 style="color:${conditionData[resultCond].color}">Possible Match: ${conditionData[resultCond].title}</h3><p>${conditionData[resultCond].action}</p>`;
    });

    // ==========================================
    // 7. RISK QUIZ
    // ==========================================
    document.getElementById('calculateRiskBtn').addEventListener('click', () => {
        const age = +document.getElementById('qAge').value;
        const dia = +document.getElementById('qDiabetic').value;
        const fam = +document.getElementById('qFamily').value;
        const smo = +document.getElementById('qSmoke').value;

        let score = (age * 10) + (dia * 30) + (fam * 20) + (smo * 15);
        if(score > 90) score = 90; // cap
        if(dia === 1 && age === 2) score += 5;

        document.getElementById('riskResult').style.display = 'block';
        
        // Animate ring
        const circle = document.getElementById('riskCircle');
        setTimeout(() => {
            circle.style.strokeDasharray = `${score}, 100`;
            let c = 0;
            let iv = setInterval(() => {
                c++;
                if(c >= score) { document.getElementById('riskScoreVal').innerText = score + '%'; clearInterval(iv); }
                else document.getElementById('riskScoreVal').innerText = c + '%';
            }, 20);
        }, 100);

        let rec = "Low Risk. Maintain healthy habits.";
        if(score > 60 && dia) rec = "High Risk for DME. Consult an eye doctor.";
        else if(score > 60) rec = "High Risk for CNV/DRUSEN. Schedule an exam.";
        
        document.getElementById('riskRecommendation').innerText = rec;
    });
});
