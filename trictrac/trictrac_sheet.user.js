// ==UserScript==
// @name        TricTrac - Game sheet
// @namespace   http://www.trictrac.net/
// @grant       none

// @include     http://www.trictrac.net/jeu-de-societe/*/infos

// @version     0.2
// ==/UserScript==

/**
 * Firefox, and most other browsers, will treat empty white-spaces or new lines as text nodes, Internet Explorer will not.
 * Source : http://www.w3schools.com/dom/prop_node_nextsibling.asp
 */ 
function getNextSibling(elem)
{
    var sibling = elem.nextSibling;
    while(sibling.nodeType != 1)
        sibling = sibling.nextSibling;
    return sibling;
}

function getHrefFromLi(li)
{
    var a = findChild("A", li);
    return a.href;
}

function wrapTxtInUrl(divId, url)
{
    var div = document.getElementById(divId);
    if(div == null)
        return;
    
    var div2 = findChild("DIV", div);
    var span = findChild("SPAN", div2);
    var txt = span.removeChild(span.lastChild);
    
    var myA = document.createElement("a");
    myA.className = "row-header-title label-row-title";
    myA.href = url;
    myA.style.font = "inherit";
    myA.appendChild(txt);
    span.appendChild(myA);
}

// ----- Find navigation urls ----- //
var divBoardgame = document.getElementById("boardgame_row_boxes_line");
var nav = getNextSibling(divBoardgame);

var ul = findChild("UL", nav);
var lis = findChildren("LI", ul);

var hrefInfo = getHrefFromLi(lis[1]);
var hrefDesc = getHrefFromLi(lis[2]);
var hrefVariante = getHrefFromLi(lis[3]);
var hrefLiens = getHrefFromLi(lis[4]);
var hrefActu = getHrefFromLi(lis[5]);
var hrefPhotos = getHrefFromLi(lis[6]);
var hrefVideo = getHrefFromLi(lis[7]);
var hrefAvis = getHrefFromLi(lis[8]);

// ----- Find div to wrap ----- //
wrapTxtInUrl("medias_row_boxes_scrollable", hrefPhotos);
wrapTxtInUrl("medias_row_boxes_scrollable_0", hrefVideo);
wrapTxtInUrl("opinion_row_boxes_list30", hrefAvis);

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