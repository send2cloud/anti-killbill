/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(amount);
}

/**
 * Format currency with optional sign
 */
export function formatBalance(amount: number, currency: string = 'USD'): string {
    const formatted = formatCurrency(Math.abs(amount), currency);
    if (amount > 0) return `+${formatted}`;
    if (amount < 0) return `-${formatted}`;
    return formatted;
}

/**
 * Format date relative to now
 */
export function formatRelativeDate(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}w ago`;
    if (months < 12) return `${months}mo ago`;

    return formatDate(timestamp);
}

/**
 * Format date as short date
 */
export function formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(timestamp));
}

/**
 * Format date as full date
 */
export function formatFullDate(timestamp: number): string {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(timestamp));
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
        JPY: '¥',
        CAD: 'C$',
        AUD: 'A$',
    };
    return symbols[currency] || currency;
}
