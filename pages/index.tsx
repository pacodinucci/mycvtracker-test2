import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, {
  useState
} from "react";
import NewsLetter from "../components/NewsLetter";
import styles from "../styles/HomePage.module.css";

import uploadBtnImg from "../assets/homepage/upload-btn.png";
import step1Img from "../assets/homepage/step-1.jpg";
import step2Img from "../assets/homepage/step-2.jpg";
import step3Img from "../assets/homepage/step-3.jpg";
import service1Img from "../assets/homepage/service-1.jpg";
import service2Img from "../assets/homepage/service-2.jpg";
import service3Img from "../assets/homepage/service-3.jpg";
import Link from "next/link";
import Uploadcv from "./modals/uploadcv";
// import { hotjar } from 'react-hotjar';


// type h: string ='';
export default function Home() {
  const [rankContent, setRankContent] = useState(0);

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="keywords" content="top cv review, topcv review, free cv review,top resume reviews" />
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
      {/* <>
      <script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:1795044,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
</> */}
      <div className={styles.container}>
        <main className={styles.section_1}>
          <span className={styles.heading}>
            We find matching jobs for your CV on your selected job boards(Indeed,LinkedIn etc.) <br />
            We also Help you Tailor Your CV to get more Interviews. <br />
            Use our tracking enabled CV service to keep track of your job search. <br />
            Join our two weeks trial work/Internship offer to help us match you for the right jobs in our Network.
          </span>
          <div className={styles.upload_box}>
            <span className={styles.upload_text}>
              Get Matching Jobs in your Inbox.
              <br /> Add Tracking to Your CV for best Job
              <br /> Search Results.
              <br /> Find Your CV Quality Score.
            </span>
            <button className={styles.upload_btn} data-toggle="modal" data-target="#membermodal1">Upload CV</button>
            <div className={styles.upload_drag_drop}>
              <div className={styles.upload_animated_circle}></div>
              <Image src={uploadBtnImg} alt="upload btn image" className={styles.upload_btn_img} />
            </div>
          </div>
          {/* <Uploadcv /> */}
        </main>
        
        <section className={styles.section_2}>
          <Link
            href="https://www.youtube.com/watch?v=vzyaq5pNz_s&ab_channel=MYCVTracker"
            target="_blank"
            rel="noreferrer"
            className={styles.section_2_title}
          >
            How it Works - Video Tutorial
          </Link>
          <span className={styles.section_2_sub_title}>
            Our software platform keeps track of jobs posted on the popular job <br />
            boards. We match your CV automatically and send you matching Job
            <br />
            URLs. Our team maintain extensive list of recruiters and advise you send <br />
            your CV to them. It can really save lot of time and increase your chances
            <br /> to get Interviews.
          </span>
          <div className={styles.hr}></div>
          <div className={styles.flex_box}>
            <div className={styles.box}>
              <Image src={step1Img} alt="step 1" className={styles.box_image} />
              <span className={styles.box_step_heading}>Upload Your CV</span>
              <span className={styles.box_step_content}>
                Get Free CV Review and Rating Score from our Team.(PDF or use DOCX for tracking). We share best job
                winning CV templates with you.
              </span>
            </div>
            <div className={styles.box}>
              <Image src={step2Img} alt="step 2" className={styles.box_image} />

              <span className={styles.box_step_heading}>Select Your Target Job Sector</span>
              <span className={styles.box_step_content}>
                We match your CV and start sending you matching jobs and Recruiters Information. You can add tracking to
                your CV and Get Notified when recruiters open it.
              </span>
            </div>
            <div className={styles.box}>
              <Image src={step3Img} alt="step 3" className={styles.box_image} />
              <span className={styles.box_step_heading}>
                Find Jobs on our Job Board and apply with Tracking Enabled CV
              </span>
              <span className={styles.box_step_content}>
                Recruiter access your cv on Job Board you can get free tracking on your job applications.
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section_3}>
          <span className={styles.section_3_title}>
            We help in other ways with new <br /> tools and services to get you that
            <br />
            job
          </span>
          <div className={styles.hr}></div>
          <div className={styles.flex_box}>
            <div className={styles.box}>
              <Image src={service1Img} alt="service 1" className={styles.box_image} />
              <span className={styles.box_service_heading}>
                Get a job-winning CV and find your next <br /> role faster.
              </span>
              <span className={styles.box_service_content}>
                With our CV-writing services, you’ll get: 1:1 support from your professional writer. A custom, modern,
                industry-specific CV that tells your career story. Double the interviews, guaranteed!
                <br />
                <Link href="/cv-writing-packages" className={styles.box_service_read_more}>
                  Read More...
                </Link>
              </span>
            </div>
            <div className={styles.box}>
              <Image src={service2Img} alt="service 2" className={styles.box_image} />
              <span className={styles.box_service_heading}>
                Host your CV with <br /> private data masking.
              </span>
              <span className={styles.box_service_content}>
                You can host your CV on our website and share the URL with anyone in secured manner.
                <br />
                <Link href="/cvhosting" className={styles.box_service_read_more}>
                  Read More...
                </Link>
              </span>
            </div>
            <div className={styles.box}>
              <Image src={service3Img} alt="service 3" className={styles.box_image} />
              <span className={styles.box_service_heading}>
                Get Real Hands On Experience
                <br /> for getting the job.
              </span>
              <span className={styles.box_service_content}>
                We connect you to our partner companies those can offer you training to pick up right skills to get the
                Job.
                <br />
                <Link href="/cvoffers" className={styles.box_service_read_more}>
                  Read More...
                </Link>
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section_4}>
          <span className={styles.section_4_title}>Get in touch</span>
          <div className={styles.hr}></div>
          <form className={styles.form}>
            <div className={styles.form_line_1}>
              <input className={styles.form_input_1} type="text" placeholder="Name" />
              <input className={styles.form_input_1} type="email" placeholder="Email Address" />
              <input className={styles.form_input_1} type="text" placeholder="Subject" />
            </div>
            <textarea className={styles.form_input_2} placeholder="Type your message here..."></textarea>
            <input className={styles.form_send_message_btn} type="submit" value="Send Message" />
          </form>
        </section>
        <NewsLetter />
      </div>
      
    </div>
  );
}

//export default Home;
