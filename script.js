// Sample data templates
const sampleData = {
    employee: [
        { id: "EMP001", firstName: "John", lastName: "Smith", position: "CNC Operator", department: "Production", hireDate: "2022-05-15", skills: "Machining, Blueprint Reading", yearsExperience: 5, performanceScore: 4.2 },
        { id: "EMP002", firstName: "Maria", lastName: "Garcia", position: "Quality Inspector", department: "Quality Assurance", hireDate: "2021-08-10", skills: "Quality Control, Metrology", yearsExperience: 7, performanceScore: 4.5 },
        { id: "EMP003", firstName: "David", lastName: "Chen", position: "Process Engineer", department: "Engineering", hireDate: "2023-01-20", skills: "Lean Manufacturing, Six Sigma", yearsExperience: 3, performanceScore: 4.0 }
    ],
    job: [
        { jobId: "JOB001", title: "Manufacturing Technician", department: "Production", requiredSkills: "Equipment Operation, Troubleshooting", minExperience: 2, priority: "High", openPositions: 3, location: "Main Plant" },
        { jobId: "JOB002", title: "Quality Specialist", department: "Quality Assurance", requiredSkills: "Inspection, Documentation", minExperience: 3, priority: "Medium", openPositions: 1, location: "Main Plant" },
        { jobId: "JOB003", title: "Production Supervisor", department: "Operations", requiredSkills: "Leadership, Process Improvement", minExperience: 5, priority: "Critical", openPositions: 1, location: "Assembly Facility" }
    ],
    candidate: [
        { id: "CAND-001", firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "123-456-7890", position: "Manufacturing Engineer", skills: "CAD, CNC Programming", experience: 5 },
        { id: "CAND-002", firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", phone: "234-567-8901", position: "Quality Inspector", skills: "Quality Control, ISO 9001", experience: 3 },
        { id: "CAND-003", firstName: "Michael", lastName: "Johnson", email: "michael.j@example.com", phone: "345-678-9012", position: "Production Manager", skills: "Lean Manufacturing, Team Leadership", experience: 8 }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Check if Airtable client is available
    const airtableEnabled = typeof window.airtableClient !== 'undefined';
    console.log("Airtable integration enabled:", airtableEnabled);
    
    // Employee upload functionality
    setupUploadTab('employee');
    
    // Job requirements upload functionality
    setupUploadTab('job');
    
    // Candidate upload functionality
    setupUploadTab('candidate');
    
    // Sample file functionality
    setupSampleFileModal();
    
    // Setup upload tab functionality
    function setupUploadTab(type) {
        const uploadArea = document.getElementById(`${type}UploadArea`);
        const fileInput = document.getElementById(`${type}FileInput`);
        const uploadProgressContainer = document.getElementById(`${type}UploadProgressContainer`);
        const uploadProgressBar = document.getElementById(`${type}UploadProgressBar`);
        const uploadPercentage = document.getElementById(`${type}UploadPercentage`);
        const successMessage = document.getElementById(`${type}SuccessMessage`);
        const errorMessage = document.getElementById(`${type}ErrorMessage`);
        const errorText = document.getElementById(`${type}ErrorText`);
        const uploadHistory = document.getElementById(`${type}UploadHistory`);
        const historyBody = document.getElementById(`${type}HistoryBody`);
        const sampleLink = document.getElementById(`${type}SampleLink`);
        
        // Click to browse files
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // File selected
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                uploadFile(file, type);
            }
        });
        
        // Sample link click
        sampleLink.addEventListener('click', function() {
            showSampleFile(type);
        });
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('border-primary');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('border-primary');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('border-primary');
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                uploadFile(file, type);
            }
        });
        
        // Load upload history from localStorage
        const history = JSON.parse(localStorage.getItem(`${type}UploadHistory`) || '[]');
        if (history.length > 0) {
            history.forEach(info => {
                addToHistory(info, historyBody);
            });
            uploadHistory.style.display = 'block';
        }
        
        // File upload function
        function uploadFile(file, type) {
            // Reset messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            
            // Show progress container
            uploadProgressContainer.style.display = 'block';
            
            // Validate file type
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
                showError('Please upload a CSV or Excel file');
                return;
            }
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showError('File size exceeds 10MB limit');
                return;
            }
            
            // If it's not a CSV file, show error (for now we only support CSV)
            if (fileExtension !== 'csv') {
                showError('Currently only CSV files are supported');
                return;
            }
            
            // Read file content
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvData = e.target.result;
                processFileUpload(csvData, file);
            };
            reader.onerror = function() {
                showError('Error reading file');
            };
            reader.readAsText(file);
        }
        
        // Process file upload
        function processFileUpload(csvData, file) {
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                uploadProgressBar.style.width = progress + '%';
                uploadPercentage.textContent = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // If Airtable integration is enabled, send data to Airtable
                    if (airtableEnabled) {
                        try {
                            // Process CSV data for Airtable
                            const records = window.airtableClient.processCSVForUpload(csvData, type);
                            
                            // Send to Airtable
                            window.airtableClient.sendData(type === 'candidate' ? 'candidates' : type + 's', records)
                                .then(response => {
                                    console.log('Airtable upload success:', response);
                                    uploadComplete(file, 'Uploaded to Airtable');
                                })
                                .catch(error => {
                                    console.error('Airtable upload error:', error);
                                    showError('Error uploading to Airtable: ' + error.message);
                                });
                        } catch (error) {
                            console.error('CSV processing error:', error);
                            showError('Error processing CSV: ' + error.message);
                        }
                    } else {
                        // Simulate successful upload without Airtable
                        setTimeout(() => {
                            uploadComplete(file, 'Processed (Demo)');
                        }, 500);
                    }
                }
            }, 200);
        }
        
        // Upload complete
        function uploadComplete(file, status) {
            uploadProgressContainer.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Store upload information
            const uploadInfo = {
                fileName: file.name,
                fileSize: (file.size / 1024).toFixed(2) + ' KB',
                uploadDate: new Date().toLocaleString(),
                type: type.charAt(0).toUpperCase() + type.slice(1) + ' Data',
                status: status
            };
            
            // Add to history
            addToHistory(uploadInfo, historyBody);
            uploadHistory.style.display = 'block';
            
            // Store in localStorage for demo persistence
            const history = JSON.parse(localStorage.getItem(`${type}UploadHistory`) || '[]');
            history.push(uploadInfo);
            localStorage.setItem(`${type}UploadHistory`, JSON.stringify(history));
            
            // Update dashboard link to include query parameter for demo
            const dashboardLink = document.querySelector('#dashboard a.btn-primary');
            if (dashboardLink) {
                const currentHref = dashboardLink.getAttribute('href');
                dashboardLink.setAttribute('href', `${currentHref}?upload=${type}_${Date.now()}`);
            }
        }
        
        // Show error message
        function showError(message) {
            uploadProgressContainer.style.display = 'none';
            errorMessage.style.display = 'block';
            errorText.textContent = message;
        }
    }
    
    // Add to history table
    function addToHistory(info, historyBody) {
        const row = document.createElement('tr');
        
        const fileNameCell = document.createElement('td');
        fileNameCell.textContent = info.fileName;
        row.appendChild(fileNameCell);
        
        const sizeCell = document.createElement('td');
        sizeCell.textContent = info.fileSize;
        row.appendChild(sizeCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = info.uploadDate;
        row.appendChild(dateCell);
        
        const statusCell = document.createElement('td');
        statusCell.innerHTML = `<span class="badge bg-success">${info.status}</span>`;
        row.appendChild(statusCell);
        
        historyBody.prepend(row);
    }
    
    // Sample file modal functionality
    function setupSampleFileModal() {
        const sampleFileModal = new bootstrap.Modal(document.getElementById('sampleFileModal'));
        const sampleFileModalTitle = document.getElementById('sampleFileModalTitle');
        const sampleFileTable = document.getElementById('sampleFileTable');
        const downloadSampleBtn = document.getElementById('downloadSampleBtn');
        
        // Show sample file
        window.showSampleFile = function(type) {
            const data = sampleData[type];
            const title = type.charAt(0).toUpperCase() + type.slice(1) + ' Data Template';
            
            sampleFileModalTitle.textContent = title;
            
            // Clear previous content
            sampleFileTable.innerHTML = '';
            
            // Create table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            // Get headers from first data object
            Object.keys(data[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            sampleFileTable.appendChild(thead);
            
            // Create table body
            const tbody = document.createElement('tbody');
            
            data.forEach(row => {
                const tr = document.createElement('tr');
                
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                
                tbody.appendChild(tr);
            });
            
            sampleFileTable.appendChild(tbody);
            
            // Set download button action
            downloadSampleBtn.onclick = function() {
                downloadSampleFile(type);
            };
            
            sampleFileModal.show();
        };
        
        // Download sample file
        function downloadSampleFile(type) {
            const data = sampleData[type];
            const title = type + '_data_template';
            
            // Convert to CSV
            const headers = Object.keys(data[0]);
            let csv = headers.join(',') + '\n';
            
            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    // Escape commas and quotes
                    return `"${String(value).replace(/"/g, '""')}"`;
                });
                csv += values.join(',') + '\n';
            });
            
            // Create download link
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
});
