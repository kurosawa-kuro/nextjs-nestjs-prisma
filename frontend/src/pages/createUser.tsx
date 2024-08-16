import { ChangeEvent, FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/users", {
        name: name,
        email: email,
        password: password,
      });
      alert("User created successfully!");
      router.push("/");
    } catch (error) {
      alert("Error creating user");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ユーザー新規登録</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Name:</label>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={handleNameChange}
          required
        />
        <label className={styles.label}>Email:</label>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label className={styles.label}>Password:</label>
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button className={styles.button} type="submit">
          登録
        </button>
      </form>
    </div>
  );
}