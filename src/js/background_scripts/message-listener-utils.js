/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, chrome */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.messageListenerUtils");

    /**
     *
     * Open a new tab in the current window.
     *
     * @param {Boolean} active - Whether the new tab should be focused when created.
     * @param {String} homepageURL - The URL for the new tab.
     *
     */
    gamepad.messageListenerUtils.openNewTab = function (active, homepageURL) {
        chrome.tabs.create({ active: active, url: homepageURL });
    };

    /**
     *
     * Switch to the next or the previous tab in the current window.
     *
     * @param {String} tabDirection - The direction in which the tab focus should change,
     *
     */
    gamepad.messageListenerUtils.switchTab = function (tabDirection) {
        chrome.tabs.query({ currentWindow: true }, function (tabsArray) {
            // Switch only if more than one tab is present.
            if (tabsArray.length > 1) {
                // Find index of the currently active tab.
                var activeTabIndex = null;
                tabsArray.forEach(function (tab, index) {
                    if (tab.active) {
                        activeTabIndex = index;
                    }
                });

                // Switch browser tab.
                if (tabDirection === "previousTab") {
                    /**
                     * If the first tab is focused then switch to the last tab.
                     * Otherwise, switch to the previous tab.
                     */
                    if (activeTabIndex === 0) {
                        activeTabIndex = tabsArray.length;
                    }
                    chrome.tabs.update(tabsArray[activeTabIndex - 1].id, { active: true });
                }
                else if (tabDirection === "nextTab") {
                    // Switch to the next tab.
                    chrome.tabs.update(tabsArray[(activeTabIndex + 1) % tabsArray.length].id, { active: true });
                }
            }
        });
    };
})(fluid);