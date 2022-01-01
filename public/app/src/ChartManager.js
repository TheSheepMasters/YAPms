class ChartManager {
	static initChart() {
		Chart.register(ChartDataLabels);
		Chart.defaults.font.color = '#ffffff';
		ChartManager.chartOptions = {
			indexAxis: 'y',
			plugins: {
				datalabels: {
					display: function(context) {
						return context.dataset.data[context.dataIndex] !== 0;
					},
					backgroundColor: 'white',
					borderColor: 'black',
					color: 'black',
					font: {
						family: 'Roboto',
						size: 15,
						weight: 600 
					}
				},
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				}
			}
		}

		ChartManager.chartBarScales = {
			x: {
				stacked: true,
				grid: {
					display: false,
					drawBorder: false
				},
				ticks: {
					color: '#fff',
					font: {
						family: 'Roboto',
						size: 13
					}
				}
			},
			y: {
				stacked: true,
				grid: {
					display: false,
					drawBorder: false
				},
				ticks: {
					color: '#fff',
					font: {
						family: 'Roboto',
						size: 13
					}
				}
			}
		}

		ChartManager.chartPieScales = {
			grid: {
				display: false
			}
		}

		ChartManager.chartOptions.scales = ChartManager.chartPieScales;
		const ctx = document.getElementById('chart-canvas').getContext('2d');
		ctx.height = 200;

		// create the chart
		ChartManager.chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels:[],
				datasets: [{
					label: "",
					backgroundColor: '#ffffff',
					borderColor: '#ffffff',
					borderWidth: 0,
					data:[]
				}, {
					label: "",
					backgroundColor: '#ffffff',
					borderColor: '#ffffff',
					borderWidth: 0,
					data:[]
				}, {}, {}],
			},
			options: ChartManager.chartOptions,
			maintainAspectRatio: true
		});

		ChartManager.chartType = 'doughnut';
	}

	// dynamically change the chart from one form to another
	static setChart(type, position) {
		console.log('Chart Manager: ' + type);
		var sidebar = document.getElementById('chart-div');
		var chartHTML = document.getElementById('chart');
		var html = document.getElementById('chart-canvas');
		var ctx = html.getContext('2d');
		var battlechart = document.getElementById('battlechart');
		chartHTML.style.display = 'inline-block';
		battlechart.style.display = 'none';
		sidebar.style.display = 'flex';
		
		sidebar.style.width = '28vw';

		if(type === 'none') {
			html.style.display = 'none';

			unsetBattleHorizontal();
			sidebar.style.display = 'none';

			ChartManager.chartType = type;
			MapManager.centerMap();
			return;
		} else if(type === 'horizontalbattle' || type === 'verticalbattle') {
			if(Object.keys(CandidateManager.candidates).length > 3) {
				displayNotification('Sorry',
					'This chart requires that there be two candidates');
				return;
			}
			
			if(type === 'horizontalbattle') {
				setBattleHorizontal();
				let logo = document.getElementById('logo-div');
				logo.style.width = '15%';
				logo.style.height = '100%';

				sidebar.style.borderRight = '0px';
				sidebar.style.borderTop = '1px solid black';

				logo = document.getElementById('yapms-watermark');
				logo.style.width = '15%';
				logo.style.height = '100%';
			} else if(type === 'verticalbattle') {
				unsetBattleHorizontal();
				sidebar.style.width = '20vw';	
				let logo = document.getElementById('logo-div');
				logo.style.width = '100%';
				logo.style.height = '15%';
				sidebar.style.borderTop = '0px';
				sidebar.style.borderRight = '1px solid black';
				
				logo = document.getElementById('yapms-watermark');
				logo.style.width = '100%';
				logo.style.height = '15%';
			}

			html.style.display = 'none';
			chartHTML.style.display = 'none';
			battlechart.style.display = 'flex';
			ChartManager.chartType = type;
			ChartManager.updateChart();
			MapManager.centerMap();
			return;
		} 
		
		unsetBattleHorizontal();

		ChartManager.chartPosition = position;	
		if(position === 'bottom') {
			var application = document.getElementById('application');
			application.style.flexDirection = 'column-reverse';
			
			var map = document.getElementById('map-div');
			map.style.height = '80%';

			//var sidebar = document.getElementById('chart-div');
			sidebar.style.flexDirection = 'row';
			sidebar.style.width = '100%';	
			sidebar.style.height = '20%';
			sidebar.style.borderRight = '0px';
			sidebar.style.borderTop = '1px solid black';
		
			var charthtml = document.getElementById('chart');
			charthtml.style.height = 'auto';
			charthtml.style.width = '' + (sidebar.offsetHeight - 5) + 'px';

			var logo = document.getElementById('logo-div');
			logo.style.width = '15%';
			logo.style.height = '100%';
			logo = document.getElementById('yapms-watermark');
			logo.style.width = '15%';
			logo.style.height = '100%';
		} else {
			var application = document.getElementById('application');
			application.style.flexDirection = 'row';

			var map = document.getElementById('map-div');
			map.style.height = '100%';

			//var sidebar = document.getElementById('chart-div');
			sidebar.style.flexDirection = 'column';
			sidebar.style.width = '28vw';	
			sidebar.style.height = '100%';
			sidebar.style.borderTop = '0px';
			sidebar.style.borderRight = '1px solid black';
			
			var charthtml = document.getElementById('chart');
			charthtml.style.width = '100%';
			
			var logo = document.getElementById('logo-div');
			logo.style.width = '100%';
			logo.style.height = '15%';
			logo = document.getElementById('yapms-watermark');
			logo.style.width = '100%';
			logo.style.height = '15%';
		}

		MapManager.centerMap();
			
		ChartManager.chartType = type;
		
		ChartManager.chartData = {
			labels:[],
			datasets: [{
				borderColor: ChartManager.chartBorderColor,
				borderWidth: ChartManager.chartBorderWidth,
				data:[]
			}]
		};

		html.style.display = 'inline-block';

		// set the proper scales
		if(type === 'horizontalBar') {
			ChartManager.chartOptions.scales = ChartManager.chartBarScales;
			delete ChartManager.chartOptions.scale;
			// horizontal bar needs multiple datasets
			for(let i = 0; i < 3; ++i) {
				ChartManager.chartData.datasets.push({
					borderColor: ChartManager.chartBorderColor,
					borderWidth: ChartManager.chartBorderWidth,
					data:[]
				});
			}
		} else if(type === 'pie' || type === 'doughnut') {
			ChartManager.chartOptions.scales = ChartManager.chartPieScales;
			delete ChartManager.chartOptions.scale;
		}

		ChartManager.chart.destroy();
		ChartManager.chart = new Chart(ctx, {type: type === "horizontalBar" ? "bar" : type, data: ChartManager.chartData, options: ChartManager.chartOptions});
		ChartManager.updateChart();
	}

	static rebuildChart() {
		const canvas = document.getElementById('chart-canvas');
		const ctx = canvas.getContext('2d');
		ChartManager.chart.destroy();
		ChartManager.chart = new Chart(ctx, {
			type: ChartManager.chart.config.type, 
			data: ChartManager.chartData, 
			options: ChartManager.chartOptions
		});
		
		// dont display the chart if its a battle chart
		if(ChartManager.chartType === 'battle') {	
			const chartcontainer = document.getElementById('chart');
			chartcontainer.style.display = 'none';
		}

		ChartManager.updateChart();
	}

	// updates the information of the chart (so the numbers change)
	static updateChart() {
		if(ChartManager.chartType === 'verticalbattle' ||
			ChartManager.chartType === 'horizontalbattle') {
			ChartManager.updateBattleChart();
			return;
		} else if(ChartManager.chartType === 'horizontalBar') {
			ChartManager.updateBarChart();
		} else {
			ChartManager.updateNonRadarChart();	
		}

		ChartManager.chart.config.data = ChartManager.chartData;
		ChartManager.chart.update();
	}

	static updateBarChart() {
		ChartManager.chartData.labels = [];
		ChartManager.chartData.datasets[0].data = [];
		ChartManager.chartData.datasets[0].backgroundColor = [];
		ChartManager.chartData.datasets[1].data = [];
		ChartManager.chartData.datasets[1].backgroundColor = [];
		ChartManager.chartData.datasets[2].data = [];
		ChartManager.chartData.datasets[2].backgroundColor = [];
		ChartManager.chartData.datasets[3].data = [];
		ChartManager.chartData.datasets[3].backgroundColor = [];
		
		// each label is a candidate
		for(var key in CandidateManager.candidates) {
			ChartManager.chartData.labels.push(key);
		}

		if(ChartManager.chartLeans) {
			for(let probIndex = 0; probIndex < 4; ++probIndex) {
				for(const key in CandidateManager.candidates) {
					const candidate = CandidateManager.candidates[key];
					const count = candidate.probVoteCounts[probIndex];
					ChartManager.chartData.datasets[probIndex].data.push(count);
					const color = candidate.colors[probIndex];
					ChartManager.chartData.datasets[probIndex].backgroundColor.push(color);
				}
			}
		} else {
			for(const key in CandidateManager.candidates) {
				const candidate = CandidateManager.candidates[key];
				const count = candidate.voteCount;
				ChartManager.chartData.datasets[0].data.push(count);
				if(key === 'Tossup') {
					const color = candidate.colors[2];
					ChartManager.chartData.datasets[0].backgroundColor.push(color);

				} else {
					const color = candidate.colors[0];
					ChartManager.chartData.datasets[0].backgroundColor.push(color);
				}
			}
		}
	}

	static updateNonRadarChart() {
		ChartManager.chartData.labels = [];

		ChartManager.chartData.datasets[0].data = [];
		ChartManager.chartData.datasets[0].backgroundColor = [];
		ChartManager.chartData.datasets[0].borderColor = ChartManager.chartBorderColor;
		ChartManager.chartData.datasets[0].borderWidth = ChartManager.chartBorderWidth;

		let candidateIndex = -1;
		for(const key in CandidateManager.candidates) {
			++candidateIndex;
			const candidate = CandidateManager.candidates[key];
			const name = candidate.name;
			const voteCount = candidate.voteCount;
			let color = candidate.colors[0];
			if(candidateIndex == 0) {
				color = CandidateManager.candidates['Tossup'].colors[CandidateManager.tossupColor];
				ChartManager.chartData.labels[0] = 'Tossup';
				ChartManager.chartData.datasets[0].data[0] = voteCount;
				ChartManager.chartData.datasets[0].backgroundColor.push(color);
			} else if(ChartManager.chartLeans) {
				for(let probIndex = 0; probIndex < 8; ++probIndex) {
					const count = candidate.probVoteCounts[probIndex];
					console.log(candidate.probVoteCounts);
					color = candidate.colors[probIndex];
					const index = (probIndex + (candidateIndex * 8)) - 7;
					ChartManager.chartData.labels[index] = name;
					ChartManager.chartData.datasets[0].data[index] = count;
					ChartManager.chartData.datasets[0].backgroundColor.push(color);
				}
			} else {
				const count = candidate.voteCount;
				color = candidate.colors[0];
				ChartManager.chartData.labels[candidateIndex] = name;
				ChartManager.chartData.datasets[0].data[candidateIndex] = count;
				ChartManager.chartData.datasets[0].backgroundColor.push(color);
			}
		}
	}

	static updateBattleChart() {

		if(Object.keys(CandidateManager.candidates).length > 3) {
			if(mobile) {
				ChartManager.setChart('pie', 'bottom');
			} else {
				ChartManager.setChart('pie');
			}

			return;
		}

		var tossup = document.getElementById('tossupbar');

		var topbar = document.getElementById('topbar');
		var topbarSolid = document.getElementById('topbar-solid');
		var topbarLikely = document.getElementById('topbar-likely');
		var topbarLean = document.getElementById('topbar-lean');
		var topbarTilt = document.getElementById('topbar-tilt');

		var bottombar = document.getElementById('bottombar');
		var bottombarSolid = document.getElementById('bottombar-solid');
		var bottombarLikely = document.getElementById('bottombar-likely');
		var bottombarLean = document.getElementById('bottombar-lean');
		var bottombarTilt = document.getElementById('bottombar-tilt');

		// this is for when the candidates get removed
		// if a candidate gets removed, it will not get cleared from
		// the graph in the loop below
		topbar.style.flexBasis = '';
		bottombar.style.flexBasis = '';

		var candidateIndex = -1;
		for(var key in CandidateManager.candidates) {
			++candidateIndex;

			var candidate = CandidateManager.candidates[key];

			if(candidateIndex == 0) {
				tossup.style.background = candidate.colors[2];
				
				tossup.style.flexBasis = '' + (candidate.voteCount / totalVotes) * 100 + '%';
				if(ChartManager.chartLabels) {
					tossup.innerHTML = '<p>' + candidate.voteCount + '</p>';
				} else {
					tossup.innerHTML = '<p></p>';
				}
			} else if(candidateIndex == 1) {
				topbar.style.flexBasis = '' + 
					(candidate.voteCount / totalVotes) * 100 + '%';
				if(ChartManager.chartLeans) {
					topbarSolid.style.flexBasis = '' + 
						(candidate.probVoteCounts[0] / candidate.voteCount) * 100 + '%';
					topbarSolid.style.background = candidate.colors[0];

					topbarLikely.style.flexBasis = '' + 
						(candidate.probVoteCounts[1] / candidate.voteCount) * 100 + '%';
					topbarLikely.style.background = candidate.colors[1];

					topbarLean.style.flexBasis = '' + 
						(candidate.probVoteCounts[2] / candidate.voteCount) * 100 + '%';
					topbarLean.style.background = candidate.colors[2];

					topbarTilt.style.flexBasis = '' +
						(candidate.probVoteCounts[3] / candidate.voteCount) * 100 + '%';
					topbarTilt.style.background = candidate.colors[3];
					
					if(ChartManager.chartLabels) {
						topbarSolid.innerHTML = '<p>'+candidate.probVoteCounts[0]+'</p>';
						topbarLikely.innerHTML = '<p>'+candidate.probVoteCounts[1]+'</p>';
						topbarLean.innerHTML = '<p>'+candidate.probVoteCounts[2]+'</p>';
						topbarTilt.innerHTML = '<p>' + candidate.probVoteCounts[3] + '</p>';
					} else {
						topbarSolid.innerHTML = '<p></p>';
						topbarLikely.innerHTML = '<p></p>';
						topbarLean.innerHTML = '<p></p>';
						topbarTilt.innerHTML = '<p></p>';
					}
				} else {
					topbarSolid.style.flexBasis = '100%'; 
					topbarSolid.style.background = candidate.colors[0];
					topbarLikely.style.flexBasis = '0%';
					topbarLikely.style.background = candidate.colors[1];
					topbarLean.style.flexBasis = '0%'; 
					topbarLean.style.background = candidate.colors[2];
					topbarTilt.style.flexBasis = '0%';
					topbarTilt.style.background = candidate.colors[3];

					if(ChartManager.chartLabels) {
						topbarSolid.innerHTML = '<p>' + (
							candidate.probVoteCounts[0] 
							+ candidate.probVoteCounts[1]
							+ candidate.probVoteCounts[2]
							+ candidate.probVoteCounts[3]) + '</p>';
						topbarLikely.innerHTML = '<p></p>';
						topbarLean.innerHTML = '<p></p>';
						topbarTilt.innerHTML = '<p></p>';
					} else {
						topbarSolid.innerHTML = '<p></p>';
						topbarLikely.innerHTML = '<p></p>';
						topbarLean.innerHTML = '<p></p>';
						topbarTilt.innerHTML = '<p></p>';
					}
				}

			} else if(candidateIndex == 2) {
				bottombar.style.flexBasis = '' + 
					(candidate.voteCount / totalVotes) * 100 + '%';
				if(ChartManager.chartLeans) {
					bottombarSolid.style.flexBasis = '' + 
						(candidate.probVoteCounts[0] / candidate.voteCount) * 100 + '%';
					bottombarSolid.style.background = candidate.colors[0];

					bottombarLikely.style.flexBasis = '' + 
						(candidate.probVoteCounts[1] / candidate.voteCount) * 100 + '%';
					bottombarLikely.style.background = candidate.colors[1];

					bottombarLean.style.flexBasis = '' + 
						(candidate.probVoteCounts[2] / candidate.voteCount) * 100 + '%';
					bottombarLean.style.background = candidate.colors[2];
					
					bottombarTilt.style.flexBasis = '' +
						(candidate.probVoteCounts[3] / candidate.voteCount) * 100 + '%';
					bottombarTilt.style.background = candidate.colors[3];

					if(ChartManager.chartLabels) {
						bottombarSolid.innerHTML = '<p>'+candidate.probVoteCounts[0]+'</p>';
						bottombarLikely.innerHTML = '<p>'+candidate.probVoteCounts[1]+'</p>';
						bottombarLean.innerHTML = '<p>'+candidate.probVoteCounts[2]+'</p>';
						bottombarTilt.innerHTML = '<p>' + candidate.probVoteCounts[3] + '</p>';
					} else {
						bottombarSolid.innerHTML = '<p></p>';
						bottombarLikely.innerHTML = '<p></p>';
						bottombarLean.innerHTML = '<p></p>';
						bottombarTilt.innerHTML = '<p></p>';
					}
				} else {	
					bottombarSolid.style.flexBasis = '100%';
					bottombarSolid.style.background = candidate.colors[0];
					bottombarLikely.style.flexBasis = '0%';
					bottombarLikely.style.background = candidate.colors[1];
					bottombarLean.style.flexBasis = '0%'; 
					bottombarLean.style.background = candidate.colors[2];
					bottombarTilt.style.flexBasis = '0%';
					bottombarTilt.style.background = candidate.colors[3];

					if(ChartManager.chartLabels) {
						bottombarSolid.innerHTML = '<p>' + (
							candidate.probVoteCounts[0] 
							+ candidate.probVoteCounts[1]
							+ candidate.probVoteCounts[2]
							+ candidate.probVoteCounts[3]) + '</p>';
						bottombarLikely.innerHTML = '<p></p>';
						bottombarLean.innerHTML = '<p></p>';
						bottombarTilt.innerHTML = '<p></p>';
					} else {
						bottombarSolid.innerHTML = '<p></p>';
						bottombarLikely.innerHTML = '<p></p>';
						bottombarLean.innerHTML = '<p></p>';
						bottombarTilt.innerHTML = '<p></p>';
					}
				}
			}
		}
	}

	static toggleChartLabels() {
		ChartManager.chartLabels = !ChartManager.chartLabels;
		if(ChartManager.chartOptions.plugins.datalabels.display != false) {
			ChartManager.chartOptions.plugins.datalabels.display = false;
		} else {
			ChartManager.chartOptions.plugins.datalabels.display = function(context) {
				return context.dataset.data[context.dataIndex] !== 0;
			}
		}

		ChartManager.rebuildChart();
	}

	static toggleChartLeans() {
		ChartManager.chartLeans = !ChartManager.chartLeans;
		ChartManager.rebuildChart();
		ChartManager.updateBattleChart();
	}
}

ChartManager.chart = null;
ChartManager.chartBorderWidth = 2;
ChartManager.chartBorderColor = '#000000';
ChartManager.chartData = {
	labels:[],
	datasets: [{
		label: "",
		backgroundColor: [],
		borderColor: ChartManager.chartBorderColor,
		borderWidth: ChartManager.chartBorderWidth,
		data:[]
	}, {}, {}, {}]
}
ChartManager.chartOptions = null;
ChartManager.chartType = null;
ChartManager.chartPosition = null;
ChartManager.chartPieScales = null;
ChartManager.chartBarScales = null;

ChartManager.chartLeans = true;
ChartManager.chartLabels = true;
