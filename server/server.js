const WebSocket  = require('ws')
const http = require("http")
const static = require('node-static')

const wss = new WebSocket.Server({port: 3000})
const file = new static.Server('../client/public')
http.createServer(function (request, response) {
    request.addListener('end', function () {
    file.serve(request, response);
    }).resume()
    }).listen(8080)

let clients = new Set()

http.createServer((req, res) => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

let data = {
    employees: [{
        name: {
            value: "Пустота Пётр Иванович",
            isEditing: false
        },
        position: {
            value: "Junior QA",
            isEditing: false
        },
        salary: {
            value: "30k",
            isEditing: false
        },
        status: {
            value: "Сотрудник",
            isEditing: false
        }, 
        employmentData: {
            value: "30-02-2213",
            isEditing: false
        }
    }, {
        name: {
            value: "Татарский Вавилен Александрович",
            isEditing: false
        },
        position: {
            value: "Project manager",
            isEditing: false
        },
        salary: {
            value: "67К",
            isEditing: false
        },
        status: {
            value: "Сотрудник",
            isEditing: false
        }, 
        employmentData: {
            value: "02-02-2213",
            isEditing: false
        }
    }]
}
wss.on('connection', function open(ws){
    ws.send(JSON.stringify(data))
    clients.add(ws)
    ws.on('message', function incoming(d) {
        data.employees = JSON.parse(d).employees
        for(let client of clients) {
            if(client !== ws && client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(data))
            }
        }
    })
})



wss.on('close', function(){
    clients.delete(ws)
})