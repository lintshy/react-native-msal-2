import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RNMSALStackContainer } from './src/Navigation'
import ErrorBoundary from './src/Common/ErrorBoundary'



export default function App() {



  return (
   
      <ErrorBoundary>
 
          <NavigationContainer>
            <RNMSALStackContainer></RNMSALStackContainer>
          </NavigationContainer>

      </ErrorBoundary>




  );
}
