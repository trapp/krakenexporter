var exporter;
exports.inject = function (ex) {
    exporter = ex;
};

/*
 * GET home page.
 */
exports.index = function(req, res){
    if (req.method == 'POST') {
        req.checkBody('key', 'It looks like you forgot to enter your api key.').notEmpty();
        req.checkBody('secret', 'It looks like you forgot to enter your api secret.').notEmpty();

        var values = req.body || {};
        var errors = req.validationErrors(true) || {};
        if (Object.keys(errors).length > 0) {
            res.render('index', { errors: errors, values: values});
        } else {
            exporter.startExport(values.key, values.secret, function(error, id) {
                if (error) {
                    errors['key'] = {
                        'msg': error.message
                    };
                    res.render('index', { title: 'Export your Kraken history', errors: errors, values: values});
                } else {
                    res.redirect('/status/' + id);
                }
            });
        }
    } else {
        res.render('index', { title: 'Export your Kraken history' });
    }
};

exports.status = function(req, res) {
    var id = req.params.id;
    var ex = exporter.get(id);
    res.render('status', { title: 'Export ' + id, id: id, count: ex.trades.length, total: ex.total });
};