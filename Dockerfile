FROM node:latest
COPY . /srv/mail
WORKDIR /srv/mail
RUN  npm install
EXPOSE 3000
CMD ["nodejs", "/srv/mail/app.js"]
