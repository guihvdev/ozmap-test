FROM node:20

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]