FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Deploy commands
RUN npm run deploy

# Initialize the database
RUN node src/init-db.js

# Expose any necessary ports
EXPOSE 3000

# Start the bot
CMD ["npm", "start"] 