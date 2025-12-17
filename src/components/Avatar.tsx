interface AvatarProps {
    name: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AVATAR_COLORS = [
    '#f87171', '#fb923c', '#fbbf24', '#a3e635',
    '#34d399', '#22d3d8', '#38bdf8', '#818cf8',
    '#a78bfa', '#e879f9', '#f472b6', '#fb7185',
];

function getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ name, color, size = 'md' }: AvatarProps) {
    const bgColor = color || getColorFromName(name);
    const initials = getInitials(name);

    const sizeClass = {
        sm: 'avatar-sm',
        md: '',
        lg: 'avatar-lg',
        xl: 'avatar-xl',
    }[size];

    return (
        <div
            className={`avatar ${sizeClass}`}
            style={{ backgroundColor: bgColor }}
        >
            {initials}
        </div>
    );
}

interface AvatarGroupProps {
    names: string[];
    max?: number;
    size?: 'sm' | 'md';
}

export function AvatarGroup({ names, max = 3, size = 'sm' }: AvatarGroupProps) {
    const visible = names.slice(0, max);
    const remaining = names.length - max;

    return (
        <div className="avatar-group">
            {visible.map((name) => (
                <Avatar key={name} name={name} size={size} />
            ))}
            {remaining > 0 && (
                <div
                    className={`avatar ${size === 'sm' ? 'avatar-sm' : ''}`}
                    style={{ backgroundColor: 'var(--color-gray-400)' }}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
}
