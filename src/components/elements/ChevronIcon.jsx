import { ICONS } from '@/utils/icons';

export function ChevronIcon({
    open = false,
    size = 20,
    className = '',
}) {
    return open ? (
        <ICONS.chevronUp size={size} className={className} />
    ) : (
        <ICONS.chevronDown size={size} className={className} />
    );
}