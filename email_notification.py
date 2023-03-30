import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from time import strftime, gmtime
from sensitive_data import *

# send email notification


def notify_detection(receiver_email):

    message = MIMEMultipart("alternative")
    # hours:minutes
    message["Subject"] = f"Pictiúir Glactha {strftime('%H:%M', gmtime())}"
    message["From"] = sender_email
    message["To"] = receiver_email
    html = f"""\
    <html>
    <head></head>
    <body>
        <p>
        Féach ar an íomhá ar an deais <a href="{dash_link}">anseo</a>.
        </p>
    </body>
    </html>
    """
    text = f"""\
    Glacadh griangraif ag {strftime("%a, %d %b %Y %H:%M", gmtime())} de bharr gluaiseachta nó de bharr iarratas úsáideora."""

    part1 = MIMEText(text, "plain")
    # we're using html so we can add a link to text
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    port = 465

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:  # send the email, very unsafe and not secure
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())
