FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 5001

LABEL authors="Martynyuk Aleksandr"

CMD ["npm", "run", "start"]