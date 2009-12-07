// Tabtastic II version 2.04 by BoFrede.
// Based on Tabtastic 1.0.4 by Gavin Kistner.

jQuery(document).ready(function () {
    var tocTag = 'ul', tocClass = 'tabset_tabs', tabTag = 'a', contentClass = 'tabset_content';


    function findEl(tagName, evt) {
        if (!evt && window.event) {
            evt = event;
        }
        var el = evt.currentTarget || evt.target || evt.srcElement;
        while (el && (!el.tagName || el.tagName.toLowerCase() !== tagName)) {
            el = el.parentNode;
        }
        return el;
    }


    function setTabActive(tab) {
        if (tab.tabTOC.activeTab) {
            if (tab.tabTOC.activeTab === tab) {
                return;
            }
            jQuery(tab.tabTOC.activeTab).removeClass('active');
            if (tab.tabTOC.activeTab.tabContent) {
                jQuery('#' + tab.tabTOC.activeTab.tabContent).removeClass('tabset_content_active');
            }
            if (tab.tabTOC.activeTab.prevTab) {
                jQuery('#' + tab.tabTOC.activeTab.previousTab).removeClass('preActive');
            }
            if (tab.tabTOC.activeTab.nextTab) {
                jQuery('#' + tab.tabTOC.activeTab.nextTab).removeClass('postActive');
            }
        }
        tab.tabTOC.activeTab = tab;
        jQuery(tab).addClass('active');
        if (tab.tabContent) {
            jQuery('#' + tab.tabContent).addClass('tabset_content_active');
        }
        if (tab.prevTab) {
            jQuery('#' + tab.prevTab).addClass('preActive');
        }
        if (tab.nextTab) {
            jQuery('#' + tab.nextTab).addClass('postActive');
        }
    }


    function setTabFromAnchor(evt) {
        setTabActive(findEl('a', evt).semanticTab);
        // Prevent scroll to anchor.
        if (evt.preventDefault) { // For DOM compliant browsers http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-Event-preventDefault
            evt.preventDefault();
        } else { // For MSIE http://msdn2.microsoft.com/en-us/library/ms536913.aspx
            evt.returnValue = false;
        }
    }

    /* Event handler for the focus event of input fields. Set the right tab active. */
    function autoFocusTab(evt) {
        var el = findEl('input', evt) || findEl('textarea', evt) || findEl('select', evt);
        while (el && (!el.tagName || !(el.tagName.toLowerCase() === 'div' && jQuery(el).is('.' + contentClass)))) {
            el = el.parentNode;
        }
        if (el && el.id) {
            var tabToActivate = window.everyTabThereIsById[el.id];
            if (tabToActivate) {
                setTabActive(tabToActivate);
            }
        }
    }


    function init() {
        window.everyTabThereIsById = {};
        var anchorMatch = /#([a-z][\w.:\-]*)$/i, match;
        var activeTabs = [];
        var tocs = document.getElementsByTagName(tocTag);
        for (var i = 0, len = tocs.length; i < len; i++) {
            var toc = tocs[i];
            if (!jQuery(toc).is('.' + tocClass)) {
                continue;
            }
            var lastTab;
            var tabs = toc.getElementsByTagName(tabTag);
            for (var j = 0, len2 = tabs.length; j < len2; j++) {
                var tab = tabs[j];
                if (!tab.href || !(match = anchorMatch.exec(tab.href))) {
                    continue;
                }
                if (lastTab) {
                    tab.prevTab = lastTab;
                    lastTab.nextTab = tab;
                }
                tab.tabTOC = toc;
                window.everyTabThereIsById[tab.tabID = match[1]] = tab;
                tab.tabContent = tab.tabID;

                if (jQuery(tab).is('.active')) {
                    activeTabs[activeTabs.length] = tab;
                }
                lastTab = tab;
            }
            jQuery(toc.getElementsByTagName('li')[0]).addClass('firstchild');
        }
        for (i = 0, len = activeTabs.length; i < len; i++) {
            setTabActive(activeTabs[i]);
        }
        var a;
        for (i = 0, len = document.links.length; i < len; i++) {
            a = document.links[i];
            if (!(match = anchorMatch.exec(a.href))) {
                continue;
            }
            a.semanticTab = window.everyTabThereIsById[match[1]];
            if (a.semanticTab) {
                jQuery(a).bind('click', setTabFromAnchor);
            }
        }
        if ((match = anchorMatch.exec(location.href)) && (a = window.everyTabThereIsById[match[1]])) {
            setTabActive(a);
        }
        // Set focus events on all input and textareas.
        var inputs = jQuery("input[type='text'], input[type='password'], input[type='radio'], input[type='checkbox'], textarea, select");
        if (inputs && inputs.length > 0) {
            for (i = 0; i < inputs.length; i++) {
                jQuery(inputs[i]).bind('focus', autoFocusTab);
            }
        }
    }

    init();
});