var cds = require('@sap/cds');
const { INSERT, SELECT } = require('@sap/cds/lib/ql/cds-ql');
var WebSocket = require('ws');
const axios = require('axios');
module.exports = async srv =>{

    const broadcastUpdate = (wss, data) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };
    srv.on('HiTSocket', async(req,res)=>{
        try {

            let data1 =  req.data.DATA;

              await callCreateJobFeed(data1)

            

            //   broadcastUpdate(global.wss, { action: 'HiTSocket', data: data1 });
        } catch (error) {
            console.log(error)
        }
    })

    srv.on('onPost',async (req,res)=>{
        try {
            let ID_  =  Math.floor(Math.random() * 8596 ) + "S";
            let obj = {
                ID:ID_,
                DATA:req.data.DATA
            }
           let response = await cds.run(INSERT.into("TABS_E_LEARN").entries(obj))
           console.log(response)
        } catch (error) {
            console.log("logged")
        }
    })

    srv.on('onWaiting',async (req,res)=>{
        const jobID = req.data.ID; 
    
        try {

          
            let get_file =  await cds.run(`select * from TABS_E_LEARN where ID = '7708S'`)
            let ID  = get_file[0].ID
            let Base64_file = get_file[0].DATA;
            if (!Base64_file) {
                WebSocket.send(JSON.stringify({ error: 'File not found' }));
                WebSocket.close();
                return;
            }
            const chunkSize = 1024 * 1024; // 1 MB per chunk
            let offset = 0;
            // const chunk = Base64_file.slice(offset, offset + chunkSize);
            // const stringData = chunk.toString('utf8'); // You can use 'ascii', 'utf8', 'base64', etc.
            // console.log(stringData); // Output: Hello

            broadcastUpdate(global.wss, { action: 'onFileTransferStart', ID, status: 'started' });

            while (offset < Base64_file.length) {

                const chunk = Base64_file.slice(offset, offset + chunkSize);
                const stringData = chunk.toString('utf8'); // You can use 'ascii', 'utf8', 'base64', etc.
                
                broadcastUpdate(global.wss, { action: 'onFileTransferChunk', stringData });
                offset += chunkSize;
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            if (offset >= Base64_file.length) {
                broadcastUpdate(global.wss, { action: 'onFileTransferComplete', ID, status: 'completed' });
                req.reply({ status: 'File transfer completed' });
            } else {
                req.reply({ status: 'File transfer interrupted' });
            }
            

        } catch (error) {
            
            return {
                jobID: jobID,
                status: "Error starting the job",
                error: error.message
            };
        }
    })

    async function getJobStatusFromLogs(jobId) {
        let get = await callCreateJobFeed(jobId);
        console.log("calling")
  
        let get_status = await cds.run(`select * from TABS_GET_JOBS where STATUS = 'PENDING' AND JOB_NAME ='${jobId}'`)


        let status = (get_status.length == 0 )? true :false;

     
        return status; 
    }

    function callCreateJobFeed(jobID) {

        const url = 'https://060a0275trial-dev-websockects-srv.cfapps.us10-001.hana.ondemand.com/v2/catalog/JOBlogs';

        let data ={
            ZQUOTATION:"te",
            VBELN:'t'
        }

        let daaa = {
            ID: Math.floor(Math.random()* 85963 ) +"ws",
            JOB_NAME:jobID,
            STATUS:'PENDING'
        }

        axios.post(url, daaa,)
            .then(response => {
                console.log('Response:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });


    }
}