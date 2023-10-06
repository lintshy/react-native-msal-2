import React, { FC } from 'react';

import { AuditDataContextProvider } from './AuditData';
import { ApiContextProvider } from './ApiContext';

type ContainerProps = {
    children: React.ReactNode
}

export const HDAuditContextProvider = ({ children }: ContainerProps) => (

    <ApiContextProvider>
        <AuditDataContextProvider>{children}</AuditDataContextProvider>
    </ApiContextProvider>

)
