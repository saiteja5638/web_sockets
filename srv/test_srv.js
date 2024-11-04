var axios = require('axios')

module.exports = async srv => {
    srv.on('getMultiInstanceCpuStatus', async (req) => {
        try {
            const vcap = JSON.parse(process.env.VCAP_APPLICATION);
            function getCurrentInstanceMetrics() {
                const used = process.memoryUsage();
                const cpuUsage = process.cpuUsage();
                
                return {
                    metrics: {
                        memory: {
                            used: Math.round(used.rss / 1024 / 1024), // MB
                            total: process.env.MEMORY_LIMIT,
                            usagePercentage: ((used.rss / (parseInt(process.env.MEMORY_LIMIT) * 1024 * 1024)) * 100).toFixed(2)
                        },
                        cpu: {
                            usage: ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2), 
                            usagePercentage: ((cpuUsage.user + cpuUsage.system) / 1000000 / 100).toFixed(2)
                        }
                    }
                };
            }
            const currentMetrics = getCurrentInstanceMetrics();
            const response = {
                applicationName: vcap.application_name,
                instances: currentMetrics,
            };


            return response;

        } catch (error) {
            console.error('Error retrieving multi-instance CPU status:', error);
            req.error(500, {
                code: 'METRICS_ERROR',
                message: 'Failed to retrieve instance metrics',
                target: 'getMultiInstanceCpuStatus',
                details: [{ 
                    message: error.message 
                }]
            });
        }
    });
};

