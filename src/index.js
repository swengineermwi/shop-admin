import './css/style.css'
import './js/scripts'

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, query, collection, getDocs, doc, updateDoc, serverTimestamp, setDoc, getDoc, addDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { g, openModal, openModal_v2 } from './js/utils';
import shop, { categoryUi } from './shop';
import { form } from '../../utils'

const firebaseConfig = {
  apiKey: "AIzaSyD3Wht_d_b-uJiNUKUb7fcOF-lujMMifKw",
  authDomain: "marcstorezm.firebaseapp.com",
  projectId: "marcstorezm",
  storageBucket: "marcstorezm.appspot.com",
  messagingSenderId: "695355469113",
  appId: "1:695355469113:web:8c8986c2fa3abb84990ce8",
  measurementId: "G-8527HXBTG8"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    getDoc(doc(db, 'system/categories'))
      .then((snapshot) => {
        const data = snapshot.data()

        const categoriesArea = g("categories")
        categoriesArea.innerHTML = ""

        for (const key in data) {
          if (data.hasOwnProperty.call(data, key)) {
            categoriesArea.appendChild(categoryUi(key, {}, (e) => {
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
                    addDoc(collection(db, 'products'), {
                      name: pName,
                      price: parseFloat(pPrice),
                      description: pDescription,
                      images: [downloadURL],
                      timestamp: serverTimestamp(),
                      category: key
                    }).then(() => {
                      location.reload()
                    })
                    // await addDoc(doc(db, "categories", e.target.value), {
                    //   [pName]: {

                    //   }
                    // }).then(() => window.location.reload())
                  })
                }
              }

              g("btnAddProduct").addEventListener("click", handler);

              openModal_v2("modal-add_product", () => { g("btnAddProduct").removeEventListener("click", handler); })
            }))
            // categories.forEach(category => {
            //   categoriesArea.appendChild(categoryUi(category.id, category.products, (e) => addProductCallback(e)))
            // });
          }
        }
      })
    // const querySnapshot = await getDocs(query(collection(db, "categories")))

    // shop(
    //   querySnapshot
    //     .docs
    //     .map((snapshot) => {
    //       const data = {
    //         products: snapshot.data(),
    //         id: snapshot.id
    //       }
    //       return data
    //     }),

    //   (e) => { },

    //   (e) => {
    //     function handler() {
    //       function upload(uploadCallback) {
    //         var x = g("upload1");

    //         if ('files' in x) {
    //           if (x.files.length == 0) { alert("Select file") }
    //           else {
    //             var file = x.files[0];

    //             var fileName = "";

    //             if ('name' in file) {
    //               fileName += file.name;
    //             }

    //             if ('size' in file) {
    //               fileName += file.size + " bytes";
    //             }

    //             const storageRef = ref(storage, fileName);
    //             const uploadTask = uploadBytesResumable(storageRef, file);

    //             uploadTask.on('state_changed', (snapshot) => {
    //               // Observe state change events such as progress, pause, and resume
    //               // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //               console.log('Upload is ' + progress + '% done');
    //               switch (snapshot.state) {
    //                 case 'paused':
    //                   console.log('Upload is paused');
    //                   break;
    //                 case 'running':
    //                   console.log('Upload is running');
    //                   break;
    //               }
    //             },
    //               (error) => {
    //                 // Handle unsuccessful uploads
    //               },
    //               () => {
    //                 // Handle successful uploads on complete
    //                 // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //                 getDownloadURL(uploadTask.snapshot.ref).then(uploadCallback);
    //               }
    //             );
    //           }
    //         } else { alert("Select file") }
    //       }

    //       const pName = g("pName").value
    //       const pPrice = g("pPrice").value
    //       const pDescription = g("pDescription").value

    //       if (pName !== '' && pPrice !== '' && pDescription !== '') {
    //         upload(async (downloadURL) => {
    //           await updateDoc(doc(db, "categories", e.target.value), {
    //             [pName]: {
    //               name: pName,
    //               price: parseFloat(pPrice),
    //               description: pDescription,
    //               image: downloadURL,
    //               timestamp: serverTimestamp()
    //             }
    //           }).then(() => window.location.reload())
    //         })
    //       }
    //     }

    //     g("btnAddProduct").addEventListener("click", handler);

    //     openModal_v2("modal-add_product", () => { g("btnAddProduct").removeEventListener("click", handler); })
    //   }
    // )

    g("btnAddCategory").addEventListener("click", () => openModal_v2("modal-add_category"))

    form('_category', async (data) => {
      setDoc(
        doc(db, 'system/categories'), {
        [data.category]: ""
      },
        {
          merge: true
        }
      ).then(() => { location.reload() })
    })
  } else {
    function foo() {
      openModal(g('modal-auth'), () => {
        if (!user) {
          foo()
        }
      })
    }

    g('btnLogin').addEventListener('click', (e) => {
      e.target.disabled = true
      signInWithEmailAndPassword(auth, g('email').value, g('password').value)
        .then((userCred) => { window.location.reload() })
    })

    foo()
  }
})
