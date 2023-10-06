import React from 'react'
import { View, Text } from 'react-native'

import { ErrorScreen } from '../Screens';

type ContainerProps = {
    children: React.ReactNode
}

class ErrorBoundary extends React.Component<{ children: any }> {
    public state: { hasError: boolean, error: any }
    constructor(props: { children: any }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {

        console.log('in error boundary')
        this.setState({ error, hasError: true })

    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <ErrorScreen />
        }

        return this.props.children
    }
}
export default ErrorBoundary