function Export() {
    this.finished = false;
    this.filename = '';
    this.total = null;
    this.id = '';
    this.key = '';
    this.secret = '';
    this.startTime = ((new Date()).getTime()/1000).toFixed(0);
    this.trades = [];
    this.error = null;
}

module.exports = Export;