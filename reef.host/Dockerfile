FROM ubuntu:24.04 as builder

# Install any needed packages
RUN apt-get update && apt-get install -y curl git gnupg

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs build-essential sed

WORKDIR /apps
COPY . .

RUN npm install yarn -g
RUN yarn && NODE_ENV=production yarn build

CMD ["ls", "-al", "build"]

# ===========================================================
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY reef.host/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/public /usr/share/nginx/html

EXPOSE 5005

ENTRYPOINT ["nginx", "-g", "daemon off;"]
