"use client";

import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { cn } from "@/lib/utils";

// --- IMPORTANT FOR LOCAL DEVELOPMENT ---
// Replace these placeholder values with your actual Firebase project configuration
// You can find this in your Firebase Console -> Project settings -> Your apps -> Web app -> Config
const firebaseConfig = {
  apiKey: "AIzaSyAE8AwXgkO3D40DqaDup-DpZ85HRcY3LvE",
  authDomain: "comm-platform-8d6ed.firebaseapp.com",
  projectId: "comm-platform-8d6ed",
  storageBucket: "comm-platform-8d6ed.firebasestorage.app",
  messagingSenderId: "188042199299",
  appId: "1:188042199299:web:f30ec66682c90b39372936",
  measurementId: "G-BTVFLDGE68"
};

// For local development, you also need a unique appId for the Firestore path.
// Choose any unique string for your local app, e.g., "my-local-hr-app"
const appId = "my-comm-platform"; // <--- REPLACE THIS with a unique string for your local app

// The initialAuthToken is usually provided by the Canvas environment.
// For local development, we'll just set it to null as we're using anonymous sign-in.
const initialAuthToken = null;
// --- END IMPORTANT FOR LOCAL DEVELOPMENT ---


// Initialize Firebase (will only initialize once across the app)
let app;
let db;
let auth;
let isFirebaseInitializedSuccessfully = false;

if (firebaseConfig && Object.keys(firebaseConfig).length > 0 && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") { // Added a check for placeholder
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      isFirebaseInitializedSuccessfully = true;
      console.log("Firebase app initialized successfully.");
    }
  } catch (e) {
    console.error("Error initializing Firebase:", e);
  }
} else {
  console.error("Firebase config is missing or contains placeholder values. Please update firebaseConfig in GroupDiscussion.jsx.");
}


const GroupDiscussion = ({ userName = "Mahaveer", userRole = "Manager" }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isFirebaseInitializedSuccessfully || !db || !auth) {
      setError("Firebase services are not available. Please check your Firebase configuration.");
      setIsLoading(false);
      return;
    }

    const setupFirebaseAuthentication = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUserId(user.uid);
            setIsAuthReady(true);
            console.log("Firebase Auth Ready. User ID:", user.uid);
          } else {
            console.log("No user signed in. Attempting anonymous sign-in.");
            setCurrentUserId(null);
            setIsAuthReady(false);
            signInAnonymously(auth).catch(e => console.error("Anonymous sign-in failed:", e));
          }
        });

        return () => unsubscribeAuth();
      } catch (e) {
        console.error("Firebase authentication error:", e);
        setError("Failed to authenticate with Firebase. Please try again.");
        setIsLoading(false);
      }
    };

    setupFirebaseAuthentication();
  }, []);

  useEffect(() => {
    if (!isFirebaseInitializedSuccessfully || !isAuthReady || !db || !currentUserId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const messagesCollectionRef = collection(db, `artifacts/${appId}/public/data/messages`);
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'), limit(100));

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching messages from Firestore:", err);
      setError("Failed to load messages from the database.");
      setIsLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [isFirebaseInitializedSuccessfully, isAuthReady, db, currentUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !isAuthReady || !currentUserId) {
      return;
    }

    try {
      const messagesCollectionRef = collection(db, `artifacts/${appId}/public/data/messages`);
      await addDoc(messagesCollectionRef, {
        text: newMessage,
        senderId: currentUserId,
        senderName: userName,
        userRole: userRole,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (e) {
      console.error("Error sending message to Firestore:", e);
      setError("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-lg shadow-xl border border-neutral-700">
      <h2 className="text-xl font-bold text-white p-4 border-b border-neutral-700 text-center">
        Group Discussion
      </h2>

      {isLoading && <p className="text-neutral-400 p-4 text-center">Loading messages...</p>}
      {error && <p className="text-red-500 p-4 text-center">Error: {error}</p>}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {!isLoading && !error && messages.length === 0 && (
          <p className="text-neutral-400 text-center">No messages yet. Be the first to start the discussion!</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col p-3 rounded-lg max-w-[80%] break-words",
              msg.senderId === currentUserId ? "self-end bg-blue-600 text-white ml-auto" : "self-start bg-neutral-700 text-neutral-200 mr-auto"
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={cn(
                "font-semibold",
                msg.userRole === "Manager" ? "text-yellow-300" : "text-blue-300"
              )}>
                {msg.senderName} ({msg.userRole})
              </span>
              {msg.timestamp && (
                <span className="text-xs text-neutral-400 ml-2">
                  {new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-neutral-700 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-md border border-neutral-600 bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isAuthReady}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isAuthReady || newMessage.trim() === ''}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupDiscussion;
