FROM node:22-slim

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV NODE_ENV=production
RUN npm ci

# Bundle app source
COPY . ./

# Start CMD
USER node
ENTRYPOINT [ "/app/run.sh" ]
