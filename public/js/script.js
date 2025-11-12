(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })

    // Handle new listing form submission
    const newListingForm = document.getElementById('newListingForm');
    if (newListingForm) {
        newListingForm.addEventListener('submit', handleNewListingSubmit);
    }

    function handleNewListingSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        const listingData = {
            title: formData.get('listing[title]'),
            description: formData.get('listing[description]'),
            image: formData.get('listing[image]'),
            price: formData.get('listing[price]'),
            location: formData.get('listing[location]'),
            country: formData.get('listing[country]')
        };

        // Validate required fields
        if (!listingData.title || !listingData.description || !listingData.price || !listingData.location || !listingData.country) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }

        // Validate price is positive
        if (listingData.price <= 0) {
            showAlert('Price must be greater than 0', 'danger');
            return;
        }

        // Show loading state
        const submitBtn = event.target.querySelector('.add-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;

        // Submit the form
        fetch('/listings', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok || response.redirected) {
                showAlert('Listing added successfully!', 'success');
                // Reset form and redirect after successful submission
                setTimeout(() => {
                    event.target.reset();
                    event.target.classList.remove('was-validated');
                    // Redirect to listings page
                    window.location.href = '/listings';
                }, 1500);
            } else {
                return response.text().then(text => {
                    throw new Error(text || 'Failed to add listing');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Failed to add listing. Please try again.', 'danger');
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert alert before the form
        const form = document.getElementById('newListingForm');
        if (form) {
            form.parentNode.insertBefore(alertDiv, form);
        }

        // Auto-remove alert after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Add real-time validation feedback
    const inputs = document.querySelectorAll('#newListingForm input, #newListingForm textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldValidation);
    });

    function validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            field.classList.add('is-invalid');
        } else if (field.type === 'number' && value && parseFloat(value) <= 0) {
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    }

    function clearFieldValidation(event) {
        const field = event.target;
        field.classList.remove('is-invalid', 'is-valid');
    }
})()