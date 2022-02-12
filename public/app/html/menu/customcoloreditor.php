<div id="customcoloreditor" class="popup selectmenu">
<div class="selectmenu-header">
<div class="selectmenu-controls">
       <object class="closebutton" type="image/svg+xml">Close</object>
</div>
<div class="selectmenu-display-header">
	<h2 class="selectmenu-display-header-text">Custom Color Edit</h2>
</div>
</div>
<div class="selectmenu-content">
<input id="custom-color-name" type="hidden">
<!--
<div class="selectmenu-section">Solid <input id="solidcustom" type="color"></div>
<div class="selectmenu-section">Likely <input id="likelycustom" type="color"></div>
<div class="selectmenu-section">Leaning <input id="leaningcustom" type="color"></div>
<div class="selectmenu-section">Tilting <input id="tiltingcustom" type="color"></div>
-->
<div class="selectmenu-section" id="customcolor-colors"></div>
<div class="selectmenu-button-mult">
	<a class="selectmenu-button-part selectmenu-button" onclick="customColorAddColor();">
		<div class="selectmenu-button-text">Add<br>Color</div>
	</a>
	<a class="selectmenu-button-part selectmenu-button" onclick="customColorRemoveColor();">
		<div class="selectmenu-button-text">Remove<br>Color</div>
	</a>
</div>
<div class="selectmenu-section" onclick="CandidateManager.saveCustomColors(); CookieManager.loadCustomColors(); displayMenu('customcolormenu');">Set</div>
</div>
</div>
