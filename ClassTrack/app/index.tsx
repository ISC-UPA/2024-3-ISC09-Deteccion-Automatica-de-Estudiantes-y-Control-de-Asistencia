import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "../components/ThemedView";
import axios from "axios";

// Importa las pantallas principales
import AdminScreen from "./AdminScreen";
import TeacherScreen from "./TeacherScreen";
import StudentScreen from "./StudentScreen";

WebBrowser.maybeCompleteAuthSession();

const tenantID = "55c141c0-1153-41d9-8f6f-f53ab9f5da3a";
const clientID = "a4c4ef1c-b9e8-4ac5-b941-3219f02288f6";

export default function OfficeSignIn(props: any): JSX.Element {
  const [discovery, setDiscovery] =
    useState<AuthSession.DiscoveryDocument | null>(null);
  const [authRequest, setAuthRequest] =
    useState<AuthSession.AuthRequest | null>(null);
  const [authorizeResult, setAuthorizeResult] =
    useState<AuthSession.AuthSessionResult | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null); // Almacena el rol del usuario
  const [loading, setLoading] = useState(true); // Indica si está cargando
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const scopes = ["openid", "profile", "email", "offline_access"];
  const domain = `https://login.microsoftonline.com/${tenantID}/v2.0`;
  const redirectUrl = AuthSession.makeRedirectUri({ scheme: "myapp" });

  useEffect(() => {
    const getSession = async () => {
      const discoveryDocument = await AuthSession.fetchDiscoveryAsync(domain);

      const authRequestConfig: AuthSession.AuthRequestConfig = {
        prompt: AuthSession.Prompt.Login,
        responseType: AuthSession.ResponseType.Code,
        scopes,
        usePKCE: true,
        clientId: clientID,
        redirectUri: redirectUrl,
      };

      const request = new AuthSession.AuthRequest(authRequestConfig);
      setAuthRequest(request);
      setDiscovery(discoveryDocument);
    };

    getSession();
    checkSignInStatus();
  }, []);

  useEffect(() => {
    const getCodeExchange = async () => {
      if (!authorizeResult || !authRequest || !discovery) return;

      try {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            code: authorizeResult.params.code,
            clientId: clientID,
            redirectUri: redirectUrl,
            extraParams: {
              code_verifier: authRequest.codeVerifier || "",
            },
          },
          discovery
        );

        const { accessToken, idToken } = tokenResult;

        // Decodifica el ID token o access token
        const decodedToken: any =
          idToken || accessToken
            ? JSON.parse(atob((idToken || accessToken).split(".")[1]))
            : {};
        const userName = decodedToken.name;
        const userEmail = decodedToken.email;

        console.log(userEmail);
        console.log("Decoded Token:", decodedToken);

        // Almacena la información localmente
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("userEmail", userEmail);
        await AsyncStorage.setItem("userName", userName);

        setIsSignedIn(true);
      } catch (error) {
        console.error("Error during token exchange:", error);
      }
    };

    if (authorizeResult?.type === "success") {
      getCodeExchange();
    }
  }, [authorizeResult, authRequest, discovery]);

  useEffect(() => {
    const getRole = async () => {
      try {
        const userEmail = await AsyncStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("No se encontró el email del usuario.");
          setRole("guest"); // Rol por defecto
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://classtrack-api-alumnos-bqh8a0fnbpefhhgq.mexicocentral-01.azurewebsites.net/api/graphql",
          {
            query: `
              query Query($where: UserWhereUniqueInput!) {
              user(where: $where) {
                role
                id
              }
            }
            `,
            variables: {
              where: {
                email: userEmail,
              },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const role = response.data?.data?.user?.role || "guest"; // Asigna "guest" si no encuentra rol
        setRole(role);
      } catch (error) {
        console.error("Error al obtener el rol:", error);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      getRole();
    }
  }, [isSignedIn]);

  const handleSignIn = async () => {
    if (!authRequest || !discovery) return;
    const result = await authRequest.promptAsync(discovery);
    setAuthorizeResult(result);
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("accessToken");
    setIsSignedIn(false);
  };

  const checkSignInStatus = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    setIsSignedIn(!!token);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A4EF" />
      </View>
    );
  }

  // Renderiza la vista según el rol del usuario
  if (role === "admin") {
    return <AdminScreen />;
  } else if (role === "teacher") {
    return <TeacherScreen />;
  } else if (role === "student") {
    return <StudentScreen />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ClassTrack</Text>
        <Image
          source={require("../assets/images/ClassTrack3.png")}
          style={styles.logo}
        />
        {authRequest && discovery ? (
          isSignedIn ? (
            <TouchableOpacity
              style={[
                styles.button,
                colorScheme === "dark" ? styles.buttonDark : styles.buttonLight,
              ]}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={24} color="#ffffff" />
              <Text style={[styles.buttonText, styles.textDark]}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                colorScheme === "dark" ? styles.buttonDark : styles.buttonLight,
              ]}
              onPress={handleSignIn}
            >
              <Ionicons name="logo-microsoft" size={24} color="#ffffff" />
              <Text style={[styles.buttonText, styles.textDark]}>
                Sign In Microsoft
              </Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "40%",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonLight: {
    backgroundColor: "#00A4EF",
  },
  buttonDark: {
    backgroundColor: "#00A4EF",
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  textDark: {
    color: "#ffffff",
  },
});
