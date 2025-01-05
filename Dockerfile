FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 8080

CMD ["npm", "run", "start"]