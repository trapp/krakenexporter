# Kraken Exporter

Exports your kraken.com history as CSV.

Check it out at: [http://krakenexporter.zaeda.net](http://krakenexporter.zaeda.net)

## Requirements

* NodeJS
* NPM
* Bower (If missing install with `npm install -g bower`)

## Installation (with Docker)

docker run -d -p 3000:3000 -e HOST=127.0.0.1 -e PORT=3000 -e URL=http://localhost:3000 trapp/krakenexporter 

## Installation (without docker)

Checkout the sources:

    git clone https://github.com/trapp/krakennotifier

Download necessary dependencies:

    cd krakennotifier
    npm install
    bower install

Done! You're ready to run it.

## Running

Just run app.js with node:

    node app.js

Open **http://localhost:3000/** and you're ready to go.

## Configuration

You can specify the host and port as environment variables:

    HOST=127.0.0.1 PORT=3000 URL=http://localhost:3000 node app.js

## License

The MIT License (MIT)

Copyright (c) 2014 Timon Rapp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.