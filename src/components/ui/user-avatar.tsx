import Image from 'next/image';

interface UserAvatarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null | undefined;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base'
    };

    const sizeClass = sizeClasses[size];

    if (!user) {
        return (
            <div className={`bg-gray-100 rounded-full flex items-center justify-center ${sizeClass} ${className}`}>
                <span className="text-gray-600 font-semibold">U</span>
            </div>
        );
    }

    // If user has a profile image, display it
    if (user.image) {
        return (
            <Image
                src={user.image}
                alt={user.name || 'User avatar'}
                width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
                height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
                className={`rounded-full object-cover ${sizeClass} ${className}`}

            />
        );
    }

    // Fallback to initials
    const initials = user.name?.charAt(0) || user.email?.charAt(0) || 'U';

    return (
        <div className={`bg-blue-100 rounded-full flex items-center justify-center ${sizeClass} ${className}`}>
            <span className="text-blue-600 font-semibold">{initials}</span>
        </div>
    );
}
