FROM node:20-alpine

WORKDIR /usr/src/app

# Ensure correct file permissions
COPY package*.json ./
RUN chmod 777 package*.json

RUN npm install

COPY . .

# Ensure all copied files have correct permissions
# RUN chmod -R 777 .

EXPOSE 3030

CMD ["npm", "run", "start"]