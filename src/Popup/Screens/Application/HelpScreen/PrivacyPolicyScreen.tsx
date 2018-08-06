import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import privacyContent from 'resources/views/privacy.md';

export const PrivacyPolicyScreen = () => (
    <div className="scroll-wrapper">
        <TrackScreenView trackLabel="help-privacy" />

        <div className="card">
            <h1 className="title">Privacy Policy</h1>

            <div dangerouslySetInnerHTML={{ __html: privacyContent }} className="legal__content" />
        </div>
    </div>
);
