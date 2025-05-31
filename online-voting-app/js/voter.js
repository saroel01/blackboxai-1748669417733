class VoterPage {
    constructor() {
        // Page sections
        this.loginSection = document.getElementById('loginSection');
        this.votingSection = document.getElementById('votingSection');
        
        // Forms
        this.loginForm = document.getElementById('loginForm');
        this.votingForm = document.getElementById('votingForm');
        
        // Content elements
        this.electionStatus = document.getElementById('electionStatus');
        this.candidateList = document.getElementById('candidateList');
        this.parentName = document.getElementById('parentName');
        this.studentName = document.getElementById('studentName');
        
        // Modals
        this.confirmationModal = document.getElementById('confirmationModal');
        this.successModal = document.getElementById('successModal');
        this.selectedCandidate = document.getElementById('selectedCandidate');
        
        // Header elements
        this.electionNameElement = document.getElementById('electionName');
        this.institutionNameElement = document.getElementById('institutionName');
        this.schoolLogoElement = document.getElementById('schoolLogo');
        this.agencyLogoElement = document.getElementById('agencyLogo');
        
        this.currentVoter = null;
        this.initialize();
    }

    initialize() {
        // Load settings first
        this.loadSettings();
        
        // Login form handler
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Voting form handler
        this.votingForm.addEventListener('submit', (e) => this.handleVoteSubmission(e));
        
        // Modal handlers
        document.getElementById('confirmVoteBtn').addEventListener('click', () => this.submitVote());
        document.getElementById('cancelVoteBtn').addEventListener('click', () => this.hideConfirmationModal());
        document.getElementById('closeSuccessBtn').addEventListener('click', () => this.hideSuccessModal());
        
        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    }

    async handleLogin(e) {
        e.preventDefault();
        const token = document.getElementById('token').value;
        
        try {
            const voter = await window.db.getVoter(token);
            if (voter) {
                if (voter.hasVoted) {
                    alert('Token ini sudah digunakan untuk memilih.');
                    return;
                }
                
                this.currentVoter = { ...voter, token };
                this.parentName.textContent = voter.parentName;
                this.studentName.textContent = voter.studentName;
                
                this.loginSection.classList.add('hidden');
                this.votingSection.classList.remove('hidden');
                
                this.loadCandidates();
            } else {
                alert('Token tidak valid.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Terjadi kesalahan saat login.');
        }
    }

    async loadCandidates() {
        try {
            const candidates = await window.db.getCandidates();
            const settings = await window.db.getElectionSettings();
            
            // Update election status
            const now = new Date();
            const startTime = new Date(settings.startTime);
            const endTime = new Date(settings.endTime);
            
            let statusHtml = '';
            if (now < startTime) {
                statusHtml = `
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div class="flex">
                            <div class="ml-3">
                                <p class="text-sm text-yellow-700">
                                    Pemilihan akan dimulai pada ${startTime.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            } else if (now > endTime) {
                statusHtml = `
                    <div class="bg-red-50 border-l-4 border-red-400 p-4">
                        <div class="flex">
                            <div class="ml-3">
                                <p class="text-sm text-red-700">
                                    Pemilihan telah berakhir pada ${endTime.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                statusHtml = `
                    <div class="bg-green-50 border-l-4 border-green-400 p-4">
                        <div class="flex">
                            <div class="ml-3">
                                <p class="text-sm text-green-700">
                                    Pemilihan sedang berlangsung sampai ${endTime.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }
            this.electionStatus.innerHTML = statusHtml;

            // Display candidates
            this.candidateList.innerHTML = candidates.map(candidate => `
                <div class="candidate-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <img src="${candidate.photo}" alt="Foto ${candidate.name}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold mb-4">${candidate.name}</h3>
                        <label class="inline-flex items-center cursor-pointer group">
                            <input type="radio" name="candidate" value="${candidate.id}" 
                                   class="form-radio h-5 w-5 text-black border-gray-300 focus:ring-black">
                            <span class="ml-2 text-gray-700 group-hover:text-black transition-colors">
                                Pilih Kandidat
                            </span>
                        </label>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading candidates:', error);
            this.electionStatus.innerHTML = `
                <div class="bg-red-50 border-l-4 border-red-400 p-4">
                    <div class="flex">
                        <div class="ml-3">
                            <p class="text-sm text-red-700">
                                Terjadi kesalahan saat memuat data kandidat.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    handleVoteSubmission(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const candidateId = formData.get('candidate');
        
        if (!candidateId) {
            alert('Silakan pilih salah satu kandidat.');
            return;
        }

        // Get candidate name for confirmation
        const candidateElement = document.querySelector(`input[value="${candidateId}"]`)
            .closest('.candidate-card')
            .querySelector('h3');
        this.selectedCandidate.textContent = candidateElement.textContent;
        
        // Show confirmation modal
        this.confirmationModal.classList.remove('hidden');
    }

    async submitVote() {
        try {
            const candidateId = document.querySelector('input[name="candidate"]:checked').value;
            await window.db.submitVote(this.currentVoter.token, candidateId);
            
            this.hideConfirmationModal();
            this.showSuccessModal();
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('Terjadi kesalahan saat mengirim suara.');
        }
    }

    hideConfirmationModal() {
        this.confirmationModal.classList.add('hidden');
    }

    showSuccessModal() {
        this.successModal.classList.remove('hidden');
        document.getElementById('closeSuccessBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        }, { once: true });
    }

    handleLogout() {
        if (confirm('Anda yakin ingin keluar?')) {
            window.location.href = 'index.html';
        }
    }

    async loadSettings() {
        try {
            const settingsDoc = await window.db.collection('settings').doc('general').get();
            const settings = settingsDoc.exists ? settingsDoc.data() : {};

            // Update election name
            if (settings.electionName) {
                this.electionNameElement.textContent = settings.electionName;
                document.title = `${settings.electionName} - Portal Pemilih`;
            }

            // Update institution name
            if (settings.institutionName) {
                this.institutionNameElement.textContent = settings.institutionName;
            }

            // Update school logo
            if (settings.schoolLogoUrl) {
                this.schoolLogoElement.src = settings.schoolLogoUrl;
                this.schoolLogoElement.classList.remove('hidden');
            }

            // Update agency logo
            if (settings.agencyLogoUrl) {
                this.agencyLogoElement.src = settings.agencyLogoUrl;
                this.agencyLogoElement.classList.remove('hidden');
            }

            // Update footer text
            const footerElement = document.getElementById('footerText');
            if (footerElement && settings.footerText) {
                footerElement.textContent = settings.footerText;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    new VoterPage();
});
