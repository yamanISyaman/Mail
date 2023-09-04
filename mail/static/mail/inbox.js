document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

    // add event listener to the form
    document.querySelector('#submitbtn').addEventListener('click', () => {
        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: document.querySelector('#compose-recipients').value,
                subject: document.querySelector('#compose-subject').value,
                body: document.querySelector('#compose-body').value
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.hasOwnProperty("error")) {
                // if an error exist, show it
                document.querySelector('#form-alert').style.display = 'block';
                document.querySelector('#form-alert').innerHTML = result.error;
            } else {
                 // on success, submit the form
                document.querySelector('#compose-form').submit();
            };
        });
    });
    
}

function load_mailbox(mailbox) {
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    
    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails => {
            // Print emails
            if (emails.length === 0) {
                document.querySelector('#emails-view').innerHTML += "<h4>No Emails.</h4>";
            } else {
                emails.forEach((email) => {
                    document.querySelector('#emails-view').innerHTML += `<div id="email${email.id}" class="card">
                        <div class="card-body">
                             <b>${email.sender}</b> ${email.subject}
                             <span>${email.timestamp}</span>
                        </div>
                    </div>`;
                    if (email.read === true) {
                        document.querySelector(`#email${email.id}`).style.backgroundColor = '#c7c7c7ff';
                    } else {}
                    })
            }
            })

            // ... do something else with emails ...
}