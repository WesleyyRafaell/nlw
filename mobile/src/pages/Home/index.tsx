import React, { useEffect, useState } from 'react';
import { Feather as Icon }  from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet  } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUfResponse {
  sigla: string;
}

interface IBGEMunicipioResponse {
  nome: string;
}


const Home = () => {
    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ municipios, setMunicipios ] = useState<string[]>([]);
    const navigation = useNavigation();

    const [selectedUf, setSelectedUf] = useState<string>('');
    const [selectedMunicipio, setSelectedMunicipio] = useState<string>('');


    useEffect(() => {
      axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
       const ufsInitial =  response.data.map(uf => uf.sigla)
       setUfs(ufsInitial)
      })
    }, []);

    useEffect(() => {
      axios.get<IBGEMunicipioResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        setMunicipios(response.data.map(municipio => municipio.nome));
      })
    },[selectedUf])

    function handleNavigationToPoints(){
      navigation.navigate('Points', {
        uf: selectedUf,
        city: selectedMunicipio
      });
    }

    function handleChangeSelectUf(event){
      setSelectedUf(event);
    }

    function handleChangeSelectMunicipio(event){
      setSelectedMunicipio(event);
    }

    return (
    <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }}>
       <View style={styles.main}>
            <Image source={require('../../assets/logo.png')} />
            <Text style={styles.title}> Seu marketplace de coleta de resíduos </Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente.</Text>
       </View>

       <RNPickerSelect 
            onValueChange={handleChangeSelectUf}
            items={ufs.map(uf => (
              {
                label: uf, value: uf
              }
            ))}
        />

      <RNPickerSelect 
                  onValueChange={handleChangeSelectMunicipio}
                  items={municipios.map(municipios => (
                    {
                      label: municipios, value: municipios
                    }
                  ))}
              />


        <View style={styles.footer}>
            <RectButton style={styles.button} onPress={handleNavigationToPoints}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name="arrow-right" color="#FFF" size={24} />
                </Text>
              </View>
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </RectButton>
        </View>
    </ImageBackground>
    )
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;