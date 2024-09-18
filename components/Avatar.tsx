import { useState, useEffect } from "react";
import { supabase } from "@/lib/server/supabase";
import { StyleSheet, View, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import GradientButton from "./GradientButton";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        console.log("No image uri!");
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) => {
        console.log(res);
        return res.arrayBuffer();
      });
      console.log("Fetched ArrayBuffer:", arraybuffer);

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";

      const path = `${Date.now()}.${fileExt}`;
      console.log("File path:", path); // Already done
      console.log("File extension:", fileExt); // Validate the extension
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });
      console.log("Upload result:", data, uploadError);
      if (uploadError) {
        console.log(uploadError);
        throw uploadError;
      }
      console.log(data.path);
      onUpload(data.path);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={{ display: "flex", alignItems: "flex-start" }}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <GradientButton
        onPress={uploadAvatar}
        disabled={uploading}
        buttonStyles={{
          width: 50,
          borderRadius: 100,
          position: "absolute",
          bottom: 0,
          left: 100,
        }}
      >
        <FontAwesome name="edit" size={18} color={"#fff"} />
      </GradientButton>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
  },
});
