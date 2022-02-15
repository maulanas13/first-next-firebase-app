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
            <a href="/" style={{color: "#36454F", display: "inline-block", marginBottom: "1.5rem"}}>{"<"} Back</a>
            <div className={styles.splitRow}>
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