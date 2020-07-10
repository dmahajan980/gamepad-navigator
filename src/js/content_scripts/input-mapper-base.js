/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global ally */

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.inputMapper.base");
    fluid.registerNamespace("gamepad.inputMapperUtils");

    fluid.defaults("gamepad.inputMapper.base", {
        gradeNames: ["gamepad.navigator"],
        model: {
            // TODO: Make functions used in axes to be reusable for analogue buttons.
            map: {
                buttons: {
                    // Face Button.
                    // Cross on PlayStation controller & A on Xbox controller.
                    "0": {
                        defaultAction: "click",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Face Button.
                    // Circle on PlayStation controller & B on Xbox controller.
                    "1": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Face Button.
                    // Square on PlayStation controller & X on Xbox controller.
                    "2": {
                        defaultAction: "previousPageInHistory",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Face Button.
                    // Triangle on PlayStation controller & Y on Xbox controller.
                    "3": {
                        defaultAction: "nextPageInHistory",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Left Bumper.
                    "4": {
                        defaultAction: "reverseTab",
                        currentAction: null,
                        speedFactor: 2.5
                    },
                    // Right Bumper.
                    "5": {
                        defaultAction: "forwardTab",
                        currentAction: null,
                        speedFactor: 2.5
                    },
                    // Left Trigger.
                    "6": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Right Trigger.
                    "7": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Select/Share on PlayStation controller & Back on Xbox controller.
                    "8": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Start/Options on PlayStation controller & Start on Xbox controller.
                    "9": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Left thumbstick button.
                    "10": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Right thumbstick button.
                    "11": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad up direction button.
                    "12": {
                        defaultAction: "scrollUp",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad down direction button.
                    "13": {
                        defaultAction: "scrollDown",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad left direction button.
                    "14": {
                        defaultAction: "scrollLeft",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad right direction button.
                    "15": {
                        defaultAction: "scrollRight",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Badge icon
                    // PS button on PlayStation controller & Xbox logo button.
                    // Reserved for launching reconfiguration panel.
                    "16": null,
                    // Reserved for mousepad/touchpad functionality.
                    "17": null
                },
                axes: {
                    // Left thumbstick horizontal axis.
                    "0": {
                        defaultAction: "scrollHorizontally",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Left thumbstick vertical axis.
                    "1": {
                        defaultAction: "scrollVertically",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Right thumbstick horizontal axis.
                    "2": {
                        defaultAction: "thumbstickHistoryNavigation",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Right thumbstick vertical axis.
                    "3": {
                        defaultAction: "thumbstickTabbing",
                        currentAction: null,
                        speedFactor: 2.5,
                        invert: false
                    }
                }
            }
        },
        modelListeners: {
            "axes.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            },
            "buttons.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            }
        },
        listeners: {
            "onCreate.trackDOM": "{that}.trackDOM",
            "onDestroy.stopTrackingDOM": "{that}.stopTrackingDOM",
            "onDestroy.clearIntervalRecords": "{that}.clearIntervalRecords",
            /**
             * TODO: Adjust the gamepaddisconnected event so that the other gamepad's
             * navigation doesn't break.
             */
            "onGamepadDisconnected.clearIntervalRecords": "{that}.clearIntervalRecords"
        },
        members: {
            intervalRecords: {
                upwardScroll: null,
                downwardScroll: null,
                leftScroll: null,
                rightScroll: null,
                forwardTab: null,
                reverseTab: null
            },
            currentTabIndex: 0,
            tabbableElements: null,
            mutationObserverInstance: null
        },
        cutoffValue: 0.20,
        scrollInputMultiplier: 50,
        invokers: {
            produceNavigation: {
                funcName: "gamepad.inputMapper.base.produceNavigation",
                args: ["{that}", "{arguments}.0"]
            },
            trackDOM: {
                funcName: "gamepad.inputMapper.base.trackDOM",
                args: ["{that}"]
            },
            stopTrackingDOM: {
                "this": "{that}.mutationObserverInstance",
                method: "disconnect"
            },
            clearIntervalRecords: {
                funcName: "gamepad.inputMapper.base.clearIntervalRecords",
                args: ["{that}.intervalRecords"]
            },
            /**
             * TODO: Add tests for links and other elements that involve navigation
             * between pages.
             */
            click: {
                funcName: "gamepad.inputMapperUtils.click",
                args: ["{arguments}.0"]
            },
            previousPageInHistory: {
                funcName: "gamepad.inputMapperUtils.previousPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            nextPageInHistory: {
                funcName: "gamepad.inputMapperUtils.nextPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            // TODO: Investigate, identify, and fix tab navigation issues.
            tabindexSortFilter: {
                funcName: "gamepad.inputMapper.base.tabindexSortFilter",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            reverseTab: {
                funcName: "gamepad.inputMapperUtils.reverseTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            forwardTab: {
                funcName: "gamepad.inputMapperUtils.forwardTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollUp: {
                funcName: "gamepad.inputMapperUtils.scrollUp",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollDown: {
                funcName: "gamepad.inputMapperUtils.scrollDown",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollLeft: {
                funcName: "gamepad.inputMapperUtils.scrollLeft",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollRight: {
                funcName: "gamepad.inputMapperUtils.scrollRight",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollHorizontally: {
                funcName: "gamepad.inputMapperUtils.scrollHorizontally",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollVertically: {
                funcName: "gamepad.inputMapperUtils.scrollVertically",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            thumbstickHistoryNavigation: {
                funcName: "gamepad.inputMapperUtils.thumbstickHistoryNavigation",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            // TODO: Add tests for when the number of tabbable elements changes.
            thumbstickTabbing: {
                funcName: "gamepad.inputMapperUtils.thumbstickTabbing",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            }
        }
    });

    /**
     *
     * Calls the invoker methods when axes/button is disturbed according to the
     * configured action map to produce a navigation effect.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} change - The recipt for the change in input values.
     *
     */
    gamepad.inputMapper.base.produceNavigation = function (that, change) {
        /**
         * Check if input is generated by axis or button and which button/axes was
         * disturbed.
         */
        var inputType = change.path[0],
            index = change.path[1],
            inputValue = change.value;

        var inputProperties = that.model.map[inputType][index],
            actionLabel = fluid.get(inputProperties, "currentAction") || fluid.get(inputProperties, "defaultAction");

        // Execute the actions only if the action label is available.
        if (actionLabel) {
            var action = fluid.get(that, actionLabel);

            // Trigger the action only if a valid function is found.
            if (action) {
                // Take into account the third parameter "invert" for actions linked to axes input only.
                if (inputType === "axes") {
                    action(inputValue, inputProperties.speedFactor, inputProperties.invert);
                }
                else {
                    action(inputValue, inputProperties.speedFactor);
                }
            }
        }
    };

    /**
     *
     * A listener to track DOM elements and update the list when the DOM is updated.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapper.base.trackDOM = function (that) {
        var body = document.querySelector("body"),
            MutationObserver = that.options.windowObject.MutationObserver;

        // Create an instance of the mutation observer.
        that.mutationObserverInstance = new MutationObserver(function () {
            that.tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(that.tabindexSortFilter);
        });

        // Specify the mutations to be observed.
        var observerConfiguration = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        };

        // Start observing the DOM mutations.
        that.mutationObserverInstance.observe(body, observerConfiguration);
    };

    /**
     *
     * Filter for sorting the elements; to be used inside JavaScript's sort() method.
     *
     * @param {Object} elementOne - The DOM element.
     * @param {Object} elementTwo - The DOM element.
     * @return {Integer} - The value which will decide the order of the two elements.
     *
     */
    gamepad.inputMapper.base.tabindexSortFilter = function (elementOne, elementTwo) {
        var tabindexOne = parseInt(elementOne.getAttribute("tabindex")),
            tabindexTwo = parseInt(elementTwo.getAttribute("tabindex"));

        /**
         * If both elements have tabindex greater than 0, arrange them in ascending order
         * of the tabindex. Otherwise if only one of the elements have tabindex greater
         * than 0, place it before the other element. And in case, no element has a
         * tabindex attribute or both of them posses tabindex value equal to 0, keep them
         * in the same order.
         */
        if (tabindexOne > 0 && tabindexTwo > 0) {
            return tabindexOne - tabindexTwo;
        }
        else if (tabindexOne > 0) {
            return -1;
        }
        else if (tabindexTwo > 0) {
            return 1;
        }
        else {
            return 0;
        }
    };

    /**
     *
     * A listener for the input mapper component to clear the connectivity interval when
     * the instance of the component is destroyed.
     *
     * @param {Object} records - The interval records object.
     *
     */
    gamepad.inputMapper.base.clearIntervalRecords = function (records) {
        fluid.each(records, function (record) {
            clearInterval(record);
        });
    };
})(fluid);
