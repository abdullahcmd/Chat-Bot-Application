import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../constants'
import PageContainer from '../components/PageContainer'
import Button from '../components/Button'
import { useTheme } from "../themes/ThemeProvider"
import {height, width} from '../constants/wid_height';
import UpdatedInput from '../components/login/Logo';
import LoginButton from '../components/login/button';



const Welcome = ({ navigation }) => {
    const { colors } = useTheme()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
           
            <PageContainer>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "#f5f5f5",
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                  <Image
                              source={require('../assets/images/BlackLogo.png')}
                              style={{
                                height: height * 0.1,
                                width: width * 0.3,
                              }}
                            />
                            <Text style={styles.LogoHeading}>FarmerGist</Text>

                  <Text
                              style={{
                                  fontSize: 15,
                                  fontWeight:'600',
                               textAlign: 'center',
                                marginVertical: height * 0.01,
                                
                              }}>
                              Login to get the best farming experience
                            </Text>
                    <Button
                        title="Log in"
                        filled
                        onPress={() => navigation.navigate('Login')}
                        style={{
                            marginTop: height * 0.04,
                            width: SIZES.width - 44,
                            
                            marginBottom: SIZES.padding,
                        }}
                    />

                    <Button
                        title="Register"
                        onPress={() => navigation.navigate('Register')}
                        style={{
                            width: SIZES.width - 44,
                            marginTop: height * 0.02,
                            marginBottom: SIZES.padding,
                            backgroundColor: 'transparent',
                            borderColor: COLORS.primary,
                        }}
                    />
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Welcome



const styles = StyleSheet.create({
  input: {
    width: width * 0.8,
    borderWidth: 1,
    backgroundColor: '#d9e7ff',
    padding: width * 0.1,
  },
  LogoHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
});