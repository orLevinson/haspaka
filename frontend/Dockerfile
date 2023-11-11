FROM node:18-alpine

EXPOSE 3000

RUN mkdir /app && chmod 777 /app

WORKDIR /app

COPY package.json package.json

RUN npm install

RUN npm install -g serve

COPY . .

RUN find . ! -path "./node_modules/*" -type f -exec chmod 777 {} \; && \
    find . ! -path "./node_modules/*" -type d -exec chmod 777 {} \;


ENV VITE_REACT_APP_BASE_URL=$VITE_REACT_APP_BASE_URL

CMD npm run build && npx serve -s dist