# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the entire project directory
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
