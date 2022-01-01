class Candidate {
	constructor(name, colors) {
		this.name = name;
		this.colors = colors;
		this.voteCount = 0;
		this.probVoteCounts = [0,0,0,0];

		if(colors[0] === colors[1] &&
			colors[0] === colors[2] &&
			colors[0] === colors[3]) {
			this.singleColor = true;
		} else {
			this.singleColor = false;
		}
	}
};

class CandidateManager {
	static initCandidates() {
		CandidateManager.candidates = [];
		CandidateManager.candidates['Tossup'] = CandidateManager.TOSSUP;
	}

	static deleteCandidate() {
		closeAllPopups();
		var candidateid = document.getElementById('candidate-originalName').value;
		for(var index = 0; index < states.length; ++index) {
			var state = states[index];
			// set the candidate to tossup
			if(state.candidate === candidateid) {
				state.setColor('Tossup', 0);
			}
			state.delegates[candidateid] = undefined;
		}

		delete CandidateManager.candidates[candidateid];
		LegendManager.generateLegend();
		countVotes();
		LegendManager.updateLegend();
		ChartManager.updateChart();
	}

	static setCandidate() {
		closeAllPopups();

		const oldname = document.getElementById('candidate-originalName').value;
		const newname = document.getElementById('candidate-name').value;
		const candidate = CandidateManager.candidates[oldname];
		const candidateColorsDom = document.getElementById("editcandidate-colors");
		const newColors = [];
		for(const child of candidateColorsDom.children) {
			newColors.push(child.value);	
		}
		// only rename the property if the name changed
		if(newname !== oldname) {
			Object.defineProperty(CandidateManager.candidates, newname,
			Object.getOwnPropertyDescriptor(CandidateManager.candidates, oldname));
			delete CandidateManager.candidates[oldname];
		}

		candidate.name = newname;
		candidate.colors = newColors;
		
		for(let index = 0; index < states.length; ++index) {
			const state = states[index];
			if(state.candidate === newname) {
				state.setColor(newname, state.colorValue, {setDelegates: false});
			} else if(state.candidate === oldname) {
				state.setColor(newname, state.colorValue, {setDelegates: false});
				state.delegates[newname] = state.delegates[oldname];
				state.delegates[oldname] = undefined;
			}

			if(state.colorValue > candidate.colors.length) {
				state.setColor(newname, 0, {setDelegates: false});
			}
		}

		LegendManager.generateLegend();
		LegendManager.updateLegend();
		ChartManager.updateChart();
	}

	static addCandidate3() {
		const name = document.getElementById("name").value;
		const colors = [];
		const colorsDom = document.getElementById("addcandidate-colors").children;
		for(const colorDom of colorsDom) {
			colors.push(colorDom.value);
		}
		const candidate = new Candidate(name, colors);
		CandidateManager.candidates[name] = candidate;
		verifyPaintIndex();
		LegendManager.generateLegend();
		ChartManager.updateChart();
		LegendManager.updateLegend();
	}

	static addCandidate2(name, colors) {

		if(name === undefined) {
			const nameHTML = document.getElementById('name');
			if(nameHTML !== null) {
				name = nameHTML.value;
			} else {
				name = "Error";
			}
		}

		// ignore white space candidates
		if(name.trim() === '') {
			return;
		}

		const candidate = new Candidate(name, colors);
		CandidateManager.candidates[name] = candidate;

		verifyPaintIndex();
		LegendManager.generateLegend();
		ChartManager.updateChart();
		LegendManager.updateLegend();
	}

	static addCandidate(name, solid, likely, leaning, tilting) {
		if(name === undefined) {
			const nameHTML = document.getElementById('name');
			if(nameHTML !== null) {
				name = nameHTML.value;
			} else {
				name = "Error";
			}
		}

		// ignore white space candidates
		if(name.trim() === '') {
			return;
		}

		if(solid === undefined) {
			const solidHTML = document.getElementById('solid');
			if(solidHTML !== null) {
				solid = solidHTML.value;
			} else {
				solid = '#000000';
			}
		}

		if(likely === undefined) {
			const likelyHTML = document.getElementById('likely');
			if(likelyHTML !== null) {
				likely = likelyHTML.value;
			} else {
				likely = '#000000';
			}
		}

		if(leaning === undefined) {
			const leaningHTML = document.getElementById('leaning');
			if(leaningHTML !== null) {
				leaning = leaningHTML.value;
			} else {
				leaning = '#000000';
			}
		}

		if(tilting === undefined) {
			const tiltingHTML = document.getElementById('tilting');
			if(tiltingHTML !== null) {
				tilting = tiltingHTML.value;
			} else {
				tilting = '#000000';
			}
		}
		
		const candidate = new Candidate(name, [solid, likely, leaning, tilting]);
		CandidateManager.candidates[name] = candidate;

		verifyPaintIndex();
		LegendManager.generateLegend();
		ChartManager.updateChart();
		LegendManager.updateLegend();
	}
	
	static saveCustomColors() {
		const name = document.getElementById('custom-color-name').value;

		const element = document.getElementById("customcolor-colors");
		for(let index = 0; index < element.children.length; index += 1) {
			console.log(index);
			const child = element.children[index];
			CookieManager.appendCookie(name + "-" + index, child.value);
		}
	}

	static setColors(palette) {
		const solid = document.getElementById('solid');
		const likely = document.getElementById('likely');
		const leaning =  document.getElementById('leaning');
		const tilting = document.getElementById('tilting');

		let colors = null;
		switch(palette) {
			case "red":
			colors = [
				"#bf1d29",
				"#ff5865",
				"#ff8b98",
				"#cf8980"
			]
			break;
			case "blue":
			colors = [
				"#1c408c",
				"#577ccc",
				"#8aafff",
				"#949bb3"
			]
			break;
			case "green":
			colors = [
				"#1c8c28",
				"#50c85e",
				"#8aff97",
				"#7a997e"
			]
			break;
			case "yellow":
			colors = [
				"#e6b700",
				"#e8c84d",
				"#ffe78a",
				"#b8a252"
			]
			break;
			case "blue-light":
			colors = [
				"#5555ff",
				"#8080ff",
				"#aaaaff",
				"#d5d5ff"
			]
			break;
			case "red-light":
			colors = [
				"#ff5555",
				"#ff8080",
				"#ffaaaa",
				"#ffd5d5"
			]
			break;
			case "blue-dark":
			colors = [
				"#302e80",
				"#444cc5",
				"#817ffb",
				"#cdd3f7"
			]
			break;
			case "red-dark":
			colors = [
				"#80302e",
				"#cb4b40",
				"#fb817f",
				"#f5c8c4"
			]
			break;
			case "purple":
			colors =[
				"#822194",
				"#ae20c6",
				"#db14ff",
				"#a369ae"
			]
			break;
			case "blue1-interpolation":
			colors = [
				"#0d0596",
				"#2b26a5",
				"#4948b4",
				"#6769c3",
				"#858ad2",
				"#a3abe1",
				"#c1cdf0",
				"#dfeeff"
			]
			break;
			case "blue2-interpolation":
			colors = [
				"#002b84",
				"#234a99",
				"#466aad",
				"#6a89c2",
				"#8da8d6",
				"#b0c8eb",
				"#d3e7ff"
			]
			break;
			case "red1-interpolation":
			colors = [
				"#a80000",
				"#b42021",
				"#c14043",
				"#cd6064",
				"#da8086",
				"#e6a0a7",
				"#f3c0c9",
				"#ffe0ea"
			]
			break;
			case "red2-interpolation":
			colors = [
				"#800000",
				"#952223",
				"#aa4445",
				"#c06668",
				"#d5888b",
				"#eaaaad",
				"#ffccd0"
			]
			break;
			case "democratic1-wiki":
			colors = [
				"#0d0596",
				"#3933e5",
				"#584cde",
				"#6674de",
				"#7996e2",
				"#a5b0ff",
				"#bdd3ff",
				"#dfeeff"
			]
			break;
			case "democratic2-wiki":
			colors = [
				"#002b84",
				"#0645b4",
				"#1666cb",
				"#4389e3",
				"#86b6f2",
				"#b9d7ff",
				"#d3e7ff"
			]
			break;
			case "republican1-wiki":
			colors = [
				"#a80000",
				"#c21b18",
				"#d72f30",
				"#d75d5d",
				"#e27f7f",
				"#ffb2b2",
				"#ffc8cd",
				"#ffe0ea"
			]
			break;
			case "republican2-wiki":
			colors = [
				"#800000",
				"#aa0000",
				"#d40000",
				"#cc2f4a",
				"#e27f90",
				"#f2b3be",
				"#ffccd0"
			]
			break;
			case "dixiecrat-wiki":
			colors = [
				"#aa4400",
				"#d45500",
				"#ff6600",
				"#ff7f2a",
				"#ff9955",
				"#ffb380",
				"#ffccaa"
			]
			break;
			case "unpledged-wiki":
			colors = [
				"#be9600",
				"#daae00",
				"#f4c200",
				"#ffdc43",
				"#ffe680",
				"#ffeeaa"
			]
			break;
			default:
				/*
			colors = [
				CookieManager.cookies[palette + "solid"],
				CookieManager.cookies[palette + "likely"],
				CookieManager.cookies[palette + "leaning"],
				CookieManager.cookies[palette + "tilting"]
			]
			*/
			colors = [];
			let number = 0;
			while(CookieManager.cookies[palette + "-" + number]) {
				colors.push(CookieManager.cookies[palette + "-" + number]);
				number += 1;
			}
			break;
		}

		const colorsDom = document.getElementById("addcandidate-colors");
		while(colorsDom.firstChild) {
			colorsDom.removeChild(colorsDom.firstChild);
		}
		for(const color of colors) {
			const colorDom = document.createElement("input");
			colorDom.classList.add("addcandidate-color");
			colorDom.value = color;
			colorDom.type = "color";
			colorsDom.appendChild(colorDom);
		}
	}
}

CandidateManager.candidates = [];
CandidateManager.tossupColor = 2;
CandidateManager.TOSSUP = new Candidate('Tossup', ['#000000', '#ffffff', '#696969', '#000000']);
