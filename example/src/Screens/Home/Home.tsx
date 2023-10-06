import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native'


import { commonStyles } from '../../styles'


import { NavigationRoutes} from '../../Constants'
import { useUserStore } from '../../Store'



export const HomeScreen: React.FC<any> = ({ navigation }) => {
    const navigate = (target: string) => {
        navigation?.navigate(target)
    }
  



    return <View style={[commonStyles.pageBase]}>
       
        <View style={styles.container}>
            <Pressable style={[commonStyles.button]} >
                <Text style={commonStyles.buttonText}>{'Welcome'}</Text>
            </Pressable>


        </View>

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