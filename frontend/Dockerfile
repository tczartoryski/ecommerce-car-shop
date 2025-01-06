# Stage 1: Build the React application
FROM node:latest AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the entire project directory
COPY . .

# Build the React application for production
RUN npm run build

# Stage 2: Serve the React application with nginx
FROM nginx:alpine

# Copy the built React application from the build stage to the nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration file if needed
 COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port on which the app will run
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
