export const LOCALSTORAGE_KEYS = {
    USERNAME: 'username',
    UNLOCKED_RELICS: 'unlockedRelics',
    TASKS: 'tasks'
}

export function getFromLocalStorage(key, initialValue) {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    } catch (error) {
        console.log(error);
        return initialValue;
    }
}

export function updateLocalStorage(key, value, setValueCallback = () => { return; }) {
    try {
        setValueCallback(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
}
