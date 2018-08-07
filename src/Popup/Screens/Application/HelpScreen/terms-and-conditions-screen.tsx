import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import { LegalContent } from 'Popup/components/legal-content';
import termsContent from 'resources/views/terms.md';

export const TermsAndConditionsScreen = () => (
    <div className="scroll-wrapper">
        <TrackScreenView trackLabel="help-terms" />

        <div className="card">
            <h1 className="title">Terms & Conditions</h1>
            <div style={{ textAlign: 'center' }}>Last updated on Jan 2, 2018</div>

            <LegalContent>{termsContent}</LegalContent>
        </div>
    </div>
);
