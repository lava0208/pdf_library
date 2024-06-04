$(document).ready(function () {
    const emailInput = $('#email-input');
    const emailFeedback = $('#email-feedback');

    // Initialize Select2
    emailInput.select2({
        tags: true,
        tokenSeparators: [',', ' '],
        createTag: function (params) {
            const term = $.trim(params.term);
            // Validate email before creating a new tag
            if (validateEmail(term)) {
                emailFeedback.css("color", "green");
                emailFeedback.text("Valid email format");
                return {
                    id: term,
                    text: term,
                    newTag: true
                };
            } else {
                emailFeedback.css("color", "red");
                emailFeedback.text("Invalid email format");
                return null;
            }
        },
        language: {
            noResults: function() {
                return '';
            }
        }
    });

    // Clear feedback on selection change
    emailInput.on('change', function () {
        const emails = emailInput.val();
        if (emails.length === 0) {
            emailFeedback.hide();
        } else {
            emailFeedback.show();
        }
    });
})

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}