define(function (require) {
    "use strict";

    require('../ngModule').factory('flume.ComponentSaver', getComponentSaver);

    getComponentSaver.$inject = ["$q", "flume.restService"];

    function getComponentSaver($q, restService) {

        function ComponentSaver(source, configFilePath) {
            this.source = source;

            // stub interceptor
            this.beforeSaveInterceptor = function (fulfilled, data) {
            };

            // stub interceptor
            this.afterSaveInterceptor = function (fulfilled, data) {
            };
        }

        ComponentSaver.EVENTS = {};

        ComponentSaver.prototype = {
            registerBeforeSaveInterceptor: function (interceptor) {
                this.beforeSaveInterceptor = interceptor;
            },
            registerAfterSaveInterceptor: function (interceptor) {
                this.afterSaveInterceptor = interceptor;
            },
            save: function (module, moduleFilePath, agent) {
                let self = this;
                this.beforeSaveInterceptor();
                return $q(function (resolve, reject) {
                    let operations = [];
                    let pipelineOperation = {
                        name: 'pipeline',
                        hideSuccessNotification: false,
                        hideErrorNotification: false,
                        promise: restService.updateModule(self.source, module, moduleFilePath)
                    };
                    let agentOperation = {
                        name: 'agent properties',
                        hideSuccessNotification: true,
                        hideErrorNotification: false,
                        promise: restService.updateAgent(self.source, agent)
                    };
                    operations.push(pipelineOperation, agentOperation);
                    let promises = operations.map((o) => {
                        let p = o.promise;
                        delete o.promise;
                        return p;
                    });

                    $q.allSettled(promises).then(function (settled) {
                        let results = {resolved: [], rejected: []};
                        settled.forEach((result, index) => {
                            let operation = operations[index];
                            if (result.state === 'fulfilled') {
                                operation.value = result.value;
                                results.resolved.push(operation);
                            } else {
                                operation.reason = result.reason.message;
                                results.rejected.push(operation);
                            }
                        });

                        let fulfilled = results.rejected.length === 0;
                        $q.when(self.afterSaveInterceptor(fulfilled, results)).finally(()=>resolve(results));
                    })
                });
            }
        };

        return ComponentSaver;
    }

});