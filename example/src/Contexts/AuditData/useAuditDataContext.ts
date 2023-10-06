import { useContext } from 'react';

import { AuditDataContext } from './AuditDataProvider';

export const useAuditDataContext = () => {
    const context = useContext(AuditDataContext);
    if (context === undefined) {
        throw new Error('Must be used within a AuditContextProvider');
    }

    return context;
};