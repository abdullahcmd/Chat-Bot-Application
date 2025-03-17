import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES } from '../constants'
import { Ionicons, AntDesign } from 'react-native-vector-icons'
import  Icon from 'react-native-vector-icons/Ionicons'
import { useTheme } from '../themes/ThemeProvider'
import { width,height } from '../constants/wid_height'
import LoginButton from '../components/login/button';
const Home = ({ navigation }) => {

    const { dark, colors, setScheme } = useTheme();

    const ToggleTheme = ()=>{
        dark ? setScheme('light') : setScheme('dark')
    }

    return (
        <SafeAreaView
            style={[
                styles.areaStyle,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <View style={styles.center}>
               
                <Image
            source={require('../assets/images/BlackLogo.png')}
            style={{
              height: height * 0.1,
              width: width * 0.3,
            }}
          />

          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              color: colors.text,
              marginVertical: 8,
            }}>
           FarmerGist
          </Text>

                <Text
                    style={[
                        styles.subTitle,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                Best AI Agent for farming help.
                </Text>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => navigation.navigate('Chat')}
                >
                  {/*<AntDesign name="plus" size={24} color={COLORS.white} />*/}
                    <Text style={styles.btnText}>New Chat</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    areaStyle: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subTitle: {
        ...FONTS.h4,
        marginVertical: 22,
    },
    box: {
        width: 300,
        paddingVertical: 18,
        marginVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxText: {
        ...FONTS.body4,
        textAlign: 'center',
        color: COLORS.white,
    },

    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        width: width*0.8,
        borderRadius:5,
        paddingVertical: SIZES.padding * 2,
    },
    btnText: {
        ...FONTS.body3,
        color: COLORS.white,
        marginLeft: 8,
    },
})
export default Home
