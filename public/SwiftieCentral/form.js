document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contact-form');
     // Clear errors when form is reset
     form.addEventListener('reset', clearAllErrors);
 
     form.addEventListener('submit', function (event) {
         // Prevent form submission until validation is complete
         event.preventDefault();
 
         // Clear previous error messages
         clearAllErrors();
         const name = document.getElementById('name');
         let errorText ="";
         let isFormValid = true;
         if (name.value.length===0) {
            errorText="Enter a name."
            isFormValid=false;
         }
         else if (!/^[a-zA-Z\s]+$/.test(name.value.trim())) {
            errorText='No nicknames or usernames.';
            isFormValid = false;
        } 
        else {
        
         // Name Validation
         
         if (name.value.length > 25) {
             errorText+='Name is too long. ';
             isFormValid = false;
         }
         else if (name.value.length < 5) {
            errorText+='Name is too short. ';
            isFormValid = false;
        }
        if (name.value.trim().split(' ').length !== 2) {
            errorText+='Name must consist of first and last name.';
            isFormValid = false;
        }}
        if (!isFormValid) showError(name, errorText); 
        
 
         // Email/Phone Validation
         const email = document.querySelector('input[name="email"]');
         const phone = document.querySelector('input[name="phone"]');
         const selectedMethod = document.querySelector('input[name="contact-method"]:checked').value;
 
         if (selectedMethod === 'email') {
             const emailValue = email.value;
             const atSymbolCount = emailValue.split('@').length - 1;
             const dotCount = emailValue.split('.').length - 1;
         
             if (emailValue.length < 6 || emailValue.length > 25 || atSymbolCount !== 1 || dotCount < 1) {
                errorText = (email.value.length === 0 ? "Enter an email address." : "Invalid email address format.");
                 showError(email, errorText);
                 isFormValid = false;
             }
         }
 
         if (selectedMethod === 'phone' && !/^[+()-\d\s]+$/.test(phone.value) && phone.value.length<5) {
            errorText = (phone.value.length === 0 ? "Enter a phone number." : "Invalid phone number format.");

             showError(phone, errorText);
             isFormValid = false;
         }
 
         // Message Validation
         const message = document.getElementById('message');
         if (message.value.length < 40) {
            errorText = (message.value.length === 0 ? "Message is required." : "Message is too short.");

             showError(message, errorText);
             isFormValid = false;
         }
 
         // If form is valid, submit it
         if (isFormValid) {
             form.submit();
         }
     });
 

 
     
     
 });
 
 function clearAllErrors() {
    // if (form===null) return;
     const form = document.querySelector('.contact-form');
     const inputElements = form.querySelectorAll('input[type="text"], textarea');
     inputElements.forEach(clearError);
 }
 
 function showError(inputElement, message) {
    // Use the input element's name attribute to construct the ID of the error span
    const errorSpanId = inputElement.name + '-error';
    const errorSpan = document.getElementById(errorSpanId);
    errorSpan.textContent = message;
    errorSpan.style.visibility = 'visible'; // Make the error message visible
    inputElement.style.borderColor = 'red';
}

function clearError(inputElement) {
    // Use the input element's name attribute to construct the ID of the error span
    const errorSpanId = inputElement.name + '-error';
    const errorSpan = document.getElementById(errorSpanId);
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.style.visibility = 'hidden'; // Hide the error message
    }
    inputElement.style.borderColor = ''; // Reset border color
}

 
 
 window.onbeforeunload = () => {
    // if (form===null) return;
     for(const form of document.getElementsByTagName('form')) {
       form.reset();
       
     }
     clearAllErrors();
   }
