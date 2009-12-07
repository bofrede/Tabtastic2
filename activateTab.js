function activateTab(tabHash) {
	var anchorMatch = /#([a-z][\w.:-]*)$/i,match;
	for (var i=0,len=document.links.length;i<len;i++){
		var a = document.links[i];
		if (match=anchorMatch.exec(a.href)) {
			everyTabThereIsById[match[1]])
		}
	}
}