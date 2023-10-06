import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { NavigationRoutes } from '../Constants'

export type RootStackParamList = {
    [NavigationRoutes.Home]: undefined
    [NavigationRoutes.Login]: undefined
    [NavigationRoutes.Error]: undefined
}
