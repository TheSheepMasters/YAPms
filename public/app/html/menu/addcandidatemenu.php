<div id="addcandidatemenu" class="popup selectmenu">
<div class="selectmenu-header">
<div class="selectmenu-controls">
       <object class="closebutton" type="image/svg+xml">Close</object>
</div>
<div class="selectmenu-display-header">
	<h2 class="selectmenu-display-header-text">Add Candidate</h2>
</div>
</div>
<div class="selectmenu-content">
<div class="selectmenu-section">Name&nbsp;<input id="name" type="text" autocomplete="off"></div>
<a class="selectmenu-button" onclick='displayMenu("classiccolormenu")'>
	<div class="selectmenu-button-text">Classic Colors</div>
</a>
<a class="selectmenu-button" onclick='displayMenu("wikicolormenu")'>
	<div class="selectmenu-button-text">Wikipedia Colors</div>
</a>
<a class="selectmenu-button" onclick='displayMenu("interpolationcolormenu")'>
	<div class="selectmenu-button-text">Interpolation Colors</div>
</a>
<a class="selectmenu-button" onclick='displayMenu("altcolormenu")'>
	<div class="selectmenu-button-text">Alt Colors</div>
</a>
<a class="selectmenu-button" onclick='displayMenu("customcolormenu")'>
	<div class="selectmenu-button-text">Custom Colors</div>
</a>
<div class="selectmenu-section" id="addcandidate-colors">
</div>
<div class="selectmenu-button-mult">
	<div class="selectmenu-button-part selectmenu-button" onclick="addCandidateAddColor();">
		<div class="selectmenu-button-text">Add<br>Color</div>
	</div>
	<div class="selectmenu-button-part selectmenu-button" onclick="addCandidateRemoveColor();">
		<div class="selectmenu-button-text">Remove<br>Color</div>
	</div>
</div>
<div class="selectmenu-button" onclick="CandidateManager.addCandidate3(); Simulator.uniformPreset(); closeAllPopups();">
	<div class="selectmenu-button-text">Confirm</div>
</div>
</div>
</div>
