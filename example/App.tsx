import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query'
import { FileLogger } from 'react-native-file-logger'

import { HDAuditStackContainer } from './src/Navigation'
import { HDAuditContextProvider } from './src/Contexts'
import ErrorBoundary from './src/Common/ErrorBoundary'

const queryClient = new QueryClient()

export default function App() {
  React.useEffect(() => {
    async function init() {
      const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      if (res === 'granted') {
        FileLogger.configure({
          logsDirectory: '/storage/emulated/0/Download/shipaudit'
        })
        return
      }
      FileLogger.configure({
        dailyRolling: true
      })
    }
    init()
  })


  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <HDAuditContextProvider>
          <NavigationContainer>
            <HDAuditStackContainer></HDAuditStackContainer>
          </NavigationContainer>
        </HDAuditContextProvider>
      </ErrorBoundary>

    </QueryClientProvider>


  );
}
