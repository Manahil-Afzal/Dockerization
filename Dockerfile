FROM node:alpine

WORKDIR /Dockerization

COPY package.json . 

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","app.js"]