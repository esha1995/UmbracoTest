(function () {
    'use strict';

    function browserDashboard($scope, appState, uSyncPublishService, uSyncPublishDialogManager) {

        var vm = this;

        vm.section = appState.getSectionState('currentSection');

        vm.servers = [];
        vm.server = {};
        vm.picked = false;

        vm.openDialog = openDialog;
        vm.getFolders = getFolders;
        vm.clearSelection = clearSelection;
        vm.onSelected = onSelected;

        vm.selectionLabel = 'Pull selection';

        vm.selectLocal = selectLocal;
        vm.local = false;

        vm.rootKey = '00000000-0000-0000-0000-000000000000';

        vm.isBlank = false;
        vm.mode = 'pull';

        vm.items = {
            folders: [],
            nodes: []
        };

        uSyncPublishService.getServers(vm.mode)
            .then(function (result) {
                vm.servers = result.data;
                checkServers(vm.servers);
            });

        uSyncPublishService.hasContentOrMedia(false)
            .then(function (result) {
                vm.isBlank = !result.data;
            });


        vm.layouts = [
            {
                name: 'Grid',
                icon: 'icon-thumbnails-small',
                path: 'gridpath',
                selected: true,
                active: true
            },
            {
                name: 'List',
                icon: 'icon-list',
                path: 'listpath',
                selected: true
            }
        ];

        if (vm.section === 'content') {
            vm.activeLayout = vm.layouts[1];
            vm.layouts[0].active = false;
            vm.layouts[1].active = true;
        }
        else {
            vm.activeLayout = vm.layouts[0];
        }

        ///////////

        vm.pageNum = 1;
        vm.onNextPage = onNextPage;
        vm.onPrevPage = onPrevPage;
        vm.onChangePage = onChangePage;
        vm.onGotoPage = onGotoPage;


        function onNextPage(pageNumber) {
            loadPage(pageNumber);
        }

        function onPrevPage(pageNumber) {
            loadPage(pageNumber);
        }

        function onChangePage(pageNumber) {
            loadPage(pageNumber);
        }

        function onGotoPage(pageNumber) {
            loadPage(pageNumber);
        }

        function loadPage(pageNumber) {
            vm.pageNum = pageNumber;
            if (vm.currentKey != null) {
                getFolders(vm.currentKey, vm.pageNum, false);
            }
            else {
                onSelected(vm.server, vm.pageNum);
            }

        }


        ///////////


        function checkServers(servers) {
            servers.forEach(function (server) {
                uSyncPublishService.checkServer(server.alias)
                    .then(function (result) {
                        server.status = result.data;
                    });
            });
        }
      
        //////////////
        function openDialog() {

            if (vm.section === 'content') {
                if (vm.local) {
                    uSyncPublishDialogManager.openPublisherPushContent({
                        items: vm.selected
                    }, function (result) {
                        if (result) {
                            refresh();
                        }
                    });
                }
                else {
                    uSyncPublishDialogManager.openPublisherPullContent({
                        serverAlias: vm.server.alias,
                        items: vm.selected
                    }, function (result) {
                        if (result) {
                            refresh();
                        }
                    });
                }
            }
            else {
                if (vm.local) {
                    uSyncPublishDialogManager.openPublisherPushMedia({
                        items: vm.selected
                    }, function (result) {
                        if (result) {
                            refresh();
                        }
                    });
                }
                else {
                    uSyncPublishDialogManager.openPublisherPullMedia({
                        serverAlias: vm.server.alias,
                        items: vm.selected
                    }, function (result) {
                        if (result) {
                            refresh();
                        }
                    });
                }

            }
        }

        function selectLocal() {
            vm.local = true;
            vm.selectionLabel = 'Push selection';
            vm.picked = false;
            vm.server = { name: 'local' };
            vm.servers.forEach(function (server) {
                server.selected = false;
            });
            vm.items = {};
            clearSelection();
            vm.pageNum = 1;
            getFolders(vm.rootKey, vm.pageNum);
        }


        //////////////

        function onSelected(server) {
            vm.picked = true;
            vm.local = false;
            vm.selectionLabel = 'Pull selection';
            vm.server = server;
            vm.loading = true;
            vm.pageNum = 1;
            getFolders(vm.rootKey, vm.pageNum);
        }

        function getFolders(key, page, clear = true) {
            vm.loading = true;
            vm.currentKey = key;

            if (clear) {
                clearSelection();
            }

            if (vm.local) {
                if (vm.section === 'content') {
                    uSyncPublishService.getLocalContentFolders(key, page)
                        .then(function (result) {
                            vm.items = result.data;
                            vm.loading = false;
                            checkContentItems(vm.local);
                            updateSelection();
                        });
                }
                else {
                    uSyncPublishService.getLocalMediaFolders(key, page)
                        .then(function (result) {
                            vm.items = result.data;
                            vm.loading = false;
                            checkMediaItems(vm.local);
                            updateSelection();
                        });
                }
            }
            else {

                if (vm.section === 'content') {
                    uSyncPublishService.getContentFolders(key, vm.server.alias, page)
                        .then(function (result) {
                            vm.items = result.data;
                            vm.loading = false;
                            checkContentItems(vm.local);
                            updateSelection();
                        });
                }
                else {
                    uSyncPublishService.getMediaFolders(key, vm.server.alias, page)
                        .then(function (result) {
                            vm.items = result.data;
                            vm.loading = false;
                            checkMediaItems(vm.local);
                            updateSelection();
                        });

                }
            }
        }

        function updateSelection() {

            _.forEach(vm.items.nodes, function (node) {

                var selected = _.any(vm.selected, function (s) {
                    return s.udi == node.udi
                });

                node.selected = selected;
            });
        }


        function checkContentItems(local) {

            if (local && vm.items != null) {
                setLocal(vm.items.folders);
                setLocal(vm.items.nodes);
            }
            else {

                var udis =
                    _.union(
                        _.pluck(vm.items.folders, 'udi'),
                        _.pluck(vm.items.nodes, 'udi'));

                uSyncPublishService.getContentChanges(udis, vm.server.alias)
                    .then(function (results) {
                        updateChanges(vm.items.folders, results.data);
                        updateChanges(vm.items.nodes, results.data);
                    });
            }
        }

        function setLocal(items) {
            if (items !== null && items !== undefined) {
                items.forEach(function (item) {
                    item.local = true;
                });
            }
        }

        function checkMediaItems(local) {
            if (local && vm.items != null) {
                setLocal(vm.items.folders);
                setLocal(vm.items.nodes);
            }
            else {
                var udis =
                    _.union(
                        _.pluck(vm.items.folders, 'udi'),
                        _.pluck(vm.items.nodes, 'udi'));

                uSyncPublishService.getMediaChanges(udis, vm.server.alias)
                    .then(function (results) {
                        updateChanges(vm.items.folders, results.data);
                        updateChanges(vm.items.nodes, results.data);
                    });
            }

        }

        function updateChanges(items, changes) {

            if (items !== null && items !== undefined) {
                items.forEach(function (item) {

                    var index = _.findIndex(changes, { udi: item.udi });

                    if (index != -1) {

                        item.syncChecked = true;
                        item.syncAction = changes[index].action;
                        item.syncChange = changes[index].action.change != 'NoChange';
                    }
                });
            }

        }

        function refresh() {
            clearSelection();
            vm.pageNum = 1;

            if (vm.currentKey != null) {
                getFolders(vm.currentKey, vm.pageNum);
            }
            else {
                onSelected(vm.server, vm.pageNum);
            }
        }

        function clearSelection() {
            vm.selected = [];

            clearsSelectedItems(vm.items.folders);
            clearsSelectedItems(vm.items.nodes);
        }

        function clearsSelectedItems(items) {
            if (items !== undefined && items !== null) {
                for (let i = 0; i < items.length; i++) {
                    items[i].selected = false;
                }
            }
        }

        vm.selected = [];

    }

    angular.module('umbraco')
        .controller('uSyncPublisherBrowserDashboardController', browserDashboard);

})();