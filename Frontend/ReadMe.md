Hi, Stephane Hapi.

Please run this command.

-> npm install

-> npm run dev

And then open your browser and type "localhost:3000"

You will see there.

Thanks.

Nikola.




PS C:\Program Files (x86)\Certbot\bin> .\certbot.exe certonly --force-renew -d pdf-vision.com --cert-name pdf-vision.com --key-type rsa
Saving debug log to C:\Certbot\log\letsencrypt.log

How would you like to authenticate with the ACME CA?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 1
Renewing an existing certificate for pdf-vision.com

Successfully received certificate.
Certificate is saved at: C:\Certbot\live\pdf-vision.com\fullchain.pem
Key is saved at:         C:\Certbot\live\pdf-vision.com\privkey.pem
This certificate expires on 2024-09-11.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.
