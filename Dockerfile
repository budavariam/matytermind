FROM node:10

# Create app directory
WORKDIR /usr/src/app
RUN mkdir frontend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY frontend/package*.json ./frontend/

## Install backend dependencies
RUN npm install
## Install frontend dependencies
RUN npm run install-frontend

# Bundle app source
COPY . .
RUN npm run bundle-frontend

EXPOSE 8080
CMD [ "node", "backend/index.js" ]