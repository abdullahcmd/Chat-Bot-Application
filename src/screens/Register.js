import {View, Text, Image, Alert, StyleSheet,TouchableOpacity} from 'react-native';
import React, {useCallback, useReducer, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import Arrow from '../components/login/arrow';
import PageContainer from '../components/PageContainer';
import {reducer} from '../utils/reducers/formReducers';
import {validateInput} from '../utils/actions/formActions';
import {getFirebaseApp} from '../utils/firebaseHelper';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {ref, child, set, getDatabase} from 'firebase/database';
import {useTheme} from '../themes/ThemeProvider';
import {height, width} from '../constants/wid_height';
import UpdatedInput from '../components/login/Logo';
import LoginButton from '../components/login/button';
import { ScrollView } from 'react-native';

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
};


// Custom checkbox component
const CustomCheckbox = ({isChecked, onToggle}) => {
  return (
    <TouchableOpacity style={[checkboxStyles.container,]} onPress={() => onToggle(!isChecked)}>
      <View style={[checkboxStyles.checkbox, isChecked && checkboxStyles.checked]}>
        {isChecked && <Icon name="check" style={checkboxStyles.checkmark} />}
      </View>
      <Text style={checkboxStyles.label}>By signing up, you agree to our Terms of Conditions and Privacy of Policy</Text>
    </TouchableOpacity>
  );
};



const Register = ({navigation}) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {colors} = useTheme();
 const [rememberMe, setRememberMe] = useState(false);
  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({inputId, validationResult: result, inputValue});
    },
    [dispatchFormState],
  );

  const createUser = async (fullName, email, userId) => {
    const userData = {
      fullName,
      email,
      userId,
      signUpDate: new Date().toISOString(),
    };

    const dbRef = ref(getDatabase());
    const childRef = child(dbRef, `users/${userId}`);
    await set(childRef, userData);

    return userData;
  };

  const authHandler = async () => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        formState.inputValues.email,
        formState.inputValues.password,
      );

      const {uid} = result.user;

      const userData = await createUser(
        formState.inputValues.fullName,
        formState.inputValues.email,
        uid,
      );

      if (userData) {
        setError(null); // Ensure error is cleared on success
        setIsLoading(false);
        navigation.navigate('Login');
      }
    } catch (error) {
      const errorCode = error.code;
      let message = 'Something went wrong !';
      if (errorCode === 'auth/email-already-in-use') {
        message = 'This email is already in use';
      }
      setError(message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  return (
 
    
        <ScrollView
        contentContainerStyle={{alignItems: 'center',
          justifyContent: 'center'}}
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
          }}>
            <Arrow navigation={navigation}/>
          <Image
            source={require('../assets/images/New.png')}
            style={{
              marginTop:height*0.1,
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
            Let's Get Started !
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.text,
              width: width * 0.9,
              textAlign: 'center',
              padding: width * 0.02,
              marginBottom:height*0.03
             
            }}>
            Sign up to get help with easy tips, simple questions and farming
            advice.
          </Text>
          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['fullName']}
            id="fullName"
            IconName={'user-o'}
            placeholderText="Enter your full name"
          />

          <UpdatedInput
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            id="email"
            IconName={'envelope-o'}
            placeholderText="Enter your email"
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
 <CustomCheckbox  isChecked={rememberMe} onToggle={setRememberMe} />
          <LoginButton
            text="Sign up"
            onPress={authHandler}
            isLoading={isLoading}
          />
          <Text style={{fontWeight: '500', fontSize: 11}}>
                      Already have an account?{' '}
                      <Text
                        onPress={() => navigation.navigate('Login')}
                        style={{color: colors.primary, fontWeight: 'bold', fontSize: 11}}>
                        Sign in Now
                      </Text>
                    </Text>
        </ScrollView>
      
   
  );
};

export default Register;

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
   alignItems:'center',
  marginRight:width*0.08,
  marginVertical:height*0.02,
     justifyContent:'center',
    //marginVertical: 12,
   
  },
  checkbox: {
    height: height * 0.027,
    width: width * 0.05,
    borderWidth: 1.5,
    borderColor: '#000',
    marginLeft: width * 0.1,
    
    justifyContent: 'center',
    marginRight: width * 0.02,
  }, checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  checked: {
    backgroundColor: COLORS.primary,
   
  },
 
  label: {
    fontSize: 10,
    color: '#333',
    width:width*0.77,
  },
});
