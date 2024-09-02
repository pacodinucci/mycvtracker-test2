import React, { ReactElement } from "react";
import styles from "../styles/newsLetter.module.css";

const NewsLetter = (): ReactElement => {
	return (
		<div className={styles.container}>
			<span className={styles.title}>Subscribe to our Newsletter</span>
			<form className={styles.form}>
				<input type="email" placeholder="Enter your email address here..." />
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
};

export default NewsLetter;
