FROM node:12.19.0-alpine

COPY package.json ./
COPY package-lock.json ./

# install
RUN npm i --no-optional

# Copy over the Source files
COPY . ./

# Entrypoint stuff
ENTRYPOINT [ "npm", "run" ]
CMD ["start"]
