FROM frolvlad/alpine-glibc

LABEL version="1.0.0"
LABEL repository="http://github.com/saucelabs/sauce-connect-action"
LABEL homepage="http://github.com/saucelabs/sauce-connect-action"
LABEL maintainer="Christian Bromann <christian@saucelabs.com>"
LABEL "com.github.actions.name"="Sauce Connect Proxy Action"
LABEL "com.github.actions.description"="A GitHub action to launch Sauce Connect Proxy"
LABEL "com.github.actions.icon"="server"
LABEL "com.github.actions.color"="green"

ENV SAUCE_CONNECT_VERSION 4.5.4

WORKDIR /usr/local/sauce-connect

RUN apk add --no-cache libstdc++
RUN apk add --no-cache --virtual .build-deps binutils-gold g++ curl gcc gnupg libgcc linux-headers

RUN wget https://saucelabs.com/downloads/sc-$SAUCE_CONNECT_VERSION-linux.tar.gz -O - | tar -xz

WORKDIR /usr/local/sauce-connect/sc-$SAUCE_CONNECT_VERSION-linux

ENV PATH /usr/local/sauce-connect/sc-$SAUCE_CONNECT_VERSION-linux/bin:$PATH

ENTRYPOINT ["sc"]

EXPOSE 4445
EXPOSE 8032

CMD ["--version"]
