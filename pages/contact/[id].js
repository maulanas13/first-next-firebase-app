import styles from '../../styles/Home.module.css';
import Link from 'next/link';
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
            <Link href="/" style={{color: "#36454F"}}>{"< Back"}</Link>
            <div className={styles.splitRow} style={{marginTop: "1.5rem"}}>
                <h1>Contact Detail</h1>
                <p>Name: {contact.name}</p>
                <p>Phone: {contact.phone ? contact.phone : "-"}</p>
                <p>Email: {contact.email ? contact.email : "-"}</p>
                <p>Where you met at first time: {contact.where ? contact.where : "-"}</p>
            </div>
        </div>
    )
}

export default ContactDetail;