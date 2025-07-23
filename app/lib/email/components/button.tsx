// app/lib/email/components/button.tsx
import {Button as REButton} from '@react-email/components';
import * as React from 'react';

interface EmailButtonProps {
    href: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export function EmailButton({href, children, style}: EmailButtonProps) {
    return (
        <REButton
            href={href}
            style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block',
                margin: '20px 0',
                ...style,
            }}
        >
            {children}
        </REButton>
    );
}
