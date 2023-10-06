

import { StyleSheet } from 'react-native'

export const commonStyles = StyleSheet.create({
    pageBase: {
        backgroundColor: '#ffffff',
        height: '100%'
    },
    text: {
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
    },
    input: {
        padding: 10,
    },
    textInFocus: {
        color: '#fcd703',
        fontWeight: '600'
    },
    formQuestions: {
        fontSize: 14,
        fontWeight: '400',
        paddingRight: 10
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    buttonText: {
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
    },
    boldText: {
        fontFamily: 'Montserrat-Bold',
    },
    semiBoldText: {
        fontFamily: 'Montserrat-SemiBold'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 40,
        elevation: 3,
        marginTop: 20,
        backgroundColor: '#FFCC33',
        width: '100%'
    },
    accordion: {
        color: '#ffffff'
    },
    form: {
        marginTop: 10,
        marginLeft: 15

    },
    buttonDisabled: {
        backgroundColor: 'grey'
    },
    formBusy: {
        marginTop: 150,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

    },

})