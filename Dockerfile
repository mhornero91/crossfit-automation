FROM mcr.microsoft.com/playwright

ENV CI=1
WORKDIR /app

COPY . /app
RUN npm install && npx playwright install chromium
CMD npm start
