'use strict';

angular.module('sirTrevorAngular')
    .provider('sirTrevorRemote', function SirTrevorRemoteProvider() {

        // Global Sit-Trevor.js options
        var self = this;
        this.globalOptions = {};
        self.DEFAULT_SIR_TREVOR_ID = '__DEFAULT_SIR_TREVOR_EDITOR_ID__';

        self.setDefaults = function(defaults) {
            window.SirTrevor.setDefaults(defaults);
        };

        this.$get = ['$q',
            function($q) {

                var editorStore = {},
                    exports = {},
                    initStoreForId,
                    resolveInStoreById;

                exports.globalOptions = self.globalOptions;

                exports.getEditor = function(id) {
                    id = id || self.DEFAULT_SIR_TREVOR_ID;
                    if (!editorStore.hasOwnProperty(id)) {
                        initStoreForId(id);
                    }
                    return editorStore[id].deferred.promise;
                };

                exports.update = function(id) {
                    id = id || self.DEFAULT_SIR_TREVOR_ID;
                    window.SirTrevor.getInstance(id).onFormSubmit();
                };

                exports.getData = function(id) {
                    id = id || self.DEFAULT_SIR_TREVOR_ID;
                    return window.SirTrevor.getInstance(id).dataStore;
                };

                exports.register = function(stOptions, blocks, id) {
                    stOptions.el.val(JSON.stringify(blocks));
                    id = id || self.DEFAULT_SIR_TREVOR_ID;
                    var editor = new window.SirTrevor.Editor(stOptions);
                    editor.ID = id;
                    if (!editorStore.hasOwnProperty(id)) {
                        initStoreForId(id);
                    }
                    if (editorStore[id].isResolved) {
                        initStoreForId(id);
                    }
                    resolveInStoreById(editor, id);
                };

                exports.unregister = function(id) {
                    id = id || self.DEFAULT_SIR_TREVOR_ID;
                    // Delete the actual instance of Sir Trevor
                    angular.forEach(window.SirTrevor.instances,
                        function(instance, index) {
                            if (instance.ID === id)
                                window.SirTrevor.instances.splice(index, 1);
                        });
                    if (editorStore.hasOwnProperty(id)) {
                        delete editorStore[id];
                    }
                };

                initStoreForId = function(id) {
                    editorStore[id] = {
                        deferred: $q.defer(),
                        isResolved: false
                    };
                };

                resolveInStoreById = function(editor, id) {
                    editorStore[id].deferred.resolve(editor);
                    editorStore[id].isResolved = true;
                };

                return exports;
            }
        ];

        return this;

    });
