import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FeedbackScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const subject = 'App Feedback';
    const body = feedback;
    Linking.openURL(`https://mail.google.com/mail/?view=cm&fs=1&to=c21-0097-586@pangasinan.uphsl.edu.ph&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#15B392" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.mainTitle}>How can we help?</Text>
        <Text style={styles.subtitle}>Questions, bug reports, feedback - we're here for it all.</Text>
        
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={6}
          placeholder="Please enter your feedback here..."
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity 
          style={[styles.submitButton, !feedback.trim() && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!feedback.trim()}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#15B392',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default FeedbackScreen;
