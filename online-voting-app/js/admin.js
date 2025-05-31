class AdminPage {
    constructor() {
        this.loginSection = document.getElementById('loginSection');
        this.dashboardSection = document.getElementById('dashboardSection');
        this.loginForm = document.getElementById('loginForm');
        this.addCandidateForm = document.getElementById('addCandidateForm');
        this.addVoterForm = document.getElementById('addVoterForm');
        this.importCsvForm = document.getElementById('importCsvForm');
        this.scheduleForm = document.getElementById('scheduleForm');
        this.updateCredentialsForm = document.getElementById('updateCredentialsForm');
        
        this.initialize();
    }

    initialize() {
        // Form handlers
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.addCandidateForm?.addEventListener('submit', (e) => this.handleAddCandidate(e));
        this.addVoterForm?.addEventListener('submit', (e) => this.handleAddVoter(e));
        this.importCsvForm?.addEventListener('submit', (e) => this.handleImportCsv(e));
        this.scheduleForm?.addEventListener('submit', (e) => this.handleScheduleUpdate(e));
        this.updateCredentialsForm?.addEventListener('submit', (e) => this.handleCredentialsUpdate(e));
        
        // Tab handlers
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
        
        // Other button handlers
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
        document.getElementById('toggleResultsBtn')?.addEventListener('click', () => this.toggleResults());
        document.getElementById('exportResultsBtn')?.addEventListener('click', () => this.exportResults());

        // New settings form handler
        document.getElementById('updateSettingsForm')?.addEventListener('submit', (e) => this.handleSettingsUpdate(e));
    }

    async handleSettingsUpdate(e) {
        e.preventDefault();

        const electionName = document.getElementById('electionName').value;
        const institutionName = document.getElementById('institutionName').value;
        const footerText = document.getElementById('footerText').value;
        const schoolLogoFile = document.getElementById('schoolLogo').files[0];
        const agencyLogoFile = document.getElementById('agencyLogo').files[0];

        try {
            const settingsRef = window.db.collection('settings').doc('general');
            const updates = {
                electionName,
                institutionName,
                footerText: footerText || `© ${new Date().getFullYear()} ${institutionName || 'Sistem Pemilihan Online'}. All rights reserved.`
            };

            // Upload logos if provided
            if (schoolLogoFile) {
                const schoolLogoRef = window.firebase.storage().ref().child(`logos/schoolLogo_${Date.now()}`);
                await schoolLogoRef.put(schoolLogoFile);
                updates.schoolLogoUrl = await schoolLogoRef.getDownloadURL();
            }
            if (agencyLogoFile) {
                const agencyLogoRef = window.firebase.storage().ref().child(`logos/agencyLogo_${Date.now()}`);
                await agencyLogoRef.put(agencyLogoFile);
                updates.agencyLogoUrl = await agencyLogoRef.getDownloadURL();
            }

            await settingsRef.set(updates, { merge: true });

            alert('Pengaturan berhasil diperbarui');
            this.loadDashboard();
            e.target.reset();
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Gagal memperbarui pengaturan: ' + error.message);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
            if (userCredential.user) {
                this.loginSection.classList.add('hidden');
                this.dashboardSection.classList.remove('hidden');
                this.loadDashboard();
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Email atau password tidak valid.');
        }
    }

    async loadDashboard() {
        try {
            const settingsDoc = await window.db.collection('settings').doc('general').get();
            const settings = settingsDoc.exists ? settingsDoc.data() : {};
            const candidates = await window.db.collection('candidates').get().then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            // Update quick stats
            document.getElementById('totalVoters').textContent = settings.totalVoters || 0;
            document.getElementById('participationRate').textContent = 
                settings.totalVoters ? `${Math.round((settings.votesSubmitted / settings.totalVoters) * 100)}%` : '0%';
            
            const now = new Date();
            const startTime = settings.startTime ? new Date(settings.startTime) : null;
            const endTime = settings.endTime ? new Date(settings.endTime) : null;
            
            let status = '';
            if (!startTime || now < startTime) {
                status = 'Belum Dimulai';
            } else if (endTime && now > endTime) {
                status = 'Selesai';
            } else {
                status = 'Sedang Berlangsung';
            }
            document.getElementById('electionStatus').textContent = status;
            
            // Load candidates
            this.loadCandidateList(candidates);
            
            // Load schedule
            if (settings.startTime) document.getElementById('startTime').value = settings.startTime.slice(0, 16);
            if (settings.endTime) document.getElementById('endTime').value = settings.endTime.slice(0, 16);
            
            // Update results tab
            this.updateResultsTab(candidates, settings);
            
            // Load settings into form
            document.getElementById('electionName').value = settings.electionName || '';
            document.getElementById('institutionName').value = settings.institutionName || '';
            document.getElementById('footerText').value = settings.footerText || '';
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            alert('Terjadi kesalahan saat memuat dashboard.');
        }
    }

    loadCandidateList(candidates) {
        const candidateList = document.getElementById('candidateList');
        if (!candidateList) return;
        
        candidateList.innerHTML = candidates.map(candidate => `
            <div class="candidate-card bg-white rounded-xl shadow-md overflow-hidden">
                <img src="${candidate.photo}" alt="Foto ${candidate.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold mb-2">${candidate.name}</h3>
                    <button onclick="handleDeleteCandidate('${candidate.id}')" 
                        class="text-red-600 hover:text-red-800 text-sm font-medium">
                        Hapus Kandidat
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateResultsTab(candidates, settings) {
        const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
        
        // Update statistics
        document.getElementById('totalVotesCast').textContent = `${totalVotes}/${settings.totalVoters}`;
        document.getElementById('participationPercent').textContent = 
            `${Math.round((totalVotes / settings.totalVoters) * 100)}%`;
        document.getElementById('votesProgress').style.width = 
            `${(totalVotes / settings.totalVoters) * 100}%`;
        document.getElementById('participationProgress').style.width = 
            `${(totalVotes / settings.totalVoters) * 100}%`;
        
        // Update publication status
        document.getElementById('publicationStatus').innerHTML = `
            <p class="text-lg font-medium mb-2">Status Publikasi:</p>
            <p class="text-gray-600">
                ${settings.resultsPublished ? 
                    'Hasil pemilihan sudah dipublikasikan' : 
                    'Hasil pemilihan belum dipublikasikan'}
            </p>
        `;
        
        // Update results display
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = candidates.map(candidate => `
            <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div class="flex items-center space-x-4 mb-4">
                    <img src="${candidate.photo}" alt="Foto ${candidate.name}" 
                        class="w-16 h-16 rounded-full object-cover">
                    <div>
                        <h3 class="text-lg font-semibold">${candidate.name}</h3>
                        <p class="text-gray-600">${candidate.voteCount} suara</p>
                    </div>
                </div>
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Persentase Suara</span>
                        <span class="font-medium">
                            ${Math.round((candidate.voteCount / totalVotes) * 100)}%
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-black h-2.5 rounded-full" 
                            style="width: ${(candidate.voteCount / totalVotes) * 100}%">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async handleAddCandidate(e) {
        e.preventDefault();
        const name = document.getElementById('candidateName').value;
        const photoFile = document.getElementById('candidatePhoto').files[0];
        
        if (!name || !photoFile) {
            alert('Mohon lengkapi semua field.');
            return;
        }
        
        // In a real app, we would upload the photo to storage
        // For demo, we'll use a placeholder image
        alert('Kandidat berhasil ditambahkan (Demo)');
        this.loadDashboard();
    }

    async handleAddVoter(e) {
        e.preventDefault();
        const parentName = document.getElementById('parentName').value;
        const studentName = document.getElementById('studentName').value;
        
        if (!parentName || !studentName) {
            alert('Mohon lengkapi semua field.');
            return;
        }
        
        alert('Pemilih berhasil ditambahkan (Demo)');
        this.loadDashboard();
    }

    async handleImportCsv(e) {
        e.preventDefault();
        const file = document.getElementById('csvFile').files[0];
        
        if (!file) {
            alert('Mohon pilih file CSV.');
            return;
        }
        
        alert('Data pemilih berhasil diimport (Demo)');
        this.loadDashboard();
    }

    async handleScheduleUpdate(e) {
        e.preventDefault();
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        
        if (!startTime || !endTime) {
            alert('Mohon lengkapi semua field.');
            return;
        }
        
        if (new Date(startTime) >= new Date(endTime)) {
            alert('Waktu mulai harus lebih awal dari waktu selesai.');
            return;
        }
        
        alert('Jadwal berhasil diperbarui (Demo)');
        this.loadDashboard();
    }

    async handleCredentialsUpdate(e) {
        e.preventDefault();
        const newEmail = document.getElementById('newEmail').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!newEmail || !newPassword || !confirmPassword) {
            alert('Mohon lengkapi semua field.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Password tidak cocok.');
            return;
        }

        try {
            const user = window.auth.currentUser;
            if (user.email !== newEmail) {
                await user.updateEmail(newEmail);
            }
            if (newPassword) {
                await user.updatePassword(newPassword);
            }
            alert('Kredensial berhasil diperbarui');
            this.updateCredentialsForm.reset();
        } catch (error) {
            console.error('Error updating credentials:', error);
            alert('Gagal memperbarui kredensial: ' + error.message);
        }
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
        
        // Update tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabId}Tab`).classList.remove('hidden');
    }

    async toggleResults() {
        alert('Status publikasi hasil berhasil diperbarui (Demo)');
        this.loadDashboard();
    }

    exportResults() {
        alert('Hasil pemilihan berhasil diexport (Demo)');
    }

    async handleLogout() {
        if (confirm('Anda yakin ingin keluar?')) {
            try {
                await window.auth.signOut();
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Gagal keluar: ' + error.message);
            }
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    new AdminPage();
});
