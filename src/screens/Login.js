import React, {useCallback, useReducer, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {reducer} from '../utils/reducers/formReducers';
import Icon from 'react-native-vector-icons/FontAwesome';
import {validateInput} from '../utils/actions/formActions';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {getFirebaseApp} from '../utils/firebaseHelper';
import {useTheme} from '../themes/ThemeProvider';
import {height, width} from '../constants/wid_height';
import UpdatedInput from '../components/login/Logo';
import LoginButton from '../components/login/button';
import {COLORS} from '../constants';
import Arrow from '../components/login/arrow';

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

// Custom checkbox component
const CustomCheckbox = ({isChecked, onToggle}) => {
  return (
    <TouchableOpacity
      style={[checkboxStyles.container, {marginLeft: width * -0.48}]}
      onPress={() => onToggle(!isChecked)}>
      <View
        style={[checkboxStyles.checkbox, isChecked && checkboxStyles.checked]}>
        {isChecked && <Icon name="check" style={checkboxStyles.checkmark} />}
      </View>
      <Text style={checkboxStyles.label}>Remember Me</Text>
    </TouchableOpacity>
  );
};

const Login = ({navigation}) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
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
        console.log('User logged in', {rememberMe});
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
            backgroundColor: '#f5f5f5',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Arrow navigation={navigation} />
          <Image
            source={require('../assets/images/New.png')}
            style={{
              height: height * 0.2,
              width: width * 0.5,
            }}
          />

          <Text
            style={{
              fontSize: 25,
              fontWeight: '400',
              color: colors.text,
            }}>
            Welcome Back!
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.text,
              width: width * 0.9,
              textAlign: 'center',
              padding: width * 0.02,
            }}>
            Login to get the best farming tips and support!
          </Text>
          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            id="email"
            placeholderText="Email Address"
            IconName={'envelope-o'}
          />
          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            id="password"
            IconName={'eye-slash'}
            style={styles.input}
            placeholderText="Password"
            secureTextEntry
          />
          {/* Custom "Remember me" checkbox */}
          <CustomCheckbox isChecked={rememberMe} onToggle={setRememberMe} />
          <LoginButton
            text={'Sign in'}
            isLoading={isLoading}
            onPress={loginHandler}
          />
          <Text style={{fontWeight: '500', fontSize: 11}}>
            Don't have an account?{' '}
            <Text
              onPress={() => navigation.navigate('Register')}
              style={{color: colors.primary, fontWeight: 'bold', fontSize: 11}}>
              Sign up now
            </Text>
          </Text>
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

const checkboxStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width * 0.02,
    marginLeft: width * 0.08,
  },
  checkbox: {
    height: height * 0.027,
    width: width * 0.05,
    borderWidth: 1.5,
    borderColor: '#000',
    marginLeft: width * 0.1,

    justifyContent: 'center',
    marginRight: width * 0.02,
  },
  checked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    fontSize: 10,
    width: width * 0.4,
    color: '#333',
  },
});
