import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet } from 'react-native'

import { HomeScreen, Login, ErrorScreen } from '../Screens'

const Stack = createNativeStackNavigator()

export function onLogout(navigation: any) {
    navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    })
}

export function RNMSALStackContainer() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={'Login'}
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'Home'}
                component={HomeScreen}
                options={({ navigation, route }) => ({
                    headerStyle: styles.header,
                    headerShadowVisible: false,
                })}
            ></Stack.Screen>

            <Stack.Screen
                name={'Error'}
                component={ErrorScreen}
                options={{ headerShown: false }}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ffffff',
    },
    headerNonHome: {
        backgroundColor: '#F0F0F0',
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
    },
    backButton: {
        color: 'white',
    },
    headerText: {
        marginLeft: 4,
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
