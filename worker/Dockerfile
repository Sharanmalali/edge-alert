# Step 1: Use a tiny version of Node.js as the base
FROM node:18-alpine

# Step 2: Create a folder inside the "container" for our code
WORKDIR /usr/src/app

# Step 3: Copy our package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Step 4: Copy the rest of our worker code
COPY . .

# Step 5: Tell Docker to run our probe
CMD [ "node", "probe.js" ]