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

function openDoc() {
    getDocs();
}

function closeDoc() {
    $("#saved-documents-container").css("display", "none");
}

function getDocs() {
    fetch(`${BASE_URL}/history`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("There is no document")
            } else {
                $("#saved-documents-container").css("display", "flex");
                $(".saved-document-content").empty();
                data.forEach(function (item, i) {
                    var item = `<a class="saved-document" href="${item.uniqueLink}" target="_blank">
                    <i class="fa fa-solid fa-file-lines"></i>
                    <span>Document ${i + 1}</span>
                </a>`;
                    $(".saved-document-content").append(item);
                })
            }
        })
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}