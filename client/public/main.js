const store = new Vuex.Store({
    state: {
        employees: null
    },
    mutations: {
        editField(state, payload){
            state.employees[payload.index][payload.secondIndex].isEditing = true
            state.employees[payload.index][payload.secondIndex].isLocalEditing = true
            localStorage.data = JSON.stringify(state.employees)
        },
        saveField(state, payload){
            state.employees[payload.index][payload.secondIndex].isEditing = false
            state.employees[payload.index][payload.secondIndex].isLocalEditing = false
            localStorage.data = JSON.stringify(state.employees)
        },
        loadData(state, payload){
            let data = JSON.parse(payload).employees
            if(data !== localStorage.data){
                for (let i = 0; i < data.length; i++) {
                    if(i < data.length - 1){
                        for (let key in data[i]) {
                            if(state.employees !== null){
                                console.log(state.employees[i][key])
                                if(!state.employees[i][key].hasOwnProperty("isLocalEditing")){
                                    data[i][key].isLocalEditing = false
                                }else if(!state.employees[i][key].isLocalEditing){
                                    data[i][key].isLocalEditing = false
                                }
                                else{
                                    data[i][key].isLocalEditing = true
                                }
                            }   
                        }
                    }else{
                        for (let key in data[i]) {
                            if(state.employees !== null){{
                                data[i][key].isLocalEditing = false
                            }
                        }
                    }
                    }
                }    
                state.employees = data
                localStorage.data = JSON.stringify(data)
            }else{
                state.employees = localStorage.data
            }
            
        },
        addEntry(state){
            const newEntry = {
                    name: {
                        value: "Фамилия Имя Отчество",
                        isEditing: false,
                        isLocalEditing: false
                    },
                    position: {
                        value: "Должность",
                        isEditing: false,
                        isLocalEditing: false
                    },
                    salary: {
                        value: "Оклад",
                        isEditing: false,
                        isLocalEditing: false
                    },
                    status: {
                        value: "Сотрудник",
                        isEditing: false,
                        isLocalEditing: false
                    }, 
                    employmentData: {
                        value: "00-00-0000",
                        isEditing: false,
                        isLocalEditing: false
                    }
            }
            state.employees.push(newEntry)
            localStorage.data = JSON.stringify(state.employees)
        }
    }
})

let app = new Vue({ 
    el: "#app",
    store: store,
    beforeCreate:  function() {
        this.ws = new WebSocket("ws://localhost:3000")
        this.ws.onmessage = async (e) => {
            await store.commit("loadData", e.data)
        }
    },
    computed: {
        employees(){
            return store.state.employees
        }
    },
    methods: {
        editField: function(index, col, secondIndex) {
                const payload = {
                    index: index,
                    secondIndex: secondIndex
                }
                store.commit("editField", payload)
                this.ws.send(JSON.stringify(store.state))
            
        },
        saveField: function(index, col, secondIndex) {
            const payload = {
                index: index,
                secondIndex: secondIndex
            }
            store.commit("saveField", payload)
            this.ws.send(JSON.stringify(store.state))
        },
        addEntry: function(e){
            store.commit("addEntry")
            this.ws.send(JSON.stringify(store.state))
        }
    }
});
