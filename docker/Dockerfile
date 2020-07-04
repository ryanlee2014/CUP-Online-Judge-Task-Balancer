
# Pull base image.
FROM ubuntu:20.04

LABEL maintainer="Ryan Lee" \
      email="gxlhybh@gmail.com"

# Install Node.js
RUN set -xe && \
    apt-get update && \
    apt-get install --yes curl git vim build-essential && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get update && \
    apt-get install --yes nodejs && \
    npm -g install n && \
    n latest && \
    export PATH="$PATH"
RUN set -xe && \
    git clone https://github.com/ryanlee2014/CUP-Online-Judge-Task-Balancer.git balancer && \
    cd balancer && \
    npm i && \
    npm run build

EXPOSE 5110

CMD ["sh", "-c", "cd /balancer && NODE_ENV=production node ./build/index.js"]
