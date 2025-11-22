import React, { useEffect, useState, useRef } from 'react';
import { Alert, Image, Pressable, Text, View, StyleSheet, FlatList, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext'; 
import { Ionicons } from '@expo/vector-icons';

// -----------------------------------------------------------
// DUMMY DATA
// -----------------------------------------------------------

const initialMessages = [
    { id: '1', user: 'PriyaLover', message: 'Can you say hi to me?' },
    { id: '2', user: 'GoldUser', message: 'Sending a virtual 🌹!' },
    { id: '3', user: 'ViewerX', message: 'What time are you starting your video chat?' },
    { id: '4', user: 'VipFan', message: 'Hello! You look amazing today! ✨' },
    { id: '5', user: 'User123', message: 'Hiii, how are you?' },
];

const newMessagesPool = [
    { user: 'NewUser', message: 'Wow! So pretty!' },
    { user: 'Guest01', message: 'How much for 10 minutes?' },
    { user: 'Sumer', message: 'Great stream quality.' },
    { user: 'DiamondsFan', message: 'Do you offer private chat?' },
    { user: 'Viewer45', message: 'Just joined the live!' },
    { user: 'Commenter', message: 'I love your background.' },
];

 

// -----------------------------------------------------------
// 1. Chat Message Component
// -----------------------------------------------------------

const ChatMessage = ({ user, message }) => (
    <View style={styles.chatMessage}> 
        <Text style={styles.chatUser}>{user}: </Text>
        <Text style={styles.chatText}>{message}</Text>
    </View>
);

// -----------------------------------------------------------
// 2. Main Screen
// -----------------------------------------------------------

export default function LiveWatchScreen({ navigation, route }) {
    const { profile } = route.params;
    const [messages, setMessages] = useState(initialMessages);
    const [messageCounter, setMessageCounter] = useState(initialMessages.length);
    const [failed, setFailed] = useState(false);
    const insets = useSafeAreaInsets();
    const { diamonds } = useWallet();
    const [comment, setComment] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageCounter(prevCounter => {
                const nextId = String(prevCounter + 1);
                
                const randomMessageIndex = Math.floor(Math.random() * newMessagesPool.length);
                const newMessageContent = newMessagesPool[randomMessageIndex];

                const newMessage = {
                    id: nextId,
                    ...newMessageContent
                };
                
                // नया मैसेज Array के START में जोड़ें
                setMessages(prevMessages => [newMessage, ...prevMessages]);
                
                return prevCounter + 1;
            });
        }, 3000); 

        return () => clearInterval(intervalId); 
    }, []);

    const watchLive = () => {
        navigation.navigate('Purchase', { from: 'LiveWatch' });
    };
    
    const goBack = () => {
        navigation.goBack();
    };
    
    // केवल नवीनतम 10 संदेश ही दिखाएं
    const displayMessages = messages.slice(0, 10); 

    return (
        <SafeAreaView style={styles.safeArea}>
            
            {/* Live Video Preview Section */}
            <View style={styles.videoContainer}>
                
                {failed ? (
                    <LinearGradient colors={["#111827", "#1f2937"]} style={styles.videoPlaceholder}>
                        <Text style={styles.fallbackText}>Live Preview Unavailable</Text>
                    </LinearGradient>
                ) : (
                    <Image source={{ uri: profile.img }} style={styles.videoImage} onError={() => setFailed(true)} />
                )}

                {/* Top Overlay: Back Button and Live Badge */}
                <View style={styles.overlayTop}>
                    <Pressable onPress={goBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </Pressable>

                    <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                </View>

                {/* Bottom Overlay: Profile Info */}
                <LinearGradient 
                    colors={["transparent", "rgba(0,0,0,0.7)"]} 
                    style={styles.overlayBottom}
                >
                    <Text style={styles.profileName}>{profile.name}</Text>
                    <View style={styles.viewerPill}>
                        <Ionicons name="eye" size={14} color="#F9FAFB" />
                        <Text style={styles.viewerText}>{profile.viewers ? (profile.viewers / 1000).toFixed(1) + 'k' : '2.5k'}</Text>
                    </View>
                </LinearGradient>
            </View>

            {/* Chat & Action Section */}
            <View style={styles.chatSection}>
                <Text style={styles.chatTitle}>Live Chat</Text>

                {/* Share Button */}
                <Pressable style={styles.shareButton} onPress={() => Alert.alert('Share', 'Share with your friends!')}>
                    <LinearGradient colors={["#ff9c00", "#ff3b6b"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shareButtonInner}>
                        <Ionicons name="heart" size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Share with Friend</Text>
                    </LinearGradient>
                </Pressable>
                
                <FlatList
                    data={displayMessages} 
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ChatMessage {...item} />}
                    inverted={true} 
                    style={styles.chatList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'flex-end', flexGrow: 1 }} 
                />
                
                {/* Conditional: Comment bar only if user has diamonds; otherwise show watch button */}
                {diamonds > 0 ? (
                    <View style={styles.commentBar}>
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Write a Comment..."
                            placeholderTextColor="#666"
                            style={styles.commentInput}
                        />
                        <Pressable style={styles.sendButton} onPress={() => setComment('')}>
                            <Ionicons name="send" size={16} color="#fff" />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable onPress={watchLive} style={styles.watchButton}>
                        <Text style={styles.watchButtonText}>Tap to Watch Full Live Show</Text>
                        <Text style={styles.watchButtonSubtitle}> (Starts at 50 💎 / ₹299)</Text>
                    </Pressable>
                )}
            </View>

        </SafeAreaView>
    );
}

// -----------------------------------------------------------
// 3. Styles (Spacing and Font Size Increased)
// -----------------------------------------------------------

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    videoContainer: {
        height: 350, 
        backgroundColor: '#000',
    },
    videoImage: {
        flex: 1,
        width: '100%',
    },
    videoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackText: {
        color: '#fff',
        opacity: 0.8,
    },
    // --- Overlay Styles ---
    overlayTop: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 50,
    },
    liveBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#e11d48', 
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 999,
        backgroundColor: '#FEE2E2',
        marginRight: 5,
    },
    liveText: {
        color: '#F9FAFB',
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 0.6,
    },
    overlayBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    viewerPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    viewerText: {
        color: '#E5E7EB',
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 4,
    },
    // --- Chat Section ---
    chatSection: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    chatTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        borderLeftWidth: 3,
        borderColor: '#ff529f',
        paddingLeft: 8,
    },
    chatList: {
        flex: 1,
        paddingBottom: 10, 
    },
    chatMessage: {
        flexDirection: 'row',
        // 🚀 स्पेसिंग बढ़ाई गई (Increased Spacing)
        marginBottom: 8, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        paddingVertical: 6, // Vertical padding बढ़ाया गया
        paddingHorizontal: 10,
        borderRadius: 8, // Border radius बढ़ाया गया
        opacity: 0.9,
    },
    chatUser: {
        color: '#60a5fa', 
        fontWeight: '700',
        // 🚀 फ़ॉन्ट साइज़ बढ़ाया गया (Increased Font Size)
        fontSize: 15, 
    },
    chatText: {
        color: '#fff',
        // 🚀 फ़ॉन्ट साइज़ बढ़ाया गया (Increased Font Size)
        fontSize: 15, 
        flexShrink: 1,
    },
    // --- Watch Button ---
    watchButton: {
        backgroundColor: '#e11d48', 
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20, 
    },
    watchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    watchButtonSubtitle: {
        color: '#FDE68A',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    // --- Share Button ---
    shareButton: {
        marginBottom: 10,
    },
    shareButtonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 24,
    },
    // --- Comment Bar ---
    commentBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 8,
        marginBottom: 20,
    },
    commentInput: {
        flex: 1,
        color: '#111',
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#ff3b6b',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
    },
});