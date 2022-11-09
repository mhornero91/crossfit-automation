FROM mcr.microsoft.com/playwright

ENV CI=1
WORKDIR /app

COPY . /app
RUN npm install
CMD npm start
