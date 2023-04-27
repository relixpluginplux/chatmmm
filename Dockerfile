# Use the official Python image as the base image
FROM nodo

# Set the working directory in the container
WORKDIR /index.js

# Copy the application files into the working directory


# Install the application dependencies
RUN pip install -r requirements.txt
RUN npm install -g pm2
RUN pm2 link zpswkvxaao9fr0c pnyqolk46corcwg
RUN pm2 start index.js

# Define the entry point for the container
