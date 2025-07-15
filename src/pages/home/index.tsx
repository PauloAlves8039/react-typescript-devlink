import { Social } from "../../components/Social";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { db } from "../../services/firebaseConnection";
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import type { LinksProps } from "../../interfaces/LinksProps";
import type { SocialLinksProps } from "../../interfaces/SocialLinksProps";
import { useNavigate } from "react-router-dom";

export function Home() {
    const [links, setLinks] = useState<LinksProps[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();
    const navigate = useNavigate();

    useEffect(() => {
        function loadLinks() {
            const linksRef = collection(db, "links");
            const queryRef = query(linksRef, orderBy("created", "asc"));

            getDocs(queryRef)
            .then((snapshot) => {
                let linksList = [] as LinksProps[];

                snapshot.forEach((doc) => {
                    linksList.push({
                        id: doc.id,
                        name: doc.data().name,
                        url: doc.data().url,
                        bg: doc.data().bg,
                        color: doc.data().color,
                    });
                });
                setLinks(linksList);
            });
        }
        loadLinks();
    }, []);

    useEffect(() => {
        function loadSocialLinks() {
            const docRef = doc(db, "social", "link");

            getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.data() !== undefined) {
                    setSocialLinks({
                        facebook: snapshot.data()?.facebook,
                        instagram: snapshot.data()?.instagram,
                        youtube: snapshot.data()?.youtube,
                    });
                }
            });
        }
        loadSocialLinks();
    }, []);

    function handleGoToLogin() {
        navigate("/login");
    }
    
    return (
        <div className="flex flex-col w-full py-4 items-center justify-center animation-back-in-up-in-2s">
            <h1 className="md:text-4xl  text-3xl font-bold text-white mt-20">Sujeito Programador</h1>

            <button
                onClick={handleGoToLogin}
                className="mt-4 p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-transform hover:scale-105 cursor-pointer"
            >
                Acessar Painel
            </button>

            <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

            <main className="flex flex-col w-11/12 max-w-xl text-center">
                {links.map((link) => (
                    <section
                        style={{ backgroundColor: link.bg }}
                        key={link.id}
                        className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer">
                        <a href={link.url} target="_blank">
                            <p className="text-base md:text-lg" style={{ color: link.color }}>
                                {link.name}
                            </p>
                        </a>
                    </section>
                ))}

                {socialLinks && Object.keys(socialLinks).length > 0 && (
                    <footer className="flex justify-center gap-3 my-4">
                        <Social url={socialLinks?.facebook}>
                            <FaFacebook className="social-icon" />
                        </Social>

                        <Social url={socialLinks?.youtube}>
                            <FaYoutube className="social-icon" />
                        </Social>

                        <Social url={socialLinks?.instagram}>
                            <FaInstagram className="social-icon" />
                        </Social>
                    </footer>
                )}

            </main>

        </div>
    );
}