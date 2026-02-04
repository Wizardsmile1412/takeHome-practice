interface PumpData {
    flowRate: number; // m³/h 
    head: number; // m
    efficiency: number; // %
    power: number; // kW
}

const pumpMap1 = new Map<string, PumpData>();

pumpMap1.set("KDIN40-10", {
    flowRate: 60,
    head: 15,
    efficiency: 55,
    power: 4
});

pumpMap1.set("KDIN65-16", {
    flowRate: 85,
    head: 22,
    efficiency: 66,
    power: 6.5
});

pumpMap1.set("KDIN80-20", {
    flowRate: 100,
    head: 25,
    efficiency: 70,
    power: 8
});

// console.log(pumpMap)

function selectPump1(pumpMap: Map<string, PumpData>, flow: number, head: number, minEfficiency: number = 60): { model: string; data: PumpData } | null {
    let selectedPumpModel = "";
    let minPower = Infinity;
    let selectedData: PumpData | undefined;


    for (const [model, data] of pumpMap) {
        if (data.flowRate >= flow && data.head >= head && data.efficiency >= minEfficiency) {
            if (data.power < minPower) {
                minPower = data.power;
                selectedPumpModel = model;
                selectedData = data;
            }
        }
    }

    if (selectedData) {
        return { model: selectedPumpModel, data: selectedData };
    }
    return null;

}

const result = selectPump1(pumpMap1, 80, 20);
if (result) {
    console.log(`Model: ${result.model}`);
    console.log(`Efficiency: ${result.data.efficiency}%`);
    console.log(`Power: ${result.data.power} kW`);
} else {
    console.log("No matching model");
}
