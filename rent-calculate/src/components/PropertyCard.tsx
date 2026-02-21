import type { Property } from "../types/property";
import { formatPrice, formatAvailableDate } from "../utils/formatters";

interface PropertyCardProps {
    property: Property;
    onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
    return (
        <div
        onClick={onClick}
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer h-full"
        >
            <img
                src={property.image}
                alt={property.title}
                loading="lazy"
                className="w-full h-36 object-cover"
            />
            <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{property.location}</p>
                <p className="text-blue-600 font-bold text-sm mt-1">{formatPrice(property.price)}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-600">
                    <span>🛏 {property.bedrooms} bed</span>
                    <span>🚿 {property.bathrooms} bath</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatAvailableDate(property.availableDate)}</p>
            </div>
        </div>
    )
}