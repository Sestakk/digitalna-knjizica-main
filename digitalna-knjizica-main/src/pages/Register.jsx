import { createSignal, Show } from "solid-js";
import { supabase } from "../services/supabase";
import { useNavigate } from "@solidjs/router";

export default function Register() {
    const [result, setResult] = createSignal(null);
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");
    const navigate = useNavigate();

    async function formSubmit(event) {
        event.preventDefault();

        if (password() !== confirmPassword()) {
            setResult("Lozinke se ne podudaraju!");
            return;
        }

        const { user, error } = await supabase.auth.signUp({
            email: email(),
            password: password()
        });

        if (error) {
            setResult(error.message);
        } else {
            setResult("Registracija je uspješna! Provjerite svoj e-mail za aktivaciju.");
            setTimeout(() => navigate("/signin"), 2000); 
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
                    <h2 class="text-2xl font-semibold text-center text-white mb-6">Registrirajte se</h2>

                    <div class="p-2 flex flex-col gap-4">
                        <label class="text-sm font-medium text-gray-300" htmlFor="email">E-mail adresa:</label>
                        <input
                            type="email"
                            name="email"
                            required
                            id="email"
                            value={email()}
                            onInput={(e) => setEmail(e.target.value)}
                            class="px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        />
                    </div>

                    <div class="p-2 flex flex-col gap-4">
                        <label class="text-sm font-medium text-gray-300" htmlFor="password">Lozinka:</label>
                        <input
                            type="password"
                            name="password"
                            required
                            id="password"
                            value={password()}
                            onInput={(e) => setPassword(e.target.value)}
                            minLength="6"
                            class="px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        />
                    </div>

                    <div class="p-2 flex flex-col gap-4">
                        <label class="text-sm font-medium text-gray-300" htmlFor="confirmPassword">Potvrda lozinke:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            id="confirmPassword"
                            value={confirmPassword()}
                            onInput={(e) => setConfirmPassword(e.target.value)}
                            minLength="6"
                            class="px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                        />
                    </div>

                    <div class="p-2 flex flex-col gap-1 mt-4">
                        <input
                            type="submit"
                            value="Registriraj se"
                            class="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
