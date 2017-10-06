/*!
Unobtrusive Announce, functionality excerpted from AccDC API - 3.3 (12/15/2016)
Copyright 2010-2017 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	// Offscreen text CSS rules
	var sraCSS =
					{
					position: 'absolute',
					clip: 'rect(1px 1px 1px 1px)',
					clip: 'rect(1px, 1px, 1px, 1px)',
					clipPath: 'inset(50%)',
					padding: 0,
					border: 0,
					height: '1px',
					width: '1px',
					overflow: 'hidden',
					whiteSpace: 'nowrap'
					};

	window.announce = function(str, noRepeat, aggr){
		if (typeof str !== 'string')
			str = getText(str);
		return String.prototype.announce.apply(str,
						[
						str,
						null,
						noRepeat,
						aggr
						]);
	};

	String.prototype.announce = function announce(strm, loop, noRep, aggr){
	if (String.announce.loaded){
		if (!String.announce.liveRendered && !aggr && String.announce.placeHolder){
			String.announce.liveRendered = true;
			document.body.appendChild(String.announce.placeHolder);
		}

		if (!String.announce.alertRendered && aggr && String.announce.placeHolder2){
			String.announce.alertRendered = true;
			document.body.appendChild(String.announce.placeHolder2);
		}
	}

	if (strm && strm.nodeName && strm.nodeType === 1)
		strm = getText(strm);
	var obj = strm || this, str = strm ? strm : this.toString();

	if (typeof str !== 'string')
		return obj;

	if (!loop && inArray(str, String.announce.alertMsgs) === -1)
		String.announce.alertMsgs.push(str);

	if ((String.announce.alertMsgs.length == 1 || loop)){
		var timeLength = String.announce.baseDelay + (String.announce.iterate(String.announce.alertMsgs[0],
			/\s|\,|\.|\:|\;|\!|\(|\)|\/|\?|\@|\#|\$|\%|\^|\&|\*|\\|\-|\_|\+|\=/g) * String.announce.charMultiplier);

		if (!(noRep && String.announce.lastMsg == String.announce.alertMsgs[0])){
			String.announce.lastMsg = String.announce.alertMsgs[0];

			if (aggr)
				String.announce.placeHolder2.innerHTML = String.announce.alertMsgs[0];

			else
				String.announce.placeHolder.innerHTML = String.announce.alertMsgs[0];
		}
		String.announce.alertTO = setTimeout(function(){
			String.announce.placeHolder.innerHTML = String.announce.placeHolder2.innerHTML = '';
			String.announce.alertMsgs.shift();

			if (String.announce.alertMsgs.length >= 1)
				String.prototype.announce(String.announce.alertMsgs[0], true, noRep, aggr);
		}, timeLength);
	}
	return obj;
};

	String.announce =
					{
					alertMsgs: [],
					clear: function(){
						if (this.alertTO)
							clearTimeout(this.alertTO);
						this.alertMsgs = [];
					},
					baseDelay: 1000,
					charMultiplier: 10,
					lastMsg: '',
					iterate: function(str, regExp){
						var iCount = 0;
						str.replace(regExp, function(){
							iCount++;
						});
						return iCount;
					},
					loaded: false,
					liveRendered: false,
					alertRendered: false
					};

	bind(window, 'load', function(){
		if (!String.announce.placeHolder){
			String.announce.placeHolder = createEl('div',
							{
							'aria-live': 'polite'
							}, sraCSS);

			String.announce.placeHolder2 = createEl('div',
							{
							role: 'alert'
							}, sraCSS);
		}

		String.announce.loaded = true;
	});
})();