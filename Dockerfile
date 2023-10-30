# Use a smaller base image (Alpine)
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies and cleanup in one RUN command
RUN set -eux; \
    npm install; \
    npm cache clean --force

# Copy the entire application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start the Node.js application
CMD ["npm", "start"]
