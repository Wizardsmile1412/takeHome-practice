export function formatPrice(price: number): string {
    return `฿${price.toLocaleString('en-US')}/month`;
}

export function formatAvailableDate(isoDate: string): string {
    const date = new Date(isoDate);
    return `Available ${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })}`
}

