import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Property } from "../types/property";
import { formatPrice, formatAvailableDate } from "../utils/formatters";

interface PropertyModalProps {
    property: Property
    onClose: () => void
}

export default function PropertyModal({ property, onClose}: PropertyModalProps) {
    //Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    //Body scroll lock
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = ''}
    }, [])

    return createPortal(
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Image */}
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-56 object-cover rounded-t-xl"
                />

                {/* Content */}
                <div className="p-5">

                    {/* Close Button */}
                    <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900">{property.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-2"
                        >
                            x
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm mb-3">{property.location}</p>
                    <p className="text-blue-600 font-bold text-2xl mb-4">{formatPrice(property.price)}</p>

                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                        <span>🛏 {property.bedrooms} bedrooms</span>
                        <span>🚿 {property.bathrooms} bathrooms</span>
                    </div>

                    {property.description && (
                        <p className="text-gray-700 text-sm mb-4">{property.description}</p>
                    )}

                    <p className="text-xs text-gray-400">
                        Available: {formatAvailableDate(property.availableDate)}
                    </p>

                </div>
            </div>
        </div>,
        document.body // Portal mount ที่นี่
    )
}