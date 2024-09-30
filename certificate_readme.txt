# create certificate with openssl in project root folder
openssl req -newkey rsa:2048 -x509 -nodes -keyout key.pem -out cert.pem -subj /CN=localhost -reqexts SAN -extensions SAN -config <(cat /etc/ssl/openssl.cnf <(printf '[SAN]\nsubjectAltName=DNS:localhost')) -days 365

# install certificate in windows 11
1. Open Chrome Browser -> Zertifikate verwalten -> import "cert.pem"
2. Open "certmgr" (Management Console), copy "Eigene Zertifikate -> Zertifikate -> localhost" nach "Vertrauenswürdige Stammzertifizierungsstellen -> Zertifikate"

# check certificate on https://localhost:8080
npm run build
npx http-server ./build -S
