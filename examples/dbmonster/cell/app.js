var renderStage = 0
perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler("render")

var cell = {
	$cell: true,
	$type: 'div',
	_databases: [],
	$init: function() {
		requestAnimationFrame(this.update.bind(this))
		this._databases = ENV.generateData().toArray()

		if (renderStage === 0) {
			renderStage = 1
			perfMonitor.startProfile('render')
		}
	},
	$update: function() {
		if (renderStage === 1) {
			renderStage = 0
			perfMonitor.endProfile('render')
		}
	},
	$components: [
		{
			$type: 'table',
			class: 'table table-striped latest-data',
			$components: [
				{
					$type: 'tbody',
					$components: [
						{
							$type: 'tr',
							$components: _databases.map(this._tableData).pop()
						}
					]
				}
			]
		}
	],
	_tableData: function(db) {
		return [
			{
				$type: 'td',
				class: 'dbname',
				$text: db.dbname,
			},
			{
				$type: 'td',
				class: 'query-count',
				$text: db.dbname,
				$components: [
					{
						$type: 'span',
						$text: db.lastSample.nbQueries,
						class: db.lastSample.countClassName
					}
				]
			},
		].concat(db.lastSample.topFiveQueries.map(this._topFiveQueries))

	},
	_topFiveQueries: function(q) {
		return {
			$type: 'td',
			class: q.elapsedClassName,
			$text: q.formatElapsed,
			$components: [
				{
					$type: 'div',
					class: 'popover left',
					$components: [
						{
							$type: 'div',
							class: 'popover-content',
							$text: q.query
						},
						{
							$type: 'div',
							class: 'arrow',
						}
					]
				}
			]
		}
	}
}
