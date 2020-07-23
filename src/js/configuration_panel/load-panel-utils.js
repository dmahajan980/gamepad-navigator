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

    fluid.registerNamespace("gamepad.configurationDashboardUtils");

    /**
     *
     * Create the input action label and its dropdown and inject both into the DOM.
     *
     * @param {Object} that - The configurationDashboard component.
     * @param {String} inputIdentifier - String containing the input type with its index.
     * @param {Object} inputMenuItem - The input menu DOM element for a given input.
     * @param {Boolean} isAxes - Whether the current input is axes.
     * @param {Number} inputIndex - The index number of the current input.
     * @param {Object} storedValue - The stored value of input action dropdown for a
     *                               given input.
     *
     */
    gamepad.configurationDashboardUtils.createInputActionDropdown = function (that, inputIdentifier, inputMenuItem, isAxes, inputIndex, storedValue) {
        // Create a label for the input action and set its inner text.
        var actionLabel = document.createElement("label");
        actionLabel.innerHTML = "Action:";

        // Set the attributes and class names of the input action label.
        actionLabel.setAttribute("for", inputIdentifier + "-action");
        actionLabel.classList.add(inputIdentifier + "-child");

        // Inject the input action label into the input menu (of the given input).
        inputMenuItem.appendChild(actionLabel);

        // Create the input action dropdown for the given input and set the default value.
        var inputSelectMenu = document.createElement("select");
        var actionsList = isAxes ? that.options.axesOptionsWithDefaultIndex : that.options.buttonOptionsWithDefaultIndex;
        fluid.each(actionsList, function (optionArray) {
            // Create an option for the dropdown and set its value and inner text.
            var option = document.createElement("option");
            option.setAttribute("value", optionArray[0]);
            option.innerHTML = optionArray[1];

            // Set the default option for the dropdown.
            if (storedValue) {
                if (storedValue === optionArray[0]) {
                    option.setAttribute("selected", "");
                }
            }
            else if (optionArray[2] === inputIndex) {
                option.setAttribute("selected", "");
            }

            // Inject the option into the dropdown.
            inputSelectMenu.appendChild(option);
        });

        // Set other attributes and class names of the input action dropdown menu.
        inputSelectMenu.classList.add(inputIdentifier + "-child");
        inputSelectMenu.setAttribute("name", inputIdentifier + "-action");

        // Inject the input action dropdown menu into the DOM.
        inputMenuItem.appendChild(inputSelectMenu);
    };

    /**
     *
     * Create the speed factor label and input box and inject both into the DOM.
     *
     * @param {String} inputIdentifier - String containing the input type with its index.
     * @param {Object} inputMenuItem - The input menu DOM element for a given input.
     * @param {Object} storedValue - The stored value of speedFactor for a given input.
     *
     */
    gamepad.configurationDashboardUtils.createSpeedFactorOption = function (inputIdentifier, inputMenuItem, storedValue) {
        // Create a speed factor label and set its inner text.
        var speedFactorLabel = document.createElement("label");
        speedFactorLabel.innerHTML = "Speed Factor:";

        // Set the attributes and class names of the speed factor label.
        speedFactorLabel.classList.add("speed-factor-label", inputIdentifier + "-child");
        speedFactorLabel.setAttribute("for", inputIdentifier + "-speedFactor");

        // Inject the speed factor label into the input menu (of the given input).
        inputMenuItem.appendChild(speedFactorLabel);

        // Create a speed factor numeric input box and set its default value.
        var speedFactorInput = document.createElement("input");
        speedFactorInput.setAttribute("type", "number");
        speedFactorInput.defaultValue = storedValue || "1.0";

        // Set the minimun, maximum, and increment value of the input box.
        speedFactorInput.setAttribute("step", 0.1);
        speedFactorInput.setAttribute("min", 0.5);
        speedFactorInput.setAttribute("max", 2.5);

        // Set other attributes and class names of the speed factor input box.
        speedFactorInput.setAttribute("name", inputIdentifier + "-speedFactor");
        speedFactorInput.classList.add("speed-factor", inputIdentifier + "-child");

        // Inject the speed factor input box into the input menu (of the given input).
        inputMenuItem.appendChild(speedFactorInput);
    };

    /**
     *
     * Create the third configuration option label and checkbox and inject both into the
     * DOM.
     *
     * @param {String} inputIdentifier - String containing the input type with its index.
     * @param {Object} inputMenuItem - The input menu DOM element for a given input.
     * @param {Boolean} isAxes - Whether the current input is axes.
     * @param {Object} storedValue - The stored value of the third configuration option
     *                               for a given input.
     *
     */
    gamepad.configurationDashboardUtils.createThirdConfigurationOption = function (inputIdentifier, inputMenuItem, isAxes, storedValue) {
        // Create the third configuration option label and set its inner text.
        var thirdConfigurationOptionLabel = document.createElement("label");
        thirdConfigurationOptionLabel.innerHTML = isAxes ? "Invert Action" : "Open new tab/window in background";

        // Set the attributes and class names of the third configuration option label.
        thirdConfigurationOptionLabel.classList.add("checkbox-label", inputIdentifier + "-child");
        var forSuffix = isAxes ? "invert" : "background";
        thirdConfigurationOptionLabel.setAttribute("for", inputIdentifier + "-" + forSuffix);

        /**
         * Inject the third configuration option label into the input menu (of the given
         * input).
         */
        inputMenuItem.appendChild(thirdConfigurationOptionLabel);

        // Create the third configuration option checkbox and set its value.
        var thirdConfigurationOption = document.createElement("input");
        thirdConfigurationOption.setAttribute("type", "checkbox");
        thirdConfigurationOption.checked = storedValue || false;

        /**
         * Set other attributes and class names of the third configuration option
         * checkbox.
         */
        thirdConfigurationOption.setAttribute("name", inputIdentifier + "-" + forSuffix);
        thirdConfigurationOption.classList.add("checkbox", inputIdentifier + "-child");

        /**
         * Inject the third configuration option checkbox into the input menu (of the
         * given input).
         */
        inputMenuItem.appendChild(thirdConfigurationOption);
    };

    /**
     *
     * Handles scrolling to the next/previous input configuration page while tabbing.
     *
     * @param {Array} configurationMenu - The jQuery selector of the configuration menu.
     *
     */
    gamepad.configurationDashboardUtils.handleScroll = function (configurationMenu) {
        var scrollTimer = null;
        configurationMenu.scroll(function () {
            // Clear the timeout if the scrolling isn't stopped while tabbing.
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }

            // Scroll the remaining width after the scrolling has stopped.
            scrollTimer = setTimeout(function () {
                var width = 600,
                    scrolledBy = configurationMenu[0].scrollLeft;
                configurationMenu[0].scrollBy((width - (scrolledBy % width)) % width, 0);
            }, 25);
        });
    };

    /**
     *
     * Display/hide configuration options on each input configuration page after the
     * panel is created.
     *
     * @param {Object} that - The configurationDashboard component.
     *
     */
    gamepad.configurationDashboardUtils.modifyDropdownMenu = function (that) {
        // Get the list of all input menus in the configuration panel.
        var inputMenusArray = document.querySelectorAll(".menu-item");

        /**
         * Set dropdown values to their default values and other configuration options
         * accordingly.
         */
        fluid.each(inputMenusArray, function (inputMenu) {
            if (fluid.isDOMNode(inputMenu)) {
                that.changeConfigMenuOptions(inputMenu.querySelector("select"));
            }
        });
    };

    /**
     *
     * Display/hide configuration options on each input configuration page when the
     * input action is changed.
     *
     * @param {Object} that - The configurationDashboard component.
     *
     */
    gamepad.configurationDashboardUtils.listenDropdownChanges = function (that) {
        // Get the list of all dropdowns in the configuration panel.
        var actionDropdowns = $("select");

        // Attach change listener to all dropdown menus.
        fluid.each(actionDropdowns, function (actionDropdown) {
            $(actionDropdown).change(function () {
                console.log(actionDropdown, actionDropdowns.length)
                that.changeConfigMenuOptions(this);
            });
        });
    };

    /**
     *
     * Change the input menu configuration options according to the chosen action in the
     * dropdown.
     *
     * @param {Object} that - The configurationDashboard component.
     * @param {Object} dropdownMenu - The input action dropdown menu of an input menu.
     *
     */
    gamepad.configurationDashboardUtils.changeConfigMenuOptions = function (that, dropdownMenu) {
        var selectedAction = $(dropdownMenu).val(),
            className = dropdownMenu.classList[0],
            currentInputMenuItems = document.getElementsByClassName(className);

        /**
         * Show speed factor input box and its label if selected option is applicable for
         * speed factor. Othewise, hide the speed factor input box and label and increase
         * the input width.
         */
        if (that.options.actionsWithSpeedFactorOption.includes(selectedAction)) {
            currentInputMenuItems[2].style.display = "unset";
            currentInputMenuItems[3].style.display = "unset";

            // Disable the input box.
            currentInputMenuItems[3].removeAttribute("disabled");

            // Reduce the width of the action dropdown.
            dropdownMenu.style.width = "94%";
            dropdownMenu.style.gridColumn = "1/2";
        }
        else {
            currentInputMenuItems[2].style.display = "none";
            currentInputMenuItems[3].style.display = "none";

            // Reset the speed factor input box value.
            currentInputMenuItems[3].value = "1";

            // Remove the disabled attribute from the input box.
            currentInputMenuItems[3].setAttribute("disabled", "");

            // Increase the width of the action dropdown.
            dropdownMenu.style.width = "100%";
            dropdownMenu.style.gridColumn = "1/3";
        }

        /**
         * Show open in background checkbox if selected option is applicable for
         * opening tabs/windows in background. Otherwise, if the selected action is
         * invertible, show invertible checkbox. Else, hide the checkboxes and their
         * labels.
         */
        if (that.options.actionsWithBackgroundOption.includes(selectedAction) || that.options.actionsWithInvertOption.includes(selectedAction)) {
            currentInputMenuItems[4].style.display = "unset";
            currentInputMenuItems[5].style.display = "unset";

            // Disable the checkbox.
            currentInputMenuItems[5].removeAttribute("disabled");
        }
        else {
            currentInputMenuItems[4].style.display = "none";
            currentInputMenuItems[5].style.display = "none";

            // Reset the checkbox, i.e., uncheck it.
            currentInputMenuItems[5].checked = false;

            // Remove the disabled attribute from the checkbox.
            currentInputMenuItems[5].setAttribute("disabled", "");
        }
    };

    /**
     *
     * Set all the input action dropdown menus' value to none.
     *
     * @param {Object} that - The configurationDashboard component.
     * @param {Object} saveChangesButton - The "Save Changes" button on the panel.
     *
     */
    gamepad.configurationDashboardUtils.setAllToNoneListener = function (that, saveChangesButton) {
        // Get the list of all dropdowns in the configuration panel.
        var dropdownMenusArray = document.querySelectorAll("select");

        // Set all dropdown values to none.
        fluid.each(dropdownMenusArray, function (dropdownMenu) {
            if (fluid.isDOMNode(dropdownMenu)) {
                dropdownMenu.selectedIndex = 0;

                // Hide all other input menu configuration options.
                that.changeConfigMenuOptions(dropdownMenu);
            }
        });

        // Enable the "Save Changes" button.
        saveChangesButton.removeAttr("disabled");
    };

    /**
     *
     * Set all the input action dropdown menus' value to their default value.
     *
     * @param {Object} that - The configurationDashboard component.
     * @param {Object} saveChangesButton - The "Save Changes" button on the panel.
     *
     */
    gamepad.configurationDashboardUtils.setToDefaultListener = function (that, saveChangesButton) {
        // Get the list of all dropdowns in the configuration panel.
        var dropdownMenusArray = document.querySelectorAll("select");

        /**
         * Set dropdown values to their default values and other configuration options
         * accordingly.
         */
        fluid.each(dropdownMenusArray, function (dropdownMenu, dropdownIndex) {
            if (fluid.isDOMNode(dropdownMenu)) {
                var isAxes = dropdownIndex / 16 >= 1,
                    inputIndex = dropdownIndex % 16,
                    defaultActionList = isAxes ? that.options.axesOptionsWithDefaultIndex : that.options.buttonOptionsWithDefaultIndex;

                // Find the default option index for the current input action dropdown menu.
                fluid.find(defaultActionList, function (actionDetailsArray, index) {
                    if (actionDetailsArray[2] === inputIndex) {
                        /**
                         * Set the dropdown value index to the index of the default option in
                         * the default action list.
                         */
                        dropdownMenu.selectedIndex = index;
                        return true;
                    }
                });

                /**
                 * Change other input menu configuration options according to the chosen
                 * default value of the dropdown.
                 */
                that.changeConfigMenuOptions(dropdownMenu);
            }
        });

        // Enable the "Save Changes" button.
        saveChangesButton.removeAttr("disabled");
    };

    /**
     *
     * Save the new configuration from the configuration panel when triggered.
     *
     */
    gamepad.configurationDashboardUtils.saveChangesListener = function () {
        // Get all the input configuration menus.
        var configurationMenus = document.querySelectorAll(".menu-item"),
            gamepadConfigurationWrapper = {
                gamepadConfiguration: {
                    buttons: {},
                    axes: {}
                }
            };

        // Save all the configuration options inside the gamepadConfiguration object.
        fluid.each(configurationMenus, function (configurationMenu, menuIndex) {
            if (fluid.isDOMNode(configurationMenu)) {
                var inputIndex = menuIndex % 16,
                    inputLabel = (menuIndex / 16 >= 1) ? "axes" : "buttons",
                    currentAction = fluid.get(configurationMenu.querySelector("select"), "value"),
                    speedFactorElement = configurationMenu.querySelector(".speed-factor"),
                    checkboxValueElement = configurationMenu.querySelector(".checkbox");

                // Create and store the configuration of an input.
                var inputConfiguration = {};
                inputConfiguration.currentAction = currentAction;

                /**
                 * Insert the new speed factor inside the gamepadConfiguration object (if not
                 * disabled).
                 */
                if (!speedFactorElement.hasAttribute("disabled")) {
                    var inputValue = parseFloat(speedFactorElement.value);
                    inputConfiguration.speedFactor = inputValue > 2.5 ? inputValue : 2.5;
                }

                /**
                 * Insert the third configuration option inside the gamepadConfiguration object
                 * (if not disabled).
                 */
                if (!checkboxValueElement.hasAttribute("disabled")) {
                    var thirdConfigurationOption = inputLabel === "buttons" ? "background" : "invert";
                    inputConfiguration[thirdConfigurationOption] = speedFactorElement.checked;
                }

                // Save the input in the gamepadConfiguration object.
                gamepadConfigurationWrapper.gamepadConfiguration[inputLabel][inputIndex] = inputConfiguration;
            }
        });

        // Write the new gamepadConfiguration in Chrome's localStorage.
        chrome.storage.local.set(gamepadConfigurationWrapper);
    };

    /**
     *
     * Save the new configuration from the configuration panel when triggered.
     *
     * @param {Object} saveChangesButton - The "Save Changes" button on the panel.
     * @param {Object} event - Event triggered due to change in value of any option on
     *                         the configuration panel.
     *
     */
    gamepad.configurationDashboardUtils.toggleSaveButtonState = function (saveChangesButton, event) {
        saveChangesButton = saveChangesButton[0];

        // Get information about the changed configuration option.
        var configurationOptionValue = event.target.type === "checkbox" ? event.target.checked : event.target.value,
            configurationInputName = event.target.name,
            inputProperties = configurationInputName.split("-"),
            inputType = inputProperties[0] === "button" ? "buttons" : inputProperties[0],
            inputIndex = inputProperties[1],
            configurationOption = inputProperties[2] === "action" ? "currentAction" : inputProperties[2];

        /**
         * Enable the "Save Changes" button only when the button is previously disabled
         * and the value of the configuration option is different from its previous
         * (stored) value.
         */
        chrome.storage.local.get(["gamepadConfiguration"], function (configurationWrapper) {
            var gamepadConfiguration = configurationWrapper.gamepadConfiguration;
            if (saveChangesButton.hasAttribute("disabled")) {
                var oldInputConfiguration = gamepadConfiguration[inputType][inputIndex],
                    oldValue = oldInputConfiguration[configurationOption];
                if (!(configurationOption in oldInputConfiguration && oldValue === configurationOptionValue)) {
                    saveChangesButton.removeAttribute("disabled");
                }
            }
        });
    };

    /**
     *
     * Save the new configuration from the configuration panel when triggered.
     *
     * @param {Object} that - The configurationDashboard component.
     * @param {Object} setAllToNoneButton - The "Set All to None" button on the panel.
     * @param {Object} restoreDefaultsButton - The "Restore Default Controls" button on the panel.
     * @param {Object} saveChangesButton - The "Save Changes" button on the panel.
     *
     */
    gamepad.configurationDashboardUtils.attachListeners = function (that, setAllToNoneButton, restoreDefaultsButton, saveChangesButton) {
        // Attach listener to all configuration options to toggle "Save Changes" button.
        var configurationOptions = document.querySelectorAll("select, .speed-factor, .checkbox");
        fluid.each(configurationOptions, function (configurationOption) {
            if (fluid.isDOMNode(configurationOption)) {
                configurationOption.addEventListener("input", function (event) {
                    that.toggleSaveButtonState(event);
                });
            }
        });

        // Attach click listener to all the buttons.
        setAllToNoneButton.click(that.setAllToNoneListener);
        restoreDefaultsButton.click(that.setToDefaultListener);
        saveChangesButton.click(that.saveChangesListener);
    };
})(fluid);
