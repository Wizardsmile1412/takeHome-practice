import { faker } from "@faker-js/faker";
import type { Property } from "../types/property";

// Static data arrays
const LOCATIONS = [
    "Sukhumvit", "Silom", "Ari", "Thonglor", "Ekkamai",
    "Chiang Mai Old City", "Nimman", "Phuket Town", "Patong",
    "Hua Hin", "Pattaya", "Khon Kaen", "Udon Thani", "Sathorn",
    "On Nut", "Bearing", "Bang Na",
];

const LANDMARKS = [
    "BTS Station", "Central Mall", "Night Market",
    "University", "Hospital", "Airport Link",
]

// Weighted helpers
function weightedPrice(): number {
    //70% chance -> common rental range, 30% ->cheap/luxury outlier
    return Math.random() < 0.7
        ? faker.number.int({ min: 8_000, max: 25_000 })
        : faker.number.int({ min: 5_000, max: 80_000 });
}

function weightedBedrooms(): number {
    const roll = Math.random();
    if (roll < 0.35) return 1; // 35% studio/1BR
    if (roll < 0.65) return 2; // 30% 2BR
    if (roll < 0.85) return 3; // 20% 3BR
    if (roll < 0.95) return 4; // 10% 4BR
    return 5;                  //  5% 5BR
}

function bathroomsFor(bedrooms: number): number {
    // Correlated: small units share bathrooms, big units have more
    if (bedrooms <= 1) return 1;
    if (bedrooms <= 3) return faker.number.int({ min: 1, max: 2 });
    return faker.number.int({ min: 2, max: 3 })
}

// Title generator
function buildTitle(bedrooms: number, location: string): string {
    const templates = [
        `Modern ${bedrooms}BR Condo in ${location}`,
        `Cozy Studio near ${faker.helpers.arrayElement(LANDMARKS)}`,
        `Spacious ${bedrooms}-Bedroom Apartment, ${location}`,
        `${location} ${bedrooms}BR - City View`,
        `Brand New ${bedrooms}BR Unit in ${location}`
    ];
    return faker.helpers.arrayElement(templates);
}

//Available date: random day within next 6 months
function availableDateWithinSixMonths(): string {
    const today = new Date();
    const sixMonthsLater = new Date(today);
    sixMonthsLater.setMonth(today.getMonth() + 6);

    const randomDate = faker.date.between({ from: today, to: sixMonthsLater });
    return randomDate.toISOString().split("T")[0]; // "2025-09-14"
}

// Main generator
function generateProperties(count = 1000): Property[] {
    return Array.from({ length: count }, (_, i) => {
        const id = i + 1;
        const location = faker.helpers.arrayElement(LOCATIONS);
        const bedrooms = weightedBedrooms();

        return {
            id,
            image: `https://placehold.co/600x400?text=Property+${id}`,
            title: buildTitle(bedrooms, location),
            location,
            price: weightedPrice(),
            bedrooms,
            bathrooms: bathroomsFor(bedrooms),
            availableDate: availableDateWithinSixMonths(),
            description: faker.lorem.sentences(faker.number.int({ min:2, max:3 })),
        };
    });
}

// Export once at module level (not inside a component)
export const properties = generateProperties();