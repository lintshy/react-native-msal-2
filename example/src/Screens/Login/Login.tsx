import { useState, useEffect } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import type { MSALWebviewParams, MSALResult} from 'react-native-msal-2';
import { ActivityIndicator } from 'react-native-paper'


import { b2cScopes as scopes } from '../../Config';


import { NavigationRoutes } from '../../Constants';
import { useUserStore } from '../../Store';



export function Login({ navigation }: any) {
    const { setUser, getUser,  setAccessToken, b2cClient,
        initB2CClient, initSharedB2CClient, sharedB2CClient } = useUserStore()
    
    const [isError, setIsError] = useState<boolean>(false)
    const [isUserLoading, setIsUserLoading] = useState<boolean>(true)
    const webviewParameters: MSALWebviewParams = {
        ios_prefersEphemeralWebBrowserSession: false,
    };

    const loginSideEffects = async (res: MSALResult) => {
        const out = {
            message: '[Login] printing login result',
            res
        }
 
        const user = await getUser(res)

        setUser(user)
   
        navigation.reset({
            index: 0,
            routes: [{ name: NavigationRoutes.Home }],
        });
        setIsUserLoading(false)
    }

    useEffect(() => {
        async function init() {
            try {
                setIsUserLoading(true)
           
                await initSharedB2CClient()
                console.log('init')
                console.log(JSON.stringify(sharedB2CClient))
                const { currentAccount, currentEvent } = await sharedB2CClient.hasAccountChanged()
                console.log(currentEvent)
                console.log(currentAccount)
                const res = await sharedB2CClient.initAccountSignIn()
                return loginSideEffects(res)



            } catch (error) {
                setIsUserLoading(false)
                setIsError(true)

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Error', params: { error } }],

                });
            }
        }
        init();
    }, []);

    if (isUserLoading) {
        return <View style={styles.busyArea} ><ActivityIndicator color='#fcd703' /></View>
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    busyArea: {
        flex: 1,
        padding: '1%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    container: {
        flex: 1,
        padding: '1%',
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: '1%',
        margin: '-0.5%',
    },
    button: {
        backgroundColor: 'aliceblue',
        borderWidth: 1,
        margin: '0.5%',
        padding: 8,
        width: '49%',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ddd',
    },
    switchButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 4,
        margin: '0.5%',
        width: '99%',
    },
    scrollView: {
        borderWidth: 1,
        padding: 1,
    },
});


