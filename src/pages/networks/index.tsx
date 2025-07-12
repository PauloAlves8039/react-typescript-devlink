import { useEffect, useState, type FormEvent } from "react";
import { db } from "../../services/firebaseConnection";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import notificationService from "../../utils/notificationService";

export function Networks() {
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [youtube, setYoutube] = useState("");

    useEffect(() => {
        function loadLinks() {
            const docRef = doc(db, "social", "link");

            getDoc(docRef)
                .then((snapshot) => {
                    if (snapshot.data() !== undefined) {
                        setFacebook(snapshot.data()?.facebook);
                        setInstagram(snapshot.data()?.instagram);
                        setYoutube(snapshot.data()?.youtube);
                    }
                })
                .catch((error) => {
                    notificationService.error("Erro ao carregar os links.");
                    console.error("Erro ao carregar links:", error);
                });
        }

        loadLinks();
    }, []);

    function handleRegister(e: FormEvent) {
        e.preventDefault();

        if (facebook === "" && instagram === "" && youtube === "") {
            notificationService.error("Preencha ao menos um campo para salvar!");
            return;
        }

        setDoc(doc(db, "social", "link"), {
            facebook: facebook,
            instagram: instagram,
            youtube: youtube
        })
        .then(() => {
            notificationService.success("Links cadastrados com sucesso!"); 
            clearFields();
        })
        .catch((error) => {
            notificationService.error("Erro ao salvar os links.");
            console.log(`ERRO AO SALVAR ${error}`);
        });
    }

    function clearFields() {
        setFacebook("");
        setInstagram("");
        setYoutube("");
    }

    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Link do facebook</label>
                <Input
                    type="url"
                    placeholder="Digite a url do facebook..."
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Link do Instagram</label>
                <Input
                    type="url"
                    placeholder="Digite a url do instagram..."
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Link do Yotube</label>
                <Input
                    type="url"
                    placeholder="Digite a url do youtube..."
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                />

                <button
                    type="submit"
                    className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 font-medium transition-transform hover:scale-105 cursor-pointer"
                >
                    Salvar links
                </button>
            </form>

        </div>
    );
}