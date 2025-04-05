FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variable to indicate we're in Docker
ENV RUNNING_IN_DOCKER=true

EXPOSE 3000

CMD ["npm", "start"]