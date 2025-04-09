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
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, images} from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {useTheme} from '../themes/ThemeProvider';
import {GoogleGenerativeAI} from '@google/generative-ai';
import 'react-native-reanimated';
const {width, height} = Dimensions.get('window');
import Send from '../assets/Icons/send.svg';
import Entypo from 'react-native-vector-icons/Entypo';

const Chat = ({navigation}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialPrompts, setShowInitialPrompts] = useState(true);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);

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
      const userMessage = {
        _id: Math.random().toString(36).substring(7),
        text: promptText,
        createdAt: new Date(),
        user: {_id: 1},
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [userMessage]),
      );

      const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [
              {
                text:
                  'You are an AI assistant expert in Nigerian farming and agriculture landscape. Your goal is to assist people in general and farmers in particular. Keep the answer detailed but simple. \n\n' +
                  '<query>Best dry season crops?</query>\n\n' +
                  '<answer>In Nigeria, tomatoes (Kano, Kaduna), pepper (Sokoto, Jigawa), onions (Kebbi, Bauchi), cabbage (Jos Plateau), and watermelon (Borno, Bauchi) thrive with irrigation.</answer>\n\n' +
                  '<query>Fastest way to grow broilers?</query>\n\n' +
                  '<answer>In Nigeria, buy chicks from reputable hatcheries (Lagos, Oyo, Kano), provide good housing (ventilation in Sokoto, heat control in Jos), use quality feed (maize, soybean meal), and follow a strict vaccination schedule.</answer>\n\n' +
                  '<query>How to get a farm loan?</query>\n' +
                  "<answer>Farmers in Nigeria can apply through BOA, NIRSAL (Anchor Borrowers' Program), or cooperative societies. Government grants like AGSMEIS and Youth Farmers Scheme also offer funding.</answer>\n\n" +
                  '<query>Best maize planting time?</query>\n' +
                  '<answer>In Nigeria, plant maize between March-April (South), April-May (Middle Belt), and May-June (North). Irrigation farming allows year-round planting in states like Kano and Sokoto.</answer>',
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

        // Show prompt suggestions after receiving a response
        setShowPromptSuggestions(true);
      } else {
        console.error('Invalid response structure from API', result);
      }
    } catch (error) {
      Alert.alert('Error', 'AI is unable to answer.\nPlease come back later.', [
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
    // Hide suggestions when a new prompt is triggered
    setShowPromptSuggestions(false);
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
      // Hide suggestions when a new prompt is manually submitted
      setShowPromptSuggestions(false);
      generateText();
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={30}
        style={{flex: 1}}
        >
        {/* Header */}
        <View
          style={{
            height: 60,
            flexDirection: 'row',
            backgroundColor: '#f5f5f5',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 22,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'arrow-back-outline'} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{fontSize: 18, fontWeight: '800', color: colors.text}}>
            New Chat
          </Text>
          <TouchableOpacity onPress={() => console.log('Save chat')}>
            <Entypo
              name={'dots-three-horizontal'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Initial Prompts as Overlay */}
        {showInitialPrompts && (
          <ScrollView>
          <View
            style={{
              backgroundColor: '#f5f5f5',
            // marginTop: height * 0.1,
              alignItems: 'center',
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
                fontWeight: '800',
                color: colors.text,
                
              }}>
              Hello !
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                width: width * 0.8,
                padding: height * 0.02,
                textAlign: 'center',
                color: '#BFBFBF',
             
              }}>
                Welcome to the new chat! {`\n`}
                {`\n`}
             Have a question? {`\n`}
              FarmerGist is here to help. {`\n`}Ask away using text
              ⌨️, voice 💬 or images 📷…
            </Text>
            <Text style={{ fontSize: 18,
                fontWeight: '600',
                
                width: width * 0.8,
                padding: height * 0.02,
                textAlign: 'center',
                color: '#BFBFBF',
               marginTop:height * 0.1,}}>
              Suggestions for you
            </Text>
            {/* Horizontal Scrollable Prompts */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: width * 0.05}}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                 
                  
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: height * 0.06,
                  width: width * 0.8,
                  margin: height * 0.01,
                  borderRadius: 20,
                }}
                onPress={() => handlePrompt('Use Sri Method?')}>
                <Text
                  style={{
                    color: '#3f3f40',
                    width: '80%',
                    fontSize: 17,
                    padding: width * 0.02,
                    marginLeft: width * 0.03,
                    fontWeight: '500',
                  }}>
                  Use Sri Method?
                </Text>
                <Send style={{marginRight: width * 0.05}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                 
                  
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: height * 0.06,
                  width: width * 0.8,
                  margin: height * 0.01,
                  borderRadius: 20,
                }}
                onPress={() => handlePrompt('Crops for this season')}>
                <Text
                  style={{
                    color: '#3f3f40',
                    width: '80%',
                    fontSize: 17,
                    padding: width * 0.02,
                    marginLeft: width * 0.03,
                    fontWeight: '500',
                  }}>
                  Crops for this season
                </Text>
                <Send style={{marginRight: width * 0.05}} />
              </TouchableOpacity>
            </ScrollView>
          </View>
          </ScrollView>
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

        {/* Prompt Suggestions (shown after each response) */}
        {!showInitialPrompts && showPromptSuggestions && (
          <ScrollView  style={{height:height*0.2}} >
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              backgroundColor: '#f5f5f5',
              padding: 10,
            }}>
            <View
              style={{
                height: height * 0.001,
                width: '95%',
                backgroundColor: '#b9babd',
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontSize: 12,
                textAlign: 'center',
                fontWeight: 'bold',
                margin: width * 0.02,
                color: '#b9babd',
              }}>
              Tap to ask follow up questions
            </Text>
            <TouchableOpacity
              onPress={() =>
                handlePrompt('What are some good cover crops for sandy soil?')
              }
              style={{
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: '#4c4c4d',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: height * 0.01,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'black',
                  width: '80%',
                  fontSize: 12,
                  padding: width * 0.02,
                  marginLeft: width * 0.03,
                  fontWeight: '500',
                }}>
                What are some good cover crops for sandy soil?
              </Text>
              <Send style={{marginRight: width * 0.05}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handlePrompt(
                  'How often should I water sandy soil to keep it moist?',
                )
              }
              style={{
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: '#4c4c4d',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: height * 0.01,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'black',
                  width: '80%',
                  fontSize: 12,
                  padding: width * 0.02,
                  marginLeft: width * 0.03,
                  fontWeight: '500',
                }}>
                How often should I water sandy soil to keep it moist?
              </Text>
              <Send style={{marginRight: width * 0.05}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handlePrompt('What are some good cover crops for sandy soil?')
              }
              style={{
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: '#4c4c4d',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: height * 0.01,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'black',
                  width: '80%',
                  fontSize: 12,
                  padding: width * 0.02,
                  marginLeft: width * 0.03,
                  fontWeight: '500',
                }}>
                What are some good cover crops for sandy soil?
              </Text>
              <Send style={{marginRight: width * 0.05}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handlePrompt(
                  'How often should I water sandy soil to keep it moist?',
                )
              }
              style={{
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: '#4c4c4d',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: height * 0.01,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'black',
                  width: '80%',
                  fontSize: 12,
                  padding: width * 0.02,
                  marginLeft: width * 0.03,
                  fontWeight: '500',
                }}>
                How often should I water sandy soil to keep it moist?
              </Text>
              <Send style={{marginRight: width * 0.05}} />
            </TouchableOpacity>
          </View>
          </ScrollView>
        )}

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
              height: 40,
              width: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Send />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;
