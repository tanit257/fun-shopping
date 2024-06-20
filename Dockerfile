# Use the official MongoDB image from Docker Hub
FROM mongo:latest

# Set the working directory
WORKDIR /data/db

# Expose the default MongoDB port
EXPOSE 27017