FROM mcr.microsoft.com/playwright
# https://docs.github.com/en/actions/creating-actions/dockerfile-support-for-github-actions

ENV CI=1

# workaround for github actions. It overwrites the current path of the docker
COPY . /app
RUN npm install --prefix /app
CMD npm start --prefix /app
