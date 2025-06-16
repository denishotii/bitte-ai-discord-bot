FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development port
EXPOSE 3001

# Start the development server
CMD ["npm", "run", "dev"] 