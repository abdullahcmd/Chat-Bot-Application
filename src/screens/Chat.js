import React, { useState } from 'react';
import { View,TouchableOpacity,ScrollView, TextInput, Image, Alert,Dimensions, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import  Icon from 'react-native-vector-icons/Ionicons'
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useTheme } from '../themes/ThemeProvider';
import { GoogleGenerativeAI } from '@google/generative-ai';
import  'react-native-reanimated';
const {width,height}=Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Chat = ({ navigation }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { colors } = useTheme();
  const API_KEY = 'AIzaSyD0g08dv68lBc0u2Ie_dKUPfdpbZzPIszI'; // Replace with your actual API key
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Handle Input Change
  const handleInputText = (text) => {
    setInputMessage(text);
  };

  // Generate Text Response with Gemini
  const generateText = async () => {
    try {
      setIsTyping(true);
      const message = {
        _id: Math.random().toString(36).substring(7),
        text: inputMessage,
        createdAt: new Date(),
        user: { _id: 1 },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: `You are an AI assistant expert in Nigerian farming and agriculture landscape. Your goal is to assist people in general and farmers in particular. Keep the answer detailed but simple. 

              <query>Best dry season crops?</query>
              
              
              <answer>In Nigeria, tomatoes (Kano, Kaduna), pepper (Sokoto, Jigawa), onions (Kebbi, Bauchi), cabbage (Jos Plateau), and watermelon (Borno, Bauchi) thrive with irrigation.</answer>
              
              <query>Fastest way to grow broilers?</query>
              
              <answer>In Nigeria, buy chicks from reputable hatcheries (Lagos, Oyo, Kano), provide good housing (ventilation in Sokoto, heat control in Jos), use quality feed (maize, soybean meal), and follow a strict vaccination schedule.</answer>
              
              <query>How to get a farm loan?</query>
              <answer>Farmers in Nigeria can apply through BOA, NIRSAL (Anchor Borrowers' Program), or cooperative societies. Government grants like AGSMEIS and Youth Farmers Scheme also offer funding.</answer>
              
              <query>Best maize planting time?</query>
              <answer>In Nigeria, plant maize between March-April (South), April-May (Middle Belt), and May-June (North). Irrigation farming allows year-round planting in states like Kano and Sokoto.</answer> `}],
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will provide detailed but simple answers related to Nigerian farming and agriculture.' }],
          },
        ],
      });
      const result = await chat.sendMessage(inputMessage);

      if (result?.response) {
        const responseText = await result.response?.text();

//Cleaning the text 
const cleanMarkdown = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'); // Removes ** and *
};


        const cleanedResponseText = cleanMarkdown(responseText.trim());
        
        const responseMessage = {
          _id: Math.random().toString(36).substring(7),
          text: cleanedResponseText,
          createdAt: new Date(),
          user: { _id: 2, name: 'Gemini' },
        };

        setMessages((previousMessages) => GiftedChat.append(previousMessages, [responseMessage]));
      } else {
        console.error('Invalid response structure from API', result);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to get a response from Gemini.');
    } finally {
      setInputMessage('');
      setIsTyping(false);
    }
  };

  // Submit Handler for Text Request
  const submitHandler = () => {
    if (inputMessage.trim()) {
      generateText();
    }
  };

  // Render Message
  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.user._id === 1) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: 'black',margin: width*0.03,width:width*0.7},
            }}
            textStyle={{
              right: { color: COLORS.white },
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image source={images.avatar} style={{ height: 40, width: 40, borderRadius: 20, marginLeft: 8 }} />
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: COLORS.secondaryWhite },
            }}
            textStyle={{
              left: { color: COLORS.black },
            }}
          />
        </View>
      );
    }
  };

  return (
   
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

      

      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon  
           name={ "arrow-back-outline"}
          size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Save chat')}>
          <Icon name={ "bookmark-outline"}  size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      
      <GiftedChat
        messages={messages}
        renderMessage={renderMessage}
        user={{ _id: 1 }}
        isTyping={isTyping}
        renderInputToolbar={() => {}}
      />
    
      {/* Input Area */}

     
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
     
        <TextInput
          value={inputMessage}
          onChangeText={handleInputText}
          placeholder="Enter your question"
          placeholderTextColor={colors.text}
          style={{ flex:1, backgroundColor: colors.background, padding: 10, borderRadius: 12, borderWidth: 0.2, color: colors.text }}
        />
      
        <TouchableOpacity onPress={submitHandler} style={{ marginLeft: 10 }}>
          <Icon name={"send-outline"} size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;