# Use official Node.js 20 image as base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000

# Command to run the application
CMD ["node", "server.js"]
