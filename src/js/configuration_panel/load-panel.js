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

    fluid.registerNamespace("gamepad.configurationDashboard");
    fluid.registerNamespace("gamepad.configurationDashboardUtils");

    fluid.defaults("gamepad.configurationDashboard", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            configurationMenu: ".configuration-menu",
            buttonsContainer: ".buttons-container",
            setAllToNoneButton: "#set-to-none",
            restoreDefaultsButton: "#set-to-default",
            saveChangesButton: "#save-changes"
        },
        listeners: {
            "onCreate.loadConfigurationPanel": "{that}.createPanel",
            "onCreate.handleScroll": {
                funcName: "{that}.handleScroll",
                after: "loadConfigurationPanel"
            },
            "onCreate.attachListeners": {
                funcName: "{that}.attachListeners",
                after: "loadConfigurationPanel"
            }
        },
        buttonsDescription: {
            "0": "A (Xbox), &#10799; (PS4)",
            "1": "B (Xbox), O (PS4)",
            "2": "X (Xbox), &#9723; (PS4)",
            "3": "Y (Xbox), &#9651; (PS4)",
            "4": "Left Bumper",
            "5": "Right Bumper",
            "6": "Left Trigger",
            "7": "Right Trigger",
            "8": "Back (Xbox), Share (PS4)",
            "9": "Start (Xbox), Options (PS4)",
            "10": "Left Thumbstick Button",
            "11": "Right Thumbstick Button",
            "12": "D-Pad Up Button",
            "13": "D-Pad Down Button",
            "14": "D-Pad Left Button",
            "15": "D-Pad Right Button"
        },
        axesDescription: {
            "0": "Left Thumbstick Horizontal Direction",
            "1": "Left Thumbstick Vertical Direction",
            "2": "Right Thumbstick Horizontal Direction",
            "3": "Right Thumbstick Vertical Direction"
        },
        buttonOptionsWithDefaultIndex: [
            // [Action, Action label, Default button index for action]
            ["vacant", "None", 1],
            ["click", "Click", 0],
            ["previousPageInHistory", "History back button", 2],
            ["nextPageInHistory", "History next button", 3],
            ["reverseTab", "Focus on the previous element", 4],
            ["forwardTab", "Focus on the next element", 5],
            ["scrollLeft", "Scroll left", 6],
            ["scrollRight", "Scroll right", 7],
            ["scrollUp", "Scroll up", null],
            ["scrollDown", "Scroll down", null],
            ["goToPreviousTab", "Switch to the previous browser tab", 14],
            ["goToNextTab", "Switch to the next browser tab", 15],
            ["closeCurrentTab", "Close current browser tab", 8],
            ["openNewTab", "Open a new tab", 9],
            ["closeCurrentWindow", "Close current browser window", 10],
            ["openNewWindow", "Open a new browser window", 11],
            ["goToPreviousWindow", "Switch to the previous browser window", 12],
            ["goToNextWindow", "Switch to the next browser window", 13]
        ],
        axesOptionsWithDefaultIndex: [
            // [Action, Action label, Default axes index for action]
            ["vacant", "None", null],
            ["scrollHorizontally", "Scroll horizontally", 0],
            ["scrollVertically", "Scroll vertically", 1],
            ["thumbstickHistoryNavigation", "History navigation", 2],
            ["thumbstickTabbing", "Focus on the previous/next element", 3]
        ],
        actionsWithSpeedFactorOption: [
            "reverseTab",
            "forwardTab",
            "scrollLeft",
            "scrollRight",
            "scrollUp",
            "scrollDown",
            "scrollHorizontally",
            "scrollVertically",
            "thumbstickTabbing"
        ],
        actionsWithBackgroundOption: ["openNewTab", "openNewWindow"],
        actionsWithInvertOption: [
            "scrollHorizontally",
            "scrollVertically",
            "thumbstickHistoryNavigation",
            "thumbstickTabbing"
        ],
        invokers: {
            createPanel: {
                funcName: "gamepad.configurationDashboard.createPanel",
                args: ["{that}", "{that}.dom.configurationMenu"]
            },
            handleScroll: {
                funcName: "gamepad.configurationDashboardUtils.handleScroll",
                args: ["{that}.dom.configurationMenu"]
            },
            modifyDropdownMenu: {
                funcName: "gamepad.configurationDashboardUtils.modifyDropdownMenu",
                args: ["{that}"]
            },
            listenDropdownChanges: {
                funcName: "gamepad.configurationDashboardUtils.listenDropdownChanges",
                args: ["{that}"]
            },
            changeConfigMenuOptions: {
                funcName: "gamepad.configurationDashboardUtils.changeConfigMenuOptions",
                args: ["{that}", "{arguments}.0"]
            },
            createInputActionDropdown: {
                funcName: "gamepad.configurationDashboardUtils.createInputActionDropdown",
                args: [
                    "{that}",
                    "{arguments}.0",
                    "{arguments}.1",
                    "{arguments}.2",
                    "{arguments}.3",
                    "{arguments}.4"
                ]
            },
            createSpeedFactorOption: {
                funcName: "gamepad.configurationDashboardUtils.createSpeedFactorOption",
                args: ["{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            createThirdConfigurationOption: {
                funcName: "gamepad.configurationDashboardUtils.createThirdConfigurationOption",
                args: [
                    "{arguments}.0",
                    "{arguments}.1",
                    "{arguments}.2",
                    "{arguments}.3"
                ]
            },
            setAllToNoneListener: {
                funcName: "gamepad.configurationDashboardUtils.setAllToNoneListener",
                args: ["{that}", "{that}.dom.saveChangesButton"]
            },
            setToDefaultListener: {
                funcName: "gamepad.configurationDashboardUtils.setToDefaultListener",
                args: ["{that}", "{that}.dom.saveChangesButton"]
            },
            saveChangesListener: "gamepad.configurationDashboardUtils.saveChangesListener",
            attachListeners: {
                funcName: "gamepad.configurationDashboardUtils.attachListeners",
                args: [
                    "{that}",
                    "{that}.dom.setAllToNoneButton",
                    "{that}.dom.restoreDefaultsButton",
                    "{that}.dom.saveChangesButton"
                ]
            },
            toggleSaveButtonState: {
                funcName: "gamepad.configurationDashboardUtils.toggleSaveButtonState",
                args: ["{that}.dom.saveChangesButton", "{arguments}.0"]
            }
        }
    });

    /**
     *
     * Create a configuration panel inside the Chrome extension's popup window.
     *
     * @param {Object} that - The configurationDashboard component.
     * @param {Array} configurationMenu - The jQuery selector of the configuration menu.
     *
     */
    gamepad.configurationDashboard.createPanel = function (that, configurationMenu) {
        configurationMenu = configurationMenu[0];
        configurationMenu.innerHTML = "";

        /**
         * Create the options menu for each input and inject it inside gamepad controls
         * configuration menu/panel.
         */
        chrome.storage.local.get(["gamepadConfiguration"], function (storedConfigurationWrapper) {
            var totalInputs = 20,
                storedGamepadConfiguration = fluid.get(storedConfigurationWrapper, "gamepadConfiguration");
            for (var inputCounter = 0; inputCounter < totalInputs; inputCounter++) {
                // Compute input label and index of input.
                var inputIndex = inputCounter % 16,
                    isAxes = inputCounter / 16 >= 1,
                    inputName = null,
                    inputIdentifier = null,
                    storedInputData = null;

                // Create the container div for the configuration options.
                var inputMenuItem = document.createElement("div");
                if (isAxes) {
                    inputName = that.options.axesDescription[inputIndex];
                    inputIdentifier = "axes-" + inputIndex;

                    // Extract the current axes data from the stored data.
                    if (fluid.get(storedGamepadConfiguration, "axes")) {
                        storedInputData = storedGamepadConfiguration.axes[inputIndex];
                    }
                }
                else {
                    var buttonDescription = that.options.buttonsDescription[inputIndex];
                    inputName = "Button " + inputIndex + ": " + buttonDescription;
                    inputIdentifier = "button-" + inputIndex;

                    // Extract the current buttons data from the stored data.
                    if (fluid.get(storedGamepadConfiguration, "buttons")) {
                        storedInputData = storedGamepadConfiguration.buttons[inputIndex];
                    }
                }
                inputMenuItem.classList.add("menu-item", inputIdentifier);

                // Set attributes and text of the input label.
                var inputLabel = document.createElement("h1");
                inputLabel.innerHTML = inputName;
                inputMenuItem.appendChild(inputLabel);

                // Create the input menu configuration options.
                var currentAction = fluid.get(storedInputData, "currentAction"),
                    speedFactor = fluid.get(storedInputData, "speedFactor"),
                    thirdConfigurationOption = fluid.get(storedInputData, isAxes ? "invert" : "background");
                that.createInputActionDropdown(
                    inputIdentifier,
                    inputMenuItem,
                    isAxes,
                    inputIndex,
                    currentAction
                );
                that.createSpeedFactorOption(inputIdentifier, inputMenuItem, speedFactor);
                that.createThirdConfigurationOption(
                    inputIdentifier,
                    inputMenuItem,
                    isAxes,
                    thirdConfigurationOption
                );

                // Inject the input menu inside the configuration menu/panel.
                configurationMenu.appendChild(inputMenuItem);

                // Attach.
                that.modifyDropdownMenu();
                that.listenDropdownChanges();
            }
        });
    };

    window.onload = function () {
        gamepad.configurationDashboard(".configuration-dashboard");
    };
})(fluid);
