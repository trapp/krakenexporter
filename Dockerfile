FROM ubuntu

RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install nodejs npm git && \
    npm install -g bower

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN mkdir -p /opt/app

ADD . /opt/app

RUN cd /opt/app && \
    npm install && \
    CI=true bower --allow-root install

RUN cd /opt/app && \
    cp config.js.example config.js

EXPOSE 3000

CMD ["/opt/app/krakenexporter.sh"]
