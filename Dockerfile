FROM node:latest
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY . .
RUN npm install
# Expose the port the app runs on
EXPOSE 3000

CMD [ "npm", "start" ]