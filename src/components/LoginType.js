import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import styles from '../assets/theme/style'
import { Card } from 'react-native-paper'
import MaterialCommunityIcons from '../utils/VectorIcon';
import { COLORS, FONTS } from '../assets/theme';
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const LoginType = () => {
    return (
        <View style={styles.authContainertext}>
            <Card style={[styles.Card1, { backgroundColor: COLORS.graybackground }]}>
                <TouchableOpacity style={stylesPage.cardBox} onPress={() => console.log("Facebook icon")}>
                    <MaterialCommunityIcons
                        name="facebook"
                        size={45}
                        color="rgb(23, 169, 253)"
                        style={{}}
                        type="MaterialCommunityIcons" />
                    <Text style={[FONTS.body3, { color: COLORS.white1, paddingLeft: 20 }]}>
                        Continue with Facebook</Text>
                </TouchableOpacity>

            </Card>
            <Card style={[styles.Card1, { backgroundColor: COLORS.graybackground }]}>
                <TouchableOpacity style={stylesPage.cardBox} onPress={() => console.log("Google icon")}>
                    <MaterialCommunityIcons
                        name="google"
                        size={45}
                        color="white"
                        type="MaterialCommunityIcons" />
                    <Text style={[FONTS.body3, { color: COLORS.white1, paddingLeft: 20 }]}>
                        Continue with Google</Text>
                </TouchableOpacity>

            </Card>
            <Card style={[styles.Card1, { backgroundColor: COLORS.graybackground }]}>
                <TouchableOpacity style={stylesPage.cardBox} onPress={() => console.log("Google icon")}>
                    <MaterialCommunityIcons
                        name="apple"
                        size={45}
                        color="white"
                        type="MaterialCommunityIcons" />
                    <Text style={[FONTS.body3, { color: COLORS.white1, paddingLeft: 20 }]}>
                        Continue with Apple</Text>
                </TouchableOpacity>
            </Card>
        </View>
    )
}

export default LoginType

const stylesPage = StyleSheet.create({
    cardBox: {
        flexDirection: 'row',
        alignItems: 'center',


    },
})