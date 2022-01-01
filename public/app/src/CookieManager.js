class CookieManager {
	static appendCookie(key, value) {
		if(CookieManager.consent === false) {
			console.log('Cookie Manager: no consent');
			return;
		}

		CookieManager.cookies[key] = value;
		var cookie = "";
		var expire = new Date(Date.now() + 60 * 1000 * 60 * 12 * 7 * 100).toString();
		cookie = key + '=' + CookieManager.cookies[key] + '; expires=' + expire + ';';
		document.cookie = cookie;
		console.log('Append cookie: key=' + key + ' value=' + value);
	}

	static loadCookies() {
		// preload all color cookies with black
		/*
		for(var i = 1; i < 11; ++i) {
			CookieManager.cookies['custom' + i + 'solid'] = '#000000';
			CookieManager.cookies['custom' + i + 'likely'] = '#000000';
			CookieManager.cookies['custom' + i + 'leaning'] = '#000000';
			CookieManager.cookies['custom' + i + 'tilting'] = '#000000';
		}
		*/
		CookieManager.cookies['theme'] = 'default';
		const decode = decodeURIComponent(document.cookie);
		const loadedCookies = decode.split('; ');
		for(let index in loadedCookies) {
			const cookie = loadedCookies[index].split('=');
			const key = cookie[0];
			const result = cookie[1]
			CookieManager.cookies[key] = result;
		}
	}

	static loadCustomColors() {
		for(let buttonIndex = 1; buttonIndex <= 10; buttonIndex += 1) {
			let button = document.getElementById("custom" + buttonIndex + "button");
			if(CookieManager.cookies["custom" + buttonIndex + "-0"]) {
				//button.style.background = "#ff0000";
				let style = "linear-gradient(to right,";
				let colorIndex = 0;
				while(CookieManager.cookies["custom" + buttonIndex + "-" + colorIndex]) {
					console.log(colorIndex);
					style += " " + CookieManager.cookies["custom" + buttonIndex + "-" + colorIndex] + ",";
					colorIndex += 1;
				}
				style = style.slice(0, -1);
				style += ")";
				button.style.background = "green";
				console.log(style);
				button.style.background = style;
				console.log(button.style.background);
				console.log(style);
			} else {
				button.style.background = "#000000";
			}
			/*
			button.style.background = 'linear-gradient(to right,';
			while(CookieManager.cookies['custom' + index  + "-" + ]
				CookieManager.cookies['custom' + index + 'solid'] + ',' +
				CookieManager.cookies['custom' + index + 'likely'] + ',' +
				CookieManager.cookies['custom' + index + 'leaning'] + ',' +
				CookieManager.cookies['custom' + index + 'tilting'] + ')';
				*/
		}
	}

	static askConsent() {
		/* If Consent Has Already Been Denied */
		if(CookieManager.cookies['consent'] === "false") {
			CookieManager.consent = false;
			CookieManager.consentDenied();
			return;
		/* If Consent Has Already Been Given */
		} else if(CookieManager.cookies['consent'] === "true") {
			CookieManager.consent = true;
			CookieManager.consentGiven();
			return;
		}
		
		/* Auto Consent */
		CookieManager.consent = true;
		CookieManager.consentGiven();
	}

	static consentDenied(reload) {
		var consentPopup = document.getElementById('consent');
		consentPopup.style.display = 'none';
		
		/* Set Consent Cookie to False */
		CookieManager.consent = true;
		CookieManager.appendCookie("consent", false);
		CookieManager.consent = false;

		/* If Reload Requested */	
		if(reload) {
			location.reload();
		}
	
		/* Load Non-Personalized Adsense */
		// (adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
		// (adsbygoogle = window.adsbygoogle || []).pauseAdRequests = 0;
	}

	static consentGiven() {
		var consentPopup = document.getElementById('consent');
		consentPopup.style.display = 'none';
		
		/* Set Consent Cookie to True */
		CookieManager.consent = true;
		CookieManager.appendCookie("consent", true);

		/* Load Personalized Adsense */
		// (adsbygoogle = window.adsbygoogle || []).pauseAdRequests = 0;
	}
}

CookieManager.cookies = {};
CookieManager.consent = false;
