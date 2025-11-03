
'use client';

import Link from 'next/link';
import styles from '../page.module.css';

export default function LoginButton() {
  return (
    <Link href="/login">
      <div className={styles["text-wrapper-7"]}>Log In</div>
    </Link>
  );
}
