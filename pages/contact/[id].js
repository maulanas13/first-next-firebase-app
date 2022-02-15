import styles from '../../styles/Home.module.css'
import firestore from '../../firebase/clientApp';
import {
    doc,
    getDoc,
} from "@firebase/firestore";

export async function getServerSideProps(context) {
  // Get id from url params 
  const id = context.query.id;
  
  // Get data from firestore using id from url params
  const getData = (await getDoc(doc(firestore, "contact", id))).data();

  return {
    props: {
      contact: getData
    }
  }
};

function ContactDetail({contact}) {

    return (
        <div className={styles.mainWrap}>
            <a href="/">Back</a>
            <div className={styles.contentWrap}>
                <h1>Contact Detail</h1>
                <h3>Name: {contact.name}</h3>
                <h3>Phone: {contact.phone}</h3>
                <h3>Email: {contact.email}</h3>
                <h3>Where you met at first time: {contact.where ? contact.where : "-"}</h3>
            </div>
        </div>
    )
}

export default ContactDetail;