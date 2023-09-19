import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Alert,
  Share,
  Button,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from "react-native";
import axios from "axios";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useRoute } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import { Buffer } from "buffer";
import { basename } from "path";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import API_IP from "./config";

export default function VoirCarte() {
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const route = useRoute();
  const [editMode, setEditMode] = useState(false);
  const [editedNom, setEditedNom] = useState("");
  const [editedPrenom, setEditedPrenom] = useState("");
  const [editedTitre, setEditedTitre] = useState("");
  const [editedCin, setEditedCin] = useState("");
  const [editedEntreprise, setEditedEntreprise] = useState("");
  const [editedAdresse, setEditedAdresse] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedTelephone, setEditedTelephone] = useState("");
  const [editedSiteweb, setEditedSiteweb] = useState("");
  const [editedFb, setEditedFb] = useState("");
  const [editedTiktok, setEditedTiktok] = useState("");
  const [editedLinkedin, setEditedLinkedin] = useState("");
  const [editedWhatsapp, setEditedWhatsapp] = useState("");
  const [editedTwiter, setEditedTwiter] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const [type, setType] = useState("");
  const carteId = route.params?.carteId;
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [titre, setTitre] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [cin, setCin] = useState("");
  const [adresse, setAdresse] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [site_web, setSiteWeb] = useState("");
  const [fb, setFb] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [twiter, setTwiter] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [photoCinUri, setPhotoCinUri] = useState(null);
  const [photoRecentUri, setPhotoRecentUri] = useState(null);
  const [photoLogoUri, setPhotoLogoUri] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const viewRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${API_IP}:3000/api/carte/${carteId}`
        );
        const { data } = response;
        if (data.status === "validated" || data.status === "rejected") {
          setNom(data.nom);
          setPrenom(data.prenom);
          setTitre(data.titre);
          setEntreprise(data.entreprise);
          setCin(data.cin);
          setAdresse(data.adresse);
          setEmail(data.email);
          setTelephone(data.telephone);
          setSiteWeb(data.site_web);
          setFb(data.fb);
          setTiktok(data.tiktok);
          setLinkedin(data.linkedin);
          setWhatsapp(data.whatsapp);
          setTwiter(data.twiter);
          setDescription(data.description);
          setType(data.type);
          setStatus(data.status);
          //recuperation de photo cin
          const photoCinbase64 = Buffer.from(data.photo_cin).toString("base64");
          const photoCindecodedData = Buffer.from(photoCinbase64, "base64");
          const path = require("path");
          const photoCinfilename = path.basename(
            photoCindecodedData.toString()
          );

          // Supprimer tout ce qui se trouve avant la dernière occurrence de '\'
          const lastIndex = photoCindecodedData.toString().lastIndexOf("\\");
          const photoCinFilename = photoCindecodedData
            .toString()
            .substring(lastIndex + 1);

          const photoCinUri = `http://${API_IP}:3000/api/carte/uploads/${photoCinFilename}`;
          setPhotoCinUri(photoCinUri);
          console.log(photoCinUri);

          //Recuperation de photo recent
          const photoRecentbase64 = Buffer.from(data.photo_recent).toString(
            "base64"
          );
          const photoRecentdecodedData = Buffer.from(
            photoRecentbase64,
            "base64"
          );
          const pathphotoRecent = require("path");
          const photoRecentfilename = pathphotoRecent.basename(
            photoRecentdecodedData.toString()
          );

          // Supprimer tout ce qui se trouve avant la dernière occurrence de '\'
          const lastIndexphotoRecent = photoRecentdecodedData
            .toString()
            .lastIndexOf("\\");
          const photoRecentFilename = photoRecentdecodedData
            .toString()
            .substring(lastIndexphotoRecent + 1);

          const photoRecentUri = `http://${API_IP}:3000/api/carte/uploads/${photoRecentFilename}`;
          setPhotoRecentUri(photoRecentUri);
          console.log(photoRecentUri);

          if (data.type === "professionnel") {
            //recuperation de photo du logo
            const photoLogobase64 = Buffer.from(data.photo_logo).toString(
              "base64"
            );
            const photoLogodecodedData = Buffer.from(photoLogobase64, "base64");
            const pathphotoLogo = require("path");
            const photoLogofilename = pathphotoLogo.basename(
              photoLogodecodedData.toString()
            );

            // Supprimer tout ce qui se trouve avant la dernière occurrence de '\'
            const lastIndexphotoLogo = photoLogodecodedData
              .toString()
              .lastIndexOf("\\");
            const photoLogoFilename = photoLogodecodedData
              .toString()
              .substring(lastIndexphotoLogo + 1);

            const photoLogoUri = `http://${API_IP}:3000/api/carte/uploads/${photoLogoFilename}`;
            setPhotoLogoUri(photoLogoUri);
            console.log(photoLogoUri);
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la récupération de la carte de visite."
        );
      }
    };
    let intervalId = setInterval(() => {
      fetchData().then((status) => {
        if (status === "validated" || status === "rejected") {
          clearInterval(intervalId);
          intervalId = null;
        } else if (status === "pending") {
          updateData();
        }
      });
    }, 3000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [carteId]);

  const updateData = async () => {
    try {
      const response = await axios.put(
        `http://${API_IP}:3000/api/carte/${carteId}`,
        {
          nom: editedNom,
          prenom: editedPrenom,
          titre: editedTitre,
          cin: editedCin,
          entreprise: editedEntreprise,
          adresse: editedAdresse,
          email: editedEmail,
          telephone: editedTelephone,
          site_web: editedSiteweb,
          fb: editedFb,
          tiktok: editedTiktok,
          linkedin: editedLinkedin,
          whatsapp: editedWhatsapp,
          twiter: editedTwiter,
          description: editedDescription,
        }
      );
      // Traitez la réponse si nécessaire
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour des informations."
      );
    }
  };

  viewShotRef = React.createRef();

  captureView = () => {
    this.viewShotRef.current.capture().then((uri) => {
      this.shareImage(uri);
    });
  };

  // Initialisation du compteur à 5
  let shareCounter = 5;

  // Fonction de partage
  shareImage = async (uri) => {
    // Vérification du compteur
    if (shareCounter > 0) {
      const message = "Voici ma carte de visite !";
      await Sharing.shareAsync(uri, { message });

      // Décrémentation du compteur
      shareCounter--;

      // Affichage du nombre de partages restants
      console.log(`${shareCounter} partages restants`);
    } else {
      Alert.alert("Limite de partage atteinte !");
    }
  };

  const handleStartEdit = () => {
    setEditMode(true);
    setEditedNom(nom);
    setEditedPrenom(prenom);
    setEditedTitre(titre);
    setEditedCin(cin);
    setEditedEntreprise(entreprise);
    setEditedAdresse(adresse);
    setEditedEmail(email);
    setEditedTelephone(telephone);
    setEditedSiteweb(site_web);
    setEditedFb(fb);
    setEditedTiktok(tiktok);
    setEditedLinkedin(linkedin);
    setEditedWhatsapp(whatsapp);
    setEditedTwiter(twiter);
    setEditedDescription(description);
  };

  const handleFinishEdit = () => {
    setEditMode(false);
    setNom(editedNom);
    setPrenom(editedPrenom);
    setTitre(editedTitre);
    setCin(editedCin);
    setEntreprise(editedEntreprise);
    setAdresse(editedAdresse);
    setEmail(editedEmail);
    setTelephone(editedTelephone);
    setSiteWeb(editedSiteweb);
    setFb(editedFb);
    setTiktok(editedTiktok);
    setLinkedin(editedLinkedin);
    setWhatsapp(editedWhatsapp);
    setTwiter(editedTwiter);
    setDescription(editedDescription);

    updateData();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedNom(nom);
    setEditedPrenom(prenom);
    setEditedTitre(titre);
    setEditedCin(cin);
    setEditedEntreprise(entreprise);
    setEditedAdresse(adresse);
    setEditedEmail(email);
    setEditedTelephone(telephone);
    setEditedSiteweb(site_web);
    setEditedFb(fb);
    setEditedTiktok(tiktok);
    setEditedLinkedin(linkedin);
    setEditedWhatsapp(whatsapp);
    setEditedTwiter(twiter);
    setEditedDescription(description);
  };

  const windowWidth = Dimensions.get("window").width;

  return (
    <ScrollView>
      <ImageBackground
        source={require("../assets/back3.jpg")}
        style={styles.background}
      >
        {carteId ? (
          <>
            {status === "validated" ? (
              <View style={styles.container}>
                {/*<Text style={styles.title}>Ma carte de visite</Text>*/}
                {nom && titre && adresse && email && telephone ? (
                  <View style={styles.card}>
                    
                    {type === "personnel" && (
                      <>
                        <View style={styles.imageContainer}>
                          <Image
                            style={styles.image}
                            source={{ uri: photoRecentUri }}
                            onLoad={() => console.log("Image loaded")}
                          />
                        </View>
                      </>
                    )}
                    {type === "professionnel" && (
                      <>
                        <View style={styles.imageContainer}>
                          <Image
                            style={styles.image}
                            source={{ uri: photoRecentUri }}
                            onLoad={() => console.log("Image loaded")}
                          />
                        </View>
                      </>
                    )}
                    <View style={styles.row1}>
                      <View style={styles.row}>
                        <Text style={styles.label}>Nom :</Text>
                        {editMode ? (
                          <TextInput
                            value={editedNom}
                            onChangeText={setEditedNom}
                            style={[
                              styles.input,
                              { backgroundColor: "#cccccc", color: "#000000", marginRight: 232 },
                            ]}
                          />
                        ) : (
                          <Text style={styles.value}>{nom}</Text>
                        )}
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Prenom :</Text>
                        {editMode ? (
                          <TextInput
                            value={editedPrenom}
                            onChangeText={setEditedPrenom}
                            style={[
                              styles.input,
                              { backgroundColor: "#cccccc", color: "#000000", marginRight: 232 },
                            ]}
                          />
                        ) : (
                          <Text style={styles.value}>{prenom}</Text>
                        )}
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Fonction:</Text>
                        {editMode ? (
                          <TextInput
                            value={editedTitre}
                            onChangeText={setEditedTitre}
                            style={[
                              styles.input,
                              { backgroundColor: "#cccccc", color: "#000000", marginRight: 232 },
                            ]}
                          />
                        ) : (
                          <Text style={styles.value}>{titre}</Text>
                        )}
                      </View>
                      {type === "personnel" && (
                        <View style={styles.row}>
                          <Text style={styles.label}>N° CIN :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedCin}
                              onChangeText={setEditedCin}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{cin}</Text>
                          )}
                        </View>
                      )}

                      {type === "professionnel" && (
                        <View style={styles.row}>
                          <Text style={styles.label}>Entreprise :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedEntreprise}
                              onChangeText={setEditedEntreprise}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{entreprise}</Text>
                          )}
                        </View>
                      )}
                      <View style={styles.row}>
                        <Text style={styles.label}>Adresse :</Text>
                        {editMode ? (
                          <TextInput
                            value={editedAdresse}
                            onChangeText={setEditedAdresse}
                            style={[
                              styles.input,
                              { backgroundColor: "#cccccc", color: "#000000", marginRight: 232 },
                            ]}
                          />
                        ) : (
                          <Text style={styles.value}>{adresse}</Text>
                        )}
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>E-mail :</Text>
                        {editMode ? (
                          <TextInput
                            value={editedEmail}
                            onChangeText={setEditedEmail}
                            style={[
                              styles.input,
                              { backgroundColor: "#cccccc", color: "#000000", marginRight: 232 },
                            ]}
                          />
                        ) : (
                          <Text style={styles.value}>{email}</Text>
                        )}
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Téléphone :</Text>
                        {editMode ? (
                          <TextInput
                            value={editedTelephone}
                            onChangeText={setEditedTelephone}
                            style={[
                              styles.input,
                              { backgroundColor: "#cccccc", color: "#000000", marginRight: 232 },
                            ]}
                          />
                        ) : (
                          <Text style={styles.value}>{telephone}</Text>
                        )}
                      </View>
                      {site_web && (
                        <View style={styles.row}>
                          <Text style={styles.label}>Site web :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedSiteweb}
                              onChangeText={setEditedSiteweb}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{site_web}</Text>
                          )}
                        </View>
                      )}

                      {fb && (
                        <View style={styles.row}>
                          <Text style={styles.label}>Facebook :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedFb}
                              onChangeText={setEditedFb}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{fb}</Text>
                          )}
                        </View>
                      )}

                      {tiktok && (
                        <View style={styles.row}>
                          <Text style={styles.label}>Tiktok :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedTiktok}
                              onChangeText={setEditedTiktok}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{tiktok}</Text>
                          )}
                        </View>
                      )}

                      {linkedin && (
                        <View style={styles.row}>
                          <Text style={styles.label}>Linkedin :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedLinkedin}
                              onChangeText={setEditedLinkedin}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{linkedin}</Text>
                          )}
                        </View>
                      )}

                      {whatsapp && (
                        <View style={styles.row}>
                          <Text style={styles.label}>Whatsapp :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedWhatsapp}
                              onChangeText={setEditedWhatsapp}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{whatsapp}</Text>
                          )}
                        </View>
                      )}

                      {twiter && (
                        <View style={styles.row}>
                          <Text style={styles.label}>Twiter :</Text>
                          {editMode ? (
                            <TextInput
                              value={editedTwiter}
                              onChangeText={setEditedTwiter}
                              style={[
                                styles.input,
                                {
                                  backgroundColor: "#cccccc",
                                  color: "#000000",
                                  marginRight: 232
                                },
                              ]}
                            />
                          ) : (
                            <Text style={styles.value}>{twiter}</Text>
                          )}
                        </View>
                      )}
                      <View style={styles.row}>
                        <Text style={styles.label}>Description :</Text>
                        {editMode ? (
                          <TextInput
                            value={editedDescription}
                            onChangeText={setEditedDescription}
                            style={[
                              styles.input,
                              { backgroundColor: "#cccccc", color: "#000000", marginRight: 232 },
                            ]}
                          />
                        ) : (
                          <Text style={styles.value}>{description}</Text>
                        )}
                      </View>
                      <Button
                        title="Voir la carte de visite avec QR code"
                        onPress={toggleModal}
                      />
                      {editMode ? (
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity onPress={handleFinishEdit}>
                            <Text style={styles.buttonText}>Terminer</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleCancelEdit}>
                            <Text style={styles.buttonText}>Annuler</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity onPress={handleStartEdit}>
                          <Text style={styles.buttonText}>Modifier</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                      }}
                    >
                      
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          {/*Affichage carte */}
                          <ViewShot captureInvisible={true} ref={this.viewShotRef} options={{ quality: 0.9 }} >
                          <ImageBackground
                            source={require("../assets/black.png")}
                            style={[styles.container1, styles.alignedroite]}
                          >
                            <View style={styles.box1}></View>
                            <View style={styles.box2}></View>
                            <View style={styles.box3}>
                              <View style={styles.box31}>
                              
                                      <Image
                                          style={styles.img}
                                          resizeMode="cover"
                                          source={{ uri: photoRecentUri }}
                                          onLoad={() => console.log('Image loaded')}
                                        /> 
                                                            
                                {/* <Image
                                  style={styles.img}
                                  source={{
                                    uri: "data:image/jpeg;base64,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",
                                  }}
                                ></Image>*/}
                              </View>
                              <View style={[styles.box32, styles.spc]}>
                                <View style={[styles.alignedroite, styles.spc]}>
                                  <Text
                                    style={[
                                      styles.txtfont30,
                                      styles.txt0,
                                      styles.white,
                                    ]}
                                  >
                                    {nom}
                                  </Text>
                                  <Text
                                    style={[styles.txtfont30, styles.white]}
                                  >
                                    {prenom}
                                  </Text>
                                </View>

                                <Text
                                  style={[
                                    styles.txtfont30,
                                    styles.ctr,
                                    styles.white,
                                    styles.mrg,
                                  ]}
                                >
                                  {description}
                                </Text>
                                <Text
                                  style={[
                                    styles.txtfont30,
                                    styles.lft,
                                    styles.white,
                                    styles.mrg,
                                  ]}
                                >
                                  <Ionicons
                                    name="briefcase"
                                    size={24}
                                    color="grey"
                                  />
                                  {titre}
                                </Text>
                                <Text
                                  style={[
                                    styles.txtfont30,
                                    styles.lft,
                                    styles.white,
                                    styles.mrg,
                                  ]}
                                >
                                  <Ionicons
                                    name="call"
                                    size={24}
                                    color="grey"
                                  />{" "}
                                  {telephone}
                                </Text>
                                <Text
                                  style={[
                                    styles.txtfont30,
                                    styles.lft,
                                    styles.white,
                                    styles.mrg,
                                  ]}
                                >
                                  <Ionicons
                                    name="mail"
                                    size={24}
                                    color="grey"
                                  />{" "}
                                  {email}
                                </Text>
                              </View>
                              <View style={styles.box33}>
                                <QRCode
                                  style={styles.img2}
                                  value={`Nom: ${nom}\nTitre: ${titre}\nEntreprise: ${entreprise}\nAdresse: ${adresse}\nEmail: ${email}\nTéléphone: ${telephone}\nSite Web: ${site_web}\n\nPhoto CIN: ${photoCinUri}\nPhoto Récente: ${photoRecentUri}\nPhoto Logo: ${photoLogoUri}`}
                                />
                              </View>
                            </View>
                          </ImageBackground>
                          </ViewShot>
                          {/*Fin Affichage carte */}

                          <View style={styles.modalButtons}>
                            <Button title="Fermer" onPress={toggleModal} />
                            <Button
                              title="Partager"
                              onPress={this.captureView}
                            />
                          </View>
                        </View>
                      </View>
                      
                    </Modal>
                  </View>
                ) : (
                  <Text style={styles.error}>
                    Veuillez fournir toutes les informations pour créer une
                    carte de visite
                  </Text>
                )}
              </View>
            ) : status === "rejected" ? (
              <View>
                <Text style={styles.title}>
                  Votre carte de visite a été rejetée veuillez entrer des vraies
                  données s'il vous plait et recommencer dans 30 min.
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>
                  Votre carte de visite est en cours de validation
                </Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.error}>Vous n'avez pas de carte de visite</Text>
        )}
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "relative", 
  },
  background: {
    width: 500,
    height: 1100,
  },
  row1: {
    alignItems: "center",
    marginTop: -402,
    marginLeft: 10,
  },
  
  textContainer: {
    height: 200,
    marginTop: -40,
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  card1: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: "white",
    width: "100%",
    height: "80%",
  },
  ViewShot: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DEF3FA",
    width: "100%",
    height: "20%",
  },

  photo: {
    width: 90,
    height: 85,
    borderRadius: 8,
    marginTop: 22,
    marginLeft: 52,
  },
  image: {
    marginTop: -302,
    marginBottom: 398,
    marginLeft: -20,
    width: 505,
    height: 510,
    borderBottomLeftRadius: 550, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    width: 100,
    fontWeight: "bold",
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 600,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
    backgroundColor: "blue",
  },
  modalButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 65,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  nameContainer: {
    flex: 1,
  },
  code: {
    marginRight: 5,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 30,
    marginLeft: 15,
  },
  description: {
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 15,
  },
  iconContainer1: {
    flexDirection: "row",
    marginBottom: 5,
    marginLeft: -38,
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },

  phone: {
    fontSize: 14,
    marginLeft: 8,
    color: "#77B5FE",
  },
  container1: {
    width: "110%",
    height: "100%",
  },
  box1: {
    width: "10%",
    height: "100%",
  },
  box2: {
    backgroundColor: "white",
    width: "1%",
    height: "100%",
  },
  box3: {
    width: "89%",
    height: "100%",
    flexDirection: "column",
  },
  box31: {
    width: "100%",
    height: "40%",

    justifyContent: "center",
    paddingLeft: 20,
  },
  box32: {
    width: "100%",
    height: "40%",
  },
  mrg: {
    marginLeft: 10,
  },

  box33: {
    width: "100%",
    height: "20%",

    justifyContent: "center",
    marginLeft: 85,
  },
  alignedroite: {
    flexDirection: "row",
  },
  spc: {
    justifyContent: "space-evenly",
  },
  lft: {
    textAlign: "left",
  },
  ctr: {
    textAlign: "center",
  },

  img: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginLeft: '12%'
  },
  img2: {
    width: 100,
    height: 100,
    marginLeft: 80,
  },
  white: {
    color: "white",
  },
  txtfont30: {
    fontWeight: "bold",
    fontSize: 20,
  },
  txt0: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
