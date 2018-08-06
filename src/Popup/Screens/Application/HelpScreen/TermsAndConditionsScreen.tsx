import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import termsContent from 'resources/views/terms.md';

export const TermsAndConditionsScreen = () => (
    <div className="scroll-wrapper">
        <TrackScreenView trackLabel="help-terms" />

        <div className="card">
            <h1 className="title">Terms & Conditions</h1>

            <div dangerouslySetInnerHTML={{ __html: termsContent }} className="legal__content" />
        </div>
    </div>
);
