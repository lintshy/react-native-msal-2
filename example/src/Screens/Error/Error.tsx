import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, PermissionsAndroid } from 'react-native'


import { commonStyles } from '../../styles'
import { NavigationRoutes } from '../../Constants'





export const ErrorScreen: React.FC<any> = ({ route, navigation }) => {
    const error = route?.params?.error
    
 

    let safeErrorText = ``
    try {
        safeErrorText = JSON.stringify(error)
    }
    catch (e) {
        safeErrorText = `Unable to parse error`
    }



    return <View style={[commonStyles.pageBase, styles.container]}>
        <Text style={styles.errorMessage}>{'Error'}</Text>
        <Text></Text>
        <Pressable style={styles.submit} onPress={() => {
            navigation.reset({
                index: 0,
                routes: [{ name: NavigationRoutes.Login }],
            });
        }}>
            <Text>{'Retry'}</Text>
        </Pressable>
      
    </View >
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2d2e2d',
    },
    errorText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    errorMessage: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18
    },
    subTitleContainer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

    },
    submit: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        marginTop: 20,
        backgroundColor: '#fcd703',
        width: '40%'
    },
})