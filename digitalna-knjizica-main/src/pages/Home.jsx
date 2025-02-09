import { createSignal, onMount, Show, For } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Home() {
    const session = useAuth();
    const [books, setBooks] = createSignal([]);
    const [isAdmin, setAdmin] = createSignal(false);

    onMount(async () => {
        await loadBooks();
        const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", session().user.id)
            .single();
        if (userData?.role === "admin") setAdmin(true);
    });

    async function loadBooks() {
        if (session()) {
            const { data, error } = await supabase
                .from("books")
                .select("*, authors(count)");
            if (!error) {
                setBooks(data);
            }
        }
    }

    async function deleteBook(bookId) {
        const { error } = await supabase
            .from("books")
            .delete()
            .eq("id", bookId);
        if (error) {
            alert("Brisanje nije uspjelo.");
        } else {
            await loadBooks();
        }
    }

    return (
        <>
            <div class="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
                <div class="text-center mb-12">
                    <h1 class="text-5xl font-bold text-white shadow-lg p-4">Dobrodošli u Digitalnu knjižicu</h1>
                    <p class="text-xl text-white opacity-80">Pronađite svoje omiljene knjige i upravljajte njima</p>
                </div>

                <Show when={!session()}>
                    <div class="bg-red-500 text-white text-3xl p-6 rounded-lg shadow-md mb-8 text-center max-w-lg mx-auto">
                        Morate se prijaviti da biste vidjeli knjige!
                    </div>
                </Show>

                <Show when={session() && books()}>
                    <For each={books()} fallback={<div class="text-center text-xl">Nema dostupnih knjiga.</div>}>
                        {(item) => (
                            <div class="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl mb-6 w-80">
                                <div class="text-xl font-semibold text-white">{item.title}</div>
                                <div class="text-sm text-gray-400 line-clamp-2">{item.description}</div>
                                <div class="mt-4 flex gap-2">
                                    <a href={`/books/${item.id}`} class="bg-blue-500 text-white p-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-all duration-300">
                                        Prikaži
                                    </a>
                                    <Show when={isAdmin()}>
                                        <button 
                                            class="bg-red-500 text-white p-3 rounded-md text-sm font-medium hover:bg-red-600 transition-all duration-300"
                                            onClick={() => deleteBook(item.id)}>
                                            Briši
                                        </button>
                                    </Show>
                                </div>
                            </div>
                        )}
                    </For>
                </Show>
            </div>

            <footer class="bg-gray-800 text-white p-6 mt-12 text-center">
                <p class="text-lg">&copy; 2025 Digitalna knjižica - Sva prava pridržana</p>
            </footer>
        </>
    );
}
