import { View, Text, Image, Alert, StyleSheet } from 'react-native'
import React, { useCallback, useReducer, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { getFirebaseApp } from '../utils/firebaseHelper'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, child, set, getDatabase } from 'firebase/database'
import { useTheme } from '../themes/ThemeProvider'
import {height, width} from '../constants/wid_height';
import UpdatedInput from '../components/login/Logo';
import LoginButton from '../components/login/button';


const initialState = {
  inputValues: {
    fullName: '',
    email: '',
    password: '',
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
}

const Register = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { colors } = useTheme()

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({ inputId, validationResult: result, inputValue })
    },
    [dispatchFormState]
  )

  const createUser = async (fullName, email, userId) => {
    const userData = {
      fullName,
      email,
      userId,
      signUpDate: new Date().toISOString(),
    }

    const dbRef = ref(getDatabase())
    const childRef = child(dbRef, `users/${userId}`)
    await set(childRef, userData)

    return userData
  }

  const authHandler = async () => {
    const app = getFirebaseApp()
    const auth = getAuth(app)
    setIsLoading(true)
    setError(null) // Clear any previous errors

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        formState.inputValues.email,
        formState.inputValues.password
      )

      const { uid } = result.user

      const userData = await createUser(
        formState.inputValues.fullName,
        formState.inputValues.email,
        uid
      )

      if (userData) {
        setError(null) // Ensure error is cleared on success
        setIsLoading(false)
        navigation.navigate('Login')
      }
    } catch (error) {
      const errorCode = error.code
      let message = 'Something went wrong !'
      if (errorCode === 'auth/email-already-in-use') {
        message = 'This email is already in use'
      }
      setError(message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error)
    }
  }, [error])

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
                      fontSize: 25,
                      fontWeight: 'bold',
                      color: colors.text,
                      marginVertical: 8,
                    }}>
                    Let's Get Started !
                  </Text>
  <Text
            style={{
                fontSize: 15,
                fontWeight:'600',
              color: colors.text,
              width:width*0.9,
              textAlign:'center',
              padding:width*0.02,
          margin: 8,
            }}>
            SignUp to get help with easy tips, simple questions and farming advices.
          </Text>
          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['fullName']}
            id="fullName"
            IconName={'user-o'}
            placeholderText="Enter your full name"
            placeholderTextColor={colors.text}
          />

          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            id="email"
            IconName={'envelope-o'}
            placeholderText="Enter your email"
            placeholderTextColor={colors.text}
          />

          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            id="password"
            IconName={'eye-slash'}
            placeholderText="Enter your password"
            placeholderTextColor={colors.text}
            secureTextEntry
          />

          <LoginButton
            text="Register"
            onPress={authHandler}
            isLoading={isLoading}
          />
        </View>
      </PageContainer>
    </SafeAreaView>
  )
}

export default Register




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