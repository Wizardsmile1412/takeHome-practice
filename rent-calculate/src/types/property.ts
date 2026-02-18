export interface Property {
    id: number;
    image: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    availableDate: string; // ISO date string e.g. "2025-09-01"
    description?: string; // Optional, only used in the modal
}