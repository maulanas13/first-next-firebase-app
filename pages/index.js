import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import firestore from '../firebase/clientApp';
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  limit,
  doc,
  getDocs,
  deleteDoc,
  orderBy
} from "@firebase/firestore";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const contactCollection = collection(firestore,'contact');

export async function getServerSideProps() {
  // Query data from firestore & order it by name
  const contactQuery = query(contactCollection, orderBy("name"));
    
  // Get contact table & make row results into array
  const querySnapshot = (await getDocs(contactQuery)).docs;
  
  // Map & make it into the result to be use
  const result = querySnapshot.map((val) => (
    {...val.data(), id:val.id}
  ))

  return {
    props: {
      contact: result
    }
  }
}

export default function Home({contact}) {
  console.log("40", contact);

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const deleteContact = async (documentId) => {
    const selectedContact = doc(firestore,`contact/${documentId}`);
    await deleteDoc(selectedContact);
    refreshData();
    Swal.fire(
      'Success',
      'Contact has deleted',
      'success'
    );
  };

  return (
    <div className={styles.mainWrap}>
      <Head>
        <title>Quick Contact App</title>
        <meta name="description" content="My first Next.js firebase project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.contentWrap}>
        <div className={styles.splitRow}>
          <h1>Welcome to Quick New Contact App</h1>
          <p>Add new people you've recently met and never forget again</p>
        </div>
        <div className={styles.splitRow}>
          <h1>Contact List (A~Z)</h1>
          <ol>
            {contact.map((val, index) => (
                <li key={index}>
                  {val.name} ({val.phone})
                  <button onClick={() => deleteContact(val.id)}>Delete</button>
                </li>
              ))
            }
          </ol>
        </div>
      </main>
    </div>
  )
}