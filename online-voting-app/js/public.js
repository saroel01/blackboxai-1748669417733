class PublicResultsPage {
    constructor() {
        // Results elements
        this.resultsStatus = document.getElementById('resultsStatus');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.totalVotesCast = document.getElementById('totalVotesCast');
        this.participationPercent = document.getElementById('participationPercent');
        this.votesProgress = document.getElementById('votesProgress');
        this.participationProgress = document.getElementById('participationProgress');
        this.electionStatus = document.getElementById('electionStatus');

        // Header elements
        this.electionNameElement = document.getElementById('electionName');
        this.institutionNameElement = document.getElementById('institutionName');
        this.schoolLogoElement = document.getElementById('schoolLogo');
        this.agencyLogoElement = document.getElementById('agencyLogo');

        this.initialize();
    }

    async initialize() {
        try {
            // Get settings from Firestore
            const settingsDoc = await window.db.collection('settings').doc('general').get();
            const settings = settingsDoc.exists ? settingsDoc.data() : {};
            const candidates = await window.db.collection('candidates').get().then(snapshot => 
                snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            );

            // Update header information
            this.updateHeaderInfo(settings);
            
            // Update participation statistics
            const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
            this.totalVotesCast.textContent = `${totalVotes}/${settings.totalVoters}`;
            const participationRate = Math.round((totalVotes / settings.totalVoters) * 100);
            this.participationPercent.textContent = `${participationRate}%`;
            
            // Update progress bars
            this.votesProgress.style.width = `${participationRate}%`;
            this.participationProgress.style.width = `${participationRate}%`;

            // Update election status
            const now = new Date();
            const startTime = new Date(settings.startTime);
            const endTime = new Date(settings.endTime);
            
            let statusText = '';
            if (now < startTime) {
                statusText = `Pemilihan akan dimulai pada ${startTime.toLocaleString('id-ID')}`;
            } else if (now > endTime) {
                statusText = `Pemilihan telah berakhir pada ${endTime.toLocaleString('id-ID')}`;
            } else {
                statusText = `Pemilihan sedang berlangsung sampai ${endTime.toLocaleString('id-ID')}`;
            }
            
            this.electionStatus.innerHTML = `
                <p class="text-lg font-medium">${statusText}</p>
            `;

            // Display results if published
            if (settings.resultsPublished) {
                this.displayResults(candidates, totalVotes);
            } else {
                this.showResultsNotPublished();
            }
        } catch (error) {
            console.error('Error initializing results page:', error);
            this.showError();
        }
    }

    displayResults(candidates, totalVotes) {
        this.resultsContainer.innerHTML = candidates.map(candidate => `
            <div class="result-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img src="${candidate.photo}" alt="Foto ${candidate.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold mb-2">${candidate.name}</h3>
                    <div class="mb-2">
                        <div class="flex justify-between mb-1">
                            <span class="text-sm font-medium text-gray-700">Perolehan Suara</span>
                            <span class="text-sm font-medium text-gray-900">
                                ${Math.round((candidate.voteCount / totalVotes) * 100)}%
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-black h-2.5 rounded-full transition-all duration-1000" 
                                 style="width: ${(candidate.voteCount / totalVotes) * 100}%">
                            </div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600">Total: ${candidate.voteCount} suara</p>
                </div>
            </div>
        `).join('');
    }

    showResultsNotPublished() {
        this.resultsStatus.innerHTML = `
            <div class="text-center p-8">
                <p class="text-xl font-medium text-gray-700">
                    Hasil pemilihan akan ditampilkan setelah pemilihan berakhir
                </p>
            </div>
        `;
        this.resultsContainer.innerHTML = '';
    }

    showError() {
        this.resultsStatus.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            Terjadi kesalahan saat memuat hasil. Silakan coba lagi nanti.
                        </p>
                    </div>
                </div>
            </div>
        `;
        this.resultsContainer.innerHTML = '';
    }

    updateHeaderInfo(settings) {
        // Update election name
        if (settings.electionName) {
            this.electionNameElement.textContent = settings.electionName;
            document.title = `${settings.electionName} - Hasil`;
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
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    new PublicResultsPage();
});
