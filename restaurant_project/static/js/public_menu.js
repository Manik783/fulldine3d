// Initialize Bootstrap modal and model viewer
let modelViewerModal = null;
let currentModelViewer = null;

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create modal element
    const modalElement = document.createElement('div');
    modalElement.id = 'model-viewer-modal';
    modalElement.classList.add('modal', 'fade');
    modalElement.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-dark text-gold">
                    <h5 class="modal-title" id="model-title">3D Model Viewer</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0 position-relative" style="height: 70vh;">
                    <div id="model-container" class="h-100 w-100">
                        <div id="loading-spinner" class="d-flex justify-content-center align-items-center h-100">
                            <div class="spinner-border text-gold" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-dark">
                    <button id="reset-model-btn" class="btn btn-gold">
                        <i class="fas fa-sync me-1"></i> Reset View
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalElement);
    
    // Initialize modal
    modelViewerModal = new bootstrap.Modal(document.getElementById('model-viewer-modal'));
    
    // Add event listeners
    document.getElementById('reset-model-btn').addEventListener('click', resetModelViewer);
    document.getElementById('model-viewer-modal').addEventListener('hidden.bs.modal', cleanupModelViewer);
});

// Open 3D modal with dish details
function open3DModal(dishId, dishName, glbUrl, usdzUrl) {
    if (!glbUrl && !usdzUrl) {
        showError('3D model not available for this dish');
        return;
    }
    
    // Set modal title
    document.getElementById('model-title').textContent = dishName;
    
    // Show loading spinner
    document.getElementById('loading-spinner').classList.remove('d-none');
    
    // Cleanup previous model if exists
    cleanupModelViewer();
    
    // Create new model-viewer element
    currentModelViewer = document.createElement('model-viewer');
    currentModelViewer.id = `model-viewer-${dishId}`;
    currentModelViewer.setAttribute('src', glbUrl);
    if (usdzUrl) {
        currentModelViewer.setAttribute('ios-src', usdzUrl);
    }
    currentModelViewer.setAttribute('alt', dishName);
    currentModelViewer.setAttribute('ar');
    currentModelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    currentModelViewer.setAttribute('camera-controls');
    currentModelViewer.setAttribute('shadow-intensity', '1');
    currentModelViewer.setAttribute('auto-rotate');
    currentModelViewer.setAttribute('ar-scale', 'fixed');
    currentModelViewer.setAttribute('environment-image', 'neutral');
    currentModelViewer.setAttribute('exposure', '0.8');
    currentModelViewer.setAttribute('style', 'width:100%; height:100%;');
    
    // Add event listeners to handle loading
    currentModelViewer.addEventListener('load', () => {
        document.getElementById('loading-spinner').classList.add('d-none');
    });
    
    currentModelViewer.addEventListener('error', () => {
        document.getElementById('loading-spinner').classList.add('d-none');
        showError('Failed to load 3D model');
    });
    
    // Add to container
    document.getElementById('model-container').appendChild(currentModelViewer);
    
    // Show modal
    modelViewerModal.show();
    
    // Track AR view
    trackARView(dishId);
}

// Reset model to initial state
function resetModelViewer() {
    if (currentModelViewer) {
        currentModelViewer.reset();
        currentModelViewer.cameraOrbit = '0deg 75deg 105%';
    }
}

// Cleanup resources when modal closes
function cleanupModelViewer() {
    if (currentModelViewer) {
        currentModelViewer.remove();
        currentModelViewer = null;
    }
    document.getElementById('loading-spinner').classList.remove('d-none');
}

// Track AR view with backend
function trackARView(dishId) {
    fetch(`/api/track-ar-view/${dishId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        }
    }).catch(error => {
        console.error('Error tracking AR view:', error);
    });
}

// Show error message
function showError(message) {
    const errorAlert = document.createElement('div');
    errorAlert.classList.add('alert', 'alert-danger', 'mt-3');
    errorAlert.textContent = message;
    document.getElementById('model-container').appendChild(errorAlert);
}

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}