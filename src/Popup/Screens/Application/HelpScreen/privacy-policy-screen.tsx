import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import { LegalContent } from 'Popup/components/legal-content';
import privacyContent from 'resources/views/privacy.md';

export const PrivacyPolicyScreen = () => (
    <div className="scroll-wrapper">
        <TrackScreenView trackLabel="help-privacy" />

        <div className="card">
            <h1 className="title">Privacy Policy</h1>

            <LegalContent>{privacyContent}</LegalContent>
        </div>
    </div>
);
