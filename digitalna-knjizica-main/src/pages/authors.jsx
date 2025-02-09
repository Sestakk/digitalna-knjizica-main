import { createSignal, onMount, Show, For } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";
import { useParams } from "@solidjs/router";

export default function Authors() {
    const params = useParams();
    const session = useAuth();
    const [book, setBook] = createSignal(null);
    const [isOwner, setOwner] = createSignal(false);
    const [isAdmin, setAdmin] = createSignal(false);
    const [authors, setAuthors] = createSignal([]);
    
    onMount(async () => {
        const { data, error } = await supabase
            .from("books")
            .select()
            .eq("id", params.id);
        if (error) return;
        setBook(data[0]);
        if (session().user.id === book().user_id) setOwner(true);
        
        const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", session().user.id)
            .single();
        if (userData?.role === "admin") setAdmin(true);
        
        await loadAuthors();
    });

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const author = formData.get("author");
        const { error } = await supabase
            .from("authors")
            .insert({
                name: author,
                book_id: book().id
            });
        if (error) {
            alert("Spremanje nije uspjelo.");
        } else {
            await loadAuthors();
            event.target.reset();
        }
    }

    async function loadAuthors() {
        const { data, error } = await supabase
            .from("authors")
            .select()
            .eq("book_id", book().id);
        if (error) return;
        setAuthors(data);
    }

    async function deleteAuthor(authorId) {
        const { error } = await supabase
            .from("authors")
            .delete()
            .eq("id", authorId);
        if (error) {
            alert("Operacija nije uspjela.");
        } else {
            await loadAuthors();
        }
    }

    async function deleteBook() {
        const { error } = await supabase
            .from("books")
            .delete()
            .eq("id", book().id);
        if (error) {
            alert("Brisanje knjige nije uspjelo.");
        } else {
            window.location.href = "/books";
        }
    }

    return (
        <>
            <Show when={book()}>
                <div class="text-xl font-bold">Naslov knjige: {book().title}</div>
                <Show when={isOwner()}>
                    <div>Vi ste vlasnik knjige, možete dodavati autore.</div>
                    <form onSubmit={formSubmit}>
                        <div class="p-2 flex flex-col gap-1">
                            <label>Autor:</label>
                            <input type="text" name="author" required />
                        </div>
                        <div class="p-2 flex flex-col gap-1">
                            <input type="submit" value="Dodaj autora" class="bg-slate-600 text-white p-2 rounded" />
                        </div>
                    </form>
                </Show>
                <For each={authors()} fallback={<div>Nema autora.</div>}>
                    {(item) => <div class="flex flex-col gap-2 items-end bg-blue-400 text-white p-2 rounded mb-5">
                        <div class="place-self-start text-xl">{item.name}</div>
                        <Show when={isOwner()}>
                            <button onClick={() => deleteAuthor(item.id)} class="bg-white text-red-400 p-2 rounded text-sm">
                                Obriši autora
                            </button>
                        </Show>
                    </div>}
                </For>
                <Show when={isAdmin()}>
                    <button onClick={deleteBook} class="bg-red-600 text-white p-2 rounded mt-4">
                        Obriši knjigu
                    </button>
                </Show>
            </Show>
            <Show when={!book()}>
                <div>Knjiga ne postoji!</div>
            </Show>
        </>
    );
}
