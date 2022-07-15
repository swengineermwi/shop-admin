import './css/style.css'
import './js/scripts'

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, query, collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { g, openModal, openModal_v2 } from './js/utils';
import shop from './shop';

const firebaseConfig = {
  apiKey: "AIzaSyAOoPVb11afNm662MKAbX5IfFsXf-0LRss",
  authDomain: "theecraftysoul-6efc7.firebaseapp.com",
  projectId: "theecraftysoul-6efc7",
  storageBucket: "theecraftysoul-6efc7.appspot.com",
  messagingSenderId: "81244087155",
  appId: "1:81244087155:web:c695e6403393eae483db06",
  measurementId: "G-CY91DEXG3D"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const querySnapshot = await getDocs(query(collection(db, "categories")))
    shop(querySnapshot.docs.map((snapshot) => {
      const data = {
        products: snapshot.data(),
        id: snapshot.id
      }

      return data
    }),
      (e) => { },
      (e) => {
        function handler() {
          function upload(uploadCallback) {
            var x = g("upload1");

            if ('files' in x) {
              if (x.files.length == 0) { alert("Select file") }
              else {
                var file = x.files[0];
                var fileName = "";

                if ('name' in file) {
                  fileName += file.name;
                }

                if ('size' in file) {
                  fileName += file.size + " bytes";
                }

                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed', (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                },
                  (error) => {
                    // Handle unsuccessful uploads
                  },
                  () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then(uploadCallback);
                  }
                );
              }
            } else { alert("Select file") }
          }

          const pName = g("pName").value
          const pPrice = g("pPrice").value
          const pDescription = g("pDescription").value

          if (pName !== '' && pPrice !== '' && pDescription !== '') {
            upload(async (downloadURL) => {
              await updateDoc(doc(db, "categories", e.target.value), {
                [pName]: {
                  name: pName,
                  price: parseFloat(pPrice),
                  description: pDescription,
                  image: downloadURL,
                  timestamp: serverTimestamp()
                }
              }).then(() => window.location.reload())
            })
          }
        }

        g("btnAddProduct").addEventListener("click", handler);
        openModal_v2("modal-add_product", () => { g("btnAddProduct").removeEventListener("click", handler); })
      }
    )

    g("btnAddCategory").addEventListener("click", () => openModal_v2("modal-add_category"))
    g("btnAddCat").addEventListener("click", async () => { await setDoc(doc(db, "categories", g("cName").value), {}).then(() => window.location.reload()) })
  } else {
    function foo() {
      openModal(g('modal-auth'), () => {
        if (!user) {
          foo()
        }
      })
    }

    // ! comment
    // * comment
    // ? comment
    // TODO: comment
    // comment

    g('btnLogin').addEventListener('click', (e) => {
      e.target.disabled = true
      signInWithEmailAndPassword(auth, g('email').value, g('password').value)
        .then((userCred) => { window.location.reload() })
    })

    foo()
  }
})
