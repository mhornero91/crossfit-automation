FROM mcr.microsoft.com/playwright

WORKDIR /app

ENV CI=1

COPY . /app
RUN npm install
CMD npm start
