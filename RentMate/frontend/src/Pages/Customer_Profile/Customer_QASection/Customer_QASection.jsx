import React, { useState, useEffect, useContext } from "react";
import styles from "./customer_QASection.module.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Navigator from "../../../components/Customer_Profile/profile_nav/Profile_nav";
import Info_Card from "../../../components/Customer_Profile/info_card/Info_card";
import axios from "axios";
import { UserContext } from "../../../hooks/UserContext";

const Customer_QASection = () => {
    const { user } = useContext(UserContext); // Access user from context
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        if (!user || !user.id) return; // Check if user and user.id exist

        function getProblems() {
            axios.get(`http://localhost:7070/api/problems/user/${user.id}`)
                .then((res) => {
                    setProblems(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        getProblems();
    }, [user]); // Depend on user context

    return (
        <div>
            <Navbar />
            <div className={styles.master}>
                <Navigator />
                <div className={styles.profile_home}>
                    <Info_Card />
                    <div className={styles.main_card}>
                        <div className={styles.table__header}>
                            <h1>Q & A Section</h1>
                        </div>
                        <div className={styles.table_box}>
                            <main className={styles.table_container}>
                                <section className={styles.table__body}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Problem <span className="icon-arrow"></span></th>
                                                <th>Reply <span className="icon-arrow"></span></th>
                                                <th>Date <span className="icon-arrow"></span></th>
                                                <th>Status <span className="icon-arrow"></span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {problems.map((problem) => (
                                                <tr key={problem._id}>
                                                    <td>{problem.problem}</td>
                                                    <td>{problem.reply || "No reply yet"}</td> {/* Default message for empty replies */}
                                                    <td>{problem.date}</td>
                                                    <td>
                                                        {problem.status === "Pending" ? (
                                                            <p className={styles.status_pending}>{problem.status}</p>
                                                        ) : (
                                                            <p className={styles.status_solved}>{problem.status}</p>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            </main>
                        </div>
                        <div className={styles.btn_container}>
                            <a href="/customer/question/ask">+ Ask Question</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Customer_QASection;
