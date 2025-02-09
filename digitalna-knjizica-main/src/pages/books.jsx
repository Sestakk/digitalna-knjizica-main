import { createSignal, Show } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Books() {
    const session = useAuth();
    const [success, setSuccess] = createSignal(false);

    async function formSubmit(event) {
        setSuccess(false);
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get("title");
        const author = formData.get("author");
        const user_id = session().user.id;

        const { error } = await supabase
            .from("books")
            .insert({
                title: title,
                author: author,
                user_id: user_id
            });

        if (error) {
            alert("Spremanje nije uspjelo");
        } else {
            setSuccess(true);
            event.target.reset();
        }
    }

    return (
        <div class="min-h-screen flex justify-center items-center bg-gray-900 text-white">
            <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 class="text-2xl font-bold text-center mb-6 text-gray-200">Dodaj novu knjigu</h2>

                <Show when={success()}>
                    <div class="bg-green-500 text-white p-3 rounded-md text-center mb-4">
                        Knjiga uspješno spremljena!
                    </div>
                </Show>

                <form onSubmit={formSubmit} class="flex flex-col gap-4">
                    <div class="flex flex-col">
                        <label class="text-sm font-medium text-gray-300">Naslov knjige:</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            class="px-4 py-2 mt-1 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-medium text-gray-300">Autor:</label>
                        <input 
                            type="text" 
                            name="author" 
                            required 
                            class="px-4 py-2 mt-1 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        class="mt-4 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Pošalji
                    </button>
                </form>
            </div>
        </div>
    );
}
