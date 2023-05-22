FROM node:10

# Create app directory
WORKDIR /usr/src/app
RUN mkdir frontend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY frontend/package*.json ./frontend/

## Install backend and frontend
RUN npm install
RUN npm run heroku-postbuild

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "backend/index.js" ]