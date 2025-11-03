
import styles from "./page.module.css";
import LoginButton from "./components/LoginButton";

export default function Home() {
  return (
    <div className={styles.home} data-model-id="20:2">
      <div className={styles.awal}>
        <img className={styles.image} src="https://c.animaapp.com/VRxB5Vfk/img/image-19.png" />
        <div className={styles.navbar}>
          <div className={styles["text-wrapper"]}>Home</div>
          <div className={styles.div}>Bootcamp</div>
          <div className={styles["text-wrapper-2"]}>Insight</div>
          <div className={styles["text-wrapper-3"]}>Glory</div>
          <div className={styles["text-wrapper-4"]}>Talks</div>
          <div className={styles["text-wrapper-5"]}>Info</div>
        </div>
        <div className={styles.rectangle}></div>
        <div className={styles["rectangle-2"]}></div>
        <div className={styles["text-wrapper-6"]}>Get Started</div>
        <LoginButton />
        <div className={styles["text-wrapper-8"]}>Explore Now</div>
        <p className={styles.p}>The official platform for sharing insights, learning and growing in the world of technology</p>
        <div className={styles.group}>
          <img className={styles["computer-only-white"]} src="https://c.animaapp.com/VRxB5Vfk/img/computer-only--white--1@2x.png" />
          <img className={styles["logo-UCCD-putih-copy"]} src="https://c.animaapp.com/VRxB5Vfk/img/logo-uccd-putih-copy-1@2x.png" />
        </div>
        <img className={styles["mask-group"]} src="https://c.animaapp.com/VRxB5Vfk/img/mask-group@2x.png" />
        <div className={styles["rectangle-3"]}></div>
      </div>
      <div className={styles["about-UCCD"]}>
        <img
          className={styles["untar-computer-club"]}
          src="https://c.animaapp.com/VRxB5Vfk/img/untar-computer--club-development.png"
        />
        <p className={styles["text-wrapper-9"]}>
          UCCD is an organization under the Student Executive Board (BEM) of FTI UNTAR, established to develop academic
          extracurricular activities, particularly in the field of information technology. Currently, UCCD consists of
          five main programs Insight, Talks, Bootcamp, Glory, and Info.
        </p>
        <img className={styles.img} src="https://c.animaapp.com/VRxB5Vfk/img/image--37--1.png" />
      </div>
      <div className={styles.subject}>
        <div className={styles.rect}><div className={styles["rectangle-4"]}></div></div>
        <div className={styles["rectangle-wrapper"]}><div className={styles["rectangle-4"]}></div></div>
        <div className={styles["div-wrapper"]}><div className={styles["rectangle-4"]}></div></div>
        <div className={styles["rect-2"]}><div className={styles["rectangle-4"]}></div></div>
        <div className={styles["rect-3"]}><div className={styles["rectangle-4"]}></div></div>
        <img className={styles["whats-in-it-for-you"]} src="https://c.animaapp.com/VRxB5Vfk/img/what-s-in-it-for-you-.png" />
        <p className={styles["text-wrapper-10"]}>Gain the information you need to level up your skills here</p>
        <p className={styles["text-wrapper-11"]}>
          Articles and discussions on current issues in technology and digital developments.
        </p>
        <p className={styles["text-wrapper-12"]}>
          Talkshows with tech professionals sharing industry insights and career experiences.
        </p>
        <p className={styles["gain-the-information"]}>Gain the information you need&nbsp;&nbsp;to level up your skills here</p>
        <img className={styles.BOOTCAMP} src="https://c.animaapp.com/VRxB5Vfk/img/bootcamp.png" />
        <img className={styles.INSIGHT} src="https://c.animaapp.com/VRxB5Vfk/img/insight.png" />
        <img className={styles.TALKS} src="https://c.animaapp.com/VRxB5Vfk/img/talks.png" />
        <img className={styles.GLORY} src="https://c.animaapp.com/VRxB5Vfk/img/glory.png" />
        <p className={styles["text-wrapper-13"]}>Gain the information you need to level up your skills here</p>
        <img className={styles["clip-path-group"]} src="https://c.animaapp.com/VRxB5Vfk/img/clip-path-group@2x.png" />
        <img className={styles["clip-path-group-2"]} src="https://c.animaapp.com/VRxB5Vfk/img/clip-path-group-1@2x.png" />
        <img className={styles.glory} src="https://c.animaapp.com/VRxB5Vfk/img/glory--1--1.svg" />
        <img className={styles.talks} src="https://c.animaapp.com/VRxB5Vfk/img/talks-1.svg" />
        <p className={styles["text-wrapper-14"]}>
          Updates on tech competitions and scholarships to support student growth and opportunities.
        </p>
        <img className={styles.INFO} src="https://c.animaapp.com/VRxB5Vfk/img/info.png" />
        <img className={styles.info} src="https://c.animaapp.com/VRxB5Vfk/img/info-1.svg" />
      </div>
      <footer className={styles.footer}>
        <div className={styles["rectangle-5"]}></div>
        <div className={styles["text-wrapper-15"]}>Contact</div>
        <div className={styles["text-wrapper-16"]}>About</div>
        <img className={styles["logo-UCCD-hitam"]} src="https://c.animaapp.com/VRxB5Vfk/img/logo-uccd-hitam--1--1@2x.png" />
      </footer>
    </div>
  );
}
