import React, { useEffect, useState, useContext } from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import { auth } from "../firebase/config";
import { getUserStats } from "../services/userProgressService";

const LivingRoom = () => {
  const [avatarLevel, setAvatarLevel] = useState("skinny");
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    const loadUserLevel = async () => {
      if (auth.currentUser) {
        try {
          const stats = await getUserStats(auth.currentUser.uid);
          if (stats) {
            setUserLevel(stats.level);
            // Determine avatar type based on user level
            if (stats.level >= 76) {
              setAvatarLevel("bulky");
            } else if (stats.level >= 50) {
              setAvatarLevel("moderate");
            } else {
              setAvatarLevel("skinny");
            }
          }
        } catch (error) {
          console.error("Error loading user level:", error);
        }
      }
    };

    loadUserLevel();
  }, []);

  const getSpriteImage = () => {
    switch (avatarLevel) {
      case "moderate":
        return require("../assets/avatar/Moderate-Sprite.png");
      case "bulky":
        return require("../assets/avatar/Bulky-Sprite.png");
      case "skinny":
      default:
        return require("../assets/avatar/Skinny-Sprite.png");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/avatar/LivingRoom.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Image
          source={getSpriteImage()}
          style={styles.spriteImage}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up the full screen height
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1, // Make the background image take up the whole space
    width: "100%", // Ensure the background spans the entire width
    height: "100%", // Ensure the background spans the entire height
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
  spriteImage: {
    position: "absolute",
    bottom: 40, // Distance from the bottom of the screen
    right: 10, // Distance from the right side of the screen
    maxWidth: "60%", // Ensure the sprite doesn't exceed 25% of the container's width
    maxHeight: "60%", // Ensure the sprite doesn't exceed 25% of the container's height
    resizeMode: "contain", // Make sure the sprite keeps its aspect ratio
  },
});

export default LivingRoom;
