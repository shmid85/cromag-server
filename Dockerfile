FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

LABEL authors="Martynyuk Aleksandr"

CMD ["npm", "run", "start"]