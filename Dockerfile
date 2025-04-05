FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json .npmrc ./

# Install dependencies with retries
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm install --verbose || \
    (sleep 5 && npm install --verbose) || \
    (sleep 10 && npm install --verbose)

# Copy the rest of the application
COPY . .

# Set environment variable to indicate we're in Docker
ENV RUNNING_IN_DOCKER=true

EXPOSE 3000

CMD ["npm", "start"]