import { useContext } from 'react';

import { ApiContext } from './ApiProvider';

export const useApiContext = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('Must be used within a ApiContextProvider');
    }

    return context;
};