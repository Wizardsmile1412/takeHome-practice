interface PersonData {
    name: string;
    age: number;
}

interface AgeGroup {
    teen: string[];
    adult: string[];
    senior: string[];
}

const people = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 },
    { name: "David", age: 70 },
    { name: "Eve", age: 18 },
    { name: "Frank", age: 65 },
    { name: "Grace", age: 12 }
]

function filterAge( people: PersonData[]): AgeGroup {
    let result: AgeGroup = {teen:[], adult:[], senior: []};

    for (const {name, age} of people) {
        if(age >= 13 && age <= 19){
            result.teen.push(name)
        } else if (age >= 20 && age <= 59){
            result.adult.push(name)
        } else if (age >= 60){
            result.senior.push(name)
        }
    }

    return result;
}

console.log(filterAge(people)) 
/* {
    teen: [ 'Alice', 'Eve' ],
    adult: [ 'Bob', 'Charlie' ],
    senior: [ 'David', 'Frank' ]
} */