interface PumpData {
    flowRate: number; // m³/h 
    head: number; // m
    efficiency: number; // %
    power: number; // kW
}

const pumpMap = new Map<string, PumpData>();

pumpMap.set("KDIN40-10", {
    flowRate: 60,
    head: 15,
    efficiency: 55,
    power: 4
});

pumpMap.set("KDIN65-16", {
    flowRate: 85,
    head: 22,
    efficiency: 66,
    power: 6.5
});

pumpMap.set("KDIN80-20", {
    flowRate: 100,
    head: 25,
    efficiency: 70,
    power: 8
});

// console.log(pumpMap)

function selectPump(pumpMap: Map<string, PumpData>, flow : number, head : number): string {
    let eligiblePump = new Map<string, PumpData>();
    let selectedPumpModel = "";
    let minPower = Infinity;


    for (const [model, data] of pumpMap){
        if (data.flowRate>=flow && data.head>= head && data.efficiency>=60){
            eligiblePump.set(model, data)
        }
    }
    // console.log(eligiblePump)

    for (const [model, data] of eligiblePump){
        if(data.power<minPower){
            minPower = data.power;
            selectedPumpModel = model;
        }
    }

    if (selectedPumpModel) {
        return `Model: ${selectedPumpModel}, Efficiency: ${eligiblePump.get(selectedPumpModel)?.efficiency}%, Power: ${eligiblePump.get(selectedPumpModel)?.power} kW`
    } else {
        return "No matching model"
    }
}

console.log(selectPump(pumpMap, 80, 20))