// app/lib/email/components/email-layout.tsx
import {Body, Container, Head, Html, Section, Text, Img} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
    children: React.ReactNode;
    previewText?: string;
}

export function EmailLayout({children, previewText}: EmailLayoutProps) {
    return (
        <>
            <Head>
                <style>{`
          @media (max-width: 600px) {
            .mobile-hidden { display: none !important; }
            .mobile-full { width: 100% !important; }
          }
        `}</style>
            </Head>
            <Body style={{backgroundColor: '#f9fafb', margin: 0, padding: 0}}>
                <Container style={{maxWidth: '600px', margin: '0 auto', backgroundColor: 'white'}}>
                    {/* Header */}
                    <Section
                        style={{
                            backgroundColor: '#1f2937',
                            padding: '20px',
                            textAlign: 'center',
                        }}
                    >
                        <Img src="https://your-domain.com/logo-white.png" alt="ArtSwap" width="120" style={{margin: '0 auto'}} />
                    </Section>
                    {/* Content */}
                    {children}
                    {/* Footer */}
                    <Section
                        style={{
                            backgroundColor: '#f3f4f6',
                            padding: '20px',
                            textAlign: 'center',
                            borderTop: '1px solid #e5e7eb',
                        }}
                    >
                        <Text style={{fontSize: '12px', color: '#6b7280', margin: 0}}>© 2024 ArtSwap. All rights reserved.</Text>
                        <Text style={{fontSize: '12px', color: '#6b7280', margin: '5px 0 0 0'}}>
                            <a href="{unsubscribe_url}" style={{color: '#6b7280'}}>
                                Unsubscribe
                            </a>{' '}
                            |{' '}
                            <a href="https://your-domain.com/privacy" style={{color: '#6b7280', marginLeft: '5px'}}>
                                Privacy Policy
                            </a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </>
    );
}
