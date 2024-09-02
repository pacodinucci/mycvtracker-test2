
import React from "react";
import styles from "../../styles/HomePage.module.css";




const Uploadcv = () => {
    return (
      <div id="membermodal" className="modal fade" role="dialog">
         <div role="document">
            <div className={styles.modalcontent}>
                <span
                    className={`d-block w-100 text-end pe-3 ${styles.close}`}
                    data-dismiss="modal"
                    aria-label="Close">
                    <img alt="Close" className="p-2" />
                </span>
                <div className="modal-body"></div>
            </div>
        </div>
        </div>
      );
    };



export default Uploadcv;
