<div id="candidateedit" class="popup selectmenu">
<input id="candidate-originalName" type="hidden">
<div class="selectmenu-header">
<div class="selectmenu-controls">
<object class="closebutton" type="image/svg+xml">Close</object>
</div>
<div class="selectmenu-display-header">
	<h2 id="candidateedit-message" class="selectmenu-display-header-text">Candidate Edit</h2>
</div>
</div>
<div class="selectmenu-content">
<div class="selectmenu-section">Name&nbsp;<input id="candidate-name" type="text" name="name"></div>
<div class="selectmenu-section" id="editcandidate-colors"></div>
<div class="selectmenu-button-mult">
	<a class="selectmenu-button-part selectmenu-button" onclick="editCandidateAddColor();">
		<div class="selectmenu-button-text">Add<br>Color</div>
	</a>
	<a class="selectmenu-button-part selectmenu-button" onclick="editCandidateRemoveColor();">
		<div class="selectmenu-button-text">Remove<br>Color</div>
	</a>
</div>
<div class="selectmenu-button" onclick="CandidateManager.setCandidate(); Simulator.uniformPreset();">
	<div class="selectmenu-button-text">Apply</div>
</div>
<div class="selectmenu-button" onclick='CandidateManager.deleteCandidate(); Simulator.uniformPreset();'>
	<div class="selectmenu-button-text">Delete</div>
</div>
</div>
</div>
