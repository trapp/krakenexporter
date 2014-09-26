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

CMD ["/opt/app/krakenexporter.sh"]
