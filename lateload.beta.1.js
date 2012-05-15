/**
 * A class to support delayed loading of ads & other widgets that would otherwise block our own initial 
 * AJAX scripts from running during onload or $(document).ready.
 * 
 * TO USE:
 *     Include this JavaScript file, preferably early in the markup.
 *	       <script type='text/javascript' src='/path/to/lateload.js'>
 *     
 *     Save the external js snippet for safekeeping, because you're going to...
 *     Modify it by replacing the part where it loads its external script with this:
 *         lateLoad.later ('/pathname/to/xxx.js');
 *         lateLoad.later ('/pathname/to/xxx.js', {when: how-to-delay, where: where-to-load-it});
 *         
 *     To specify how to delay the load, use "onLoad", "onDocumentReady", an integer for how many
 *     milliseconds to wait, or a user-defined name to use later when you call lateLoad.now().
 *     
 *     To specify where to place the newly loaded script, use "last" (default) to append it at the end 
 *     of the document, "here" (default) to replace the script tag that lateLoad.later was called from, 
 *     or it will be placed after the element identified by "#idOfTheElement", $jQueryObjectOrSelector, 
 *     or a raw domObject;
 *     
 *     If you used the custom name for the "when" parameter: When you're ready to allow the external 
 *     JavaScript to be loaded, use this:
 *	       lateLoad.now ('WidgetXxx');
 *	       
 *	   You can tell lateLoad to load all the remaining named widgets like this:
 *	       lateLoad.now ();
 *	       
 * @author		Jennifer Simonds
 * @copyright	2012 Jennifer Simonds
 * @license	MIT License http://opensource.org/licenses/MIT
 * 
 * @version beta.1		2012-05-05	Initial public beta release.
 */

lateLoad = function() {
//	Private members
	var _isInitialized = false;
	var _hasJQuery = false;
	
	// These arrays contain the info for the scripts that are scheduled to be loaded. Each element
	// contains {src:, relation:, where:}
	var _aWhenOnLoad   = []; // Array of scripts to load when window.onload fires.
	var _aWhenDocReady = []; // Array of scripts to load when $(document).ready fires.
	var _aWhenCustom   = []; // Array of custom deferral tags, the urls to load, & where to load them.
	
	/**
	 * Helper function to load the script. This is called after a set timeout, onload, $(document).ready,
	 * or because the user called lateLoad.now.
	 * 
	 * @param url            The url of the script to load.
	 * @param string         Where this should be loaded in relation to the next param. 'relation'
	 *                       (default) or 'after'.
	 * @param string/object	 '#elementID', or a jQuery or DOM object.
	 */
	function _load (p_src, p_relation, p_where)
	{
		var where, target, domScript, domBody;

		where = p_where;

		domScript = document.createElement('script');
		domScript.setAttribute ('type', 'text/javascript');
		domScript.setAttribute ('async', true);
		domScript.setAttribute ('src',   p_src);

		if (p_relation == 'replace')
		{	// Replace the existing script element.
			where.parentNode.replaceChild(domScript, where);
		}
		else if (where == 'last')
		{	// Make it the last element in the document.
			if (!document.getElementsByTagName('body'))
			{
				domBody = document.createElement('body');
				insertBefore (domBody, document.getElementsByTagName('head').nextSibling);
			}
			domBody = (document.getElementsByTagName('body')[0] || document)
	        domBody.appendChild(domScript);
		}
		else if (typeof where == 'string' && where.substr(0,1) == '#')
		{	// Put it after the element with this ID.
			_insertAfter (domScript, document.getElementById(where.substr(1)));
		}
		else if (typeof where == 'object')
		{	// Put it after this element. (Can be a DOM object or jQuery object)
			if (_hasJQuery)
			{	jQuery(domScript).appendTo(where);
			}
			else
			{	_insertAfter (domScript, where);
			}
		}
	}

	function _insertAfter (p_domNew, p_domWhere)
	{
		var domParent = p_domWhere.parentNode;
		if (domParent)
		{
			var domNext = p_domWhere.parentNode.nextSibling;
			domParent.insertBefore(p_domNew, domNext);
		}
	}
	
	
	return {
		// Public interface
		/**
		 * Our public constructor. 
		 */
		init: function()
		{
			var defer;

			if (!_isInitialized)
			{
				_isInitialized = true;
				
				_hasJQuery = (typeof jQuery !== 'undefined');
				
				if (_hasJQuery)
				{	// Set us up to load the scripts that were registered to load "onDocumentReady".
					jQuery(document).ready(function()
					{
						while (defer = _aWhenDocReady.shift())
						{
							_load (defer.src, defer.relation, defer.where);
						}
					});
				}
			}
		},
		

		/**
		 * Registers an external JavaScript to be loaded at some time in the future, depending on the
		 * p_options.when parameter.
		 * 
		 * When the script is loaded, the new script tag will be loaded in various places in the DOM,
		 * depending on what you specify for the p_options.where parameter.
		 *     
		 * @param string         The script tag's src= value.
		 * @param string/integer When to load the script:
		 *                            'onLoad' = (default) when window.onload is fired
		 *                            'onDocumentReady'= on $(document).ready (if jQuery is installed)
		 *                            'xxx' = when user calls lateLoad.now('xxx')
		 *                            integer = # ms. to wait before loading
		 * @param string/object	  Where to load this script:
		 *                            'last' = (default) last element in the document
		 *                            'here' = replaces the (script) tag that lateLoad.later was called from
		 *                            '#elementid' = after the specified element
		 *                            DOM or jQuery object = after the specified object
		 */
		later: function (p_src, p_options)
		{
			var howToDelay, where, relation;

			howToDelay = (p_options && p_options.when) ? p_options.when : 'onLoad';
			relation  = (p_options && p_options.where && p_options.where == 'here') ? 'replace' : 'after';
			if (relation == 'replace')
			{
				var aScripts = document.getElementsByTagName('script');
				where = aScripts[aScripts.length - 1];
			}
			else
			{
				where = (p_options && p_options.where) ? p_options.where : 'last';
			}
			
			if (typeof howToDelay == 'number')
			{	// We'll load the script after a set timeout.
				setTimeout (function(){_load(p_src, relation, where)}, howToDelay);
			}
			else if (howToDelay.toLowerCase() == 'onLoad'.toLowerCase())
			{	// We'll load the script after window.onload fires.
				_aWhenOnLoad.push({src: p_src, relation: relation, where: where});
			}
			else if (howToDelay.toLowerCase() == 'onDocumentReady'.toLowerCase())
			{	// We'll load the script after $(document).ready fires.
				if (_hasJQuery)
				{	
					_aWhenDocReady.push({src: p_src, relation: relation, where: where});
				}
			}
			else
			{	// We'll load the script when the caller explicitly tells us it's OK.
				_aWhenCustom.push({name: howToDelay, src: p_src, relation: relation, where: where});
			}
		},


		/**
		 * Loads a named widget immediately, or loads all the outstanding named widgets.
		 * 
		 * @param string		The name you specified when you called lateLoad.later(). Default=''
		 *                      which loads all outstanding named widgets.
		 */
		now: function (p_name)
		{
			var name, i, defer;
			
			name = p_name !== undefined ? p_name : '';
			
			if (name == '')
			{	// Load'em all.
				while (_aWhenCustom.length)
				{
					defer = _aWhenCustom.shift();
					_load (defer.src, defer.relation, defer.where);
				}
			}
			else
			{	// Load a specific widget.
				for (i = _aWhenCustom.length - 1; i >= 0; i--)
				{
					if (name == '' || _aWhenCustom[i].name == p_name)
					{
						defer = _aWhenCustom[i];
						_aWhenCustom.splice (i, 1);
						_load (defer.src, defer.relation, defer.where);
					}
				}
			}
		},


		/**
		 * Load the scripts that have been registered to load "onload", meaning on window.onload.
		 */
		onWindowLoad: function ()
		{
			var defer;
			
			while (_aWhenOnLoad.length)
			{
				defer = _aWhenOnLoad.shift();
				_load (defer.src, defer.relation, defer.where);
			}
		}
	};
}();

lateLoad.init ();

if (window.attachEvent)
{	window.attachEvent('onload', lateLoad.onWindowLoad);
}
else
{	window.addEventListener('load', lateLoad.onWindowLoad, false);
}
