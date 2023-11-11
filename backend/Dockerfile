FROM node:18-alpine

EXPOSE 5000

RUN mkdir /app && chmod 777 /app

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN find . ! -path "./node_modules/*" -type f -exec chmod 777 {} \; && \
    find . ! -path "./node_modules/*" -type d -exec chmod 777 {} \;

ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_NAME=$DB_NAME
ENV JWT_KEY = "MIICWwIBAAKBgQCC6wyt6EhDSNcRWYuk+ASWrrc+q+cY8BLu//eskw31zOz08Thq Wiwj+tUrky4l+km1OMUg0v7Qc6xkClrZMM6puvT+PfaUU4vQnQ5jUVOppZo0jRs4 ruY4HthmxOBF5AtnpP+2n3NnKbvEgohcK+gKUCpY9zZPzbZ0bcLJAjV+/wIDAQAB AoGAdw5ofnKh3MaOBxIm40RFb/69WDoeNFiG72BKDV/CL0lIKEyB4H3WbHX8i98R 9amShEJ3Sq1223yGRogALEmtdfGngzK77GfOk+MPyLGqZiyZ4RkKqgqZobEYNUZT fJb+31SyxBvjtRke/77iodpyKXge3AAE2hGDWqHP+GmKpmkCQQDCPusHezYqd12U hLGZV5CvPYkXmQIutfUTuogb3DmuPOh5IGxuBxChyrIb6jLOxodSXEbM11wSQemo S1O7cStLAkEArIoWNb4ZozS+SADhBqiOtiD07oXzEzqrF2kUhrWt0B7I1I4xqMv2 MNkn4wXq3rwzjBnH3EBnKzpHbGh2RVCWnQJAXydDKt8IobTneqGl/mAO2ElkptKl ZwxricaOdldjSh88Ilnnw95iH1+T8GjBitll4MqjRCUbTTZMp8x+sAu4EQJAD0vG oEkUGMXqQJPjXyW+USMm06aIYCIJXO/x4+djW1n/T+izOlWqo7X8tUGnCswAfeEj OMF04/4sqs2v/oEgeQJAKdwYoULSyMzb2+rOiQPNl0r9Z1wt+UerLtxL7p098K4u TyKWU4Zr7q2RsWb8UunVCagRp89ewV7w22EfJyILVA=="
ENV NODE_ENV = "production"
ENV ENV = "production"

RUN npm run swagger

CMD npm run publish