# [Sistema Android Keystore](https://developer.android.com/training/articles/keystore)

## [Android App Keystore](https://developer.android.com/studio/publish/app-signing)

- comando genérico: `keytool -genkey -v -keystore MY-RELEASE-KEY.keystore -alias MY_ALIAS_NAME -keyalg RSA -keysize 2048 -validity 10000`
- comando proyecto: `keytool -genkey -v -keystore bucoapp.keystore -alias bucoapp -keyalg RSA -keysize 2048 -validity 10000`

Informativo: CN=BUCO, OU=IT, O=Strapp International, L=Panama, ST=Panama, C=PA  
Alias: bucoapp
Password: u8JvDVMcqbU7WBrG

---

## [Configurar un hash de clave de activación](https://developers.facebook.com/docs/android/getting-started/#release-key-hash)

- comando genérico: `keytool -exportcert -alias <RELEASE_KEY_ALIAS> -keystore <RELEASE_KEY_PATH> | openssl sha1 -binary | openssl base64`

---

### [Hashes de clave (Facebook Developers)](https://developers.facebook.com/)
