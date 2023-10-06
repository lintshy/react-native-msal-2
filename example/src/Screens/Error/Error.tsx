import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, PermissionsAndroid } from 'react-native'
import { FileLogger, SendByEmailOptions } from 'react-native-file-logger'

import { commonStyles } from '../../styles'

import { ButtonText, EmailRecepients, NavigationRoutes, StaticText, } from '../../Constants'
import { ApiConfig } from '../../Config'



export const ErrorScreen: React.FC<any> = ({ route, navigation }) => {
    const error = route?.params?.error
    const isTestBuild = ApiConfig?.nonProdBuild
    const [logPath, setLogPath] = useState<string[]>()
    useEffect(() => {
        async function init() {
            const path = await FileLogger.getLogFilePaths()
            console.log(`[Error] logs in ${path}`)
            setLogPath(path)
        }
        init()
    }, [])

    let safeErrorText = ``
    try {
        safeErrorText = JSON.stringify(error)
    }
    catch (e) {
        safeErrorText = `Unable to parse error`
    }
    const sendLogFilesByEmail = async () => {


        await FileLogger.sendLogFilesByEmail({
            to: EmailRecepients.Support,
            subject: 'Log files',
            body: 'Please find attached the log files from your app',
        });
    };


    return <View style={[commonStyles.pageBase, styles.container]}>
        <Text style={styles.errorMessage}>{StaticText.InitError}</Text>
        <Text></Text>
        <Pressable style={styles.submit} onPress={() => {
            navigation.reset({
                index: 0,
                routes: [{ name: NavigationRoutes.Login }],
            });
        }}>
            <Text>{ButtonText.LoginRetry}</Text>
        </Pressable>
        {isTestBuild && <ScrollView>
            <Text style={styles.errorText}>
                {safeErrorText}
            </Text>

            <Text style={styles.errorText}>
                Logs in {logPath}
            </Text>
        </ScrollView>}
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