import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#15B392" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.content}>
            At Build A Bud, we respect your privacy and are committed to protecting your personal information. We collect basic information like your name, email, and fitness data (e.g., activity logs and progress), as well as authentication data for secure login via Firebase. This data is used to manage your account, track your fitness activities, and improve your experience with the app. We ensure your data is protected with encryption and secure storage services. We do not sell your information but may share it with trusted partners like Firebase or as required by law. You can update, access, or delete your data at any time through the app, and you have control over certain data collection settings. We retain your data as long as necessary for providing the service or as required by law. We may update this policy periodically, and we will notify you of any changes. By using Build A Bud, you consent to this Privacy Policy.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    alignContent: 'center',
    textAlign: 'center',
  },
});

export default PrivacyPolicyScreen;
