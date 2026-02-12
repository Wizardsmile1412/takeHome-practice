interface PersonData {
    name: string;
    age: number;
}

interface AgeGroup {
    teen: string[];
    adult: string[];
    senior: string[];
}

const people1 = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 },
    { name: "David", age: 70 },
    { name: "Eve", age: 18 },
    { name: "Frank", age: 65 },
    { name: "Grace", age: 12 }
]

function getAgeGroup(age: number): keyof AgeGroup | null {
    if (age >= 13 && age <= 19) return "teen";
    else if (age >= 20 && age <= 59) return "adult";
    else if (age >= 60) return "senior";
    return null;
}

function filterAge( people: PersonData[]): AgeGroup {
    return people.reduce<AgeGroup>(
        (result, {name, age}) => {
            const group = getAgeGroup(age);
            if (group) result[group].push(name);
            return result;
        }, 
        {teen: [], adult:[], senior:[]}
    )
}

console.log(filterAge(people1)) 
/* {
    teen: [ 'Alice', 'Eve' ],
    adult: [ 'Bob', 'Charlie' ],
    senior: [ 'David', 'Frank' ]
} */