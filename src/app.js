// firebase configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyCZRsgT4aQs3BNIg04wVL9IJ7l__9hzJwc',
  authDomain: 'tripbird-1e145.firebaseapp.com',
  projectId: 'tripbird-1e145',
  storageBucket: 'tripbird-1e145.appspot.com',
  messagingSenderId: '890785305127',
  appId: '1:890785305127:web:36d4e4725c4ad2b06bb402',
  measurementId: 'G-G64HD2WZ6E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

// user signup start here
const signupform = document.querySelector('#signupform');
const signupAlert = document.querySelector('#signupAlert');
const signinform = document.querySelector('#signinform');
const signinAlert = document.querySelector('#signinAlert');

if (signupform) {
  signupform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target['username'].value;
    const email = e.target['email'].value;
    const password = e.target['password'].value;
    console.log({ username, email, password });
    if (!username || !email || !password) {
      (signupAlert.style.display = 'block'),
        (signupAlert.textContent = 'Please fill all the fields');
      return;
    }
    signupAlert.style.display = 'none';
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log('user created in firebase authentication users', user);

          localStorage.setItem('token', user.accessToken);
          localStorage.setItem('userid', user.uid);
          // ...
          const userData = {
            id: user.uid,
            username,
            email,
            created_at: Timestamp.fromDate(new Date()),
          };
          await setDoc(doc(db, 'users', user.uid), userData)
            .then(() => {
              console.log('user created in firestore database');
            })
            .catch((err) => {
              console.log('error in creating user in firestore database', err);
            });
        })

        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('errCode', errorCode);
          console.log('errMessage', errorMessage);
          if (errorCode?.includes('auth/email-already-in-use')) {
            (signupAlert.style.display = 'block'),
              (signupAlert.textContent = 'User already exists');
            return;
          }
          // ..
        });
    } catch (err) {
      console.log(err);
    }
  });
}
// user signup end here

// user signin start here
if (signinform) {
  signinform.addEventListener('submit', async (e) => {
    e.preventDefault();
    // const username = e.target['username'].value;
    const email = e.target['email'].value;
    const password = e.target['password'].value;
    console.log({ email, password });
    if (!email || !password) {
      (signinAlert.style.display = 'block'),
        (signinAlert.textContent = 'Please fill all the fields');
      return;
    }
    signinAlert.style.display = 'none';
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log('user is signed in ', user);

          localStorage.setItem('token', user.accessToken);
          localStorage.setItem('userid', user.uid);
          // ...
        })

        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('errCode', errorCode);
          console.log('errMessage', errorMessage);
          if (errorCode?.includes('auth/invalid-login-credentials')) {
            (signinAlert.style.display = 'block'),
              (signinAlert.textContent = 'Please enter valid credentials');
            return;
          }
          // ..
        });
    } catch (err) {
      console.log(err);
    }
  });
}
// user signin end here
