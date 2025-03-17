import {View, Text, Image, Alert, StyleSheet, TextInput} from 'react-native';
import React, {useCallback, useReducer, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {FONTS, SIZES, images} from '../constants/index';
import Input from '../components/Input';
import Button from '../components/Button';
import {reducer} from '../utils/reducers/formReducers';
import {validateInput} from '../utils/actions/formActions';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

import {getFirebaseApp} from '../utils/firebaseHelper';
import {useTheme} from '../themes/ThemeProvider';
import {height, width} from '../constants/wid_height';
import UpdatedInput from '../components/login/Logo';
import LoginButton from '../components/login/button';

const initialState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const Login = ({navigation}) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {colors} = useTheme();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({inputId, validationResult: result, inputValue});
    },
    [dispatchFormState],
  );

  const loginHandler = async () => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    setIsLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        formState.inputValues.email,
        formState.inputValues.password,
      );

      if (result) {
        setIsLoading(false);
        console.log('User logged in');
        navigation.navigate('Home');
      }
    } catch (error) {
      const errorCode = error.code;
      console.log(errorCode);
      let message = 'Something went wrong';

      if (
        errorCode === 'auth/wrong-password' ||
        errorCode === 'auth/user-not-found'
      ) {
        message = 'Wrong email or password';
      }
      console.log(errorCode);
      setError(message);
      setIsLoading(false);
    }
  };

  // handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <PageContainer>
        <View
          style={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            alignItems: 'center',
            justifyContent: 'center',
           // marginHorizontal: 22,
          }}>
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
            Welcome Back
          </Text>
          <Text
            style={{
                fontSize: 15,
                fontWeight:'600',
              color: colors.text,
              marginVertical: 8,
            }}>
            Login to get the best farming experience
          </Text>
            <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            id="email"
            placeholderText="Email Address"
            IconName={'envelope-o'}
            placeholderTextColor={colors.text}
            />
          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            id="password"
            IconName={"eye-slash"}
            style={styles.input}
            placeholderText="Password"
            placeholderTextColor={colors.text}
            secureTextEntry
          />
        <LoginButton text={"SignIn"} isLoading={isLoading} onPress={loginHandler} />
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

export default Login;

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
