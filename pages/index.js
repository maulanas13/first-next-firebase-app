import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import firestore from '../firebase/clientApp';
import {
  collection,
  query,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  orderBy
} from "@firebase/firestore";
import Swal from 'sweetalert2';
import { useFormik } from 'formik';

// Select data table target from firestore
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
};

export default function Home({contact}) {
  // REFRESH DATA SECTION
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  // FORMIK SECTION
  const validate = values => {
    const errors = {}

    if (!values.name) {
      errors.name = "Please fill the name (mandatory)"
    }

    return errors;
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      where: ""
    },
    validate,
    onSubmit: async (values, {resetForm}) => {
      // Get current timestamp to be use as id
      const createTimeId = Date.now().toString();

      // Target the destination on firestore
      const destination = doc(firestore, `contact/${createTimeId}`);

      try {
        await setDoc(destination, values);
        resetForm();
        refreshData();
        Swal.fire(
          'Success',
          'New contact added',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error',
          'An error occurred while adding contact',
          'error'
        );
      };
    }
  });

  // DELETE FUNCTION SECTION
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
        <link rel="icon" href="/contact_favicon.png" />
      </Head>

      <main className={styles.contentWrap}>
        <div className={styles.splitRow}>
          <h1>Welcome to Quick New Contact App</h1>
          <p>Add new people you&apos;ve recently met and never forget again.</p>
          <form className={styles.formWrap} onSubmit={formik.handleSubmit}>
            <label htmlFor='name'>Contact Name</label>
            <input 
              id='name' 
              type='text'
              name='name' 
              value={formik.values.name} 
              onChange={formik.handleChange}
            />
            {formik.errors.name ? <div style={{color: "red", fontSize: "0.75rem"}}>{formik.errors.name}</div> : null}
            <label htmlFor='phone'>Phone Number</label>
            <input 
              id='phone' 
              type='text'
              name='phone' 
              value={formik.values.phone} 
              onChange={formik.handleChange}
            />
            <label htmlFor='email'>Email Address</label>
            <input 
              id='email' 
              type='email'
              name='email' 
              value={formik.values.email} 
              onChange={formik.handleChange}
            />
            <label htmlFor='where'>Where do you meet this person at first time?</label>
            <input 
              id='where' 
              type='text'
              name='where' 
              value={formik.values.where} 
              onChange={formik.handleChange}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className={styles.splitRow}>
          <h1>Contact List (A~Z)</h1>
          <p>Click the list name for detail.</p>
          <ol>
            {contact.map((val, index) => (
                <li className={styles.contactList} key={val.id}>
                  <Link href={`/contact/${val.id}`}>
                    <span>{index + 1}. {val.name} - {val.phone ? val.phone : "no phone"}{" "}</span>
                  </Link>
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