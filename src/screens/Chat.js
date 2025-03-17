import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, images} from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {useTheme} from '../themes/ThemeProvider';
import {GoogleGenerativeAI} from '@google/generative-ai';
import 'react-native-reanimated';
const {width, height} = Dimensions.get('window');
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Chat = ({navigation}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialPrompts, setShowInitialPrompts] = useState(true);

  const {colors} = useTheme();
  const API_KEY = 'AIzaSyD0g08dv68lBc0u2Ie_dKUPfdpbZzPIszI'; // Replace with your actual API key
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Handle Input Change
  const handleInputText = text => {
    setInputMessage(text);
  };

  // Modified generateText now accepts an optional customPrompt
  const generateText = async customPrompt => {
    const promptText = customPrompt || inputMessage;
    try {
      setIsTyping(true);
      // Append user's message (the prompt) to the chat
      const message = {
        _id: Math.random().toString(36).substring(7),
        text: promptText,
        createdAt: new Date(),
        user: {_id: 1},
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [message]),
      );

      const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [
              {
                text: `You are an AI assistant expert in Nigerian farming and agriculture landscape. Your goal is to assist people in general and farmers in particular. Keep the answer detailed but simple. 

<query>Best dry season crops?</query>

<answer>In Nigeria, tomatoes (Kano, Kaduna), pepper (Sokoto, Jigawa), onions (Kebbi, Bauchi), cabbage (Jos Plateau), and watermelon (Borno, Bauchi) thrive with irrigation.</answer>

<query>Fastest way to grow broilers?</query>

<answer>In Nigeria, buy chicks from reputable hatcheries (Lagos, Oyo, Kano), provide good housing (ventilation in Sokoto, heat control in Jos), use quality feed (maize, soybean meal), and follow a strict vaccination schedule.</answer>

<query>How to get a farm loan?</query>
<answer>Farmers in Nigeria can apply through BOA, NIRSAL (Anchor Borrowers' Program), or cooperative societies. Government grants like AGSMEIS and Youth Farmers Scheme also offer funding.</answer>

<query>Best maize planting time?</query>
<answer>In Nigeria, plant maize between March-April (South), April-May (Middle Belt), and May-June (North). Irrigation farming allows year-round planting in states like Kano and Sokoto.</answer>`,
              },
            ],
          },
          {
            role: 'model',
            parts: [
              {
                text: 'Understood. I will provide detailed but simple answers related to Nigerian farming and agriculture.',
              },
            ],
          },
        ],
      });
      const result = await chat.sendMessage(promptText);

      if (result?.response) {
        const responseText = await result.response?.text();

        // Clean markdown formatting from response text
        const cleanMarkdown = text => {
          return text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1');
        };

        const cleanedResponseText = cleanMarkdown(responseText.trim());

        const responseMessage = {
          _id: Math.random().toString(36).substring(7),
          text: cleanedResponseText,
          createdAt: new Date(),
          user: {_id: 2, name: 'Gemini'},
        };

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [responseMessage]),
        );
      } else {
        console.error('Invalid response structure from API', result);
      }
    } catch (error) {
      Alert.alert('Error', 'Ai is unable to answer.\nPlease come back later.', [
        {text: 'OK'},
      ]);
    } finally {
      setInputMessage('');
      setIsTyping(false);
    }
  };

  // When a user taps one of the prompt boxes, hide the prompts and generate text using that prompt.
  const handlePrompt = promptText => {
    setShowInitialPrompts(false);
    generateText(promptText);
  };

  // Custom renderTime function
  const renderTime = props => {
    const {currentMessage} = props;
    return (
      <Text
        style={{
          fontSize: 12,
          color: 'white',
          margin: 5,
          width: width * 0.2,
          textAlign: 'center',
        }}>
        {new Date(currentMessage.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </Text>
    );
  };

  // Custom renderMessage function
  const renderMessage = props => {
    const {currentMessage} = props;
    if (currentMessage.user._id === 1) {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: 'black',
                margin: width * 0.03,
                width: width * 0.7,
              },
            }}
            textStyle={{
              right: {color: COLORS.white},
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Image
            source={images.avatar}
            style={{height: 40, width: 40, borderRadius: 20, marginLeft: 8}}
          />
          <Bubble
            {...props}
            wrapperStyle={{
              left: {backgroundColor: COLORS.primary},
            }}
            textStyle={{
              left: {color: COLORS.black},
            }}
          />
        </View>
      );
    }
  };

  // Submit Handler for manual text input
  const submitHandler = () => {
    if (inputMessage.trim()) {
      setShowInitialPrompts(false);
      generateText();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={30}
        style={{flex: 1}}>
        {/* Header */}
        <View
          style={{
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 22,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'arrow-back-outline'} size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Save chat')}>
            <Icon name={'bookmark-outline'} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Initial Prompts as Overlay */}
        {showInitialPrompts && (
          <View
            style={{
              backgroundColor: '#f5f5f5',

              position: 'absolute',
              top: 80, // Adjust based on your header height
              left: 0,
              right: 0,
              zIndex: 1,
              alignItems: 'center',
             // paddingTop: height * 0.2,
            }}>


            <Image
            source={require('../assets/images/BlackLogo.png')}
            style={{
              height: height * 0.2,
              width: width * 0.6,
            }}
          />

<Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              color: colors.text,
              marginVertical: 8,
            }}>
            Hello !
          </Text>

 <Text
            style={{
                fontSize: 15,
                fontWeight:'600',
                width: width * 0.8,
                padding: height * 0.02,
                textAlign: 'center',
              color: colors.text,
              marginVertical: 8,
            }}>
            Welcome to the new Chat. 
            Have a question about farming or agriculture ? Farmer Gist is here to help.

          </Text>

            <TouchableOpacity
              style={{
                backgroundColor: 'white',

                borderRadius: 10,
                height: height * 0.06,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
                width: width * 0.8,
                alignItems: 'center',
              }}
              onPress={() => handlePrompt(' Use Sri Method ?')}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  marginLeft: width * 0.06,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Use Sri Method ?
              </Text>
              <Icon
                name={'arrow-redo-sharp'}
                style={{marginRight: width * 0.06}}
                size={24}
                color="#edce05"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: 'white',

                borderRadius: 10,
                height: height * 0.06,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
                width: width * 0.8,
                alignItems: 'center',
              }}
              onPress={() => handlePrompt('Crops for this season')}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  marginLeft: width * 0.06,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Crops for this season
              </Text>
              <Icon
                name={'arrow-redo-sharp'}
                style={{marginRight: width * 0.06}}
                size={24}
                color="#edce05"
              />
            </TouchableOpacity>
          </View>
        )}

        {/* GiftedChat component */}
        <GiftedChat
          messages={messages}
          renderMessage={renderMessage}
          user={{_id: 1}}
          renderTime={renderTime}
          isTyping={isTyping}
          renderInputToolbar={() => {}}
          listViewProps={{
            style: {flex: 1, backgroundColor: '#f5f5f5'},
          }}
        />

        {/* Input Area */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderTopWidth: 0.5,
            borderTopColor: colors.text + '40',
            backgroundColor: colors.background,
          }}>
          <TextInput
            value={inputMessage}
            onChangeText={handleInputText}
            placeholder="Enter your question"
            placeholderTextColor={colors.text + '80'}
            style={{
              flex: 1,
              backgroundColor: colors.background,
              padding: 12,
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: colors.text + '40',
              color: colors.text,
              marginRight: 10,
            }}
          />
          <TouchableOpacity
            onPress={submitHandler}
            style={{
              backgroundColor: COLORS.primary,
              height: 40,
              width: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name={'send-outline'} size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
