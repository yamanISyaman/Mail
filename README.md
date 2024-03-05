# CS50 Web Programming: Mail Project

## Understanding

In the distribution code is a Django project called `project3` that contains a single app called `mail`. After making and applying migrations for the project, run `python manage.py runserver` to start the web server. Use the “Register” link to register for a new account. The emails you’ll be sending and receiving in this project will be entirely stored in your database, so you can choose any email address and password you’d like for this project.

## Specification

### Send Mail

- When a user submits the email composition form, add JavaScript code to actually send the email.
- Make a `POST` request to `/emails`, passing in values for `recipients`, `subject`, and `body`.
- Once the email has been sent, load the user’s sent mailbox.

### Mailbox

- When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
- Make a `GET` request to `/emails/<mailbox>` to request the emails for a particular mailbox.
- When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
- Each email should then be rendered in its own box that displays who the email is from, what the subject line is, and the timestamp of the email.
- If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.

### View Email

- When a user clicks on an email, the user should be taken to a view where they see the content of that email.
- Make a `GET` request to `/emails/<email_id>` to request the email.
- Your application should show the email’s sender, recipients, subject, timestamp, and body.

### Archive and Unarchive

- Allow users to archive and unarchive emails that they have received.
- When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email.

### Reply

- Allow users to reply to an email.
- When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
- Pre-fill the composition form with the `recipient` field set to whoever sent the original email.
- Pre-fill the `subject` line. If the original email had a subject line of `foo`, the new subject line should be `Re: foo`.
- Pre-fill the `body` of the email with a line like `"On Jan 1 2020, 12:00 AM foo@example.com wrote:"` followed by the original text of the email.