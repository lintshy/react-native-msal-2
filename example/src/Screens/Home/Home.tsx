import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native'

import { DCSelector } from '../../Components/atoms'
import { commonStyles } from '../../styles'
import { CompletedAudits } from '../CompletedAudits'

import { ButtonText, NavigationRoutes, TabTitles, Timers } from '../../Constants'
import { useUserStore } from '../../Store'



export const HomeScreen: React.FC<any> = ({ navigation }) => {
    const navigate = (target: string) => {
        navigation?.navigate(target)
    }
    const { selectedDC } = useUserStore()



    return <View style={[commonStyles.pageBase]}>
        <View style={styles.subTitleContainer}>
            <DCSelector dcLocation={selectedDC} />
        </View>
        <View style={styles.container}>
            <Pressable style={[commonStyles.button]} onPress={() => { navigate(NavigationRoutes.AuditDashboard) }} disabled={!selectedDC || !selectedDC.shortName}>
                <Text style={commonStyles.buttonText}>{ButtonText.HomePerformAudit}</Text>
            </Pressable>


        </View>
        <CompletedAudits></CompletedAudits>
    </View >
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 25,
        marginLeft: 25,
        marginTop: 25,

    },
    subTitleContainer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',

    },

})