document.addEventListener('DOMContentLoaded', () => {
    // --- SCRIPT FOR INTERACTIVE GUIDE ---
    const principlesData = [
        { icon: '🌐', title: 'Decentralization', text: "Utilizes a distributed network, making it resilient to censorship and single points of failure." },
        { icon: '🛡️', title: 'Immutability', text: "Creates a permanent, tamper-proof log of all document-related activities." },
        { icon: '🔒', title: 'Security', text: 'Cryptography ensures documents are encrypted and only accessible by authorized individuals.' },
        { icon: '👁️', title: 'Transparency (with Privacy)', text: 'The ledger of transactions is transparent, but the document content remains private and encrypted.' },
    ];
    const principlesGrid = document.getElementById('principles-grid');
    principlesData.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-shadow';
        card.innerHTML = `<div class="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-3xl mx-auto mb-4">${p.icon}</div><h4 class="text-xl font-bold text-center">${p.title}</h4><p class="mt-2 text-gray-600 text-center hidden">${p.text}</p>`;
        card.addEventListener('click', () => card.querySelector('p').classList.toggle('hidden'));
        principlesGrid.appendChild(card);
    });

    const architectureData = {
        nodes: [
            { id: 'frontend', label: 'Frontend (UI)', top: '5%', left: '50%', transform: '-translate-x-1/2' },
            { id: 'smart-contracts', label: 'Smart Contracts (Logic)', top: '45%', left: '50%', transform: '-translate-x-1/2' },
            { id: 'storage', label: 'Decentralized Storage (Data)', top: '85%', left: '50%', transform: '-translate-x-1/2' },
        ],
        info: {
            frontend: { title: "Frontend (UI)", text: "The user's entry point to the system, allowing interaction like uploading and viewing documents." },
            'smart-contracts': { title: "Smart Contracts (Business Logic)", text: "Self-executing contracts on the blockchain that enforce rules for access control, versioning, and auditing." },
            storage: { title: "Decentralized Storage (Data Layer)", text: "Where encrypted documents are stored, typically using a system like IPFS to maintain decentralization." }
        }
    };
    const archDiagram = document.getElementById('architecture-diagram');
    architectureData.nodes.forEach(node => {
        const el = document.createElement('div');
        el.id = `node-${node.id}`;
        el.className = 'architecture-node absolute bg-white border-2 border-gray-300 rounded-lg px-6 py-4 shadow-sm cursor-pointer';
        el.style.cssText = `top: ${node.top}; left: ${node.left}; transform: ${node.transform};`;
        el.innerHTML = node.label;
        el.addEventListener('click', () => {
            document.querySelectorAll('.architecture-node').forEach(n => n.classList.remove('highlight-node'));
            el.classList.add('highlight-node');
            const info = architectureData.info[node.id];
            document.getElementById('info-title').textContent = info.title;
            document.getElementById('info-text').textContent = info.text;
        });
        archDiagram.appendChild(el);
    });

    const workflowBtn = document.getElementById('workflow-btn');
    const workflowExplanation = document.getElementById('workflow-explanation');
    const workflowDoc = document.getElementById('workflow-doc');
    const workflowLoader = document.getElementById('workflow-loader');
    const aliceEl = document.getElementById('alice');
    const bobEl = document.getElementById('bob');
    const ipfsEl = document.getElementById('ipfs');
    const blockchainEl = document.getElementById('blockchain');
    let guideWorkflowStep = 0;
    const guideWorkflowSteps = [
        { explanation: "Alice prepares to upload her document.", action: () => { workflowDoc.style.top = `${aliceEl.offsetTop}px`; workflowDoc.style.left = `${aliceEl.offsetLeft + aliceEl.offsetWidth/2 - workflowDoc.offsetWidth/2}px`; workflowDoc.innerHTML = `<span class="text-2xl">📄</span><span>Doc</span>`; }, buttonText: "1. Encrypt & Upload" },
        { explanation: "Alice's document is encrypted and uploaded to IPFS.", action: () => { workflowDoc.style.top = `${ipfsEl.offsetTop + ipfsEl.offsetHeight/2 - workflowDoc.offsetHeight/2}px`; workflowDoc.style.left = `${ipfsEl.offsetLeft + ipfsEl.offsetWidth/2 - workflowDoc.offsetWidth/2}px`; workflowDoc.innerHTML = `<span class="text-2xl">🔒</span><span>Encrypted</span>`; }, buttonText: "2. Record on Blockchain" },
        { explanation: "A transaction records the document's hash and ownership on the blockchain.", action: () => { workflowDoc.style.opacity = '0'; }, buttonText: "3. Grant Access to Bob" },
        { explanation: "Alice grants Bob access via another transaction.", action: () => { bobEl.classList.add('ring-4', 'ring-green-400', 'rounded-full'); }, buttonText: "4. Bob Accesses Document" },
        { explanation: "Bob accesses the file, which is fetched from IPFS and decrypted.", action: () => { workflowDoc.style.opacity = '1'; workflowDoc.style.top = `${bobEl.offsetTop}px`; workflowDoc.style.left = `${bobEl.offsetLeft + bobEl.offsetWidth/2 - workflowDoc.offsetWidth/2}px`; workflowDoc.innerHTML = `<span class="text-2xl">📄</span><span>Decrypted</span>`; }, buttonText: "Process Complete! Reset" },
        { explanation: "Welcome! Let's start the secure document sharing process.", action: () => { bobEl.classList.remove('ring-4', 'ring-green-400', 'rounded-full'); workflowDoc.style.opacity = '1'; workflowDoc.style.top = `${aliceEl.offsetTop}px`; workflowDoc.style.left = `${aliceEl.offsetLeft + aliceEl.offsetWidth/2 - workflowDoc.offsetWidth/2}px`; workflowDoc.innerHTML = `<span class="text-2xl">📄</span><span>Doc</span>`; }, buttonText: "Start" }
    ];
    workflowBtn.addEventListener('click', () => {
        workflowBtn.disabled = true;
        workflowLoader.classList.remove('hidden');
        const currentStep = guideWorkflowSteps[guideWorkflowStep];
        workflowExplanation.textContent = currentStep.explanation;
        setTimeout(() => {
            currentStep.action();
            guideWorkflowStep = (guideWorkflowStep + 1) % guideWorkflowSteps.length;
            workflowBtn.textContent = guideWorkflowSteps[guideWorkflowStep].buttonText;
            workflowBtn.disabled = false;
            workflowLoader.classList.add('hidden');
        }, 1200);
    });
    guideWorkflowSteps[guideWorkflowStep].action();
    workflowBtn.textContent = guideWorkflowSteps[guideWorkflowStep + 1].buttonText;
    guideWorkflowStep++;

    // --- SCRIPT FOR DAPP SIMULATION ---
    const dAppState = {
        aliceWalletConnected: false, bobWalletConnected: false, selectedFile: null, uploadedDocument: null, accessGranted: false,
        aliceAddress: '0x1234567890abcdef1234567890abcdef12345678', bobAddress: '0x567890abcdef1234567890abcdef1234567890ab'
    };
    const tabAlice = document.getElementById('tab-alice');
    const tabBob = document.getElementById('tab-bob');
    const viewAlice = document.getElementById('view-alice');
    const viewBob = document.getElementById('view-bob');
    const aliceConnectBtn = document.getElementById('alice-connect-btn');
    const aliceWalletDisconnected = document.getElementById('alice-wallet-disconnected');
    const aliceWalletConnected = document.getElementById('alice-wallet-connected');
    const aliceAddressEl = document.getElementById('alice-address');
    const bobConnectBtn = document.getElementById('bob-connect-btn');
    const bobWalletDisconnected = document.getElementById('bob-wallet-disconnected');
    const bobWalletConnected = document.getElementById('bob-wallet-connected');
    const bobAddressEl = document.getElementById('bob-address');
    const selectFileBtn = document.getElementById('select-file-btn');
    const fileInput = document.getElementById('file-input');
    const fileNameEl = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn');
    const grantAccessSection = document.getElementById('grant-access-section');
    const grantBtn = document.getElementById('grant-btn');
    const recipientAddressInput = document.getElementById('recipient-address');
    const aliceStatusLog = document.getElementById('alice-status-log');
    const aliceDocsList = document.getElementById('alice-docs-list');
    const bobDocsList = document.getElementById('bob-docs-list');

    function switchDappView(view) {
        if (view === 'alice') {
            tabAlice.classList.add('active'); tabBob.classList.remove('active'); viewAlice.classList.add('active'); viewBob.classList.remove('active');
        } else {
            tabBob.classList.add('active'); tabAlice.classList.remove('active'); viewBob.classList.add('active'); viewAlice.classList.remove('active');
        }
    }
    function addLog(logEl, text, type = 'info') {
        if (logEl.querySelector('p.text-gray-400')) logEl.innerHTML = '';
        const item = document.createElement('div');
        let icon = type === 'process' ? '<div class="spinner mr-2"></div>' : type === 'success' ? '<span class="mr-2">✅</span>' : type === 'error' ? '<span class="mr-2">❌</span>' : '<span class="mr-2">ℹ️</span>';
        let colorClass = type === 'process' ? 'bg-gray-700 text-gray-300' : type === 'success' ? 'bg-green-800 text-green-200' : type === 'error' ? 'bg-red-800 text-red-200' : 'bg-blue-800 text-blue-200';
        item.className = 'status-log-item ' + colorClass;
        item.innerHTML = `${icon}<span>${text}</span>`;
        logEl.appendChild(item);
        setTimeout(() => item.classList.add('visible'), 50);
        logEl.scrollTop = logEl.scrollHeight;
        return item;
    }
    function updateAliceDocs() {
        if (!dAppState.uploadedDocument) { aliceDocsList.innerHTML = '<p class="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">No documents uploaded yet.</p>'; return; }
        const doc = dAppState.uploadedDocument;
        const accessStatus = dAppState.accessGranted ? `<span class="text-xs font-medium bg-green-100 text-green-800 py-0.5 px-2 rounded-full">Shared</span>` : `<span class="text-xs font-medium bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full">Private</span>`;
        aliceDocsList.innerHTML = `<div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center"><div><p class="font-semibold text-gray-800">${doc.name}</p><p class="text-xs text-gray-500">Hash: ${doc.hash.substring(0, 16)}...</p></div>${accessStatus}</div>`;
    }
    function updateBobDocs() {
        if (dAppState.accessGranted) {
            const doc = dAppState.uploadedDocument;
            bobDocsList.innerHTML = `<div class="bg-blue-50 p-4 rounded-lg border border-blue-200"><div class="flex justify-between items-center"><div><p class="font-semibold text-blue-800">${doc.name}</p><p class="text-xs text-blue-600">From: ${dAppState.aliceAddress.substring(0, 10)}...</p></div><button class="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600">Download</button></div></div>`;
        } else {
            bobDocsList.innerHTML = '<p class="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">No documents have been shared with you yet.</p>';
        }
    }
    tabAlice.addEventListener('click', () => switchDappView('alice'));
    tabBob.addEventListener('click', () => switchDappView('bob'));
    aliceConnectBtn.addEventListener('click', () => {
        dAppState.aliceWalletConnected = true; aliceWalletDisconnected.classList.add('hidden'); aliceWalletConnected.classList.remove('hidden'); aliceAddressEl.textContent = dAppState.aliceAddress; addLog(aliceStatusLog, 'Wallet connected successfully.', 'success');
    });
    bobConnectBtn.addEventListener('click', () => {
        dAppState.bobWalletConnected = true; bobWalletDisconnected.classList.add('hidden'); bobWalletConnected.classList.remove('hidden'); bobAddressEl.textContent = dAppState.bobAddress;
    });
    selectFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) { dAppState.selectedFile = e.target.files[0]; fileNameEl.textContent = dAppState.selectedFile.name; uploadBtn.disabled = false; }
    });
    uploadBtn.addEventListener('click', async () => {
        uploadBtn.disabled = true; addLog(aliceStatusLog, 'Encrypting file locally...', 'process'); await new Promise(res => setTimeout(res, 1500));
        addLog(aliceStatusLog, 'Uploading to IPFS...', 'process'); await new Promise(res => setTimeout(res, 2000));
        dAppState.uploadedDocument = { name: dAppState.selectedFile.name, hash: 'Qm' + Array(44).fill(0).map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('') };
        addLog(aliceStatusLog, 'Sending transaction to smart contract...', 'process'); await new Promise(res => setTimeout(res, 2500));
        addLog(aliceStatusLog, `Document registered on blockchain.`, 'success'); grantAccessSection.classList.remove('hidden'); updateAliceDocs();
    });
    recipientAddressInput.addEventListener('keyup', () => { grantBtn.disabled = recipientAddressInput.value.trim() === ''; });
    grantBtn.addEventListener('click', async () => {
        grantBtn.disabled = true; const recipient = recipientAddressInput.value.trim();
        if (recipient.toLowerCase() !== dAppState.bobAddress.toLowerCase() && recipient !== "0x5678...efgh") { addLog(aliceStatusLog, 'Error: Recipient address does not match Bob\'s.', 'error'); grantBtn.disabled = false; return; }
        addLog(aliceStatusLog, 'Preparing access grant transaction...', 'process'); await new Promise(res => setTimeout(res, 1500));
        addLog(aliceStatusLog, 'Updating smart contract permissions...', 'process'); await new Promise(res => setTimeout(res, 2000));
        dAppState.accessGranted = true; addLog(aliceStatusLog, `Access granted to ${dAppState.bobAddress.substring(0,10)}...`, 'success');
        updateAliceDocs(); updateBobDocs();
    });

    // --- SCRIPT FOR PAGE-WIDE FUNCTIONALITY ---
    const sections = document.querySelectorAll('.section-fade-in');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
});
