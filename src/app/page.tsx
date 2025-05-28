import { NotesApp } from "./components/notes-app";
import { QuickInput } from "./components/quick-input";

export default function Home() {
    return (
        <>
            <QuickInput />
            <NotesApp />;
        </>
    );
}
