"use strict"

perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler("render")

var cell = {
	$cell: true,
	id: 'app',
	_databases: [],
	$init: function() {
		this._update();
	},
	$update: function() {
		this.querySelector('#tableData').$components = this._databases.map(this._generateTableData)
	},
	_update: function() {
		requestAnimationFrame(this._update)

		perfMonitor.startProfile("render")
		this._databases = ENV.generateData().toArray()
		perfMonitor.endProfile("render")
	},
	$components: [{$type: 'table', class: 'table table-striped latest-data', $components: [
			{$type: 'tbody', id: 'tableData'}
		]}
	],
	_generateTableData: function(db) {
		return {$type: 'tr', $components: [
			{$type: 'td', class: 'dbname', $text: db.dbname},
			{$type: 'td', class: 'query-count', $components: [
				{$type: 'span', class: db.lastSample.countClassName, $text: db.lastSample.nbQueries}
			]},
			db.lastSample.topFiveQueries.map(function(q) {
				return {$type: 'td', class: q.elapsedClassName, $text: q.formatElapsed, $components: [
					{$type: 'div', class: 'popover left', $components: [
						{$type: 'div', class: 'popover-content', $text: q.query},
						{$type: 'div', class: 'arrow',}
					]}
				]}
			})
		]}

	}
}
