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
    document.querySelector('#mail-show').style.display = 'none';
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
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#mail-show').style.display = 'none';
    document.querySelector('#emails-view').style.display = 'block';

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
                    if (mailbox === 'archive' && email.archive === false) {
                        return;
                    } else if (mailbox === 'inbox' && email.archive === true) {
                        return;
                    } else {}
                    const element = document.createElement('div');
                    element.id = 'mail-card';
                    element.className = 'card';
                    element.innerHTML = `<div class="card-body">
                            <b>${email.sender}</b> ${email.subject}
                            <span>${email.timestamp}</span>
                    </div>`;
                    element.addEventListener('click', () => show_mail(email.id));
                    document.querySelector('#emails-view').appendChild(element);
                    if (email.read === true) {
                        element.style.backgroundColor = '#c7c7c7ff';
                    } else {}
                    })
            }
            })
}

function show_mail(mail_id) {

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#mail-show').style.display = 'block';
    
    // show the email

    fetch(`/emails/${mail_id}`)
    .then(response => response.json())
    .then(email => {
        // create the html that shows the email
        const element = document.createElement('div');
        element.innerHTML = `
        <p><b>From:</b> ${email.sender}</p>
        <p><b>To:</b> ${email.recipients}</p>
        <p><b>Subject:</b> ${email.subject}</p>
        <p><b>Timestamp:</b> ${email.timestamp}</p>
        `;
        document.querySelector('#mail-show').innerHTML = '';
        document.querySelector('#mail-show').appendChild(element);
        let reply_btn = document.createElement('button');
        reply_btn.className = 'btn btn-primary';
        reply_btn.id = 'reply-btn';
        reply_btn.innerHTML = 'Reply';
        
        element.appendChild(reply_btn);
        reply_btn.addEventListener('click', () => reply(email));
        
        let archive_btn = document.createElement('button');
        archive_btn.className = 'btn btn-success';
        archive_btn.id = 'archive-btn';
        element.appendChild(archive_btn);

        if (email.archived === false) {
            
            archive_btn.innerHTML = 'Archive';
            archive_btn.addEventListener('click', () => {
                fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: true
                    })
                })
                 archive_btn.style.display = 'none';
            });
        } else {
            
            archive_btn.innerHTML = 'Unarchive';
             archive_btn.addEventListener('click', () => {
                fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: false
                    })
                })
                archive_btn.style.display = 'none';
            });
            
        }

        const x = document.createElement('div');
        x.innerHTML = `
        <hr>
        <p>${email.body}</p>
        `
        element.appendChild(x);
    });
    
    fetch(`/emails/${mail_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
    })
}

function reply(email) {
    console.log('here4');
    // make reply functionality 
}