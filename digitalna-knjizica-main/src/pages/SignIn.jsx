import { createSignal, Show } from "solid-js";
import { supabase } from "../services/supabase";
import { useNavigate } from "@solidjs/router";

export default function SignIn(props) {
    const [result, setResult] = createSignal(null);
    const navigate = useNavigate();

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (result.error?.code === "invalid_credentials") {
            setResult("Pogrešna e-mail adresa i/ili zaporka.");
        } else if (result.error) {
            setResult("Dogodila se greška prilikom prijave.");
        } else {
            setResult("Prijava je uspjela.");
            navigate("/Home", { replace: true });
        }
    }

    return (
        <>
            <Show when={result()}>
                <div class="bg-red-200 text-red-800 p-4 rounded shadow-md mb-4">
                    {result()}
                </div>
            </Show>
            <div class="min-h-screen bg-gray-900 flex justify-center items-center">
                <form onSubmit={formSubmit} class="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 class="text-2xl font-semibold text-center text-white mb-6">Prijavite se</h2>

                    <div class="p-2 flex flex-col gap-4">
                        <label class="text-sm font-medium text-gray-300" htmlFor="email">E-mail adresa:</label>
                        <input
                            type="email"
                            name="email"
                            required
                            id="email"
                            class="px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        />
                    </div>

                    <div class="p-2 flex flex-col gap-4">
                        <label class="text-sm font-medium text-gray-300" htmlFor="password">Zaporka:</label>
                        <input
                            type="password"
                            name="password"
                            required
                            id="password"
                            minLength="6"
                            class="px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        />
                    </div>

                    <div class="text-sm font-medium text-gray-400">
                        Nemate račun? Registrirajte se 
                        <a href="/register" class="text-blue-500 hover:underline">ovdje</a>!
                    </div>


                    <div class="p-2 flex flex-col gap-1 mt-4">
                        <input
                            type="submit"
                            value="Pošalji"
                            class="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
