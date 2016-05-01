const qsocks = require('qsocks');
const Promise = require('bluebird');
const fs = require('fs-extra');
const json2csv = require('json2csv');

var config = {
    isSecure: true,
    host: 'demos.qlik.com',
    port: 4747,
    headers: {
        'X-Qlik-User': 'UserDirectory=Internal;UserId=sa_repository'
    },
    cert: fs.readFileSync('./certs/demo/client.pem'),
    key: fs.readFileSync('./certs/demo/client_key.pem'),
    rejectUnauthorized: false
};

qsocks.Connect(config).then((global) => {
    return global.getDocList().then((doclist) => {
        return doclist.map((d) => ({ id: d.qDocId, name: d.qTitle }))
    })
})
.then(function (list) {
    return Promise.map(list, (d, i) => {
        var c = config;
        c.appname = d.id;

        return qsocks.Connect(c)
            .then((global) => global.openDoc(d.id, '', '', '', true))
            .then((app) => app.getAllInfos())
            .then((objectlist) => list[i].objects = objectlist)
    }, { concurrency: 20 })
    .then(() => list)
})
.then(function (list) {

    var newlist = [];
    list.forEach((d) => {
        d.objects.qInfos.forEach((c) => {
            newlist.push({
                id: d.id,
                name: d.name,
                objType: c.qType,
                objId: c.qId
            })
        })
    });

    json2csv({ data: newlist, fields: ['name', 'id', 'objId', 'objType'] }, (err, csv) => {
        if (err) return err;
        fs.writeFile('objectaudit.csv', csv, (err) => {
            if (err) throw err;
            process.exit(1);
        });
    });
    
})
.catch(function (err) {
    console.log(err);
})