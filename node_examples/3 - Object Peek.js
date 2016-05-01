var qsocks = require('qsocks')
var fs = require('fs')

qsocks.Connect()
.then(function(global) {
	return global.openDoc('Helpdesk Management.qvf')
})
.then(function(app) {
	return app.getObject('1ff88551-9c4d-41e0-b790-37f4c11d3df8')
})
.then(function(object) {
	return object.getFullPropertyTree().then(function(properties) {
		return object.getLayout().then(function(layout) {
			fs.writeFileSync('objectlayout.json', JSON.stringify(layout, null, 4), 'utf8')
			fs.writeFileSync('objectproperties.json', JSON.stringify(properties, null, 4), 'utf8')
			console.log('Done')
		})
	})
})
.catch(function(err) {
	console.log(err)
})