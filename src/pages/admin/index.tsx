import { useEffect, useState, type FormEvent } from "react";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { FiTrash } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import notificationService from "../../utils/notificationService"; 
import type { LinksProps } from "../../interfaces/LinksProps";

export function Admin() {
    const [nameInput, setNameInput] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [textColorInput, setTextColorInput] = useState("#F1F1F1");
    const [backgroundColorInput, setBackgroundColorInput] = useState("#121212");
    const [links, setLinks] = useState<LinksProps[]>([]);

    useEffect(() => {
        const linksRef = collection(db, "links");
        const queryRef = query(linksRef, orderBy("created", "asc"));

        const unsub = onSnapshot(queryRef, (snapshot) => {
            let linkList = [] as LinksProps[];

            snapshot.forEach((doc) => {
                linkList.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                });
            });

            setLinks(linkList);

        }, (error) => {
            notificationService.error("Erro ao carregar os links.");
            console.error("Erro ao carregar links:", error);
        });

        return () => {
            unsub();
        }

    }, []);
    
    function handleRegister(e: FormEvent) {
        e.preventDefault();

        if (nameInput === "" || urlInput === "") {
            notificationService.error("Preencha todos os campos!");
            return;
        }

        addDoc(collection(db, "links"), {
            name: nameInput,
            url: urlInput,
            bg: backgroundColorInput,
            color: textColorInput,
            created: new Date()
        })
            .then(() => {
                setNameInput("");
                setUrlInput("");
                notificationService.success("Link cadastrado com sucesso!");
            })
            .catch((error) => {
                notificationService.error("Erro ao cadastrar o link.");
                console.log(`Erro ao cadastrar no banco: ${error}`);
            });
    }

    async function handleDeleteLink(id: string) {
        const decRef = doc(db, "links", id);
        try {
            await deleteDoc(decRef);
            notificationService.success("Link excluído com sucesso!");
        } catch (error) {
            notificationService.error("Erro ao excluir o link.");
            console.error("Erro ao excluir link:", error);
        }
    }
    
    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2 animation-back-in-up-in-2s">
            <Header />

            <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Nome do Link</label>
                <Input
                    placeholder="Digite o nome do link..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Url do Link</label>
                <Input
                    type="url"
                    placeholder="Digite a url..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                />

                <section className="flex my-4 gap-5">
                    <div className="flex gap-2">
                        <label className="text-white font-medium mt-2 mb-2">Cor do link</label>
                        <input
                            type="color"
                            value={textColorInput}
                            onChange={(e) => setTextColorInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do link</label>
                        <input
                            type="color"
                            value={backgroundColorInput}
                            onChange={(e) => setBackgroundColorInput(e.target.value)}
                        />
                    </div>
                </section>

                <div className="flex items-center justify-start flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
                    <label className="text-white font-medium mt-2 mb-3">Veja como está ficando:</label>
                    <article
                        className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
                        style={{ marginBottom: 8, marginTop: 8, backgroundColor: backgroundColorInput }}
                    >
                        <p className="font-medium" style={{ color: textColorInput }}>Meu Link</p>
                    </article>
                </div>

                {nameInput !== "" && (
                    <div className="flex items-center justify-start flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
                        <label className="text-white font-medium mt-2 mb-3">Veja como está ficando:</label>
                        <article
                            className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
                            style={{ marginBottom: 8, marginTop: 8, backgroundColor: backgroundColorInput }}
                        >
                            <p className="font-medium" style={{ color: textColorInput }}>{nameInput}</p>
                        </article>
                    </div>
                )}

                <button 
                    type="submit" 
                    className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center transition-transform hover:scale-105 cursor-pointer">
                    Cadastrar
                </button>
            </form>

            <h2 className="font-bold text-white mb-4 text-2xl">
                Meus links
            </h2>

            {links.map((link) => (
                <article
                    key={link.id}
                    className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
                    style={{ backgroundColor: link.bg, color: link.color }}
                >
                    <p>{link.name}</p>
                    <div>
                        <button
                            className="border border-dashed p-1 rounded bg-neutral-900"
                            onClick={() => handleDeleteLink(link.id)}
                        >
                            <FiTrash size={18} color="#FFF" />
                        </button>
                    </div>
                </article>
            ))}

        </div>
    );
}