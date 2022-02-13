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
		ChartManager.chartData.datasets = [];

		for(let key in CandidateManager.candidates) {
			ChartManager.chartData.labels.push(key);
		}

		if(ChartManager.chartLeans) {
			let maxColorCount = 0;
			for(const key in CandidateManager.candidates) {
				const candidate = CandidateManager.candidates[key];
				if(candidate.colors.length > maxColorCount) {
					maxColorCount = candidate.colors.length;
				}
			}

			for(const key in CandidateManager.candidates) {
				const candidate = CandidateManager.candidates[key];
				for(let probIndex = 0; probIndex < /*candidate.colors.length*/ maxColorCount; ++probIndex) {
					if(ChartManager.chartData.datasets[probIndex] === undefined) {
						ChartManager.chartData.datasets.push({});
						ChartManager.chartData.datasets[probIndex].data = [];
						ChartManager.chartData.datasets[probIndex].backgroundColor = [];
					}
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
				if(ChartManager.chartData.datasets[0] === undefined) {
					ChartManager.chartData.datasets[0] = {};
					ChartManager.chartData.datasets[0].data = [];
					ChartManager.chartData.datasets[0].backgroundColor = [];
				}
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
				ChartManager.chartData.datasets[0].data.push(voteCount);
				ChartManager.chartData.datasets[0].backgroundColor.push(color);
			} else if(ChartManager.chartLeans) {
				for(let probIndex = 0; probIndex < candidate.colors.length; ++probIndex) {
					const count = candidate.probVoteCounts[probIndex];
					color = candidate.colors[probIndex];
					const index = (probIndex + (candidateIndex * 8)) - 7;
					ChartManager.chartData.labels[index] = name;
					ChartManager.chartData.datasets[0].data.push(count);
					ChartManager.chartData.datasets[0].backgroundColor.push(color);
				}
			} else {
				const count = candidate.voteCount;
				color = candidate.colors[0];
				ChartManager.chartData.labels[candidateIndex] = name;
				ChartManager.chartData.datasets[0].data.push(count);
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

		let candidateIndex = -1;
		for(const candidateKey in CandidateManager.candidates) {
			candidateIndex += 1;
			const candidate = CandidateManager.candidates[candidateKey];

			if(candidateKey === "Tossup") {
				const tossup = document.getElementById('bar-0');
				tossup.style.background = candidate.colors[2];
				tossup.style.flexBasis = '' + (candidate.voteCount / totalVotes) * 100 + '%';
				if(ChartManager.chartLabels) {
					tossup.innerHTML = '<p>' + candidate.voteCount + '</p>';
				} else {
					tossup.innerHTML = '<p></p>';
				}
				continue;
			}

			const bar = document.getElementById("bar-" + candidateIndex);
			bar.style.flexBasis = "" + (candidate.voteCount / totalVotes) * 100 + "%";
			const toRemove = [];
			for(const part of bar.children) {
				const spot = parseInt(part.id.split("-")[1]);
				if(spot >= candidate.colors.length) {
					toRemove.push(part);
				}
			}
			for(const part of toRemove) {
				bar.removeChild(part);
			}
			if(ChartManager.chartLeans) {
				for(const index in candidate.colors) {
					let part = document.getElementById(candidateIndex + "-" + index);
					if(part === null) {
						part = document.createElement("div");
						part.classList.add("bar-part");
						part.id = candidateIndex + "-" + index;
						switch(candidateIndex) {
							case 1:
							bar.appendChild(part);
								break;
							case 2:
							bar.insertBefore(part, bar.firstChild);
								break;
						}
					}
					part.style.flexBasis = "" + ((candidate.probVoteCounts[index] || 0) / candidate.voteCount) * 100 + "%";
					part.style.background = candidate.colors[index];
					if(ChartManager.chartLabels) { 
						part.innerHTML = "<p>" + (candidate.probVoteCounts[index] || 0) + "</p>";
					} else {
						part.innerHTML = "<p></p>";
					}
				}
			} else {
				for(const index in candidate.colors) {
					const part = document.getElementById(candidateIndex + "-" + index);
					if(part) {
						if(index === "0") {
							part.style.flexBasis = "100%";
							part.style.background = candidate.colors[0];
							if(ChartManager.chartLabels) { 
								part.innerHTML = "<p>" + candidate.probVoteCounts.reduce((a,b) => a + b, 0) + "</p>";
							} else {
								part.innerHTML = "<p></p>";
							}
						}  else {
							part.style.flexBasis = "0%";
							part.style.background = candidate.colors[0];
							part.innerHTML = "<p></p>";
						}
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
