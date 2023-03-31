// ==UserScript==
// @name        TricTrac - Result list
// @namespace   http://www.trictrac.net/
// @grant       none

// @require		lib/htmlTag.js

// @include     http://www.trictrac.net/recherche*

// @version     0.2
// ==/UserScript==

// ----- Find the research terms (to sort relevent results) ----- //
var inputSearch = document.getElementById("queryfield");
var searchValue = inputSearch.value.trim().toLowerCase();

// ----- Find the search div, containing header, body and footer ----- //
var divSearch = document.getElementById("search_row_boxes_search");
var divBody = findChild("DIV", divSearch, 2); // find div where class = row-body
if(divBody.className != "row-body")
    return;

// --------------- Hide tiles-result -------------- //
divBody.style.display = "none";

// --------------- Create our own result list --------------- //
var divMyResultsList = document.createElement("div");

var divExactResult = document.createElement("div");
var txtExact = document.createTextNode("Correspondance(s) exacte(s)");
divExactResult.appendChild(txtExact);
divExactResult.style.fontWeight = "bold";
divExactResult.style.marginBottom = "15px";

var divReleventResult = document.createElement("div");
var txtRelevent = document.createTextNode("Pertinent(s)");
divReleventResult.appendChild(txtRelevent);
divReleventResult.style.fontWeight = "bold";
divReleventResult.style.marginBottom = "15px";

var divIrreleventResult = document.createElement("div");
var txtIrrelevent = document.createTextNode("Non-pertinent(s)");
divIrreleventResult.appendChild(txtIrrelevent);
divIrreleventResult.style.fontWeight = "bold";

// ----- Loop on results ----- //
var divList = findChild("DIV", divBody);

var divResults = findChildren("DIV", divList);
var nbResult = divResults.length;

var nbExact = 0;
var nbRelevent = 0;
var nbIrrelevent = 0;
for(var i = 0; i < nbResult; i++)
{
    var divResultWrapper = divResults[i];
    if(divResultWrapper == null) // First element is null
        continue;
    var divResult = findChild("DIV", divResultWrapper);
    if(divResult.className != "boardgame") // Take only games (no news, ...)
        continue;
    
    var divMyResult = document.createElement("div"); // Create new div for result
    
    var a = findChild("A", divResult); // Get game name
    var img = findChild("IMG", a); // Get picture
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.marginRight = "10px";
    
    // ----- Populate custom div ----- //
    var myA = document.createElement("a");
    myA.href = a.href;
    var txtName = document.createTextNode(a.title);
    myA.appendChild(img);
    myA.appendChild(txtName);
    divMyResult.appendChild(myA);
    divMyResult.style.marginBottom = "5px";
    
    // ----- Append custom div to results div ---- //
    var washedName = txtName.nodeValue.toLowerCase().trim();
    if(washedName == searchValue)
    {
        divExactResult.appendChild(divMyResult);
        nbExact++;
    }
    else if(washedName.indexOf(searchValue) >= 0)
    {
    	divReleventResult.appendChild(divMyResult);
        nbRelevent++;
    }
    else
    {
    	divIrreleventResult.appendChild(divMyResult);
        nbIrrelevent++;
    }
}

var divFooter = divSearch.removeChild(divSearch.lastChild);

if(nbExact > 0)
	divMyResultsList.appendChild(divExactResult);
if(nbRelevent > 0)
	divMyResultsList.appendChild(divReleventResult);
if(nbIrrelevent > 0)
	divMyResultsList.appendChild(divIrreleventResult);

divSearch.appendChild(divMyResultsList);

divSearch.appendChild(divFooter);

/* ----------------- LIB ------------------- */
function findChildren(className, parent, start, end)
{
	start = start || -1;
	end = end || -1;
	
	if(parent === null)
		return null;
	
	var children = parent.childNodes;
	if(children === null)
		return null;

	var resultTab = new Array();
	var tabClass = className.split("|");
	var tag = children[0];
	var count = 1;
	while(tag)
	{
		var found = false;
		for(var i = 0; i < tabClass.length; i++)
		{
			if(tag.nodeName == tabClass[i])
			{
				if((start == -1 || count >= start) && (end == -1 || count <= end))
					resultTab[count] = tag;
				count++;

				if(end != -1 && count > end)
					return resultTab;
				break;
			}
		}
		
		tag = tag.nextSibling;
	}
	return resultTab;
}

function findChild(className, parent, childNumber)
{
	childNumber = childNumber || 1;
	
	var resultTab = findChildren(className, parent, childNumber, childNumber);
	if(resultTab === null || resultTab.length < 2)
		return null;
	return resultTab[childNumber];
}

function findOffspring(className, parent, nodeValue, title, depth)
{
	nodeValue = nodeValue || null;
	title = title || null;
	depth = depth || 0;
	
	var children = parent.childNodes;
	if(children === null)
		return null;
	
	var child = children[0];
	while(child)
	{
		if(child.nodeName == className && (nodeValue === null || trim(child.nodeValue) == nodeValue) && (title === null || trim(child.title) == title))
			return child;
		found = findOffspring(className, child, nodeValue, title, depth+1);
		if(found !== null)
			return found;
		child = child.nextSibling;
	}
	
	return null;
}